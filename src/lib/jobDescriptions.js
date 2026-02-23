/**
 * Job Descriptions Data
 *
 * Static placeholder JD data grouped by occupation slug.
 * Replace URLs and entries with real job postings when available.
 */

export const DISCORD_INVITE_URL = 'https://discord.gg/placeholder-invite'

export const JOB_DESCRIPTIONS = {
  'software-engineer': [
    {
      id: 'se-1',
      title: 'Senior Software Engineer - AI Platform',
      company: 'Stripe',
      url: 'https://example.com/job/se-1',
      aiSkills: ['Prompt Engineering', 'AI Code Review', 'LLM Integration'],
    },
    {
      id: 'se-2',
      title: 'Full Stack Developer - AI Products',
      company: 'Vercel',
      url: 'https://example.com/job/se-2',
      aiSkills: ['AI Workflow Design', 'Copilot Integration', 'RAG Systems'],
    },
    {
      id: 'se-3',
      title: 'Frontend Engineer - AI Experience',
      company: 'OpenAI',
      url: 'https://example.com/job/se-3',
      aiSkills: ['AI UX Patterns', 'Prompt Chaining', 'Model Evaluation'],
    },
    {
      id: 'se-4',
      title: 'Platform Engineer - ML Infrastructure',
      company: 'Anthropic',
      url: 'https://example.com/job/se-4',
      aiSkills: ['AI Pipeline Design', 'Agent Orchestration', 'Eval Frameworks'],
    },
    {
      id: 'se-5',
      title: 'Software Engineer - AI Agents',
      company: 'Google DeepMind',
      url: 'https://example.com/job/se-5',
      aiSkills: ['Task Decomposition', 'Tool Use', 'Multi-Agent Systems'],
    },
  ],
  'financial-analyst': [
    {
      id: 'fa-1',
      title: 'Financial Analyst - AI-Augmented Research',
      company: 'Goldman Sachs',
      url: 'https://example.com/job/fa-1',
      aiSkills: ['AI Financial Modeling', 'NLP for Earnings', 'Automated DCF'],
    },
    {
      id: 'fa-2',
      title: 'Investment Analyst - AI Strategy',
      company: 'BlackRock',
      url: 'https://example.com/job/fa-2',
      aiSkills: ['AI Market Analysis', 'Sentiment Analysis', 'Predictive Modeling'],
    },
    {
      id: 'fa-3',
      title: 'Quantitative Research Analyst',
      company: 'Citadel',
      url: 'https://example.com/job/fa-3',
      aiSkills: ['ML for Alpha', 'AI Risk Assessment', 'LLM Data Extraction'],
    },
  ],
}

/**
 * Get job descriptions for a given occupation slug.
 * Falls back to software-engineer if no match.
 */
export function getJobDescriptions(slug) {
  return JOB_DESCRIPTIONS[slug] || JOB_DESCRIPTIONS['software-engineer'] || []
}
