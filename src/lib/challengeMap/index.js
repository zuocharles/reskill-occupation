/**
 * Challenge Map Index
 * 
 * Exports all position-specific challenge dependency configurations
 */

import * as financialAnalyst from './financial-analyst'
import * as softwareEngineer from './software-engineer'

// Map of position slugs to their configurations
export const CHALLENGE_MAPS = {
  'financial-analyst': financialAnalyst,
  'software-engineer': softwareEngineer,
}

/**
 * Get challenge map configuration for a position
 */
export function getChallengeMap(positionSlug) {
  return CHALLENGE_MAPS[positionSlug] || null
}

/**
 * Check if a position has a challenge map defined
 */
export function hasChallengMap(positionSlug) {
  return positionSlug in CHALLENGE_MAPS
}

// Re-export for convenience
export { financialAnalyst }
