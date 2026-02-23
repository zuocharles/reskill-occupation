'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

// Simple confetti/fireworks effect
function Confetti({ active, onComplete }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const particles = []
    const colors = ['#8B7355', '#A08060', '#C4A77D', '#DCD6CC', '#5C5248', '#FFD700']

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 2,
        life: 1,
      })
    }

    let animationId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let allDead = true
      particles.forEach(p => {
        if (p.life <= 0) return
        allDead = false

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.3 // gravity
        p.life -= 0.02

        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      if (!allDead) {
        animationId = requestAnimationFrame(animate)
      } else {
        onComplete?.()
      }
    }

    animate()

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [active, onComplete])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      width={360}
      height={200}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 100,
      }}
    />
  )
}

// Task definitions with XP rewards
const TASKS = [
  {
    id: 'social',
    title: 'Join our community',
    xp: 200,
    isGroup: true,
    subtasks: [
      { id: 'discord', title: 'Join Discord', xp: 100, url: 'https://discord.gg/63xANneW8Y' },
      { id: 'twitter', title: 'Follow on X', xp: 100, url: 'https://x.com/_agentarena' },
    ]
  },
  {
    id: 'firstChallenge',
    title: 'Enter your first challenge',
    xp: 300,
    description: 'Join any challenge to get started',
    href: '/all-challenges',
  },
  {
    id: 'profile',
    title: 'Complete your profile',
    xp: 200,
    description: 'Add avatar and bio',
    href: '/profile',
  },
  {
    id: 'agentLibrary',
    title: 'Explore Agent Library',
    xp: 100,
    description: 'Discover AI agents',
    href: '/agent-library',
  },
  {
    id: 'leaderboard',
    title: 'Check the Leaderboard',
    xp: 100,
    description: 'See top performers',
    href: '/leaderboards',
  },
  {
    id: 'referFriend',
    title: 'Refer a Friend',
    xp: 100,
    description: 'Share your invite code',
    isAction: true, // Special task that triggers an action instead of navigation
  },
]

// Calculate total XP
const TOTAL_XP = TASKS.reduce((sum, task) => sum + task.xp, 0)

// Get encouraging message based on progress
const getMessage = (earnedXP, totalXP) => {
  const progress = earnedXP / totalXP
  if (progress === 0) return { title: 'Get started', subtitle: `Complete these tasks to earn up to ${totalXP} XP!` }
  if (progress < 0.3) return { title: 'Nice work!', subtitle: "You're off to a great start. Keep going!" }
  if (progress < 0.6) return { title: "You're on a roll!", subtitle: 'Finish the remaining tasks to earn your full newcomer bonus.' }
  if (progress < 1) return { title: 'Almost there!', subtitle: 'Just a few more tasks to complete.' }
  return { title: 'Congratulations!', subtitle: "You've completed all newcomer tasks!" }
}

export function NewcomerChecklist({
  isOpen,
  onClose,
  progress = {},
  onTaskComplete,
  userStats = {},
  onOpenInviteModal,
}) {
  const [expandedGroup, setExpandedGroup] = useState(null)
  const [animatingXP, setAnimatingXP] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [pendingCompletion, setPendingCompletion] = useState(null)
  const panelRef = useRef(null)

  // Handle page visibility change - trigger animation when user returns
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && pendingCompletion) {
        // User returned to page, trigger the animation
        const { taskId, xp } = pendingCompletion
        setPendingCompletion(null)

        // Trigger confetti and XP animation
        setShowConfetti(true)
        setAnimatingXP(taskId)

        // Complete the task
        onTaskComplete?.(taskId)

        // Clear animations after delay
        setTimeout(() => {
          setAnimatingXP(null)
        }, 1500)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [pendingCompletion, onTaskComplete])

  // Calculate completed status for each task
  const getTaskStatus = (task) => {
    if (task.isGroup) {
      const completedSubtasks = task.subtasks.filter(st => progress[st.id]).length
      return {
        completed: completedSubtasks === task.subtasks.length,
        partial: completedSubtasks > 0 && completedSubtasks < task.subtasks.length,
        completedCount: completedSubtasks,
      }
    }

    // Check based on task type
    if (task.id === 'firstChallenge') {
      return { completed: (userStats.totalChallengesEntered || 0) >= 1 }
    }
    if (task.id === 'profile') {
      return { completed: userStats.hasCompletedProfile || false }
    }

    return { completed: progress[task.id] || false }
  }

  // Calculate earned XP
  const earnedXP = TASKS.reduce((sum, task) => {
    if (task.isGroup) {
      return sum + task.subtasks.reduce((subSum, st) =>
        subSum + (progress[st.id] ? st.xp : 0), 0)
    }
    const status = getTaskStatus(task)
    return sum + (status.completed ? task.xp : 0)
  }, 0)

  const progressPercent = (earnedXP / TOTAL_XP) * 100
  const message = getMessage(earnedXP, TOTAL_XP)

  // Handle social link click
  const handleSocialClick = (subtask) => {
    if (progress[subtask.id]) return // Already completed

    // Set pending completion - will trigger when user returns to page
    setPendingCompletion({ taskId: subtask.id, xp: subtask.xp })

    // Open link in new tab
    window.open(subtask.url, '_blank')
  }

  // Handle page navigation task click
  const handlePageTask = (task) => {
    // Track the visit
    onTaskComplete?.(task.id)
  }

  // Handle action task click (like Refer a Friend)
  const handleActionTask = (task) => {
    if (progress[task.id]) return // Already completed

    // Mark task as complete
    onTaskComplete?.(task.id)

    // Trigger specific action based on task
    if (task.id === 'referFriend' && onOpenInviteModal) {
      onOpenInviteModal()
    }
  }

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose?.()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <style>{`
        .newcomer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.1);
          z-index: 200;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .newcomer-panel {
          position: fixed;
          left: 80px;
          bottom: 80px;
          width: 360px;
          max-height: 80vh;
          background: #F5EDE3;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(92,82,72,0.1);
          z-index: 210;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .newcomer-header {
          padding: 20px 20px 16px;
        }

        .newcomer-header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }

        .newcomer-title {
          font-family: 'Libre Baskerville', serif;
          font-size: 18px;
          font-weight: 700;
          color: #2D2A26;
          margin: 0;
        }

        .newcomer-close {
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: #8b7e6a;
          transition: color 0.2s;
          line-height: 1;
        }

        .newcomer-close:hover {
          color: #2D2A26;
        }

        .newcomer-subtitle {
          font-size: 13px;
          color: #78716C;
          margin: 0;
          line-height: 1.4;
        }

        .newcomer-progress-section {
          padding: 12px 20px 16px;
        }

        .newcomer-progress-bar {
          height: 6px;
          background: rgba(0,0,0,0.06);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .newcomer-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8B7355, #A08060);
          border-radius: 3px;
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .newcomer-progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #78716C;
        }

        .newcomer-progress-earned {
          font-weight: 600;
          color: #5C5248;
        }

        .newcomer-tasks {
          flex: 1;
          overflow-y: auto;
          padding: 8px 12px 16px;
        }

        .newcomer-task {
          background: #FFFCF9;
          border: 1px solid rgba(92,82,72,0.08);
          border-radius: 12px;
          margin-bottom: 8px;
          transition: all 0.2s;
        }

        .newcomer-task:hover {
          border-color: rgba(0,0,0,0.1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .newcomer-task-main {
          display: flex;
          align-items: center;
          padding: 12px 14px;
          gap: 12px;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }

        .newcomer-task-checkbox {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #DCD6CC;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .newcomer-task-checkbox.completed {
          background: #8B7355;
          border-color: #8B7355;
        }

        .newcomer-task-checkbox.partial {
          border-color: #8B7355;
          background: transparent;
        }

        .newcomer-task-checkbox svg {
          width: 12px;
          height: 12px;
          color: white;
        }

        .newcomer-task-content {
          flex: 1;
          min-width: 0;
        }

        .newcomer-task-title {
          font-size: 14px;
          font-weight: 500;
          color: #2D2A26;
          margin: 0;
          transition: all 0.2s;
        }

        .newcomer-task-title.completed {
          text-decoration: line-through;
          color: #A39D94;
        }

        .newcomer-task-desc {
          font-size: 11px;
          color: #8b7e6a;
          margin-top: 2px;
        }

        .newcomer-task-xp {
          font-size: 13px;
          font-weight: 600;
          color: #8b7e6a;
          flex-shrink: 0;
        }

        .newcomer-task-xp.earned {
          color: #8B7355;
        }

        .newcomer-task-expand {
          padding: 4px;
          color: #8b7e6a;
          transition: transform 0.2s;
        }

        .newcomer-task-expand.open {
          transform: rotate(180deg);
        }

        .newcomer-subtasks {
          padding: 0 14px 12px 46px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .newcomer-subtask {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          border-top: 1px solid rgba(0,0,0,0.04);
          cursor: pointer;
        }

        .newcomer-subtask:first-child {
          border-top: none;
        }

        .newcomer-subtask-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1.5px solid #DCD6CC;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .newcomer-subtask-checkbox.completed {
          background: #8B7355;
          border-color: #8B7355;
        }

        .newcomer-subtask-title {
          flex: 1;
          font-size: 13px;
          color: #4a4540;
        }

        .newcomer-subtask-title.completed {
          text-decoration: line-through;
          color: #A39D94;
        }

        .newcomer-subtask-xp {
          font-size: 12px;
          font-weight: 500;
          color: #a09890;
        }

        .newcomer-subtask-xp.earned {
          color: #8B7355;
        }

        @keyframes xpPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .xp-animating {
          animation: xpPop 0.3s ease;
          color: #8B7355 !important;
        }

        @media (max-width: 500px) {
          .newcomer-panel {
            left: 16px;
            right: 16px;
            bottom: 70px;
            width: auto;
          }
        }
      `}</style>

      <div className="newcomer-overlay" onClick={onClose} />

      <div className="newcomer-panel" ref={panelRef}>
        {/* Confetti Effect */}
        <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

        {/* Header */}
        <div className="newcomer-header">
          <div className="newcomer-header-top">
            <h2 className="newcomer-title">{message.title}</h2>
            <button className="newcomer-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="newcomer-subtitle">{message.subtitle}</p>
        </div>

        {/* Progress Bar */}
        <div className="newcomer-progress-section">
          <div className="newcomer-progress-bar">
            <div
              className="newcomer-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="newcomer-progress-labels">
            <span className="newcomer-progress-earned">{earnedXP} earned</span>
            <span>{TOTAL_XP} total</span>
          </div>
        </div>

        {/* Tasks */}
        <div className="newcomer-tasks">
          {TASKS.map((task) => {
            const status = getTaskStatus(task)
            const isExpanded = expandedGroup === task.id

            return (
              <div key={task.id} className="newcomer-task">
                {task.isGroup ? (
                  // Group task (expandable)
                  <>
                    <div
                      className="newcomer-task-main"
                      onClick={() => setExpandedGroup(isExpanded ? null : task.id)}
                    >
                      <div className={`newcomer-task-checkbox ${status.completed ? 'completed' : status.partial ? 'partial' : ''}`}>
                        {status.completed && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                        {status.partial && (
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8B7355' }} />
                        )}
                      </div>
                      <div className="newcomer-task-content">
                        <p className={`newcomer-task-title ${status.completed ? 'completed' : ''}`}>
                          {task.title}
                        </p>
                      </div>
                      <span className={`newcomer-task-xp ${status.completed ? 'earned' : ''}`}>
                        +{task.xp}
                      </span>
                      <span className={`newcomer-task-expand ${isExpanded ? 'open' : ''}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="newcomer-subtasks">
                        {task.subtasks.map((subtask) => {
                          const isComplete = progress[subtask.id]
                          return (
                            <div
                              key={subtask.id}
                              className="newcomer-subtask"
                              onClick={() => handleSocialClick(subtask)}
                            >
                              <div className={`newcomer-subtask-checkbox ${isComplete ? 'completed' : ''}`}>
                                {isComplete && (
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                )}
                              </div>
                              <span className={`newcomer-subtask-title ${isComplete ? 'completed' : ''}`}>
                                {subtask.title}
                              </span>
                              <span className={`newcomer-subtask-xp ${isComplete ? 'earned' : ''} ${animatingXP === subtask.id ? 'xp-animating' : ''}`}>
                                +{subtask.xp}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : task.isAction ? (
                  // Action task (triggers modal/action instead of navigation)
                  <button
                    className="newcomer-task-main"
                    onClick={() => handleActionTask(task)}
                    style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent' }}
                  >
                    <div className={`newcomer-task-checkbox ${status.completed ? 'completed' : ''}`}>
                      {status.completed && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                    <div className="newcomer-task-content">
                      <p className={`newcomer-task-title ${status.completed ? 'completed' : ''}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="newcomer-task-desc">{task.description}</p>
                      )}
                    </div>
                    <span className={`newcomer-task-xp ${status.completed ? 'earned' : ''}`}>
                      +{task.xp}
                    </span>
                  </button>
                ) : (
                  // Regular task (link)
                  <Link
                    href={task.href}
                    className="newcomer-task-main"
                    onClick={() => handlePageTask(task)}
                  >
                    <div className={`newcomer-task-checkbox ${status.completed ? 'completed' : ''}`}>
                      {status.completed && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                    <div className="newcomer-task-content">
                      <p className={`newcomer-task-title ${status.completed ? 'completed' : ''}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="newcomer-task-desc">{task.description}</p>
                      )}
                    </div>
                    <span className={`newcomer-task-xp ${status.completed ? 'earned' : ''}`}>
                      +{task.xp}
                    </span>
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

// Progress circle icon for sidebar
export function NewcomerProgressIcon({ progress = 0, size = 32, onClick, asSpan = false }) {
  const circumference = 2 * Math.PI * 12
  const offset = circumference - (progress / 100) * circumference

  const Wrapper = asSpan ? 'span' : 'button'

  return (
    <Wrapper
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'transparent',
        border: 'none',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
      title={!asSpan ? "Newcomer tasks" : undefined}
    >
      <svg width={size} height={size} viewBox="0 0 32 32">
        {/* Background circle */}
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="rgba(139, 115, 85, 0.2)"
          strokeWidth="3"
        />
        {/* Progress circle */}
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="#8B7355"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 16 16)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      {/* Percentage text - only show if size is large enough */}
      {size >= 28 && (
        <span style={{
          position: 'absolute',
          fontSize: size < 32 ? '6px' : '8px',
          fontWeight: 600,
          color: '#5C5248',
        }}>
          {Math.round(progress)}%
        </span>
      )}
    </Wrapper>
  )
}
