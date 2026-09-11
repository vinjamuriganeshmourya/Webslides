# Review · Docker Compose for Multi-Container Apps

- session: `deployement_session_3`
- deck: `deployment-session-3`
- slides: 72
- updated: 2026-09-02 (all comments resolved)

Written by the review app: `node review-app/server.mjs` at the repo root.
Reword a note freely; leave the `<!--c:id-->` markers alone, they are how
the app finds the comment you clicked.

Status: `[ ]` open · `[x]` done · `[~]` wont fix

**0 open comments.** All 46 comments resolved, out of 72 slides.

## Slide 3 · recap-dockerfile
<!-- Recap: the Dockerfile -->

- [x] **slide** <!--c:zolbq2@2026-09-02-->
      Remove this slide

## Slide 5 · the-gap
<!-- One program so far -->

- [x] **slide** <!--c:0s2j10@2026-09-01-->
      This Slide SHould after Agenda this is not related to recao abd work on the Arrows placement
      You packaged one script. Your real application is two, and they do not even run on the same thing
      The above are 2 points make thos seperately

## Slide 7 · the-gap-two-programs
<!-- Two programs -->

- [x] **SlideLead** · `src/ui/SlideLead.tsx:92` · @640,194 <!--c:oyyveu@2026-09-02-->
      Change sentence to same runtime not thing
      > "Your real application is two programs, and they do not even run on the same thing"

## Slide 8 · setup
<!-- Initial Setup -->

- [x] **slide** <!--c:f43om0@2026-09-01-->
      Everyone starts from the same running state. Run these two checks step by step :
      Instead of saying Everyone startes from same running statem
      Generalisie the point
- [x] **SlideLead** · `src/ui/SlideLead.tsx:92` · @332,211 <!--c:5jcei5@2026-09-02-->
      Remove ':'
      > "Check your setup before you start. Run these two checks step by step :"

## Slide 10 · c1-a-choice
<!-- That line was a choice -->

- [x] **Callout** · `src/ui/Callout.tsx:101` · @473,529 <!--c:w6v9pk@2026-09-02-->
      imporve sentence working in more professional way
      > "Your image carries Python because line one said so. Change that one word and the image car"

## Slide 10 · c1-runtime
<!-- What is a runtime -->

- [x] **slide** <!--c:z5j40e@2026-09-01-->
      It is not your code, and your code cannot run without it
      Simplify the student wont able to understand
      Make sure that points are clear, not a riddles
- [x] **Callout** · `src/ui/Callout.tsx:59` · @587,586 <!--c:jqhw6h@2026-09-01-->
      this  is a point that desevered a proper slide with proper explanation
      > "node:22-alpine, openjdk:21, golang:1.23, php:8.3. Same FROM, a different word. -slim and -"

## Slide 12 · c1-image-tags
<!-- The tag after the colon -->

- [x] **slide** <!--c:4z0d1w@2026-09-02-->
      Highlight `python:3.14-slim` & `node:22-alpine`

## Slide 13 · c1-two-programs
<!-- Two runtimes, not one -->

- [x] **SlideLead** · `src/ui/SlideLead.tsx:77` · @530,292 <!--c:6vk1re@2026-09-01-->
      Three rows describe how each one runs, and every row differs
      this point is not required
      > "Both are already on your disk. Three rows describe how each one runs, and every row differ"
- [x] **FileTree** · `src/ui/FileTree.tsx:111` · @343,525 <!--c:2nv8tp@2026-09-01-->
      dont use last session's and session 1 2 3 4 5 wording any where in the session
      > "last session's practice folder"
- [x] **DataTable** · `src/ui/DataTable.tsx:80` · @617,366 <!--c:o4oyzp@2026-09-01-->
      make all row data left aligned
      > "FrontendBackend"
- [x] **DataTable** · `src/ui/DataTable.tsx:97` · @1214,507 <!--c:uq39nq@2026-09-02-->
      For data row keep left aligned
      > "FrontendBackendRuntimeNode.jsPythonDependency filepackage.jsonrequirements.txtStart comman"

## Slide 12 · c1-one-container-q
<!-- The pause beat -->

- [x] **slide** <!--c:pe57uc@2026-09-01-->
      Prepare a new slide type Question and tHink

## Slide 13 · c1-one-process
<!-- One container, one process -->

- [x] **OneProcessRule** · `src/ui/OneProcessRule.tsx:40` · @404,258 <!--c:vd5ngj@2026-09-01-->
      Make the Container porperly aligned in terms of height
      and consider the container changes that we had made in session_1_v3 in terms of design
      > "Both in oneNode runtimePython runtimetwo runtimes in one imagetwo processes to babysitone "

## Slide 16 · c1-workspace
<!-- Today's workspace -->

- [x] **FileTree** · `src/ui/FileTree.tsx:111` · @537,351 <!--c:52lyv9@2026-09-01-->
      Add this outside to the file tree with showing an Arrow
      the four flies, moved in here content unchanges
      Create this folder
      > "last session's four files, moved in here unchanged"
- [x] **FileTree** · `src/ui/FileTree.tsx:133` · @399,456 <!--c:pm4qsh@2026-09-01-->
      Remove this point
      Named to match the real project, so everything learnt today transfers when only the paths change
      > "Named to match the real project, so everything learnt today transfers when only the paths "
- [x] **FileTree** · `src/ui/FileTree.tsx:183` · @991,394 <!--c:ib0npk@2026-09-02-->
      format this
      > "create this"
- [x] **ContentNoteSlide** · `src/slides/ContentNoteSlide.tsx:93` · @573,277 <!--c:onu1vc@2026-09-02-->
      Swap both of these placement left to right
      > "Create these two foldersThen move your four existing files into backend. Their content doe"

## Slide 15 · c1-node-side-files
<!-- The Node side -->

- [x] **slide** <!--c:zzykmq@2026-09-01-->
      Remove this `Every line has a counterpart you already have`

## Slide 18 · c1-node-dockerfile
<!-- The Node Dockerfile -->

Verdict: resolved

- [x] **Callout** · `src/ui/Callout.tsx:59` · @297,630 <!--c:anuqh6@2026-09-01-->
      Reword in siimple terms and this container is over lapping with the Nxtwave logo
      ensure to not repeat this
      > "Last session's cache reason, unchanged. npm install is the slow step and rarely needs to r"
- [x] **SlideLead** · `src/ui/SlideLead.tsx:92` · @460,172 <!--c:bcazro@2026-09-02-->
      Remove Recipe anology and give more professional sentence
      > "The same recipe, with the Python words swapped for Node words"

## Slide 17 · c1-line-by-line
<!-- Line by line against Python -->

- [x] **slide** <!--c:1owiz0@2026-09-01-->
      Remove `Six rows, and the answer in the last column is yes every time`
      Dont mention like this, this should be done from instructore naration

## Slide 20 · c1-dockerignore
<!-- Its .dockerignore -->

- [x] **slide** <!--c:6qkdll@2026-09-01-->
      node_modules is the Node equivalent of env, and excluding it is not optional tidying
      use simple terms that students would understand
      dont make this as English vocabulary use simple english
- [x] **FileTree** · `src/ui/FileTree.tsx:68` · @696,442 <!--c:p101c3@2026-09-01-->
      the text is not aligned properly inside the filetree
      > "C:\nxttrendz\docker-demobackendDockerfile · requirements.txt · .dockerignore · app.pyfront"
- [x] **FileTree** · `src/ui/FileTree.tsx:122` · @937,372 <!--c:espvd3@2026-09-02-->
      Formate
      > "frontendDockerfile · package.json · .dockerignore · server.jscreate this"

## Slide 21 · c1-build-where
<!-- Where you must be standing -->

- [x] **SlideLead** · `src/ui/SlideLead.tsx:92` · @453,214 <!--c:79m8ws@2026-09-02-->
      Change workding more professionally. What is stand inside folder?
      > "Stand inside the frontend folder before you build. A build can only see the files in the f"

## Slide 19 · c1-build
<!-- docker build -->

- [x] **slide** <!--c:93g162@2026-09-01-->
      From inside the frontend folder, because a build must only ever see its own app's files
      This points should be clearly explained by presenting filet tree and terminal path parallel would help to  provide clear explantion
- [x] **Terminal** · `src/ui/Terminal.tsx:88` · @671,503 <!--c:8hb0ki@2026-09-01-->
      the . should be highlighed
      > "Terminal · the frontend build"
- [x] **slide** <!--c:3arrpt@2026-09-01-->
      make 2 slides

## Slide 20 · c1-run
<!-- docker run -->

- [x] **Callout** · `src/ui/Callout.tsx:59` · @574,541 <!--c:7w9uhl@2026-09-01-->
      One image, one container, two printed lines
      add a bit more explanation to make students understand
      This can be divided in to 2 points
      > "It printed its message and finished, exactly as the Python container did. A container live"

## Slide 22 · c1-two-images
<!-- Two images of your own -->

- [x] **slide** <!--c:vonesj@2026-09-01-->
      So how do we run them together?
      make this as a seperate point as it is quesiton
- [x] **Callout** · `src/ui/Callout.tsx:59` · @549,615 <!--c:ek8a6p@2026-09-01-->
      this callout conatiner is overlapping with company logo
      > "nxttrendz-backend and nxttrendz-app show the same IMAGE ID: the code is identical, so Dock"

## Slide 24 · c2-by-hand
<!-- What it actually takes -->

- [x] **slide** <!--c:fvzl3b@2026-09-01-->
      Remove `Starting the application by hand means all of this`
- [x] **Callout** · `src/ui/Callout.tsx:59` · @462,563 <!--c:h7izry@2026-09-01-->
      Remove `The error that cost the room twenty minutes last session: path "." not found`
      DOnt mention the time or last session
      > "The error that cost the room twenty minutes last session: path '.' not found"

## Slide 29 · c2-remember
<!-- What must be remembered -->

- [x] **slide** <!--c:qigw2s@2026-09-01-->
      Remove `Correctly, every single time, with nothing to check it against1
- [x] **ContentSlide** · `src/slides/ContentSlide.tsx:75` · @865,263 <!--c:uoqfc9@2026-09-02-->
      Un blur the if you get it wrong section
      > "DetailIf you get it wrongWhich folder each build runs fromThe build fails, or builds the w"

## Slide 30 · c2-does-not-scale
<!-- A real app is bigger -->

- [x] **slide** <!--c:2xtbx0@2026-09-01-->
      Dont just provide statements. explain clearly
      Six commands run two containers. Four containers is the normal shape of a real application
      you can divide slide in to multiple dut dont give as riddles to students
- [x] **Card** · `src/ui/content.tsx:128` · @706,422 <!--c:ne3645@2026-09-02-->
      A Independent Database ? why like this as we are using sqlite
      > "A database to store the data, and a cache to keep reads fast. Two more containers"

## Slide 27 · c2-the-question
<!-- The question -->

- [x] **slide** <!--c:0wfzjd@2026-09-01-->
      use question slide not just text

## Slide 33 · c2-orchestra
<!-- Picture an orchestra -->

- [x] **slide** <!--c:c5b9a0@2026-09-01-->
      A single musician can start playing on their own. An orchestra cannot
      Add more explanaiton not just statement and dont add 2 much text
- [x] **SlideLead** · `src/ui/SlideLead.tsx:92` · @590,176 <!--c:vwhlqn@2026-09-02-->
      Explain more clearly
      > "A single musician can start playing on their own. An orchestra cannot"

## Slide 29 · c2-what-is-compose
<!-- What is Docker Compose -->

- [x] **Callout** · `src/ui/Callout.tsx:49` · @108,266 <!--c:c8qk5l@2026-09-01-->
      use white docker icon

## Slide 30 · c2-declarative
<!-- Commands to a file -->

- [x] **SlideLead** · `src/ui/SlideLead.tsx:77` · @408,190 <!--c:q15j86@2026-09-01-->
      Remove A single musician can start playing on their own. An orchestra cannot
      > "The shift in thinking, and you have made this exact shift once before"

## Slide 36 · c2-what-changes
<!-- What changes, what does not -->

- [x] **DataTable** · `src/ui/DataTable.tsx:106` · @774,250 <!--c:4056ew@2026-09-02-->
      unblur the Changes section
      > "Changes"

## Slide 39 · c3-create
<!-- Create the file -->

- [x] **slide** <!--c:vnglmz@2026-09-02-->
      No need to create file from terminal lets just create normal in vs code remove those comands and provide naming convintion

## Slide 40 · c3-yaml
<!-- What is YAML -->

- [x] **slide** <!--c:xcnyp7@2026-09-01-->
      Content is not aligned and provided orger of YAMl and python content is swapped please check
- [x] **YamlNesting** · `src/ui/YamlNesting.tsx:104` · @352,296 <!--c:jesoyt@2026-09-02-->
      No proper space take screenshot and check this slide container are totally misaligned
      > "becomes"

## Slide 41 · c3-services
<!-- services -->

- [x] **SlideLead** · `src/ui/SlideLead.tsx:92` · @414,216 <!--c:jstpbm@2026-09-02-->
      Make the Statement Clearly, this is not clear
      > "The top-level section. Every container an application needs is one service"

## Slide 42 · c3-build-key
<!-- build -->

- [x] **slide** <!--c:my8u37@2026-09-02-->
      Sentences are not at clear

## Slide 48 · c3-prediction
<!-- A prediction -->

- [x] **slide** <!--c:uwey9a@2026-09-02-->
      change this to the questions slide and remove say yes or no before the next slide
      instead provide 2 containers having to say yes  no

## Slide 51 · c3-volumes
<!-- volumes -->

- [x] **CodeBlock** · `src/ui/CodeBlock.tsx:208` · @251,612 <!--c:gzpnp1@2026-09-02-->
      is this volume block having corrent as db_data: is empty
      > "volumes:"

## Slide 65 · c4-localhost
<!-- localhost is not the other container -->

- [x] **slide** <!--c:vnuawo@2026-09-02-->
      No context is provided, explain like IN the output we got frontend-1  | Backend address: http://backend:8000
      it should be localhost ryt by why we are getting backend?
