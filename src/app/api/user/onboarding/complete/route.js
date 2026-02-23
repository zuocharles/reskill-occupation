import { auth } from '@clerk/nextjs/server'

export const runtime = 'nodejs'

/**
 * POST /api/user/onboarding/complete
 * Stub: marks onboarding as completed.
 * Replace with real DB logic when ready.
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

    const now = new Date()

    return Response.json({
      success: true,
      data: { onboardingCompletedAt: now.toISOString() }
    })
  } catch (error) {
    console.error('Error completing onboarding:', error)
    return Response.json(
      { success: false, error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}
