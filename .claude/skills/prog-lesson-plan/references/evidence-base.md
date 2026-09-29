# Teaching evidence base

Reference file. The research behind the design rules in the lesson plan prompt. Each entry is here because it changes what a session does, not for citation's sake.

Context this is selected for: 50–60 students, offline classroom, 75 minutes, 17–19 year olds, introductory programming and DSA.

---

## 1. Peer discussion between vote and reveal

**Porter, L., Bailey Lee, C., & Simon, B. (2013).** Halving fail rates using peer instruction: a study of four computer science courses. *SIGCSE '13*, 177–182. doi:10.1145/2445196.2445250

Across four courses and 16 peer-instruction course instances, fail rates fell by a per-course average of 61% (20% → 7%). Within the same instructor teaching the same course, 67% (23% → 8%).

**What it means for the session:** ask a multiple-choice question, everyone commits silently, students argue with a neighbour, everyone commits again, *then* reveal. The peer discussion is the intervention — not the question, not the reveal. This is the best-evidenced technique available for a room this size, and it costs 90 seconds.

Related: Simon, Kohanfars, Lee, Tamayo & Cutts (2010), *SIGCSE*; Porter, Bailey Lee, Simon & Zingaro (2011), *ICER* — peer discussion produces gains beyond students simply hearing the answer.

---

## 2. Predict before you run — PRIMM

**Sentance, S., Waite, J., & Kallia, M. (2019).** Teaching computer programming with PRIMM: a sociocultural perspective. *Computer Science Education*, 29(2–3). doi:10.1080/08993408.2019.1608781

PRIMM = **P**redict, **R**un, **I**nvestigate, **M**odify, **M**ake. Evaluated across 13 schools and 493 students. Designed specifically to counter novices attempting to write programs before they can read them.

**What it means for the session:** every code slide is a prediction first. Show the code, room predicts the output on paper, *then* run it. Never show code and output on the same reveal. The prediction is what makes the output informative.

Earlier: Sentance, S., & Waite, J. (2017). PRIMM: exploring pedagogical approaches for teaching text-based programming in school. *WiPSCE '17*.

---

## 3. Tracing is a prerequisite skill, and it's missing

**Lister, R., Adams, E. S., Fitzgerald, S., Fone, W., Hamer, J., Lindholm, M., McCartney, R., Moström, J. E., Sanders, K., Seppälä, O., Simon, B., & Thomas, L. (2004).** A multi-national study of reading and tracing skills in novice programmers. *ITiCSE-WGR '04*, 119–150. doi:10.1145/1041624.1041673

Students across seven countries were tested on predicting the output of short code, and on selecting the correct completion of near-complete code. Many were weak at both — evidence of a fragile grasp of skills that are prerequisites for problem-solving, rather than a general problem-solving deficit.

**What it means for the session:** don't diagnose "they can't problem-solve." They can't yet trace. Trace out loud, line by line, and make them trace on paper before they write anything.

Follow-ups: Lister, Fidge & Teague (2009), *ITiCSE*; Venables, Tan & Lister (2009), *ICER*.

---

## 4. Live coding beats static code on slides

**Rubin, M. J. (2013).** The effectiveness of live-coding to teach introductory programming. *SIGCSE '13*, 651–656. doi:10.1145/2445196.2445388

Two experimental groups across four sections of an introductory course. The control group was taught with static code — instructors viewed, compiled and executed examples but never typed. Conclusion: live coding is as good as, if not better than, static code examples.

**Caution, from the other direction:** live coding raises instructor cognitive load, and a single typo or interruption can derail a lesson (see *LEO: A Live Coding Assistant for Teachers*, 2025, and Nederbragt et al. on live-coding practice). The answer is not to avoid it — it's to script it: exact keystrokes, exact errors, in order, rehearsed.

**What it means for the session:** type it, run it, break it on purpose, read the real traceback together. Screenshots of output are the weakest form of every code slide in the deck.

---

## 5. Parsons problems — the cheapest high-value activity

**Denny, P., Luxton-Reilly, A., & Simon, B. (2008).** Evaluating a new exam question: Parsons problems. *ICER '08*, 113–124.

**Ericson, B. J., Margulieux, L. E., & Rick, J. (2017).** Solving Parsons problems versus fixing and writing code. *Koli Calling '17*. doi:10.1145/3141880.3141895

Correct code, broken into mixed-up blocks, reassembled in the right order (optionally with distractor blocks, optionally requiring correct indentation). Solving two-dimensional Parsons problems with distractors took significantly less time than fixing code with the same errors or writing the equivalent code — with no significant difference in learning performance or in retention one week later.

**What it means for the session:** when a 15-minute block is running behind, a Parsons problem gets the same learning in less time than a code-writing exercise. Works on paper with 55 students, needs no machines, and is fast to check by show of hands.

Originally: Parsons, D., & Haden, P. (2006). Parson's programming puzzles: a fun and effective learning tool for first programming courses. *ACE '06*.

---

## 6. Label the chunks of every worked example

**Margulieux, L. E., & Catrambone, R. (2016).** Improving problem solving with subgoal labels in expository text and worked examples. *Learning and Instruction*, 42, 58–71.

**Morrison, B. B., Margulieux, L. E., & Guzdial, M. (2015).** Subgoals, context, and worked examples in learning computing problem solving. *ICER '15*.

**Margulieux, L. E., Morrison, B. B., & Decker, A. (2020).** Reducing withdrawal and failure rates in introductory programming with subgoal labeled worked examples. *International Journal of STEM Education*, 7(19).

Grouping the steps of a worked example and labelling each group by *what it accomplishes* — rather than presenting an undifferentiated sequence — improves problem-solving performance and transfer, and reduces withdrawal and failure rates in CS1.

**What it means for the session:** never show a solution as a flat list of steps. Group and name the groups: "set up the input", "do the calculation", "show the result". Students remember the labels and reuse them on new problems. Also: having students generate the labels themselves works (Morrison et al.).

---

## 7. Students need an explicit model of what runs the code

**du Boulay, B. (1986).** Some difficulties of learning to program. *Journal of Educational Computing Research*, 2(1).

**Sorva, J. (2013).** Notional machines and introductory programming education. *ACM Transactions on Computing Education*, 13(2), Article 8. doi:10.1145/2483710.2483713

A *notional machine* is an idealised computer whose properties are implied by the constructs of the language — the thing a student must picture in order to reason about what code does. Sorva reviews it against the literature on programming misconceptions and mental models.

**What it means for the session:** say what the machine is doing, in words, for every line. "Python reads this, works out the value, then prints it." Misconceptions are almost always a broken notional machine, not a forgotten fact. When a student is confused about `print(2 + 5)` versus `print("2 + 5")`, the gap is in their model of when evaluation happens.

---

## 8. Novices need guidance, not discovery

**Kirschner, P. A., Sweller, J., & Clark, R. E. (2006).** Why minimal guidance during instruction does not work: an analysis of the failure of constructivist, discovery, problem-based, experiential, and inquiry-based teaching. *Educational Psychologist*, 41(2), 75–86.

**What it means for the session:** don't make first-years discover syntax. Show the worked example fully, then fade support. Discovery is for the concept ("what happens if we change this?"), never for the notation. The hook can be discovery; the syntax cannot.

---

## 9. Retrieval, not review

**Roediger, H. L., & Karpicke, J. D. (2006).** Test-enhanced learning: taking memory tests improves long-term retention. *Psychological Science*, 17(3), 249–255.

**What it means for the session:** the recap at minute 68 is a set of questions, not a summary slide. Retrieval beats re-reading, and the "Key Takeaways" slide in most decks is re-reading.

---

## Honest limitation

Almost all of this was conducted in the US, UK, Australia and Northern Europe. The mechanisms (prediction, peer discussion, tracing, labelled examples) rest on general cognitive findings and should port. The specifics — how readily a 55-student South Indian classroom will argue with a neighbour when the instructor is watching, whether a closed fist for "unsure" is used honestly — will not be settled by this literature.

That is what the feedback slide is for. Treat every session as the local experiment, and keep the results.
