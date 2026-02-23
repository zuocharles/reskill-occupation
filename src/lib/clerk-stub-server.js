/**
 * Clerk server stub - provides mock auth() for API routes.
 * Replace with real @clerk/nextjs/server when ready to add auth.
 */

export async function auth() {
  return {
    userId: 'dev_user_001',
  }
}

export function currentUser() {
  return {
    id: 'dev_user_001',
    firstName: 'Dev',
    lastName: 'User',
  }
}
