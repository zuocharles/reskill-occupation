/**
 * Onboarding Data Utilities
 *
 * Provides data for the onboarding flow:
 * - Positions from CAREER_PATHS
 * - Skills from CHALLENGE_MAPS based on selected position
 * - Session persistence
 */

import { CAREER_PATHS } from './careerPaths'
import { CHALLENGE_MAPS } from './challengeMap'

/**
 * Get all positions across all industries for onboarding
 * Returns flat array with industry info attached
 */
export function getAllPositions() {
  const positions = []

  for (const [industrySlug, industry] of Object.entries(CAREER_PATHS)) {
    for (const position of industry.positions) {
      positions.push({
        id: position.slug,
        label: position.name,
        description: position.description,
        industry: industrySlug,
        industryName: industry.name,
        available: !position.comingSoon,
        challengeCount: position.challengeCount,
        image: position.image,
      })
    }
  }

  return positions
}

/**
 * Get industries for filter tabs
 */
export function getIndustryFilters() {
  return [
    { id: 'all', label: 'All' },
    ...Object.values(CAREER_PATHS).map(industry => ({
      id: industry.slug,
      label: industry.name,
    }))
  ]
}

/**
 * Get skills (challenge categories) for a position
 * Falls back to a generic skill set if no challenge map exists
 */
export function getSkillsForPosition(positionSlug) {
  const challengeMap = CHALLENGE_MAPS[positionSlug]

  if (challengeMap && challengeMap.CHALLENGE_CATEGORIES) {
    // Filter out 'excluded' layer and return skill-like data
    return challengeMap.CHALLENGE_CATEGORIES
      .filter(cat => cat.layer !== 'excluded')
      .map(cat => ({
        id: cat.id,
        label: cat.name,
        description: cat.description,
        layer: cat.layer,
      }))
  }

  // Fallback generic skills for positions without challenge maps
  return getGenericSkills(positionSlug)
}

/**
 * Get layer definitions for a position (for grouping skills)
 */
export function getLayersForPosition(positionSlug) {
  const challengeMap = CHALLENGE_MAPS[positionSlug]

  if (challengeMap && challengeMap.LAYERS) {
    return challengeMap.LAYERS.filter(layer => layer.id !== 'excluded')
  }

  return []
}

/**
 * Generic skills for positions without specific challenge maps
 */
function getGenericSkills(positionSlug) {
  const genericSkillSets = {
    'quantitative-analyst': [
      { id: 'statistical-modeling', label: 'Statistical Modeling', description: 'Build statistical models for market analysis' },
      { id: 'algorithmic-trading', label: 'Algorithmic Trading', description: 'Develop trading algorithms and strategies' },
      { id: 'risk-management', label: 'Risk Management', description: 'Quantify and manage financial risks' },
      { id: 'data-analysis', label: 'Data Analysis', description: 'Analyze large financial datasets' },
      { id: 'machine-learning', label: 'Machine Learning', description: 'Apply ML to financial problems' },
      { id: 'python-programming', label: 'Python Programming', description: 'Build quant tools in Python' },
    ],
    'risk-analyst': [
      { id: 'risk-assessment', label: 'Risk Assessment', description: 'Identify and assess financial risks' },
      { id: 'regulatory-compliance', label: 'Regulatory Compliance', description: 'Ensure compliance with regulations' },
      { id: 'stress-testing', label: 'Stress Testing', description: 'Conduct stress tests and scenario analysis' },
      { id: 'credit-risk', label: 'Credit Risk', description: 'Evaluate creditworthiness' },
      { id: 'market-risk', label: 'Market Risk', description: 'Assess market risk exposure' },
      { id: 'reporting', label: 'Risk Reporting', description: 'Create risk reports for stakeholders' },
    ],
    'portfolio-manager': [
      { id: 'asset-allocation', label: 'Asset Allocation', description: 'Optimize portfolio asset mix' },
      { id: 'performance-analysis', label: 'Performance Analysis', description: 'Analyze portfolio performance' },
      { id: 'investment-strategy', label: 'Investment Strategy', description: 'Develop investment strategies' },
      { id: 'client-management', label: 'Client Management', description: 'Manage client relationships' },
      { id: 'rebalancing', label: 'Portfolio Rebalancing', description: 'Maintain target allocations' },
      { id: 'market-research', label: 'Market Research', description: 'Research market opportunities' },
    ],
    'growth-marketer': [
      { id: 'user-acquisition', label: 'User Acquisition', description: 'Drive new user growth' },
      { id: 'retention-optimization', label: 'Retention Optimization', description: 'Improve user retention' },
      { id: 'ab-testing', label: 'A/B Testing', description: 'Run experiments to optimize conversion' },
      { id: 'analytics', label: 'Marketing Analytics', description: 'Analyze campaign performance' },
      { id: 'paid-media', label: 'Paid Media', description: 'Manage paid advertising channels' },
      { id: 'content-marketing', label: 'Content Marketing', description: 'Create growth-focused content' },
    ],
    'brand-strategist': [
      { id: 'brand-identity', label: 'Brand Identity', description: 'Define brand voice and identity' },
      { id: 'market-positioning', label: 'Market Positioning', description: 'Position brand in the market' },
      { id: 'competitive-analysis', label: 'Competitive Analysis', description: 'Analyze competitive landscape' },
      { id: 'campaign-strategy', label: 'Campaign Strategy', description: 'Develop marketing campaigns' },
      { id: 'consumer-insights', label: 'Consumer Insights', description: 'Understand target audience' },
      { id: 'brand-guidelines', label: 'Brand Guidelines', description: 'Create brand standards' },
    ],
    'product-designer': [
      { id: 'user-research', label: 'User Research', description: 'Conduct user interviews and research' },
      { id: 'wireframing', label: 'Wireframing', description: 'Create low-fidelity designs' },
      { id: 'visual-design', label: 'Visual Design', description: 'Design high-fidelity interfaces' },
      { id: 'prototyping', label: 'Prototyping', description: 'Build interactive prototypes' },
      { id: 'design-systems', label: 'Design Systems', description: 'Create and maintain design systems' },
      { id: 'usability-testing', label: 'Usability Testing', description: 'Test designs with users' },
    ],
    'ux-researcher': [
      { id: 'user-interviews', label: 'User Interviews', description: 'Conduct qualitative research' },
      { id: 'surveys', label: 'Survey Design', description: 'Design and analyze surveys' },
      { id: 'usability-studies', label: 'Usability Studies', description: 'Run usability tests' },
      { id: 'data-synthesis', label: 'Data Synthesis', description: 'Synthesize research findings' },
      { id: 'persona-development', label: 'Persona Development', description: 'Create user personas' },
      { id: 'journey-mapping', label: 'Journey Mapping', description: 'Map user journeys' },
    ],
    'data-scientist': [
      { id: 'data-wrangling', label: 'Data Wrangling', description: 'Clean and prepare datasets' },
      { id: 'machine-learning', label: 'Machine Learning', description: 'Build ML models' },
      { id: 'statistical-analysis', label: 'Statistical Analysis', description: 'Apply statistical methods' },
      { id: 'data-visualization', label: 'Data Visualization', description: 'Create data visualizations' },
      { id: 'feature-engineering', label: 'Feature Engineering', description: 'Engineer model features' },
      { id: 'model-deployment', label: 'Model Deployment', description: 'Deploy models to production' },
    ],
    'art-specialist': [
      { id: 'art-valuation', label: 'Art Valuation', description: 'Appraise artwork values' },
      { id: 'authentication', label: 'Authentication', description: 'Verify artwork authenticity' },
      { id: 'market-analysis', label: 'Market Analysis', description: 'Analyze art market trends' },
      { id: 'cataloguing', label: 'Cataloguing', description: 'Document and catalogue artworks' },
      { id: 'client-advisory', label: 'Client Advisory', description: 'Advise collectors and clients' },
      { id: 'auction-strategy', label: 'Auction Strategy', description: 'Develop auction strategies' },
    ],
  }

  return genericSkillSets[positionSlug] || []
}

// ============================================
// Session Persistence
// ============================================

const ONBOARDING_PROGRESS_KEY = 'arena_onboarding_progress'

/**
 * Get scoped storage key for a user
 */
function getStorageKey(userId) {
  return `${ONBOARDING_PROGRESS_KEY}:${userId}`
}

/**
 * Save onboarding progress to localStorage
 */
export function saveOnboardingProgress(userId, progress) {
  if (!userId) return

  const key = getStorageKey(userId)
  const data = {
    ...progress,
    updatedAt: new Date().toISOString(),
  }

  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save onboarding progress:', error)
  }
}

/**
 * Load onboarding progress from localStorage
 */
export function loadOnboardingProgress(userId) {
  if (!userId) return null

  const key = getStorageKey(userId)

  try {
    const data = localStorage.getItem(key)
    if (!data) return null

    return JSON.parse(data)
  } catch (error) {
    console.warn('Failed to load onboarding progress:', error)
    return null
  }
}

/**
 * Clear onboarding progress from localStorage
 */
export function clearOnboardingProgress(userId) {
  if (!userId) return

  const key = getStorageKey(userId)

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn('Failed to clear onboarding progress:', error)
  }
}

/**
 * Calculate which step to resume from based on saved progress
 *
 * IMPORTANT: Progress is saved when user completes a step (clicks Continue).
 * We trust the saved currentStep value, not inferences from selections,
 * because selections may have default values.
 */
export function calculateResumeStep(progress) {
  if (!progress) return 1

  const { currentStep } = progress

  // Simply return the saved step - don't infer from selections
  // The currentStep is only updated when user explicitly advances
  return currentStep || 1
}

// ============================================
// Neo titles and descriptions
// ============================================

/**
 * Get Neo title for a position
 */
export function getNeoTitle(positionSlug) {
  const position = getAllPositions().find(p => p.id === positionSlug)
  if (!position) return 'Neo Professional'

  // Remove common prefixes and add "Neo"
  const name = position.label
    .replace(/^(Senior|Junior|Lead|Staff|Principal)\s+/i, '')

  return `Neo ${name}`
}

/**
 * Get Neo description for a position
 */
export function getNeoDescription(positionSlug) {
  const descriptions = {
    'software-engineer': 'Build modern web applications where AI handles the boilerplate while you architect the vision.',
    'financial-analyst': 'AI crunches the numbers. You make the strategic calls that move markets.',
    'quantitative-analyst': 'AI processes the models. You discover the alpha that others miss.',
    'risk-analyst': 'AI monitors the data. You identify the risks before they materialize.',
    'portfolio-manager': 'AI optimizes allocations. You craft the strategy that builds wealth.',
    'growth-marketer': 'Scale your campaigns with AI. Personalization at a level never possible before.',
    'brand-strategist': 'AI analyzes trends. You build brands that resonate and endure.',
    'product-designer': 'Amplify your creativity. AI generates options, you curate excellence.',
    'ux-researcher': 'AI synthesizes data. You uncover the insights that shape products.',
    'data-scientist': 'Let AI wrangle the data while you focus on the questions that matter.',
    'art-specialist': 'AI catalogues the world. You discover the masterpieces that define eras.',
  }

  return descriptions[positionSlug] || 'Work smarter with AI as your collaborative partner.'
}
