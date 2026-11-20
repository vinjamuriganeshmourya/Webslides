<!-- cSpell:ignore awsstatic Squid -->
# AWS architecture icons

The **official** AWS Architecture Icons, release `07312026`, taken from the
package linked at <https://aws.amazon.com/architecture/icons/>. Downloaded and
installed on 2026-09-16.

AWS's own terms on that page: *"We allow customers and partners to use these
toolkits and assets to create architecture diagrams"*, and name presentations
explicitly among the materials they may appear in. That covers course slides.

**Do not redraw an AWS service mark by hand.** If a service is missing from
this folder, take it from the official package rather than approximating it.
The package is re-released quarterly, at the end of January, April and July.

---

## How AWS draws an architecture diagram

The conventions below are not folklore. Every colour was read out of the
official SVG files in this release, not copied from a blog post.

### Group borders, outermost first

A diagram nests boxes. Each level has its own colour, and whether it is solid
or dashed carries meaning.

| Group | Colour | Line | Icon in the corner |
|---|---|---|---|
| AWS Cloud | `#242F3E` Squid Ink | solid | the AWS Cloud mark |
| Region | `#00A4A6` teal | **dashed** | the Region mark |
| Availability Zone | `#00A4A6` teal | **dashed** | usually none |
| VPC | `#8C4FFF` purple | solid | the VPC mark |
| Public subnet | `#7AA116` green | solid | the public subnet mark |
| Private subnet | `#00A4A6` teal | solid | the private subnet mark |
| Auto Scaling group | `#ED7100` orange | **dashed** | the Auto Scaling mark |
| Corporate data centre | grey | solid | the data centre mark |
| EC2 instance contents | grey | solid | used for things drawn inside one instance |

**Dashed means logical, solid means a boundary you can point at.** A Region and
an Availability Zone are places, so they are dashed. A VPC and a subnet are
network boundaries with addresses, so they are solid. An Auto Scaling group is
a policy, not a place, so it is dashed too.

### Three sizes of icon, and they are not interchangeable

| Kind | Size | Looks like | Use it for |
|---|---|---|---|
| **Service** | 64 | a filled square, category colour, white glyph | the service itself: EC2, VPC, S3 |
| **Resource** | 48 | line art in the category colour, no filled square | one thing of that kind: an instance, an Elastic IP, an internet gateway |
| **Category** | 64 | a filled square | a whole category, rarely needed |

Using a service square where a resource belongs is the commonest mistake. Two
EC2 instances are two **resource** icons inside a subnet, not two orange
squares.

### Category colours, read from this release

| Category | Colour |
|---|---|
| Compute, Containers | `#ED7100` orange |
| Networking and Content Delivery | `#8C4FFF` purple |
| Storage | `#7AA116` green |
| Security, Identity, Compliance | `#DD344C` red |
| Databases, Developer Tools | `#C925D1` magenta |
| Management and Governance | `#E7157B` pink |

### Arrows

AWS uses a plain dark line with a solid arrowhead. Direction is the flow of the
request, not the data. Labels sit on the line and name the protocol or the
port.

### What AWS does not give you

**There is no security group icon in the group set.** Security groups appear
only in the PowerPoint toolkit, drawn as a thin bordered band on the instance
edge. Our decks draw their own door band, which is a deliberate departure and
is documented in the session's `illustrations.md`.

---

## What is in this folder

Kept deliberately small. Add a file when a deck needs it, not in advance.

### `service/` · 64px, filled squares

| File | Service |
|---|---|
| `ec2.svg` | Amazon EC2 |
| `vpc.svg` | Amazon Virtual Private Cloud |
| `elastic-load-balancing.svg` | Elastic Load Balancing ("Load Balancer", content rule 54), added 2026-11-06 |
| `route-53.svg` | Amazon Route 53, added 2026-11-06 |

### `group/` · 32px corner marks for group borders

`aws-cloud.svg` · `aws-account.svg` · `region.svg` ·
`virtual-private-cloud-vpc.svg` · `public-subnet.svg` · `private-subnet.svg` ·
`ec2-instance-contents.svg` · `corporate-data-center.svg`

### `resource/` · 48px line art

| File | Resource |
|---|---|
| `ec2-instance.svg` | one EC2 instance |
| `elastic-ip.svg` | an Elastic IP address |
| `internet-gateway.svg` | a VPC internet gateway |
| `internet.svg` | the internet |
| `client.svg` | a browser or client |
| `users.svg` | people using the service |
| `server.svg` | a generic server |
| `application-load-balancer.svg` | an Application Load Balancer ("ALB"), added 2026-11-06 |
| `network-load-balancer.svg` | a Network Load Balancer ("NLB"), added 2026-11-06 |
| `route-53-resolver.svg` | the Route 53 Resolver ("DNS Resolver"), added 2026-11-06 |

### Added 2026-11-11 (Cloud Security & Shared Responsibility), from the Architecture Icons package 07/31/2026

| File | Service |
|---|---|
| `service/kms.svg` | AWS Key Management Service (KMS) |
| `service/cloudtrail.svg` | AWS CloudTrail |
| `service/waf.svg` | AWS WAF |
| `service/shield.svg` | AWS Shield |
| `service/guardduty.svg` | Amazon GuardDuty |
| `service/trusted-advisor.svg` | AWS Trusted Advisor |
| `service/well-architected-tool.svg` | AWS Well-Architected Tool |
| `service/systems-manager.svg` | AWS Systems Manager |
| `service/inspector.svg` | Amazon Inspector |
| `service/connect.svg` | Amazon Connect |
| `service/certificate-manager.svg` | AWS Certificate Manager (TLS certificates) |
| `resource/iam-access-analyzer.svg` | IAM Access Analyzer |
| `resource/iam-mfa-token.svg` | IAM MFA token |
| `resource/iam-permissions.svg` | IAM permissions (a policy) |
| `resource/iam-encrypted-data.svg` | encrypted data |
| `resource/systems-manager-patch-manager.svg` | Systems Manager Patch Manager |
| `resource/trusted-advisor-checklist-security.svg` | Trusted Advisor security checklist |
| `resource/vpc-network-acl.svg` | VPC network access control list (NACL) |
| `resource/waf-rule.svg` | a WAF rule |
| `resource/iam-long-term-security-credential.svg` | IAM long-term security credential (password, access key); added 2026-11-13 for IAM Fundamentals |
| `resource/iam-temporary-security-credential.svg` | IAM temporary security credential (an STS session token; the package has no separate STS service mark); added 2026-11-13 |

### Added 2026-11-16 (Cloud Threats & Attacks), from the Architecture Icons package 07/31/2026

| File | Service |
|---|---|
| `service/cloudfront.svg` | Amazon CloudFront |
| `service/secrets-manager.svg` | AWS Secrets Manager |
| `service/security-hub.svg` | AWS Security Hub |
| `service/config.svg` | AWS Config |
| `service/ecr.svg` | Amazon Elastic Container Registry (ECR) |
| `service/bedrock.svg` | Amazon Bedrock (Guardrails are a Bedrock feature; the package has no separate Guardrails mark) |
| `resource/cloudfront-edge-location.svg` | a CloudFront edge location |
| `resource/ecr-image.svg` | an ECR container image |

### Added 2026-11-17 (IAM Roles & Least Privilege), from the Architecture Icons package 07/31/2026

| File | Service |
|---|---|
| `service/iam-identity-center.svg` | AWS IAM Identity Center |
| `service/ecs.svg` | Amazon Elastic Container Service (ECS) |
| `service/organizations.svg` | AWS Organizations |
| `resource/iam-aws-sts.svg` | AWS Security Token Service (STS), the IAM resource mark |
| `resource/iam-roles-anywhere.svg` | IAM Roles Anywhere |
| `resource/ecs-task.svg` | an ECS task |

### Added 2026-11-18 (Encryption & Key Management), from the Architecture Icons package 07/31/2026

| File | Service |
|---|---|
| `service/cloudhsm.svg` | AWS CloudHSM |
| `service/nitro-enclaves.svg` | AWS Nitro Enclaves |
| `service/private-certificate-authority.svg` | AWS Private Certificate Authority |
| `resource/acm-certificate-authority.svg` | an ACM certificate authority |
| `resource/iam-data-encryption-key.svg` | a data encryption key (the IAM resource mark) |
| `resource/kms-external-key-store.svg` | a KMS external key store (imported / external key material) |
| `resource/rds-instance.svg` | an RDS database instance |

### Added 2026-11-20 (Cloud-Native Applications), from the Architecture Icons package 07/31/2026

| File | What it is |
|---|---|
| `service/sqs.svg` | Amazon Simple Queue Service (SQS) |
| `service/elasticache.svg` | Amazon ElastiCache |
| `service/eks.svg` | Amazon Elastic Kubernetes Service (EKS) |
| `service/fault-injection-service.svg` | AWS Fault Injection Service |
| `resource/sqs-queue.svg` | an SQS queue |
| `resource/elasticache-for-redis.svg` | ElastiCache for Redis |
| `resource/elasticache-cache-node.svg` | an ElastiCache cache node |
| `group/auto-scaling-group.svg` | the Auto Scaling group frame mark |

## Non-AWS marks

GitHub, Docker, Jenkins and the rest are **not** here. They live in
`slide-kit/assets/tech/` under rule 12, as PNGs named after the technology.
A diagram that mixes AWS services with GitHub and Docker Hub pulls from both
folders, which is correct: they are different vendors and different sets.
