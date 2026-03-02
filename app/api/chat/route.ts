import { NextRequest, NextResponse } from 'next/server'

// TODO: Wire to existing Antimatter AI OpenAI endpoint
// Replace mock responses with: await fetch(process.env.OPENAI_ENDPOINT_URL, { ... })
// Or use OpenAI SDK: import OpenAI from 'openai'
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const MOCK_RESPONSES: Record<string, string> = {
  security: `ATOM is built for regulated enterprise environments. Key security controls include:
• Customer VPC / on-prem deployment — data never leaves your environment
• RBAC with per-environment policies and role inheritance
• Immutable audit logs on every agent action, model call, and retrieval
• Encryption at rest and in transit with private networking support
• Zero training guarantee — Antimatter AI contractually does not train on your data
• SOC2-aligned architecture with controls documentation available

Want to discuss specific compliance requirements for Avant?`,

  deployment: `ATOM supports three primary deployment patterns:

**VPC Deployment (Recommended for most enterprise clients)**
Run ATOM inside your existing AWS, GCP, or Azure VPC. Kubernetes-native. Data stays in your region and never crosses network boundaries.

**Hybrid Cloud**
Mix cloud and on-prem. Run orchestration in VPC, inference at edge for latency-sensitive use cases (voice, real-time UX).

**On-Premises**
Full containerized deployment on your own hardware. Supports air-gapped environments for classified or regulated use cases.

For Avant, we recommend starting with a VPC deployment in Phase 1 and evaluating hybrid edge routing in Phase 2 for voice use cases.`,

  pricing: `Pricing for Avant is structured in three tiers aligned to deployment phases:

**Pilot — $18,000 one-time**
Covers Phase 0 (discovery) + Phase 1 (2 pilot use cases live). This is our most common entry point.

**Production — $42,000 + $3,500/month**
Full Phase 2 hardening, unlimited users, SLA-backed uptime, Internal Knowledge RAG.

**Enterprise — Custom**
Phase 3 workflow automation, dedicated engineer, custom SLA.

All tiers include: ATOM framework license, infrastructure setup, RBAC config, and 30-day post-launch support. Payment is milestone-based (50% / 30% / 20%).

Want to discuss a custom structure?`,

  hipaa: `ATOM's architecture supports HIPAA-aligned deployments, though we want to be precise about what this means:

✓ **Supports:** Customer-controlled VPC with no data egress, encryption at rest and in transit, audit logs for every data access, RBAC with minimum-access controls, BAA (Business Associate Agreement) available upon request.

⚠️ **Important:** ATOM is not a certified HIPAA platform — we're a framework that enables your team to build HIPAA-compliant applications on top. Your compliance team will need to verify controls against your specific PHI use cases.

For Avant, HIPAA relevance depends on whether you're handling any health-adjacent partner data. If so, we can walk through the controls checklist together.`,
}

function findResponse(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('secur') || lower.includes('soc') || lower.includes('compliance')) {
    return MOCK_RESPONSES.security
  }
  if (lower.includes('deploy') || lower.includes('vpc') || lower.includes('on-prem') || lower.includes('cloud')) {
    return MOCK_RESPONSES.deployment
  }
  if (lower.includes('pric') || lower.includes('cost') || lower.includes('payment') || lower.includes('tier')) {
    return MOCK_RESPONSES.pricing
  }
  if (lower.includes('hipaa') || lower.includes('health') || lower.includes('phi')) {
    return MOCK_RESPONSES.hipaa
  }

  return `That's a great question about ATOM. Here's what I can tell you:

ATOM (Antimatter Technology Operations Module) is an enterprise AI runtime that gives organizations like Avant full control over AI deployment — in their infrastructure, with their data, under their governance policies.

The three core components are:
• **Brain** — Model/provider layer (switch between OpenAI, Anthropic, Grok, or open-source models)
• **Spine** — Orchestration, tools, RAG, RBAC, and audit governance
• **Digital Worker** — Agents deployed into real workflows with approval gates and human override

For more specific questions about security, deployment, or pricing, feel free to ask or use the prompt chips above.

You can also reach the team directly: paul@antimatterai.com`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message } = body as { message: string; token?: string }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'message is required' }, { status: 400 })
    }

    // TODO: Replace mock with real OpenAI call:
    // const completion = await openai.chat.completions.create({
    //   model: 'gpt-4o',
    //   messages: [
    //     { role: 'system', content: ATOM_SYSTEM_PROMPT },
    //     { role: 'user', content: message }
    //   ]
    // })
    // const response = completion.choices[0]?.message?.content ?? 'I could not generate a response.'

    // Simulate a small delay for realism
    await new Promise((resolve) => setTimeout(resolve, 400))

    const response = findResponse(message)
    return NextResponse.json({ response })
  } catch (error) {
    console.error('[/api/chat] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
