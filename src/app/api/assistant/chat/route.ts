import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { queryAssistant } from '@/lib/assistant/claude';

// Prompt injection patterns to block
const INJECTION_PATTERNS = [
  /ignore\s+(?:all\s+)?prior\s+instructions/i,
  /system\s+prompt/i,
  /you\s+are\s+now\s+a/i,
  /developer\s+mode/i,
  /bypass\s+restrictions/i,
  /override\s+rules/i,
];

// Zod schema validation
const ChatHistoryItemSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
});

const ChatRequestBodySchema = z.object({
  message: z.string().min(1).max(800),
  history: z.array(ChatHistoryItemSchema).optional(),
  locale: z.enum(['uk', 'ru']).optional(),
  sessionId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // 1. Extract IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

    // 2. Durable DB-backed rate limiting check (limits requests to once every 2 seconds)
    const recentMessages = await prisma.assistantMessage.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 5000), // last 5 seconds
        },
      },
      take: 100,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        createdAt: true,
        structured: true,
      },
    });

    const isThrottled = recentMessages.some((msg) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const struct = msg.structured as any;
      return struct && struct.ip === ip && (Date.now() - new Date(msg.createdAt).getTime() < 2000);
    });

    if (isThrottled) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait 2 seconds between messages.' },
        { status: 429 }
      );
    }

    // 3. Validate request body
    const bodyJson = await req.json();
    const parseResult = ChatRequestBodySchema.safeParse(bodyJson);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parseResult.error.format() },
        { status: 400 }
      );
    }
    const { message, history = [], locale = 'uk', sessionId } = parseResult.data;

    // 4. Prompt Injection Filters
    const isInjectionAttempt = INJECTION_PATTERNS.some((pattern) => pattern.test(message));
    if (isInjectionAttempt) {
      return NextResponse.json(
        { error: 'Potential prompt injection attempt blocked.' },
        { status: 400 }
      );
    }

    // 5. Truncate history to max 10 items to limit tokens/costs
    const truncatedHistory = history
      .slice(-10)
      .map((item) => ({
        role: item.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: item.content,
      }));

    // 6. DB Session Resolution
    let session = null;
    if (sessionId) {
      session = await prisma.assistantSession.findUnique({
        where: { id: sessionId },
      });
    }
    if (!session) {
      session = await prisma.assistantSession.create({
        data: {},
      });
    }

    // 7. Log USER request in DB
    await prisma.assistantMessage.create({
      data: {
        sessionId: session.id,
        role: 'USER',
        content: message,
        structured: { ip, timestamp: new Date().toISOString() },
      },
    });

    // 8. Fetch AI/Fallback response
    const response = await queryAssistant(message, truncatedHistory, locale);

    // 9. Cost Logging and Token Estimation
    const historyChars = truncatedHistory.reduce((acc, curr) => acc + curr.content.length, 0);
    const inputChars = message.length + historyChars + 4000; // system prompt size approx
    const estimatedInputTokens = Math.max(100, Math.round(inputChars / 3.5));
    const estimatedOutputTokens = Math.max(20, Math.round(response.message.length / 3.5));
    // Claude 3.5 Sonnet rates: Input $3.00/M tokens, Output $15.00/M tokens
    const estimatedCostUsd = (estimatedInputTokens * 0.000003) + (estimatedOutputTokens * 0.000015);

    const costLog = {
      ip,
      inputTokens: estimatedInputTokens,
      outputTokens: estimatedOutputTokens,
      costUsd: Number(estimatedCostUsd.toFixed(6)),
      timestamp: new Date().toISOString(),
    };

    // 10. Log ASSISTANT response in DB
    await prisma.assistantMessage.create({
      data: {
        sessionId: session.id,
        role: 'ASSISTANT',
        content: response.message,
        structured: {
          products: response.products,
          draftOrder: response.draftOrder,
          orderComparison: response.orderComparison,
          warnings: response.warnings,
          sources: response.sources,
          costLog,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      },
    });

    // 11. Return response with session ID
    return NextResponse.json({
      ...response,
      sessionId: session.id,
    });
  } catch (err) {
    console.error('Assistant API route error:', err);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Не вдалося підключитися до сервісу технічного підбору. Будь ласка, спробуйте пізніше.',
      },
      { status: 500 }
    );
  }
}
