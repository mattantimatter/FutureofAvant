/**
 * Default proposal content for Avant × Antimatter ATOM deployment proposal.
 * This JSON drives all sections of the interactive proposal viewer.
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
  version: '1.0',
  acceptanceClause: `By signing this proposal, I confirm that I have read, understood, and agree to the terms and conditions outlined herein. I acknowledge that this constitutes a binding agreement between Avant Technology Partners ("Client") and Antimatter AI ("Provider") for the deployment of the ATOM enterprise AI framework as described. I confirm I have the authority to enter into this agreement on behalf of my organization. This electronic signature has the same legal force and effect as a handwritten signature.

Accepted this day, at the time recorded in the audit log, from the IP address and device captured herein.`,
  meta: {
    preparedBy: 'Antimatter AI — paul@antimatterai.com',
    preparedFor: 'Avant Technology Partners',
    date: '2026-03-01',
    validUntil: '2026-04-01',
    version: '1.0',
  },
  sections: [
    {
      id: 'hero',
      label: 'Overview',
      type: 'hero',
      content: {
        title: 'Avant × Antimatter',
        subtitle: 'ATOM Deployment Proposal',
        description:
          'Deploy governed enterprise AI across voice, search, and workflows — in your infrastructure. Full IP ownership, no data training, deploy anywhere.',
        badges: ['Enterprise-Grade', 'VPC / On-Prem Ready', 'SOC2-Aligned'],
        stats: [
          { label: 'Deployment Time', value: '4–6 Weeks' },
          { label: 'Pilot Use Cases', value: '2' },
          { label: 'IP Ownership', value: '100%' },
          { label: 'Model Lock-in', value: 'Zero' },
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
        subtitle: 'Why Avant × Antimatter ATOM',
        bullets: [
          {
            icon: 'target',
            title: 'Strategic Objective',
            body: 'Deploy governed, on-infrastructure AI agents across Avant\'s partner enablement, buyer intent, and internal knowledge workflows — delivering measurable ROI within 90 days.',
          },
          {
            icon: 'shield',
            title: 'Key Constraints Addressed',
            body: 'Avant requires full data sovereignty, no model training on proprietary partner data, RBAC-enforced access, and audit trails for compliance. ATOM is built for exactly this.',
          },
          {
            icon: 'zap',
            title: 'Proposed Solution',
            body: 'ATOM\'s Brain → Spine → Digital Worker architecture deployed in Avant\'s VPC or hybrid cloud. Pilot launches 2 high-impact use cases in Phase 1, with full production rollout in Phase 2.',
          },
          {
            icon: 'check-circle',
            title: 'Success Criteria',
            body: 'Partner assistant response quality ≥ 90% accuracy. Buyer intent signal lift ≥ 25%. Internal knowledge retrieval p50 latency ≤ 800ms. Full audit coverage of all agent actions.',
          },
          {
            icon: 'calendar',
            title: 'Proposed Timeline',
            body: 'Phase 0 (Discovery): 2 weeks. Phase 1 (Pilot): 4–6 weeks. Phase 2 (Production): 6–8 weeks. Phase 3 (Expansion): Ongoing. Total time to first value: ~6 weeks.',
          },
        ],
      },
    },
    {
      id: 'atom-framework',
      label: 'ATOM Framework',
      type: 'bento',
      content: {
        title: 'The ATOM Framework',
        subtitle: 'Brain → Spine → Digital Worker',
        description:
          'ATOM is not a point tool — it\'s a composable enterprise AI runtime. Three layers work together to give Avant governed, auditable, model-agnostic AI agents.',
        pillars: [
          {
            id: 'brain',
            step: '01',
            title: 'Brain',
            subtitle: 'Model + Provider Layer',
            icon: 'cpu',
            color: 'purple',
            description:
              'Pluggable AI model layer. ATOM abstracts the model so you\'re never locked into a single provider. Run GPT-4o, Claude 3.5, Grok, Llama, or your own fine-tuned models — swap at any time without rewriting product logic.',
            capabilities: [
              'Multi-model routing (OpenAI, Anthropic, Grok)',
              'Open-source + private model support',
              'BYO embeddings and vector stores',
              'Cost/latency/compliance-based routing',
              'A/B model testing in production',
            ],
          },
          {
            id: 'spine',
            step: '02',
            title: 'Spine',
            subtitle: 'Orchestration + Governance Layer',
            icon: 'network',
            color: 'indigo',
            description:
              'The connective tissue between models and workers. Spine handles tool calling, RAG retrieval, policy enforcement, RBAC, audit logging, and deterministic workflows — giving you full control over every agent action.',
            capabilities: [
              'Tool calling + MCP integration',
              'RAG / retrieval over private knowledge',
              'RBAC with per-environment policies',
              'Immutable audit trail (every action logged)',
              'Workflow replay and exception handling',
              'Approval gates for sensitive operations',
            ],
          },
          {
            id: 'worker',
            step: '03',
            title: 'Digital Worker',
            subtitle: 'Agent Deployment Layer',
            icon: 'bot',
            color: 'green',
            description:
              'Agents deployed into real workflows — not demos. Digital Workers connect to EHRs, CRMs, billing systems, phones, and internal tools with deterministic behavior, human-override capability, and full exception handling.',
            capabilities: [
              'Voice agents (phone + web)',
              'Search + knowledge assistants',
              'Workflow automation with approvals',
              'CRM / ERP / internal tool integration',
              'Human-in-the-loop override',
              'Edge + VPC deployment options',
            ],
          },
        ],
      },
    },
    {
      id: 'deployment-security',
      label: 'Deployment & Security',
      type: 'bento',
      content: {
        title: 'Deployment & Security',
        subtitle: 'Your infrastructure. Your rules.',
        features: [
          {
            title: 'Deploy Anywhere',
            icon: 'server',
            description:
              'Run ATOM in your own VPC, private cloud, hybrid environment, or on-premises. Kubernetes-native with container support. No data ever leaves your environment unless you choose.',
            badge: 'Infrastructure',
          },
          {
            title: 'RBAC + Audit Trails',
            icon: 'lock',
            description:
              'Fine-grained role-based access control. Every agent action, model call, retrieval, and tool use is logged with timestamp, user, and context. Full replay capability.',
            badge: 'Governance',
          },
          {
            title: 'Zero Training Guarantee',
            icon: 'shield-check',
            description:
              'Antimatter AI does not train on your data, prompts, or outputs. Your IP stays yours. Contractually guaranteed data isolation with no shared model pools.',
            badge: 'IP Protection',
          },
          {
            title: 'Data Boundaries',
            icon: 'database',
            description:
              'Encryption at rest and in transit. Private networking support. Per-environment data retention policies. Regional execution with data-residency boundary enforcement.',
            badge: 'Compliance',
          },
          {
            title: 'SOC2 & HIPAA Alignment',
            icon: 'file-check',
            description:
              'Architecture supports SOC2 Type II audit programs. HIPAA-aligned deployment patterns available. Controls documentation provided for compliance teams.',
            badge: 'Certifications',
            note: 'Supports alignment — not a certification claim',
          },
          {
            title: 'Provider Flexibility',
            icon: 'refresh',
            description:
              'Model-agnostic runtime. Swap AI providers without changing product logic. Avoid vendor lock-in as the model market evolves. Your agents survive the next GPT release.',
            badge: 'Flexibility',
          },
        ],
      },
    },
    {
      id: 'avant-use-cases',
      label: 'Use Cases',
      type: 'bento',
      content: {
        title: 'Avant Use Cases',
        subtitle: 'Four high-impact deployments for Avant\'s team',
        useCases: [
          {
            id: 'partner-assistant',
            title: 'Partner Enablement Assistant',
            icon: 'users',
            phase: 'Phase 1 Pilot',
            priority: 'High',
            description:
              'An AI assistant for Avant\'s sales and support teams that surfaces partner-specific product knowledge, competitive positioning, and deal guidance — in real time during calls and conversations.',
            outcomes: [
              'Reduce partner onboarding time by 40%',
              'Instant access to 500+ partner SKU details',
              'Consistent messaging across all partner conversations',
              'Voice-enabled for real-time call support',
            ],
            integrations: ['Slack', 'Salesforce', 'Partner Portal', 'Phone'],
          },
          {
            id: 'buyer-intent',
            title: 'Buyer Intent Scoring (IntentIQ)',
            icon: 'trending-up',
            phase: 'Phase 1 Pilot',
            priority: 'High',
            description:
              'Leverages ATOM\'s IntentIQ capabilities to score inbound and existing accounts on purchase intent signals — behavioral, contextual, and conversational — giving Avant\'s sales team a prioritized pipeline.',
            outcomes: [
              '25%+ lift in qualified pipeline conversion',
              'Real-time intent signal scoring',
              'CRM enrichment with AI-derived intent fields',
              'Automated re-engagement triggers',
            ],
            integrations: ['HubSpot / Salesforce', 'Web analytics', 'Email', 'Partner activity data'],
          },
          {
            id: 'knowledge-rag',
            title: 'Internal Knowledge + RAG',
            icon: 'book-open',
            phase: 'Phase 2',
            priority: 'Medium',
            description:
              'A private, governed retrieval system over Avant\'s internal documents, runbooks, partner agreements, and process docs — making institutional knowledge instantly searchable and trustworthy.',
            outcomes: [
              'Reduce "where is that doc?" time to near-zero',
              'Answer accuracy ≥ 90% on indexed knowledge',
              'Access-controlled retrieval by role',
              'Citation-backed answers with source links',
            ],
            integrations: ['Google Drive', 'Confluence / Notion', 'SharePoint', 'Email archives'],
          },
          {
            id: 'workflow-automation',
            title: 'Workflow Automation with Approvals',
            icon: 'git-branch',
            phase: 'Phase 3',
            priority: 'Expansion',
            description:
              'End-to-end workflow agents that automate multi-step processes (quoting, onboarding, routing) with human-in-the-loop approval gates, exception handling, and full audit trails.',
            outcomes: [
              'Automate 60%+ of repetitive ops tasks',
              'Every automated action is logged and reversible',
              'Human override at any step',
              'Compliance-ready workflow execution',
            ],
            integrations: ['ERP', 'Partner portals', 'CRM', 'Billing systems'],
          },
        ],
      },
    },
    {
      id: 'rollout-plan',
      label: 'Rollout Plan',
      type: 'steps',
      content: {
        title: 'Rollout Plan',
        subtitle: 'From discovery to governed production — in 90 days',
        phases: [
          {
            phase: 'Phase 0',
            title: 'Discovery & Architecture',
            duration: '2 Weeks',
            icon: 'search',
            color: 'purple',
            deliverables: [
              'Architecture review with Avant\'s engineering team',
              'Data source inventory and access requirements',
              'Security and compliance requirements documentation',
              'Pilot use case finalization (2 of 4)',
              'Deployment environment scoping (VPC vs hybrid)',
              'Integration mapping (CRM, comms, data sources)',
            ],
            milestone: 'Signed architecture plan + environment access',
          },
          {
            phase: 'Phase 1',
            title: 'Pilot Deployment',
            duration: '4–6 Weeks',
            icon: 'rocket',
            color: 'indigo',
            deliverables: [
              'ATOM core deployed to Avant VPC / hybrid environment',
              'Partner Enablement Assistant — live with limited team',
              'Buyer Intent Scoring — integrated with CRM pipeline view',
              'RBAC configuration for pilot users',
              'Audit trail verified and accessible',
              'Initial accuracy and performance benchmarking',
            ],
            milestone: 'Both pilot use cases live for Avant power users',
          },
          {
            phase: 'Phase 2',
            title: 'Production Hardening',
            duration: '6–8 Weeks',
            icon: 'settings',
            color: 'blue',
            deliverables: [
              'Full team rollout of Phase 1 use cases',
              'Internal Knowledge RAG deployed and indexed',
              'SLA-backed uptime monitoring',
              'Compliance documentation for security review',
              'Performance optimization based on Phase 1 data',
              'Admin dashboard and usage analytics',
            ],
            milestone: 'Production-grade deployment with SLA coverage',
          },
          {
            phase: 'Phase 3',
            title: 'Expansion & Governance',
            duration: 'Ongoing',
            icon: 'trending-up',
            color: 'green',
            deliverables: [
              'Workflow automation agents deployed',
              'Additional use case scoping and development',
              'Quarterly governance review and model updates',
              'New data source integrations',
              'Expansion to additional teams / regions',
              'Annual compliance and audit review support',
            ],
            milestone: 'Full-scale governed AI deployment across Avant',
          },
        ],
      },
    },
    {
      id: 'pricing',
      label: 'Pricing',
      type: 'pricing',
      content: {
        title: 'Pricing',
        subtitle: 'Transparent, milestone-based pricing',
        note: 'All prices are placeholder estimates. Final pricing confirmed after Discovery phase.',
        tiers: [
          {
            id: 'pilot',
            name: 'Pilot',
            price: '$18,000',
            period: 'one-time',
            badge: 'Start Here',
            description: 'Phase 0 + Phase 1. Discovery, architecture, and 2 live use cases in your environment.',
            features: [
              'Phase 0: Discovery & architecture (2 weeks)',
              'Phase 1: 2 pilot use cases deployed (4–6 weeks)',
              'ATOM core framework + Spine + 2 Digital Workers',
              'VPC / hybrid deployment setup',
              'RBAC configuration',
              'Audit trail + basic admin dashboard',
              'Up to 5 pilot users',
              '30-day post-launch support',
            ],
            cta: 'Start Pilot',
            highlight: false,
          },
          {
            id: 'production',
            name: 'Production',
            price: '$42,000',
            period: 'one-time + retainer',
            badge: 'Most Popular',
            description: 'Full Phase 1 + Phase 2. Production-ready deployment for the full Avant team.',
            features: [
              'Everything in Pilot',
              'Phase 2: Production hardening (6–8 weeks)',
              'Internal Knowledge RAG deployment',
              'Full team rollout (unlimited users)',
              'SLA-backed uptime (99.5%)',
              'Compliance documentation package',
              'Performance optimization',
              '$3,500/month ongoing support retainer',
            ],
            cta: 'Get Production',
            highlight: true,
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            price: 'Custom',
            period: 'custom',
            badge: 'Phase 3+',
            description: 'Full Phase 3 expansion. Workflow automation, multi-team, custom integrations.',
            features: [
              'Everything in Production',
              'Phase 3: Workflow automation agents',
              'Unlimited use cases and integrations',
              'Custom model fine-tuning support',
              'Dedicated solutions engineer',
              'Quarterly business reviews',
              'Priority feature development',
              'Custom SLA and compliance terms',
            ],
            cta: 'Contact Us',
            highlight: false,
          },
        ],
        paymentSchedule: [
          { milestone: 'Contract signed', amount: '50%', timing: 'Due at signing' },
          { milestone: 'Phase 1 complete', amount: '30%', timing: 'Due at pilot go-live' },
          { milestone: 'Phase 2 complete', amount: '20%', timing: 'Due at production go-live' },
        ],
      },
    },
    {
      id: 'legal',
      label: 'Terms',
      type: 'bullets',
      content: {
        title: 'Terms & Statement of Work',
        subtitle: 'Summary of key terms',
        sections: [
          {
            title: 'Statement of Work Summary',
            items: [
              'Provider: Antimatter AI (antimatterai.com) — Atlanta, GA',
              'Client: Avant Technology Partners',
              'Scope: ATOM framework deployment per phases outlined in this proposal',
              'Deliverables: As specified per phase milestones above',
              'Acceptance: Each phase accepted upon milestone completion sign-off',
              'Change Orders: Additional scope requires written agreement',
            ],
          },
          {
            title: 'IP & Data Ownership',
            items: [
              'Client owns all prompts, agents, workflows, and outputs created during engagement',
              'Provider does not train on Client data under any circumstance',
              'Client data never enters shared model pools or provider training pipelines',
              'All custom configurations and fine-tunes remain Client IP',
              'Provider retains ownership of ATOM framework core (licensed to Client)',
            ],
          },
          {
            title: 'Confidentiality',
            items: [
              'All engagement details are confidential under mutual NDA',
              'Provider staff with system access subject to Client security review',
              'Data handling per Client\'s data governance policies',
              'Incident notification within 24 hours of detection',
            ],
          },
          {
            title: 'Limitations & Warranties',
            items: [
              'Provider warrants ATOM will perform materially as described during the engagement',
              'AI outputs are non-deterministic; accuracy targets are best-effort benchmarks',
              'Provider liability capped at total fees paid in the 3 months prior to claim',
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
        title: 'Ready to Move Forward?',
        subtitle: 'Three ways to take the next step',
        description:
          'This proposal is valid through April 1, 2026. We\'re excited to partner with Avant and deploy governed AI that actually works in your environment.',
        actions: [
          {
            title: 'Sign This Proposal',
            description: 'Review, sign electronically, and officially kick off the engagement.',
            icon: 'pen-tool',
            cta: 'Review & Sign',
            href: '#sign',
            primary: true,
          },
          {
            title: 'Schedule a Call',
            description: 'Want to talk through specifics before signing? Book 30 minutes with our team.',
            icon: 'calendar',
            cta: 'Book a Call',
            href: 'https://calendly.com/antimatterai',
            primary: false,
          },
          {
            title: 'Ask a Question',
            description: 'Have a specific question about deployment, security, or pricing? Ask Atom directly.',
            icon: 'message-circle',
            cta: 'Ask Atom',
            href: '#ask-atom',
            primary: false,
          },
        ],
        contacts: [
          { name: 'Paul Antimatter', role: 'CEO, Antimatter AI', email: 'paul@antimatterai.com' },
        ],
        validUntil: 'April 1, 2026',
      },
    },
  ],
}

export const defaultPricingJSON = {
  tiers: defaultProposalJSON.sections.find((s) => s.id === 'pricing')?.content?.tiers ?? [],
  paymentSchedule:
    defaultProposalJSON.sections.find((s) => s.id === 'pricing')?.content?.paymentSchedule ?? [],
  lastUpdated: new Date().toISOString(),
}
