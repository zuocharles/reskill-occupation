import { auth } from '@clerk/nextjs/server'

export const runtime = 'nodejs'

/**
 * GET /api/user/current
 * Stub: returns a mock user profile.
 * Replace with real DB lookup when ready.
 */
export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return Response.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  return Response.json({
    success: true,
    data: {
      id: userId,
      nickname: null,
      onboardingCompletedAt: null,
    }
  })
}
