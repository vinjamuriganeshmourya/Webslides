# Review · Running the Real App with Docker

- session: `deployement_session_4`
- deck: `deployment-session-4`
- slides: 85
- updated: 2026-09-03 06:21

Written by the review app: `node review-app/server.mjs` at the repo root.
Reword a note freely; leave the `<!--c:id-->` markers alone, they are how
the app finds the comment you clicked.

Status: `[ ]` open · `[x]` done · `[~]` wont fix

**0 open comments**, all 31 applied on 2026-09-03. 85 slides.

Four slides were removed as asked (`excuse-used-up`, `c1-nothing-changes`,
`c2-pip-freeze`, `c3-gitignore-warning`) and five were added, because five of
these comments asked for a concept to be re-sequenced rather than reworded:
`c2-unpinned-cost`, `c2-env-problem`, `c2-env-question`,
`c2-dockerignore-question`, `c3-database-problem`, `c3-database-settings`.

Those five comments are now one written rule, `PEDAGOGY_GUIDELINES.md` section 2:
every new concept carries four beats, in order -- what works today, what it
costs, what we need, how we do it.

Two other rules came out of this pass: `STYLE_GUIDE.md` section 9 (every surface
in a figure is lit from the top-left) and `TEXT_GUIDELINES.md` section 4a (agenda
items carry no articles and no helping words).

## Slide 4 · recap-what-it-bought
<!-- Recap: what it bought -->

- [x] **slide** <!--c:tyx1h3@2026-09-03-->
      Remove all these points and place only Agenda points from previous session

## Slide 5 · excuse-used-up
<!-- The turn -->

- [x] **slide** <!--c:junqyv@2026-09-03-->
      Remove this slide

## Slide 6 · agenda
<!-- Agenda -->

- [x] **slide** <!--c:tnp9kf@2026-09-03-->
      Instead use simple words to represent the concept
      Moves In? Each Part ? Specify what ? Compose file project
      running the application through Docker compose

## Slide 7 · setup
<!-- Setup -->

- [x] **slide** <!--c:a4wbcb@2026-09-03-->
      Remove all this and just keep Open Out Nxttrendz Workspace that we had worked on
      and show the folder tree  this is enough

## Slide 10 · c1-after
<!-- The new routine -->

- [x] **slide** <!--c:q1bpa7@2026-09-03-->
      One command, run from the project root, and the whole stack comes up
      Humanize the sentence with simple English

## Slide 11 · c1-workspace
<!-- The workspace -->

- [x] **FileTree** · `src/ui/FileTree.tsx:68` · @1213,580 <!--c:58tmpx@2026-09-03-->
      in file Tree make a new design to replicate to show the file inside the folder when the those are expanded
      intital state should have backedn frontend and docker-demo, only we can expand one at a time
      > "C:\nxttrendzbackendmanage.pyrequirements.txtabout to changemyprojectsettings.py lives here"

## Slide 12 · c1-nothing-changes
<!-- No app code changes -->

- [x] **slide** <!--c:f7c9mb@2026-09-03-->
      Remove this slide

## Slide 14 · c1-two-new-keys
<!-- Two new keys -->

- [x] **slide** <!--c:y35i8y@2026-09-03-->
      Lets not introduce these 2 in here lets tell implement the dockerfile with the known comands and give problem we then provide these as solution

## Slide 15 · c1-the-claim
<!-- The main idea -->

- [x] **slide** <!--c:vjnfp9@2026-09-03-->
      Couldnt understand the points simplify the english and eplxnation

## Slide 19 · c2-question-next-month
<!-- Question: next month -->

- [x] **slide** <!--c:76y6z3@2026-09-03-->
      Instead of saying same Django, lets call it same versions?

## Slide 20 · c2-pip-freeze-shape
<!-- pip freeze, explained -->

- [x] **slide** <!--c:rz3k2h@2026-09-03-->
      1
      the command
      Prints every package installed in this virtual environment, each with the exact version
      2
      send output to a file
      Without it the list prints to the screen. With it, the same list goes into a file instead
      3
      the file to write
      Overwritten, not appended. The old unpinned file is replaced by this one
      Capitablize the  tittles of 1,2 3,  points
- [x] **slide** <!--c:8tnplf@2026-09-03-->
      Remove or repharse this sentence for more clarity , and expect the old contents to be gone

## Slide 21 · c2-pip-freeze
<!-- pip freeze -->

- [x] **slide** <!--c:vc7cf0@2026-09-03-->
      Remove this slide

## Slide 22 · c2-pip-freeze-run
<!-- Run it -->

- [x] **slide** <!--c:sence0@2026-09-03-->
      PS C:\nxttrendz\backend> dir requirements.txt
      05-09-2026  11:04             178 requirements.txt
      Remove this
- [x] **slide** <!--c:yxe65b@2026-09-03-->
      Rephrase the sentence in simple english
- [x] **slide** <!--c:n2h3k5@2026-09-03-->
      PS C:\nxttrendz\backend> dir requirements.txt
      05-09-2026  11:04             178 requirements.txt
      Remove this

## Slide 23 · c2-pinned
<!-- Pinned -->

- [x] **slide** <!--c:uil02l@2026-09-03-->
      Every package is pinned, including the ones you did not ask for
      Rephrase with simple english

## Slide 24 · c2-base-image
<!-- The base image -->

- [x] **slide** <!--c:587ayi@2026-09-03-->
      Any Python can print two lines.
      Remove this
- [x] **slide** <!--c:vmauda@2026-09-03-->
      3.12 will suppport Django6.1?
      Mention only 3.14,3.13,3.12 or older
      in the table

## Slide 26 · c2-five-of-seven
<!-- Five of seven -->

- [x] **slide** <!--c:xg9lh7@2026-09-03-->
      Why 11 is highlighted?
- [x] **slide** <!--c:4d36en@2026-09-03-->
      ENV PYTHONUNBUFFERED=1
      Instead of directly adding new instruction, our application is having .env and how we can specifiy in docker ?
      Then introduce this command and then add at its placemnet also justify the placement

## Slide 29 · c2-runserver-note
<!-- Aside: gunicorn -->

- [x] **slide** <!--c:6l7u18@2026-09-03-->
      Represent in and phrase the points more clearly

## Slide 31 · c2-dockerignore-earns
<!-- Why db.sqlite3 stays out -->

- [x] **slide** <!--c:w18h8z@2026-09-03-->
      Remove this .vscode/
      Editor settings, already on the frontend list
- [x] **slide** <!--c:qq1cvj@2026-09-03-->
      Instead of introducing like this then what about our database? and .env? then explain clearly instead of directly putting

## Slide 44 · c3-both-publish
<!-- Both publish -->

- [x] **slide** <!--c:x03qwm@2026-09-03-->
      Introduce ports here

## Slide 55 · c3-two-injectors
<!-- environment vs env_file -->

- [x] **slide** <!--c:k613gf@2026-09-03-->
      Explanation not clear

## Slide 56 · c3-gitignore-warning
<!-- gitignore the .env -->

- [x] **slide** <!--c:h105h3@2026-09-03-->
      remove this  slide

## Slide 57 · c3-database-moves
<!-- The database moves -->

- [x] **slide** <!--c:ops9et@2026-09-03-->
      no connection or flow this problem what mention in way before and in middle of no wher this is introduced

## Slide 66 · c4-why-empty
<!-- Why empty -->

- [x] **slide** <!--c:tbn57o@2026-09-03-->
      The models must be migrated, exactly like day one of the Django course
      dont mention as django course mention like when you done for the 1st time

## Slide 68 · c4-exec-anatomy
<!-- exec anatomy -->

- [x] **ExecAnatomy** · `src/ui/ExecAnatomy.tsx:61` · @519,294 <!--c:g1v5ky@2026-09-03-->
      deisgn is not nyc

## Slide 71 · c4-verify
<!-- Verify -->

- [x] **slide** <!--c:0kffmt@2026-09-03-->
      format the slide the tittle and sidehead should be on top
