<!-- cSpell:ignore nxttrendz deployement eipalloc CORS -->
# Session 10 captures

Taken live on 2026-09-16 against the user's own AWS account, by running the
hands-on end to end. Nothing here is composed or retouched. Every console
capture is **full screen at 1568x741**, the same size session 9 used, so the
two decks crop identically.

Filenames are `dep-NN-<what>`. The number is capture order, which is also the
order the session performs them, so a slide can be built from the list top to
bottom without re-deriving the flow.

## The addresses, in order

The instance changed address twice more during this run, which is the evidence
concept 5 is built on.

| When | Public address | Note |
|---|---|---|
| Sessions 9 | 15.207.88.14, then 13.203.216.68, then 65.2.153.167 | three addresses across one session |
| Start of this run | **13.127.157.193** | fourth address, handed out on start |
| After the Elastic IP | **13.202.184.214** | permanent, `eipalloc-0947cde9d5ed8fa6a` |
| Private, throughout | 172.31.7.32 | never changed once |

## Console captures

| File | Plan beat | What it shows |
|---|---|---|
| `dep-01-instance-stopped` | 1, 3 | The instance as session 9 left it. Stopped, t3.micro, ap-south-1b, no public address |
| `dep-02-instance-state-menu` | 3 | Instance state menu open. Start instance enabled, Stop greyed out |
| `dep-03-start-initiated` | 3 | The green confirmation, and Running with the new address |
| `dep-04-running-new-address` | 4 | Clean list. Public IPv4 13.127.157.193, where 65.2.153.167 used to be |
| `dep-06-sg-three-rules` | 42, 43 | nxttrendz-sg with exactly three inbound rules. No 3000. This is the failure, on screen |
| `dep-07-edit-inbound-rules` | 44 | The edit form with the three existing rows |
| `dep-08-new-rule-3000` | 44 | The fourth row composed: Custom TCP, 3000, description "The React frontend" |
| `dep-09-source-required-error` | 44 | Save refused: "CIDR block, a security group ID or a prefix list has to be specified". Real, and worth a slide: choosing Anywhere-IPv4 does not fill the source in |
| `dep-10-rule-complete` | 44 | The row with 0.0.0.0/0 actually attached |
| `dep-11-sg-four-rules` | 45 | Four rules. Applied immediately, no restart |
| `dep-14-elastic-ips-empty` | 56 | Elastic IP addresses, none in this Region |
| `dep-15-allocate-form` | 56 | The allocate form. Amazon's pool, network border group ap-south-1 |
| `dep-16-allocated` | 56 | 13.202.184.214 allocated. Associated instance ID is still blank, which is the billable state |
| `dep-17-associate-form` | 57 | The associate form, including AWS's own note about reassociation |
| `dep-18-associate-instance-chosen` | 57 | i-06031b2ad99f0b796 selected |
| `dep-19-associated` | 57 | Associated. Private IP 172.31.7.32 beside it, unchanged |

## Browser captures

Taken with `shoot.mjs`, `login-shot.mjs` and `products-shot.mjs` in this folder,
through Playwright and the same Chrome the harnesses use. Each writes a
`.console.txt` beside the picture holding the real browser console output,
because both deployment bugs are invisible on the page and loud in the console.

| File | Plan beat | What it shows |
|---|---|---|
| `dep-05-closed-port-times-out` | 32, 49 | Chrome's own "This site can't be reached ... ERR_CONNECTION_TIMED_OUT". Captured against a port with no rule, so it doubles as the closed-database-port frame |
| `dep-12-site-loads-empty` | 46 | The site loading on 3000 the moment the rule was saved. The NxtTrendz login page |
| `dep-13-login-fails-localhost` | 47 | Failure 3a. Console: `POST http://localhost:8000/api/users/login/ net::ERR_CONNECTION_REFUSED`. The request went to the VISITOR's machine |
| `dep-20-login-blocked-cors` | 64, 65 | Failure 3b, the real CORS text: blocked by CORS policy, no Access-Control-Allow-Origin header |
| `dep-21-login-works` | 71, 79 | Logged in, home page rendered, `200` on the login call |
| `dep-22-products-live` | 71, 79 | The product list, live on the internet, real seeded data |

## Terminal transcripts

Real output, saved as text because the deck renders terminals through
`ShellPanel` and not as pictures (hard rule 3). Held in `transcripts/`.

| File | Plan beat | What it shows |
|---|---|---|
| `01-unprotected-key.txt` | 10 | `WARNING: UNPROTECTED PRIVATE KEY FILE!`, permissions 0644, Permission denied (publickey) |
| `02-connected.txt` | 12, 14 | `chmod 400`, then the connection. hostname `ip-172-31-7-32`, user ubuntu, Ubuntu 26.04 LTS |
| `03-login-banner.txt` | 14 | The real Ubuntu motd, including `IPv4 address for ens5: 172.31.7.32` |
| `04-docker-missing.txt` | 17 | `docker: command not found` on a fresh instance |
| `05-docker-installed.txt` | 20 | Docker 29.1.3, Compose 2.40.3, and the ubuntu user in the docker group |
| `06-pull-both.txt` | 21, 22 | Both images pulled. No docker login, no firewall change, because outbound is open |
| `07-compose-file.txt` | 26, 28 | The compose file on the server, `image:` in place of `build:` |
| `08-up-and-ps.txt` | 30 | `up -d` and `ps`, both containers listening |
| `09-migrate-and-seed.txt` | 29 | migrate on a fresh volume, then 62 seeded objects |
| `10-ports-outside.txt` | 31, 32, 50 | 8000 answers in 73ms, 3000 times out after 15s. Timeout against refused, measured |
| `11-still-old-tag.txt` | 69 | Docker Hub has `:7`, the server still runs `:6`. The manual last mile, proven |
| `12-manual-update.txt` | 70 | The human doing it by hand: edit the tag, pull, up -d |

## What the deck must not claim

- **`ALLOWED_HOSTS` needs no change.** The app hardcodes `["*"]` in
  `settings.py`. The TR's `ALLOWED_HOSTS` material does not apply here.
- **The `.env` on the server holds `SECRET_KEY` and nothing else.** There are no
  database credentials, because there is no database container.
- **`seed.json` is not in the image.** It is untracked in git, so Jenkins never
  builds it in. The fresh server's database starts empty and was seeded by hand
  during this run. A slide that shows products must account for that step.
- **Both servers are development servers**, `manage.py runserver` and the Vite
  dev server, with `DEBUG = True`. Slide 85 says so rather than implying this is
  a production configuration.

## Jenkins captures

| File | Plan beat | What it shows |
|---|---|---|
| `dep-23-ssh-agent-plugin` | 72 | Plugin manager, SSH Agent found. It provides the `sshagent` step and was NOT installed before this session |
| `dep-24-plugin-installed` | 72 | Installed, with "you can start using the installed plugins right away". No restart |
| `dep-25-credentials-store` | 73 | The Global store holding `dockerhub-credentials` from session 8. The same drawer, a second key going in |
| `dep-26-credential-kinds` | 73 | The six credential kinds, with SSH Username with private key among them |

## The Deploy stage, captured

Build **#8** was started by the GitHub webhook, built both images, pushed them,
and then updated the server over SSH. Nobody logged in. Deploy took 6 seconds.

| File | Plan beat | What it shows |
|---|---|---|
| `dep-27-job-build-8-green` | 78 | The job page. #8 green, and #5's red failure from session 8 still in the list |
| `dep-28-started-by-github-push` | 78 | "Started by GitHub push by jeevan170902", commit `b985ec1`, took 31 sec |
| `dep-29-five-stages-deploy-log` | 78, 80 | **The frame the session builds to.** Five green stages, and the Deploy log showing the ssh command, `docker compose pull`, and both containers recreated |
| `dep-30-live-after-auto-deploy` | 79 | The product list on tag 8, live, after a deploy no human touched |
| `transcripts/13-deployed-by-jenkins.txt` | 79 | `docker compose ps` on the server: both services on `:8`, up 24 seconds |

### How the tag reaches the server

The compose file on the server no longer names a tag. It reads one:

```yaml
image: jeevansravanth/nxttrendz-backend:${IMAGE_TAG}
```

`IMAGE_TAG` lives in `.env` beside it, and the Deploy stage rewrites that one
line with `sed` before pulling. That is why the stage is four short commands
and not an edit of a YAML file, and it is worth its own slide: the deploy is a
one-line change because the file was written to make it one.

### The build numbers tell the story on their own

| Build | What it carried | How it reached the server |
|---|---|---|
| 6 | the state the room starts in | pulled by hand |
| 7 | the CORS fix | a human logged in, edited a tag, ran `up -d` |
| 8 | the Deploy stage itself | Jenkins, alone, in 6 seconds |

Build 8 deploying the very stage that deploys it is a genuinely nice closing
beat, and it happened by itself.

## Clean-up owed

The Elastic IP `eipalloc-0947cde9d5ed8fa6a` is **allocated and associated**. It
is free while attached and billed the moment it is not, so releasing it is part
of shutting the session down, alongside stopping the instance.

## Jenkins on AWS

Second instance, launched 2026-09-16 through the console the way a student
would, so the reference's closing bonus stops being a footnote: Jenkins gets a
public address of its own and the ngrok detour from session 8 disappears.

| Constant | Value |
|---|---|
| `JENKINS_INSTANCE_ID` | `i-0c96a9a3b4803cefc` |
| `JENKINS_IP` | `3.108.220.155` |
| `JENKINS_SG` | `jenkins-sg`, `sg-0a8dd5bcc3a3e91a8` |
| `JENKINS_DISK` | 20 GiB gp3, because Docker builds fill 8 |
| `JENKINS_SWAP` | 4 GiB, added by hand |
| App SG rule added | `sgr-022e997bb5d041332`, SSH 22 sourced from `jenkins-sg` |

| File | What it shows |
|---|---|
| `jen-01-launch-name-ubuntu` | The launch form, named `nxttrendz-jenkins`, same Ubuntu 26.04 AMI as the app server |
| `jen-02-jenkins-sg-rules` | `jenkins-sg` with two rules, **both My IP**: 22 to administer, 8080 for the UI |
| `jen-03-storage-20gib` | Storage raised from 8 to 20 GiB, with the summary agreeing |
| `jen-04-launched` | Launch succeeded, `i-0c96a9a3b4803cefc` |
| `jen-05-two-instances` | **Two instances in one list.** The app server on its Elastic IP, the build server on a plain public address |
| `jen-06-sg-source-is-jenkins-sg` | The app server's new rule being written, with a **security group as the source** rather than a CIDR |
| `jen-07-app-sg-five-rules` | Five rules, the new one showing `sg-0a8dd5bcc3a3e91a8` as a link rather than an address |
| `jen-08-unlock-jenkins` | Unlock Jenkins, reached over the public internet at `3.108.220.155:8080` |

### Why the security-group source matters, and where it is taught

The reference mentions in passing that a rule can name another security group.
Here it is the natural answer: Jenkins must reach the app server on port 22,
and its address would otherwise have to be pinned in a rule and re-pinned every
time the build server was replaced. Naming `jenkins-sg` means **any** instance
in that group may connect, and no address appears anywhere.

It also means the Deploy stage targets the app server's **private** address,
`172.31.7.32`, because both instances sit in the same VPC. That change is
committed in the app repo as `467a17b` and **held unpushed**, because the
laptop Jenkins cannot reach a private address and would fail the moment it
built.

**The path is proven**, in `transcripts/14-private-path-proof.txt`: from the
Jenkins instance, port 22 on `172.31.7.32` answers with a real sshd banner, and
port 8000 answers too. No address is written in any rule, and the traffic never
leaves AWS.

### The memory finding, which the deck should state plainly

`t3.micro` gives 908 MiB of usable RAM. Jenkins alone took 436 MiB before a
single build ran, leaving 133 MiB free. **4 GiB of swap was added and 486 MiB
of it was already in use at idle.** A Docker build of the frontend on top of
that is going to be slow. This is real guidance for the room, not a footnote:
the free tier's smallest instance will run a build server, and it will not
enjoy it.

### Blocked, and why

The Jenkins setup wizard needs the unlock password pasted and then an admin
account created with a password. Both are the account holder's to do. The
unlock password on this instance is in
`/var/jenkins_home/secrets/initialAdminPassword`, readable with:

```bash
ssh -i nxttrendz-key.pem ubuntu@3.108.220.155 \
  "sudo docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword"
```

After the wizard, what remains is a repeat of work already captured once: the
SSH Agent plugin, the `ec2-ssh-key` credential, the job, and repointing the
GitHub webhook away from ngrok to `http://3.108.220.155:8080/github-webhook/`.

## The flow, run end to end inside AWS

Build **#1** on the EC2 Jenkins, 2026-09-16. Started by the GitHub webhook
arriving directly at `3.108.220.155:8080`, with **no ngrok anywhere**. Took
2 min 10 sec.

| Stage | Time |
|---|---|
| Checkout SCM | 1s |
| Checkout | 0.91s |
| Build | 1m 8s |
| Push | 32s |
| Deploy | 17s |

The Deploy log is the frame that closes the course:

```
+ ssh -o StrictHostKeyChecking=no ubuntu@172.31.7.32
      cd ~/nxttrendz &&
      sed -i 's/^IMAGE_TAG=.*/IMAGE_TAG=1/' .env &&
      docker compose pull &&
      docker compose up -d
```

A **private** address, reached because the app server's security group names
`jenkins-sg` as the source. Nothing in that command mentions a public address.

| File | What it shows |
|---|---|
| `jen-11-build-1-on-aws` | Five green stages on the EC2 Jenkins, with the Deploy log and the private address in it |
| `jen-12-live-after-aws-deploy` | The product list, live, on the build the AWS pipeline deployed |
| `transcripts/15-deployed-from-aws-jenkins.txt` | `IMAGE_TAG=1` and both containers on `:1`, 20 seconds old |

### Two things to say on a slide

**The tag numbering restarts.** A new Jenkins counts from 1, so the deployed
image is `:1` while Docker Hub still holds `:4`, `:6`, `:7` and `:8` from the
laptop. Worth naming, or the room will think something went backwards.

**The build really is slow on a `t3.micro`.** Build took 1 minute 8 seconds and
the whole run 2 minutes 10, on 908 MiB of RAM with 4 GiB of swap doing real
work. It completes, which is the useful finding, and the room should expect to
wait.

### Setup notes worth keeping

- The plugin and the job were installed **without the web interface**, with
  `jenkins-plugin-cli` and by copying `config.xml` into `jenkins_home` over
  SSH. Useful to know, but the slide should show the UI path, because that is
  what a student does.
- **The credential ID is easy to get wrong.** Jenkins fills the ID field with a
  UUID if you leave it blank, and the Jenkinsfile then cannot find it. This
  happened during capture and is worth a slide of its own: the ID is not
  cosmetic, it is the name the pipeline calls.

## The job gets a name that is true

User, 2026-09-16: *"Now i dont want name to nxttrendz-build-test remove test and
give a proper name."*

The job was called `nxttrendz-build-test` since session 8, and session 8 then
removed the Test stage on instruction. The name has been wrong ever since. It
is now **`nxttrendz-pipeline`**, which is what it is: Checkout, Build, Push,
Deploy.

| File | What it shows |
|---|---|
| `jen-13-job-old-name` | The job as it was, with the stale name in the breadcrumb and the heading |
| `jen-14-rename-form` | Rename Pipeline, with Jenkins refusing a no-op: "The new name is the same as the current name" |
| `jen-15-new-name-typed` | `nxttrendz-pipeline` in the field |
| `jen-16-renamed` | Renamed, **and build #1's history survives**. The permalinks still point at it |
| `jen-17-github-hook-log` | **The best frame in this set.** See below |

### Why the hook log frame is worth a slide of its own

```
Started by event from 140.82.115.248 → http://3.108.220.155:8080/github-webhook/
Done. Took 4 ms
Changes found
```

That source address, `140.82.115.248`, sits inside `140.82.112.0/20`, one of
the four GitHub ranges added to `jenkins-sg`. The rule and the traffic it
allowed are visible on the same frame. A room that has just been told "open
8080 to GitHub's published ranges" can check the claim against the log in front
of them.

It also answers the question a rename always raises: **the webhook is not
addressed to the job.** GitHub posts to `/github-webhook/` and Jenkins matches
on the repository URL, so the name can change freely. Nothing in the Jenkinsfile
names the job either.

### What the deck has to be honest about

**Session 8's captures show `nxttrendz-build-test`**, and session 8 is frozen.
Session 10 renames it on screen rather than pretending the old name never
existed. That is the honest version and it costs four frames.

The laptop Jenkins still holds a job under the old name. It is superseded by
the EC2 one and nothing points at it any more.
