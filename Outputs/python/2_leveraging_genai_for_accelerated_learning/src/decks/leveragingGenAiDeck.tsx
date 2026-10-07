import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentNoteSlide,
  ContentSlide,
  FeedbackSlide,
  KeyTakeawaysSlide,
  PracticeSlide,
  ProceduralStepsSlide,
  QuizTimeSlide,
  SectionBreakerSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import { Card, CardGrid, Chip, CodeBlock, LogoWall, PromptCard, RadialSpread } from '@/ui'

/**
 * PYTHON · SESSION 2 · "Leveraging Gen AI for Accelerated Learning"
 *
 * Converted from `Python_PPT_slide/2_Leveraging GenAI for Accelerated Learning.pptx`
 * under `python/session_plans/2_leveraging_genai_for_accelerated_learning/plan.md`
 * (signed off 2026-09-22) and the course rules in
 * `python/workflow/skills/python-course/SKILL.md`: the source sentences are the
 * copy, no stock illustrations, a figure only where the content needs one.
 *
 * This deck has no program output. Its recurring content is a prompt the
 * learner pastes into an AI tool, rendered by `PromptCard`, and every prompt is
 * the source's text word for word.
 */

export const leveragingGenAiMeta: DeckMeta = {
  title: 'Leveraging Gen AI for Accelerated Learning',
  course: 'Python',
  lesson: 'Leveraging Gen AI for Accelerated Learning',
  presenter: 'NxtWave Instructor',
}

const SESSION = 'Leveraging Gen AI for Accelerated Learning'

const AGENDA = {
  why: 'Why Python?',
  ai: 'AI-Powered Learning',
  explain: 'Coding Explanation',
  gen: 'Generation',
} as const

const GEN_SUB = 'Generating Code · Quiz Generation · Coding Problem Generation'

/* ------------------------------------------------------------------ */
/* The prompts, verbatim from the source                               */
/* ------------------------------------------------------------------ */

const PROMPTS = {
  first:
    "I'm completely new to programming. Can you explain how to write my first Python program like you're teaching a 10-year-old?\nI want to understand what each part does before I try it.",
  explain:
    'Explain what the given code does and then simplify/break down the given code in python into steps, and explain each step in simple terms to a school kid in India who has just learned Python',
  generate:
    'Can you provide a Python program to solve the following problem?\nProblem: [Add a title for the program]\nDescription: [Briefly describe the problem, what the program should achieve, and the goal.]\nInput: [Describe the format of the input the program will receive]\nOutput: [Describe the expected output format]\nSample Test Cases: [List some sample test cases with Input value and corresponding output values including some edge cases]',
  quiz:
    "I've just completed learning about [concept]. Can you create a comprehensive quiz to test my understanding of this concept?\nThe quiz should include:\nA variety of question types (e.g., multiple-choice, true/false, short answer).\nQuestions that cover different aspects of [concept].\nFor each question, wait for my response before proceeding to the next one.\nAfter I answer, explain the correct answer and why it's right or wrong.\nInclude additional hints or explanations if I'm struggling with a specific question",
  harder:
    "Now, increase the difficulty of the questions on [concept], and ask questions that are hard and tricky. If I couldn't answer the questions, provide explanations for the questions.",
  problem:
    "I've just finished learning about [current concept/topic], and I have also previously learned the following concepts:\n[List of previous concepts/topics]\nCan you create a coding problem that incorporates both my recent learning and the previously learned concepts?\nThe problem should:\nClearly explain the task and what needs to be accomplished.\nDefine the input format, including constraints (e.g., size of input, types of values, edge cases).\nSpecify the expected output format and any constraints on the output.\nProvide sample test cases with input and expected output to help clarify the problem.\nInclude a description of any edge cases or special conditions to consider (e.g., empty inputs, large numbers, etc.).\nEnsure that the problem is challenging but still solvable with the concepts I've learned.\nOnce I finish the solution, please review it and suggest improvements if needed.",
}

const EXPLAIN_CODE =
  'number_of_inputs = int(input())\ncounter = 0\nsum = 0\nwhile counter < number_of_inputs:\n   number = int(input())\n   sum = (sum + number)\n   counter = (counter + 1)\nprint(sum)'

/** The tools slide: the mark, the name, and the address the source gives. */
const TOOLS = [
  { src: '/assets/tech/chatgpt.png', name: 'GPT', sub: 'https://chatgpt.com/' },
  { src: '/assets/tech/meta-ai.png', name: 'LLAMA', sub: 'https://www.meta.ai/' },
  { src: '/assets/tech/gemini.png', name: 'Gemini', sub: 'https://gemini.google.com/' },
  { src: '/assets/tech/claude.png', name: 'Claude', sub: 'https://claude.ai/' },
]

/* ------------------------------------------------------------------ */
/* One sentence, one slide                                             */
/* ------------------------------------------------------------------ */

/** The source's single-sentence slides: a kicker, a title, the sentence. */
const sentence = (id: string, kicker: string, title: string, text: string): SlideDef => ({
  id,
  section: kicker,
  label: title,
  element: <ContentSlide kicker={kicker} title={title} lesson={SESSION} points={[{ text, icon: 'bulb' }]} />,
})

export const leveragingGenAiDeck: SlideDef[] = [
  /* ── Front frame ─────────────────────────────────────────────────── */
  { id: 'brand', section: 'Opening', label: 'Welcome', element: <BrandSlide greeting="Welcome!" lesson={SESSION} /> },
  { id: 'session-name', section: 'Opening', label: 'Session name', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        kicker="Agenda"
        title="Agenda for Today's Session"
        lesson={SESSION}
        items={[
          { title: AGENDA.why, sub: 'Where Python is used, and what it builds' },
          { title: AGENDA.ai, sub: 'Maximize your learning with AI' },
          { title: AGENDA.explain, sub: 'Ask AI to break code into steps' },
          { title: AGENDA.gen, sub: 'Code generation, Quiz generation, Coding problem generation' },
        ]}
      />
    ),
  },

  /* ── Concept 1: Why Python? ──────────────────────────────────────── */
  { id: 'why-divider', section: AGENDA.why, label: 'Divider', element: <SectionBreakerSlide index={1} title={AGENDA.why} lesson={SESSION} /> },
  {
    id: 'why-python',
    section: AGENDA.why,
    label: 'Why Python?',
    element: (
      <ContentSlide kicker={AGENDA.why} title="Why Python?" lesson={SESSION}>
        <RadialSpread
          hub="Python"
          hubLogo="/assets/tech/python.png"
          spokes={[
            { icon: 'bulb', label: 'Machine Learning' },
            { icon: 'globe', label: 'Supportive Community' },
            { icon: 'bolt', label: 'Artificial Intelligence' },
            { icon: 'database', label: 'Data Science' },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'build-smarter',
    section: AGENDA.why,
    label: 'Build Smarter with Python',
    element: (
      <ContentSlide kicker={AGENDA.why} title="Build Smarter with Python" lesson={SESSION}>
        <CardGrid cols={3} className="mx-auto w-[900px]">
          <Card icon="settings" title="Automating tasks" />
          <Card icon="bulb" title="Building intelligent systems" />
          <Card icon="target" title="Analyzing data" />
        </CardGrid>
      </ContentSlide>
    ),
  },

  /* ── Concept 2: AI-Powered Learning ──────────────────────────────── */
  { id: 'ai-divider', section: AGENDA.ai, label: 'Divider', element: <SectionBreakerSlide index={2} title={AGENDA.ai} subtitle="Maximize your learning with AI" lesson={SESSION} /> },
  sentence('ai-tool', AGENDA.ai, 'AI-Powered Learning', 'AI can be a powerful tool to enhance your learning experience, tailored to your current skill set'),
  {
    id: 'ai-not-a-replacement',
    section: AGENDA.ai,
    label: 'Not a replacement',
    element: (
      <ContentNoteSlide
        kicker={AGENDA.ai}
        title="AI-Powered Learning"
        lesson={SESSION}
        noteFirst
        note={{ kind: 'warning', body: "AI tools can help you write code faster, but they shouldn't replace your understanding" }}
      />
    ),
  },
  {
    id: 'tools',
    section: AGENDA.ai,
    label: 'Tools',
    element: (
      <ContentSlide
        kicker={AGENDA.ai}
        title="Tools"
        lesson={SESSION}
        lead="There are several tools developed by various organizations, Each tool has different features and works in its own way"
      >
        <div className="mx-auto w-[900px]">
          <LogoWall marks={TOOLS} cols={4} />
          <p className="mt-6 text-center text-body-sm text-body">etc…</p>
        </div>
      </ContentSlide>
    ),
  },
  sentence('master-python', AGENDA.ai, 'AI-Powered Learning', 'To truly master Python, you need to grasp its core concepts, logic, and creativity behind problem-solving'),
  {
    id: 'ask-right',
    section: AGENDA.ai,
    label: 'How to ask',
    element: (
      <ContentSlide
        kicker={AGENDA.ai}
        title="AI-Powered Learning"
        lesson={SESSION}
        points={[
          { text: 'How to ask the right questions', icon: 'chat' },
          { text: 'How to understand Concepts using AI', icon: 'book' },
          { text: "Build a strong foundation that AI can't replace", icon: 'shield' },
        ]}
      />
    ),
  },
  {
    id: 'structured-prompting',
    section: AGENDA.ai,
    label: 'Implement Structured Prompting',
    element: (
      <ProceduralStepsSlide
        kicker={AGENDA.ai}
        title="Implement Structured Prompting"
        lesson={SESSION}
        steps={[
          { title: 'Use AI Tools like Chat-GPT, Gemini', icon: 'chat' },
          { title: 'Implement Structured Prompting', icon: 'file' },
          { title: 'enhance your learning experience', icon: 'rocket' },
        ]}
      />
    ),
  },
  sentence('learning-partner', AGENDA.ai, 'AI-Powered Learning', "Think of AI as a learning partner that's available 24/7"),
  {
    id: 'tutor',
    section: AGENDA.ai,
    label: 'Think, Explore, Reason',
    element: (
      <ContentSlide
        kicker={AGENDA.ai}
        title="AI-Powered Learning"
        lesson={SESSION}
        lead="Instead of relying on AI to hand you code, use it as a tutor that helps you to"
      >
        <CardGrid cols={3} className="mx-auto w-[780px]">
          <Card icon="bulb" title="Think" />
          <Card icon="globe" title="Explore" />
          <Card icon="target" title="Reason" />
        </CardGrid>
      </ContentSlide>
    ),
  },
  sentence(
    'analytical-thinking',
    AGENDA.ai,
    'Basic Requests to Analytical Thinking',
    'So don\'t just say, "show me how to write a python program" instead, ask why it works, ask for analogies, ask for step-by-step breakdowns',
  ),
  sentence('better-prompts', AGENDA.ai, 'AI-Powered Learning', 'Learning to write better prompts is a skill that amplifies your growth with AI'),
  {
    id: 'vague-vs-clear',
    section: AGENDA.ai,
    label: 'Vague vs clear',
    element: (
      <ContentSlide kicker={AGENDA.ai} title="AI-Powered Learning" lesson={SESSION}>
        <div className="mx-auto grid w-[980px] grid-cols-[1fr_auto_1fr] items-center gap-6">
          <Card icon="cross" tone="accent" title="A vague request gets a vague answer" />
          <Chip solid>vs</Chip>
          <Card icon="check" tone="success" title="Clear, specific prompt gives detailed explanation" />
        </div>
      </ContentSlide>
    ),
  },
  sentence(
    'getting-started',
    AGENDA.ai,
    'Your First Python Program using AI',
    "Let's start by using AI to help you write and understand your very first Python program",
  ),
  {
    id: 'first-prompt',
    section: AGENDA.ai,
    label: 'First program prompt',
    element: (
      <ContentSlide kicker={AGENDA.ai} title="Your First Python Program using AI" lesson={SESSION}>
        <PromptCard prompt={PROMPTS.first} className="mx-auto w-[900px]" />
      </ContentSlide>
    ),
  },

  /* ── Concept 3: Coding Explanation ───────────────────────────────── */
  { id: 'explain-divider', section: AGENDA.explain, label: 'Divider', element: <SectionBreakerSlide index={3} title={AGENDA.explain} lesson={SESSION} /> },
  sentence('explain', AGENDA.explain, 'Coding Explanation', 'Gen AI helps simplify code into clearer, step-by-step explanations'),
  {
    id: 'explain-prompt',
    section: AGENDA.explain,
    label: 'Explanation prompt',
    element: (
      <ContentSlide kicker={AGENDA.explain} title="Coding Explanation" lesson={SESSION}>
        <div className="grid grid-cols-[1.2fr_1fr] items-start gap-6">
          <PromptCard prompt={PROMPTS.explain} fontSize={17} />
          <CodeBlock filename="main.py" code={EXPLAIN_CODE} fontSize={15} />
        </div>
      </ContentSlide>
    ),
  },

  /* ── Concept 4: Generation ───────────────────────────────────────── */
  { id: 'gen-divider', section: AGENDA.gen, label: 'Divider', element: <SectionBreakerSlide index={4} title={AGENDA.gen} lesson={SESSION} /> },
  sentence('generating-code', AGENDA.gen, 'Generating Code', 'AI can help to generate code from scratch'),
  {
    id: 'generate-prompt',
    section: AGENDA.gen,
    label: 'Generating Code prompt',
    element: (
      <ContentSlide kicker={AGENDA.gen} title="Generating Code" lesson={SESSION}>
        <PromptCard prompt={PROMPTS.generate} fontSize={16} className="mx-auto w-[1000px]" />
      </ContentSlide>
    ),
  },
  sentence('quiz-testing', AGENDA.gen, 'Quiz Generation', 'Testing your knowledge is a critical part of learning'),
  sentence('quiz-personal', AGENDA.gen, 'Quiz Generation', "Gen AI can create personalized quizzes based on what you've just learned"),
  {
    id: 'quiz-prompt',
    section: AGENDA.gen,
    label: 'Quiz prompt',
    element: (
      <ContentSlide kicker={AGENDA.gen} title="Quiz Generation" lesson={SESSION}>
        <PromptCard prompt={PROMPTS.quiz} fontSize={16} className="mx-auto w-[1000px]" />
      </ContentSlide>
    ),
  },
  {
    id: 'quiz-harder',
    section: AGENDA.gen,
    label: 'Quiz follow-up',
    element: (
      <ContentSlide
        kicker={AGENDA.gen}
        title="Quiz Generation"
        lesson={SESSION}
        lead="If you feel the questions are easy, have answered them correctly, then add a follow-up like this"
      >
        <PromptCard prompt={PROMPTS.harder} className="mx-auto w-[900px]" />
      </ContentSlide>
    ),
  },
  {
    id: 'problem-generation',
    section: AGENDA.gen,
    label: 'Coding Problem Generation',
    element: (
      <ContentSlide
        kicker={AGENDA.gen}
        title="Coding Problem Generation"
        lesson={SESSION}
        points={[
          { text: "AI can generate personalized challenges based on the topics you've learned", icon: 'target' },
          { text: 'Creating coding problems is an essential part of reinforcing programming skills', icon: 'code' },
        ]}
      />
    ),
  },
  {
    id: 'problem-prompt',
    section: AGENDA.gen,
    label: 'Coding problem prompt',
    element: (
      <ContentSlide kicker={AGENDA.gen} title="Coding Problem Generation" lesson={SESSION}>
        <PromptCard prompt={PROMPTS.problem} fontSize={13} className="mx-auto w-[1080px]" />
      </ContentSlide>
    ),
  },

  /* ── Closing frame ───────────────────────────────────────────────── */
  {
    id: 'quiz-time',
    section: 'Closing',
    label: 'Quiz Time!',
    transition: 'zoom',
    notes: 'Added: the source deck had no quiz frame. Hard rule 18 puts one immediately before Key Takeaways.',
    element: <QuizTimeSlide lesson={SESSION} subtitle="Four AI tools, one structured prompt, and what a prompt should ask for" />,
  },
  {
    id: 'key-takeaways',
    section: 'Closing',
    label: 'Key Takeaways',
    element: (
      <KeyTakeawaysSlide
        title={SESSION}
        lesson={SESSION}
        points={[
          { text: AGENDA.why },
          { text: AGENDA.ai, sub: 'Maximize your learning with AI' },
          { text: AGENDA.explain },
          { text: AGENDA.gen, sub: GEN_SUB },
        ]}
      />
    ),
  },
  {
    id: 'practice',
    section: 'Closing',
    label: 'Practice',
    transition: 'rise',
    element: (
      <PracticeSlide
        title="Practice"
        prompt="Take one program from the last session to an AI tool"
        lesson={SESSION}
        tasks={[
          { text: 'Paste the Coding Explanation prompt with print("Hello World!")', sub: 'Read the steps it gives back' },
          { text: 'Ask for a quiz on what you learned today', sub: 'Use the Quiz Generation prompt' },
          { text: 'Ask why, not just how', sub: 'One follow-up question on any answer it gave you' },
        ]}
      />
    ),
  },
  { id: 'next-session', section: 'Closing', label: 'Next Session', element: <SectionBreakerSlide kicker="Next Session" title="Variables and Data Types" lesson={SESSION} /> },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} /> },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" message="All the best" lesson={SESSION} /> },
]
