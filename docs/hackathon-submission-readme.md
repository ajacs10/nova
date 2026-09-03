# NOVA Recovery

> An evidence-informed recovery companion for organizing self-reported symptoms, activities, sleep, and daily functioning over time.

NOVA Recovery supports reflection and conversations with healthcare professionals. It does not diagnose concussion, confirm recovery, measure brain function, determine readiness, provide medical clearance, prescribe treatment, or replace professional care.

## What NOVA Does

NOVA helps people organize recovery-related entries and observe changes in their own information.

A user can record symptoms on a 0–10 scale, sleep, activities, before/after activity symptoms, and notes. The Recovery Home provides a timeline and descriptive comparisons for personal reflection and appointment preparation.

NOVA is designed for organization and education. It does not diagnose conditions, prescribe treatment, provide medical clearance, or replace qualified healthcare professionals.

## The Problem

Stress, fatigue, poor sleep, and excessive workload often build gradually. People may notice that they feel worse, but struggle to connect that feeling with patterns in their routine.

Looking at one day in isolation is not enough. NOVA makes the bigger picture easier to see by connecting daily wellbeing check-ins with routine information over time.

## The Solution

NOVA provides a simple cycle:

```text
Daily check-in
      |
      v
Personal history
      |
      v
Pattern awareness
      |
      v
Small, realistic routine suggestions
```

The user remains in control. NOVA presents observations from the user's own information rather than making medical conclusions.

## Core Features

- Daily wellbeing check-ins for mood, sleep, energy, workload, and notes.
- Personal dashboard with real user data only.
- Sleep and workload visualisations.
- Balance and consistency indicators calculated from recorded check-ins.
- Personal insights based on recurring patterns.
- Email verification and secure account sessions.
- Profile management, including phone number and avatar.
- Portuguese and English language support.
- Privacy-focused backend with PostgreSQL, Prisma, server-side authorization, and row-level security for check-in records.

## Why It Matters

NOVA turns vague feelings into information that users can reflect on. By showing personal patterns in a clear and non-judgmental way, it encourages small changes before stress and fatigue become harder to manage.

## Responsible Design

NOVA is not a medical or diagnostic system. It does not claim to detect, diagnose, or treat mental health conditions.

The platform:

- keeps authentication and authorization on the server;
- associates check-ins with the authenticated account;
- protects check-in records with PostgreSQL row-level security;
- stores passwords as Argon2id hashes;
- uses HttpOnly and Secure session cookies in production;
- validates user input and avatar content;
- does not use wellbeing data for advertising;
- shows observations as personal patterns, not clinical conclusions.

## Technology

- Next.js and React frontend.
- NestJS with Fastify backend.
- Prisma ORM.
- PostgreSQL hosted by Supabase.
- Resend for email verification.
- Vercel for the frontend.
- Render for the backend.

## How To Try It

1. Open the deployed application: public URL not provided in the repository.
2. Create an account with an email address you control and complete verification.
3. Confirm the email address.
4. Complete one or more daily check-ins.
5. Open the dashboard and insights pages to see patterns from the submitted data.

## Demo Video

Demo video: not provided in the repository.

## Repository

https://github.com/ajacs10/nova

## Team

Team information is not provided in the repository and must be confirmed by the submitter.

## Hackathon Compliance Notes

- Development start date: not provided in the repository; submitter confirmation required.
- New work presented in this submission: NOVA Recovery check-ins, symptom and activity tracking, descriptive timeline, Safety & Limitations, Evidence & Sources, and Recovery Summary pages.
- Third-party assets and resources: Unsplash images and the cited public concussion guidance sources are used where referenced by the application; additional attribution should be confirmed before submission.
- AI/ML tools used: no AI/ML provider is implemented. Pattern output is deterministic and based on the user's own entries.
- Health and safety considerations: NOVA organizes self-reported information and education. It does not diagnose, treat, confirm recovery, determine readiness, provide medical clearance, or replace healthcare professionals.

## Known Limitations

- NOVA does not provide medical diagnosis or emergency intervention.
- Insights are based on the quantity and quality of user-submitted check-ins.
- Email delivery depends on the configured email provider and verified sender domain.
- Clinician accounts, caregiver sharing, validated clinical scales, emergency triage, notifications, and medical clearance workflows are not implemented.

## Future Improvements

- Recovery and password reset flow.
- Multi-factor authentication for privileged accounts.
- More detailed pattern analysis with user-controlled time ranges.
- Optional clinician or support resource integrations, designed with appropriate privacy safeguards.
- Accessibility testing with users who use assistive technologies.
