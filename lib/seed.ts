/**
 * Avant Pathfinder × Antimatter AI ATOM
 * Full proposal content — v2.0, March 2026
 */

export interface ProposalSection {
  id: string
  label: string
  type: 'hero' | 'bullets' | 'bento' | 'steps' | 'pricing' | 'comparison' | 'faq' | 'cta' | 'stats'
  content: Record<string, unknown>
}

export interface ProposalJSON {
  version: string
  acceptanceClause: string
  meta: {
    preparedBy: string
    preparedFor: string
    date: string
    validUntil: string
    version: string
  }
  sections: ProposalSection[]
}

export const defaultProposalJSON: ProposalJSON = {
  version: '2.0',
  acceptanceClause: `By signing this proposal, I confirm that I have read, understood, and agree to the terms and conditions set forth herein. I acknowledge this constitutes a binding agreement between Avant Technology Partners ("Client") and Antimatter AI ("Provider") for the implementation of the ATOM platform into Avant's Pathfinder system as described. I confirm I have the authority to enter into this agreement on behalf of my organization. Payment of $2,000,000 is due in full upon execution of this agreement (Net 0). This electronic signature carries the same legal force and effect as a handwritten signature.

Accepted this day, at the time recorded in the audit log, from the IP address and device captured herein. Document Classification: Confidential.`,
  meta: {
    preparedBy: 'Antimatter AI — enterprise@antimatterai.com',
    preparedFor: 'Avant Technology Partners (goavant.net)',
    date: '2026-03-01',
    validUntil: '2026-04-01',
    version: '2.0',
  },
  sections: [
    {
      id: 'hero',
      label: 'Overview',
      type: 'hero',
      content: {
        title: 'Avant Pathfinder × ATOM',
        subtitle: 'Transforming Channel Partner Discovery Through Agentic AI',
        description:
          'A comprehensive upgrade of Pathfinder\'s three functional pillars—IQA, Dynamic Matrix, and Atlas—through Antimatter AI\'s ATOM agentic platform. Transform channel partner discovery from transactional to transformational.',
        badges: ['Agentic AI', 'No Rip/Replace', 'Real-Time Discovery', 'Enterprise-Grade'],
        stats: [
          { label: 'IQA Time Reduction', value: '60%' },
          { label: 'Rec. Turnaround', value: '<5 min' },
          { label: 'Revenue Uplift', value: '10-20%' },
          { label: 'Implementation', value: '6 Months' },
        ],
        ctas: [
          { label: 'Review & Sign', href: '#sign', primary: true },
          { label: 'Download PDF', href: '#download', primary: false },
        ],
      },
    },
    {
      id: 'executive-summary',
      label: 'Executive Summary',
      type: 'bullets',
      content: {
        title: 'Executive Summary',
        subtitle: 'Current state challenges and the ATOM transformation',
        bullets: [
          {
            icon: 'alert',
            title: 'Current State: Critical Friction Points',
            body: 'Pathfinder\'s three core pillars limit scale and impact: IQAs require 60+ minutes as static intake forms. Dynamic Matrices have 3-5 day manual turnarounds. Atlas operates as a siloed repository rather than an active guidance system. Together, these create cognitive overload for Trusted Advisors and break sales momentum.',
          },
          {
            icon: 'zap',
            title: 'ATOM Solution: Three-Pillar Transformation',
            body: 'IQA Modernization transforms static forms into guided conversation flows, reducing completion to 20-25 minutes. Dynamic Matrix Enhancement enables live provider ranking during sessions. Atlas Operationalization activates the provider intelligence layer powering all recommendations—all without ripping or replacing Pathfinder.',
          },
          {
            icon: 'target',
            title: 'Expected Business Outcomes',
            body: '60% reduction in IQA completion time (60 min → 20-25 min). 99%+ faster recommendation turnaround (3-5 days → <5 minutes). ~100 hours/week saved in provider research. 23% increase in conversion rate (industry benchmark). 10-20% revenue uplift (McKinsey benchmark).',
          },
          {
            icon: 'check-circle',
            title: 'Implementation Approach',
            body: '"No rip/replace" enhancement: Pathfinder remains the system of record for authentication, templates, and workflow orchestration. ATOM embeds as a set of services and controlled GenUI components. Core pod of 3-5 FTEs across a 6-month, phase-gated program with clear acceptance criteria at each month.',
          },
          {
            icon: 'calendar',
            title: 'Investment & Timeline',
            body: 'Total Investment: $2,000,000 (prepaid, due at signing, Net 0). 6-month / 24-week implementation program. Scope: IQA Modernization $800K + Dynamic Matrix $600K + Atlas Operationalization $500K + Program Management $100K. Conservative 3-year ROI exceeds 1,000% with <6-month payback.',
          },
        ],
      },
    },
    {
      id: 'atom-framework',
      label: 'ATOM Framework',
      type: 'bento',
      content: {
        title: 'The Three-Pillar Transformation',
        subtitle: 'IQA Modernization + Dynamic Matrix + Atlas',
        description:
          'ATOM doesn\'t automate tasks—it restructures the workflow from transactional to transformational. Each pillar builds on the last to create a compound intelligence system that improves with every interaction.',
        pillars: [
          {
            id: 'iqa',
            step: '01',
            title: 'IQA Modernization',
            subtitle: 'Agentic Discovery Engine',
            icon: 'search',
            color: 'purple',
            description:
              'Transform static intake forms into intelligent guided conversation flows. Real-time advisor coaching, adaptive question sequencing, and automated artifact generation—all within a single session. Reduce IQA completion from 60 minutes to 20-25 minutes.',
            capabilities: [
              'Guided conversation flows (not forms)',
              'CanonicalIQA normalization with completeness scoring',
              'Real-time advisor coaching panel with next-question suggestions',
              'Automated: recommendation briefs, customer emails, meeting notes',
              'Multi-mode: upload/import (MVP) + browser live room',
              'Session-centric architecture binding audio, form data, and artifacts',
            ],
          },
          {
            id: 'matrix',
            step: '02',
            title: 'Dynamic Matrix',
            subtitle: 'Real-Time Comparison Engine',
            icon: 'chart',
            color: 'indigo',
            description:
              'Transform the Dynamic Matrix from a manual 3-5 day deliverable into a live, interactive decision tool. Providers re-rank in real-time as discovery data changes. "Ask the Matrix" natural language interface for instant intelligence queries.',
            capabilities: [
              'Live provider ranking and re-ranking during sessions',
              'Fit scoring engine with evidence coverage metrics',
              'Controlled GenUI: ProviderCard, ComparisonTable, FitMatrixPlot, ObjectionPlaybook',
              '"Ask the Matrix" natural language query interface',
              'Export: internal advisor views + sanitized customer-facing matrices',
              'Powered by Atlas knowledge layer',
            ],
          },
          {
            id: 'atlas',
            step: '03',
            title: 'Atlas Operationalization',
            subtitle: 'Provider Intelligence System',
            icon: 'database',
            color: 'green',
            description:
              'Transform Atlas from a passive repository into the active intelligence layer powering all Pathfinder recommendations. Hybrid retrieval (semantic + metadata), deterministic fact tables, and feedback loops that improve with every deal outcome.',
            capabilities: [
              'Provider capability model with verification timestamps',
              'Automated knowledge ingestion pipelines',
              'Hybrid retrieval: vector embeddings + metadata filtering',
              'Deterministic fact tables (no hallucinations on certifications)',
              'Role-based governance: internal vs. external data separation',
              'Feedback loops: won/lost outcomes refine retrieval and scoring',
            ],
          },
        ],
      },
    },
    {
      id: 'deployment-security',
      label: 'Architecture',
      type: 'bento',
      content: {
        title: 'Technical Architecture',
        subtitle: 'No rip/replace — Pathfinder stays the system of record',
        features: [
          {
            title: 'System Architecture',
            icon: 'server',
            description:
              'Pathfinder retains authentication, templates, submissions, and UI. ATOM embeds as a set of intelligent services (Avant-hosted or managed) via API/WebSocket. Atlas is the central knowledge foundation powering IQA and Dynamic Matrix.',
            badge: 'Architecture',
          },
          {
            title: 'RAG Done Safely',
            icon: 'shield-check',
            description:
              'Citations required on all provider claims. Evidence coverage score on every brief. Hybrid retrieval combines vector embeddings with metadata/keyword indices for high-precision results. Deterministic fact tables prevent hallucinations on critical specs.',
            badge: 'AI Safety',
          },
          {
            title: 'Controlled GenUI',
            icon: 'cpu',
            description:
              'Typed UI components—not freeform generation—ensure interface stability. ProviderCard, ComparisonTable, FitMatrixPlot, ObjectionPlaybook. ATOM renders structured output via typed component contracts, maintaining full control over the experience.',
            badge: 'Interface',
          },
          {
            title: 'Session-Centric Data',
            icon: 'database',
            description:
              'CanonicalIQA schema normalizes unstructured inputs with completeness scoring and risk flags. Session objects bind audio, form data, and artifacts into a single context. ProviderCapability model with compliance metadata and verification timestamps.',
            badge: 'Data Models',
          },
          {
            title: 'Security & Compliance',
            icon: 'lock',
            description:
              'TLS in transit + encryption at rest. Session-level audit logging of input hashes, sources retrieved, and model versions. RBAC-enforced separation between coaching data and customer-facing deliverables. GDPR/CCPA consent management and PII redaction.',
            badge: 'Security',
          },
          {
            title: 'Capture Modes',
            icon: 'network',
            description:
              'Upload/Import (MVP): guaranteed coverage for any workflow, post-call processing. Browser Live Room (WebRTC): real-time coaching when calls run within Pathfinder. Zoom/Teams integration (Phase 3+): recording ingestion or bot participation.',
            badge: 'Integrations',
          },
        ],
      },
    },
    {
      id: 'avant-use-cases',
      label: 'Experience',
      type: 'bento',
      content: {
        title: 'The Advisor Experience',
        subtitle: 'Before, during, and after the call — transformed',
        useCases: [
          {
            id: 'before',
            title: 'Before the Conversation',
            icon: 'eye',
            phase: 'Pre-Call',
            priority: 'High',
            description:
              'The advisor selects an IQA category. ATOM instantly generates a discovery brief and soft-start questions based on the customer\'s industry, size, and historical patterns—flagging potential category-specific blockers before the call begins.',
            outcomes: [
              'Discovery brief and soft-start questions generated instantly',
              'Category-specific blocker flags surfaced proactively',
              'Pattern matching across analogous customers',
              'Advisor arrives prepared, not reactive',
            ],
            integrations: ['Atlas knowledge layer', 'Customer history', 'Category templates'],
          },
          {
            id: 'during',
            title: 'During the Call (Real-Time)',
            icon: 'zap',
            phase: 'Live Coaching',
            priority: 'High',
            description:
              'The Coaching Panel evolves with every response: Current Insight Card, Suggested Next Question, Objection Rebuttal Box, Sentiment & Intent Indicators, and Dynamic Matrices where providers re-rank in real-time. Advisors are coached, not left to improvise.',
            outcomes: [
              'Adaptive question flow based on each answer',
              'Objection handling surfaced before the customer raises it',
              'Providers re-rank in real-time as requirements emerge',
              'Sentiment and intent signals visualized for the advisor',
            ],
            integrations: ['Dynamic Matrix', 'Atlas RAG', 'Intent detection', 'WebRTC live room'],
          },
          {
            id: 'after',
            title: 'Post-Call (Immediate Handoff)',
            icon: 'check-circle',
            phase: 'Artifacts',
            priority: 'High',
            description:
              'Within minutes of call completion, ATOM delivers a complete package: ranked recommendation brief with "why" rationale and citations, customer-ready email draft, structured meeting notes, and engineering handoff packet—ending the 3-5 day wait.',
            outcomes: [
              'Recommendation brief in <5 minutes (vs. 3-5 days)',
              'Customer email drafted and ready to send',
              'Meeting notes and requirements checklist auto-generated',
              'Engineering packet structured for internal teams',
            ],
            integrations: ['Email delivery', 'Pathfinder submission', 'Salesforce/CRM', 'Engineering queue'],
          },
          {
            id: 'intelligence',
            title: 'Atlas: Continuously Learning',
            icon: 'trending-up',
            phase: 'Intelligence Layer',
            priority: 'High',
            description:
              'Every session feeds Atlas. Outcome data (won/lost) refines retrieval algorithms and scoring models over time. Provider capability models update with new compliance data, pricing changes, and verification timestamps—creating a compounding intelligence moat.',
            outcomes: [
              'Evidence coverage score improves with every session',
              'Win/loss data directly improves future recommendations',
              'Provider capability model stays current automatically',
              'Platform gets smarter as Avant grows',
            ],
            integrations: ['CRM outcome data', 'Provider portal updates', 'Historical matrices', 'Case studies'],
          },
        ],
      },
    },
    {
      id: 'rollout-plan',
      label: 'Roadmap',
      type: 'steps',
      content: {
        title: '6-Month Implementation Roadmap',
        subtitle: 'Phase-gated delivery with clear acceptance criteria at each milestone',
        phases: [
          {
            phase: 'Month 1',
            title: 'Discovery & Foundation',
            duration: 'Weeks 1–4',
            icon: 'search',
            color: 'purple',
            deliverables: [
              'Architecture specification and data contracts',
              'Pilot category selection and approval',
              'CanonicalIQA schema framework',
              'Provider data model baseline',
              'Atlas knowledge ingestion pipeline (foundation)',
              'RAG retrieval baseline established',
            ],
            milestone: 'Schema factory operational + pilot category approved',
          },
          {
            phase: 'Month 2',
            title: 'IQA POC + Artifacts + Atlas Baseline',
            duration: 'Weeks 5–8',
            icon: 'rocket',
            color: 'indigo',
            deliverables: [
              'Coaching panel UI (advisor-only view)',
              'Session object architecture built',
              'Post-call artifact generation: briefs, emails, meeting notes',
              'Upload/import capture mode (MVP)',
              'Atlas knowledge ingestion for pilot category',
            ],
            milestone: 'Recommendation brief <5 min with citations · 10-20 test IQAs at >80% accuracy',
          },
          {
            phase: 'Month 3',
            title: 'Dynamic Matrix MVP + Ask-the-Matrix',
            duration: 'Weeks 9–12',
            icon: 'chart',
            color: 'blue',
            deliverables: [
              'Live provider ranking and re-ranking',
              'Controlled GenUI components: ProviderCard, ComparisonTable',
              '"Ask the Matrix" natural language interface',
              'Fit scoring engine with evidence coverage metrics',
              'Provider capability model expanded to 3-5 categories',
            ],
            milestone: 'Dynamic Matrix updates live · Ask-the-Matrix answers with citations',
          },
          {
            phase: 'Month 4',
            title: 'Atlas Hardening + Governance + Scale',
            duration: 'Weeks 13–16',
            icon: 'shield-check',
            color: 'purple',
            deliverables: [
              'Verification timestamps + compliance metadata',
              'Role-based governance and audit trail logs',
              'GDPR/CCPA controls implemented',
              'Deterministic fact tables for critical specs',
              'Feedback loop architecture built',
              'Expanded to 5-8 categories',
            ],
            milestone: 'Atlas audit logs operational · 100% citation coverage · 5-8 categories live',
          },
          {
            phase: 'Month 5',
            title: 'Integration + Dashboards + A/B Testing',
            duration: 'Weeks 17–20',
            icon: 'settings',
            color: 'green',
            deliverables: [
              'Real-time sentiment and intent detection',
              'Rep performance dashboard',
              'A/B testing framework',
              'Expanded coaching library',
              'Scale to 12-15 categories',
              'Optional: Browser live room (WebRTC)',
            ],
            milestone: 'Performance dashboards show measurable time reduction · A/B tests operational',
          },
          {
            phase: 'Month 6',
            title: 'Scale, Polish & Rollout Readiness',
            duration: 'Weeks 21–24',
            icon: 'rocket',
            color: 'green',
            deliverables: [
              'All remaining categories (up to 25 total)',
              'Production security review',
              'SOC 2 validation support',
              'User training materials',
              'Handoff runbooks for Avant team',
            ],
            milestone: 'All 25 categories live · Security review passed · Avant team trained · LAUNCH',
          },
        ],
      },
    },
    {
      id: 'pricing',
      label: 'Investment',
      type: 'pricing',
      content: {
        title: 'Investment Summary',
        subtitle: 'Transparent, workstream-based allocation',
        note: 'Total investment: $2,000,000 prepaid. Single invoice upon execution — Net 0 (due at signing). Excludes travel and third-party software licenses (e.g., OpenAI API credits, cloud infrastructure).',
        tiers: [
          {
            id: 'iqa',
            name: 'IQA Modernization',
            price: '$800,000',
            period: 'included in total',
            badge: 'Pillar 1',
            description: 'Guided conversation flows, coaching panel, CanonicalIQA schema, automated artifact generation, and session-centric architecture.',
            features: [
              'Guided IQA conversation flows (all 25 categories)',
              'Real-time advisor coaching panel',
              'CanonicalIQA normalization and schema factory',
              'Post-call artifact generation (brief, email, notes, packet)',
              'Upload/import capture mode (MVP)',
              'Browser live room (WebRTC) — Phase 5',
              'Session-centric data architecture',
            ],
            cta: 'Included in $2M',
            highlight: false,
          },
          {
            id: 'production',
            name: 'Dynamic Matrix Enhancement',
            price: '$600,000',
            period: 'included in total',
            badge: 'Pillar 2 — Core',
            description: 'Live provider ranking, fit scoring engine, controlled GenUI components, "Ask the Matrix" interface, and exportable comparison matrices.',
            features: [
              'Live provider ranking and re-ranking',
              'Fit scoring engine with evidence coverage metrics',
              'ProviderCard, ComparisonTable, FitMatrixPlot, ObjectionPlaybook',
              '"Ask the Matrix" natural language interface',
              'Export: advisor view + customer-facing matrix',
              'FitMatrixPlot visualization component',
              'Category expansion to 25 total',
            ],
            cta: 'Included in $2M',
            highlight: true,
          },
          {
            id: 'atlas',
            name: 'Atlas + Program Management',
            price: '$600,000',
            period: 'included in total',
            badge: 'Pillars 3 + PM',
            description: 'Atlas Operationalization ($500K) — provider intelligence system, hybrid RAG retrieval, governance. Program Management, Security & QA ($100K).',
            features: [
              'Provider capability model with verification timestamps',
              'Knowledge ingestion pipelines (automated)',
              'Hybrid retrieval: vector + metadata filtering',
              'Deterministic fact tables (no hallucinations)',
              'Feedback loops: outcome data → model improvement',
              'GDPR/CCPA controls + audit trail',
              'SOC 2 validation support + security review',
              'Monthly steering committee + bi-weekly sprints',
            ],
            cta: 'Included in $2M',
            highlight: false,
          },
        ],
        paymentSchedule: [
          { milestone: 'Contract execution (this document)', amount: '$2,000,000', timing: '100% due at signing — Net 0' },
        ],
        roi: {
          headline: 'Conservative 3-Year ROI: 1,000%+',
          metrics: [
            { label: 'Incremental Annual Revenue', value: '$13M', note: '100 reps · 15% uplift · $86.7M baseline' },
            { label: 'Capacity Value (time savings)', value: '$3.75M', note: '~100 hrs/week saved @ blended rate' },
            { label: 'Total Annual Benefit', value: '$16.75M', note: 'Conservative scenario' },
            { label: 'Payback Period', value: '<6 months', note: 'From full deployment (Month 6)' },
            { label: '3-Year NPV', value: '$39M+', note: 'Net of $2M implementation + $0.5M/year ongoing' },
          ],
        },
      },
    },
    {
      id: 'legal',
      label: 'Terms',
      type: 'bullets',
      content: {
        title: 'Terms & Statement of Work',
        subtitle: 'Key terms summary — Confidential',
        sections: [
          {
            title: 'Statement of Work',
            items: [
              'Provider: Antimatter AI (antimatterai.com/enterprise-ai) — Atlanta, GA',
              'Client: Avant Technology Partners (goavant.net)',
              'Scope: ATOM platform integration into Pathfinder (IQA + Dynamic Matrix + Atlas) across 6-month program',
              'Engagement Model: Core Pod of 3-5 FTEs (Tech Lead, AI Engineer, Full-Stack, Data Engineer, UX/Design)',
              'Acceptance: Each phase accepted at monthly phase gate per specified success criteria',
              'Change Orders: Additional scope beyond 25 categories requires written agreement',
            ],
          },
          {
            title: 'Commercial Terms',
            items: [
              'Total Investment: $2,000,000 (USD) — single invoice at execution',
              'Payment Terms: Net 0 — 100% due upon signing of this proposal',
              'Term: 6 months (24 weeks) from execution date',
              'Exclusions: Travel expenses and third-party software licenses not included',
              'Third-party examples: OpenAI API credits, cloud infrastructure, Zoom/Teams SDK licensing',
              'Renewals: Ongoing support and expansion terms negotiated separately after Month 6',
            ],
          },
          {
            title: 'Intellectual Property',
            items: [
              'Client owns all custom agents, workflows, CanonicalIQA schemas, and artifacts created during engagement',
              'Provider does not train on Client data under any circumstance',
              'Atlas knowledge and provider models built during engagement are Client IP',
              'Provider retains ownership of ATOM framework core (licensed to Client for Pathfinder use)',
              'All GenUI components created for Pathfinder are Client IP upon delivery and acceptance',
            ],
          },
          {
            title: 'Governance & Risk',
            items: [
              'Monthly Steering Committee meetings for phase gate approvals',
              'Bi-weekly working team sprints for delivery tracking',
              'Hallucination risk: mitigated by citations, evidence coverage scoring, and deterministic fact tables',
              'Adoption risk: mitigated by confidence gating and fast wins (automated briefs, Month 2)',
              'Provider liability capped at fees paid in prior 3 months',
              'Neither party liable for indirect, consequential, or punitive damages',
            ],
          },
        ],
      },
    },
    {
      id: 'next-steps',
      label: 'Next Steps',
      type: 'cta',
      content: {
        title: 'Ready to Transform Pathfinder?',
        subtitle: 'Four actions required to proceed with Phase 0 Discovery',
        description:
          'The channel partner ecosystem is at an inflection point. First-movers in channel partner AI co-pilots will establish data moats that are difficult for competitors to overcome. This proposal is valid through April 1, 2026.',
        actions: [
          {
            title: 'Sign This Proposal',
            description: 'Approve scope, authorize the $2M prepaid investment, and officially kick off the engagement.',
            icon: 'pen-tool',
            cta: 'Review & Sign',
            href: '#sign',
            primary: true,
          },
          {
            title: 'Schedule Kickoff',
            description: 'Designate Avant\'s technical lead and project sponsor. Schedule kickoff within 7 days of signing.',
            icon: 'calendar',
            cta: 'Book Meeting',
            href: 'https://calendly.com/antimatterai',
            primary: false,
          },
          {
            title: 'Select Pilot Category',
            description: 'Identify the IQA category with strongest data maturity and highest business impact for Month 2 POC.',
            icon: 'target',
            cta: 'Ask Atom',
            href: '#ask-atom',
            primary: false,
          },
        ],
        contacts: [
          { name: 'Matt Bravo', role: 'CMO, Antimatter AI', email: 'matt@antimatterai.com' },
          { name: 'Paul Wallace', role: 'CTO, Antimatter AI', email: 'paul@antimatterai.com' },
        ],
        validUntil: 'April 1, 2026',
        urgencyItems: [
          '40% of enterprises adopt AI agents by end of 2026 (Gartner)',
          '6-month implementation positions Avant 12-18 months ahead of competitors',
          'Every IQA session captured builds an Atlas data moat',
          'Conservative 3-year ROI >1,000% with <6 month payback',
        ],
      },
    },
  ],
}

export const defaultPricingJSON = {
  tiers: defaultProposalJSON.sections.find((s) => s.id === 'pricing')?.content?.tiers ?? [],
  paymentSchedule: defaultProposalJSON.sections.find((s) => s.id === 'pricing')?.content?.paymentSchedule ?? [],
  roi: defaultProposalJSON.sections.find((s) => s.id === 'pricing')?.content?.roi ?? {},
  lastUpdated: new Date().toISOString(),
}
