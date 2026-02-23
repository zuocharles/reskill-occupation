/**
 * DEV ONLY: Reset onboarding status for testing
 * DELETE /api/user/onboarding/reset
 */

import { auth } from '@clerk/nextjs/server'
import { getDB } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const runtime = 'nodejs'

export async function DELETE() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return Response.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getDB()
    if (!db) {
      return Response.json({ error: 'Database not available' }, { status: 500 })
    }

    await db
      .update(users)
      .set({
        onboardingCompletedAt: null,
        onboardingPurposes: [],
        onboardingPaths: [],
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, userId))

    return Response.json({ success: true, message: 'Onboarding reset successfully' })
  } catch (error) {
    console.error('Failed to reset onboarding:', error)
    return Response.json({ error: 'Failed to reset' }, { status: 500 })
  }
}
