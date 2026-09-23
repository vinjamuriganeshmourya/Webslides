<!-- cSpell:ignore nxttrendz deployement NxtWave colour Mumbai ap-south CIDR sshagent gunicorn Kubernetes usermod corsheaders runserver eipalloc -->
# Deployment · Session 10: "Deploying Your App on AWS"

**STATUS: revision 3. Deck built, 138 slides.** Revision 1 was written before the
hands-on and predicted the flow. **This revision replicates the flow as it
actually ran on 2026-09-16**, beat for beat, with the capture that proves each
one. Revision 1 is kept beside this file as `plan.rev1.md`.

Companion documents in this folder:

| File | What it is |
|---|---|
| `reading-material.md` | the learner-facing text, screenshot by screenshot |
| `illustrations.md` | every figure in this deck, specified (written at §12) |
| `plan.rev1.md` | the pre-run prediction, kept for the diff |

Captures and transcripts: `django_deployement_course/workflow/captures/session-10/`,
indexed by `MANIFEST.md`. Architecture diagrams in its `diagrams/` folder.

## 0. What this session is, in one line

The images are on Docker Hub, the server is on AWS, and nothing connects them.
This session connects them, discovers that a working app on a laptop is not a
working app on the internet, fixes the three things that differ, and then moves
the build server itself into AWS so no laptop is left in the loop.

## 1. The rule that shapes every hands-on slide

Instruction, 2026-09-16: *"build AWS Architecture images before building any
instance or using any service for more clarity"*, and *"I want illustration
explanation, all must be conveyed represented in illustration"*.

**Nothing is created until the room has seen a picture of what is about to
exist, and what it will cost in resources.** The order on every hands-on beat
is fixed:

```
   1. the requirement          what we need, named, with its size
   2. the architecture state   where it sits in the growing picture
   3. the console              the real screen, full width, highlighted
   4. the proof                the terminal or browser saying it worked
```

A beat that skips step 1 or 2 is not finished. §12 lists the figures.

## 2. Inputs

| | |
|---|---|
| The run | Executed end to end on 2026-09-16 against the user's own AWS account. 47 captures, 15 transcripts, 8 architecture diagrams |
| The app | `/home/nxtwave/nxttrendz`, read on 2026-09-16. **The app is the authority, not the TR.** §3 lists where they disagree |
| TR | `10_deploying_docker_on_aws_ec2.md` §4 to §6 and `11_aws_ec2_security_and_networking.md` §2 to §6 |
| Already spent | TR 10 §1 to §3 and TR 11 §4.1, §4.2 went into session 9. Region, VPC, subnet and instance are never re-taught |
| Audience | Same room as session 9. Its five beginner rules carry over |
| Session app | `deployement_session_10/`, `devPort` 5221, `htmlName` `deployment-session-10` |
| Figure lab | `slide-kit/deploy-lab/`, `devPort` 5238. **To be created**, see §12.1 |

## 3. Where the TR is wrong for this course

| | The TR says | The app does |
|---|---|---|
| Services | `web` plus a `db` postgres container | `backend` on 8000, `frontend` on 3000 |
| Database | PostgreSQL on 5432 | SQLite in the volume `db_data` at `/app/data`. No container, no port |
| `.env` | database credentials and `ALLOWED_HOSTS` | `SECRET_KEY`, and nothing else |
| `ALLOWED_HOSTS` | read from `.env`, must gain the IP | hardcoded `["*"]`. **Nothing to change** |
| Pipeline | four stages including Test | **three**: Checkout, Build, Push. Deploy makes four |
| Servers | one | **two**, once Jenkins moves to EC2 |

The TR's `ALLOWED_HOSTS` material is dropped. In its place are three problems
the TR never mentions, all real, all load-bearing, and all of which happened:

- **P1 · port 3000 has no rule.** Session 9 opened 22 and 8000. The site cannot
  load. Opens concept 4.
- **P2 · `VITE_API_BASE_URL` says `localhost:8000`.** The frontend runs in the
  *visitor's* browser, so localhost is their laptop. Fails **refused**, which
  is half of the timeout-versus-refused decoder, live.
- **P3 · `CORS_ALLOWED_ORIGINS` is hardcoded inside the image.** Cannot be
  fixed on the server. Forces a real release through the pipeline, which is
  what makes concept 6 more than a lecture.

## 4. Concept map, seven concepts

| # | Concept (agenda) | Beats | The one picture it owns |
|---|---|---|---|
| 1 | `Logging In` | 6 to 16 | `KeyAndDoor`, the .pem as the only way in |
| 2 | `Docker on the Server` | 17 to 25 | `EmptyMachine`, a fresh Ubuntu filling up |
| 3 | `Running the Stack` | 26 to 35 | `BuildVsImage`, why the server never builds |
| 4 | `Security Groups` | 36 to 55 | `DoorList`, the instance edge with its doors |
| 5 | `A Permanent Address` | 56 to 67 | `AddressTag`, loose luggage tag becoming a pinned plate |
| 6 | `Jenkins on AWS` | 68 to 92 | `TwoServers`, the VPC with both machines |
| 7 | `Shipping a Fix` | 93 to 110 | `LastMile`, the gap the pipeline does not cross |

**Concepts 6 and 7 are the other way round from the order the hands-on ran in,
and revision 3 swapped them deliberately.** Two reasons, both about the room
rather than about the technology, and §4a has the detail.

Rule 20: Key Takeaways restates exactly these seven names.

## 4a. Why Jenkins moves to AWS **before** the CORS fix

The hands-on ran in the other order: the Deploy stage was added to the laptop
Jenkins, and then Jenkins moved to EC2 and everything was built again. That is
what happened, and it is the wrong thing to teach.

**Reason one: the student's webhook is probably already dead.** Session 8 gives
every student an ngrok tunnel, and a free ngrok URL changes every time the
tunnel restarts. Between session 8 and session 10 that has almost certainly
happened. A concept that opens with "push, and watch your pipeline build" will
fail for most of the room, for a reason that has nothing to do with the lesson.
Moving Jenkins to a permanent address first removes that failure mode
completely, and the dead tunnel becomes the *motivation* rather than a blocker.

**Reason two: the setup would otherwise be done twice.** The SSH Agent plugin,
the Docker Hub credential, the SSH credential and the job all live in a Jenkins
volume and none of it transfers. Adding the Deploy stage on the laptop and then
rebuilding it on EC2 is roughly fifteen minutes of identical clicking, twice,
and a room that has just done something twice stops believing the second time
mattered.

So the order is: fix the app's address, move the build server, then ship the
code fix through the pipeline that will carry every fix after it.

The cost is that the room sits with a visibly broken product list for the whole
of concept 6. **That is a feature.** The bug is named at the end of concept 5,
the room knows exactly what it is, and concept 6 opens by saying that before we
can fix it we need a pipeline we can trust.

## 5. The spine, as it actually ran

Every beat below happened. A beat marked **[R]** needs a requirement frame, a
beat marked **[A]** needs an architecture state, and **[C]** names its capture.

### Opening

1. Where we left off. The instance stopped, two images on Docker Hub.
2. **[A]** `arch-02-the-gap`. Two boxes, no line. The session in one picture.
3. **[R]** What we require, the whole bill of materials. **[A]** `arch-01-what-we-require`.
   Both servers, instance type, disk, VPC, subnet, every port, side by side.
   This frame is the answer to every "why are we doing this" for the next hour.
4. Start the instance. **[C]** `dep-01`, `dep-02`.
5. **The address changed again.** Fourth in two sessions. **[C]** `dep-04`.
   Named, not opened. Concept 5 opens it. Hard rule 4.
6. Agenda, seven concepts.

### Concept 1 · Logging In

7. Question: you closed the browser tab. How do you get back in?
8. Session 9 used the browser Connect button. That is AWS's convenience.
9. SSH is Secure Shell, in one line. Figure `KeyAndDoor` state 1.
10. **[R]** What this needs: the running instance, the `.pem`, port 22 from
    your address. All three already exist. **[A]** `arch-03-ssh-in`.
11. Where the `.pem` went when it downloaded itself.
12. **Failure 1.** `WARNING: UNPROTECTED PRIVATE KEY FILE`. **[C]** transcript 01.
13. `chmod 400`, in words. Figure `Permissions`, three readers, two crossed out.
14. Connect again. It works. **[C]** transcript 02.
15. The command in three parts: identity file, user, address. Why `ubuntu`.
16. **The prompt is the proof.** `ubuntu@ip-172-31-7-32` is the private address,
    on a machine in Mumbai. **[C]** transcript 03. Recap.

### Concept 2 · Docker on the Server

17. Question: the images are on Docker Hub and you are on the server. What is
    missing?
18. `docker --version` says command not found. **[C]** transcript 04.
19. **[R]** What this needs: outbound internet, which is open by default and is
    therefore not a step. Plant for beat 44.
20. `apt-get update`, then the install. One table, three commands.
21. `usermod -aG docker ubuntu`, and why nothing changes until you `exit`.
    Figure `GroupOnLogin`, a badge checked at the door.
22. Reconnect. Docker 29.1.3, Compose 2.40.3. **[C]** transcript 05.
23. **[A]** `arch-04-containers`. Pull both images. **[C]** transcript 06.
24. **The server has never seen your source code.** No clone, no build. This is
    what session 6 was for. Figure `RegistryHandoff`.
25. Recap.

### Concept 3 · Running the Stack

26. Question: the images are here. What starts them?
27. **How you create a file on this machine**: `nano`, broken down, and the
    two key combinations that save and close. Before any file is shown, not
    after: the room cannot type a file it has not been told how to open.
28. Session 4's compose file, with one word changed per service.
29. **`build:` becomes `image:`**, and why. Figure `BuildVsImage`: two paths,
    one ending in "something no pipeline tested".
30. The `.env` holds `SECRET_KEY` and nothing else. Said explicitly so nobody
    hunts for database credentials that do not exist.
31. `docker compose up -d`, `ps`. Both listening. **[C]** transcript 08.
32. Fresh volume means empty database. `migrate`. **[C]** transcript 09.
33. **The moment, attempted.** Open `http://<address>:3000`.
34. **Failure 2. It times out.** **[C]** `dep-05`. Concept 4 opens on it.
34a. `curl` broken down, straight after the two-port demo that used it, so
    the explanation lands on a command the room has just watched run.
35. Recap, honest: it is running, and it is not reachable.

### Concept 4 · Security Groups

36. Question: the containers are up and the page will not load. Who says no?
37. Session 9 called it the door list. Its real name and job.
38. Default deny inbound. Figure `DoorList` state 1, every door shut.
39. Allow rules only. There is no block rule.
40. Outbound is open by default.
41. **Which is why `docker pull` worked.** Collect the plant from beat 19.
42. The anatomy of a rule: type, port, source.
43. CIDR, just enough. `/32` is one address, `/0` is every address. Figure
    `CidrRuler`, a bar shrinking from all addresses to one.
44. The three rules the server actually had. **[C]** `dep-06`.
45. Port 3000 is not among them. That is the whole failure.
46. **[R]** What this needs: one rule. Nothing is created, nothing restarts.
47. Add it. **[C]** `dep-07`, `dep-08`.
48. **A real snag:** choosing Anywhere-IPv4 does not fill the source box, and
    Save refuses. **[C]** `dep-09`. Type `0.0.0.0/0`.
49. Save. Four rules. **[C]** `dep-11`.
50. **Rules apply immediately.** The hanging tab loaded while the banner was
    still up. **[C]** `dep-12`. **[A]** `arch-05-doors-open`.
51. **Failure 3, named not opened.** The product list is empty. Concept 6.
52. Justify every door, one row each.
53. **The database has no door**, because it is a file in a volume. Figure
    `NoDoorAtAll`. Plus the warning for the day it becomes PostgreSQL.
54. Timeout against refused. Two rows. Both were seen today.
55. The gotcha: you changed networks, your IP moved, SSH times out. Recap.

### Concept 5 · A Permanent Address

56. Question: what happens to the address next time the instance stops?
57. It already happened four times. The four addresses, in order, with the
    private one unchanged beside them. Figure `AddressTag` state 1.
58. **Why not just use the free public address?** The question the room asks.
59. Because the address is **written down in three places**, and this session
    has already written two of them. Figure `ThreePlaces`.
60. **The middle one settles it:** it is baked into a Docker image. Changing it
    is a commit, a build, a push and a redeploy. Not an edit.
61. **[R]** What this needs: one Elastic IP, allocated then associated.
    **[A]** `arch-06-elastic-ip`.
62. Allocate. **[C]** `dep-15`, `dep-16`. Note the empty Associated column:
    that is the billable state.
63. Associate. **[C]** `dep-18`, `dep-19`.
64. The old address died instantly. `HTTP 200` became `HTTP 000`.
65. The billing quirk: attached is free, idle is billed. Release what you do
    not use.
66. Point the frontend at it, `up -d`. **Half of Failure 3 is fixed** and the
    list is still empty.
67. Named, not opened: a domain in front of the address, HTTPS in front of
    that. Recap.

### Concept 6 · Jenkins on AWS

68. Question: where is Jenkins running right now?
69. On a laptop. And GitHub cannot reach a laptop, which is why session 8 needed
    ngrok. Figure `NgrokDetour`, drawn as the long way round it is.
70. **Check your tunnel.** A free ngrok URL changes every time it restarts, so
    for most of the room the webhook in GitHub is already pointing at nothing.
    Have them look. This is the motivation, and it is real.
71. **[R]** What we require: a second instance. Full spec, and **20 GiB not 8**,
    because Docker builds accumulate. **[A]** `arch-07-jenkins-joins`.
72. **What this costs.** The free tier is 750 instance hours a month. Two
    instances running together spend it twice as fast. Say it plainly.
73. Launch it. **[C]** `jen-01`.
74. `jenkins-sg`, both rules scoped to My IP for now. **[C]** `jen-02`.
75. Storage to 20 GiB. **[C]** `jen-03`.
76. Two instances in one list. **[C]** `jen-05`.
77. **Swap, and why.** 908 MiB of RAM, Jenkins idles at 436, leaving 133 free.
    Figure `MemoryBar`, measured, not decorative.
78. Docker, then Jenkins in a container, then the Docker CLI inside it.
79. Unlock it. **[C]** `jen-08`.
80. **Nothing transfers.** Plugins, credentials and jobs live in the old volume.
    A table of what to recreate, and this is the only time it is done.
81. The Docker Hub credential. **Session 8 told you to delete that token**, so
    this needs a new one. ID exactly `dockerhub-credentials`.
82. **The ID is the name the pipeline calls.** Leave it blank and Jenkins
    invents a UUID and the build fails. Figure `IdIsTheName`. This happened
    during capture.
83. The SSH Agent plugin, which is not installed by default. **[C]** `dep-23`, `dep-24`.
84. The `ec2-ssh-key` credential, the `.pem` pasted whole. **[C]** `dep-25`, `dep-26`.
85. The job, pointed at the same repository.
86. **[R]** The build server needs a permanent address, and for a sharper reason
    than the app server had: **the webhook is configured to point at it.** A
    moving address breaks the hook silently, and nobody notices until a push
    does not build.
87. Allocate a second Elastic IP and associate it. Same two clicks as concept 5,
    and the old address dies the same instant.
88. **Three places, not one.** The webhook, Jenkins's own record of its URL under
    `Manage Jenkins → System`, and later the Jenkinsfile. Missing the middle one
    leaves Jenkins emailing links to a dead address.
89. **[R]** GitHub must reach Jenkins, and `jenkins-sg` only allows you. GitHub
    publishes its ranges at `api.github.com/meta`.
90. Four rules on 8080. **[C]** `jen-09`, `jen-10`.
91. Repoint the webhook. The trailing `/github-webhook/` matters.
92. Push anything. **The build runs, entirely inside AWS.** **[C]** `jen-11`.
    The hook log proves both halves: the delivery, and the rule that allowed it.
    `140.82.115.248` sits inside `140.82.112.0/20`. **[C]** `jen-17`. **ngrok is
    gone.** Recap.

### Concept 7 · Shipping a Fix

93. Back to the empty product list from concept 5. The browser console names it:
    blocked by CORS policy. **[C]** `dep-20`.
94. Before the Elastic IP it said something different: `ERR_CONNECTION_REFUSED`
    against `localhost:8000`. **[C]** `dep-13`. **Refused, not timed out**, and
    beat 54's decoder explains why in one line.
95. Why: the frontend runs in the **visitor's** browser. Figure `WhoseLocalhost`.
96. **This one cannot be fixed on the server.** It is in `settings.py`, and
    `settings.py` is inside the image. Figure `InsideTheImage`.
97. So the fix goes where every change has gone since session 7: the source.
    One line, naming your own Elastic IP.
98. Commit, push.
99. The webhook fires. Three stages green. Tag on Docker Hub **40 seconds after
    the push**.
100. **And nothing changed on the server.** Still the old tag. **[C]** transcript 11.
101. **Failure 4, the honest one.** A human SSHes in, edits a tag, runs `up -d`.
     Do it on camera, once. **[C]** transcript 12. Figure `LastMile`.
102. The list fills. **The app works end to end on the public internet.**
     **[C]** `dep-22`.
103. Now kill the manual step. Make the tag a variable: `${IMAGE_TAG}` in the
     compose file, `IMAGE_TAG=` in `.env`. Figure `TagAsVariable`.
104. **[R]** What this needs: nothing new. The plugin and the credential were
     added in concept 6, which is the whole reason they were done there.
105. The Deploy stage, built up line by line: `sshagent`, ssh, sed, pull, up.
118. **It targets the private address**, `172.31.7.32`, because both machines
     are in the same VPC.
119. **Add the rule whose source is a security group**, not an address.
     **[C]** `jen-06`, `jen-07`. Figure `GroupAsSource`.
120. Why that is better: replace the build server and nothing needs re-pinning.
121. `StrictHostKeyChecking=no`, and why it is there.
116. Push. **Four stages green, and nobody touched the server.** **[C]** `dep-29`.
     Recap.

### Closing

117. The job has been called `build-test` since session 8, which removed the
     Test stage. Rename it. **[C]** `jen-13` to `jen-16`.
118. Build history survives, and so does the webhook, because GitHub matches on
     the repository URL and not the job name.
119. **[A]** `arch-08-finished`. The whole system, one picture. The only manual
     step marked.
120. Continuous Deployment. The full term from session 7, now earned.
121. What each layer removed. Ten rows.
116. The hardening checklist, ten rows, each naming the session that taught it.
117. **Stop both instances and release the Elastic IP before you leave.**

     Dropped in review: a separate "what is still not production" slide. The
     hardening checklist above it already names every one of those items and
     says which session answers it, so the extra slide only repeated the list.
119. Key takeaways: the seven concept names.
120. Practice.
121. Where this leads. Feedback. Thank you.

## 6. Decisions to confirm at sign-off

| # | Decision | Recommendation | Why |
|---|---|---|---|
| D1 | Seven concepts, with `Jenkins on AWS` as its own | **Yes** | It is a second machine, a second security group and a different problem. Folding it into concept 6 would bury the payoff |
| D2 | Teach the CORS bug rather than pre-fixing it | **Teach it** | The only place in the course where a code change, a pipeline run and a live server meet on one frame |
| D3 | Teach the credential-ID trap | **Yes, one frame** | It happened during capture and costs a confusing failed build otherwise |
| D4 | Show the security-group-as-source rule | **Yes, it is the best idea in the session** | It is how real multi-server setups talk, and the TR mentions it only in passing |
| D5 | The `t3.micro` memory finding | **On a slide, with the numbers** | The room will hit it. Better they expect it |
| D6 | Quiz frames | **None**, as in sessions 8 and 9 | Third running. Propose recording it as a course rule |
| D7 | Length | **No cap.** 121 beats lands near 140 to 150 slides | Standing instruction to elaborate |
| D8 | A new figure lab | **Yes, `slide-kit/deploy-lab`** | §12.1. Fourteen new figures is too many to prototype inside the deck |

## 7. Still open

- `seed.json` is untracked in the app repo, so Jenkins never builds it into the
  image and a fresh server starts with an empty catalogue. The run seeded it by
  hand. **Either commit it to the app repo before the session, or the deck
  shows the seeding step.** Sign-off decision.

## 8. What the run proved, with numbers

| Claim on a slide | The measurement |
|---|---|
| 8000 was open, 3000 was not | `HTTP 200 in 0.073s` against 8000, `timed out after 15006 ms` against 3000 |
| Rules apply with no restart | the hanging tab loaded while the save banner was still on screen |
| Timeout is the firewall, refused is the app | 3000 timed out through the group; the login POST to `localhost:8000` was refused instantly |
| The old address dies at once | the same curl went `HTTP 200` to `HTTP 000` |
| The pipeline reaches Docker Hub fast, and stops | tag 7 in 40 seconds; the server kept `:6` until a human logged in |
| Jenkins on EC2 closes the loop | build 1, five stages, 2 min 10 sec, Deploy 17 s, to `172.31.7.32` |
| `t3.micro` is tight | 908 MiB total, 436 used at idle, 133 free, 486 MiB of swap already in use |

## 9. The verified constants for `deckShared.tsx`

> **Names only. No resource IDs on a slide or a figure.** User instruction,
> 2026-09-16: *"just name are enough, what are you adding ids"*. An instance ID,
> an AMI ID, a security group ID, a VPC ID and a subnet ID are all noise to a
> learner: they are unique to one account and mean nothing in a classroom. The
> deck prints `nxttrendz-server`, `Ubuntu Server 26.04 LTS`, `nxttrendz-sg` and
> `172.31.0.0/16`. The IDs stay in `MANIFEST.md` for anyone reproducing the run.

| Constant | Value |
|---|---|
| `REGION` / `ZONE` | `ap-south-1`, Asia Pacific (Mumbai) / `ap-south-1b` |
| `VPC_CIDR` | `172.31.0.0/16` |
| `APP_PRIVATE_IP` | `172.31.7.32` |
| `APP_ELASTIC_IP` | `13.202.184.214` |
| `ADDRESSES_IN_ORDER` | `15.207.88.14`, `13.203.216.68`, `65.2.153.167`, `13.127.157.193` |
| `APP_SG` | `nxttrendz-sg` |
| `JENKINS_ELASTIC_IP` / `JENKINS_PRIVATE_IP` | `3.108.1.66` / `172.31.15.67` |
| `WEBHOOK_URL` | `http://3.108.1.66:8080/github-webhook/` |
| `JENKINS_SG` | `jenkins-sg` |
| `JOB_NAME` | `nxttrendz-pipeline` |
| `GITHUB_HOOK_RANGES` | `192.30.252.0/22`, `185.199.108.0/22`, `140.82.112.0/20`, `143.55.64.0/20` |
| `MY_IP_CIDR` | `49.200.108.250/32` |
| `INSTANCE_TYPE` | `t3.micro`, 2 vCPU, 1 GiB |
| `APP_DISK` / `JENKINS_DISK` | `8 GiB gp3` / `20 GiB gp3` |
| `TAGS` | `6` start, `7` the CORS fix by hand, `8` the first auto deploy, `1` the first from AWS |
