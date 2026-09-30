/**
 * Quiz question slide for the 2027 theme.
 *
 * The Figma section ships a "Quiz Time" *divider* (`QuizSlide2027`) but no
 * question layout, so this is built from the theme's own primitives rather than
 * ported from a frame.
 *
 * BUILD FLOW — one click, deliberately not an option-by-option reveal.
 *   entry → question and ALL options appear together in a neutral state, so the
 *           class considers every choice at once.
 *   click → the correct option is marked and the rest dim.
 * This is the same flow the Evolve-theme `QuizSlide` uses, and it satisfies the
 * workflow's hard rule that the answer never surfaces before all options do.
 */

import type { ReactNode } from 'react'
import { Card, Slide2027 } from '@/ui/nw2027/Frame'
import { useReveal } from '@/motion/Stepper'
import { nwColors, nwGradients, nwLayout, nwType } from '@/design/nw2027'

export interface NwQuizOption {
  label: ReactNode
  correct?: boolean
}

export function QuizQuestionSlide2027({
  kicker = 'Quiz',
  question,
  options,
  because,
  progress,
}: {
  kicker?: ReactNode
  question: ReactNode
  options: NwQuizOption[]
  /** One line of *why*, revealed with the answer. */
  because?: ReactNode
  progress?: { total: number; current: number }
}) {
  const answerShown = useReveal()

  return (
    <Slide2027 variant="light" progress={progress}>
      {/*
        Deliberately not `SlideHeading` + an absolutely-positioned option grid.
        Quiz prompts run long (this deck's shortest is three lines), and a fixed
        option offset either collides with a long question or leaves a hole
        under a short one. A flow column sizes to whatever the question needs.
      */}
      <div
        className="absolute flex flex-col"
        style={{
          left: nwLayout.marginX,
          right: nwLayout.marginX,
          top: nwLayout.marginTop,
          bottom: nwLayout.marginBottom + 20,
          gap: 44,
        }}
      >
        <header>
          <div style={{ ...nwType('subHeadM'), color: nwColors.primaryDarkBlue }}>{kicker}</div>
          <div style={{ width: 340, height: 3, margin: '14px 0 26px', background: nwGradients.kickerRule }} />
          <h2 style={{ ...nwType('subHeadXl'), color: nwColors.primaryDarkBlue, margin: 0 }}>
            {question}
          </h2>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 26,
            alignContent: 'start',
          }}
        >
        {options.map((opt, i) => {
          const isAnswer = answerShown && opt.correct
          const dimmed = answerShown && !opt.correct
          return (
            <Card
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                padding: '30px 40px',
                opacity: dimmed ? 0.42 : 1,
                border: isAnswer ? `3px solid ${nwColors.primaryBlue}` : '3px solid transparent',
                transition: 'opacity 240ms ease, border-color 240ms ease',
              }}
            >
              <span
                className="grid shrink-0 place-items-center"
                style={{
                  ...nwType('subHeadS'),
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  color: isAnswer ? nwColors.white : nwColors.primaryDarkBlue,
                  background: isAnswer ? nwGradients.brand : '#E3EAFB',
                }}
              >
                {isAnswer ? '✓' : String.fromCharCode(65 + i)}
              </span>
              <span style={{ ...nwType('subHeadM'), color: nwColors.primaryDarkBlue }}>{opt.label}</span>
            </Card>
          )
        })}
        </div>

        {because && answerShown && (
          <p
            style={{
              margin: 0,
              ...nwType('bodyM'),
              color: nwColors.primaryBlue,
              borderLeft: `6px solid ${nwColors.primaryBlue}`,
              paddingLeft: 28,
            }}
          >
            {because}
          </p>
        )}
      </div>
    </Slide2027>
  )
}
