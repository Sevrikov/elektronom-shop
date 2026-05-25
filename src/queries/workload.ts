import { prisma } from '@/lib/prisma'

export async function getWorkloadCount() {
  'use cache'
  try {
    const count = await prisma.order.count({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED', 'PROCESSING']
        }
      }
    })
    return Math.min(count, 100) // Cap at 100 as requested
  } catch (error) {
    console.error('Failed to get workload count:', error)
    return 0
  }
}
