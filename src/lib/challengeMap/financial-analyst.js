/**
 * Financial Investment Analyst - Challenge Dependency Map
 * 
 * Based on O*NET career data analysis
 * 22 challenge categories organized into layers with dependencies
 */

// Layer definitions
export const LAYERS = [
  { id: 'data', name: 'Data Layer', color: '#E8F5E9', borderColor: '#4CAF50' },
  { id: 'foundation', name: 'Analysis Foundation', color: '#FFF3E0', borderColor: '#FF9800' },
  { id: 'core', name: 'Core Skills', color: '#E3F2FD', borderColor: '#2196F3' },
  { id: 'specialized', name: 'Specialized Analysis', color: '#FCE4EC', borderColor: '#E91E63' },
  { id: 'output', name: 'Output & Delivery', color: '#F3E5F5', borderColor: '#9C27B0' },
  { id: 'excluded', name: 'Excluded', color: '#FFEBEE', borderColor: '#F44336' },
]

// Challenge categories with dependencies
// Each category can contain multiple challenges from the database
export const CHALLENGE_CATEGORIES = [
  // Data Layer
  {
    id: 'T-22',
    name: 'Financial Data Processing & Cleaning',
    layer: 'data',
    dependencies: [],
    description: 'Clean, validate, and prepare financial data for analysis',
    challengeIds: [], // Will be populated with actual challenge IDs
  },

  // Analysis Foundation Layer
  {
    id: 'T-16',
    name: 'Financial Statement Analysis',
    layer: 'foundation',
    dependencies: ['T-22'],
    description: 'Analyze and interpret financial statements including balance sheets, income statements, and cash flow',
    challengeIds: [],
  },
  {
    id: 'T-03',
    name: 'Industry & Company Research',
    layer: 'foundation',
    dependencies: ['T-22'],
    description: 'Conduct comprehensive research on industries, markets, and individual companies',
    challengeIds: [],
  },
  {
    id: 'T-13',
    name: 'Economic & Macro Analysis',
    layer: 'foundation',
    dependencies: ['T-22'],
    description: 'Analyze macroeconomic trends, indicators, and their impact on investments',
    challengeIds: [],
  },

  // Core Skills Layer
  {
    id: 'T-01',
    name: 'Financial Modeling & Analysis',
    layer: 'core',
    dependencies: ['T-16', 'T-03'],
    description: 'Build and maintain financial models for valuation and forecasting',
    challengeIds: [],
  },
  {
    id: 'T-02',
    name: 'Company & Securities Valuation',
    layer: 'core',
    dependencies: ['T-16', 'T-03'],
    description: 'Value companies and securities using various methodologies (DCF, comparables, etc.)',
    challengeIds: [],
  },
  {
    id: 'T-05',
    name: 'Financial Data Analysis & Forecasting',
    layer: 'core',
    dependencies: ['T-16'],
    description: 'Analyze financial data and create forecasts for business planning',
    challengeIds: [],
  },
  {
    id: 'T-09',
    name: 'Credit Analysis & Assessment',
    layer: 'core',
    dependencies: ['T-16', 'T-13'],
    description: 'Evaluate creditworthiness and assess credit risk of borrowers',
    challengeIds: [],
  },
  {
    id: 'T-10',
    name: 'Risk Modeling & Assessment',
    layer: 'core',
    dependencies: ['T-16', 'T-13'],
    description: 'Develop and apply risk models to quantify and manage financial risks',
    challengeIds: [],
  },
  {
    id: 'T-14',
    name: 'Quantitative Strategy Development',
    layer: 'core',
    dependencies: ['T-16', 'T-13'],
    description: 'Develop quantitative trading and investment strategies',
    challengeIds: [],
  },
  {
    id: 'T-18',
    name: 'Derivatives Pricing & Analysis',
    layer: 'core',
    dependencies: ['T-16'],
    description: 'Price and analyze derivative instruments and structured products',
    challengeIds: [],
  },
  {
    id: 'T-19',
    name: 'Customer Insight Analysis',
    layer: 'core',
    dependencies: ['T-03'],
    description: 'Analyze customer data to derive actionable business insights',
    challengeIds: [],
  },

  // Specialized Analysis Layer
  {
    id: 'T-06',
    name: 'Portfolio Analysis & Monitoring',
    layer: 'specialized',
    dependencies: ['T-01', 'T-02', 'T-10'],
    description: 'Analyze portfolio performance, risk, and attribution',
    challengeIds: [],
  },
  {
    id: 'T-15',
    name: 'ESG & Sustainable Investment',
    layer: 'specialized',
    dependencies: ['T-03', 'T-02'],
    description: 'Evaluate environmental, social, and governance factors in investments',
    challengeIds: [],
  },
  {
    id: 'T-07',
    name: 'Due Diligence',
    layer: 'specialized',
    dependencies: ['T-01', 'T-02', 'T-09'],
    description: 'Conduct comprehensive due diligence for M&A and investment decisions',
    challengeIds: [],
  },
  {
    id: 'T-20',
    name: 'Real Estate Investment Analysis',
    layer: 'specialized',
    dependencies: ['T-01', 'T-05'],
    description: 'Analyze real estate investments and property valuations',
    challengeIds: [],
  },
  {
    id: 'T-11',
    name: 'Wealth Planning & Estate Analysis',
    layer: 'specialized',
    dependencies: ['T-06', 'T-09'],
    description: 'Develop wealth management and estate planning strategies',
    challengeIds: [],
  },

  // Output & Delivery Layer
  {
    id: 'T-04',
    name: 'Investment Reports & Recommendations',
    layer: 'output',
    dependencies: ['T-06', 'T-07'],
    description: 'Create investment reports and actionable recommendations',
    challengeIds: [],
  },
  {
    id: 'T-08',
    name: 'Client Presentation & Reporting',
    layer: 'output',
    dependencies: ['T-04'],
    description: 'Present findings and reports to clients and stakeholders',
    challengeIds: [],
  },
  {
    id: 'T-17',
    name: 'Data Visualization & Proposals',
    layer: 'output',
    dependencies: ['T-04'],
    description: 'Create compelling visualizations and investment proposals',
    challengeIds: [],
  },

  // Excluded (standalone skills not in main dependency chain)
  {
    id: 'T-12',
    name: 'Trade Execution & Support',
    layer: 'excluded',
    dependencies: [],
    description: 'Execute trades and provide trading support operations',
    challengeIds: [],
  },
  {
    id: 'T-21',
    name: 'Alternative Investment Oversight',
    layer: 'excluded',
    dependencies: [],
    description: 'Monitor and oversee alternative investment strategies',
    challengeIds: [],
  },
]

/**
 * Get category by ID
 */
export function getCategory(categoryId) {
  return CHALLENGE_CATEGORIES.find(c => c.id === categoryId) || null
}

/**
 * Get categories by layer
 */
export function getCategoriesByLayer(layerId) {
  return CHALLENGE_CATEGORIES.filter(c => c.layer === layerId)
}

/**
 * Get layer config by ID
 */
export function getLayer(layerId) {
  return LAYERS.find(l => l.id === layerId) || null
}

/**
 * Get all dependencies for a category (recursive)
 */
export function getAllDependencies(categoryId, visited = new Set()) {
  if (visited.has(categoryId)) return []
  visited.add(categoryId)
  
  const category = getCategory(categoryId)
  if (!category) return []
  
  const deps = [...category.dependencies]
  for (const depId of category.dependencies) {
    deps.push(...getAllDependencies(depId, visited))
  }
  
  return [...new Set(deps)]
}

/**
 * Get categories that depend on this category
 */
export function getDependents(categoryId) {
  return CHALLENGE_CATEGORIES.filter(c => c.dependencies.includes(categoryId))
}
