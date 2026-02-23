/**
 * Job Descriptions Data
 *
 * Real JD data grouped by occupation slug.
 */

export const DISCORD_INVITE_URL = 'https://discord.gg/54W3H4N4jk'

export const JOB_DESCRIPTIONS = {
  'software-engineer': [
    {
      id: 'se-1',
      title: 'Software Developer L3',
      company: 'Ncontracts',
      url: 'https://to.indeed.com/aan9s2vdblg7',
      aiSkills: ['AI-Assisted Coding Tools', 'Modern Development Practices'],
    },
    {
      id: 'se-2',
      title: 'Business Applications Developer',
      company: 'Spinelli Kilcollin',
      url: 'https://to.indeed.com/aak68gvr6hjt',
      aiSkills: ['AI/Automation Tools', 'RAG-Based Solutions', 'ChatGPT Enterprise APIs'],
    },
    {
      id: 'se-3',
      title: 'Senior .NET Consultant',
      company: 'Proactive Logic Consulting',
      url: 'https://to.indeed.com/aax44dfrpns9',
      aiSkills: ['Claude Code', 'GitHub Copilot', 'LLM-Accelerated Development'],
    },
    {
      id: 'se-4',
      title: 'Director of Engineering',
      company: 'Tropical Smoothie Cafe',
      url: 'https://to.indeed.com/aalb6b426rtw',
      aiSkills: ['AI/LLM Enablement', 'AIOps', 'AI-First Product Features'],
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
