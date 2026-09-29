# Review · Introduction to AWS

- session: `deployement_session_9`
- deck: `deployment-session-9`
- slides: 97
- source: remarks doc, "Intro to AWS", Google Docs `1tPLNddMlG6ZhSETyz7jI8xUIh_CvcX2954e1NM2jaCU`
- updated: 2026-09-28

Not written by the review app. These remarks arrived as a Google Doc and are
transcribed here so the feedback on this deck is a file in the repo rather than
a link that may change under us.

Status: `[ ]` open · `[x]` done · `[~]` wont fix

## The numbering in the doc

**The doc was written against the 94-slide build** (`21f9b6d`, 16 September).
The 25 September pass (`2b4b241`) had already applied about half of it and left
the deck at 93 slides, so the doc's slide numbers do not match the deck. The
mapping, derived from `workflow/qa-shots/` and the two deck files:

| Doc slide | Slide id | Deck slide today |
|---|---|---|
| 12 | `one-question` | 12 |
| 18 | `c1-data-centre` | 18 |
| 20 | `c1-laptop-not-server` | 20 |
| 32, 33 | `c2-market-share`, `c2-240-services` | removed |
| 34 | `c2-ec2-rents` | 32 |
| 35 | `c2-instance` | 33 |
| 48 | `c3-t3-sizes` | 46 |
| 55 | `c3-subnets` | 53 |
| 58 | `c3-door-list` | 56 |
| 61 | `c3-summary-launch` | 61 |
| 63 | `c3-instance-details` | 63 |
| 69 | `c3-add-one-rule` | 70 |
| 72 | `c3-browser-commands` | 74 |
| 73 | `c3-inside-instance` | 75 |
| 84 | `c4-what-costs` | 87 |

## Already applied on 25 September

- [x] **Doc 12** · `one-question` — question reworded to "If a website is not
      running on your laptop, where is it running?"
- [x] **Doc 18** · `c1-data-centre` — lead is now "AWS has data centres in
      different parts of the world. 124 Availability Zones in 39 Regions".
- [x] **Doc 32, 33** · `c2-market-share` and `c2-240-services` removed.
- [x] **Doc 34** · `c2-ec2-rents` — the EC2 / Elastic Compute Cloud definition.
- [x] **Doc 35** · `c2-instance` — the instance definition and its three facts.
- [x] **Doc 48** · `c3-t3-sizes` — the three-row size table plus the vCPU,
      memory and instance-type cards.
- [x] **Doc 55** · `c3-subnets` — the subnet lead and the
      `VPC → Subnet → EC2 → Private IP + Public IP` line above the diagram.
- [x] **Doc 58, part 2** · `c3-door-list-read` added, carrying the three ports
      one per line and `Internet → Security Group → EC2`.

## Applied on 28 September

- [x] **Doc 20** · `c1-laptop-not-server` — the lead now states the idea ("a
      website should run on a computer that is always reachable on the
      internet"), and two cards under the table say what the laptop is for and
      what a server is for.
- [x] **Doc 58, part 1** · `c3-door-list` — the old lead ("A Security Group sits
      in front of the instance and lists which ports may be reached, and by
      whom...") is gone, replaced by "The Security Group checks the port. If the
      port is allowed, the connection reaches the EC2 instance. If it is not
      allowed, the connection is blocked".
- [x] **Doc 58, part 3** · new slide `c3-where-security-groups-live`, on the
      capture `ec2-25-security-groups-nav.png`, with **Network and Security**
      and **Create security group** boxed in click order.
- [x] **Doc 61** · `c3-summary-launch` — the six answers are six points, one
      below another, named as the form names them.
- [x] **Doc 63** · new slide `c3-page-words` after the instance page, a table
      defining VPC, Public IPv4, Private IPv4 and Public DNS.
- [x] **Doc 69** · new slide `c3-who-connects` after Add One Rule, drawing
      browser → AWS → EC2 Instance Connect → the instance, and saying what the
      new Source address actually allows.
- [x] **Doc 72** · `c3-browser-commands` — under the capture, "You are connected
      to your EC2 server, logged in as ubuntu, and the server started 1 minute
      ago".
- [x] **Doc 73** · `c3-inside-instance` — a three-or-four-word gloss beside each
      of the four commands, and a note that these are Linux commands because the
      instance runs Ubuntu, whatever the learner's own laptop runs.
- [x] **Doc 84** · new slide `c3-elastic-ip`, placed where the need appears,
      straight after `c3-address-changed`. Without an Elastic IP the address
      changes across a Stop and a Start; with one it does not. `c4-what-costs`
      no longer claims to be introducing the term.

## Open

- [ ] **`ec2-25-security-groups-nav.png` is from a different account** than the
      other captures. Its list reads `nxttrendz-app-sg` and
      `vpc-09690abf9070a5eeb`, while the deck's canonical values in
      `deckShared.tsx` are `nxttrendz-sg` and `vpc-0292256715a0e0ab2`. Nothing on
      the slide points at those rows, and neither highlight touches them, but a
      learner reading the screenshot closely will see two names the deck never
      uses. Either recapture on the account the rest of the deck was captured
      on, or accept the mismatch knowingly.
