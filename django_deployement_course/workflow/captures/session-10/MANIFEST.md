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

## Still to capture

The Jenkins Deploy stage, concept 6 second half: the SSH credential, the
fourth stage, the four-stage graph, and a deploy that reaches the server with
nobody touching it.

## Clean-up owed

The Elastic IP `eipalloc-0947cde9d5ed8fa6a` is **allocated and associated**. It
is free while attached and billed the moment it is not, so releasing it is part
of shutting the session down, alongside stopping the instance.
