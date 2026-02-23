'use client'

import { createContext, useContext } from 'react'

/**
 * Clerk stub - provides mock auth for standalone development.
 * Replace with real @clerk/nextjs when ready to add auth.
 */

const MOCK_USER = {
  id: 'dev_user_001',
  firstName: 'Dev',
  lastName: 'User',
  fullName: 'Dev User',
  username: 'devuser',
  imageUrl: null,
  primaryEmailAddress: { emailAddress: 'dev@example.com' },
}

export function useUser() {
  return {
    isLoaded: true,
    isSignedIn: true,
    user: MOCK_USER,
  }
}

export function useAuth() {
  return {
    isLoaded: true,
    isSignedIn: true,
    userId: MOCK_USER.id,
  }
}

export function ClerkProvider({ children }) {
  return children
}

export function SignedIn({ children }) {
  return children
}

export function SignedOut({ children }) {
  return null
}

export function UserButton() {
  return null
}
