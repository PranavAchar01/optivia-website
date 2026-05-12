'use client';

import { useState, useEffect } from 'react';

// ─── nav ─────────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'overview',         label: 'Overview' },
  { id: 'findings',         label: 'Key Findings' },
  { id: 'framing',          label: 'Strategic Framing' },
  { id: 'stage1',           label: 'Stage 1 — MVP',         top: true },
  { id: 'stage1-stack',     label: 'Stack',                  indent: true },
  { id: 'stage1-langgraph', label: 'LangGraph Engine',       indent: true },
  { id: 'stage1-routing',   label: 'Routing Module',         indent: true },
  { id: 'stage1-schema',    label: 'Classification Schema',  indent: true },
  { id: 'stage2',           label: 'Stage 2 — Custom Routing', top: true },
  { id: 'stage3',           label: 'Stage 3 — Production',   top: true },
  { id: 'buildvsbuy',       label: 'Build vs Buy' },
  { id: 'migration',        label: 'Migration Guide' },
];

// ─── page ────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [active, setActive] = useState('overview');

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-10% 0px -75% 0px' },
    );
    NAV.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{
      display: 'flex', width: '100%', height: '100%',
      background: '#0a0a0a', color: '#d4d4d4',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: '15px', lineHeight: '1.8',
    }}>

      {/* ── Sidebar ── */}
      <nav style={{
        width: '220px', flexShrink: 0, height: '100%', overflowY: 'auto',
        borderRight: '1px solid #1f1f1f', padding: '2.5rem 0',
        position: 'sticky', top: 0,
      }}>
        <div style={{ padding: '0 1.5rem 2rem' }}>
          <a href="/" style={{ fontSize: '12px', color: '#555', textDecoration: 'none', letterSpacing: '0.03em' }}>
            ← Optivia
          </a>
          <p style={{ margin: '1.25rem 0 0.2rem', fontWeight: 600, fontSize: '13px', color: '#fff', letterSpacing: '-0.01em' }}>
            Technical Architecture
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#444', letterSpacing: '0.02em' }}>
            Optivia Engineering · May 2026
          </p>
        </div>

        <div style={{ paddingTop: '0.5rem' }}>
          {NAV.map(({ id, label, indent, top }) => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'block', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                padding: `${top ? '0.55rem' : '0.3rem'} 1.5rem ${top ? '0.55rem' : '0.3rem'} ${indent ? '2.5rem' : '1.5rem'}`,
                background: 'transparent',
                borderLeft: active === id ? '1px solid #00A0AE' : '1px solid transparent',
                fontSize: indent ? '12px' : '13px',
                color: active === id ? '#00A0AE' : indent ? '#484848' : top ? '#888' : '#666',
                fontWeight: active === id ? 500 : top && !indent ? 500 : 400,
                letterSpacing: top && !indent ? '0.02em' : 0,
                transition: 'color 0.15s',
                marginTop: top && !indent ? '0.5rem' : 0,
              }}
            >{label}</button>
          ))}
        </div>
      </nav>

      {/* ── Content ── */}
      <main style={{ flex: 1, height: '100%', overflowY: 'auto', padding: '4rem 5rem', scrollBehavior: 'smooth' }}>
        <div style={{ maxWidth: '740px' }}>

          {/* Overview */}
          <section id="overview" style={S.section}>
            <p style={S.kicker}>Optivia Engineering · May 2026</p>
            <h1 style={S.h1}>Three-Stage Architecture for Model Routing and Full-Stack Classification Above Claude Code</h1>
            <p style={S.lede}>
              Optivia sits upstream of Claude Code. Its job is to take a sloppy human prompt and convert it into the right shape of work — classified, scored, clarified, synthesised, and routed to the correct model — before that work hits the execution backend. The product makes three simultaneous bets: that routing beats upgrading, that coding tasks decompose into a learnable taxonomy, and that a synthesised master prompt substantially outperforms the raw user input.
            </p>

            <p style={S.p}>
              The three-stage roadmap reflects the maturity curve for these bets. <strong style={S.strong}>Stage 1 (Wrapper MVP)</strong> validates them on real users using off-the-shelf parts — the only proprietary work is the orchestration shape. <strong style={S.strong}>Stage 2 (Custom Routing)</strong> converts the MVP's logged behaviour into proprietary models. <strong style={S.strong}>Stage 3 (V1 Production)</strong> hardens the stack with multi-tier execution, caching, fallbacks, online learning, and deep Claude Code integration.
            </p>

            <p style={S.p}>
              The architectural invariant across all three stages is the <em>trace contract</em>: a stable, versioned schema for prompts, classifications, scores, clarifications, master prompts, routing decisions, and outcomes. Stage 1 is judged on whether this contract is rich enough to train Stage 2. Stage 2 is judged on whether its proprietary heads beat the wrapped baselines. Stage 3 is judged on tail latency, cost per task, and reliability.
            </p>

            <Divider />

            <h3 style={S.h3}>Stage summaries</h3>
            <p style={S.p}>
              <strong style={S.strong}>Stage 1</strong> is a Python/FastAPI service running LangGraph as the orchestration spine, LiteLLM as the self-hosted gateway, RouteLLM's pre-trained matrix-factorisation router as the cost/quality routing primitive, Aurelio Semantic Router and instructor/Pydantic for classification and structured scoring, Langfuse for observability, and Postgres + pgvector for logs and retrieval — sitting upstream of Claude Code via <Mono>ANTHROPIC_BASE_URL</Mono> proxy interception. The single most important MVP decision is the schema: every prompt must be logged with the full classification vector, scores, clarifications, master prompt, routing decision, downstream Claude Code outcome, retry count, token spend, and user feedback so Stage 2 has supervised training data.
            </p>
            <p style={S.p}>
              <strong style={S.strong}>Stage 2</strong> replaces all wrapped routers with a layered proprietary stack: a ModernBERT task-type classifier, a complexity-and-risk regression head trained on MVP outcome labels, a RouteLLM-style matrix-factorisation model retrained on Optivia's own win-rate data, and a DSPy EIG clarifying-question generator. Models are served on Modal behind a feature-flagged shadow-deployment harness so proprietary routes run in parallel with the wrapped router for weeks before promotion.
            </p>
            <p style={S.p}>
              <strong style={S.strong}>Stage 3</strong> is a multi-tier router — sub-50ms semantic cache plus intent classifier → ModernBERT task classifier → matrix-factorisation cost/quality router → cascading verifier with circuit breakers → Claude Code via Agent SDK — with Anthropic prompt caching for system-prompt amortisation, Redis-backed semantic caching for repeat queries, online-learning loops that update the router weekly from production feedback, and full Claude Code integration via the Agent SDK, hooks, slash commands, and MCP server.
            </p>
          </section>

          {/* Key Findings */}
          <section id="findings" style={S.section}>
            <h2 style={S.h2}>Key Findings</h2>
            <p style={S.p}>Twelve empirical findings shape every architectural decision. Each is grounded in benchmarks or published literature.</p>

            {[
              {
                n: '01',
                title: 'No commercial router is ideal for coding-specific routing.',
                body: 'RouteLLM (LMSYS) provides the strongest open-source primitives — its matrix-factorisation router achieves 95% of GPT-4 performance using only 26% strong-model calls on MT-Bench, and Anthropic\'s preference-data preprocessing trick generalises to other model pairs without retraining. Martian and NotDiamond are commercial black boxes optimised for general queries; OpenRouter is a marketplace, not a learned router. Coding tasks have very different difficulty signals than general LLM-arena prompts, so any commercial router must be benchmarked on Optivia\'s own logs before being trusted.',
              },
              {
                n: '02',
                title: 'The MVP gateway is LiteLLM, not Portkey or OpenRouter.',
                body: 'LiteLLM is open-source (MIT/Apache 2.0), self-hostable, sustains approximately 1,000 RPS, adds only 10–20ms latency, has a unified OpenAI-compatible interface for 100+ providers, and crucially supports custom routing logic written in Python. OpenRouter charges a 5.5% fee with no infrastructure control, and Portkey\'s per-log pricing scales linearly with volume. Portkey is reasonable as a secondary observability layer; LiteLLM is the right primary substrate.',
              },
              {
                n: '03',
                title: 'Claude Code can be intercepted cleanly via ANTHROPIC_BASE_URL.',
                body: 'Multiple proven patterns (agentgateway, seifghazi/claude-code-proxy, lrgs/claude-code-proxy, fuergaosi233/claude-code-proxy) demonstrate that pointing Claude Code at a localhost proxy lets you see every prompt, tool call, and file read in real time, rewrite the system prompt, route subagents to different models, and inject Optivia\'s classification and synthesis pipeline upstream of Anthropic\'s API — without forking Claude Code itself. Anthropic\'s Agent SDK exposes the same harness programmatically with hooks, settingSources, and subagent control.',
              },
              {
                n: '04',
                title: 'Coding-task difficulty has well-validated signal sources.',
                body: 'SWE-bench Verified\'s annotator-time tiers (under 15 minutes, 15 minutes to 1 hour, 1 to 4 hours, and over 4 hours) and Multi-SWE-bench\'s Easy/Medium/Hard categorisation map directly to Optivia\'s complexity score. The empirical signal: lines changed scales 11× from Easy to Hard; files modified scales 2×. These map cleanly to features Optivia can extract at prompt time.',
              },
              {
                n: '05',
                title: 'ModernBERT, not DistilBERT, is the right Stage 2 classifier.',
                body: 'ModernBERT has an 8K context window (versus BERT\'s 512), is trained on 2T tokens including code, runs 2–4× faster than older BERT, and outperforms the original BERT by approximately 3% on classification while training 3× faster. This makes it the clear choice for the coding-task classifier that must handle long prompts with attached file context.',
              },
              {
                n: '06',
                title: 'Clarifying questions should use Expected Information Gain, not zero-shot prompting.',
                body: 'The BED-LLM and Active Task Disambiguation papers prove that maximising expected information gain over a sampled candidate-question set substantially outperforms naive "ask the LLM what to clarify." For Stage 1, a structured-output LLM call is acceptable. Stage 2 explicitly scores candidates by EIG over the model\'s posterior — EIG scoring alone (without learned question generation) delivers most of the quality gain.',
              },
              {
                n: '07',
                title: 'The economics of routing are dominated by Anthropic prompt caching, not raw model selection.',
                body: 'Anthropic prompt caching gives 90% read-cost reduction at the cost of a 25% write premium, breaking even after two cache hits. For Optivia, the master-prompt prefix should be cache-controlled, making the marginal cost of an extra Haiku or Sonnet call collapse substantially. The router design must account for this — naive cost models that ignore caching will misroute.',
              },
              {
                n: '08',
                title: 'The Sonnet–Opus gap on coding has nearly closed in the current generation.',
                body: 'As of early 2026, Sonnet 4.6 scores 79.6% and Opus 4.6 scores 80.8% on SWE-bench Verified — a 1.2-point quality gap for approximately 1.7× cost ($3/$15 vs $5/$25 per million tokens). Haiku 4.5 sits at 73.3% at $1/$5. Optivia\'s router therefore has only three rational tiers: Haiku for trivial, Sonnet for default, Opus for genuine architectural reasoning. The Sonnet/Opus threshold is the single most valuable routing prediction.',
              },
              {
                n: '09',
                title: 'Langfuse is the right Stage 1 observability platform.',
                body: 'Open-source, MIT-licensed, OpenTelemetry-native, span-level tracing for multi-step LangGraph workflows, free up to 50K events per month on cloud, and cleanly self-hostable on Postgres. Helicone\'s proxy approach is great for cost dashboards but sees only HTTP traffic (no span-level visibility into LangGraph nodes). LangSmith is too LangChain-locked for a router product.',
              },
              {
                n: '10',
                title: 'Stage 2 routing is a learning-to-rank problem with three heads, not one.',
                body: 'The literature (RouteLLM, FrugalGPT, Hybrid LLM, LLMRec, EmbedLLM, Router-R1, RouterArena) converges on this pattern: (a) predict each candidate model\'s win probability for the prompt, (b) predict expected output length, (c) compute expected utility under a cost constraint, and (d) pick the argmax. Optivia should ship three small heads on top of a shared encoder, not a single end-to-end "magic" router.',
              },
              {
                n: '11',
                title: 'The MVP stack must be Python.',
                body: 'The entire AI tooling ecosystem — LangGraph, LiteLLM, instructor, RouteLLM, DSPy, ModernBERT fine-tuning, Aurelio Semantic Router, HuggingFace, Langfuse SDK — is Python-first. FastAPI, Pydantic, and asyncio form the established production pattern. Use Next.js for the workflow visualisation UI (React Flow), but the backend is unambiguously Python.',
              },
              {
                n: '12',
                title: 'The Stage 1 → Stage 2 migration succeeds or fails on the Stage 1 schema.',
                body: 'Every commercial router-replacement project that has been published (Hybrid LLM, RouteLLM, Martian\'s RouterBench) was data-bottlenecked, not algorithm-bottlenecked. Optivia\'s MVP must over-instrument: every prompt logged with full classification vector, every clarification interaction logged, every master prompt logged with diff versus user prompt, every routing decision logged with alternatives considered, every Claude Code outcome logged with token counts, exit signals, file diffs, error patterns, and user feedback.',
              },
            ].map(({ n, title, body }) => (
              <div key={n} style={{ marginBottom: '2.5rem' }}>
                <p style={{ margin: '0 0 0.3rem', display: 'flex', gap: '1.25rem', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: '11px', color: '#444', flexShrink: 0, letterSpacing: '0.06em' }}>{n}</span>
                  <strong style={{ ...S.strong, fontSize: '15px' }}>{title}</strong>
                </p>
                <p style={{ ...S.p, paddingLeft: '2.5rem', margin: 0, color: '#777' }}>{body}</p>
              </div>
            ))}
          </section>

          {/* Strategic Framing */}
          <section id="framing" style={S.section}>
            <h2 style={S.h2}>Strategic Framing</h2>
            <p style={S.p}>Optivia sits in a narrow but valuable position: above coding agents, below the user's intent. Its job is to take a sloppy human prompt and convert it into the <em>right shape of work</em> before that work hits Claude Code.</p>

            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Bet</th>
                  <th style={S.th}>Claim</th>
                  <th style={S.th}>Evidence</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Routing', 'Selecting the right model and execution path yields more value than upgrading a single model.', 'RouterBench, RouteLLM, FrugalGPT, Hybrid LLM — 50–98% cost reduction at iso-quality for general workloads.'],
                  ['Classification', 'Coding tasks decompose cleanly into a small taxonomy. Scoring along complexity, risk, scope, ambiguity, and dependency captures most of what determines correct routing.', 'SWE-bench Verified annotation tiers empirically support this. Lines changed scales 11× from Easy to Hard.'],
                  ['Synthesis', 'A master prompt built from the original prompt, classification, scores, clarifications, and a coding-agent-aware system preamble substantially outperforms the user\'s raw prompt when fed to Claude Code.', 'DSPy/APE/OPRO/TextGrad all prove this on benchmarks.'],
                ].map(([bet, claim, evidence]) => (
                  <tr key={bet}>
                    <td style={{ ...S.td, color: '#fff', fontWeight: 500, whiteSpace: 'nowrap' }}>{bet}</td>
                    <td style={S.td}>{claim}</td>
                    <td style={{ ...S.td, color: '#555' }}>{evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Stage 1 */}
          <section id="stage1" style={S.section}>
            <h2 style={S.h2}>Stage 1 — MVP Wrapper Phase</h2>
            <p style={S.p}>Build the smallest end-to-end engine that can accept a user prompt, classify it into a coding task type, score it on complexity/risk/scope/ambiguity/dependency, ask zero or more clarifying questions, synthesise a master prompt, visualise the planned workflow, route to Claude Code with the correct model selection, observe execution, and log everything for Stage 2 training. No proprietary models. No bespoke routing mathematics. Maximum reuse.</p>

            <h3 id="stage1-stack" style={S.h3}>Stack at a Glance</h3>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Layer</th>
                  <th style={S.th}>Tool</th>
                  <th style={S.th}>Rationale</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Backend language', 'Python 3.12, FastAPI, asyncio, Pydantic v2', 'The whole ecosystem is Python-first.'],
                  ['Workflow orchestration', 'LangGraph (open-source, MIT)', 'DAG execution, checkpointed state, sub-graphs, streaming, human-in-the-loop interrupts native.'],
                  ['Durability layer', 'Temporal (optional MVP, required by V1)', 'LangGraph checkpointer saves state between nodes; long-running sessions need durable activities.'],
                  ['LLM gateway', 'LiteLLM (self-hosted)', 'One API for Anthropic/OpenAI/Google/Groq, retries, fallbacks, per-tenant budgets, ~10ms overhead.'],
                  ['Cost/quality router', 'RouteLLM mf router, pre-trained', 'Drop-in OpenAI-compatible server; 95% strong-model performance at 14–26% strong-model calls.'],
                  ['Fast classifier', 'Aurelio Semantic Router + voyage-code-3', 'Under 50ms kNN over utterance embeddings; ideal for coarse pre-classification.'],
                  ['Deep classifier', 'instructor + Claude Haiku 4.5 + Pydantic', 'Structured JSON output with validation/retries; fast and cheap.'],
                  ['Clarification', 'instructor + Claude Sonnet 4.6 with EIG-prompt heuristic', 'Stage 1 is heuristic-only; full EIG comes in Stage 2.'],
                  ['Synthesis', 'DSPy ChainOfThought + Anthropic prompt caching', 'Programmatic abstraction survives into Stage 2; caching makes the long preamble cheap.'],
                  ['Execution backend', 'Claude Code via ANTHROPIC_BASE_URL proxy', 'Proven pattern; preserves all Claude Code features.'],
                  ['Observability', 'Langfuse (self-hosted, MIT) + OpenTelemetry', 'Span-level tracing, cost tracking, prompt management, generous free tier.'],
                  ['Database', 'Postgres 16 + pgvector + pgmq', 'Single store for traces, retrieval embeddings, queue; avoids premature multi-DB sprawl.'],
                  ['Cache', 'Redis 7 with RediSearch', 'Sub-ms exact match; semantic cache via embedding + cosine threshold.'],
                  ['Frontend', 'Next.js 15 + React Flow + shadcn/ui + Tailwind', 'React Flow is the de-facto DAG renderer; workflow editor templates exist.'],
                  ['Deployment', 'Fly.io (web) + Modal or Railway (workers) + Neon (Postgres) + Upstash (Redis)', 'Cheap, fast, regional.'],
                ].map(([layer, tool, rationale]) => (
                  <tr key={layer}>
                    <td style={{ ...S.td, color: '#888', fontSize: '13px', whiteSpace: 'nowrap' }}>{layer}</td>
                    <td style={{ ...S.td, fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: '12px', color: '#c9c9c9' }}>{tool}</td>
                    <td style={{ ...S.td, color: '#555', fontSize: '13px' }}>{rationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 id="stage1-langgraph" style={S.h3}>LangGraph Engine</h3>
            <p style={S.p}>Optivia's MVP is a single LangGraph <Mono>StateGraph</Mono> with the following nodes, all sharing an <Mono>OptiviaState</Mono> TypedDict:</p>
            <CodeBlock>{`OptiviaState = {
  request_id:           str,
  user_id:              str,
  raw_prompt:           str,
  attached_files:       list[FileRef],
  project_context:      ProjectContext,
  semantic_cache_hit:   Optional[CachedResult],
  fast_intent:          FastIntent,
  task_classification:  TaskClassification,
  scores:               TaskScores,
  clarifications:       list[Clarification],
  master_prompt:        MasterPrompt,
  workflow_plan:        WorkflowPlan,
  routing_decision:     RoutingDecision,
  execution_trace:      list[ExecutionEvent],
  outcome:              Optional[Outcome],
  feedback:             Optional[UserFeedback],
}`}</CodeBlock>

            <p style={S.p}>The node graph (all transitions are explicit <Mono>add_edge</Mono> / <Mono>add_conditional_edges</Mono>):</p>
            <ol style={{ color: '#666', paddingLeft: '1.5rem', margin: '0 0 1.5rem', lineHeight: 2 }}>
              {[
                ['cache_lookup', 'Checks Redis semantic cache. If cosine similarity ≥ 0.95 and the project context matches, short-circuit to replay_outcome.'],
                ['fast_intent', 'Runs Aurelio Semantic Router with approximately 30 utterances per route, producing a coarse label and confidence. If confidence exceeds 0.9 and the category is trivial chitchat or non-code, short-circuit out.'],
                ['deep_classify_and_score', 'Makes a single instructor call to Claude Haiku 4.5, returning a Pydantic-validated TaskClassification + TaskScores object.'],
                ['decide_clarification', 'Conditional edge: if scores.ambiguity ≥ 0.6 or scores.scope ≥ 0.7 with confidence < 0.5, route to generate_clarifications; otherwise skip.'],
                ['generate_clarifications', 'Calls Claude Sonnet 4.6 via instructor, producing 1–3 candidate questions with target field/uncertainty type metadata, then emits a LangGraph interrupt so the frontend can collect answers.'],
                ['synthesize_master_prompt', 'Uses a DSPy Predict module with a versioned signature and Anthropic prompt caching on the system preamble to produce the final master prompt plus a structured WorkflowPlan.'],
                ['route', 'Calls into the routing module with the classification, scores, master prompt, and plan; produces a RoutingDecision. Backed by RouteLLM mf for cost/quality decisions, with a deterministic policy layer on top for hard rules (e.g. if risk ≥ 0.8, never route to Haiku).'],
                ['human_review', 'Emits an interrupt so the user can approve or edit the plan in the React Flow visualiser. Every approval or rejection is supervised data.'],
                ['execute_via_claude_code', 'Posts the master prompt and plan to Claude Code via the proxy, streams events, and captures token counts, errors, and file diffs.'],
                ['evaluate_outcome', 'Automatic evaluation: did Claude Code produce a diff? Did tests pass? Did the user accept?'],
                ['log_trace', 'Writes the full OptiviaState to Postgres in normalised form, writes spans to Langfuse via OpenTelemetry, and updates the Redis semantic cache.'],
              ].map(([node, desc]) => (
                <li key={node} style={{ marginBottom: '0.25rem' }}>
                  <Mono>{node}</Mono> — <span style={{ color: '#666' }}>{desc}</span>
                </li>
              ))}
            </ol>

            <h3 id="stage1-routing" style={S.h3}>Routing Module</h3>
            <p style={S.p}>This is the most important part of the MVP architecture because it is the part Stage 2 will replace. It must be a clean abstract interface with multiple swappable implementations. All three run on every request; only one's decision is acted on (controlled by an <Mono>active_router</Mono> config flag). The others log their counterfactual decisions — this is the shadow routing pattern adapted for development.</p>

            <CodeBlock>{`class Router(Protocol):
    async def route(self, ctx: RoutingContext) -> RoutingDecision: ...`}</CodeBlock>

            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Implementation</th>
                  <th style={S.th}>Logic</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['HeuristicRouter', 'Hard rules. complexity < 0.3 routes to Haiku 4.5; complexity ≥ 0.3 and < 0.7 routes to Sonnet 4.6; complexity ≥ 0.7 or risk ≥ 0.7 routes to Opus 4.6. Used as the always-available baseline.'],
                  ['RouteLLMRouter', 'Wraps LMSYS RouteLLM\'s mf router, applied pairwise (Haiku-vs-Sonnet and Sonnet-vs-Opus). The threshold t is calibrated to a target spend curve.'],
                  ['LLMJudgeRouter', 'A Claude Haiku 4.5 call with a structured-output schema asking which model would best execute this task and why. Used as a tiebreaker and as a generator of training labels for Stage 2.'],
                ].map(([name, logic]) => (
                  <tr key={name}>
                    <td style={{ ...S.td, fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: '12px', color: '#c9c9c9', whiteSpace: 'nowrap' }}>{name}</td>
                    <td style={{ ...S.td, color: '#666', fontSize: '13px' }}>{logic}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 id="stage1-schema" style={S.h3}>Classification Schema</h3>
            <p style={S.p}>The taxonomy is frozen in the trace schema with a <Mono>taxonomy_version</Mono> field for evolution. The five scoring dimensions map directly to routing levers: complexity gates Haiku/Sonnet/Opus; risk gates human approval; scope gates subagent decomposition; ambiguity gates clarifying questions; dependency gates "must read more files first."</p>
            <CodeBlock>{`class TaskType(str, Enum):
    NEW_CODE  = "new_code"   # build something from scratch
    DEBUG     = "debug"      # fix something broken
    REFACTOR  = "refactor"   # change shape without changing behaviour
    REVIEW    = "review"     # read / explain / audit existing code
    EXPLAIN   = "explain"    # answer a question about code
    LONG      = "long"       # multi-file, multi-step (>30 min estimated)
    TRIVIAL   = "trivial"    # rename, format, single-line edit
    META      = "meta"       # ask Claude Code itself something

class TaskScores(BaseModel):
    complexity:        float = Field(ge=0, le=1)
    risk:              float = Field(ge=0, le=1)
    scope:             float = Field(ge=0, le=1)
    ambiguity:         float = Field(ge=0, le=1)
    dependency:        float = Field(ge=0, le=1)
    est_tokens_input:  int
    est_tokens_output: int
    est_wall_seconds:  int
    est_tier:          Literal["<15m", "15m-1h", "1h-4h", ">4h"]
    confidence:        float`}</CodeBlock>

            <h3 style={S.h3}>Clarifying Question Generation</h3>
            <p style={S.p}>Stage 1 implements a heuristic EIG approximation. If <Mono>ambiguity ≥ 0.6</Mono> or <Mono>(scope ≥ 0.7 and confidence &lt; 0.5)</Mono>, a structured-output call to Claude Sonnet 4.6 produces 1–3 candidate questions. The prompt explicitly instructs the model to maximise information gain, prefer multiple-choice with three to four options, and never ask more than three questions. Every (question, answer-or-skip, downstream outcome) tuple is supervised data for the Stage 2 EIG model.</p>
            <CodeBlock>{`class ClarifyingQuestion(BaseModel):
    question:                     str
    targeted_dimension:           Literal["scope","goal","constraint","environment","style","data"]
    candidate_answers:            list[str]   # MCQ; reduces user friction
    expected_uncertainty_reduction: float = Field(ge=0, le=1)`}</CodeBlock>

            <h3 style={S.h3}>Master Prompt Synthesis</h3>
            <p style={S.p}>DSPy is used here even at MVP because it provides an abstraction that survives into Stage 2 — DSPy's optimisers (MIPRO, OPRO) can be applied to any DSPy program later. The system preamble (200–500 tokens) is marked <Mono>cache_control=&#123;"type":"ephemeral"&#125;</Mono>. After the first call, the preamble's KV cache is reused at approximately 10% of base cost.</p>
            <CodeBlock>{`class SynthesizeMasterPrompt(dspy.Signature):
    """Convert a user prompt and its classification/scores/clarifications
    into an optimised master prompt for Claude Code with an explicit
    execution plan."""
    raw_prompt       = dspy.InputField()
    classification   = dspy.InputField()
    scores           = dspy.InputField()
    clarifications   = dspy.InputField()
    project_context  = dspy.InputField()
    master_prompt    = dspy.OutputField()
    workflow_plan    = dspy.OutputField()`}</CodeBlock>
          </section>

          {/* Stage 2 */}
          <section id="stage2" style={S.section}>
            <h2 style={S.h2}>Stage 2 — Custom Routing Phase</h2>
            <p style={S.p}>Stage 2 replaces the wrapped components with a layered proprietary stack trained on Stage 1 logs. The replacement happens in priority order: routing first (highest leverage), classification second, scoring third, clarification fourth, synthesis fifth. Each replacement is gated by a shadow-deployment evaluation that proves the proprietary version meets or beats the wrapped baseline on Optivia's own data distribution. The LangGraph engine is unchanged in shape; only the contents of nodes change.</p>

            {[
              {
                title: 'ModernBERT Task Classifier',
                body: 'ModernBERT-base (149M parameters) fine-tuned on the 8-class taxonomy with a regression head for the 5 scoring dimensions and 3 length-estimation outputs (multi-task learning). Loss: cross-entropy for classification, MSE for scoring, ranking loss for SWE-bench-aligned tier classification. Training recipe: 10,000 trace-derived examples + 5,000 LLM-judge-augmented examples + 2,000 hand-labelled gold examples. HuggingFace Trainer, mixed-precision, on a single A100 for approximately 30 minutes. This replaces the Stage 1 instructor-on-Haiku classifier, dropping classification cost from approximately $0.001/call to under $0.0001/call and latency from approximately 500ms to under 100ms.',
              },
              {
                title: 'Matrix-Factorisation Router',
                body: 'A three-head model on a shared encoder, following the consensus from the literature (RouteLLM, Hybrid LLM, EmbedLLM, LLMRec). Head 1 (win-rate prediction): for each candidate model m, predict P(model m succeeds | prompt encoding x) using a bilinear scoring function. Head 2 (output-length prediction): a small regressor predicting est_tokens_output; critical for cost-aware routing because output tokens are 5× input cost across all Anthropic models. Head 3 (fallback-needed prediction): a binary classifier predicting whether this prompt would require a retry/fallback on the cheapest viable model. Decision rule: utility(m) = P_success(x,m) − λ_cost · E[cost(x,m)], where λ_cost is per-tenant configurable, enabling cost-mode/quality-mode toggles backed by a single model.',
              },
              {
                title: 'DSPy EIG Clarifying Question Generator',
                body: 'Stage 2 implements the BED-LLM/BALAR/Active-Task-Disambiguation pattern explicitly. Step 1: generate k=8 plausible task interpretations from a solution-sampler. Step 2: generate m=5 clarifying questions from a fine-tuned question-generator. Step 3: score each question by EIG — for each (question, candidate-answer) pair, compute the posterior over interpretations; EIG is the expected reduction in posterior entropy, approximated via Monte Carlo. Step 4: select the question that maximises EIG, or the top two if EIG values are close. Training uses Stage 1\'s logged (prompt, asked-questions, answers, outcome) tuples, weighted by realised EIG.',
              },
              {
                title: 'Embedding-Based Retrieval',
                body: 'A new node retrieve_similar_traces is added between deep_classify_and_score and synthesize_master_prompt. It does pgvector kNN over raw_prompt_emb with filters on workspace ID, task type, and outcome.user_accepted = true, pulling the top 3 historically successful master prompts as exemplars for the synthesiser. This is RAG over Optivia\'s own history; exemplars from the same workspace/repository are far more useful than generic best-practices. For embeddings, voyage-code-3 is the recommended choice.',
              },
              {
                title: 'Shadow Deployment and Promotion',
                body: 'The Stage 2 evaluation methodology follows RouterBench/RouterArena. Hold out 20% of the trace store as a frozen evaluation set, stratified by task type and time period. For each router, compute the deferral curve: fraction of calls routed to the strong model on the x-axis, aggregate success rate on the y-axis. Promotion criterion: OptivaRouter must dominate or match the best wrapped router on the Pareto frontier across three or more cost-level slices, with statistical significance, on both the eval set and two weeks of shadow data. Shadow percentages start at 1% and ramp: 1% → 5% → 25% → 50% → 100%.',
              },
            ].map(({ title, body }) => (
              <div key={title} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #1a1a1a' }}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '15px', fontWeight: 600, color: '#e0e0e0', letterSpacing: '-0.01em' }}>{title}</h4>
                <p style={{ margin: 0, color: '#666', lineHeight: 1.8 }}>{body}</p>
              </div>
            ))}
          </section>

          {/* Stage 3 */}
          <section id="stage3" style={S.section}>
            <h2 style={S.h2}>Stage 3 — V1 Production Phase</h2>
            <p style={S.p}>Take the proprietary stack from Stage 2, wrap it in production-grade execution, caching, fallbacks, online learning, and deep Claude Code integration. Target: P50 end-to-end overhead before Claude Code starts is under 1 second; P95 under 2 seconds. This requires aggressive parallelism — Tier 5 (synthesis) can start in parallel with Tier 6 (router inference); Tier 1 embedding can be pre-computed during Tier 0.</p>

            <h3 style={S.h3}>Multi-Tier Routing Architecture</h3>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Tier</th>
                  <th style={S.th}>Budget</th>
                  <th style={S.th}>Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Tier 0: Edge cache',          '<5ms',   'Redis lookup by exact-prompt hash.'],
                  ['Tier 1: Semantic cache',       '<50ms',  'Embedding + cosine ≥ 0.95 in pgvector.'],
                  ['Tier 2: Fast intent',          '<30ms',  'Aurelio Semantic Router for triage.'],
                  ['Tier 3: Deep classifier',      '<100ms', 'ModernBERT classifier + scorer.'],
                  ['Tier 4: Clarification gate',   '<50ms',  'Interrupt and resume if needed.'],
                  ['Tier 5: Master prompt',        '<800ms', 'DSPy synthesis (cached preamble).'],
                  ['Tier 6: Router',               '<30ms',  'OptivaRouter inference.'],
                  ['Tier 7: Execution',            'variable','Claude Code via Agent SDK.'],
                  ['Tier 8: Verifier',             '<200ms', 'Outcome classifier, retry/fallback decision.'],
                ].map(([tier, budget, desc]) => (
                  <tr key={tier}>
                    <td style={{ ...S.td, fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: '12px', color: '#c9c9c9', whiteSpace: 'nowrap' }}>{tier}</td>
                    <td style={{ ...S.td, fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: '12px', color: '#888', whiteSpace: 'nowrap' }}>{budget}</td>
                    <td style={{ ...S.td, color: '#666', fontSize: '13px' }}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {[
              { title: 'Caching Strategy', body: 'Three caching layers work together. Anthropic prompt caching: the master-prompt system preamble (approximately 1,500 tokens of coding-agent best practices, taxonomy descriptions, and output-format instructions) is marked cache_control="ephemeral" on every call. With a 5-minute TTL extended to 1 hour with regular hits, this reduces input cost by approximately 85% for the bulk of the master prompt. Optivia-managed semantic cache: Redis-backed, keyed by embedding of (raw_prompt + workspace_signature). Cosine similarity ≥ 0.97 combined with the same task type and workspace constitutes a cache hit — returns the cached master prompt, plan, and routing decision, but not the cached final output (user-acceptance of a previous outcome is not transitive). Plan cache: for repeat operations (e.g. "add a test for X" where X is parameterised), cache the workflow plan template separately from the prompt.' },
              { title: 'Cost Optimisation', body: 'Tiered model selection per subagent: within a single Claude Code session, subagents (file readers, lint runners, simple edit applicators) can be routed to Haiku via the proxy\'s agent-routing configuration. A long Opus session that delegates 80% of token consumption to Haiku-tier subagents can be 5× cheaper than naive Opus-everything. Output-token budget per tier: Haiku jobs are capped at 4K output tokens, Sonnet at 16K, and Opus at 32K. Capping prevents runaway costs from a misrouted prompt. Batch API usage: for nightly retraining and offline evaluation, use Anthropic\'s Batch API at 50% off.' },
              { title: 'Online Learning Loop', body: 'The router and classifier are retrained weekly on the previous week\'s traces. The pipeline runs as Modal scheduled functions: snapshot Postgres to S3-Parquet on Friday night; build training splits on Saturday morning; train on a single A100 for approximately 4 hours; validate on held-out traces; if F1 ≥ 0.85 and cost/quality metrics pass, promote the new checkpoint by updating the Postgres models table and reloading Modal endpoints. Rollback is a SQL update, not a code deploy.' },
              { title: 'Full Claude Code Integration', body: 'By Stage 3, Optivia ships all four Claude Code integration surfaces: (1) CLI wrapper — sets ANTHROPIC_BASE_URL and launches claude with the master prompt prepopulated; highest control, sees everything. (2) MCP server — users add it via claude mcp add optivia and call /mcp__optivia__plan from inside Claude Code; lower friction, does not intercept downstream traffic. (3) Skill — users run npx optivia install and Claude Code automatically invokes Optivia when it detects a vague prompt; most natural UX. (4) Hooks integration — Optivia ships a PostToolUse hook that scores Claude Code\'s actions and a PreToolUse hook that can block destructive operations not in the approved plan.' },
              { title: 'Reliability Patterns', body: 'Circuit breakers per model tier: trip at P95 > 500ms or error rate > 5%; auto-reset after 30 seconds of healthy traffic. Exponential backoff with jitter for all LLM calls. Fallback chain: primary model → secondary tier → HeuristicRouter (the always-available baseline). Health checks with synthetic probes every 60 seconds on all tiers. Langfuse wired at three levels: trace level (every Optivia request is one trace), span level (every LangGraph node is a span), and score level (cost_usd, wall_time_seconds, outcome_success, user_feedback, retry_count, plan_edited_by_user).' },
            ].map(({ title, body }) => (
              <div key={title} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #1a1a1a' }}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '15px', fontWeight: 600, color: '#e0e0e0', letterSpacing: '-0.01em' }}>{title}</h4>
                <p style={{ margin: 0, color: '#666', lineHeight: 1.8 }}>{body}</p>
              </div>
            ))}
          </section>

          {/* Build vs Buy */}
          <section id="buildvsbuy" style={S.section}>
            <h2 style={S.h2}>Build vs Buy Decision Matrix</h2>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Component</th>
                  <th style={S.th}>Decision</th>
                  <th style={S.th}>Rationale</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['LLM Gateway',       'LiteLLM (self-host)',           'OpenRouter charges 5.5% fee with no infrastructure control. Portkey\'s per-log pricing scales linearly with volume and becomes expensive at scale.'],
                  ['Router (Stage 1)',   'RouteLLM mf (wrap)',            'Best open-source primitives. Martian and NotDiamond are commercial black boxes unvalidated on coding tasks.'],
                  ['Router (Stage 2)',   'Build on RouteLLM',             'Coding-specific win-rate data requires proprietary retraining on Optivia\'s own logs. No off-the-shelf router is calibrated to SWE-bench difficulty signals.'],
                  ['Classifier',        'Build (ModernBERT fine-tune)',   'No off-the-shelf coding task classifier at the required granularity or context length. Stage 1 instructor-on-Haiku costs ~$0.001/call; Stage 2 ModernBERT costs ~$0.0001/call.'],
                  ['Observability',     'Langfuse (self-host)',           'LangSmith is too LangChain-locked for a router product. Helicone is blind to sub-graph LangGraph spans. Langfuse is MIT-licensed and OpenTelemetry-native.'],
                  ['Synthesis',         'DSPy (wrap)',                    'Programmatic abstraction survives Stage 1 → Stage 2 migration intact. DSPy optimisers (MIPRO, OPRO) can be applied later without rewriting the pipeline.'],
                  ['Execution',         'Claude Code (integrate)',        'No reason to own the execution backend in Stage 1 or 2. Proxy interception via ANTHROPIC_BASE_URL is sufficient and preserves all Claude Code features.'],
                ].map(([component, decision, reason]) => (
                  <tr key={component}>
                    <td style={{ ...S.td, color: '#888', fontSize: '13px', whiteSpace: 'nowrap' }}>{component}</td>
                    <td style={{ ...S.td, fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: '12px', color: '#c9c9c9', whiteSpace: 'nowrap' }}>{decision}</td>
                    <td style={{ ...S.td, color: '#555', fontSize: '13px' }}>{reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Migration */}
          <section id="migration" style={{ ...S.section, paddingBottom: '6rem' }}>
            <h2 style={S.h2}>Stage 1 → Stage 2 Migration Guide</h2>
            <p style={S.p}>The migration succeeds or fails entirely on Stage 1 schema richness. Every published router-replacement project has been data-bottlenecked, not algorithm-bottlenecked. Optivia's MVP must over-instrument from day one.</p>

            {[
              { n: '1', title: 'Schema validation', body: 'Verify every Stage 1 trace has a non-null classification vector, all five scoring dimensions populated (complexity, risk, scope, ambiguity, dependency), a routing decision with counterfactuals from all three router implementations, and at least one outcome signal (diff produced, tests passed, user accepted). Traces missing any of these cannot be used as training data and should be quarantined rather than dropped — investigate the instrumentation gap first.' },
              { n: '2', title: 'Data quality audit', body: 'Filter traces where active_router = RouteLLMRouter. Label win/loss against the HeuristicRouter baseline. Require a minimum of 500 traces per TaskType before Stage 2 training begins; task types that haven\'t reached this threshold remain on the Stage 1 RouteLLMRouter even after Stage 2 promotes. Flag and quarantine traces with missing feedback — these cannot be labelled and should not be included in the win-rate training set.' },
              { n: '3', title: 'ModernBERT fine-tuning', body: 'Fine-tune on Stage 1 task classification labels. Validation split stratified by task type and time period. Target: F1 ≥ 0.88 on the held-out set with MAE ≤ 0.1 on all five scoring dimensions versus LLM-judge gold labels. Save checkpoint to the model registry with a semver tag and taxonomy_version field. Deploy on Modal with enable_memory_snapshot=True for approximately 1-second cold starts.' },
              { n: '4', title: 'Router training', body: 'Train the three heads (win probability, output length, fallback likelihood) on the shared ModernBERT encoder. Validate the utility computation against Stage 1 actual spend — the utility function must reproduce the historical routing decisions in at least 70% of cases before shadow deployment begins. Shadow at 1% traffic for 48 hours, inspect per-task-type success rates, then ramp to 5% → 25% → 50% → 100% over two weeks minimum.' },
              { n: '5', title: 'Promotion criteria', body: 'Win-rate delta ≥ 3% over RouteLLMRouter at N ≥ 500 samples per task type (p-value < 0.05, two-tailed). Cost reduction ≥ 10% at iso-quality. P99 routing latency < 50ms. On promotion, flip the active_router flag in the Postgres config table; keep RouteLLMRouter logging counterfactuals for 4 additional weeks. Automatic rollback is triggered if win-rate drops more than 2% versus the trailing 7-day baseline.' },
            ].map(({ n, title, body }) => (
              <div key={n} style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: '12px', color: '#333', flexShrink: 0, paddingTop: '3px', userSelect: 'none' }}>{n}</span>
                <div>
                  <p style={{ margin: '0 0 0.4rem', fontWeight: 600, fontSize: '15px', color: '#e0e0e0', letterSpacing: '-0.01em' }}>{title}</p>
                  <p style={{ margin: 0, color: '#666', lineHeight: 1.8 }}>{body}</p>
                </div>
              </div>
            ))}
          </section>

        </div>
      </main>
    </div>
  );
}

// ─── style constants ──────────────────────────────────────────────────────────

const S = {
  section: { marginBottom: '5rem' } as React.CSSProperties,
  kicker:  { margin: '0 0 0.75rem', fontSize: '12px', color: '#444', letterSpacing: '0.04em', fontWeight: 500 } as React.CSSProperties,
  h1:      { margin: '0 0 1.5rem', fontSize: '30px', fontWeight: 700, lineHeight: 1.2, color: '#fff', letterSpacing: '-0.02em' } as React.CSSProperties,
  h2:      { margin: '0 0 1.25rem', fontSize: '22px', fontWeight: 700, lineHeight: 1.2, color: '#fff', letterSpacing: '-0.02em' } as React.CSSProperties,
  h3:      { margin: '2.5rem 0 0.75rem', fontSize: '15px', fontWeight: 600, color: '#c0c0c0', letterSpacing: '-0.01em' } as React.CSSProperties,
  lede:    { margin: '0 0 1.5rem', fontSize: '16px', color: '#888', lineHeight: 1.85 } as React.CSSProperties,
  p:       { margin: '0 0 1.25rem', color: '#777', lineHeight: 1.8 } as React.CSSProperties,
  strong:  { color: '#d4d4d4', fontWeight: 600 } as React.CSSProperties,
  table:   { width: '100%', borderCollapse: 'collapse', margin: '1.25rem 0 2rem', fontSize: '13px' } as React.CSSProperties,
  th:      { textAlign: 'left', padding: '0.6rem 1rem', borderBottom: '1px solid #1f1f1f', color: '#444', fontWeight: 500, fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' } as React.CSSProperties,
  td:      { padding: '0.7rem 1rem', borderBottom: '1px solid #141414', color: '#666', verticalAlign: 'top', lineHeight: 1.6 } as React.CSSProperties,
};

// ─── sub-components ───────────────────────────────────────────────────────────

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code style={{ fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: '12px', color: '#aaa', letterSpacing: '0' }}>
      {children}
    </code>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre style={{
      margin: '0 0 1.5rem', padding: '1.25rem 1.5rem',
      background: '#111', borderRadius: '6px',
      fontSize: '12px', fontFamily: '"SF Mono", "Fira Code", monospace',
      color: '#c9c9c9', overflowX: 'auto', lineHeight: 1.7,
      border: '1px solid #1f1f1f',
    }}>
      {children}
    </pre>
  );
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid #1a1a1a', margin: '2.5rem 0' }} />;
}
