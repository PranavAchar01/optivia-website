'use client';

import { useState, useEffect } from 'react';

const NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'findings', label: 'Key Findings' },
  { id: 'framing', label: 'Strategic Framing' },
  { id: 'stage1', label: 'Stage 1 — MVP' },
  { id: 'stage1-stack', label: 'Stack', indent: true },
  { id: 'stage1-langgraph', label: 'LangGraph Engine', indent: true },
  { id: 'stage1-routing', label: 'Routing Module', indent: true },
  { id: 'stage1-schema', label: 'Classification Schema', indent: true },
  { id: 'stage2', label: 'Stage 2 — Custom Routing' },
  { id: 'stage3', label: 'Stage 3 — Production' },
  { id: 'buildvsbuy', label: 'Build vs Buy' },
  { id: 'migration', label: 'Migration Guide' },
];

export default function DocsPage() {
  const [active, setActive] = useState('overview');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#0d1117', color: '#e6edf3', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif', fontSize: '14px', lineHeight: '1.7' }}>

      {/* Sidebar */}
      <nav style={{ width: '260px', flexShrink: 0, height: '100%', overflowY: 'auto', borderRight: '1px solid #21262d', padding: '1.5rem 0', position: 'sticky', top: 0 }}>
        <div style={{ padding: '0 1.25rem 1.5rem', borderBottom: '1px solid #21262d', marginBottom: '1rem' }}>
          <a href="/" style={{ color: '#58a6ff', textDecoration: 'none', fontSize: '12px' }}>← Back to Optivia</a>
          <p style={{ margin: '0.75rem 0 0', fontWeight: 600, fontSize: '14px', color: '#e6edf3' }}>Technical Architecture</p>
          <p style={{ margin: '0.2rem 0 0', fontSize: '12px', color: '#8b949e' }}>Optivia Engineering · May 2026</p>
        </div>
        {NAV.map(({ id, label, indent }) => (
          <button
            key={id}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: `0.3rem ${indent ? '2rem' : '1.25rem'}`,
              background: active === id ? 'rgba(88,166,255,0.1)' : 'transparent',
              borderLeft: active === id ? '2px solid #58a6ff' : '2px solid transparent',
              border: 'none', cursor: 'pointer',
              fontSize: indent ? '12px' : '13px',
              color: active === id ? '#58a6ff' : indent ? '#8b949e' : '#c9d1d9',
              fontWeight: active === id ? 600 : 400,
              transition: 'color 0.1s',
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, height: '100%', overflowY: 'auto', padding: '3rem 4rem', maxWidth: 'none' }}>
        <div style={{ maxWidth: '860px' }}>

          {/* Overview */}
          <section id="overview" style={sectionStyle}>
            <Eyebrow>Optivia — Technical Architecture</Eyebrow>
            <h1 style={h1}>Three-Stage Architecture for Model Routing and Full-Stack Classification Above Claude Code</h1>
            <p style={lead}>Optivia sits upstream of Claude Code. Its job is to take a sloppy human prompt and convert it into the right shape of work — classified, scored, clarified, synthesised, and routed to the correct model — before that work hits the execution backend.</p>

            <Callout>
              <strong>Stage 1 (MVP)</strong> — Python/FastAPI + LangGraph + LiteLLM + RouteLLM + Langfuse + Postgres. Intercepts Claude Code via <Code>ANTHROPIC_BASE_URL</Code> proxy. The single most important MVP decision is the schema: every prompt must be logged with full classification, scoring, clarification, master-prompt, routing decision, downstream outcome, token spend, and user feedback so Stage 2 has supervised training data.
            </Callout>
            <Callout>
              <strong>Stage 2 (Custom Routing)</strong> — Replaces wrapped routers with a proprietary stack: ModernBERT task classifier, complexity/risk regression head, matrix-factorization router retrained on Optivia win-rate data, DSPy EIG clarifying-question generator. Shadow-deployed on Modal before promotion.
            </Callout>
            <Callout>
              <strong>Stage 3 (V1 Production)</strong> — Multi-tier router with semantic cache + intent classifier → ModernBERT → matrix-factorization router → cascading verifier → Claude Code via Agent SDK. Anthropic prompt caching (90% read reduction), Redis semantic cache, weekly online-learning loops.
            </Callout>
          </section>

          <Divider />

          {/* Key Findings */}
          <section id="findings" style={sectionStyle}>
            <h2 style={h2}>Key Findings</h2>

            {[
              ['No commercial router is ideal for coding', 'RouteLLM (LMSYS) provides the strongest open-source primitives — its matrix-factorization router achieves 95% of GPT-4 performance using only 26% strong-model calls on MT-Bench. Coding tasks have very different difficulty signals than general LLM-arena prompts, so any commercial router must be benchmarked on Optivia\'s own logs before being trusted. Martian and NotDiamond are commercial black boxes optimised for general queries.'],
              ['The MVP gateway is LiteLLM, not Portkey or OpenRouter', 'LiteLLM is open-source (MIT/Apache 2.0), self-hostable, sustains ~1,000 RPS, adds only 10–20ms latency, and supports custom routing logic in Python. OpenRouter charges a 5.5% fee with no infrastructure control. Portkey\'s per-log pricing scales linearly with volume. LiteLLM is the right primary substrate.'],
              ['Claude Code intercepts cleanly via ANTHROPIC_BASE_URL', 'Multiple proven patterns (agentgateway, seifghazi/claude-code-proxy, fuergaosi233/claude-code-proxy) demonstrate that pointing Claude Code at a localhost proxy lets you see every prompt, tool call, and file read in real time, rewrite the system prompt, route subagents to different models, and inject Optivia\'s pipeline upstream — without forking Claude Code itself.'],
              ['Coding-task difficulty has well-validated signal sources', 'SWE-bench Verified\'s annotator-time tiers (under 15 minutes, 15m–1h, 1h–4h, over 4h) and Multi-SWE-bench\'s Easy/Medium/Hard categorisation map directly to Optivia\'s complexity score. Lines changed scales 11× from Easy to Hard; files modified scales 2×.'],
              ['ModernBERT, not DistilBERT, is the right Stage 2 classifier', '8K context window (versus BERT\'s 512), trained on 2T tokens including code, runs 2–4× faster than older BERT, outperforms BERT by ~3% on classification while training 3× faster.'],
              ['Clarifying questions should use Expected Information Gain', 'The BED-LLM and Active Task Disambiguation papers prove that maximising EIG over a sampled candidate-question set substantially outperforms naive "ask the LLM what to clarify." Stage 1 uses a structured-output LLM call; Stage 2 explicitly scores candidates by EIG.'],
              ['Economics are dominated by prompt caching, not model selection', 'Anthropic prompt caching gives 90% read-cost reduction at a 25% write premium, breaking even after two cache hits. The master-prompt prefix should be cache-controlled. Naive cost models that ignore caching will misroute.'],
              ['The Sonnet-Opus gap on coding has nearly closed', 'Sonnet 4.6 scores 79.6%, Opus 4.6 scores 80.8% on SWE-bench Verified — a 1.2-point quality gap for ~1.7× cost ($3/$15 vs $5/$25 per million tokens). Haiku 4.5 sits at 73.3% at $1/$5. Three rational tiers: Haiku for trivial, Sonnet for default, Opus for architectural reasoning.'],
              ['Langfuse is the right Stage 1 observability platform', 'Open-source, MIT-licensed, OpenTelemetry-native, span-level tracing for LangGraph workflows, free to 50K events/month. Helicone only sees HTTP traffic. LangSmith is too LangChain-locked for a router product.'],
              ['Stage 2 routing is a learning-to-rank problem with three heads', 'Pattern from RouteLLM, FrugalGPT, Hybrid LLM, EmbedLLM: (a) predict win probability per model, (b) predict expected output length, (c) compute expected utility under cost constraint, (d) pick argmax. Three small heads on a shared encoder — not a single "magic" router.'],
              ['The MVP stack must be Python', 'LangGraph, LiteLLM, instructor, RouteLLM, DSPy, ModernBERT fine-tuning, Aurelio Semantic Router, HuggingFace, Langfuse SDK — all Python-first. FastAPI, Pydantic, asyncio form the production pattern. Next.js for the workflow UI; Python unambiguously for the backend.'],
              ['Stage 1 → Stage 2 migration succeeds or fails on the schema', 'Every published router-replacement project has been data-bottlenecked, not algorithm-bottlenecked. Optivia\'s MVP must over-instrument: full classification vector, every clarification, every routing decision with alternatives, every Claude Code outcome with token counts, exit signals, file diffs, error patterns, and user feedback.'],
            ].map(([title, body], i) => (
              <div key={i} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #21262d' }}>
                <p style={{ margin: '0 0 0.3rem', fontWeight: 600, color: '#e6edf3', display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#58a6ff', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                  {title}
                </p>
                <p style={{ margin: 0, color: '#8b949e', paddingLeft: '2rem' }}>{body}</p>
              </div>
            ))}
          </section>

          <Divider />

          {/* Strategic Framing */}
          <section id="framing" style={sectionStyle}>
            <h2 style={h2}>Strategic Framing</h2>
            <p style={p}>Optivia sits in a narrow but valuable position: above coding agents, below the user's intent. The product makes three simultaneous bets.</p>
            <table style={tableStyle}>
              <thead><tr>{['Bet', 'Claim', 'Evidence'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>
                {[
                  ['Routing', 'Selecting the right model and execution path yields more value than upgrading a single model', 'RouterBench, RouteLLM, FrugalGPT, Hybrid LLM — 50–98% cost reduction at iso-quality'],
                  ['Classification', 'Coding tasks decompose into a small taxonomy; complexity/risk/scope/ambiguity/dependency scoring captures what drives routing', 'SWE-bench Verified annotation tiers map directly to Optivia\'s complexity score'],
                  ['Synthesis', 'A master prompt (original + classification + scores + clarifications + preamble) substantially outperforms raw prompts', 'DSPy/APE/OPRO/TextGrad all prove this on benchmarks'],
                ].map(([bet, claim, evidence]) => (
                  <tr key={bet}>
                    <td style={tdStyle}><Code>{bet}</Code></td>
                    <td style={tdStyle}>{claim}</td>
                    <td style={{ ...tdStyle, color: '#8b949e' }}>{evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <Divider />

          {/* Stage 1 */}
          <section id="stage1" style={sectionStyle}>
            <h2 style={h2}>Stage 1 — MVP Wrapper Phase</h2>
            <p style={p}>Build the smallest end-to-end engine that can accept a user prompt, classify it, score it, clarify it, synthesise a master prompt, route to Claude Code with correct model selection, observe execution, and log everything for Stage 2 training. No proprietary models. No bespoke routing mathematics. Maximum reuse.</p>

            <h3 id="stage1-stack" style={h3}>Stack at a Glance</h3>
            <table style={tableStyle}>
              <thead><tr>{['Layer', 'Tool', 'Rationale'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>
                {[
                  ['Backend', 'Python 3.12, FastAPI, asyncio, Pydantic v2', 'Whole AI ecosystem is Python-first'],
                  ['Orchestration', 'LangGraph (MIT)', 'DAG execution, checkpointed state, streaming, human-in-loop interrupts'],
                  ['LLM Gateway', 'LiteLLM (self-hosted)', 'Unified API for 100+ providers, retries, fallbacks, ~10ms overhead'],
                  ['Cost/Quality Router', 'RouteLLM mf (pre-trained)', '95% strong-model performance at 14–26% strong-model calls'],
                  ['Fast Classifier', 'Aurelio Semantic Router + voyage-code-3', '<50ms kNN over utterance embeddings'],
                  ['Deep Classifier', 'instructor + Claude Haiku 4.5 + Pydantic', 'Structured JSON output with validation/retries'],
                  ['Clarification', 'instructor + Claude Sonnet 4.6', 'EIG-prompt heuristic in Stage 1; full Bayesian EIG in Stage 2'],
                  ['Synthesis', 'DSPy ChainOfThought + Anthropic prompt caching', 'Programmatic abstraction survives into Stage 2'],
                  ['Execution', 'Claude Code via ANTHROPIC_BASE_URL proxy', 'Proven pattern; preserves all Claude Code features'],
                  ['Observability', 'Langfuse (MIT) + OpenTelemetry', 'Span-level tracing, cost tracking, 50K events/month free'],
                  ['Database', 'Postgres 16 + pgvector + pgmq', 'Single store for traces, retrieval embeddings, queue'],
                  ['Cache', 'Redis 7 + RediSearch', 'Sub-ms exact match + semantic cache via cosine threshold'],
                  ['Deployment', 'Fly.io + Modal/Railway + Neon + Upstash', 'Cheap, fast, regional'],
                ].map(([layer, tool, rationale]) => (
                  <tr key={layer}>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '12px', color: '#58a6ff', whiteSpace: 'nowrap' }}>{layer}</td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '12px', color: '#e6edf3' }}>{tool}</td>
                    <td style={{ ...tdStyle, color: '#8b949e' }}>{rationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 id="stage1-langgraph" style={h3}>LangGraph Engine</h3>
            <p style={p}>A single <Code>LangGraph StateGraph</Code> with nodes sharing an <Code>OptiviaState TypedDict</Code>:</p>
            <CodeBlock>{`OptiviaState = {
  request_id: str,
  user_id: str,
  raw_prompt: str,
  attached_files: list[FileRef],
  project_context: ProjectContext,
  semantic_cache_hit: Optional[CachedResult],
  fast_intent: FastIntent,
  task_classification: TaskClassification,
  scores: TaskScores,
  clarifications: list[Clarification],
  master_prompt: MasterPrompt,
  workflow_plan: WorkflowPlan,
  routing_decision: RoutingDecision,
  execution_trace: list[ExecutionEvent],
  outcome: Optional[Outcome],
  feedback: Optional[UserFeedback],
}`}</CodeBlock>
            <p style={p}>Node execution order:</p>
            <ol style={{ color: '#8b949e', paddingLeft: '1.5rem', margin: '0 0 1rem' }}>
              {[
                'cache_lookup — Redis semantic cache; cosine ≥ 0.95 → short-circuit to replay_outcome',
                'fast_intent — Aurelio Semantic Router; confidence > 0.9 + trivial/non-code → short-circuit',
                'deep_classify_and_score — instructor call to Claude Haiku 4.5; returns TaskClassification + TaskScores',
                'decide_clarification — conditional edge: ambiguity ≥ 0.6 or (scope ≥ 0.7 and confidence < 0.5) → clarify',
                'generate_clarifications — Sonnet 4.6 via instructor; 1–3 questions; emits LangGraph interrupt',
                'synthesize_master_prompt — DSPy Predict + Anthropic prompt caching; outputs MasterPrompt + WorkflowPlan',
                'route — RouteLLM mf + deterministic policy (if risk ≥ 0.8, never Haiku)',
                'human_review — React Flow visualiser interrupt; every approval/rejection is supervised data',
                'execute_via_claude_code — posts to proxy; streams events; captures token counts + file diffs',
                'evaluate_outcome — diff produced? tests passed? user accepted?',
                'log_trace — Postgres normalised write + Langfuse spans + Redis cache update',
              ].map((item, i) => <li key={i} style={{ marginBottom: '0.35rem' }}><Code>{item.split(' — ')[0]}</Code> — {item.split(' — ')[1]}</li>)}
            </ol>

            <h3 id="stage1-routing" style={h3}>Routing Module</h3>
            <p style={p}>Three implementations run on every request. Only one decision is acted on; the others log counterfactuals.</p>
            <CodeBlock>{`class Router(Protocol):
    async def route(self, ctx: RoutingContext) -> RoutingDecision: ...`}</CodeBlock>
            <table style={tableStyle}>
              <thead><tr>{['Implementation', 'Logic'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>
                {[
                  ['HeuristicRouter', 'complexity < 0.3 → Haiku 4.5 · 0.3–0.7 → Sonnet 4.6 · ≥ 0.7 or risk ≥ 0.7 → Opus 4.6. Always-available baseline.'],
                  ['RouteLLMRouter', 'LMSYS RouteLLM mf router, applied pairwise (Haiku-vs-Sonnet, Sonnet-vs-Opus). Threshold t calibrated to target spend curve.'],
                  ['LLMJudgeRouter', 'Claude Haiku 4.5 with structured-output schema. Used as tiebreaker and generator of Stage 2 training labels.'],
                ].map(([name, logic]) => (
                  <tr key={name}>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '12px', color: '#58a6ff', whiteSpace: 'nowrap' }}>{name}</td>
                    <td style={{ ...tdStyle, color: '#8b949e' }}>{logic}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 id="stage1-schema" style={h3}>Classification Schema</h3>
            <CodeBlock>{`class TaskType(str, Enum):
    NEW_CODE  = "new_code"   # build something from scratch
    DEBUG     = "debug"      # fix something broken
    REFACTOR  = "refactor"   # change shape, not behaviour
    REVIEW    = "review"     # read / audit existing code
    EXPLAIN   = "explain"    # answer a question about code
    LONG      = "long"       # multi-file, multi-step (>30 min)
    TRIVIAL   = "trivial"    # rename, format, single-line edit
    META      = "meta"       # ask Claude Code something

class TaskScores(BaseModel):
    complexity:        float  # ge=0, le=1
    risk:              float  # ge=0, le=1
    scope:             float  # ge=0, le=1
    ambiguity:         float  # ge=0, le=1
    dependency:        float  # ge=0, le=1
    est_tokens_input:  int
    est_tokens_output: int
    est_wall_seconds:  int
    est_tier:          Literal["<15m", "15m-1h", "1h-4h", ">4h"]
    confidence:        float`}</CodeBlock>
          </section>

          <Divider />

          {/* Stage 2 */}
          <section id="stage2" style={sectionStyle}>
            <h2 style={h2}>Stage 2 — Custom Routing Phase</h2>
            <p style={p}>Replaces all wrapped commercial routers with a proprietary stack trained on Stage 1 logs. The MVP becomes a teacher; the proprietary stack distils it.</p>
            {[
              { title: 'ModernBERT Task Classifier', body: 'Fine-tuned on Stage 1 classification logs. Input: raw prompt + project context (up to 8K tokens). Output: TaskType + per-class probabilities. Validation target: F1 ≥ 0.88 stratified by task type. Serves 2–4× faster than original BERT.' },
              { title: 'Complexity & Risk Regression Head', body: 'Trained on Stage 1 outcome labels (est_tier, token counts, retry counts). Predicts all five TaskScores dimensions. Anchored to SWE-bench Verified annotation tiers. Shares encoder with the task classifier.' },
              { title: 'Matrix-Factorization Router', body: 'RouteLLM-style model retrained on Optivia\'s own win-rate data. Three heads on shared encoder: (1) win probability per model, (2) expected output length, (3) expected utility under cost constraint. Decision = argmax(utility). Accounts for Anthropic prompt caching economics.' },
              { title: 'DSPy EIG Clarifying Question Generator', body: 'Replaces Stage 1\'s heuristic with full Expected Information Gain scoring (BED-LLM/BALAR pattern). Samples N candidate questions, scores each by EIG over model\'s posterior, selects top 1–3. MCQ candidate answers to reduce user friction.' },
              { title: 'Shadow Deployment & Promotion', body: 'All proprietary routes run in parallel with the RouteLLM baseline for minimum 2 weeks before promotion. A/B test with CUPED variance reduction. Promotion criteria: win-rate delta ≥ 3% at N ≥ 500 samples, p-value < 0.05, cost reduction ≥ 10% at iso-quality, P99 routing latency < 50ms.' },
            ].map(({ title, body }) => (
              <div key={title} style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.4rem', color: '#e6edf3', fontSize: '14px', fontWeight: 600 }}>{title}</h4>
                <p style={{ margin: 0, color: '#8b949e' }}>{body}</p>
              </div>
            ))}
          </section>

          <Divider />

          {/* Stage 3 */}
          <section id="stage3" style={sectionStyle}>
            <h2 style={h2}>Stage 3 — V1 Production Phase</h2>
            <p style={p}>Target: P99 &lt; 200ms routing latency, sub-50ms semantic cache, 90% prompt-cache read-cost reduction, weekly online learning updates.</p>
            <h3 style={h3}>Multi-Tier Routing Architecture</h3>
            <CodeBlock>{`Request
  → Redis semantic cache (cosine ≥ 0.95 → return cached)
  → Intent classifier (trivial/non-code → short-circuit)
  → ModernBERT task classifier
  → Matrix-factorization cost/quality router
  → Cascading verifier + circuit breakers
  → Claude Code (via Agent SDK)`}</CodeBlock>
            {[
              { title: 'Caching Strategy', body: 'Anthropic prompt caching on the master-prompt system preamble (90% read reduction, break-even at 2 cache hits). Redis-backed semantic cache for repeat queries (cosine threshold 0.95). Hybrid exact + approximate lookup. Cache key includes project_context hash.' },
              { title: 'Cost Optimisation', body: 'Prompt-token compression via selective context pruning. Subagent decomposition for scope ≥ 0.7 tasks. Cost-aware routing utility function that accounts for caching economics — routing to Sonnet with a warm cache can be cheaper than Haiku without one.' },
              { title: 'Online Learning Loop', body: 'Weekly router retraining on production feedback. Implicit signals: session length, retry count, user edits to Claude Code output. Explicit signals: thumbs up/down, task marked complete. Model registry with automatic rollback on win-rate regression.' },
              { title: 'Reliability Patterns', body: 'Circuit breakers per model tier (trip at P95 > 500ms or error rate > 5%). Exponential backoff with jitter. Fallback chain: primary model → secondary tier → HeuristicRouter. Health checks with synthetic probes every 60 seconds.' },
              { title: 'Full Claude Code Integration', body: 'Agent SDK hooks for prompt interception and system message injection. /optivia slash command via SKILL.md. MCP server (claude mcp add optivia) for tool-call observation. settingSources for per-session model override. Sub-agent routing to different model tiers within a single Claude Code session.' },
            ].map(({ title, body }) => (
              <div key={title} style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.3rem', color: '#e6edf3', fontSize: '14px', fontWeight: 600 }}>{title}</h4>
                <p style={{ margin: 0, color: '#8b949e' }}>{body}</p>
              </div>
            ))}
          </section>

          <Divider />

          {/* Build vs Buy */}
          <section id="buildvsbuy" style={sectionStyle}>
            <h2 style={h2}>Build vs Buy Decision Matrix</h2>
            <table style={tableStyle}>
              <thead><tr>{['Component', 'Decision', 'Reason'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>
                {[
                  ['LLM Gateway', 'LiteLLM (self-host)', 'OpenRouter 5.5% fee; Portkey per-log pricing scales badly at volume'],
                  ['Router (Stage 1)', 'RouteLLM mf (wrap)', 'Best open-source primitives; Martian/NotDiamond are black boxes for coding tasks'],
                  ['Router (Stage 2)', 'Build on RouteLLM', 'Coding-specific win-rate data requires proprietary retraining on Optivia logs'],
                  ['Classifier', 'Build (ModernBERT fine-tune)', 'No off-the-shelf coding task classifier at required granularity or context length'],
                  ['Observability', 'Langfuse (self-host)', 'LangSmith locked to LangChain; Helicone blind to sub-graph LangGraph spans'],
                  ['Synthesis', 'DSPy (wrap)', 'Programmatic abstraction survives Stage 1→2 migration intact; avoids prompt lock-in'],
                  ['Execution', 'Claude Code (integrate)', 'No reason to own the execution backend in Stage 1 or 2; proxy interception is sufficient'],
                ].map(([component, decision, reason]) => (
                  <tr key={component}>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '12px', color: '#e6edf3', whiteSpace: 'nowrap' }}>{component}</td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '12px', color: '#58a6ff', whiteSpace: 'nowrap' }}>{decision}</td>
                    <td style={{ ...tdStyle, color: '#8b949e' }}>{reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <Divider />

          {/* Migration */}
          <section id="migration" style={{ ...sectionStyle, marginBottom: '4rem' }}>
            <h2 style={h2}>Stage 1 → Stage 2 Migration Guide</h2>
            <p style={p}>The migration succeeds or fails entirely on Stage 1 schema richness. Every published router-replacement project has been data-bottlenecked, not algorithm-bottlenecked.</p>
            {[
              { step: 1, title: 'Schema validation', body: 'Verify every Stage 1 trace has a non-null classification vector, all five scoring dimensions, routing decision with counterfactuals from all three routers, and at least one outcome signal (diff produced, tests passed, user accepted).' },
              { step: 2, title: 'Data quality audit', body: 'Filter traces where active_router = RouteLLMRouter. Label win/loss against HeuristicRouter baseline. Minimum 500 traces per TaskType before Stage 2 training begins. Flag and quarantine traces with missing feedback.' },
              { step: 3, title: 'ModernBERT fine-tuning', body: 'Fine-tune on Stage 1 task classification labels. Validation split stratified by task type. Target: F1 ≥ 0.88 on held-out set. Save checkpoint to model registry with schema version tag.' },
              { step: 4, title: 'Router training', body: 'Train three heads on shared ModernBERT encoder: win-probability per model, expected output length, expected utility under cost constraint. Validate utility computation against Stage 1 actual spend. Shadow-deploy minimum 2 weeks.' },
              { step: 5, title: 'Promotion', body: 'Win-rate delta ≥ 3% over RouteLLMRouter at N ≥ 500 (p < 0.05). Cost reduction ≥ 10% at iso-quality. P99 routing latency < 50ms. On promotion, flip active_router flag; keep RouteLLMRouter logging counterfactuals for 4 additional weeks.' },
            ].map(({ step, title, body }) => (
              <div key={step} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid #21262d' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#58a6ff', flexShrink: 0, width: '24px', paddingTop: '1px' }}>{step}.</span>
                <div>
                  <p style={{ margin: '0 0 0.25rem', fontWeight: 600, color: '#e6edf3' }}>{title}</p>
                  <p style={{ margin: 0, color: '#8b949e' }}>{body}</p>
                </div>
              </div>
            ))}
          </section>

        </div>
      </main>
    </div>
  );
}

// Style helpers
const sectionStyle: React.CSSProperties = { marginBottom: '4rem' };
const h1: React.CSSProperties = { margin: '0.5rem 0 1rem', fontSize: '28px', fontWeight: 700, lineHeight: 1.3, color: '#e6edf3', letterSpacing: '-0.01em' };
const h2: React.CSSProperties = { margin: '0 0 1rem', fontSize: '22px', fontWeight: 700, lineHeight: 1.3, color: '#e6edf3', letterSpacing: '-0.01em' };
const h3: React.CSSProperties = { margin: '2rem 0 0.75rem', fontSize: '16px', fontWeight: 600, color: '#e6edf3' };
const lead: React.CSSProperties = { margin: '0 0 1.5rem', fontSize: '15px', color: '#8b949e', lineHeight: 1.7 };
const p: React.CSSProperties = { margin: '0 0 1rem', color: '#8b949e' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '13px' };
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '0.5rem 0.75rem', background: '#161b22', color: '#8b949e', fontWeight: 500, fontSize: '12px', borderBottom: '1px solid #21262d', borderTop: '1px solid #21262d' };
const tdStyle: React.CSSProperties = { padding: '0.6rem 0.75rem', borderBottom: '1px solid #21262d', color: '#c9d1d9', verticalAlign: 'top' };

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: '0 0 0.5rem', fontSize: '12px', color: '#58a6ff', fontFamily: 'monospace' }}>{children}</p>;
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: '0 0 1rem', padding: '1rem 1.25rem', background: '#161b22', border: '1px solid #21262d', borderLeft: '3px solid #58a6ff', borderRadius: '0 6px 6px 0', fontSize: '13px', color: '#8b949e', lineHeight: 1.7 }}>
      {children}
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return <code style={{ fontFamily: 'monospace', fontSize: '12px', background: '#161b22', border: '1px solid #30363d', borderRadius: '4px', padding: '0.1em 0.4em', color: '#58a6ff' }}>{children}</code>;
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre style={{ margin: '0 0 1.25rem', padding: '1rem 1.25rem', background: '#161b22', border: '1px solid #21262d', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace', color: '#e6edf3', overflowX: 'auto', lineHeight: 1.6 }}>
      {children}
    </pre>
  );
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid #21262d', margin: '0 0 3rem' }} />;
}
