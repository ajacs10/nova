# Clinical & Scientific Foundation

## NOVA Recovery

NOVA Recovery is an evidence-informed recovery companion. It organizes self-reported symptoms, sleep, activities, and notes so a person can observe changes over time and prepare conversations with a healthcare professional.

It does not diagnose concussion, measure brain function, confirm recovery, determine readiness, provide medical clearance, prescribe treatment, or replace professional care.

## Evidence Sources

- [Amsterdam 2022 International Consensus Statement](https://bjsm.bmj.com/content/57/11/695), the 6th International Conference on Concussion in Sport.
- [Living Concussion Guidelines](https://concussionsontario.org/).
- [PedsConcussion Living Guideline](https://pedsconcussion.com/).

These sources inform the product's emphasis on symptom tracking, gradual return to cognitive and physical activity, temporary adaptations, professional follow-up, and medical clearance before contact or high-risk activity. NOVA does not decide when a user should progress.

## Product Rationale

| Feature | Rationale | Boundary |
| --- | --- | --- |
| Recovery check-in | Makes changes in self-reported symptoms visible over time. | Values are not a severity diagnosis or brain score. |
| Activity before/after | Records descriptive differences around an activity. | A higher after-entry does not establish causality. |
| Timeline | Organizes entries for personal reflection and appointments. | It is not a clinical record or validated outcome measure. |
| Recovery summary | Helps prepare questions for a professional. | It is not a medical assessment or treatment plan. |

## Observed Patterns

The current implementation uses deterministic comparisons of the user's own entries. It does not use a machine-learning model or external AI provider. Product language therefore uses `observed`, `followed`, and `entries show`; it must not use `caused`, `diagnosed`, `predicts`, or `proves`.

## Safety

Users should seek medical evaluation when they are concerned, symptoms persist, or symptoms worsen. Emergency advice must use local emergency services and must not depend on NOVA. The product is not a substitute for urgent assessment.

## Scope Limitations

The current prototype does not include clinician accounts, caregiver sharing, validated clinical scales, emergency triage, notifications, or medical clearance workflows. These are intentionally not implied by the interface.