import { auth } from '@clerk/nextjs/server'

export const runtime = 'nodejs'

/**
 * DEV ONLY: Reset onboarding status for testing.
 * Stub: no-op without a real database.
 */
export async function DELETE() {
  if (process.env.NODE_ENV !== 'development') {
    return Response.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return Response.json({ success: true, message: 'Onboarding reset successfully' })
}
