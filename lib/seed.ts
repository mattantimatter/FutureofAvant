/**
 * Avant Pathfinder × Antimatter AI ATOM
 * Transforming Trusted Advisor Discovery Through Agentic AI
 * Version 2.0 | March 2026 | Confidential
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
  acceptanceClause: `By signing below, the authorized representatives of Avant and Antimatter AI agree to proceed with the engagement as outlined in this proposal. This signature page serves as a binding Letter of Intent (LOI) and authorizes commencement of work pending execution of a full Master Services Agreement (MSA) within 30 days of signing.

Payment Authorization: Upon execution of this agreement, Avant authorizes Antimatter AI to invoice for the full prepaid deposit of $2,000,000 USD. Payment shall be remitted via wire transfer or ACH within 5 business days of invoice date. Work will commence upon deposit clearance.

Intellectual Property: All deliverables become property of Avant upon final payment. Confidentiality: Both parties agree to maintain confidentiality of proprietary information disclosed during engagement. Termination: Either party may terminate with 30 days written notice; prepaid fees are non-refundable except for material breach. Dispute Resolution: Disputes shall be resolved through binding arbitration in Atlanta, GA.

By signing, I confirm I have the authority to enter into this agreement on behalf of my organization. This electronic signature carries the same legal force and effect as a handwritten signature. Document Classification: Confidential.`,
  meta: {
    preparedBy: 'Antimatter AI — matt@antimatterai.com | (770) 570-0116',
    preparedFor: 'Avant (goavant.net) — Primary Contact: Chris Werpy',
    date: '2026-03-01',
    validUntil: '2026-04-01',
    version: '2.0',
  },
  sections: [
    // ─── 1. HERO ────────────────────────────────────────────────────
    {
      id: 'hero',
      label: 'Overview',
      type: 'hero',
      content: {
        title: 'Avant Pathfinder × ATOM',
        subtitle: 'Transforming Trusted Advisor Discovery Through Agentic AI',
        description:
          'A comprehensive upgrade of Pathfinder\'s three functional pillars—IQA, Competitive Matrices, and Atlas—through Antimatter AI\'s ATOM agentic platform. No rip/replace. Pathfinder stays the system of record; ATOM becomes the intelligence layer.',
        badges: ['Agentic AI', 'No Rip/Replace', 'Real-Time Discovery', 'Geospatial Intelligence'],
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

    // ─── 2. EXECUTIVE SUMMARY ────────────────────────────────────────
    {
      id: 'executive-summary',
      label: 'Executive Summary',
      type: 'bullets',
      content: {
        title: 'Executive Summary',
        subtitle: 'Current friction, proposed transformation, expected outcomes',
        bullets: [
          {
            icon: 'alert',
            title: 'Current State: Three Critical Friction Points',
            body: 'IQAs require 60+ minutes as static intake forms. Competitive Matrices have 3-5 day manual turnarounds. Atlas lacks the interactive geospatial intelligence needed to identify optimal fiber routes and data centers. Together, these create cognitive overload for Trusted Advisors, kill deal momentum, and position Pathfinder as transactional rather than transformational.',
          },
          {
            icon: 'zap',
            title: 'ATOM Solution: Three-Pillar Transformation',
            body: 'IQA Modernization turns static forms into guided 20-25 minute conversation flows. Competitive Matrices become a live, real-time decision tool with same-session rankings. Atlas becomes an interactive 3D geospatial platform for fiber route and data center discovery—all without replacing Pathfinder, which remains the system of record.',
          },
          {
            icon: 'target',
            title: 'Expected Business Outcomes',
            body: '60% reduction in IQA completion time (60 min → 20-25 min). 99%+ faster recommendation turnaround (3-5 days → <5 minutes). ~100 hours/week saved in provider research. 23% increase in conversion rate. 10-20% revenue uplift (McKinsey benchmark).',
          },
          {
            icon: 'check-circle',
            title: 'Implementation Approach',
            body: '"No rip/replace" enhancement. Core pod of 3-5 FTEs across a 6-month, phase-gated program with monthly steering committees and bi-weekly sprint reviews. Each phase has explicit acceptance criteria before proceeding.',
          },
          {
            icon: 'calendar',
            title: 'Investment & Terms',
            body: 'Total Investment: $2,000,000 USD prepaid — single invoice at execution, Net 0. Scope: IQA Modernization $700K + Competitive Matrices $650K + Atlas $550K + Program Management $100K. Conservative 3-year ROI exceeds 1,000% with <6-month payback period.',
          },
        ],
      },
    },

    // ─── 3. THREE-PILLAR FRAMEWORK ───────────────────────────────────
    {
      id: 'atom-framework',
      label: 'Three-Pillar Solution',
      type: 'bento',
      content: {
        title: 'Three-Pillar Transformation',
        subtitle: 'IQA + Competitive Matrices + Atlas',
        description:
          'ATOM doesn\'t automate tasks—it restructures the workflow from transactional to transformational. Each pillar builds on the last, creating a compounding intelligence system that improves with every session.',
        pillars: [
          {
            id: 'iqa',
            step: '01',
            title: 'IQA Modernization',
            subtitle: 'Agentic Discovery Engine',
            icon: 'search',
            color: 'purple',
            description:
              'Transform static intake forms into intelligent guided conversation flows. Real-time advisor coaching, adaptive question sequencing, and automated artifact generation—all within a single session.',
            capabilities: [
              'Guided conversation flows (not forms)',
              'CanonicalIQA normalization with completeness scoring',
              'Real-time coaching panel: next question, objection rebuttal',
              'Post-call artifacts in <5 min: brief, email, notes, packet',
              'Multi-mode: upload/import (MVP) + browser live room (WebRTC)',
              'Session-centric architecture binding audio, form data, and artifacts',
            ],
          },
          {
            id: 'matrices',
            step: '02',
            title: 'Competitive Matrices',
            subtitle: 'Real-Time Provider Comparison',
            icon: 'chart',
            color: 'indigo',
            description:
              'Transform Competitive Matrices from a 3-5 day manual deliverable into a live, interactive decision tool. Providers re-rank in real-time as discovery data changes. "Ask the Matrix" answers any provider question instantly.',
            capabilities: [
              'Live provider ranking and re-ranking during sessions',
              'Fit scoring with evidence coverage metrics',
              'ProviderCard, ComparisonTable, FitMatrixPlot, ObjectionPlaybook',
              '"Ask the Matrix" natural language query with citations',
              'Export: internal advisor view + customer-facing matrix',
              'Atlas integration: geographic filtering by fiber availability',
            ],
          },
          {
            id: 'atlas',
            step: '03',
            title: 'Atlas',
            subtitle: 'Fiber & Data Center Mapping',
            icon: 'network',
            color: 'green',
            description:
              'Build Atlas as an interactive geospatial intelligence platform enabling Trusted Advisors to identify optimal fiber routes and data center locations during network infrastructure discovery sessions.',
            capabilities: [
              'Google Maps API + WebGL 3D fiber route visualization',
              'Interactive 3D data center models with specs & compliance',
              'AI-powered search: "Show fiber routes Atlanta→Miami <10ms"',
              'Route optimization, latency prediction, cost estimation',
              'Fiber availability auto-filters Competitive Matrices',
              'Export: shareable map views, PDF/PNG, embeddable widgets',
            ],
          },
        ],
      },
    },

    // ─── 4. TECHNICAL ARCHITECTURE ───────────────────────────────────
    {
      id: 'deployment-security',
      label: 'Technical Architecture',
      type: 'bento',
      content: {
        title: 'Technical Architecture',
        subtitle: 'Pathfinder stays the system of record — ATOM embeds as the intelligence layer',
        features: [
          {
            title: 'No Rip/Replace Integration',
            icon: 'server',
            description:
              'Pathfinder retains authentication, templates, submissions, and UI. ATOM embeds as services via API/WebSocket (Avant-hosted or managed). Atlas serves as the geospatial intelligence layer informing both IQA and Competitive Matrices.',
            badge: 'Architecture',
          },
          {
            title: 'Atlas Stack: Google Maps + WebGL',
            icon: 'network',
            description:
              'Google Maps JavaScript API for 2D base layer, geocoding, and routing. Three.js / Babylon.js for 3D fiber route visualization with elevation data and real-time camera controls. PostGIS/PostgreSQL for geospatial data storage.',
            badge: 'Atlas Tech',
          },
          {
            title: 'RAG Done Safely',
            icon: 'shield-check',
            description:
              'Citations required on all provider claims. Evidence coverage score on every brief. Hybrid retrieval: vector embeddings + metadata filtering. Deterministic fact tables for certifications, fiber specs, and compliance data.',
            badge: 'AI Safety',
          },
          {
            title: 'Controlled GenUI',
            icon: 'cpu',
            description:
              'Typed UI components — not freeform generation. ProviderCard, ComparisonTable, FitMatrixPlot, ObjectionPlaybook. Stable, predictable interface patterns that maintain full control over the advisor experience.',
            badge: 'Interface',
          },
          {
            title: 'Security & Compliance',
            icon: 'lock',
            description:
              'TLS in transit + AES-256 encryption at rest. Session-level audit logging: input hashes, sources retrieved, model versions. RBAC-enforced separation of coaching data vs. customer-facing deliverables. GDPR/CCPA controls + PII redaction.',
            badge: 'Security',
          },
          {
            title: 'Capture Modes',
            icon: 'book-open',
            description:
              'Upload/Import (MVP): guaranteed coverage for any workflow, post-call processing. Browser Live Room (WebRTC): real-time coaching within Pathfinder. Zoom/Teams integration (Phase 3+): recording ingestion or bot participation.',
            badge: 'Integrations',
          },
        ],
      },
    },

    // ─── 5. THE ADVISOR EXPERIENCE ───────────────────────────────────
    {
      id: 'avant-use-cases',
      label: 'Advisor Experience',
      type: 'bento',
      content: {
        title: 'The Advisor Experience',
        subtitle: 'Before, during, and after — every touchpoint transformed',
        useCases: [
          {
            id: 'before',
            title: 'Before the Conversation',
            icon: 'eye',
            phase: 'Pre-Call',
            priority: 'High',
            description:
              'The advisor selects an IQA category. ATOM instantly generates a discovery brief and soft-start questions based on the customer\'s industry, size, and historical patterns. Atlas flags relevant fiber routes and data centers for the customer\'s geography before the call even begins.',
            outcomes: [
              'Discovery brief and soft-start questions generated instantly',
              'Category-specific blocker flags surfaced proactively',
              'Atlas pre-loads relevant fiber/data center context',
              'Advisor arrives prepared, not reactive',
            ],
            integrations: ['Atlas geospatial layer', 'Customer history', 'IQA category templates'],
          },
          {
            id: 'during',
            title: 'During the Call (Real-Time)',
            icon: 'zap',
            phase: 'Live Coaching',
            priority: 'High',
            description:
              'The Coaching Panel evolves with every response. Current Insight Card, Suggested Next Question, Objection Rebuttal Box, Sentiment & Intent Indicators, and Competitive Matrices where providers re-rank in real-time. Atlas displays fiber availability on a live map as requirements emerge.',
            outcomes: [
              'Adaptive question flow based on each answer',
              'Objection handling before the customer raises it',
              'Providers re-rank live as requirements change',
              'Fiber routes and data centers visualized in Atlas',
            ],
            integrations: ['Competitive Matrices', 'Atlas real-time map', 'Intent detection', 'WebRTC'],
          },
          {
            id: 'after',
            title: 'Post-Call (Immediate Handoff)',
            icon: 'check-circle',
            phase: 'Artifacts',
            priority: 'High',
            description:
              'Within minutes of call completion: ranked recommendation brief with rationale and citations, customer-ready email draft, structured meeting notes, engineering handoff packet, and an Atlas map export showing recommended fiber routes and data centers.',
            outcomes: [
              'Full recommendation package in <5 minutes (vs. 3-5 days)',
              'Customer email drafted and ready to send',
              'Atlas map export included in customer-facing materials',
              'Engineering packet structured for internal Avant teams',
            ],
            integrations: ['Email delivery', 'Atlas export', 'Salesforce/CRM', 'Engineering queue'],
          },
          {
            id: 'atlas-search',
            title: 'Atlas: Geospatial Intelligence',
            icon: 'network',
            phase: 'Ongoing Platform',
            priority: 'High',
            description:
              'Trusted Advisors can query Atlas directly: "Show me dark fiber routes between Chicago and Atlanta with <5ms latency." Atlas renders 3D fiber paths, data center locations, carrier metadata, and cost estimates — then filters Competitive Matrices to show only providers with coverage in those routes.',
            outcomes: [
              'Natural language fiber/data center search with map results',
              '3D visualization of routes with elevation and latency data',
              'Carrier metadata, compliance certs, and proximity analysis',
              'Competitive Matrices automatically filtered by geography',
            ],
            integrations: ['Google Maps API', 'WebGL 3D engine', 'PostGIS', 'Carrier data feeds'],
          },
        ],
      },
    },

    // ─── 6. 6-MONTH ROADMAP ──────────────────────────────────────────
    {
      id: 'rollout-plan',
      label: 'Roadmap',
      type: 'steps',
      content: {
        title: '6-Month Implementation Roadmap',
        subtitle: 'Phase-gated delivery with explicit acceptance criteria at each monthly milestone',
        phases: [
          {
            phase: 'Month 1',
            title: 'Discovery & Foundation',
            duration: 'Weeks 1–4',
            icon: 'search',
            color: 'purple',
            deliverables: [
              'Architecture specification and data contracts',
              'Pilot IQA category selection and approval',
              'CanonicalIQA schema framework and schema factory',
              'Provider data model baseline',
              'Atlas knowledge ingestion pipeline foundation',
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
              'Session object architecture',
              'Post-call artifact generation: briefs, emails, meeting notes',
              'Upload/import capture mode (MVP)',
              'Atlas knowledge ingestion for pilot category',
            ],
            milestone: 'Recommendation brief <5 min with citations · 10-20 test IQAs at >80% accuracy',
          },
          {
            phase: 'Month 3',
            title: 'Competitive Matrices MVP + Atlas Foundation',
            duration: 'Weeks 9–12',
            icon: 'chart',
            color: 'blue',
            deliverables: [
              'Live provider ranking and re-ranking in Competitive Matrices',
              'ProviderCard, ComparisonTable controlled GenUI components',
              '"Ask the Matrix" natural language interface with citations',
              'Atlas Foundation: Google Maps API integration + 2D map rendering',
              'Fiber line database schema + basic data center markers',
            ],
            milestone: 'Competitive Matrices live · Atlas displays fiber routes on 2D map · 3-5 categories',
          },
          {
            phase: 'Month 4',
            title: 'Atlas 3D Visualization + Governance',
            duration: 'Weeks 13–16',
            icon: 'network',
            color: 'purple',
            deliverables: [
              'WebGL 3D rendering engine for fiber routes and data centers',
              'Interactive 3D data center models with specs',
              'Fiber path elevation views with camera controls',
              'Fiber metadata enrichment + data center intelligence layer',
              'Audit trail + role-based governance across all systems',
              'Expanded to 5-8 IQA categories',
            ],
            milestone: 'Atlas 3D functional · Audit logs operational · 100% citation coverage',
          },
          {
            phase: 'Month 5',
            title: 'Atlas AI Assistant + Full Integration',
            duration: 'Weeks 17–20',
            icon: 'bot',
            color: 'green',
            deliverables: [
              'Atlas AI Assistant: natural language query + route optimization',
              'Integration: fiber availability informs IQA questions',
              'Integration: Atlas geo-filters Competitive Matrices by coverage',
              'Export: shareable map views, PDF/PNG, embeddable widgets',
              'Rep performance dashboards + A/B testing framework',
              'Scale to 12-15 IQA categories',
            ],
            milestone: 'Atlas AI answers queries with citations · IQA + Matrices leverage Atlas data',
          },
          {
            phase: 'Month 6',
            title: 'Scale, Polish & Rollout',
            duration: 'Weeks 21–24',
            icon: 'rocket',
            color: 'green',
            deliverables: [
              'All remaining IQA categories (up to 25 total)',
              'Production security review + SOC 2 validation support',
              'User training materials for Trusted Advisors and admins',
              'Handoff runbooks for Avant engineering team',
            ],
            milestone: 'All 25 categories live · Security review passed · Avant team trained · LAUNCH',
          },
        ],
      },
    },

    // ─── 7. INVESTMENT ───────────────────────────────────────────────
    {
      id: 'pricing',
      label: 'Investment',
      type: 'pricing',
      content: {
        title: 'Investment Summary',
        subtitle: 'Transparent workstream allocation — $2M prepaid, single invoice at signing',
        note: 'Total: $2,000,000 USD — Net 0, 100% due upon execution. Excludes travel and third-party software licenses (e.g., OpenAI API credits, cloud infrastructure, Google Maps API usage).',
        tiers: [
          {
            id: 'iqa',
            name: 'IQA Modernization',
            price: '$700,000',
            period: 'included in $2M total',
            badge: 'Pillar 1',
            description: 'Agentic discovery engine. Guided conversation flows, coaching panel, CanonicalIQA schema, artifact generation, session-centric architecture.',
            features: [
              'Guided IQA flows for all 25 categories',
              'Real-time advisor coaching panel',
              'CanonicalIQA normalization + schema factory',
              'Post-call artifacts: brief, email, notes, engineering packet',
              'Upload/import capture (MVP)',
              'Browser live room WebRTC (Phase 5)',
            ],
            cta: 'Part of $2M Engagement',
            highlight: false,
          },
          {
            id: 'production',
            name: 'Competitive Matrices',
            price: '$650,000',
            period: 'included in $2M total',
            badge: 'Pillar 2 — Core',
            description: 'Real-time provider comparison. Live ranking, fit scoring, controlled GenUI, "Ask the Matrix" interface, Atlas geographic filtering.',
            features: [
              'Live provider ranking and re-ranking',
              'Fit scoring with evidence coverage metrics',
              'ProviderCard, ComparisonTable, FitMatrixPlot, ObjectionPlaybook',
              '"Ask the Matrix" natural language queries',
              'Export: advisor view + customer-facing matrix',
              'Atlas integration: geo-filter by fiber coverage',
            ],
            cta: 'Part of $2M Engagement',
            highlight: true,
          },
          {
            id: 'atlas',
            name: 'Atlas + PM',
            price: '$650,000',
            period: 'included in $2M total',
            badge: 'Pillar 3 + PM',
            description: 'Atlas geospatial platform ($550K) + Program Management, Security & QA ($100K).',
            features: [
              'Google Maps API + WebGL 3D fiber visualization',
              'Interactive data center inventory with compliance data',
              'Atlas AI Assistant: natural language route queries',
              'Route optimization, latency prediction, cost estimation',
              'PostGIS geospatial database for fiber + data centers',
              'SOC 2 validation support + security review',
              'Monthly steering committee + bi-weekly sprints',
            ],
            cta: 'Part of $2M Engagement',
            highlight: false,
          },
        ],
        paymentSchedule: [
          {
            milestone: 'Contract execution (this document / LOI)',
            amount: '$2,000,000',
            timing: '100% due at signing — Net 0',
          },
        ],
        roi: {
          headline: 'Conservative 3-Year ROI: 1,000%+',
          metrics: [
            { label: 'Incremental Annual Revenue', value: '$13M', note: '100 reps · 15% uplift · $86.7M baseline' },
            { label: 'Capacity Value (time savings)', value: '$3.75M', note: '~100 hrs/week saved' },
            { label: 'Total Annual Benefit', value: '$16.75M', note: 'Conservative scenario' },
            { label: 'Payback Period', value: '<6 months', note: 'From full deployment (Month 6)' },
            { label: '3-Year NPV', value: '$39M+', note: 'Net of $2M + $0.5M/yr ongoing' },
          ],
        },
      },
    },

    // ─── 8. TERMS & LOI ──────────────────────────────────────────────
    {
      id: 'legal',
      label: 'Terms & LOI',
      type: 'bullets',
      content: {
        title: 'Terms & Letter of Intent',
        subtitle: 'Binding LOI — MSA to be executed within 30 days of signing',
        sections: [
          {
            title: 'Engagement Summary',
            items: [
              'Project: Avant Pathfinder × Antimatter AI ATOM Integration',
              'Scope: IQA Modernization, Competitive Matrices Enhancement, Atlas (Fiber/Data Center Mapping)',
              'Total Investment: $2,000,000 USD prepaid deposit',
              'Term: 6 months (24 weeks) from execution date',
              'Payment: 100% due upon execution of this agreement (Net 0)',
              'Start Date: Within 7 business days of deposit receipt',
              'Engagement Model: Core Pod of 3-5 FTEs (Tech Lead, AI Engineer, Full-Stack, Data Engineer, UX/Design)',
            ],
          },
          {
            title: 'Deliverables Commitment',
            items: [
              'IQA Modernization (Agentic Discovery) — $700,000 allocation',
              'Competitive Matrices (Real-Time Provider Comparison) — $650,000 allocation',
              'Atlas (Fiber Line & Data Center Mapping Tool) — $550,000 allocation',
              'Program Management, Security & QA — $100,000 allocation',
              'MSA to be negotiated and executed within 30 days of this LOI',
              'In event of conflict between LOI and final MSA, MSA shall govern',
            ],
          },
          {
            title: 'Intellectual Property & Confidentiality',
            items: [
              'All deliverables become property of Avant upon final payment',
              'Antimatter AI does not train on Avant data under any circumstance',
              'Atlas geospatial data, IQA schemas, and GenUI components are Avant IP upon delivery',
              'Provider retains ownership of ATOM framework core (licensed to Avant)',
              'Both parties agree to maintain confidentiality of proprietary information',
              'Document Classification: Confidential — For Internal Use Only',
            ],
          },
          {
            title: 'Governing Terms & Contacts',
            items: [
              'Termination: Either party may terminate with 30 days written notice; prepaid fees non-refundable except for material breach',
              'Dispute Resolution: Binding arbitration in Atlanta, GA',
              'Warranty: Deliverables performed in professional manner consistent with industry standards',
              'Provider Liability: Capped at fees paid in prior 3 months',
              'Antimatter AI: matt@antimatterai.com | (770) 570-0116 | 3455 Peachtree Rd NE, Suite 500, Atlanta, GA 30326',
              'Avant: Chris Werpy | 2 N. Riverside Plaza, Suite 2450, Chicago, IL 60606',
            ],
          },
        ],
      },
    },

    // ─── 9. NEXT STEPS ───────────────────────────────────────────────
    {
      id: 'next-steps',
      label: 'Next Steps',
      type: 'cta',
      content: {
        title: 'Ready to Transform Pathfinder?',
        subtitle: 'Four actions required to proceed with Phase 0 Discovery',
        description:
          'The channel partner ecosystem is at an inflection point. First-movers in AI-powered advisor platforms will establish data moats that are difficult for competitors to overcome. This proposal is valid through April 1, 2026.',
        actions: [
          {
            title: 'Sign This Proposal',
            description: 'Approve scope, authorize the $2M prepaid investment, and officially kick off the engagement as a binding LOI.',
            icon: 'pen-tool',
            cta: 'Review & Sign',
            href: '#sign',
            primary: true,
          },
          {
            title: 'Schedule Kickoff',
            description: 'Designate Avant\'s technical lead and project sponsor. Schedule kickoff within 7 business days of deposit receipt.',
            icon: 'calendar',
            cta: 'Book Meeting',
            href: 'mailto:matt@antimatterai.com?subject=Avant%20Pathfinder%20ATOM%20Kickoff',
            primary: false,
          },
          {
            title: 'Select Pilot IQA Category',
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
          '40% of enterprises adopt AI agents by end of 2026 (Gartner) — early movers set the standard',
          '6-month implementation positions Avant 12-18 months ahead of competitive responses',
          'Every IQA session and Atlas query captured builds a proprietary data moat',
          'Conservative 3-year ROI >1,000% with <6-month payback — high-confidence investment',
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
