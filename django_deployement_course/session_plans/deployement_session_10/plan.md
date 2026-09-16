<!-- cSpell:ignore nxttrendz deployement NxtWave colour Mumbai ap-south-1 t3.micro AMI CIDR sshagent dockerignore gunicorn Kubernetes usermod corsheaders runserver -->
# Deployment · Session 10: "Deploying Your App on AWS"

**STATUS: DRAFT, awaiting sign-off.** The course's final session, and the only
one that ends with a URL anyone can open.

Instruction, 2026-09-16: *"Now the Session 9 is freezed now we need to prepare
final session where we would deploy our application prepare the flow for that
session."*

## 0. What this session is, in one line

The images are on Docker Hub. The server is on AWS. Nothing connects them. This
session connects them, finds out that a working app on a laptop is not a
working app on the internet, fixes the three things that differ, and then makes
the whole trip automatic.

Session 9's closing slide already promised the first half, in these words:
*"The next session logs in to it over SSH, installs Docker and runs your two
images on it."*

## 1. Inputs

| | |
|---|---|
| TR | `/home/nxtwave/docker_jenkins_aws/10_deploying_docker_on_aws_ec2.md` §4, §5, §6 and `11_aws_ec2_security_and_networking.md` §2, §3, §4.3, §5, §6 |
| Already spent | TR 10 §1 to §3 and TR 11 §4.1, §4.2 went into session 9. This session never re-teaches what a Region, a VPC, a subnet or an instance is |
| **The app itself** | `/home/nxtwave/nxttrendz`, read on 2026-09-16. This is the authority, not the TR. §3 lists every place the two disagree |
| Audience | Same room as session 9. Its five beginner rules carry over, restated in §2 |
| Carries forward | Session 9 left `nxttrendz-server` **stopped**, with three inbound rules and an address that had already changed twice. Session 8 left `nxttrendz-backend` and `nxttrendz-frontend` on Docker Hub under `jeevansravanth`, pushed by a **three-stage** pipeline: Checkout, Build, Push |
| Session app | `django_deployement_course/deployement_session_10/`, `devPort` 5221, `htmlName` `deployment-session-10` |
| Constants | A `deckShared.tsx` that repeats session 9's values exactly and adds the Elastic IP, the two image names and the Jenkins credential ID |

## 2. The beginner rules, carried over from session 9

1. **One new word per slide.** SSH, CIDR, Elastic IP, sshagent and inbound rule
   each get a frame of their own.
2. **Every acronym is expanded once**, in the lead, on the slide that owns it.
   SSH is Secure Shell. CIDR is Classless Inter-Domain Routing.
3. **Question, then answer.**
4. **Every concept closes with one line per idea**, in the divider's own words.
5. **Anchor every new idea to something the room already owns.** The `.pem` to a
   house key. The security group to session 9's door list. The Deploy stage to
   the Push stage the room wrote in session 8. CORS to session 1, where the room
   already met it as the security guard at the gate.

And one rule this session adds, because it is what makes the session teach:

6. **Every failure on a slide really happened during capture.** Five are planned
   into the flow. None is invented, and none has to be arranged: they all occur
   if we do nothing to prevent them. If one does not reproduce, the slide goes.

## 3. Where the TR is wrong for this course, and what is true instead

The TR's worked example is one Django service plus a PostgreSQL container with
a `.env` full of database credentials. **The course never built that.** Reading
`/home/nxtwave/nxttrendz` on 2026-09-16 gives the truth:

| | The TR says | The app actually does |
|---|---|---|
| Services | `web` plus `db` (postgres:16) | `backend` on 8000, `frontend` on 3000. No database container |
| Database | PostgreSQL on 5432 | SQLite in the named volume `db_data` at `/app/data` |
| `.env` | `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `ALLOWED_HOSTS` | `SECRET_KEY`, and nothing else |
| `ALLOWED_HOSTS` | Read from `.env`, must gain the public IP | Hardcoded `["*"]` in `settings.py`. **Nothing to change** |
| Pipeline | Four stages including Test | **Three**: Checkout, Build, Push. Session 8 removed Test on instruction |
| Image tag | `:42` | `$BUILD_NUMBER`, on both images |
| The app server | implied production | `manage.py runserver` and the Vite dev server. Both are development servers |

**The TR's `ALLOWED_HOSTS` beat is deleted.** It would be a slide teaching a fix
for a problem this app does not have.

In its place, three problems the TR never mentions, all of them real, all of
them load-bearing:

**P1 · Port 3000 has no rule.** Session 9 opened 22 and 8000. The site will not
load at all until this session adds 3000. Free failure, and it is the perfect
opening for the security group concept.

**P2 · `VITE_API_BASE_URL` still says `http://localhost:8000`.** The frontend
runs in the *student's browser*, so `localhost` is the student's own laptop, not
the server. Verified fixable at run time: the frontend image runs `npm run dev`,
the Vite dev server reads `VITE_API_BASE_URL` from the process environment, and
`vite.config.js` already sets `host: '0.0.0.0'` and `allowedHosts: true`. So
editing the compose file on the server and running `up -d` is a genuine fix,
with no rebuild.

**P3 · `CORS_ALLOWED_ORIGINS` is `["http://localhost:3000"]`, hardcoded in
`settings.py`.** Once the frontend is served from `http://<address>:3000`, the
browser sends that origin, `corsheaders` does not allow it, and every API call
is blocked. The product list stays empty even after P2 is fixed.

**P3 is the gift of this session.** It cannot be fixed on the server, because
the setting is baked into the image. Fixing it means editing the source, pushing
to GitHub, letting Jenkins build a new tag, and getting that tag onto the
server. That is not a detour from the pipeline lesson. **It is the pipeline
lesson, with real stakes**, and it turns TR 10 §6.1's assertion that "one manual
step snuck back in" into something the room feels rather than reads.

It also gives the Elastic IP a reason better than convenience: **the address is
about to be written into source code**, so it had better stop changing first.
That reorders the session, and the order is in §5.

## 4. Concept map

| # | Concept name (agenda) | What it covers | Source |
|---|---|---|---|
| 1 | `Logging In` | Start the stopped instance, SSH, the `.pem`, `chmod 400`, the unprotected-key error, the prompt that proves you are elsewhere | TR 10 §4 |
| 2 | `Docker on the Server` | A fresh Ubuntu has no Docker, the install, `usermod -aG docker`, log out and back in, pull both images | TR 10 §5.1, §5.2 |
| 3 | `Running the Stack` | `image:` not `build:` and why, `docker compose up -d`, and a site that will not load | TR 10 §5.3, §5.4 |
| 4 | `Security Groups` | Default deny, allow rules only, outbound open, the anatomy of a rule, CIDR, add port 3000, justify every door, timeout against refused | TR 11 §2, §3 |
| 5 | `A Permanent Address` | The address moved again, Elastic IP, associate it, point the frontend at it, the billing quirk | TR 11 §4.3 |
| 6 | `Shipping a Fix` | The empty product list, CORS from session 1, the source change, the manual last mile, the Deploy stage that kills it, the finished architecture | TR 10 §6, TR 11 §5, §6 |

Rule 20: Key Takeaways restates exactly these six names.

## 5. The spine, in order, with every failure marked

**Opening block, before the agenda**

1. Where we left off. The instance, stopped. Two images, on Docker Hub.
2. The gap, in one picture. Two boxes, no line between them.
3. Start the instance. `EC2 → Instances → Instance state → Start instance`.
4. **The address changed again.** Third address in two sessions. Named as a
   problem, not opened. Concept 5 opens it. Hard rule 4.
5. Agenda, six concepts.

**Concept 1 · Logging In**

6. Question: you closed the browser tab. How do you get back in?
7. Session 9 used the browser Connect button. That is AWS's convenience. Every
   Linux server on earth is administered the other way.
8. SSH is Secure Shell, in one line.
9. The `.pem` file is the key. Where it landed when it downloaded itself.
10. **Failure 1.** `ssh -i nxttrendz-key.pem ubuntu@<address>` with the file as
    it downloaded. `WARNING: UNPROTECTED PRIVATE KEY FILE`. Read the message,
    it says exactly what is wrong.
11. `chmod 400`, in words rather than a permissions table.
12. Connect again. It works.
13. The command, one part at a time: identity file, user, address. Why the user
    is `ubuntu` and not root.
14. **The prompt is the proof.** `ubuntu@ip-172-31-7-32` is session 9's private
    address, on a machine in Mumbai. `exit` comes home.
15. Recap of concept 1.

**Concept 2 · Docker on the Server**

16. Question: the images are on Docker Hub and you are on the server. What is
    missing?
17. `docker --version` says command not found. A fresh Ubuntu has nothing.
18. `sudo apt-get update`, then `sudo apt-get install -y docker.io docker-compose-v2`.
19. `sudo usermod -aG docker ubuntu`, and why nothing changes until you `exit`
    and come back.
20. Reconnect. `docker --version` answers.
21. `docker pull jeevansravanth/nxttrendz-backend:<tag>`, then the frontend.
22. **The server has never seen your source code.** No clone, no build. This is
    what session 6 was for.
23. Plant, one line on slide 21's frame: the pull needed no firewall change.
    Collected on slide 40.
24. Recap of concept 2.

**Concept 3 · Running the Stack**

25. Question: the images are here. What starts them?
26. The `docker-compose.yml` from session 4, with one word changed per service:
    `build:` becomes `image:`.
27. Why. The server runs what the pipeline built. A server that builds its own
    variant deploys something no pipeline ever tested.
28. Write it on the server with `nano`. The file, built up.
29. The `.env` carries `SECRET_KEY`, and that is all it carries. One slide, so
    nobody goes looking for database credentials that do not exist.
30. `docker compose up -d`. `docker compose ps`, both containers up.
31. **The moment, attempted.** Open `http://<address>:3000` from a phone.
32. **Failure 2. It spins, then times out.** Concept 4 opens on this. Not fixed
    here.
33. Recap of concept 3, honest: it is running, and it is not reachable.

**Concept 4 · Security Groups**

34. Question: the containers are up and the page will not load. Who is saying no?
35. Session 9 called it the door list. Its real name and its job.
36. Default deny for inbound. Nothing is open until you open it.
37. Allow rules only. There is no block rule. Everything unlisted is blocked.
38. Outbound is open by default.
39. **Which is why `docker pull` worked.** Collect the plant from slide 23.
40. The anatomy of a rule: type, port, source.
41. CIDR, just enough. `/32` is one address, `/0` is every address. Nothing else.
42. The three rules the instance has, read off the console.
43. Port 3000 is not among them. That is the entire failure.
44. Add the rule. `EC2 → Security Groups → nxttrendz-sg → Edit inbound rules`.
45. Save. Rules apply immediately, no restart.
46. Reload. **The site loads.**
47. **Failure 3. The product list is empty.** Named here, opened in concept 6.
    The doors are the right subject for this concept and this is not a door
    problem.
48. Justify every door: 22 from your IP, 3000 and 8000 to the world.
49. The database has no door, because it is a file in a volume that only the
    backend can reach. And the warning for the day someone swaps in PostgreSQL:
    a database port never belongs in an internet-facing group.
50. Timeout against refused, as a two-row decoder. Timeout is the firewall.
    Refused is the app.
51. The gotcha: you changed networks, your IP moved, SSH times out. Edit the
    rule, My IP again.
52. Recap of concept 4.

**Concept 5 · A Permanent Address**

53. Question: what happens to the address the next time the instance stops?
54. It has already happened twice, and the room watched it in session 9.
55. An Elastic IP is an address you reserve and keep.
56. Allocate it. `EC2 → Elastic IPs → Allocate Elastic IP address`.
57. Associate it with the instance.
58. **The reason it had to happen before the next concept**: the address is
    about to be written into source code that gets built into an image.
59. Point the frontend at it. `VITE_API_BASE_URL` in the server's compose file
    stops saying `localhost` and names the Elastic IP. `up -d`.
60. **Half of Failure 3 is now fixed**, and the list is still empty. The request
    now reaches the server. Something else is refusing it.
61. The billing quirk: attached is free, allocated and idle is billed. Release
    what you do not use.
62. Named, not opened: a domain name in front of the address, HTTPS in front of
    that.
63. Recap of concept 5.

**Concept 6 · Shipping a Fix**

64. The browser console, on capture. The word the room already knows, from
    session 1: blocked by CORS policy.
65. Why. The backend's allowed origin list still says `http://localhost:3000`.
    The browser is now on the Elastic IP.
66. **This one cannot be fixed on the server.** It is in `settings.py`, and
    `settings.py` is inside the image.
67. So the fix goes where every change has gone since session 7: the source.
    Edit `CORS_ALLOWED_ORIGINS`, commit, push.
68. The webhook fires. Jenkins builds `:N`, pushes both images. Three stages
    green.
69. **And nothing changes on the server.** The pipeline stops at Docker Hub.
70. **Failure 4, the honest one.** A human SSHes in, edits a tag, runs `up -d`.
    Do it, on camera, once. That is the last mile, carried by hand.
71. Reload. The product list fills. **The app works, end to end, on the public
    internet.**
72. Now kill the manual step. A fourth stage.
73. Jenkins needs the `.pem`. The same credentials store as session 8's Docker
    Hub token, a different kind: SSH Username with private key.
74. Add the credential.
75. The Deploy stage, built up line by line: `sshagent`, the `ssh` command, the
    pull, the `up -d`.
76. `StrictHostKeyChecking=no`, and why it is there.
77. **Failure 5, if it happens.** Jenkins runs in a container on the laptop and
    reaches EC2 from the laptop's address, which the security group already
    allows on 22. If the deploy is refused, it is this, and the fix is the rule
    the room already knows how to write. Capture it if it occurs, drop the slide
    if it does not.
78. Make any visible change, push, and touch nothing else. Four stages green.
79. Reload the site. The change is live. **No human touched the server.**
80. **The finished architecture, one picture.** Developer, GitHub, Jenkins,
    Docker Hub, EC2, users. The only manual step is `git push`.
81. Continuous Deployment. The full term from session 7, now earned.
82. Recap of concept 6.

**Closing block**

83. The hardening checklist, each line naming the session that taught it, with
    the two rows the TR wrote for PostgreSQL rewritten for this app.
84. What each layer killed. The table from TR 11 §6.2.
85. **What is still not production**, honestly: `runserver` and the Vite dev
    server, `DEBUG = True`, no HTTPS. Named, not opened. This is the bridge to
    slide 88.
86. **Stop your instance, and release the Elastic IP, before you leave.**
87. Key takeaways: the six concept names.
88. Practice.
89. Where this leads: gunicorn behind nginx, a managed database, HTTPS and a
    domain, Kubernetes, monitoring. Every one assumes exactly what you now have.
90. You started on localhost. You are ending on the public internet.
91. Feedback. Thank you.

## 6. Decisions to confirm at sign-off

| # | Decision | Recommendation | Why |
|---|---|---|---|
| D1 | Does the Deploy stage belong in this session? | **Yes, and it is the climax, not an appendix.** | P3 forces a real release through the pipeline. Without concept 6 the session ends with a bug the room cannot fix |
| D2 | Is the CORS bug taught, or quietly pre-fixed before capture? | **Taught.** | It is the only place in the whole course where a code change, a pipeline run and a live server meet on one slide. Pre-fixing it would throw that away to save four frames |
| D3 | Six concepts | **Six.** Beginner rule 1 | A divider costs one frame and gives a lost learner a place to rejoin |
| D4 | Elastic IP before the CORS fix | **Yes.** | The address gets written into source. Fixing CORS first would mean fixing it twice, on camera |
| D5 | The TR's PostgreSQL and `ALLOWED_HOSTS` material | **Dropped.** §3 | Teaching a fix for a problem this app does not have |
| D6 | Terminal content | **`ShellPanel` with real transcripts**, as session 9 used for its SSH session. Console content stays full-screen `AnnotatedShot`, never cropped | Hard rule 3, and the user's 2026-09-16 capture instruction |
| D7 | Quiz frames | **None**, as in sessions 8 and 9 | Third session running. Proposed again: record it as a course rule instead of a per-deck exception |
| D8 | Length | **No cap.** 91 beats lands near 115 to 125 slides at session 9's density | The standing instruction to elaborate wherever it helps |
| D9 | Elastic IP allocated for real? | **Yes, and released at the end of capture.** | Slide 86 has to be true |
| D10 | `DEBUG = True` | **Named on slide 85, not fixed.** | Turning it off needs static file handling, which is a course this one does not contain |

## 7. What has to be true before capture can start

Ordered, because each blocks the next.

1. The two images on Docker Hub run from `image:` alone. Verify on a laptop
   before the server sees it.
2. The instance is started and its address recorded, then replaced by the
   Elastic IP. Every constant in `deckShared.tsx` moves with it.
3. The student's own IP is current in the security group, or SSH times out on
   camera for the wrong reason.
4. Jenkins is running with the session 8 ngrok tunnel live, and the GitHub
   webhook still points at `/github-webhook/`.
5. The `nxttrendz` repo is in the state session 8 left it: three stages, no Test.
6. A branch or a clean commit is ready for the CORS change, so slide 67's diff
   is one line and nothing else.

## 8. Captures needed

| Concept | Console captures | Terminal transcripts | Browser |
|---|---|---|---|
| Opening | Start instance, the new address | none | none |
| 1 | none | Unprotected-key error, `chmod 400`, the connect, the prompt | none |
| 2 | none | `docker --version` failing, install, `usermod`, reconnect, both pulls | none |
| 3 | none | `nano` on the compose file, `up -d`, `ps` | The site timing out |
| 4 | The three rules, Edit inbound rules, the new rule, the four rules | A `curl` that times out, one that answers | The site loading, the empty list |
| 5 | Allocate, Associate, the address attached | `up -d` after the change | The list still empty |
| 6 | Jenkins credential, the three-stage graph, then four stages, the console log | The manual pull, then nothing at all | The CORS error in the console, then the filled list |

Every console capture is full screen and highlighted, never cropped. Every
terminal transcript is real output. The browser console screenshot is a real
error, not a retyped one.

## 9. Notes for whoever picks this up

- **Local `main` has diverged from `origin/main`**, nine commits on one side and
  a merge on the other. This branch is cut from `session/9-introduction-to-aws`,
  which descends from `origin/main`, so the work is on the right lineage. The
  divergence belongs to somebody else and nothing here touches it.
- **The app is the authority, not the TR.** §3 was written by reading
  `/home/nxtwave/nxttrendz` on 2026-09-16. If a slide and the TR disagree, check
  the app before changing the slide.
- **Session name.** "Deploying Your App on AWS" is the working title.
