import type { AssistantDraftOrder, AssistantDraftOrderItem, AssistantOrderComparison, AssistantOrderChange } from './types';

export function calculateDraftOrder(items: AssistantDraftOrderItem[]): AssistantDraftOrder {
  const subtotal = items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
  // Calculate standard 20% discount if total order is large, just as a feature helper
  const discount = 0;
  const total = subtotal;

  return {
    id: `draft_${Math.random().toString(36).substring(2, 9)}`,
    status: 'draft',
    items,
    subtotal,
    discount,
    total,
    currency: 'UAH',
  };
}

export function buildComparison(
  previousOrder: AssistantDraftOrder,
  proposedOrder: AssistantDraftOrder,
  mode: 'replace' | 'compare' | 'alternative',
  technicalSummary: string
): AssistantOrderComparison {
  const changedItems: AssistantOrderChange[] = [];

  // Find added or changed items
  for (const proposed of proposedOrder.items) {
    const prev = previousOrder.items.find((i) => i.productId === proposed.productId);
    if (!prev) {
      changedItems.push({
        type: 'add',
        productId: proposed.productId,
        sku: proposed.sku,
        name: proposed.name,
        newQty: proposed.quantity,
        newPrice: proposed.price,
      });
    } else if (prev.quantity !== proposed.quantity) {
      changedItems.push({
        type: 'quantity_change',
        productId: proposed.productId,
        sku: proposed.sku,
        name: proposed.name,
        previousQty: prev.quantity,
        newQty: proposed.quantity,
        previousPrice: prev.price,
        newPrice: proposed.price,
      });
    }
  }

  // Find removed items
  for (const prev of previousOrder.items) {
    const proposed = proposedOrder.items.find((i) => i.productId === prev.productId);
    if (!proposed) {
      changedItems.push({
        type: 'remove',
        productId: prev.productId,
        sku: prev.sku,
        name: prev.name,
        previousQty: prev.quantity,
        previousPrice: prev.price,
      });
    }
  }

  const priceDelta = proposedOrder.total - previousOrder.total;

  return {
    mode,
    previousOrder,
    proposedOrder,
    changedItems,
    priceDelta,
    technicalSummary,
    recommendation: priceDelta <= 0 ? 'accept' : 'needs_manager_review',
  };
}
