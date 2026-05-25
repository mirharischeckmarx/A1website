# Security policy

Thanks for helping keep A1 Technology and our customers safe.

## Reporting a vulnerability

Email **security@a1tecno.com** with details. Please do **not** open public GitHub issues for security findings.

Include where helpful:
- A clear description of the issue and its impact.
- Step-by-step reproduction (PoC URL, payload, screenshot).
- Affected component, endpoint, or commit SHA.
- Your contact and (optional) coordinated-disclosure timeline.

For sensitive reports you can encrypt with our PGP key — fingerprint published on https://a1tecno.com/.well-known/security.txt.

## What you can expect

| Stage | SLA (business days) |
|------|--------------------|
| Acknowledgement of receipt | 2 |
| Initial triage + severity | 5 |
| Status update cadence | every 7 |
| Patch or mitigation (Critical / High) | 30 |
| Patch or mitigation (Medium) | 60 |
| Patch or mitigation (Low) | 90 |

We will credit researchers in release notes unless you ask to remain anonymous.

## Scope

In scope:
- `a1tecno.com` and `*.a1tecno.com` web properties
- Code in this repository
- Anything documented as part of A1's customer-facing offering

Out of scope (please **do not** test against these):
- Third-party services hosted on our domains (status pages, marketing CRMs, etc.) — report directly to the vendor.
- Social-engineering, phishing of staff, or physical-security testing.
- DDoS, volumetric attacks, or stress tests.
- Findings that require physical access to a user device.
- Vulnerabilities in software for which a vendor patch is already available — please report upstream.

## Safe-harbour

We will not pursue legal action against researchers who:
1. Make a good-faith effort to follow this policy.
2. Avoid privacy violations, service degradation, and data exfiltration beyond minimal proof-of-concept.
3. Do not disclose publicly before we have had a reasonable opportunity to remediate.

## Out-of-band testing

If you need a staging environment to safely test something, ask in your report — we'll spin one up.

## Hall of fame

Notable contributors are listed in our public security-acknowledgements page (link will be added once we have our first report).
