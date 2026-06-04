// src/lib/email.ts
// A-7: Email confirmation (Resend) — called from createOrder AFTER transaction commit
// Does NOT throw — email failure must never abort an order.

import { env } from '@/lib/env'

export interface OrderConfirmationData {
  orderNumber: string
  customerName: string
  customerEmail: string
  locale: 'uk' | 'ru'
  total: number
  items: Array<{
    name: string
    sku: string
    quantity: number
    price: number
  }>
}

/**
 * Sends an order confirmation email via Resend.
 * Safe to call fire-and-forget — errors are logged but do not propagate.
 */
export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<void> {
  if (!env.RESEND_API_KEY) {
    // Email not configured — silently skip (acceptable in dev / staging)
    console.warn('[email] RESEND_API_KEY not set — skipping order confirmation email')
    return
  }

  const uk = data.locale !== 'ru'
  const from = env.RESEND_FROM_EMAIL ?? 'noreply@elektronom.com.ua'
  const subject = uk
    ? `Замовлення ${data.orderNumber} — підтверджено`
    : `Заказ ${data.orderNumber} — подтверждён`

  const itemsHtml = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:6px 8px;border-bottom:1px solid #eee">${item.name}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;color:#888">${item.sku}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;font-weight:600">${(item.price * item.quantity).toLocaleString('uk-UA')} ₴</td>
        </tr>`
    )
    .join('')

  const html = `
<!DOCTYPE html>
<html lang="${data.locale}">
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family:Inter,Arial,sans-serif;color:#1a1a2e;background:#f5f5f5;margin:0;padding:20px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#1e90ff;padding:24px 32px">
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800">Electronom</h1>
    </div>
    <div style="padding:32px">
      <h2 style="margin:0 0 8px;font-size:18px">
        ${uk ? `Дякуємо, ${data.customerName}!` : `Спасибо, ${data.customerName}!`}
      </h2>
      <p style="margin:0 0 24px;color:#666;font-size:14px">
        ${uk
          ? `Ваше замовлення <strong>${data.orderNumber}</strong> прийнято і буде оброблене найближчим часом.`
          : `Ваш заказ <strong>${data.orderNumber}</strong> принят и будет обработан в ближайшее время.`
        }
      </p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
        <thead>
          <tr style="background:#f8f8f8">
            <th style="padding:8px;text-align:left;color:#888;font-weight:600">${uk ? 'Товар' : 'Товар'}</th>
            <th style="padding:8px;text-align:left;color:#888;font-weight:600">SKU</th>
            <th style="padding:8px;text-align:center;color:#888;font-weight:600">${uk ? 'Кількість' : 'Кол-во'}</th>
            <th style="padding:8px;text-align:right;color:#888;font-weight:600">${uk ? 'Сума' : 'Сумма'}</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding:10px 8px;text-align:right;font-weight:700;font-size:15px">
              ${uk ? 'Разом:' : 'Итого:'}
            </td>
            <td style="padding:10px 8px;text-align:right;font-weight:800;font-size:16px;color:#1e90ff">
              ${data.total.toLocaleString('uk-UA')} ₴
            </td>
          </tr>
        </tfoot>
      </table>

      <p style="font-size:13px;color:#888;margin:0">
        ${uk
          ? 'Наш менеджер звʼяжеться з вами для підтвердження деталей доставки.'
          : 'Наш менеджер свяжется с вами для подтверждения деталей доставки.'
        }
      </p>
    </div>
    <div style="background:#f8f8f8;padding:16px 32px;font-size:12px;color:#aaa;text-align:center">
      Electronom © ${new Date().getFullYear()} · elektronom.com.ua
    </div>
  </div>
</body>
</html>`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [data.customerEmail],
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error(`[email] Resend error ${res.status}:`, body)
    } else {
      console.log(`[email] Order confirmation sent for ${data.orderNumber} to ${data.customerEmail}`)
    }
  } catch (err) {
    // A-7: NEVER propagate — email failure must not abort an order
    console.error('[email] Failed to send order confirmation:', err)
  }
}
