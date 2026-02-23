'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

const LEGACY_PENDING_KEY = 'arena_pending_profile_nickname'
const scopedKey = (key, userId) => `${key}:${userId}`

export default function ProfileNicknameSync() {
  const { isLoaded, isSignedIn, user } = useUser()

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) return

    // Remove legacy key to avoid cross-account leakage.
    localStorage.removeItem(LEGACY_PENDING_KEY)

    const pendingKey = scopedKey('arena_pending_profile_nickname', user.id)
    const pendingNickname = localStorage.getItem(pendingKey)?.trim()
    if (!pendingNickname) return

    let cancelled = false

    async function syncNickname() {
      try {
        const response = await fetch('/api/user/current', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname: pendingNickname })
        })

        if (!response.ok) return
        if (cancelled) return

        localStorage.removeItem(pendingKey)
      } catch (error) {
        console.error('Failed to resync pending nickname:', error)
      }
    }

    syncNickname()

    return () => {
      cancelled = true
    }
  }, [isLoaded, isSignedIn, user?.id])

  return null
}
