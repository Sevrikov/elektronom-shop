// src/queries/orders.ts
// Задача 1.12 — Запросы заказов (без 'use cache' — персональные данные)
// MASTER_CONTEXT v1.3

import { prisma } from "@/lib/prisma";

const ORDER_PAGE_SIZE = 10;

// ─── Заказ по номеру ──────────────────────────────────────────────────────────

export async function getOrderByNumber(number: string, userId: string) {
  return prisma.order.findUnique({
    where: { number },
    select: {
      id: true,
      number: true,
      userId: true,
      status: true,
      paymentStatus: true,
      paymentMethod: true,
      subtotal: true,
      discount: true,
      shipping: true,
      total: true,
      customerData: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      address: {
        select: {
          firstName: true,
          lastName: true,
          phone: true,
          city: true,
          street: true,
          building: true,
          apartment: true,
        },
      },
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          snapshot: true,
          product: {
            select: {
              slug: true,
              images: {
                select: { url: true, alt: true },
                orderBy: { sortOrder: "asc" },
                take: 1,
              },
            },
          },
        },
      },
    },
  }).then((order) => {
    // Проверяем принадлежность заказа пользователю
    if (!order) return null;
    if (order.userId !== userId) return null;
    return order;
  });
}

// ─── Заказы пользователя ─────────────────────────────────────────────────────

export async function getUserOrders(userId: string, page = 1) {
  const skip = (page - 1) * ORDER_PAGE_SIZE;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      select: {
        id: true,
        number: true,
        status: true,
        paymentStatus: true,
        total: true,
        createdAt: true,
        items: {
          select: {
            quantity: true,
            snapshot: true,
          },
          take: 3,
        },
      },
      orderBy: { createdAt: "desc" },
      take: ORDER_PAGE_SIZE,
      skip,
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / ORDER_PAGE_SIZE),
  };
}
