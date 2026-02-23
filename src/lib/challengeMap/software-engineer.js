/**
 * Software Engineer - Skill Dependency Map
 * 
 * Defines the skill tree structure for Software Engineer position
 * Each skill has dependencies that must be completed first
 */

// Layer definitions
export const LAYERS = [
  { id: 'fundamentals', name: 'Fundamentals' },
  { id: 'architecture', name: 'Architecture' },
  { id: 'engineering', name: 'Engineering' },
  { id: 'specialized', name: 'Specialized' },
  { id: 'delivery', name: 'Delivery' },
]

// Challenge categories with dependencies
export const CHALLENGE_CATEGORIES = [
  // Fundamentals Layer
  {
    id: 'T-01',
    name: 'Data Structures & Algorithms',
    layer: 'fundamentals',
    dependencies: [],
    description: 'Master fundamental data structures and algorithm design',
  },
  {
    id: 'T-02',
    name: 'Programming Languages',
    layer: 'fundamentals',
    dependencies: [],
    description: 'Proficiency in at least one programming language',
  },
  {
    id: 'T-03',
    name: 'Version Control',
    layer: 'fundamentals',
    dependencies: [],
    description: 'Git workflows and collaborative development',
  },

  // Architecture Layer
  {
    id: 'T-04',
    name: 'System Design',
    layer: 'architecture',
    dependencies: ['T-01', 'T-02'],
    description: 'Design scalable software system architectures',
  },
  {
    id: 'T-05',
    name: 'Database Design',
    layer: 'architecture',
    dependencies: ['T-01'],
    description: 'Relational and NoSQL database design',
  },
  {
    id: 'T-06',
    name: 'API Design',
    layer: 'architecture',
    dependencies: ['T-02'],
    description: 'RESTful API and interface design principles',
  },
  {
    id: 'T-07',
    name: 'Microservices',
    layer: 'architecture',
    dependencies: ['T-04', 'T-06'],
    description: 'Service decomposition and governance',
  },

  // Engineering Layer
  {
    id: 'T-08',
    name: 'Testing',
    layer: 'engineering',
    dependencies: ['T-02'],
    description: 'Unit, integration, and end-to-end testing',
  },
  {
    id: 'T-09',
    name: 'CI/CD Pipeline',
    layer: 'engineering',
    dependencies: ['T-03', 'T-08'],
    description: 'Continuous integration and deployment',
  },
  {
    id: 'T-10',
    name: 'Code Review',
    layer: 'engineering',
    dependencies: ['T-03'],
    description: 'Code quality and best practices',
  },
  {
    id: 'T-11',
    name: 'Debugging & Performance',
    layer: 'engineering',
    dependencies: ['T-01', 'T-08'],
    description: 'Troubleshooting and performance optimization',
  },

  // Specialized Layer
  {
    id: 'T-12',
    name: 'Frontend Development',
    layer: 'specialized',
    dependencies: ['T-06', 'T-08'],
    description: 'Modern frontend frameworks and UI development',
    challengeIds: [81],  // Oracle HCM Redwood component challenge
  },
  {
    id: 'T-13',
    name: 'Backend Development',
    layer: 'specialized',
    dependencies: ['T-05', 'T-06', 'T-08'],
    description: 'Server-side development and business logic',
  },
  {
    id: 'T-14',
    name: 'Cloud & DevOps',
    layer: 'specialized',
    dependencies: ['T-07', 'T-09'],
    description: 'Cloud services and infrastructure automation',
  },

  // Delivery Layer
  {
    id: 'T-15',
    name: 'Technical Documentation',
    layer: 'delivery',
    dependencies: ['T-10'],
    description: 'Write clear technical and API documentation',
  },
  {
    id: 'T-16',
    name: 'Project Management',
    layer: 'delivery',
    dependencies: ['T-10', 'T-09'],
    description: 'Agile development and project coordination',
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
 * Get all dependencies for a category (direct only)
 */
export function getDependencies(categoryId) {
  const category = getCategory(categoryId)
  if (!category) return []
  return category.dependencies
}

/**
 * Get all categories that depend on this category
 */
export function getDependents(categoryId) {
  return CHALLENGE_CATEGORIES.filter(c => c.dependencies.includes(categoryId))
}

/**
 * Get all related nodes (dependencies + dependents)
 */
export function getRelatedNodes(categoryId) {
  const deps = getDependencies(categoryId)
  const dependents = getDependents(categoryId).map(c => c.id)
  return [...new Set([...deps, ...dependents])]
}
