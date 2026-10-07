<!-- cSpell:ignore NxtWave devPort LLAMA -->
# Python · Session 2: "Leveraging Gen AI for Accelerated Learning"

**STATUS: SIGNED OFF 2026-09-22** (approved on the defaults in the sign-off section)

No slide is generated until this plan is approved. Section 7 is the gate.

| | |
|---|---|
| `SESSION_NAME` | `Leveraging Gen AI for Accelerated Learning` |
| `COURSE` | `Python` |
| Source | `Python_PPT_slide/2_Leveraging GenAI for Accelerated Learning.pptx`, 40 slides, read in full |
| Project | `python/2_leveraging_genai_for_accelerated_learning/` |
| Deck file | `src/decks/leveragingGenAiDeck.tsx` |
| Slide count | **38** |
| `devPort` | `5229` |
| `htmlName` | `python-session-2-leveraging-genai-for-accelerated-learning` |
| `NEXT_UP` | `Variables and Data Types` (the source's Next Session slide, 37) |

## 0. The conversion approach

> **Revised at first render, 2026-09-22.** Illustration-first is retired for the
> whole course: *"no need to use existing illustration, build new and our own
> only if required for the content."* Every slide this plan gave a PPT picture
> shipped as a plain typographic slide, and the dividers carry no image. The
> source sentences, the analogies, the quiz positions and the labels stand.
> The rule is `python/workflow/skills/python-course/` R1.

Same approach as session 1, in short: the source's illustrations are the
primary visual (extracted to
`slide-kit/assets/illustrations/python/2_leveraging_genai_for_accelerated_learning/`,
copied to the session), the source sentences are kept word for word apart from
em dashes, and labels are added wherever the source used position or an arrow.

This deck has **no program output** and **no terminal**. Its recurring content
is a **prompt the learner pastes into an AI tool**. Six slides carry one.

## 1. What changes from the source, and why

| Source | Becomes | Why |
|---|---|---|
| Overview (3) names three things: Python using GenAI / AI-Powered Learning / Code Explanation / Generation (Code generation, Quiz generation, Coding problem generation) | **4 agenda items**: Why Python? · AI-Powered Learning · Coding Explanation · Generation, the last with the source's three-part sub-line | Rule 20: at most four, restated verbatim in the takeaways |
| **Five** dividers: AI-Powered Learning (7), Coding Explanation (21), Generating Code (24), Quiz Generation (27), Coding Problem Generation (32), plus Why Python? (4) | **Four** dividers, one per agenda item. Generating Code, Quiz Generation and Coding Problem Generation become the titles of the slides under the Generation divider | One divider per concept. See §7, decision 1, if you want the source's five kept |
| **No Quiz Time frame** anywhere in the source | one `QuizTimeSlide` added immediately before Key Takeaways | Hard rule 18: every deck carries one or two, the last before the takeaways. This is the one place this plan adds a frame the source did not have. See §7, decision 2 |
| Prompt text in a speech bubble beside a person (20, 23, 26, 30, 31, 34) | a `PromptCard` panel labelled with **where to paste it**, beside the same person illustration | Rule 31 by analogy: text the learner types goes with the place they type it |
| Key Takeaways (35): AI-powered Learning / Maximize your learning with AI / Code Explanation / Generation / Generating Code / Quiz Generation / Coding Problem Generation | the four agenda strings, with the source's remaining lines as each point's `sub` | Rule 20 |

Everything else maps one to one.

## 2. Concept map

| # | Concept (agenda wording) | Source slides |
|---|---|---|
| 1 | Why Python? | 4 to 6 |
| 2 | AI-Powered Learning | 7 to 20 |
| 3 | Coding Explanation | 21 to 23 |
| 4 | Generation (Generating Code · Quiz Generation · Coding Problem Generation) | 24 to 34 |

## 3. Slide-by-slide plan

`R` = `ContentRightImageSlide`, `C` = `ContentSlide`, `Div` =
`SectionBreakerImageSlide`. Illustration paths are relative to
`public/assets/illustrations/`.

### Front frame

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` |
| 2 | `WelcomeSlide` `minimal` | Leveraging Gen AI for Accelerated Learning |
| 3 | `AgendaSlide` | Why Python? · AI-Powered Learning (sub: Maximize your learning with AI) · Coding Explanation · Generation (sub: Code generation, Quiz generation, Coding problem generation) |

### Concept 1: Why Python? (source 4 to 6)

| # | Type | Title · lead / points | Visual |
|---|---|---|---|
| 4 | `Div` | Why Python? | `assets/tech/python.png` |
| 5 | `C` | **Why Python?** · Machine Learning · Supportive Community · Artificial Intelligence · Data Science | `RadialSpread` (kit, from session 1): the Python mark at the hub, four labelled spokes with house icons |
| 6 | `C` | **Build Smarter with Python** · Automating tasks · Building intelligent systems · Analyzing data | `CardGrid`, three cards, each with its source icon: `icon-automating-tasks.png`, `icon-intelligent-systems.png`, `icon-analyzing-data.png`. Three peers side by side is the one case §8 of the style guide allows a grid |

### Concept 2: AI-Powered Learning (source 7 to 20)

| # | Type | Title · lead / points | Visual |
|---|---|---|---|
| 7 | `Div` | AI-Powered Learning | `ai-powered-learning.png` |
| 8 | `R` | **AI-Powered Learning** · AI can be a powerful tool to enhance your learning experience, tailored to your current skill set | `learning-with-ai.jpg` |
| 9 | `ContentNoteSlide` | **AI-Powered Learning** · note kind `warning`: AI tools can help you write code faster, but they shouldn't replace your understanding | the note is the visual |
| 10 | `C` | **Tools** · There are several tools developed by various organizations, Each tool has different features and works in its own way | `LogoWall` (kit, from session 1): GPT `https://chatgpt.com/` · LLAMA `https://www.meta.ai/` · Gemini `https://gemini.google.com/` · Claude `https://claude.ai/`, from `assets/tech/chatgpt.png`, `meta-ai.png`, `gemini.png`, `claude.png`; the URL is the label under each mark. `etc…` as the caption |
| 11 | `R` | **AI-Powered Learning** · To truly master Python, you need to grasp its core concepts, logic, and creativity behind problem-solving | `core-concepts-puzzle.png` |
| 12 | `C` | **AI-Powered Learning** · How to ask the right questions · How to understand Concepts using AI · Build a strong foundation that AI can't replace | three points with house icons |
| 13 | `ProceduralStepsSlide` | **Implement Structured Prompting** · 1 Use AI Tools like Chat-GPT, Gemini · 2 Implement Structured Prompting · 3 enhance your learning experience | `StepList`; the source numbers these, so they stay numbered. `icon-structured-prompt.png` and `icon-graduate-laptop.png` on steps 2 and 3 |
| 14 | `R` | **AI-Powered Learning** · Think of AI as a learning partner that's available 24/7 | `robot-tutor.png` |
| 15 | `C` | **AI-Powered Learning** · Instead of relying on AI to hand you code, use it as a tutor that helps you to · Think · Explore · Reason | `CardGrid`, three cards with `icon-think.png`, `icon-explore.png`, `icon-reason.png` |
| 16 | `R` | **Basic Requests to Analytical Thinking** · So don't just say, "show me how to write a python program" instead, ask why it works, ask for analogies, ask for step-by-step breakdowns | `people-asking.jpg` |
| 17 | `ContentLeftImageSlide` | **AI-Powered Learning** · Learning to write better prompts is a skill that amplifies your growth with AI | `better-prompts-person.png` on the left, as in the source |
| 18 | `C` | **AI-Powered Learning** · two columns labelled with the source's own lines: A vague request gets a vague answer **vs** Clear, specific prompt gives detailed explanation | two `Card`s, `vs` chip between |
| 19 | `R` | **Getting Started with AI in Python** · **Your First Python Program using AI** · Let's start by using AI to help you write and understand your very first Python program | `first-program-with-ai.png` |
| 20 | `R` | **Your First Python Program using AI** | `PromptCard` (new, §4): "I'm completely new to programming. Can you explain how to write my first Python program like you're teaching a 10-year-old? I want to understand what each part does before I try it." Location label: `Paste into ChatGPT, Gemini or Claude`. Media `person-typing-prompt.png` |

### Concept 3: Coding Explanation (source 21 to 23)

| # | Type | Title · lead | Visual |
|---|---|---|---|
| 21 | `SectionBreakerSlide` | Coding Explanation | none in the source |
| 22 | `R` | **Coding Explanation** · Gen AI helps simplify code into clearer, step-by-step explanations | `code-explanation-robot.png` |
| 23 | `C` | **Coding Explanation** | `PromptCard`: "Explain what the given code does and then simplify/break down the given code in python into steps, and explain each step in simple terms to a school kid in India who has just learned Python", beside a `CodeBlock` labelled `main.py` with the source's eight-line program (`number_of_inputs = int(input())` … `print(sum)`). Media `person-typing-prompt.png` |

### Concept 4: Generation (source 24 to 34)

| # | Type | Title · lead | Visual |
|---|---|---|---|
| 24 | `SectionBreakerSlide` | Generation · subtitle: Generating Code · Quiz Generation · Coding Problem Generation | |
| 25 | `R` | **Generating Code** · AI can help to generate code from scratch | `generating-code-robot.png` |
| 26 | `C` | **Generating Code** | `PromptCard`, the source template verbatim with its `[bracketed]` slots: Problem · Description · Input · Output · Sample Test Cases. Media `person-typing-prompt.png` |
| 27 | `R` | **Quiz Generation** · Testing your knowledge is a critical part of learning | `testing-knowledge.jpg` |
| 28 | `R` | **Quiz Generation** · Gen AI can create personalized quizzes based on what you've just learned | `ai-quiz-robot.png` |
| 29 | `C` | **Quiz Generation** | `PromptCard`, the seven-line quiz prompt verbatim ("I've just completed learning about [concept]…") |
| 30 | `C` | **Quiz Generation** · If you feel the questions are easy, have answered them correctly, then add a follow-up like this | `PromptCard`: "Now, increase the difficulty of the questions on [concept], and ask questions that are hard and tricky. If I couldn't answer the questions, provide explanations for the questions." |
| 31 | `C` | **Coding Problem Generation** · AI can generate personalized challenges based on the topics you've learned · Creating coding problems is an essential part of reinforcing programming skills | `target-challenge.png` and `coding-practice.png` beside each point |
| 32 | `C` | **Coding Problem Generation** | `PromptCard`, the source's long prompt verbatim (fourteen lines). `fontSize` is the lever if it runs tall, never `maxHeight` |

### Closing frame (source 35 to 40)

| # | Type | Content |
|---|---|---|
| 33 | `QuizTimeSlide` | **added** (rule 18) · subtitle: `Four AI tools, one structured prompt, and what a prompt should ask for` |
| 34 | `KeyTakeawaysSlide` | Why Python? · AI-Powered Learning (sub: Maximize your learning with AI) · Coding Explanation · Generation (sub: Generating Code, Quiz Generation, Coding Problem Generation) |
| 35 | `PracticeSlide` | `Practice` · prompt: Take one program from session 1 to an AI tool with the Coding Explanation prompt |
| 36 | `SectionBreakerSlide` | kicker `Next Session` · Variables and Data Types |
| 37 | `FeedbackSlide` | the source has a Feedback frame here |
| 38 | `ThankYouSlide` | `Thank you!` · `All the best` |

