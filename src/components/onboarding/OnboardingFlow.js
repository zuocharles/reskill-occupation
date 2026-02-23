'use client'

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import {
  getAllPositions,
  getIndustryFilters,
  saveOnboardingProgress,
  loadOnboardingProgress,
  clearOnboardingProgress,
  calculateResumeStep,
} from '@/lib/onboardingData'
import { getJobDescriptions, DISCORD_INVITE_URL } from '@/lib/jobDescriptions'

// Colors
const colors = {
  primary: '#5C4636',
  primaryLight: '#7A6350',
  dark: '#2C2416',
  text: '#4A3F35',
  textMuted: '#8C7B6B',
  border: '#E0D6C8',
  borderLight: '#EBE5DB',
  bg: '#FAF8F5',
  white: '#FDFCFA',
}

// Font
const serifFont = '"Libre Baskerville", Baskerville, "Times New Roman", serif'

// Skill Evolution data for Step 2 (ceremonial transition)
const getSkillEvolutionData = (role) => {
  const beforeSkills = [
    { label: 'Requirements', type: 'evolve', evolvesTo: 'Intent Definition' },
    { label: 'Architecture', type: 'core' },
    { label: 'Negotiation', type: 'core' },
    { label: 'Prototyping', type: 'evolve', evolvesTo: 'Rapid Prototyping' },
    { label: 'Writing Code', type: 'gone' },
    { label: 'Writing Tests', type: 'gone' },
    { label: 'Code Review', type: 'evolve', evolvesTo: 'AI Output Review' },
    { label: 'Documentation', type: 'gone' },
    { label: 'Server Config', type: 'gone' },
  ]

  const afterSkills = [
    { label: 'Intent Definition', type: 'evolve' },
    { label: 'Architecture', type: 'core' },
    { label: 'Negotiation', type: 'core' },
    { label: 'Rapid Prototyping', type: 'evolve' },
    { label: 'AI Output Review', type: 'evolve' },
    { label: 'Task Specification', type: 'new' },
    { label: 'AI Workflow Design', type: 'new' },
    { label: 'Incident Response', type: 'new' },
  ]

  const phaseMessages = [
    'Your current skill set',
    'AI is taking over some tasks',
    'Making room for what\'s next',
    'Skills evolve',
    'Your new skill set is formed',
  ]

  return { beforeSkills, afterSkills, phaseMessages }
}


// Skill Evolution Step Component - Single column animation
function SkillEvolutionStep({
  role,
  onContinue,
  onBack,
  onShowCta,
  colors,
  serifFont,
}) {
  const { beforeSkills, afterSkills } = getSkillEvolutionData(role)

  // Animation phase:
  // 0: entrance (pills appear staggered)
  // 1: marking deleted (strikethrough one by one)
  // 2: throwing deleted (throw away + collapse)
  // 3: evolve scatter wave 1
  // 4: evolve scatter wave 2 + text fade
  // 5: text swap + settle
  // 6: new skills slide in
  // 7: hold "New capabilities unlocked"
  // 8: fade list, show comparison
  const [phase, setPhase] = useState(0)
  const [titleText, setTitleText] = useState('Your current skill set as a web developer')
  const [titleFading, setTitleFading] = useState(false)
  const [showList, setShowList] = useState(true)
  const [showComparison, setShowComparison] = useState(false)
  const [entranceComplete, setEntranceComplete] = useState(false)

  const evolveSkillsList2 = beforeSkills.filter(s => s.type === 'evolve')
  const [showEvolvedText, setShowEvolvedText] = useState(false)

  const changeTitle = (newTitle) => {
    setTitleFading(true)
    setTimeout(() => {
      setTitleText(newTitle)
      setTitleFading(false)
    }, 240)
  }

  // Animation orchestration
  useEffect(() => {
    let timer

    if (phase === 0) {
      timer = setTimeout(() => {
        setEntranceComplete(true)
        setTimeout(() => setPhase(1), 960)
      }, beforeSkills.length * 80 + 320)
    } else if (phase === 1) {
      changeTitle('Some skills are being replaced by AI')
      timer = setTimeout(() => setPhase(2), 960)
    } else if (phase === 2) {
      timer = setTimeout(() => setPhase(3), 1200)
    } else if (phase === 3) {
      changeTitle('Some skills are transforming')
      timer = setTimeout(() => setPhase(4), 440)
    } else if (phase === 4) {
      timer = setTimeout(() => setPhase(5), 400)
    } else if (phase === 5) {
      setShowEvolvedText(true)
      timer = setTimeout(() => setPhase(6), 800)
    } else if (phase === 6) {
      changeTitle('New capabilities unlocked')
      timer = setTimeout(() => setPhase(7), 960)
    } else if (phase === 7) {
      timer = setTimeout(() => setPhase(8), 1600)
    } else if (phase === 8) {
      setShowList(false)
      timer = setTimeout(() => {
        changeTitle('Your new skill set is formed')
        setTimeout(() => {
          setShowComparison(true)
          onShowCta?.(true)
        }, 320)
      }, 560)
    }

    return () => clearTimeout(timer)
  }, [phase, onShowCta])

  const goneSkills = beforeSkills.filter(s => s.type === 'gone')
  const evolveSkillsList = beforeSkills.filter(s => s.type === 'evolve')
  const coreSkills = beforeSkills.filter(s => s.type === 'core')
  const newSkills = afterSkills.filter(s => s.type === 'new')

  const scatterWave1 = [
    { rot: 14, x: 45, y: -8 },
    { rot: -18, x: -40, y: 10 },
    { rot: 11, x: 32, y: -12 },
  ]
  const scatterWave2 = [
    { rot: -26, x: -55, y: 14 },
    { rot: 30, x: 60, y: -16 },
    { rot: -18, x: -38, y: 18 },
  ]

  const skillAnimationParams = useMemo(() => {
    let goneIndex = 0
    let evolveIndex = 0
    let coreIndex = 0

    return beforeSkills.map((skill) => {
      if (skill.type === 'gone') {
        const i = goneIndex++
        const goRight = i % 2 === 0
        return {
          type: 'gone',
          typeIndex: i,
          throwParams: {
            x: goRight ? 280 + Math.random() * 140 : -(280 + Math.random() * 140),
            y: 40 + Math.random() * 80,
            rot: goRight ? 25 + Math.random() * 30 : -(25 + Math.random() * 30),
          }
        }
      } else if (skill.type === 'evolve') {
        const i = evolveIndex++
        return {
          type: 'evolve',
          typeIndex: i,
          scatterParams: {
            wave1: scatterWave1[i % 3],
            wave2: scatterWave2[i % 3],
          }
        }
      } else {
        const i = coreIndex++
        return {
          type: 'core',
          typeIndex: i,
          scatterParams: {
            wave1: { rot: (Math.random() - 0.5) * 5, x: (Math.random() - 0.5) * 20 },
            wave2: { rot: (Math.random() - 0.5) * 8, x: (Math.random() - 0.5) * 28 },
          }
        }
      }
    })
  }, [beforeSkills.length])

  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      width: '100%',
      maxWidth: '960px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px',
        width: '100%',
      }}>
        <p style={{
          fontSize: '11px',
          fontWeight: '500',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          color: '#7a7e5e',
          marginBottom: '8px',
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}>
          Web Developer Evolution
        </p>
        <h1 style={{
          fontFamily: serifFont,
          fontSize: 'clamp(24px, 4vw, 34px)',
          fontWeight: '400',
          color: '#2d2a24',
          lineHeight: '1.15',
          opacity: showContent && !titleFading ? 1 : 0,
          transform: titleFading ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'opacity 0.45s ease, transform 0.45s ease',
        }}>
          {titleText}
        </h1>
      </div>

      {/* Main Pill List */}
      {!showComparison && (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        position: 'relative',
        opacity: showList ? 1 : 0,
        transition: 'opacity 0.6s ease',
        alignSelf: 'center',
      }}>
        {beforeSkills.map((skill, i) => {
          const animParams = skillAnimationParams[i]
          const isEntering = phase === 0
          const isStillEntering = isEntering && !entranceComplete

          let transform = 'none'
          let opacity = 1
          let maxHeight = '40px'
          let padding = '9px 22px'
          let marginTop = '0'
          let marginBottom = '0'
          let textOpacity = 1
          let transitionDuration = '0.7s'
          let transitionTiming = 'cubic-bezier(0.4, 0, 0.2, 1)'
          let transitionDelay = '0s'

          if (!showContent || isStillEntering) {
            opacity = showContent ? 1 : 0
            transform = !showContent ? 'translateY(16px) scale(0.97)' : 'none'
          }

          if (!showContent) {
            transitionDelay = '0s'
          } else if (isStillEntering) {
            transitionDelay = `${i * 0.08}s`
          }

          if (skill.type === 'gone') {
            const isMarked = phase >= 1
            const isThrown = phase >= 2
            const isCollapsed = phase >= 2
            const tp = animParams.throwParams

            if (isThrown) {
              transform = `translateX(${tp.x}px) translateY(${tp.y}px) rotate(${tp.rot}deg) scale(0.7)`
              opacity = 0
              transitionDuration = '0.8s'
              transitionTiming = 'cubic-bezier(0.5, 0, 0.9, 0.4)'
            }
            if (isCollapsed) {
              maxHeight = '0'
              padding = '0 22px'
              marginTop = '-4px'
              marginBottom = '-4px'
            }
            if (isMarked && phase === 1 && !isStillEntering) {
              transitionDelay = `${animParams.typeIndex * 0.25}s`
            } else if (isThrown && !isStillEntering) {
              transitionDelay = `${animParams.typeIndex * 0.18}s`
            }

            const isMarkedVisually = isMarked

            return (
              <div
                key={skill.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding,
                  maxHeight,
                  marginTop,
                  marginBottom,
                  borderRadius: '24px',
                  fontSize: '13px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  minWidth: '160px',
                  background: isMarkedVisually ? '#f2eee9' : '#eae7e1',
                  color: isMarkedVisually ? '#cbc4b8' : '#4a4538',
                  border: isMarkedVisually ? '1px solid #e8e4dc' : '1px solid #ddd9d0',
                  textDecorationLine: isMarkedVisually ? 'line-through' : 'none',
                  textDecorationColor: '#cbc4b8',
                  overflow: 'hidden',
                  opacity,
                  transform,
                  transformOrigin: 'center center',
                  transitionProperty: 'all',
                  transitionDuration,
                  transitionTimingFunction: transitionTiming,
                  transitionDelay,
                  willChange: 'transform, opacity',
                }}
              >
                {skill.label}
              </div>
            )
          }

          if (skill.type === 'evolve') {
            const isScatter1 = phase === 3
            const isScatter2 = phase === 4
            const isSettled = phase >= 5
            const showEvolveColor = phase >= 3
            const sp = animParams.scatterParams

            if (isScatter1 && !isStillEntering) {
              transform = `rotate(${sp.wave1.rot}deg) translate(${sp.wave1.x}px, ${sp.wave1.y}px)`
              transitionDuration = '0.48s'
              transitionTiming = 'cubic-bezier(0.3, 0, 0.2, 1)'
            }
            if (isScatter2 && !isStillEntering) {
              transform = `rotate(${sp.wave2.rot}deg) translate(${sp.wave2.x}px, ${sp.wave2.y}px)`
              textOpacity = 0
              transitionDuration = '0.48s'
              transitionTiming = 'cubic-bezier(0.3, 0, 0.2, 1)'
            }
            if (isSettled && !isStillEntering) {
              transform = 'rotate(0) translate(0, 0) scale(1)'
              textOpacity = 1
              transitionDuration = '0.56s'
              transitionTiming = 'cubic-bezier(0.2, 0.8, 0.2, 1)'
            }

            const showHighlight = phase === 5
            const displayText = showEvolvedText ? skill.evolvesTo : skill.label

            return (
              <div
                key={skill.label}
                className={showHighlight ? 'skill-highlight-sweep' : ''}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '9px 22px',
                  borderRadius: '24px',
                  fontSize: '13px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  minWidth: '160px',
                  background: showEvolveColor ? '#ddd8cf' : '#eae7e1',
                  color: showEvolveColor ? '#3e3a30' : '#4a4538',
                  border: showEvolveColor ? '1px solid #c8c2b6' : '1px solid #ddd9d0',
                  overflow: 'hidden',
                  opacity,
                  transform,
                  transformOrigin: 'center center',
                  transitionProperty: 'all',
                  transitionDuration,
                  transitionTimingFunction: transitionTiming,
                  transitionDelay,
                  willChange: 'transform, opacity',
                }}
              >
                <span style={{
                  opacity: textOpacity,
                  transitionProperty: 'opacity',
                  transitionDuration: '0.35s',
                }}>
                  {displayText}
                </span>
              </div>
            )
          }

          if (skill.type === 'core') {
            const isScatter1 = phase === 3
            const isScatter2 = phase === 4
            const isSettled = phase >= 5
            const showCoreColor = phase >= 3
            const sp = animParams.scatterParams

            if (isScatter1 && !isStillEntering) {
              transform = `rotate(${sp.wave1.rot}deg) translateX(${sp.wave1.x}px)`
              transitionDuration = '0.4s'
              transitionTiming = 'ease'
            }
            if (isScatter2 && !isStillEntering) {
              transform = `rotate(${sp.wave2.rot}deg) translateX(${sp.wave2.x}px)`
              transitionDuration = '0.4s'
              transitionTiming = 'ease'
            }
            if (isSettled && !isStillEntering) {
              transform = 'rotate(0) translate(0, 0) scale(1)'
              transitionDuration = '0.48s'
              transitionTiming = 'cubic-bezier(0.2, 0.8, 0.2, 1)'
            }

            return (
              <div
                key={skill.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '9px 22px',
                  borderRadius: '24px',
                  fontSize: '13px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  minWidth: '160px',
                  background: showCoreColor ? '#e4dfd7' : '#eae7e1',
                  color: '#4a4538',
                  border: showCoreColor ? '1px solid #d0cbc0' : '1px solid #ddd9d0',
                  overflow: 'hidden',
                  opacity,
                  transform,
                  transformOrigin: 'center center',
                  transitionProperty: 'all',
                  transitionDuration,
                  transitionTimingFunction: transitionTiming,
                  transitionDelay,
                  willChange: 'transform, opacity',
                }}
              >
                {skill.label}
              </div>
            )
          }

          return null
        })}

        {/* New Skills - appear at phase 6 */}
        {newSkills.map((skill, i) => {
          const shouldShow = phase >= 6

          return (
            <div
              key={skill.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '9px 22px',
                borderRadius: '24px',
                fontSize: '13px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                minWidth: '160px',
                background: '#dfe8d4',
                color: '#5a6b45',
                border: '1px solid #c4d4b2',
                overflow: 'hidden',
                opacity: shouldShow ? 1 : 0,
                transform: shouldShow ? 'translateX(0) scale(1)' : 'translateX(60px) scale(0.9)',
                transformOrigin: 'center center',
                transitionProperty: 'all',
                transitionDuration: '0.56s',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                transitionDelay: shouldShow ? `${i * 0.2}s` : '0s',
                willChange: 'transform, opacity',
              }}
            >
              {skill.label}
            </div>
          )
        })}
      </div>
      )}

      {/* Comparison View - appears at phase 8 */}
      {showComparison && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0',
          width: '100%',
          maxWidth: '680px',
          opacity: 1,
          transform: 'translateY(0)',
          animation: 'fadeInUp 0.56s ease',
        }}>
          {/* Before Column */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            flex: '1 1 40%',
            minWidth: 0,
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#b0a99c',
              marginBottom: '4px',
            }}>
              Before
            </div>
            {beforeSkills.map((skill, i) => {
              const isGone = skill.type === 'gone'
              const isEvolve = skill.type === 'evolve'

              let bg, color, border, textDeco
              if (isGone) {
                bg = '#f0ece6'
                color = '#c4bdb2'
                border = '#e8e4dc'
                textDeco = 'line-through'
              } else if (isEvolve) {
                bg = '#eae7e1'
                color = '#9a9488'
                border = '#ddd9d0'
                textDeco = 'none'
              } else {
                bg = '#e4dfd7'
                color = '#4a4538'
                border = '#d0cbc0'
                textDeco = 'none'
              }

              return (
                <div
                  key={skill.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '7px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    background: bg,
                    color: color,
                    border: `1px solid ${border}`,
                    textDecoration: textDeco,
                    textDecorationColor: color,
                    opacity: 0,
                    transform: 'translateY(6px)',
                    animation: `fadeInUp 0.4s ease ${i * 0.064}s forwards`,
                  }}
                >
                  {skill.label}
                </div>
              )
            })}
          </div>

          {/* Arrow */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 auto',
            padding: '28px 8px 0',
          }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 28 28"
              fill="none"
              style={{
                opacity: 0,
                transform: 'scaleX(0)',
                animation: 'scaleIn 0.48s cubic-bezier(0.34, 1.56, 0.64, 1) 0.56s forwards',
              }}
            >
              <path
                d="M4 14h18M16 7l7 7-7 7"
                stroke="#b0a99c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* After Column */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            flex: '1 1 40%',
            minWidth: 0,
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#5a6b45',
              marginBottom: '4px',
            }}>
              After
            </div>
            {afterSkills.map((skill, i) => {
              const isEvolve = skill.type === 'evolve'
              const isCore = skill.type === 'core'

              let bg, color, border
              if (isEvolve) {
                bg = '#ddd8cf'
                color = '#3e3a30'
                border = '#c8c2b6'
              } else if (isCore) {
                bg = '#e4dfd7'
                color = '#4a4538'
                border = '#d0cbc0'
              } else {
                bg = '#dfe8d4'
                color = '#5a6b45'
                border = '#c4d4b2'
              }

              return (
                <div
                  key={skill.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '7px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    background: bg,
                    color: color,
                    border: `1px solid ${border}`,
                    opacity: 0,
                    transform: 'translateY(6px)',
                    animation: `fadeInUp 0.4s ease ${0.64 + i * 0.064}s forwards`,
                  }}
                >
                  {skill.label}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* CSS Keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scaleX(0);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }
        @keyframes highlightSweep {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .skill-highlight-sweep {
          position: relative;
        }
        .skill-highlight-sweep::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 45%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0.4) 55%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: highlightSweep 0.8s ease-out forwards;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}


function LoadingScreen({ isFadingOut = false, onComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const progressSteps = [15, 35, 55, 75, 90, 100]
    let currentStep = 0

    const advanceProgress = () => {
      if (currentStep >= progressSteps.length) return
      const nextTime = Math.random() * 200 + 150
      setTimeout(() => {
        setProgress(progressSteps[currentStep])
        currentStep++
        if (currentStep < progressSteps.length) {
          advanceProgress()
        } else {
          setTimeout(() => { onComplete?.() }, 300)
        }
      }, nextTime)
    }

    const timer = setTimeout(advanceProgress, 200)
    return () => clearTimeout(timer)
  }, [onComplete])

  const keyframesStyle = `
    @keyframes loadingFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes loadingRotate {
      0% { transform: rotateX(-15deg) rotateY(0deg); }
      100% { transform: rotateX(-15deg) rotateY(360deg); }
    }
  `

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: `radial-gradient(circle at center, ${colors.bg} 0%, #F0EBE3 100%)`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: isFadingOut ? 0 : 1,
      transition: 'opacity 0.7s ease-out',
      overflow: 'hidden',
      cursor: 'wait',
      position: 'relative',
    }}>
      <style>{keyframesStyle}</style>

      {/* Noise Overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        opacity: 0.04, pointerEvents: 'none', zIndex: 10,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      }} />

      <div style={{
        width: '100%', maxWidth: '800px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative', zIndex: 2,
      }}>
        {/* Wireframe Cube */}
        <div style={{
          width: '120px', height: '120px', marginBottom: '2rem',
          position: 'relative', transformStyle: 'preserve-3d',
          animation: 'loadingRotate 10s linear infinite', opacity: 0.8,
        }}>
          {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face) => {
            const transforms = {
              front: 'translateZ(60px)', back: 'rotateY(180deg) translateZ(60px)',
              right: 'rotateY(90deg) translateZ(60px)', left: 'rotateY(-90deg) translateZ(60px)',
              top: 'rotateX(90deg) translateZ(60px)', bottom: 'rotateX(-90deg) translateZ(60px)',
            }
            return (
              <div key={face} style={{
                position: 'absolute', width: '120px', height: '120px',
                border: `1px solid ${colors.borderLight}`,
                background: 'rgba(251, 249, 244, 0.02)',
                transform: transforms[face],
              }} />
            )
          })}
        </div>

        {/* Status Text */}
        <div style={{
          fontFamily: serifFont, fontSize: '1rem', fontStyle: 'italic',
          color: colors.textMuted, marginBottom: '2rem',
          opacity: 0, animation: 'loadingFadeIn 1s ease 0.5s forwards',
          letterSpacing: '0.02em',
        }}>
          Preparing your reskill journey
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '320px', height: '4px', background: colors.borderLight,
          borderRadius: 0, position: 'relative', overflow: 'hidden',
          opacity: 0, animation: 'loadingFadeIn 1s ease 0.8s forwards',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${progress}%`, background: colors.primary,
            transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          }} />
        </div>
      </div>
    </div>
  )
}

export default function OnboardingFlow() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [dataReady, setDataReady] = useState(false)
  const [progressComplete, setProgressComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isVisible, setIsVisible] = useState(true)
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false)
  const [isButtonPressed, setIsButtonPressed] = useState(false)
  const [showEvolutionCta, setShowEvolutionCta] = useState(false)

  // Form state
  const [selectedRole, setSelectedRole] = useState('software-engineer')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [lastWheelTime, setLastWheelTime] = useState(0)

  const lastSavedStepRef = useRef(null)

  // Get dynamic data
  const positions = useMemo(() => getAllPositions(), [])
  const industryFilters = useMemo(() => getIndustryFilters(), [])
  const jobDescriptions = useMemo(() => getJobDescriptions(selectedRole), [selectedRole])

  // Save progress whenever key state changes
  const saveProgress = useCallback(() => {
    if (!user?.id || isBootstrapping) return
    saveOnboardingProgress(user.id, {
      currentStep,
      selectedRole,
    })
  }, [user?.id, isBootstrapping, currentStep, selectedRole])

  // Save progress when step changes
  useEffect(() => {
    if (!hasRestoredProgress) return
    if (lastSavedStepRef.current === currentStep) return
    lastSavedStepRef.current = currentStep
    saveProgress()
  }, [currentStep, hasRestoredProgress, saveProgress])

  // Bootstrap - check if user already completed onboarding and restore progress
  useEffect(() => {
    if (!isLoaded || !user?.id) return
    let cancelled = false

    async function bootstrap() {
      try {
        const response = await fetch('/api/user/current', { cache: 'no-store' })
        const payload = await response.json().catch(() => null)

        if (!response.ok || !payload?.success) {
          throw new Error(payload?.error || `Failed to load profile (${response.status})`)
        }

        const dbUser = payload.data || {}
        if (cancelled) return

        if (dbUser?.onboardingCompletedAt) {
          router.replace('/home')
          return
        }

        // Restore saved progress from localStorage
        const savedProgress = loadOnboardingProgress(user.id)
        if (savedProgress) {
          const resumeStep = calculateResumeStep(savedProgress)
          if (savedProgress.selectedRole) {
            setSelectedRole(savedProgress.selectedRole)
          }
          setCurrentStep(Math.min(resumeStep, 4))
        }

        if (!cancelled) setDataReady(true)
      } catch (error) {
        console.error('Failed to bootstrap onboarding:', error)
        if (!cancelled) setDataReady(true)
      }
    }

    bootstrap()
    return () => { cancelled = true }
  }, [isLoaded, router, user?.id])

  // Handle fade out when both data is ready AND progress bar is complete
  useEffect(() => {
    if (dataReady && progressComplete && isBootstrapping) {
      setIsFadingOut(true)
      const timer = setTimeout(() => {
        setIsBootstrapping(false)
        setHasRestoredProgress(true)
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [dataReady, progressComplete, isBootstrapping])

  const goToNext = () => {
    if (currentStep === 1) {
      // Ceremonial transition from Step 1 to Step 2 (Skill Evolution)
      setIsButtonPressed(true)
      setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          setCurrentStep(2)
          setIsButtonPressed(false)
          setTimeout(() => setIsVisible(true), 150)
        }, 500)
      }, 300)
    } else {
      // Normal transition for other steps
      setIsVisible(false)
      setTimeout(() => {
        setCurrentStep(prev => Math.min(prev + 1, 4))
        setTimeout(() => setIsVisible(true), 50)
      }, 300)
    }
  }

  const goToPrevious = () => {
    setIsVisible(false)
    setTimeout(() => {
      if (currentStep === 2) {
        setCurrentStep(1)
      } else if (currentStep === 3) {
        // From JD cards, skip ceremony, go back to role selection
        setCurrentStep(1)
      } else if (currentStep === 4) {
        setCurrentStep(3)
      }
      setTimeout(() => setIsVisible(true), 50)
    }, 300)
  }

  const canContinue = () => {
    if (currentStep === 1) {
      const position = positions.find(p => p.id === selectedRole)
      return position && position.available
    }
    // Step 2 (Skill Evolution) has its own CTA button
    if (currentStep === 3) return true
    return false
  }

  // Get filtered positions based on selected industry filter
  const getFilteredPositions = () => {
    if (selectedFilter === 'all') return positions
    return positions.filter(p => p.industry === selectedFilter)
  }

  const handleRoleChange = useCallback((newRole) => {
    if (newRole !== selectedRole) {
      setSelectedRole(newRole)
    }
  }, [selectedRole])

  // Handle final completion
  const handleComplete = async () => {
    if (!user?.id) return

    try {
      const response = await fetch('/api/user/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole })
      })
      const payload = await response.json().catch(() => null)

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || `Failed to complete onboarding (${response.status})`)
      }
    } catch (error) {
      console.error('Failed to mark onboarding complete:', error)
    }

    clearOnboardingProgress(user.id)
    router.replace('/home')
  }

  if (!isLoaded) return <LoadingScreen />
  if (isBootstrapping) return <LoadingScreen isFadingOut={isFadingOut} onComplete={() => setProgressComplete(true)} />

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: serifFont,
      position: 'relative',
    }}>

      {/* Header */}
      <header style={{
        padding: '24px 24px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0',
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{
          width: '100%',
          marginBottom: '16px',
        }}>
          <span style={{
            fontSize: '20px',
            fontWeight: '600',
            fontFamily: serifFont,
            color: colors.dark,
            letterSpacing: '0.5px',
          }}>
            Reskill or Upskill
          </span>
        </div>

        {/* Progress dots + step label - hidden during skill evolution (step 2) */}
        {currentStep !== 2 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {/* Map internal steps to display: 1→1, 3→2, 4→3 (skip step 2 which is ceremony) */}
            {(() => {
              const displayStep = currentStep === 1 ? 1 : currentStep === 3 ? 2 : 3
              const totalSteps = 3
              return (
                <>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        style={{
                          width: step === displayStep ? '20px' : '5px',
                          height: '5px',
                          borderRadius: '2.5px',
                          background: step <= displayStep ? colors.primary : colors.border,
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: colors.textMuted,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                  }}>
                    {displayStep === totalSteps ? 'Final Step' : `Step ${displayStep} of ${totalSteps}`}
                  </div>
                </>
              )
            })()}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: currentStep === 2 ? '4vh' : '16px',
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingBottom: '48px',
        overflow: 'auto',
      }}>

        <div style={{
          maxWidth: currentStep === 2 ? '900px' : 'min(600px, 90vw)',
          width: '100%',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : (currentStep === 2 ? 'translateY(24px)' : 'translateY(16px)'),
          transition: currentStep === 2
            ? 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
            : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>

          {/* Step 1: Role Selection - Carousel */}
          {currentStep === 1 && (
            <div style={{ textAlign: 'center' }}>
              <h1 style={{
                fontFamily: serifFont,
                fontSize: '36px',
                fontWeight: '400',
                color: colors.dark,
                marginBottom: '12px',
                letterSpacing: '-0.3px',
                lineHeight: '1.2',
              }}>
                See how AI is reshaping my role as a...
              </h1>

              <p style={{
                fontSize: '15px',
                color: colors.textMuted,
                marginBottom: '32px',
              }}>
                Pick your role to see what skills are being reskilled or upskilled.
              </p>

              {/* Industry Filter */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '40px',
                flexWrap: 'wrap',
              }}>
                {industryFilters.map(filter => {
                  const isActive = (selectedFilter || 'all') === filter.id
                  return (
                    <button
                      key={filter.id}
                      onClick={() => {
                        setSelectedFilter(filter.id)
                        if (filter.id === 'all') {
                          setSelectedRole('software-engineer')
                        }
                      }}
                      style={{
                        padding: '6px 16px',
                        fontSize: '12px',
                        fontWeight: '500',
                        fontFamily: serifFont,
                        color: isActive ? colors.dark : colors.textMuted,
                        background: isActive ? '#FFFFFF' : 'transparent',
                        border: isActive ? `1px solid ${colors.borderLight}` : '1px solid transparent',
                        borderRadius: '100px',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      {filter.label}
                    </button>
                  )
                })}
              </div>

              {/* Carousel */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '24px',
                }}
                onWheel={(e) => {
                  const now = Date.now()
                  if (now - lastWheelTime < 300) return

                  if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 30) {
                    e.preventDefault()
                    setLastWheelTime(now)
                    const filteredPositions = getFilteredPositions()
                    const currentIndex = filteredPositions.findIndex(r => r.id === selectedRole)
                    if (e.deltaX > 0) {
                      const nextIndex = (currentIndex + 1) % filteredPositions.length
                      handleRoleChange(filteredPositions[nextIndex].id)
                    } else {
                      const prevIndex = (currentIndex - 1 + filteredPositions.length) % filteredPositions.length
                      handleRoleChange(filteredPositions[prevIndex].id)
                    }
                  }
                }}
              >
                {/* Left Arrow */}
                <button
                  onClick={() => {
                    const filteredPositions = getFilteredPositions()
                    const currentIndex = filteredPositions.findIndex(r => r.id === selectedRole)
                    const prevIndex = (currentIndex - 1 + filteredPositions.length) % filteredPositions.length
                    handleRoleChange(filteredPositions[prevIndex].id)
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontFamily: serifFont,
                    color: colors.text,
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    zIndex: 20,
                  }}
                >
                  &#8249;
                </button>

                {/* Carousel Track */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '520px',
                  height: '140px',
                  position: 'relative',
                }}>
                  {(() => {
                    const filteredPositions = getFilteredPositions()
                    const currentIndex = filteredPositions.findIndex(r => r.id === selectedRole)
                    const validIndex = currentIndex >= 0 ? currentIndex : 0

                    if (currentIndex < 0 && filteredPositions.length > 0) {
                      setTimeout(() => handleRoleChange(filteredPositions[0].id), 0)
                    }

                    return filteredPositions.map((role, index) => {
                      let offset = index - validIndex
                      const halfLength = filteredPositions.length / 2
                      if (offset > halfLength) offset -= filteredPositions.length
                      if (offset < -halfLength) offset += filteredPositions.length

                      const isVisibleInCarousel = Math.abs(offset) <= 2
                      if (!isVisibleInCarousel) return null

                      const isCenter = offset === 0
                      const translateX = offset * 150
                      const scale = isCenter ? 1 : Math.abs(offset) === 1 ? 0.8 : 0.6
                      const opacity = isCenter ? 1 : Math.abs(offset) === 1 ? 0.5 : 0.25
                      const zIndex = 10 - Math.abs(offset)
                      const isComingSoon = !role.available

                      return (
                        <div
                          key={role.id}
                          onClick={() => handleRoleChange(role.id)}
                          style={{
                            position: 'absolute',
                            left: '50%',
                            transform: `translateX(calc(-50% + ${translateX}px)) scale(${scale})`,
                            opacity,
                            zIndex,
                            padding: '22px 36px',
                            minWidth: '160px',
                            fontSize: '15px',
                            fontWeight: '500',
                            fontFamily: serifFont,
                            color: isComingSoon ? '#A0A0A0' : colors.dark,
                            background: isComingSoon
                              ? '#E8E8E8'
                              : (isCenter ? '#FFFFFF' : '#F0EBE3'),
                            border: isComingSoon
                              ? '1px solid #D0D0D0'
                              : (isCenter ? '2px solid #C4956A' : `1px solid ${colors.borderLight}`),
                            borderRadius: '14px',
                            cursor: isComingSoon ? 'default' : 'pointer',
                            transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease',
                            textAlign: 'center',
                            boxShadow: isCenter && !isComingSoon
                              ? '0 0 0 3px rgba(196, 149, 106, 0.12), 0 12px 32px -8px rgba(196, 149, 106, 0.25)'
                              : 'none',
                            userSelect: 'none',
                          }}
                        >
                          {role.label}
                          {isComingSoon && isCenter && (
                            <div style={{
                              fontSize: '10px',
                              color: '#A0A0A0',
                              marginTop: '4px',
                              fontWeight: '500',
                            }}>
                              Coming Soon
                            </div>
                          )}
                        </div>
                      )
                    })
                  })()}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() => {
                    const filteredPositions = getFilteredPositions()
                    const currentIndex = filteredPositions.findIndex(r => r.id === selectedRole)
                    const nextIndex = (currentIndex + 1) % filteredPositions.length
                    handleRoleChange(filteredPositions[nextIndex].id)
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#FFFFFF',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontFamily: serifFont,
                    color: colors.text,
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    zIndex: 20,
                  }}
                >
                  &#8250;
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Skill Evolution (ceremonial transition) */}
          {currentStep === 2 && (
            <SkillEvolutionStep
              role={selectedRole}
              onContinue={goToNext}
              onBack={goToPrevious}
              onShowCta={setShowEvolutionCta}
              colors={colors}
              serifFont={serifFont}
            />
          )}

          {/* Step 3: AI Job Descriptions */}
          {currentStep === 3 && (
            <div>
              <h1 style={{
                fontFamily: serifFont,
                fontSize: '36px',
                fontWeight: '400',
                color: colors.dark,
                marginBottom: '12px',
                letterSpacing: '-0.3px',
                lineHeight: '1.2',
                textAlign: 'center',
              }}>
                Companies are already hiring for AI skills
              </h1>

              <p style={{
                fontSize: '15px',
                color: colors.textMuted,
                marginBottom: '32px',
                textAlign: 'center',
              }}>
                These roles in your field are asking for AI-related skills right now.
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                {jobDescriptions.map((jd) => (
                  <div
                    key={jd.id}
                    style={{
                      background: colors.white,
                      border: `1px solid ${colors.borderLight}`,
                      borderRadius: '14px',
                      padding: '20px 24px',
                      transition: 'box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                  >
                    {/* Company */}
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: colors.textMuted,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}>
                      {jd.company}
                    </div>

                    {/* Job Title */}
                    <div style={{
                      fontFamily: serifFont,
                      fontSize: '17px',
                      fontWeight: '400',
                      color: colors.dark,
                      marginBottom: '14px',
                    }}>
                      {jd.title}
                    </div>

                    {/* AI Skill Pills */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '14px',
                    }}>
                      {jd.aiSkills.map((skill) => (
                        <span
                          key={skill}
                          style={{
                            display: 'inline-block',
                            padding: '5px 12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#5A6B45',
                            background: '#DFE8D4',
                            border: '1px solid #C4D4B2',
                            borderRadius: '100px',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* View Job Link */}
                    <a
                      href={jd.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: colors.primary,
                        textDecoration: 'none',
                      }}
                    >
                      View Job <ExternalLink size={14} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Community Invite */}
          {currentStep === 4 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              paddingTop: '24px',
            }}>
              {/* Discord Icon */}
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                background: '#5865F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '28px',
                boxShadow: '0 8px 24px rgba(88, 101, 242, 0.25)',
              }}>
                <svg width="36" height="28" viewBox="0 0 24 18" fill="white">
                  <path d="M20.317 1.492a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.093-.32 10.555.099 14.961a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 12.278c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>

              <h1 style={{
                fontFamily: serifFont,
                fontSize: '36px',
                fontWeight: '400',
                color: colors.dark,
                marginBottom: '12px',
                letterSpacing: '-0.3px',
                lineHeight: '1.2',
              }}>
                Join our AI Learning Community
              </h1>

              <p style={{
                fontSize: '15px',
                color: colors.textMuted,
                marginBottom: '36px',
                maxWidth: '420px',
                lineHeight: '1.6',
              }}>
                Connect with others who are reskilling for the AI era. Share resources, get feedback, and learn together.
              </p>

              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 32px',
                  fontSize: '15px',
                  fontWeight: '600',
                  fontFamily: serifFont,
                  color: '#FFFFFF',
                  background: '#5865F2',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(88, 101, 242, 0.3)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#4752C4'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#5865F2'}
              >
                <svg width="20" height="15" viewBox="0 0 24 18" fill="white">
                  <path d="M20.317 1.492a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.093-.32 10.555.099 14.961a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 12.278c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Join Discord Community
              </a>
            </div>
          )}

        </div>
      </main>

      {/* Step 2 CTA Button - rendered outside transformed container */}
      {currentStep === 2 && showEvolutionCta && (
        <footer style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          padding: '24px 24px 48px',
          zIndex: 50,
          opacity: 1,
          animation: 'fadeInUp 0.5s ease 1.4s both',
        }}>
          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(12px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <button
            onClick={goToNext}
            style={{
              padding: '14px 48px',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: serifFont,
              color: '#fff',
              background: '#6B5E52',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(92, 70, 54, 0.2)',
            }}
            onMouseEnter={(e) => e.target.style.background = '#5C5043'}
            onMouseLeave={(e) => e.target.style.background = '#6B5E52'}
          >
            Continue
          </button>

          <button
            onClick={goToPrevious}
            style={{
              background: 'none',
              border: 'none',
              color: colors.textMuted,
              fontSize: '12px',
              fontWeight: '400',
              fontFamily: serifFont,
              cursor: 'pointer',
              padding: '6px 12px',
            }}
          >
            Back
          </button>
        </footer>
      )}

      {/* Footer - show on steps 1 and 3 only */}
      {(currentStep === 1 || currentStep === 3) && (
        <footer style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          padding: '24px 24px 48px',
          zIndex: 50,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* CTA Button */}
          <button
            onClick={() => {
              if (isButtonPressed) return
              if (canContinue()) {
                goToNext()
              }
            }}
            disabled={!canContinue() || isButtonPressed}
            style={{
              padding: '14px 48px',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: serifFont,
              letterSpacing: currentStep === 1 ? '0.3px' : '0.8px',
              textTransform: currentStep === 1 ? 'none' : 'uppercase',
              color: canContinue() ? colors.white : colors.border,
              background: canContinue()
                ? (isButtonPressed ? '#4A3F35' : '#6B5E52')
                : 'transparent',
              border: canContinue() ? 'none' : `1px solid ${colors.border}`,
              borderRadius: '10px',
              cursor: canContinue() && !isButtonPressed ? 'pointer' : 'default',
              transition: isButtonPressed
                ? 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                : 'all 0.3s ease',
              transform: isButtonPressed ? 'translateY(3px) scale(0.98)' : 'translateY(0) scale(1)',
              boxShadow: isButtonPressed
                ? '0 1px 2px rgba(0,0,0,0.1)'
                : canContinue()
                  ? '0 4px 12px rgba(92, 70, 54, 0.2)'
                  : 'none',
            }}
          >
            {isButtonPressed
              ? 'Confirmed'
              : currentStep === 1
                ? `Continue as ${positions.find(p => p.id === selectedRole)?.label || 'this role'}`
                : 'Continue'
            }
          </button>

          {/* Back link - show on step 3 */}
          {currentStep === 3 && (
            <button
              onClick={goToPrevious}
              style={{
                background: 'none',
                border: 'none',
                color: colors.textMuted,
                fontSize: '12px',
                fontWeight: '400',
                fontFamily: serifFont,
                cursor: 'pointer',
                padding: '6px 12px',
              }}
            >
              Back
            </button>
          )}
        </footer>
      )}

      {/* Step 4: Back link only (no CTA) */}
      {currentStep === 4 && (
        <footer style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '16px 24px 48px',
          zIndex: 50,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <button
            onClick={goToPrevious}
            style={{
              background: 'none',
              border: 'none',
              color: colors.textMuted,
              fontSize: '12px',
              fontWeight: '400',
              fontFamily: serifFont,
              cursor: 'pointer',
              padding: '6px 12px',
            }}
          >
            Back
          </button>
        </footer>
      )}
    </div>
  )
}
