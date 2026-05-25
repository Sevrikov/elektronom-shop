export type AssistantState =
  | 'greeting'
  | 'idle'
  | 'hover'
  | 'searching'
  | 'readingDocs'
  | 'thinking'
  | 'typing'
  | 'speaking'
  | 'error';

export interface RecommendedProduct {
  id: string;
  slug: string;
  sku: string;
  name: string;
  price: number;
  comparePrice?: number | undefined;
  image?: string | undefined;
  stock: number;
  specifications: Record<string, string>;
  reason: string;
  availability: 'in_stock' | 'on_order' | 'check_needed' | 'out_of_stock';
}

export interface AssistantDraftOrderItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | undefined;
  specifications?: Record<string, string> | undefined;
}

export interface AssistantDraftOrder {
  id: string;
  status: 'draft' | 'checking' | 'ready' | 'needs_review';
  items: AssistantDraftOrderItem[];
  subtotal: number;
  discount?: number | undefined;
  tax?: number | undefined;
  total: number;
  currency: 'UAH';
  warnings?: string[] | undefined;
}

export interface AssistantOrderChange {
  type: 'add' | 'remove' | 'quantity_change' | 'replace';
  productId: string;
  sku: string;
  name: string;
  previousQty?: number | undefined;
  newQty?: number | undefined;
  previousPrice?: number | undefined;
  newPrice?: number | undefined;
}

export interface AssistantOrderComparison {
  mode: 'replace' | 'compare' | 'alternative';
  previousOrder: AssistantDraftOrder;
  proposedOrder: AssistantDraftOrder;
  changedItems: AssistantOrderChange[];
  priceDelta: number;
  technicalSummary: string;
  recommendation: 'accept' | 'reject' | 'needs_manager_review';
}

export interface AssistantSource {
  title: string;
  url?: string | undefined;
  type: 'datasheet' | 'manual' | 'catalog' | 'other';
  snippet?: string | undefined;
}

export interface AssistantResponse {
  message: string;
  questions?: string[] | undefined;
  products?: RecommendedProduct[] | undefined;
  draftOrder?: AssistantDraftOrder | undefined;
  orderComparison?: AssistantOrderComparison | undefined;
  sources?: AssistantSource[] | undefined;
  warnings?: string[] | undefined;
  availabilityCheckedAt?: string | undefined;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  structured?: AssistantResponse | undefined;
  feedback?: 'helpful' | 'unhelpful' | undefined;
  createdAt: string;
}

