/**
 * Career Paths Configuration
 * 
 * Defines the hierarchy: Industry -> Positions
 * Each position has a challenge dependency map
 */

export const CAREER_PATHS = {
  finance: {
    slug: 'finance',
    name: 'Finance',
    description: 'Financial analysis, valuation, and investment strategies',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    positions: [
      {
        slug: 'financial-analyst',
        name: 'Financial Investment Analyst',
        description: 'Analyze Investments and Build Financial Models',
        challengeCount: 22,
        comingSoon: true,
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
      },
      {
        slug: 'quantitative-analyst',
        name: 'Quantitative Analyst',
        description: 'Develop mathematical models for trading and risk management',
        challengeCount: 18,
        comingSoon: true,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      },
      {
        slug: 'risk-analyst',
        name: 'Risk Analyst',
        description: 'Identify, assess, and mitigate financial risks',
        challengeCount: 15,
        comingSoon: true,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      },
      {
        slug: 'portfolio-manager',
        name: 'Portfolio Manager',
        description: 'Manage investment portfolios and optimize asset allocation',
        challengeCount: 20,
        comingSoon: true,
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  marketing: {
    slug: 'marketing',
    name: 'Marketing',
    description: 'Strategy, growth, and go-to-market execution',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop',
    positions: [
      {
        slug: 'growth-marketer',
        name: 'Growth Marketer',
        description: 'Drive user acquisition and retention through data-driven strategies',
        challengeCount: 16,
        comingSoon: true,
        image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=800&auto=format&fit=crop',
      },
      {
        slug: 'brand-strategist',
        name: 'Brand Strategist',
        description: 'Build and manage brand identity and positioning',
        challengeCount: 14,
        comingSoon: true,
        image: 'https://images.unsplash.com/photo-1493119508027-2b584f234d6c?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  design: {
    slug: 'design',
    name: 'Design',
    description: 'UX, product design, and visual storytelling',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
    positions: [
      {
        slug: 'product-designer',
        name: 'Product Designer',
        description: 'Design user experiences and product interfaces',
        challengeCount: 18,
        comingSoon: true,
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
      },
      {
        slug: 'ux-researcher',
        name: 'UX Researcher',
        description: 'Conduct user research and usability testing',
        challengeCount: 12,
        comingSoon: true,
        image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  'web-development': {
    slug: 'web-development',
    name: 'Web Development',
    description: 'Frontend, backend, and full-stack engineering challenges',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop',
    positions: [
      {
        slug: 'software-engineer',
        name: 'Web Developer',
        description: 'Build modern web applications with frontend and backend technologies',
        challengeCount: 25,
        comingSoon: false,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
      },
      {
        slug: 'data-scientist',
        name: 'Data Scientist',
        description: 'Extract insights from data using statistical methods',
        challengeCount: 20,
        comingSoon: true,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
  'art-auction': {
    slug: 'art-auction',
    name: 'Art Auction',
    description: 'Art markets, valuation, and auction strategy',
    image: 'https://images.unsplash.com/photo-1577720643272-265f09367456?q=80&w=800&auto=format&fit=crop',
    positions: [
      {
        slug: 'art-specialist',
        name: 'Art Specialist',
        description: 'Evaluate and authenticate artworks for auction',
        challengeCount: 15,
        comingSoon: true,
        image: 'https://images.unsplash.com/photo-1577720643272-265f09367456?q=80&w=800&auto=format&fit=crop',
      },
    ],
  },
}

/**
 * Get all industries as an array
 */
export function getIndustries() {
  return Object.values(CAREER_PATHS)
}

/**
 * Get an industry by slug
 */
export function getIndustry(slug) {
  return CAREER_PATHS[slug] || null
}

/**
 * Get positions for an industry
 */
export function getPositions(industrySlug) {
  const industry = CAREER_PATHS[industrySlug]
  return industry?.positions || []
}

/**
 * Get a specific position
 */
export function getPosition(industrySlug, positionSlug) {
  const positions = getPositions(industrySlug)
  return positions.find(p => p.slug === positionSlug) || null
}
