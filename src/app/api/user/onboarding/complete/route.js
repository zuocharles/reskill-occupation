import { auth } from '@clerk/nextjs/server'
import { getDB } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const runtime = 'nodejs'

/**
 * POST /api/user/onboarding/complete
 * Marks onboarding/tutorial as completed for the current user.
 * Optionally saves user-selected purposes from onboarding.
 */
export async function POST(request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return Response.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const db = getDB()
    if (!db) {
      return Response.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      )
    }

    // Parse request body to get purposes and paths
    let purposes = []
    let paths = []
    try {
      const body = await request.json()
      purposes = body?.purposes || []
      paths = body?.paths || []
    } catch (error) {
      // If no body or invalid JSON, continue with empty array
      console.warn('No purposes data in onboarding completion:', error)
    }

    const currentUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
      columns: {
        id: true,
        onboardingCompletedAt: true
      }
    })

    if (!currentUser) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const now = new Date()
    const completedAt = currentUser.onboardingCompletedAt || now

    const [updated] = await db
      .update(users)
      .set({
        onboardingCompletedAt: completedAt,
        onboardingPurposes: purposes,
        onboardingPaths: paths,
        updatedAt: now
      })
      .where(eq(users.id, currentUser.id))
      .returning({
        onboardingCompletedAt: users.onboardingCompletedAt
      })

    return Response.json({
      success: true,
      data: { onboardingCompletedAt: updated?.onboardingCompletedAt || completedAt }
    })
  } catch (error) {
    console.error('❌ Error completing onboarding:', error)
    return Response.json(
      { success: false, error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}
