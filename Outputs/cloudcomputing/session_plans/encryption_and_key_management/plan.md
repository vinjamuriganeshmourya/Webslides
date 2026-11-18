# Encryption & Key Management · slide-wise plan

STATUS: signed off by the user, 2026-11-18 ("Sign off, build it"); question 2 as proposed: ACM and KMS consoles drawn with TR values only, domain and alias as blurred fields

- **Session:** cloud computing session 15. Deck project at
  `/home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/encryption_and_key_management/` (the whole project
  outside the repo, rule of 2026-11-13; this plan stays here). Built with `deck-engine/`
  (`node deck.mjs build|check|perf /home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/encryption_and_key_management`).
  Dev port 5286 (builder forks 5351-5358). The `Encryption & Key Management` row of `Outputdecks/cloudcomputing/course.json`
  gets its folder when built; nothing committed or pushed there unless asked.
- **Series match:** Session 14 (`iam_roles_and_least_privilege`) as corrected on 2026-11-18, and Session 16
  (`cloud_threats_and_attacks`): `deck.json` + `custom/*.tsx` merged in `custom/index.tsx` (stubs first) + `images/`.
  Same opening and closing frames, same breaker, same points / table / analogy layouts, same 3D icon and plinth style.
- **Source:** `Reference ppt's/15. Encryption Key Management.pdf` (15 pages), extracted to `tr.txt` beside this plan.
  **TR numbering as printed:** slides 1-5, 7-12, 14-18, 20-25. There is no Slide 6, 13 or 19; nothing is missing, only
  the numbers (each gap sits at a section boundary). TR N below is the TR's own number.
- **No screenshots in the TR** (`pdfimages` lists none). Two slides ask for a "screenshot-style mock" (TR 12 the ACM
  console issuing a certificate, TR 21 the KMS key list): drawn in the deck's style, as Session 13 drew its consoles
  (question 2).
- **Official marks (rule 54), each in the white tile.** In `slide-kit/assets/aws/` already: KMS, Certificate Manager,
  S3 (bucket, object), EBS (volume, snapshot), RDS, Aurora, EC2 (instance), Elastic Load Balancing (and ALB),
  CloudFront, API Gateway, CloudTrail, IAM encrypted data, Users, Client, Server. **To add from the official package
  (07312026, already downloaded):** AWS CloudHSM, AWS Nitro Enclaves, AWS Private Certificate Authority, the ACM
  Certificate Authority resource, the IAM Data Encryption Key resource, the KMS External Key Store resource, the RDS
  instance resource.

## Mistakes from Sessions 13, 14 and 16, built out from the first draft

Generate-slides standing corrections 1-17 and cloud course R1-R14 all hold. What came back as review feedback on the
last three decks, and how this deck has it from the start:

| Earlier decks had | Built here from the first draft |
|---|---|
| Flat lucide icons in technical visuals (S13 first build) | **Glossy vector 3D icons** from the engine (`@/engine/icons3d`, `Ico3D` / `Tile3D`); every point and table icon an `i3d:` ref. Names this TR needs and the module lacks are added to the ENGINE module first, in the same drawing style (likely: `keypair`, `disk`, `chip` memory, `certificate`, `digest`, `blender`, `envelope` parcel, `refresh` rotation, `hsm` hardware box, `snapshot`, `replica`, `upload`). S14's builders wished for names and used the closest ones instead; this time they exist before the figures are drawn |
| Icons bare on the stage | Every icon on a **white plinth tile** (`Plinth`, `@/engine/figkit`); official AWS marks on the same white tile |
| Cards against their stage edge, text near borders (S13) | **At least 20 design px of equal padding** inside every stage and card; inner padding = parent's; no wrapper card round a card pair |
| Diagonal connectors, heads placed by eye (S13) | **Orthogonal elbow `Wire`s** computed from the box constants, tip on the target edge |
| Static plain boxes with a word in them (S13) | **The named thing drawn**: a disk, a bucket, a key pair, a fingerprint, a blender, a certificate chain, a vault, an HSM box; micro-animation on every icon, a flow dot on every wire, a lit item walking first → last → first (`useHot`) |
| A crowded slide split only after review (S14 slide 11, round 1) | **Split planned up front** wherever a two-line lead and four or more long points would crowd the figure: T09, T12, T15, T17, T23, T24, T25 below, each at the TR's own bullet boundary, same kicker and title |
| Untagged icons (S9) | One single-word Title Case tag under each untagged icon (R13); no chips, badges or connector labels |
| Text on analogy cards, isometric clay, modelled people | Five **real-time 3D analogies** on `@/engine/three-stage`, Character Lab people via `castSprite` (never a copy), role clothing, expressions synced to the action, loops 3-9 s restarting within 0.3 s, no text on either card |
| Highlighted rows nobody asked for (rule 60) | None: the TR asks for no highlight on any of its three tables |
| Red in visuals | Template orange (rule 51), one meaning per slide; a `Deny` or blocked path is orange, never red |
| Lag on classroom PCs | loops on the compositor only (`transform` / `opacity` on HTML or root svg), `perf` 0 FAIL, Firefox PASS |

## Text policy (binding, same as Sessions 14 and 16)

1. Kicker = the TR `Heading`, title = the TR `Subheading`, in the TR's own case (`Rest Transit Use`,
   `Client vs Server Side`, `Symmetric Vs Asymmetric` kept as written). The TR `Content` paragraph is the `lead`;
   bullets are points (or the text inside a one-row-per-bullet figure); tables are tables.
2. Allowed edits are punctuation, letter case and layout only: a spaced em dash becomes a colon (TR 2, TR 21 notes;
   TR 4, 5, 10, 21, 25 analogies in notes); the full stops ending TR 11 bullet 4 and TR 12 bullet 1 are dropped (rule
   36); the quote marks round the TR 10 analogy are dropped; no mark ends a line; figure tags capitalise every word
   (rule 56); product names, code and values keep their form (`AES`, `RSA`, `ECC`, `SHA-256`, `aws:SecureTransport`,
   `HTTPS 443`, `SSE-S3`, `SSE-KMS`, `aws/*`, `aws/s3`, `1a2b3c4d-5e6f-7890-abcd-ef1234567890`, `4 KB`, `2 GB`). The
   TR's British spelling (`organisations`) stays. Every word stays.
3. Too long → split at the TR's own bullet boundary into a second frame with the same kicker and title.
4. Speaker Notes → `notes`, verbatim, on every frame of a split. Visual Guidance → the figure spec. Analogy → its own
   analogy slide, the TR sentence in `notes`.
5. Figure tags use only TR words and product names. No invented numbers, names or values: no TLS version numbers on
   T12-B (the TR says "outdated, weaker protocol versions" only), no domain names or aliases on the drawn consoles
   (question 2).
6. Recap, agenda and takeaways carry the five titles only (R5); breakers the title only; sub-lines in `notes`.

## Deck (50 frames)

Opening
| id | layout | content |
|---|---|---|
| S-WELCOME | brand | |
| S-TITLE | title | Encryption & Key Management (R9) |
| S-RECAP | recap | previous: IAM Roles & Least Privilege; Roles & Temporary Credentials · Principle of Least Privilege · Federation & Single Sign-On · Service & Machine Identity · Identity for AI Agents; presenter illustration (R6) |
| S-AGENDA | agenda | Data States · Cryptography Essentials · Encryption in Transit · Encryption at Rest · Key Management |

Section 1 · Data States
| id | layout | TR | content and figure |
|---|---|---|---|
| D1 | breaker 1 | | |
| T01 | points | 1 | lead; 3 points; figure (Visual Guidance): three plinth cards left to right on one orthogonal wire chain, `Rest` (a disk), `Transit` (a network link between two tiles), `Use` (a CPU chip with a memory stick); one data block travels the chain; point N lights card N and the data block settles there (on the disk, on the wire, in memory); loop: the data block keeps travelling disk → wire → memory → disk |
| T02 | table | 2 | lead-free (the TR has no Content line); Data State / Primary Risk / AWS Location Example / Protection Approach, 3 rows; the row icons are T01's three icons in the same order (Visual Guidance: "aligned under the matching box from the previous slide"); `Nitro Enclave` cell carries the official Nitro Enclaves mark, `EBS volume, S3 bucket, RDS instance` their marks (table `icons` cells); no highlight |

Section 2 · Cryptography Essentials
| id | layout | TR | content and figure |
|---|---|---|---|
| D2 | breaker 2 | | |
| T03 | points | 3 | lead; 3 points; figure (Visual Guidance): three plinth tiles in a row, `Symmetric` (one key), `Asymmetric` (a key pair, one blue one gold), `Hashing` (a fingerprint); point 1 the single key locks and unlocks a document; point 2 the pair splits, the public key locks and only the private key opens; point 3 a document passes into the fingerprint; loop: each tile's action repeats in turn |
| T04 | points | 4 | lead (two sentences); 3 points; figure (Visual Guidance): two cards side by side, `AES` (one key, a padlock that the same key closes and opens) and `RSA / ECC` (a key pair: the public key closes the padlock, the private key opens it); point 1 a key-length bar `128` / `256` under AES; point 2 a far longer bar `2048` under RSA (the TR's own numbers); point 3 the pair carries a small key across (key exchange) and stamps a document (signature); loop: the locks close and open |
| T04-AN | analogy | 4 | **shared house key and letterbox**, 3D: left, a family of three at a front door, each using a copy of the same house key in turn; right, a letterbox at a gate where a postman and a neighbour each post a letter, and only the homeowner's key opens the box ↔ concept, 3D: left one key shared between two laptops; right many senders locking with an open padlock, one private key opening it |
| T05 | points | 5 | lead (two sentences); 3 points; figure (Visual Guidance): `Data` block → `Hash Function` tile (a gear in a funnel) → fixed `SHA-256` digest box, and a return arrow from the digest blocked by a cross (no reverse path); point 1 the same data runs twice, the same digest appears twice; point 2 a file and a password each reach a check tick (the password through a salt shaker and a slow dial); point 3 one bit of the data flips and every cell of the digest changes; loop: data keeps entering, the digest keeps refreshing |
| T05-AN | analogy | 5 | **fruit into juice**, 3D: a kitchen counter, a person drops whole fruits into a blender, it spins, juice pours into a glass; the fruits never come back out ↔ concept, 3D: data blocks enter a hash machine and a short glowing digest strip comes out; a reverse lever on the machine does nothing |
| T07 | points | 7 | lead; 3 points; figure (Visual Guidance): arrow flow on orthogonal wires, `Handshake` (key pair) → `Session Key` (one key) → `Integrity` (a check seal over a document); point 1 the handshake tile proves a server tile's identity (a certificate badge); point 2 the session key encrypts a stream of packets; point 3 the integrity seal checks each packet; loop: packets ride the flow |

Section 3 · Encryption in Transit
| id | layout | TR | content and figure |
|---|---|---|---|
| D3 | breaker 3 | | |
| T08 | points | 8 | lead; 3 points; figure (Visual Guidance): `Client` (laptop) → encrypted link with a padlock → `Load Balancer` (ELB mark) with a certificate badge → `Backend` (database); point 1 the link draws and closes its padlock; point 2 the certificate badge lights at the load balancer; point 3 a plain-text side path is cut; loop: sealed packets ride the link |
| T09 | points | 9 | lead; bullets 1-3; figure (Visual Guidance): sequence diagram, `Client` and `Server` lifelines; arrows `Client Hello`, `Server Hello` + certificate, the client checking the chain and name (a tick beside the client); point N draws arrow N |
| T09-B | points | 9 | same kicker and title; bullets 4-5; the same sequence with arrows 1-3 already drawn: point 4 `Key Exchange` arrows both ways and one session key appearing on each side; point 5 `Finished` both ways, then a padlocked `Encrypted Data` arrow; loop: encrypted packets cross the lifelines |
| T10 | points | 10 | lead; 4 points; figure (Visual Guidance): three small diagrams stacked, `Termination`, `Passthrough`, `Re-encryption`, each `Client` → `Load Balancer` → `Backend` with the padlock opening or closing where the TR says; point N lights diagram N (point 4 a CPU gauge on the backend drops under Termination); loop: one packet per lane, its padlock state changing at the right hop |
| T10-AN | analogy | 10 | **security guard at the office gate**, 3D: a courier hands a sealed parcel to a guard at a gate booth; the guard opens it, checks it, seals it in a fresh envelope, and passes it to a staff member inside ↔ concept, 3D: a padlocked packet reaches a load balancer block, the lock opens, a check light, a new lock closes, the packet goes on to the backend |
| T11 | points | 11 | lead; 4 points; figure (Visual Guidance): vertical chain, `Root CA` → `Intermediate CA` → `Leaf Certificate`, with a small clock beside the leaf; point 1 the chain draws top to bottom with a signing stamp at each link; point 2 a browser tile trusts the public path; point 3 an internal service tile trusts the private path (Private CA mark); point 4 the clock on the ACM-issued leaf turns and renews it, an imported certificate beside it waits for a hand; loop: the renewal clock turns |
| T12 | points | 12 | lead; bullets 1-3; figure (Visual Guidance): a drawn ACM console panel issuing a certificate (status `Issued`), an elbow arrow to a load balancer listener card marked `HTTPS 443`; point 1 the certificate issues and fans to load balancer, CloudFront and API Gateway marks; point 2 the listener card lights and a plain `HTTP` request bounces back as a redirect; point 3 API Gateway accepts only the HTTPS request; loop: requests arrive and the listener sorts them |
| T12-B | points | 12 | same kicker and title; bullets 4-5; figure: an S3 bucket behind a bucket-policy document whose `aws:SecureTransport` line reads `false` → `Deny`; a minimum-version gate in front of an endpoint; point 4 a plain request hits the deny; point 5 a request marked `Outdated` is stopped at the gate, a current one passes; loop: requests keep arriving |

Section 4 · Encryption at Rest
| id | layout | TR | content and figure |
|---|---|---|---|
| D4 | breaker 4 | | |
| T14 | points | 14 | lead; 4 points; figure (Visual Guidance): three plinth cards in a row, `Volume` (disk), `Bucket` (bucket), `Database`, each stamped with a closed padlock; point N lights card N (point 3 the database's backups and replicas fan out); point 4 a `Server-Side` / `Client-Side` bar spans all three; loop: the padlocks click shut in turn |
| T15 | points | 15 | lead; bullets 1-3; figure (Visual Guidance): an EC2 instance box connected to an EBS volume, the volume shaded and tagged `Ciphertext`, an arrow to a snapshot with the same shading; point 1 an `Encrypted` flag set on the volume at creation; point 2 the snapshot inherits the shading; point 3 the wire between instance and volume shows a padlocked packet; loop: blocks written to the volume turn to ciphertext |
| T15-B | points | 15 | same kicker and title; bullets 4-5; figure: an unencrypted volume → snapshot → `Copy` with encryption → encrypted volume (the speaker notes' path); point 5 a drawn EBS create-volume panel with the `Encrypt` checkbox ticking; loop: the copy path runs |
| T16 | points | 16 | lead; 4 points; figure (Visual Guidance): a bucket receiving an uploaded file arrow; inside the bucket the file turns into a padlock, tagged `Ciphertext`; point 1 `SSE-S3` key tile inside S3; point 2 `SSE-KMS` with the KMS mark and a CloudTrail log line written on each use; point 3 the default flips from SSE-S3 to SSE-KMS; point 4 a drawn bucket `Properties` tab with `Default Encryption`; loop: uploads arrive and lock |
| T17 | points | 17 | lead; bullets 1-2; figure (Visual Guidance): an RDS database with a padlock on its storage layer, three arrows to `Backup`, `Snapshot`, `Replica`, each carrying the same padlock; point 1 the three fan out locked; point 2 a cross-Region replica in a second Region frame with its own KMS key; loop: the padlocks pulse along the arrows |
| T17-B | points | 17 | same kicker and title; bullets 3-4; figure: the notes' workaround as a path, unencrypted database → snapshot → copy with encryption → restore → encrypted database; point 4 a drawn `Create Database` panel with its encryption option; loop: the path runs |
| T18 | table | 18 | lead; Aspect / Server-Side Encryption / Client-Side Encryption, 4 rows, row icons (pin, key, gear, building); no highlight |
| T18-B | lead | 18 | same kicker and title, no new text; figure (Visual Guidance): two parallel flows, each `Plaintext` → `Data Key` → `Ciphertext`; left inside an S3 / storage-service frame (the service makes and uses the data key), right inside an application frame before an upload arrow (the app makes the data key, the service never sees it); loop: a document runs both flows |

Section 5 · Key Management
| id | layout | TR | content and figure |
|---|---|---|---|
| D5 | breaker 5 | | |
| T20 | points | 20 | lead; 4 points; figure (Visual Guidance): application tiles on the left, a KMS card in the centre holding a vault, elbow wires out to S3, EBS and RDS marks; point 1 the vault creates and holds a key; point 2 two key tags `AWS` and `Customer` on the vault; point 3 a small data key leaves wrapped in a KMS key; point 4 a rotation arrow, an HSM box and an import arrow around the vault; loop: keys ride out to the three services |
| T21 | points | 21 | lead; 4 points; figure (Visual Guidance): a drawn KMS console panel, the key list with `Alias`, `Key ID`, `Rotation` columns (question 2); point 1 a key-policy document beside a key row; point 2 elbow wires to S3, EBS and RDS; point 3 the key stays inside a boundary while only results leave; point 4 a CloudTrail log line written per use; loop: log lines add |
| T21-AN | analogy | 21 | **bank locker room**, 3D: a bank's guarded key room; a customer asks, a bank officer brings the locker key from the guarded room, opens the locker for the customer and takes the key back ↔ concept, 3D: an app tile sends data into a KMS vault, the key never leaves it, the locked data comes back out |
| T22 | table | 22 | lead; Aspect / Provider-Managed (AWS managed, aws/*) / Customer-Managed (KMS key), 5 rows, row icons (user, refresh, ban, doc, target); no highlight |
| T22-B | lead | 22 | same kicker and title, no new text; figure (Visual Guidance): two padlocks side by side, `AWS-Owned` and `Customer KMS Key`, both feeding one S3 bucket; the customer padlock carries three small controls (rotate, disable, policy) the AWS one lacks; loop: data flows from both into the bucket |
| T23 | points | 23 | lead; bullets 1-3; figure (Visual Guidance): `KMS Key` box generates a `Data Key` and its encrypted copy; the plaintext data key encrypts a `2 GB` file icon locally; point 2 the TR's key ID on the KMS key box; loop: the file streams through the data key |
| T23-B | points | 23 | same kicker and title; bullets 4-5; the same flow: point 4 the encrypted data key travels with the ciphertext file; point 5 the reverse arrow calls KMS, the key unwraps, the file decrypts locally; loop: the round trip runs |
| T24 | points | 24 | lead; bullets 1-2; figure (Visual Guidance): a timeline, a key replaced each year, older versions kept on a ring; point 1 the new key slides in each year; point 2 an older ciphertext opens with its older key version; loop: the year marker moves along |
| T24-B | points | 24 | same kicker and title; bullets 3-4; figure: a padlocked hardware box `HSM` (tamper seal), a key glowing inside that never leaves; point 4 the CloudHSM mark on a single-tenant rack with one owner tile; loop: requests enter, results leave, the key stays |
| T25 | points | 25 | lead; bullets 1-2; figure (Visual Guidance): `On-Premises HSM` box → wrapped key material travelling through an `Import Token` → landing inside the KMS vault; point 1 the material forms in the on-premises HSM; point 2 the import token and wrapping key seal it in transit; loop: the material rides to the vault |
| T25-B | points | 25 | same kicker and title; bullets 3-4; figure: the imported key inside KMS with a key-policy document (same as a native key), a rotation dial that only a hand turns; point 4 the owner deletes the material and the key greys out, a new request bounces; loop: the dial turns by hand |
| T25-AN | analogy | 25 | **own key at a rented locker**, 3D: a locker facility's counter offers its own key; a customer declines it and uses a key from their own key ring on the rented locker ↔ concept, 3D: key material from an on-premises box placed into the KMS vault in place of a vault-made key |

Closing
| id | layout | content |
|---|---|---|
| S-QUIZ | quiz | the closing quiz frame only (Sessions 13, 14 and 16: no mid-deck quiz, no feedback card) |
| S-TAKEAWAYS | takeaways | the five agenda titles |
| S-NEXT | next | Cloud Threats & Attacks (the TR's `Upcoming Session`) |
| S-THANKS / S-BEST | thanks | Thank You · All the Best |

## Coverage check (every TR item → slide)

| TR | item | slide(s) |
|---|---|---|
| Recap / Agenda | 5 titles each (sub-lines in notes, R5) | S-RECAP, S-AGENDA, D1-D5 |
| 1 | Content; 3 bullets; guidance; notes | T01 |
| 2 | table; guidance; notes | T02 |
| 3 | Content; 3 bullets; guidance; notes | T03 |
| 4 | Content; 3 bullets; analogy; guidance; notes | T04 / T04-AN |
| 5 | Content; 3 bullets; analogy; guidance; notes | T05 / T05-AN |
| 7 | Content; 3 bullets; guidance; notes | T07 |
| 8 | Content; 3 bullets; guidance; notes | T08 |
| 9 | Content; 5 bullets; guidance; notes | T09 / T09-B |
| 10 | Content; 4 bullets; analogy; guidance; notes | T10 / T10-AN |
| 11 | Content; 4 bullets; guidance; notes | T11 |
| 12 | Content; 5 bullets; guidance (console mock); notes | T12 / T12-B |
| 14 | Content; 4 bullets; guidance; notes | T14 |
| 15 | Content; 5 bullets; guidance; notes | T15 / T15-B |
| 16 | Content; 4 bullets; guidance; notes | T16 |
| 17 | Content; 4 bullets; guidance; notes | T17 / T17-B |
| 18 | Content; table; guidance; notes | T18 / T18-B |
| 20 | Content; 4 bullets; guidance; notes | T20 |
| 21 | Content; 4 bullets; analogy; guidance (console mock); notes | T21 / T21-AN |
| 22 | Content; table; guidance; notes | T22 / T22-B |
| 23 | Content; 5 bullets; guidance; notes | T23 / T23-B |
| 24 | Content; 4 bullets; guidance; notes | T24 / T24-B |
| 25 | Content; 4 bullets; analogy; guidance; notes | T25 / T25-B / T25-AN |
| Key Takeaways / Upcoming | 5 titles / Cloud Threats & Attacks | S-TAKEAWAYS / S-NEXT |

## Narrative and pedagogy

The TR's order is the deck's order, building on Session 14's identities and roles. Section 1 names the three states
data passes through and the risk each carries, so every later tool has a place to stand. Section 2 gives the three
tools (one shared key, a key pair, a one-way fingerprint), each with its own everyday picture (house key and
letterbox, fruit juice), and shows them combined inside TLS. Section 3 uses that combination for data in transit: the
map, the handshake arrow by arrow, where a load balancer ends the encryption (the gate guard's parcel), the chain of
trust and ACM, and the settings that refuse plain traffic. Section 4 turns to data at rest: the three storage types,
EBS, S3 and RDS one at a time, then who does the encrypting (server or client). Section 5 asks who protects the keys:
KMS (the bank's key room), provider against customer keys, envelope encryption traced step by step, rotation and HSM
custody, and bringing your own key material (your own key at a rented locker).

Every term arrives before it is used: symmetric and asymmetric keys (T03-T04) before the handshake (T07, T09);
hashing (T05) before integrity in TLS (T07); certificates (T08) before the trust chain (T11) and ACM (T12); server-side
and client-side named in T14 before the comparison (T18); KMS named in passing in T16-T17 (`SSE-KMS`, cross-Region KMS
key) and introduced in full in T20-T21; the data key (T18-B) before envelope encryption (T23); HSM (T20 point 4)
before T24-B and BYOK (T25).

Analogies (5), each two real-time 3D scenes with no text: house key and letterbox (T04), fruit juice (T05), gate
guard's parcel (T10), bank locker room (T21), own key at a rented locker (T25).

## Build

All text into `deck.json` (generated once from `tr.txt` by a scratchpad script, then `deck.json` is the source) and a
`stubs.tsx` placeholder for every custom figure. New icon names and the new official marks go into the engine module
and `slide-kit/assets/aws/` FIRST, before any figure is drawn. Technical figures on `@/engine/icons3d` +
`@/engine/figkit` (references: Session 14 `custom/a.tsx`-`d.tsx` and Session 16 `custom/a.tsx`-`d.tsx`). Forked
builders on private copies (`deck.mjs dev` on their own ports, never `build`), each owning one custom file: sections
1-2, section 3, section 4, section 5, and the five 3D analogies over two files. Merge, `build`, `check` 0 FAIL 0 WARN,
`perf` 0 FAIL, Firefox PASS, every slide screenshotted from the built file at step 0, mid-build and held, and read for
padding, overlaps, arrow ends, crowding and plain spots before reporting.

## Questions at sign-off

1. Sign off the plan as written?
2. TR 12 and TR 21 ask for "screenshot-style mocks" of the ACM and KMS consoles, and the TR gives no domain name or key
   alias. Proposed: draw both consoles with the TR's own values only (status `Issued`, listener `HTTPS 443`, the key ID
   from TR 23, rotation `Enabled`), and show the certificate's domain and the key alias as blurred fields, the way a
   real capture is blurred under rule 53. Or would you rather have real console captures, if you have them?

## As built (2026-11-18)

50 frames, as planned. `/home/nxtwave/Desktop/webslides/Outputdecks/cloudcomputing/encryption_and_key_management/dist-single/encryption-and-key-management.html`
(6.84 MB, self-contained). `check` 0 FAIL 0 WARN; `perf` 0 FAIL, 3 WARN (slide 13's 3D juice scene drew 80 of 150 frames
in the 2.5 s after the press at x4 CPU; slides 15 (the section 3 breaker) and 39 idle at 10% and 8% of a core against a
6% budget); pristine OK; Firefox 0 FAIL 0 WARN. 3D analogies measured at about 60 fps by their builders. Every slide
screenshotted held from the built file and read.
- **Changes from the plan:** T25-B's first point split at the TR's own ", but" into two points sharing one step (letter
  case only: `But cannot rotate ...`), as Session 14 did on T04-B; T07 and T24 points widened (580 / 590) so each point
  takes two lines; T23's key ID on its own line (`\n`, engine change below); T22 column weights so its header fits one
  line. Slides 10 and 16 re-laid once each before merge (empty quarter). Figure tags that are not exact TR words, all
  taken from TR phrases: Create Volume, Plaintext, Log, Restore (notes), Client, Lock, Signature, Key Exchange, Salt,
  Slow Hash, Auto-Renew, Imported, Internal Service, Endpoint, Outdated, Certificate Chain, Session Key, Application,
  Vault, Boundary, Encrypted Key, Key ID, Key Material, Older Versions, Earlier Data, Dedicated, Single-Tenant, Manual,
  Request, Owner, Import. T21's alias and T12's domain are blurred fields (question 2).
- **Engine changes this build (uncommitted, shared):** 12 icons in `src/engine/icons3d.tsx` (keypair disk chip
  certificate digest refresh snapshot replica envelope hsm upload hash); `render.tsx` points honour `\n` (no other deck
  has one, so their builds do not change).
- **Icon names the builders wished the engine had:** backup, restore, region, stamp, hand, browser, seal, rack, salt,
  packet (closest existing names used).
- **Custom files:** `a.tsx` (S1-2), `b.tsx` (S3), `c.tsx` (S4), `d.tsx` (S5), `h.tsx` (house key, juice), `i.tsx`
  (gate guard, bank locker), `j.tsx` (own key at a rented locker).
