// src/data/portfolioData.ts
import { CaseStudy, SkillItem, TechnicalArticle } from '@/types/portfolio';

export const PROFILE = {
  name: 'Quadri Olaniyan',
  handle: 'QO // ENG',
  role: 'Software Engineer — Enterprise Workflows, Frontend Architecture & Systems Integration',
  location: 'Lagos, Nigeria (Open to Global Opportunities)',
  email: 'olaniyanquadri6@gmail.com',
  github: 'https://github.com/Agbolahan10',
  linkedin: 'https://linkedin.com/in/quadri-olaniyan-b07a3035b',
  availability: 'Available for Software Engineering Roles & Digital Transformation Initiatives',
};

export const SKILLS: SkillItem[] = [
  {
    name: 'React & Next.js (App Router)',
    category: 'frontend',
    level: 'Production Architecture',
    context: 'SSR/ISR, deterministic client state, command palettes & complex enterprise portals',
  },
  {
    name: 'TypeScript & Tailwind CSS',
    category: 'frontend',
    level: 'Strict Type Safety',
    context: 'End-to-end API schema validation (Zod), design systems & zero-runtime-type-error patterns',
  },
  {
    name: 'BPMN 2.0 & Workflow Engines',
    category: 'workflow',
    level: 'Enterprise Orchestration',
    context: 'Multi-level maker-checker approval flows, Camunda/Appian patterns & SLA routing',
  },
  {
    name: 'Core Banking & REST API Integration',
    category: 'workflow',
    level: 'High-Reliability Sync',
    context: 'Idempotent payload handling, retries, audit logging & third-party service bridges',
  },
  {
    name: 'Python & Automation Pipelines',
    category: 'devops',
    level: 'Scripting & Pipelines',
    context: 'Automated data reconciliation, PRAW/OpenPyXL automation, cron jobs & REST integrations',
  },
  {
    name: 'Cloud Deployment & CI/CD (PipeOps / Vercel)',
    category: 'devops',
    level: 'Automated Delivery',
    context: 'Containerized deployments, environment orchestration & zero-downtime release pipelines',
  },
  {
    name: 'Exploratory QA & Bug Reproduction',
    category: 'qa',
    level: 'Zero-Defect Engineering',
    context: 'Root-cause isolation, edge-case matrix testing & Human Experience (HX) validation',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'enterprise-workflow-engine',
    index: '01',
    title: 'Enterprise Multi-Level Approval & Core Banking Workflow Engine',
    domain: 'FinTech & Enterprise Automation',
    metrics: ['68% Faster Approval Turnaround', '100% Audit Traceability', 'Zero Duplicate Postings'],
    stack: ['Next.js', 'TypeScript', 'BPMN 2.0', 'REST APIs', 'Tailwind CSS'],
    car: {
      context:
        'Legacy multi-department approval processes relied on fragmented manual handoffs and disconnected forms, creating bottlenecks and delayed transaction settlements under strict compliance timelines.',
      action:
        'Architected a modern workflow automation portal with deterministic Maker-Checker-Authorizer state transitions, dynamic role-based routing, and idempotent core banking API integration.',
      result:
        'Cut end-to-end approval cycle times by 68%, eliminated duplicate ledger postings, and provided real-time SLA visibility across operations and compliance teams.',
    },
    architectureNodes: [
      {
        id: 'client-portal',
        label: 'Maker / Checker Portal',
        sub: 'Next.js + Strict State Guards',
        type: 'client',
        latency: '14ms',
        detail: 'Enforces role-based field locks and generates client-side idempotency keys before submission.',
      },
      {
        id: 'api-gateway',
        label: 'Validation & Auth Gateway',
        sub: 'Zod Schema + RBAC Middleware',
        type: 'gateway',
        latency: '22ms',
        detail: 'Verifies JWT session claims, validates payload schemas, and logs immutable audit trails.',
      },
      {
        id: 'bpmn-engine',
        label: 'BPMN Orchestration Engine',
        sub: 'Multi-Level Rule & SLA Router',
        type: 'engine',
        latency: '38ms',
        detail: 'Evaluates transaction thresholds and routes requests across Compliance, Risk, and Executive queues.',
      },
      {
        id: 'core-banking',
        label: 'Core Banking Ledger API',
        sub: 'Idempotent Settlement Sync',
        type: 'core',
        latency: '64ms',
        detail: 'Executes atomic account postings with automatic retry-with-backoff and reconciliation webhooks.',
      },
    ],
  },
  {
    id: 'industrial-telemetry-hub',
    index: '02',
    title: 'Operational Telemetry & Anomaly Detection Console',
    domain: 'Upstream Energy & Industrial Systems',
    metrics: ['Sub-100ms UI Frame Rate', 'Automated Threshold Alerts', 'Cross-Discipline Data Sync'],
    stack: ['React', 'TypeScript', 'Python', 'WebSockets', 'Tailwind CSS'],
    car: {
      context:
        'Field and operational teams needed a unified interface to monitor high-frequency sensor streams, process parameters, and equipment health without spreadsheet lag.',
      action:
        'Engineered a high-density telemetry dashboard featuring buffered real-time state updates, deterministic anomaly flagging rules, and automated incident escalation workflows.',
      result:
        'Enabled instant visual identification of parameter drift and streamlined cross-team reporting between field engineers and technical operations.',
    },
    architectureNodes: [
      {
        id: 'telemetry-ui',
        label: 'High-Density Console',
        sub: 'React Windowed State Buffer',
        type: 'client',
        latency: '16ms',
        detail: 'Renders live time-series streams at 60fps using memoized canvas/SVG layers.',
      },
      {
        id: 'stream-ingestor',
        label: 'Stream Normalization Layer',
        sub: 'Python / WebSocket Bridge',
        type: 'gateway',
        latency: '29ms',
        detail: 'Cleans noisy field data, standardizes units, and flags out-of-bounds readings.',
      },
      {
        id: 'rule-evaluator',
        label: 'Anomaly Rule Engine',
        sub: 'Threshold & Drift Detector',
        type: 'engine',
        latency: '19ms',
        detail: 'Triggers automated maintenance tickets when pressure or flow metrics breach tolerance bands.',
      },
      {
        id: 'time-series-store',
        label: 'Operational Data Store',
        sub: 'Indexed Historical Log',
        type: 'core',
        latency: '41ms',
        detail: 'Persists telemetry snapshots for post-incident root-cause analysis and compliance reporting.',
      },
    ],
  },
  {
    id: 'automated-lead-intelligence',
    index: '03',
    title: 'Automated Technical Opportunity & Lead Intelligence Scanner',
    domain: 'Automation & API Orchestration',
    metrics: ['24/7 Autonomous Scanning', 'Zero-Duplicate Alerting', 'Sub-Second Keyword Filtering'],
    stack: ['Python', 'REST APIs', 'Cron / GitHub Actions', 'TypeScript', 'Next.js'],
    car: {
      context:
        'Manually monitoring high-volume developer communities and forums for technical migration and consulting opportunities was time-intensive and prone to missed windows.',
      action:
        'Built an automated Python & API ingestion pipeline with scheduled cron execution, deterministic keyword/intent scoring, and instant webhook notifications.',
      result:
        'Automated 100% of lead discovery across target technical channels with zero duplicate alerts and structured digest reporting.',
    },
    architectureNodes: [
      {
        id: 'stream-poller',
        label: 'Scheduled API Poller',
        sub: 'Python + OAuth2 Stream',
        type: 'client',
        latency: '45ms',
        detail: 'Authenticates and fetches newest community submissions on a deterministic cron schedule.',
      },
      {
        id: 'intent-classifier',
        label: 'Intent & Keyword Engine',
        sub: 'Regex + Heuristic Scoring',
        type: 'gateway',
        latency: '8ms',
        detail: 'Filters out noise and scores posts based on migration, SEO, and engineering intent signals.',
      },
      {
        id: 'dedup-cache',
        label: 'Idempotency & State Ledger',
        sub: 'Hash Deduplication Store',
        type: 'engine',
        latency: '11ms',
        detail: 'Guarantees each unique post ID is processed and alerted exactly once across cron runs.',
      },
      {
        id: 'dispatch-webhook',
        label: 'Instant Notification Bridge',
        sub: 'Webhook / Digest Dispatcher',
        type: 'core',
        latency: '32ms',
        detail: 'Pushes structured opportunity payloads with direct action links in real time.',
      },
    ],
  },
];

export const ARTICLES: TechnicalArticle[] = [
  {
    id: 'bpmn-frontend-state',
    title: 'Architecting Multi-Level Approval Workflows with BPMN & Modern Frontend State',
    category: 'Architecture & BPMN',
    date: 'Oct 2026',
    readTime: '6 min read',
    summary:
      'How to bridge enterprise BPMN orchestration engines with reactive Next.js interfaces without leaking business rules or causing race conditions.',
    content: [
      'Enterprise applications rarely fail because of CSS—they fail when asynchronous approval states drift out of sync between the browser and the core ledger.',
      'By modeling frontend forms as strict projections of backend BPMN task states, we eliminate invalid transitions and guarantee 100% auditability across Maker, Checker, and Authorizer roles.',
    ],
    codeSnippet: `// Deterministic transition guard
function canApprove(role: UserRole, amount: number, stage: Stage): boolean {
  if (stage !== 'PENDING_AUTHORIZATION') return false;
  if (amount > 10_000_000 && role !== 'EXEC_APPROVER') return false;
  return true;
}`,
  },
  {
    id: 'zero-defect-qa-engineering',
    title: 'Zero-Defect Engineering: Applying Exploratory QA & Bug Classification to Production Code',
    category: 'Quality Engineering',
    date: 'Oct 2026',
    readTime: '5 min read',
    summary:
      'Why training in structured bug reproduction and Human Experience (HX) testing makes you a faster, more defensive software architect.',
    content: [
      'Writing features is only half of software engineering. Systematically hunting boundary conditions—network drops during form submission, race conditions on double-clicks, and viewport overflows—separates resilient systems from fragile ones.',
      'Integrating exploratory QA heuristics directly into component development drastically reduces production regressions.',
    ],
    codeSnippet: `// Idempotent submit handler preventing double-click race conditions
const handleTransactionSubmit = async () => {
  if (isSubmittingRef.current) return;
  isSubmittingRef.current = true;
  await dispatchWorkflowTransition(payload);
};`,
  },
];