/*
 * REMOVED QUIZ STEP CODE - PRESERVED FOR FUTURE REFERENCE
 *
 * Date Removed: December 12, 2025
 * Reason: Step 3 "Quick Test" felt too direct and intrusive during onboarding.
 *         User feedback indicated preference for faster 2-step onboarding flow.
 *
 * This file preserves all code related to the AI Agent Selection Quiz that was
 * part of Step 3 in the onboarding flow. May be repurposed as an optional feature
 * in profile settings or dashboard later.
 */

// ============================================================================
// CONSTANTS
// ============================================================================

const QUIZ_QUESTIONS = [
  {
    id: 'research',
    label: 'Research',
    task: 'Write a 10-page research paper on quantum computing with citations from recent papers.',
  },
  {
    id: 'finance',
    label: 'Finance',
    task: 'Build a financial model for a SaaS company: assumptions, 3-statement projection, sensitivity analysis, and an investment summary.',
  },
  {
    id: 'design',
    label: 'Design',
    task: 'Redesign an onboarding experience to feel premium, clear, and fast—provide UX structure, UI direction, and actionable implementation notes.',
  },
]

// Real agents from Agent Library with actual logos
const AI_AGENTS = [
  { id: 'claude-code', name: 'Claude Code', avatar: '/agents-logo/Claude Code-logo.png' },
  { id: 'chatgpt', name: 'ChatGPT', avatar: '/agents-logo/ChatGPT Agent-logo.png' },
  { id: 'gemini', name: 'Gemini', avatar: '/agents-logo/Gemini-logo.png' },
  { id: 'cursor', name: 'Cursor', avatar: '/agents-logo/Cursor-logo.png' },
  { id: 'grok', name: 'Grok', avatar: '/agents-logo/Grok-logo.png' },
  { id: 'windsurf', name: 'Windsurf', avatar: '/agents-logo/Windsurf-logo.png' },
  { id: 'devin', name: 'Devin', avatar: '/agents-logo/Devin-logo.png' },
  { id: 'replit', name: 'Replit', avatar: '/agents-logo/Replit-logo.png' },
]

const QUIZ_SCENARIO = {
  question: "Which agent would you choose for this task?",
  // Mock aggregate stats (in real app, fetch from backend)
  stats: {
    'claude-code': 28,
    'chatgpt': 22,
    'gemini': 16,
    'cursor': 8,
    'grok': 10,
    'windsurf': 6,
    'devin': 5,
    'replit': 5,
  },
  insights: {
    'claude-code': "Claude Code excels at long-form writing and deep analysis",
    'chatgpt': "ChatGPT offers strong reasoning and comprehensive responses",
    'gemini': "Gemini provides fast processing with multimodal capabilities",
    'cursor': "Cursor is optimized for code but handles research too",
    'grok': "Grok brings real-time data and witty, direct responses",
    'windsurf': "Windsurf offers deep code understanding with AI flows",
    'devin': "Devin autonomously tackles complex engineering tasks",
    'replit': "Replit excels at rapid prototyping and collaborative coding",
  }
}

// ============================================================================
// STATE (From WelcomeModal component)
// ============================================================================

// Random question selection on mount:
// const [selectedQuestion] = useState(() => {
//   const randomIndex = Math.floor(Math.random() * QUIZ_QUESTIONS.length)
//   return QUIZ_QUESTIONS[randomIndex]
// })
// const [quizAnswer, setQuizAnswer] = useState([])
// const [quizPhase, setQuizPhase] = useState('quiz') // 'quiz' | 'outro'

// ============================================================================
// HANDLER FUNCTIONS
// ============================================================================

// Agent selection toggle handler:
// const selectAgent = (agentId) => {
//   setQuizAnswer((prev) => {
//     if (prev.includes(agentId)) {
//       return prev.filter((id) => id !== agentId)
//     }
//     return [...prev, agentId]
//   })
// }

// Get insight text helper:
// const getInsight = () => {
//   if (answer.length === 0) return ""
//   const insights = answer.map((id) => QUIZ_SCENARIO.insights[id]).filter(Boolean)
//   if (insights.length === 1) return insights[0]
//   return "A sophisticated strategic choice."
// }

// ============================================================================
// localStorage SAVING (From handleComplete)
// ============================================================================

// Save quiz answers to localStorage:
// const quizData = {
//   [selectedQuestion.id]: quizAnswer
// }
// localStorage.setItem('arena_quiz_answers', JSON.stringify(quizData))

// ============================================================================
// COMPONENT - AgentQuizStep
// ============================================================================

import { CheckIcon } from '@heroicons/react/24/solid'

function AgentQuizStep({
  question,
  answer,
  quizPhase,
  setQuizPhase,
  selectAgent,
  onBack,
  onComplete
}) {
  const getInsight = () => {
    if (answer.length === 0) return ""
    const insights = answer.map((id) => QUIZ_SCENARIO.insights[id]).filter(Boolean)
    if (insights.length === 1) return insights[0]
    return "A sophisticated strategic choice."
  }

  // OUTRO PHASE - Welcome message after quiz completion
  if (quizPhase === 'outro') {
    return (
      <div className="flex flex-col h-full justify-center items-center w-full text-center animate-in fade-in zoom-in duration-700">
        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5C5248] mb-4">
            Welcome to NeoHuman
          </h2>
          <p className="text-[#5C5248]/70 max-w-2xl mx-auto leading-relaxed">
            Your journey starts now. Here's what you can do next.
          </p>
        </div>

        <div className="w-full max-w-4xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Find Challenges', desc: 'Discover tasks that map to real-world job descriptions and level up your skills.' },
              { title: 'Explore AI Agents', desc: 'Browse agents and find the best fit for each workflow.' },
              { title: 'Hone AI Skills', desc: 'Use feedback and rubrics to improve your outputs over time.' },
              { title: 'Earn Rewards', desc: 'Submit qualified work and earn bounties—get recognized for excellence.' },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#FBF9F4]/85 border border-[#5C5248]/10 rounded-2xl p-6 shadow-[0_16px_40px_rgba(92,82,72,0.10)]"
              >
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#5C5248] mb-2">
                  {item.title}
                </div>
                <div className="text-[#5C5248]/70 leading-relaxed">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center">
          <button
            type="button"
            onClick={onComplete}
            className="btn-primary px-10 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-bold"
            style={{ fontFamily: 'Libre Baskerville, serif' }}
          >
            Enter the Arena
          </button>
        </div>
      </div>
    )
  }

  // QUIZ PHASE - Agent selection interface
  const canContinue = answer.length > 0

  const handleNext = () => {
    setQuizPhase('outro')
  }

  return (
    <div className="flex flex-col max-h-full overflow-y-auto items-center w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mt-4 mb-4 sm:mt-8 sm:mb-8 w-full max-w-3xl text-center">
         <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5C5248] mb-6">
            Quick Test
          </h2>

          {/* Instructional text */}
          <p className="text-lg text-[#3D3731]/80 max-w-xl mx-auto mb-8 drop-shadow-[0_1px_6px_rgba(251,249,244,0.45)]">
            Which agents would you select for this task?
          </p>

        <div className="bg-[#FBF9F4]/85 border border-[#5C5248]/10 p-6 md:p-7 rounded-2xl mx-auto max-w-3xl shadow-[0_18px_50px_rgba(92,82,72,0.12)]">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#3D3731] mb-3 drop-shadow-[0_1px_6px_rgba(251,249,244,0.5)]">
            {question?.label}
          </div>
          <p className="font-serif text-[#2A2622] text-lg md:text-xl leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(251,249,244,0.6)]">
            "{question?.task}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 sm:gap-x-10 sm:gap-y-8 mb-6 sm:mb-10 w-full max-w-4xl px-4">
        {AI_AGENTS.map((agent) => {
          const isSelected = answer.includes(agent.id)
          return (
            <button
              key={agent.id}
              type="button"
              onClick={() => selectAgent(agent.id)}
              aria-pressed={isSelected}
              className={`group relative flex flex-col items-center justify-center py-2 transition-all duration-300 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A574]/60 ${
                isSelected ? 'translate-y-0' : 'hover:-translate-y-0.5'
              }`}
            >
              <div className="relative">
                <div
                  className={`h-16 w-16 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#FBF9F4]/85 ring-2 ring-[#D4A574]/80 shadow-[0_0_0_5px_rgba(212,165,116,0.14),0_14px_36px_rgba(92,82,72,0.16)]'
                      : 'bg-[#FBF9F4]/70 ring-1 ring-[#5C5248]/12 shadow-[0_10px_28px_rgba(92,82,72,0.10)] group-hover:bg-[#FBF9F4]/85 group-hover:ring-[#5C5248]/20'
                  }`}
                >
                  {agent.avatar ? (
                    <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#5C5248]">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {isSelected && (
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#5C5248] text-[#FBF9F4] shadow-md">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                )}
              </div>

              <span
                className={`mt-3 text-[11px] font-bold uppercase tracking-[0.22em] drop-shadow-[0_1px_3px_rgba(251,249,244,0.6)] ${
                  isSelected ? 'text-[#2A2622]' : 'text-[#2A2622]'
                }`}
              >
                {agent.name}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-4 sm:gap-8 w-full pb-4">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary w-[220px] !px-10 !py-4 rounded-full text-xs uppercase tracking-[0.2em] bg-[#FBF9F4]/95 hover:bg-[#FBF9F4] border-[#5C5248]/45 text-[#2A2622] shadow-[0_16px_40px_rgba(92,82,72,0.16)] hover:shadow-[0_18px_46px_rgba(92,82,72,0.20)] outline outline-1 outline-[rgba(212,165,116,0.22)]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canContinue}
          className="btn-primary w-[220px] px-10 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-bold"
          style={{ fontFamily: 'Libre Baskerville, serif' }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// USAGE NOTES
// ============================================================================

/*
 * To reintegrate this quiz feature:
 *
 * 1. Copy constants back to WelcomeModal.js
 * 2. Add state back to WelcomeModal component
 * 3. Add selectAgent handler back
 * 4. Add quiz data saving to handleComplete
 * 5. Render AgentQuizStep when desired (e.g., optional profile page)
 * 6. Import CheckIcon from @heroicons/react/24/solid
 *
 * Alternative locations for this feature:
 * - Profile/Settings page as "Personalize Experience"
 * - Post-first-challenge prompt
 * - Optional dashboard card
 * - "Help us improve" section
 */

export { QUIZ_QUESTIONS, AI_AGENTS, QUIZ_SCENARIO, AgentQuizStep }
