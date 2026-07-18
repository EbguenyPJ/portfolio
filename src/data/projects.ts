// ─── Architecture diagram types ───────────────────────────────────────────────
export type ArchNodeType = 'client' | 'gateway' | 'service' | 'db' | 'cache' | 'queue' | 'external'

export interface ArchNode {
  id:       string
  label:    string
  sublabel?: string
  type:     ArchNodeType
  col?:     number   // explicit grid column (0-based) — overrides auto-layout
  row?:     number   // explicit grid row (0-based)
}

export interface ArchEdge {
  from:    string
  to:      string
  label?:  string
  dashed?: boolean
  bidir?:  boolean    // bidirectional arrow (marker on both ends)
}

export interface ArchScope {
  label:    string
  nodeIds:  string[]   // nodes enclosed by this scope box
}

// ─── Feature (split-view section) ─────────────────────────────────────────────
export interface ProjectFeature {
  title:       string
  description: string
  image?:      string   // single image path
  images?:     string[] // auto-fading carousel of images
  tag?:        string   // short label shown above title, e.g. "Payments"
  layout?:     'landscape' | 'portrait'  // image orientation — defaults to 'landscape'
}

// ─── Architecture diagram (a project may have several — e.g. multi-repo) ──────
export interface ArchDiagram {
  title?:   string
  nodes:    ArchNode[]
  edges?:   ArchEdge[]
  scopes?:  ArchScope[]
}

// ─── Code tab ─────────────────────────────────────────────────────────────────
export interface CodeTab {
  filename:  string       // e.g. "tenant.middleware.ts"
  code:      string
  language?: string
  caption?:  string
}

// ─── Composable detail blocks ─────────────────────────────────────────────────
// A project's detail page is an ordered list of blocks. The hero renders first
// (from the meta below); everything after is composed from `blocks`. The newer
// block types (timeline / beforeAfter / metrics / systemMap) let very different
// projects tell very different stories without a single fixed narrative arc.
export interface TimelinePhase  { label: string; date?: string; body: string; tag?: string }
export interface BeforeAfterRow { label: string; before: string; after: string }
export interface Metric         { value: string; label: string; sub?: string }
export interface RepoNode       { name: string; role: string; stack: string[]; accent?: 'green' | 'rose' | 'plain' }

export type Block =
  | { type: 'summary';      title?: string; body: string }
  | { type: 'challenge';    title?: string; body: string }
  | { type: 'architecture'; title?: string; body: string; diagrams?: ArchDiagram[] }
  | { type: 'features';     title?: string; items: ProjectFeature[] }
  | { type: 'code';         title?: string; tabs: CodeTab[] }
  | { type: 'timeline';     title?: string; phases: TimelinePhase[] }
  | { type: 'beforeAfter';  title?: string; intro?: string; rows: BeforeAfterRow[] }
  | { type: 'metrics';      title?: string; items: Metric[] }
  | { type: 'systemMap';    title?: string; body?: string; repos: RepoNode[] }

// ─── Main Project type ─────────────────────────────────────────────────────────
export interface Project {
  slug:     string
  index:    string       // "01", "02", …
  title:    string
  tagline:  string       // one-liner shown in carousel + hero

  // ── Meta (carousel card + Executive Summary sidebar) ──────────────────────
  role:     string       // e.g. "Lead Backend Engineer"
  year:     string       // e.g. "2024"
  industry: string       // e.g. "FinTech · B2B SaaS"
  heroImage?:  string    // single hero image (legacy)
  heroImages?: string[]  // auto-fading carousel of hero images
  accent?:     string    // brand primary color — tints the hero atmosphere glow (defaults to accent-green)
  stack: string[]

  // ── Detail composition ────────────────────────────────────────────────────
  // New projects author `blocks` directly. Legacy projects keep the flat fields
  // below and the renderer auto-composes them into the default block order.
  blocks?: Block[]

  // ── Legacy flat fields (auto-composed when `blocks` is absent) ─────────────
  summary?:      string
  problem?:      string
  architecture?: string
  archNodes?:    ArchNode[]
  archEdges?:    ArchEdge[]
  archScopes?:   ArchScope[]
  features?:     ProjectFeature[]
  codeTabs?:     CodeTab[]
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projects: Project[] = [
  {
    slug:    'nivo',
    index:   '01',
    title:   'Nivo',
    tagline: 'Enterprise B2B SaaS — offline-first POS, cascading pricing engine, and agentic AI orchestration.',

    role:     'Full-Stack Engineer',
    year:     '2025–26',
    industry: 'Retail Tech · B2B SaaS',
    // Carrusel hero con fade automático — muestra la escala del sistema
    heroImages: [
      '/images/projects/nivo/imageNivo1.png', // IMAGEN 1: Dashboard del Super Admin — panel de tenants, planes, métricas globales
      '/images/projects/nivo/imageNivo2.png', // IMAGEN 2: Dashboard del Tenant — ventas del día, inventario, sucursales
      '/images/projects/nivo/imageNivo3.png', // IMAGEN 3: Vista del POS en operación — ticket abierto con productos y métodos de pago
    ],

    summary:
      'Nivo is a Turborepo monorepo powering five apps — a NestJS API (190+ source files, 120+ REST endpoints), a Next.js 14 admin + POS, a customer-facing storefront, and two React Native mobile apps — all sharing 84 TypeORM entities across isolated PostgreSQL databases per tenant. I designed and built the database-per-tenant middleware with in-memory connection pooling (each tenant\'s DataSource is created once and reused for every request after), a 3-level cascading pricing engine that eliminates thousands of redundant price rows, an offline-first POS sync pipeline via Dexie.js, and Nibbit — an agentic AI assistant powered by Gemini with 14 function-calling tools that drafts purchase requisitions and supplier emails autonomously. Nivo began as my bootcamp capstone: a multi-tenant POS MVP I shipped in three weeks as backend lead and project manager of a team where I was the only trained developer. This monorepo is its second life — a ground-up solo rebuild, every commit mine, of what we used to call "the base of the system of our dreams".',

    stack: [
      'NestJS', 'TypeORM', 'PostgreSQL', 'Redis',
      'BullMQ', 'Stripe', 'Next.js 14', 'React Native',
      'Dexie.js', 'Socket.io', 'Turborepo', 'Docker',
      'Gemini AI', 'Function Calling',
    ],

    // ── The Challenge ──────────────────────────────────────────────────────
    problem:
      'Multi-branch shoe retail is one of the hardest inventory problems in physical commerce. Every product explodes into a matrix — size × color × branch — that quickly multiplies into hundreds of thousands of possible SKU combinations; franchises sharing one platform must never see each other\'s records; the counter cannot stop selling when the connection drops; and the final price of a single shoe depends on global landed-cost bases, per-branch cost overrides, and per-list margin exceptions — all under Mexico\'s strict CFDI electronic-invoicing rules. Nivo was built to hold that entire problem at once, end to end.',

    // ── Architecture ──────────────────────────────────────────────────────
    architecture:
      'Database-per-tenant pattern built on NestJS. A Master PostgreSQL database stores tenant records and Stripe subscriptions. On every request, a custom NestJS middleware extracts the subdomain (e.g. acme.nivo.app), queries the master DB to resolve the tenant, and hands a dedicated TypeORM DataSource for that tenant\'s isolated database to the request pipeline. Connections are pooled in-memory via a Map<string, DataSource>, so the cost of opening a tenant\'s connection is paid once — not on every request. Async workloads — tenant provisioning, low-stock alerts, invoice generation, report exports — are handled by BullMQ workers backed by Redis.',

    // Explicit col/row positions — layered flow diagram
    //
    //  Col:    0              1               2              3
    //  Row 0:  Client ──────► NestJS API ─ ─ ─ ─ ─ ─ ─ ─ ─► Redis
    //  Row 1:                 Tenant Resolver
    //  Row 2:  Master DB      Conn. Manager
    //          ┌──────── Tenant Isolated Scope ───────────────┐
    //  Row 3:  │ Nibbit AI                  Pricing Engine    │
    //  Row 4:  │              Tenant DB                       │
    //          └──────────────────────────────────────────────-┘
    //  Row 5:  Gemini API  (external, outside scope)
    archNodes: [
      { id: 'client',     label: 'Client',           sublabel: 'Browser / App',       type: 'client',   col: 0, row: 0 },
      { id: 'api',        label: 'NestJS API',        sublabel: 'acme.nivo.app',       type: 'gateway',  col: 1, row: 0 },
      { id: 'redis',      label: 'Redis',             sublabel: 'BullMQ · Sockets',    type: 'cache',    col: 3, row: 0 },
      { id: 'middleware',  label: 'Tenant Resolver',   sublabel: 'subdomain → db',      type: 'service',  col: 1, row: 1 },
      { id: 'masterdb',   label: 'Master DB',         sublabel: 'Tenants · Plans',     type: 'db',       col: 0, row: 2 },
      { id: 'connmgr',    label: 'Conn. Manager',     sublabel: 'DataSource Pool',     type: 'cache',    col: 1, row: 2 },
      // ── Tenant Isolated Scope ──────────────────────────────
      { id: 'aiagent',    label: 'Nibbit AI',         sublabel: 'Agentic · 14 Tools',  type: 'external', col: 0, row: 3 },
      { id: 'pricing',    label: 'Pricing Engine',    sublabel: 'Cascade Fallback',    type: 'service',  col: 2, row: 3 },
      { id: 'tenantdb',   label: 'Tenant DB',         sublabel: 'Isolated Postgres',   type: 'db',       col: 1, row: 4 },
      // ── External dependency ────────────────────────────────
      { id: 'gemini',     label: 'Gemini API',        sublabel: 'Google · External',   type: 'external', col: 0, row: 5 },
    ],

    archEdges: [
      // Connection pipeline (strict vertical flow)
      { from: 'client',     to: 'api',        label: 'HTTPS'          },
      { from: 'api',        to: 'middleware',  label: 'req pipeline'   },
      { from: 'middleware', to: 'masterdb',    label: 'resolve tenant' },
      { from: 'middleware', to: 'connmgr',     label: 'get / create'   },
      // Conn. Manager delivers the isolated DataSource to business services
      { from: 'connmgr',    to: 'aiagent',     label: 'injects DS',     dashed: true },
      { from: 'connmgr',    to: 'pricing',     label: 'injects DS'     },
      // Business services query the Tenant DB (the actual reads/writes)
      { from: 'aiagent',    to: 'tenantdb',    label: 'tool queries',   dashed: true },
      { from: 'pricing',    to: 'tenantdb',    label: 'cascade query'  },
      // External LLM — bidirectional: prompt → reasoning → function calls → results
      { from: 'aiagent',    to: 'gemini',      label: 'prompt ↔ tools', dashed: true, bidir: true },
      // Async jobs
      { from: 'api',        to: 'redis',       label: 'queues',         dashed: true },
    ],

    archScopes: [
      { label: 'Tenant Isolated Scope', nodeIds: ['aiagent', 'pricing', 'tenantdb'] },
    ],

    // ── Key Features ──────────────────────────────────────────────────────
    features: [
      {
        tag:         'Multi-Tenant · POS',
        title:       'Offline-First Point of Sale',
        description:
          'Every sale is written directly to IndexedDB via a Dexie.js database (NivoOfflineDB) using UUID primary keys, so the cashier never waits for a network round-trip. Pending sales are queued locally with a synced: false flag. When the browser fires the online event, a listener replays the entire queue via POST /sales/sync. The API processes each sale inside its own database transaction — validating stock, deducting inventory, creating payment records, and triggering async stock evaluation via setImmediate — then returns a per-item status report. UUID keys guarantee idempotency across offline and online sessions.',
        // IMAGEN: Captura de la interfaz del POS en acción — mostrando el ticket de venta con productos, tallas, colores, totales y los métodos de pago
        image: '/images/projects/nivo/imageNivo4.png',
      },
      {
        tag:         'Pricing · Engine',
        title:       'Cascading Fallback Pricing',
        description:
          'The PricingService.calculatePrice() method resolves the final sale price through a strict 3-level fallback cascade. Step 1 — Purchase Cost: reads branch_variant_overrides for a branch-specific cost; falls back to the variant\'s global cost field. Step 2 — Base Price: multiplies cost by (1 + landed_cost_%), where landed cost is resolved from branch_setting_overrides, then tenant_settings, then zero. Step 3 — Sale Price: multiplies the base by (1 + margin_%), where margin is resolved from variant_price_margins for a specific price list, then the price list\'s default_margin_percentage. This eliminates thousands of redundant price rows — only exceptions are stored.',
        // IMAGEN: Vista de la pantalla de configuración de listas de precios o la tabla de márgenes por variante mostrando los 3 niveles de cascada (costo global, override de sucursal, margen de lista)
        image: '/images/projects/nivo/imageNivo5.png',
      },
      {
        tag:         'Inventory · Matrix',
        title:       'Matrix Variant Generation',
        description:
          'The system models the physical world of footwear through a relational schema of size_groups (e.g. Men, Women, Kids), size_systems (MX, US, EU), and size_equivalencies that map each size across systems. Product variants store dynamic attributes as a JSONB column — { "Color": "Black", "Talla MX": "26" } — replacing rigid fixed columns. The frontend crosses active size groups with available colors to auto-generate the full Cartesian product of variants: a shoe in 3 colors and 12 sizes produces 36 SKUs with zero manual data entry, eliminating human error at cataloging time.',
        // IMAGEN: Captura del formulario de alta de producto mostrando la matriz de variantes generada automáticamente — la tabla de colores × tallas con los SKUs resultantes
        image: '/images/projects/nivo/imageNivo6.png',
      },
      {
        tag:         'AI · Agentic',
        title:       'Agentic AI with Human-in-the-Loop',
        description:
          'Nibbit is the platform\'s built-in AI agent, powered by Gemini (gemini-2.0-flash) via @google/generative-ai with 14 registered function declarations. Read-only tools query sales summaries, low-stock items, branch comparisons, and product catalogs by executing raw SQL against the tenant\'s isolated database. Mutation tools — draft_auto_requisition and draft_supplier_emails — scan inventory deficits, generate purchase requisition drafts, produce PDF attachments via Puppeteer, and compose supplier emails using a second Gemini call. Nibbit never executes final mutations: every draft is surfaced to the human administrator for review and approval before becoming a real Purchase Order.',
        // IMAGEN: Captura del chat de Nibbit en acción — mostrando una conversación donde el agente analiza inventario bajo, genera un borrador de requisición y muestra el botón de "Abrir Borrador"
        image: '/images/projects/nivo/imageNivo7.png',
      },
      {
        tag:         'Mobile · Edge',
        title:       'Omnichannel Native Ecosystem',
        description:
          'Two React Native / Expo Router apps operate as tenant-aware API clients sharing @nivo/types. The B2B app (mobile-b2b) transforms the device into a high-speed barcode scanner via expo-camera\'s CameraView — scanning EAN-13, UPC-A, and Code128 barcodes with haptic feedback (expo-haptics) for inventory audits, and tracks live delivery coordinates via expo-location\'s watchPositionAsync (high accuracy, 20 m interval) with proof-of-delivery photo capture. The B2C app (mobile-b2c) integrates @stripe/stripe-react-native for checkout, uses Haversine distance to auto-select the nearest pickup branch from the user\'s GPS position, and surfaces a loyalty ledger with tiered QR codes (Bronze → Silver → Gold → Wholesale) that auto-brighten the screen via expo-brightness for instant in-store scanning. Both apps use @tanstack/react-query for real-time cache consistency against the multi-tenant API.',
        layout: 'portrait',
        // Carrusel móvil con fade automático — muestra múltiples pantallas de las apps
        images: [
          '/images/projects/nivo/imageNivo8.png', // IMAGEN 1: Pantalla del escáner de códigos de barras en acción (B2B)
          '/images/projects/nivo/imageNivo9.png', // IMAGEN 2: Pantalla de checkout con Stripe y selección de sucursal (B2C)
          '/images/projects/nivo/imageNivo10.png', // IMAGEN 3: Pantalla de loyalty con QR code y tiers (B2C)
          '/images/projects/nivo/imageNivo11.png', // IMAGEN 4: Pantalla de loyalty con QR code y tiers (B2C)
        ],
      },
    ],

    // ── Code (tabbed viewer) ────────────────────────────────────────────
    codeTabs: [
      {
        filename: 'tenant.middleware.ts',
        language: 'typescript',
        caption:  'Resolves subdomain to an isolated TypeORM DataSource, pooled in-memory via Map<string, DataSource> — the connection cost is paid once per tenant, not per request.',
        code: `@Injectable()
export class TenantConnectionMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    private readonly connectionManager: TenantConnectionManager,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const subdomain = this.extractSubdomain(req);
    if (!subdomain) return next();

    // 1. Resolve tenant from master DB
    const tenant = await this.tenantRepo.findOne({
      where: { subdomain, is_active: true },
    });
    if (!tenant) throw new NotFoundException(\`Tenant "\${subdomain}" not found\`);

    // 2. Attach isolated DataSource to the request
    req.tenant = tenant;
    req.tenantConnection = await this.connectionManager.getConnection(
      tenant.database_name,
    );
    next();
  }

  private extractSubdomain(req: Request): string | null {
    const header = req.headers['x-tenant-id'] as string;
    if (header) return header;
    const parts = req.hostname.split('.');
    return parts.length >= 3 ? parts[0] : null;
  }
}`,
      },
      {
        filename: 'pricing.service.ts',
        language: 'typescript',
        caption:  'Three-level fallback cascade: branch cost override → tenant landed cost → price list margin. Only exceptions are stored — zero redundant rows.',
        code: `async calculatePrice(
  connection: DataSource,
  variantId: string,
  branchId: string,
  priceListId: string,
) {
  const variant = await connection.getRepository(ProductVariant)
    .findOne({ where: { id: variantId } });

  const priceList = await connection.getRepository(PriceList)
    .findOne({ where: { id: priceListId } });

  // Step 1 — Purchase cost: branch override ?? global variant cost
  const branchOverride = await connection.getRepository(BranchVariantOverride)
    .findOne({ where: { variant_id: variantId, branch_id: branchId } });

  const purchaseCost = branchOverride
    ? Number(branchOverride.purchase_price_override)
    : Number(variant.cost);

  // Step 2 — Base price: cost × (1 + landed_cost_%)
  // Landed cost: BranchSettingOverride → TenantSetting → 0
  const landedCost = await this.getEffectiveLandedCost(connection, branchId);
  const basePrice = purchaseCost * (1 + landedCost / 100);

  // Step 3 — Final price: base × (1 + margin_%)
  // Margin: VariantPriceMargin → PriceList.default_margin
  const customMargin = await connection.getRepository(VariantPriceMargin)
    .findOne({ where: { variant_id: variantId, price_list_id: priceListId } });

  const margin = customMargin
    ? Number(customMargin.custom_margin_percentage)
    : Number(priceList.default_margin_percentage);

  return {
    purchase_cost: purchaseCost,
    base_price: Math.round(basePrice * 100) / 100,
    final_price: Math.round(basePrice * (1 + margin / 100) * 100) / 100,
    has_branch_override: !!branchOverride,
    has_custom_margin: !!customMargin,
  };
}`,
      },
      {
        filename: 'nibbit.service.ts',
        language: 'typescript',
        caption:  'Agentic tool-calling loop: Gemini reasons → returns functionCall → Nibbit executes against isolated DB → feeds results back until the LLM emits a final text response.',
        code: `// Register 14 tools as Gemini function declarations
const tools = [{
  functionDeclarations: NIBBIT_TOOLS.map(t => ({
    name: t.name,
    description: t.description,
    parameters: {
      type: SchemaType.OBJECT,
      properties: convertProperties(t.input_schema.properties || {}),
      required: t.input_schema.required || [],
    },
  })),
}];

const model = this.genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: systemPrompt,
  tools,
});

const chat = model.startChat({ history });
let response = await chat.sendMessage(lastMessage);
let candidate = response.response.candidates?.[0];

// Agentic loop — execute tool calls until LLM emits final text
while (candidate) {
  const functionCalls = candidate.content?.parts
    ?.filter((p: Part) => 'functionCall' in p) || [];

  if (functionCalls.length === 0) break;

  const functionResponses: Part[] = [];
  for (const part of functionCalls) {
    const fc = (part as any).functionCall;
    // Execute tool against the tenant's isolated DataSource
    const result = await executeTool(connection, fc.name, fc.args, toolCtx);
    functionResponses.push({
      functionResponse: { name: fc.name, response: JSON.parse(result) },
    });
  }

  // Feed tool results back to the LLM for next reasoning step
  response = await chat.sendMessage(functionResponses);
  candidate = response.response.candidates?.[0];
}`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECT 02 — TallerUp (multi-repo SaaS — composable blocks)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug:    'tallerup',
    index:   '02',
    title:   'TallerUp',
    tagline: 'Workshop-management SaaS for franchising auto-repair shops — one Laravel API feeding an Angular advisor suite and an Ionic technician app.',

    role:     'Full-Stack Engineer',
    year:     '2025–26',
    industry: 'Automotive · SaaS · Franchising',

    // Color de marca de TallerUp (negro + amarillo/ámbar) — tiñe el glow atmosférico del hero
    accent:   '#F5B301',

    // Carrusel hero (landscape 3/2). TODO: reemplazar image404.avif por capturas reales.
    heroImages: [
      '/images/projects/image404.avif', // IMAGEN 1 (hero): el Wizard del Asesor en uso — la cara más vistosa de la web (paso Cotizar / Detalle con servicios y refacciones)
      '/images/projects/image404.avif', // IMAGEN 2 (hero): módulo de Refaccionaria/Precotizaciones — listado/creación de una nota de cotización
      '/images/projects/image404.avif', // IMAGEN 3 (hero): app móvil del técnico (Ionic) — pantalla de revisión con servicios clasificados por tipo
    ],

    stack: [
      'Laravel 10', 'PHP 8.1', 'MariaDB', 'Blade',
      'Angular 19', 'Angular Material', 'RxJS',
      'Ionic 8', 'Capacitor 7', 'SQLite', 'jsPDF', 'Vite',
    ],

    blocks: [
      // ── 01 · Executive Summary ──────────────────────────────────────────────
      {
        type: 'summary',
        body:
          'TallerUp is a production SaaS that runs the full day-to-day operation of franchising auto-repair shops, built as three repositories around a single API: a Laravel 10 / MariaDB backend, an Angular 19 web suite for advisors and parts staff, and an Ionic + Capacitor app for technicians on the shop floor. I joined late — the system was already months in and live — and over roughly seven months went from fixing and finishing inherited modules to leading a core refactor that turned a rigid, linear flow into one that models how a workshop actually works: a recursive tree of services and diagnostics. I own the parts-quoting, advisor wizard, manual-quote, support and payments modules end to end.',
      },

      // ── 02 · System Overview (multi-repo) ───────────────────────────────────
      {
        type: 'systemMap',
        title: 'System Overview',
        body:
          'A single Laravel API is the source of truth for two very different clients. Everything below shares one MariaDB schema that I reshaped from a flat layout into a hierarchical, versioned model.',
        repos: [
          { name: 'API-TallerUp',   role: 'Central REST API · server-side PDF · source of truth', stack: ['Laravel 10', 'PHP 8.1', 'MariaDB', 'Blade'],            accent: 'green' },
          { name: 'TallerUp · web', role: 'Advisor, parts & admin suite',                          stack: ['Angular 19', 'Material', 'FullCalendar', 'jsPDF'],       accent: 'plain' },
          { name: 'tallerup-movil', role: 'On-floor technician app',                               stack: ['Ionic 8', 'Capacitor 7', 'SQLite', 'Camera'],            accent: 'plain' },
        ],
      },

      // ── 03 · The Challenge ──────────────────────────────────────────────────
      {
        type: 'challenge',
        body:
          'The shop wanted to retire a process built on Excel templates for quotes and final invoices — but the real problem was not the format, it was the flow. The software was strictly linear; the workshop is recursive. A car comes in for a main service; the technician recommends extra services and requests parts; among them he may suggest a diagnostic — and a diagnostic spawns new services and new diagnostics, which spawn more, as deep as the job requires. The parts clerk quotes each part (original, generic, aftermarket); the advisor negotiates with the customer and approves partially, totally, or in a mix. The inherited structure supported none of that recursion, tolerated human error poorly, and forced corrections to be made by hand directly in the production database.',
      },

      // ── 04 · Evolution (timeline) ───────────────────────────────────────────
      {
        type: 'timeline',
        title: 'Evolution',
        phases: [
          {
            label: 'Parts module, reborn',
            date:  'Aug–Oct 2025',
            tag:   'Refaccionaria',
            body:  'Rebuilt the parts-clerk pre-quote module: brand identity, tabbed forms, part-number autocomplete, packages, and mixed quotes — wiring it cleanly into the advisor flow.',
          },
          {
            label: 'Advisor flow & Final Note',
            date:  'Oct 2025',
            tag:   'Asesor',
            body:  'Closed the advisor’s first complete flow (approve partial / total, reject) and designed the Final Note PDF from scratch with a corporate refresh — Blade templates rewritten into a dynamic, reusable note engine.',
          },
          {
            label: 'Manual Quotes & Payments',
            date:  'Oct–Nov 2025',
            tag:   'New modules',
            body:  'Shipped Manual Quotes — quoting without an appointment or work order, the Excel killer, now persisted and searchable — and a full Payments module: multiple methods, partial payments, printable receipts, automatic order status.',
          },
          {
            label: 'Hierarchical refactor',
            date:  'Nov 2025',
            tag:   'Schema',
            body:  'Restructured pre-quotes from a flat schema into a hierarchical, service-based model and added profit-margin pricing — the groundwork for everything that followed.',
          },
          {
            label: 'Support module',
            date:  'Jan–Feb 2026',
            tag:   'Soporte',
            body:  'Built the Support module so advisors could do what previously required raw DB edits: reopen orders, add services / diagnostics / parts, attach before-and-after evidence, all with user-level audit traceability.',
          },
          {
            label: 'The Advisor Wizard',
            date:  'Feb–Mar 2026',
            tag:   'Core refactor',
            body:  'The centerpiece: replaced the overloaded advisor screen with a guided wizard backed by new normalized tables (final notes, quotes, cost modes). Unlimited, fully versioned notes; inline parts quoting by type; granular and total discounts.',
          },
          {
            label: 'Recursive operation',
            date:  'Mar 2026',
            tag:   'Core',
            body:  'With the core reshaped, services and diagnostics can finally be added at any time and nest recursively — matching real operation, and unblocking the loyalty and quality-call modules the team built on top. Same month: the appointments calendar went from freezing the browser (triple fetch, O(N) re-renders) to a single ranged, cached request.',
          },
          {
            label: 'The handover refactor',
            date:  'Jun–Jul 2026',
            tag:   'Ongoing',
            body:  'My parting deliverable, built on the snapshot I was authorized to keep: the API re-architected into layers (controllers → services → queries) with tests and Sanctum auth, and the Angular services regrouped by domain to mirror it — handed over for the team to adopt at their own pace.',
          },
        ],
      },

      // ── 05 · Before / After ─────────────────────────────────────────────────
      {
        type: 'beforeAfter',
        title: 'Before / After',
        intro: 'What the refactor changed, in concrete terms.',
        rows: [
          {
            label:  'Operation flow',
            before: 'Linear, single-pass — services and diagnostics could not be added once the order moved on.',
            after:  'Recursive tree — a diagnostic spawns services and more diagnostics, at any depth, at any time.',
          },
          {
            label:  'Parts quoting',
            before: 'Up to three separate notes (original / generic / aftermarket) — confusing and error-prone.',
            after:  'A single note; the advisor composes the mix (partial / total / mixed) in the wizard.',
          },
          {
            label:  'Quote versions',
            before: 'Capped at ~4 editable notes; reverting meant re-editing from memory.',
            after:  'Unlimited and fully versioned — any version can be branched into a new one; full history kept.',
          },
          {
            label:  'Corrections',
            before: 'Made by hand, directly in the production database.',
            after:  'Self-service in the Support module, with user-level audit trails.',
          },
          {
            label:  'Quotes & invoices',
            before: 'Excel templates, scattered across computers, no persistence.',
            after:  'Centralized, searchable, downloadable PDFs — manual quotes even without a work order.',
          },
          {
            label:  'Backend changes',
            before: 'Schema or flow changes rippled straight into the Angular suite.',
            after:  'Shipped behind stable controller facades — the frontend often needed zero changes.',
          },
        ],
      },

      // ── 06 · Architecture ───────────────────────────────────────────────────
      {
        type: 'architecture',
        body:
          'The API is a Laravel 10 monolith with domain-oriented controllers over MariaDB, serving REST to both clients; quotes and notes are rendered server-side as PDFs via Blade. The decisive change was the data model: it evolved from a flat layout into a hierarchical, versioned one — services own parts, parts roll up into quotes, quotes freeze into final notes — with a link from diagnostics back to new services so the service / diagnostic tree can grow without bound.',
        diagrams: [
          {
            nodes: [
              { id: 'mobile', label: 'Technician',        sublabel: 'Ionic app',          type: 'client',  col: 0, row: 0 },
              { id: 'web',    label: 'Advisor · Parts',   sublabel: 'Angular suite',      type: 'client',  col: 0, row: 1 },
              { id: 'api',    label: 'Laravel API',       sublabel: 'REST · controllers', type: 'gateway', col: 1, row: 0 },
              { id: 'pdf',    label: 'PDF Engine',        sublabel: 'Blade notes',        type: 'service', col: 1, row: 1 },
              { id: 'core',   label: 'Service ↔ Diag.',   sublabel: 'recursive tree',     type: 'service', col: 2, row: 0 },
              { id: 'db',     label: 'MariaDB',           sublabel: 'hierarchical schema', type: 'db',     col: 2, row: 1 },
            ],
            edges: [
              { from: 'mobile', to: 'api',  label: 'REST'        },
              { from: 'web',    to: 'api',  label: 'REST'        },
              { from: 'api',    to: 'pdf',  label: 'render',  dashed: true },
              { from: 'api',    to: 'core', label: 'orchestrates' },
              { from: 'core',   to: 'db',   label: 'nested svc/diag', bidir: true },
            ],
            scopes: [
              { label: 'Hierarchical core (the refactor)', nodeIds: ['core', 'db'] },
            ],
          },
        ],
      },

      // ── 07 · Key Features ───────────────────────────────────────────────────
      {
        type: 'features',
        items: [
          {
            tag:         'Core · Refactor',
            title:       'From Linear to Recursive',
            // IMAGEN: la orden de servicio con su árbol expandido — servicios → diagnósticos → servicios anidados (la vista que evidencia la recursividad del flujo)
            image:       '/images/projects/image404.avif',
            description: 'The old schema modeled a straight line: main service → parts → one note. Real jobs branch. I reshaped the quoting-and-notes core and wired the existing service–diagnostic links into a flow that finally works end to end: a diagnostic can spawn new services and new diagnostics, recursively, and services and parts can be added to an order at any point in its life. This is what unblocked manual corrections, mid-job up-sells, and the downstream loyalty and quality-call flows the team built on top.',
          },
          {
            tag:         'Advisor · Wizard',
            title:       'The Advisor Wizard',
            // IMAGEN: un paso del wizard del asesor (p.ej. el paso "Cotizar") mostrando notas versionadas, autorización parcial/total/mixta y la cotización inline de refacciones por tipo
            image:       '/images/projects/image404.avif',
            description: 'The advisor screen had grown into an unreadable wall of buttons. I replaced it with a guided wizard: create and version notes without limit, branch any past version into a new one (full history preserved), approve parts partially / totally / mixed, quote parts inline by type, and apply per-service or whole-note discounts with correct IVA handling.',
          },
          {
            tag:         'Operations · Support',
            title:       'Self-Service Support Module',
            // IMAGEN: el panel del módulo de Soporte con sus acciones (reabrir orden, agregar servicios/refacciones, cargar evidencias antes/después) y el registro de auditoría por usuario
            image:       '/images/projects/image404.avif',
            description: 'Created to replace the “edit the database by hand” workflow. Advisors can reopen orders, add or swap services, add parts, change an order’s main service, upload before / after photo evidence with safe server-side image processing, and delete a final note — every action written to an audit log with the user who performed it.',
          },
          {
            tag:         'Quotes · Persistence',
            title:       'Manual Quotes — the Excel Killer',
            // IMAGEN: el módulo de Cotización Manual — formulario/listado de una cotización creada sin orden de servicio, idealmente con el PDF descargable visible
            image:       '/images/projects/image404.avif',
            description: 'A full CRUD module to produce a quote — or a final note — with no appointment and no work order behind it, for the cases the rigid flow could not express. IVA toggle, soft-delete, conversion into a final note, and payment generation straight from the quote. Everything is centralized, searchable and downloadable as PDF.',
          },
          {
            tag:         'Payments',
            title:       'Payments & Receipts',
            // IMAGEN: el módulo de Cobros — registro de un pago con múltiples métodos y/o el ticket de cobro imprimible
            image:       '/images/projects/image404.avif',
            description: 'An end-to-end payments module: multiple payment methods, partial payments tracked against an order, a printable cobro ticket, and automatic promotion of the order status once the balance is settled — backed by dedicated tables for payments, methods and statuses.',
          },
          {
            tag:         'Mobile · Technician',
            title:       'Classified Services & Safety Semaphore',
            // IMAGEN (vertical/celular): pantalla de la app móvil del técnico (Ionic) — la lista de servicios agrupados por clasificación y los puntos de seguridad tipo semáforo
            layout:      'portrait',
            image:       '/images/projects/image404.avif',
            description: 'For the technician app (TallerUp Móvil V2) I built the API that serves services grouped and ordered by classification — main, additional, diagnostics — instead of one flat list, plus traffic-light style safety-point fields, so marking each inspection point feels natural on the shop floor.',
          },
        ],
      },

      // ── 08 · Impact ─────────────────────────────────────────────────────────
      {
        type: 'metrics',
        title: 'Impact',
        items: [
          { value: '3 → 1',   label: 'Parts Notes per Quote', sub: 'The wizard collapses original / generic / aftermarket quoting into one master note' },
          { value: '~4 → ∞',  label: 'Note Versions',         sub: 'From destructive edits on a capped set to unlimited, branchable history' },
          { value: '1 fetch', label: 'Calendar Load',         sub: 'A browser-freezing triple-fetch with O(N) re-renders became a single ranged, cached request' },
          { value: '191',     label: 'Commits · 9 Modules',   sub: 'Aug 2025 – Mar 2026, shipped continuously on a live production system' },
        ],
      },

      // ── 09 · Implementation ─────────────────────────────────────────────────
      {
        type: 'code',
        title: 'Implementation',
        tabs: [
          {
            filename: 'calculos-nota.ts',
            language: 'typescript',
            caption:  'Wizard engine — collapses the legacy three parts-notes (original / generic / aftermarket) into ONE master note: a single-pass fold of labour + selected parts, then a granular per-service discount layer, then a global discount, all resolved against the correct IVA base.',
            code: `const IVA_RATE = 0.16;
const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Collapses what used to be three separate parts notes (original / generic /
 * aftermarket) into ONE master note: every line is summed in a single pass,
 * per-service discounts are applied, then a global discount, then the IVA base.
 */
export function calcularResumen(
  orden: OrdenInfo,
  servicios: ServicioUnificado[],
  comodin: { activo: boolean; monto: number },
  general: { activo: boolean; esFijo: boolean; cantidad: number; porcentaje: number },
  descuentos: DescuentoServicio[],
): ResumenCalculado {
  // Principal price net of IVA: with a global discount we start from the pre-promo
  // base so the discount lands on it; otherwise we keep the promo price already
  // applied. (+value coerces the string decimals Laravel emits in JSON.)
  const principal = general.activo
    ? +(orden.n_precio_servicio_sin_descuento || 0) || +orden.total_servicio_principal / (1 + IVA_RATE)
    : +(orden.n_precio_servicio_con_descuento || 0) || +orden.total_servicio_principal / (1 + IVA_RATE);

  // Fold every additional line (labour + selected parts) in one pass.
  const { manoObra, refacciones } = servicios.reduce(
    (acc, s) => ({
      manoObra:    acc.manoObra    + (s.n_costo_mano_obra_editable ?? s.costo_mano_obra),
      refacciones: acc.refacciones + (s.subtotal_refacciones_seleccionadas ?? 0),
    }),
    { manoObra: 0, refacciones: 0 },
  );

  let neto = principal + manoObra + refacciones + (comodin.activo ? comodin.monto : 0);

  // Per-service discounts (principal included): each against its own base.
  const descServicios = descuentos.reduce(
    (sum, d) => sum + (d.esFijo ? d.monto : (d.totalServicio * d.porcentaje) / 100),
    0,
  );
  neto -= descServicios;

  // Global discount over the running net subtotal.
  const descGeneral = !general.activo ? 0
    : general.esFijo ? general.cantidad
    : (neto * general.porcentaje) / 100;
  neto -= descGeneral;

  const iva = neto * IVA_RATE;
  return {
    subtotal_servicio_principal:    round2(principal),
    subtotal_servicios_adicionales: round2(manoObra),
    subtotal_refacciones:           round2(refacciones),
    descuento_adicional_total:      round2(descServicios),
    descuento_general_total:        round2(descGeneral),
    subtotal_neto:                  round2(neto),
    iva:                            round2(iva),
    total:                          round2(neto + iva),
  };
}`,
          },
          {
            filename: 'SoporteService.php',
            language: 'php',
            caption:  'Support module (excerpt) — what used to be a raw edit in the production database is now a transactional, audited operation: attaching a new diagnostic to a live order after inspection. The parts log, the safety-point revision update and the new tree node (priced on the spot) commit or roll back as one; every Support action lands in the audit log with the acting user.',
            code: `public function agregarServicioDiagnostico(Request $request, $id_orden_servicio)
{
    try {
        $resultado = DB::transaction(function () use ($request, $id_orden_servicio) {

            // Parts the technician asked for → logged against the revision.
            foreach ($request->refacciones as $refaccionData) {
                $nuevaBitacora = new ServicioRefaccionBitacora();
                $nuevaBitacora->id_servicio_revision = $request->id_servicio_revision;
                $nuevaBitacora->id_orden_servicio    = $id_orden_servicio;
                $nuevaBitacora->s_refaccion          = $refaccionData['s_refaccion'];
                $nuevaBitacora->n_cantidad           = $refaccionData['n_cantidad'];
                $nuevaBitacora->save();
            }

            // The safety-point revision this diagnostic hangs from.
            $revision = DB::table('tw_revisiones')
                ->where('id_orden_servicio', $id_orden_servicio)
                ->where('id_punto_seguridad', $request->id_punto_seguridad)
                ->select('id_revision')
                ->first();

            if (!$revision) {
                throw new \\Exception(self::MSG_REVISION_NO_ENCONTRADA);
            }

            DB::table('tw_revisiones')
                ->where('id_revision', $revision->id_revision)
                ->update([
                    'id_estatus_revision'    => 3,
                    'id_comentario_generico' => 3,
                ]);

            // The new node of the service ↔ diagnostic tree, priced on the spot.
            $nuevoSugerido = new DiagnosticoSugerido();
            $nuevoSugerido->id_revision                  = $revision->id_revision;
            $nuevoSugerido->id_orden_servicio            = $id_orden_servicio;
            $nuevoSugerido->id_estatus_servicio_sugerido = 2;
            $nuevoSugerido->id_servicio_revision         = $request->id_servicio_revision;
            $nuevoSugerido->b_requiere_refaccion         = count($request->refacciones) > 0 ? 1 : 0;
            $nuevoSugerido->b_cotizado_refaccionaria     = 0;
            $nuevoSugerido->n_duracion_horas             = $request->n_duracion_horas;

            [$modoCosto, $precioCotizado] = $this->modoCostoPrecio(
                $request->id_servicio_revision,
                $request->n_duracion_horas,
            );
            $nuevoSugerido->n_ultimo_precio_cotizado = $precioCotizado;
            $nuevoSugerido->id_modo_costo_servicio   = $modoCosto;
            $nuevoSugerido->save();

            return [
                'id_servicio_sugerido'    => $nuevoSugerido->id_diagnostico_sugerido,
                'id_revision_actualizada' => $revision->id_revision,
            ];
        });

        // Every Support action is audited with the acting user.
        auditar($request->id_usuario, 'soporte', 'agregar_servicio_diagnostico', null,
            json_encode([
                'id_orden_servicio'    => $id_orden_servicio,
                'id_servicio_revision' => $request->id_servicio_revision,
                'resultado'            => $resultado,
            ]), false);

        return response()->json([
            'status'  => 'success',
            'code'    => 201,
            'message' => 'Diagnostico sugerido agregado correctamente post-revisión.',
            'data'    => $resultado,
        ], 201);

    } catch (\\Exception $e) {
        $codigo = $e->getMessage() === self::MSG_REVISION_NO_ENCONTRADA ? 404 : 500;

        return response()->json([
            'status'  => 'error',
            'code'    => $codigo,
            'message' => 'No se pudo agregar el diagnostico sugerido.',
            'error'   => $e->getMessage(),
        ], $codigo);
    }
}`,
          },
          {
            filename: 'calendario.component.ts',
            language: 'typescript',
            caption:  'Performance — the calendar paginates by visible range and memoizes each range in memory (zero HTTP on revisits); a single batched addEventSource replaces N addEvent calls. This removed the triple-fetch and the O(n) re-render that froze the browser.',
            code: `private readonly cache = new Map<string, EventInput[]>();
private currentRangeKey = '';

/**
 * Before: every navigation re-fetched ALL appointments and replayed them with N
 * individual addEvent() calls — a triple-fetch + O(n) re-render that froze the UI.
 * After: FullCalendar's datesSet drives range pagination; results are memoized per
 * visible range and a single addEventSource() commits them in one paint.
 */
handleDatesSet({ start, end }: DatesSetArg): void {
  const from = start.toISOString().slice(0, 10);
  const to   = new Date(end.getTime() - 86400000).toISOString().slice(0, 10);
  const key  = \`\${from}_\${to}\`;
  this.currentRangeKey = key;

  const cached = this.cache.get(key);
  if (cached) return this.render(cached);            // cache hit → zero HTTP

  this.citasService.getCitas('', from, to).subscribe({
    next: ({ data = [] }) => {
      const events = data.map((c: citasModel) => this.toEvent(c));
      this.cache.set(key, events);
      this.render(events);
    },
    error: (err) => console.error('Error al obtener citas:', err),
  });
}

/** One batched commit: clear + single source = a single re-render, not N. */
private render(events: EventInput[]): void {
  const api = this.calendarComponent?.getApi();
  if (!api) return;
  api.removeAllEvents();
  api.addEventSource(events);
}`,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECT 03 — VagXpress (auto-parts ERP — composable blocks)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug:    'vagxpress',
    index:   '03',
    title:   'VagXpress',
    tagline: 'Auto-parts retail ERP — POS, a transitive parts-equivalence engine, event-driven auto-replenishment, and a universal-by-default vehicle-fitment rules engine.',

    role:     'Full-Stack Engineer',
    year:     '2025–26',
    industry: 'Auto Parts · Retail ERP',

    // Color de marca de VagXpress (rojo sobre negro) — tiñe el glow atmosférico del hero
    accent:   '#E31E24',

    // Carrusel hero (landscape 3/2). TODO: reemplazar image404.avif por capturas reales.
    heroImages: [
      '/images/projects/image404.avif', // IMAGEN 1 (hero): el Punto de Venta en operación — carrito, búsqueda con autofocus, niveles de utilidad P1–P4
      '/images/projects/image404.avif', // IMAGEN 2 (hero): catálogo de refacciones mostrando un grupo de equivalencias / el Constructor de Reglas de compatibilidad
      '/images/projects/image404.avif', // IMAGEN 3 (hero): módulo de Compras — requisición automática con la alerta de "mejor precio" por proveedor
    ],

    stack: [
      'Laravel 10', 'PHP 8.1', 'MySQL', 'Sanctum',
      'Angular 19', 'Angular Material', 'RxJS',
      'ngx-datatable', 'ApexCharts', 'zxing',
    ],

    blocks: [
      // ── 01 · Executive Summary ──────────────────────────────────────────────
      {
        type: 'summary',
        body:
          'VagXpress is the ERP that runs an auto-parts retailer end to end — point of sale, a complex inventory of interchangeable parts, customer credit, and supplier procurement — built on a single Laravel 10 / MySQL API and an Angular 19 panel. It is a team platform, and I architected and built its commercial and supply-chain core in the project’s first months, before the team expanded to the last-mile logistics modules: I own the inventory, parts-equivalence, POS, pricing, credit and procurement domains end to end. Three problems that look like CRUD but are not anchor the work — a transitive parts-equivalence engine, event-driven automatic replenishment, and a universal-by-default vehicle-fitment rules engine.',
      },

      // ── 02 · System Overview (multi-repo) ───────────────────────────────────
      {
        type: 'systemMap',
        title: 'System Overview',
        body:
          'A single Laravel API (token auth via Sanctum) is the source of truth for two clients: a web panel for the counter and back office, and a driver app for last-mile delivery. I architected and own the API’s commercial and inventory core and the Angular modules that consume it; the mobile delivery app and its Movil/* endpoints were built by the team on top of that API.',
        repos: [
          { name: 'VagXpress API',    role: 'Central REST API · inventory, POS, procurement · source of truth', stack: ['Laravel 10', 'PHP 8.1', 'MySQL', 'Sanctum'],          accent: 'green' },
          { name: 'VagXpress Web',    role: 'Counter & back-office panel — POS, catalog, purchasing, credit',   stack: ['Angular 19', 'Material', 'ngx-datatable', 'zxing'],   accent: 'plain' },
          { name: 'VagXpress Mobile', role: 'Driver app — route assignments, shipments & proof-of-delivery',    stack: ['Ionic 8', 'Capacitor 7', 'Geolocation', 'Camera'],   accent: 'plain' },
        ],
      },

      // ── 03 · The Challenge ──────────────────────────────────────────────────
      {
        type: 'challenge',
        body:
          'The shop ran on SICAR, a generic POS that could not express the realities of auto parts. Every manufacturer and every distributor uses a different part number for the same physical piece, so to mark seven interchangeable parts as equivalent a clerk had to type the other six part numbers into each part’s description — 42 brittle, one-directional annotations. There was no way to model which vehicles a part fits, so staff looked up fitment on the internet, found a part number, and only then searched SICAR for stock and price. Inventory never reacted to sales on its own, and purchase requisitions were written by hand. The real challenge was to model interchangeability and vehicle fitment without a combinatorial explosion of data — and to make stock replenish itself.',
      },

      // ── 04 · Evolution (timeline) ───────────────────────────────────────────
      {
        type: 'timeline',
        title: 'Evolution',
        phases: [
          {
            label: 'Foundations, solo',
            date:  'Sep 2025',
            tag:   'Core',
            body:  'First commits of the project: the full inventory-and-permissions schema, the parts CRUD, and the transitive equivalence engine — the data-model decisions everything else stands on.',
          },
          {
            label: 'The commercial core',
            date:  'Sep–Dec 2025',
            tag:   'Solo',
            body:  'Vehicle-fitment rules engine, tiered utility margins (P1–P4) and the first version of the scan-optimized POS — still a one-person codebase: the team reviewed via PRs while I built the operation’s spine.',
          },
          {
            label: 'Team scale-out',
            date:  'Dec 2025 →',
            tag:   'Team',
            body:  'With the commercial core stable, the team joined and built last-mile logistics (shipments, routes, driver app) on top of the API — new domains, no changes required to the core.',
          },
          {
            label: 'The layered rewrite',
            date:  'Jul 2026',
            tag:   'Ongoing',
            body:  'On the snapshot I was authorized to keep: the backend rewritten into layers (controllers → services · form requests · tests) and the schema consolidated — including a faithful rebuild of the fitment engine whose original branch was lost.',
          },
        ],
      },

      // ── 05 · Before / After ─────────────────────────────────────────────────
      {
        type: 'beforeAfter',
        title: 'Before / After',
        intro: 'Four workflows the old system (SICAR) could not express.',
        rows: [
          {
            label:  'Parts equivalence',
            before: 'To link 7 interchangeable parts, each part’s description listed the other 6 part numbers — 42 manual, one-directional notes.',
            after:  'Each part joins one equivalence group; membership makes all members mutually equivalent by transitivity. Register once.',
          },
          {
            label:  'Vehicle fitment',
            before: 'No fitment model — staff googled the part, found a number, then searched for stock and price by hand.',
            after:  'Universal-by-default rules: tag a part with marca / modelo / generación / motor; a rule with no conditions is universal.',
          },
          {
            label:  'Replenishment',
            before: 'Stock never reacted to sales; purchase requisitions were written by hand.',
            after:  'A sale emits an event; a listener rebuilds an idempotent requisition, suggesting max − current stock.',
          },
          {
            label:  'Supplier choice',
            before: 'One fixed supplier per part, with no visibility of cheaper options.',
            after:  'Every supplier’s last cost is compared; the system flags the savings and splits one purchase order per supplier.',
          },
        ],
      },

      // ── 06 · Architecture ───────────────────────────────────────────────────
      {
        type: 'architecture',
        body:
          'The API is a Laravel 10 monolith over MySQL with token auth via Sanctum, serving REST to the Angular panel and a team-built mobile app. The supply chain is event-driven: a POS sale deducts stock and dispatches VerificarStockBajo, and a listener rebuilds an idempotent purchase requisition. Interchangeability is modeled as graph components — parts join an equivalence group instead of linking pairwise — and vehicle fitment as a rules engine that is universal by default until constrained by marca / modelo / generación / motor.',
        diagrams: [
          {
            nodes: [
              { id: 'web',      label: 'Web Panel',        sublabel: 'Angular',            type: 'client',  col: 0, row: 0 },
              { id: 'mobile',   label: 'Logistics App',    sublabel: 'team · mobile',      type: 'client',  col: 0, row: 1 },
              { id: 'api',      label: 'Laravel API',      sublabel: 'REST · Sanctum',     type: 'gateway', col: 1, row: 0 },
              { id: 'sale',     label: 'POS Sale',         sublabel: 'deducts stock',      type: 'service', col: 1, row: 1 },
              { id: 'po',       label: 'Purchase Orders',  sublabel: 'best price / supplier', type: 'service', col: 2, row: 0 },
              { id: 'listener', label: 'Auto-Requisition', sublabel: 'idempotent listener', type: 'service', col: 2, row: 1 },
              { id: 'db',       label: 'MySQL',            sublabel: 'inventory · equivalences', type: 'db',  col: 3, row: 1 },
            ],
            edges: [
              { from: 'web',      to: 'api',      label: 'REST'       },
              { from: 'mobile',   to: 'api',      label: 'REST'       },
              { from: 'api',      to: 'sale',     label: 'checkout'   },
              { from: 'sale',     to: 'listener', label: 'event'      },
              { from: 'listener', to: 'po',       label: 'feeds', dashed: true },
              { from: 'listener', to: 'db',       label: 'requisition' },
              { from: 'po',       to: 'db',       label: 'orders'     },
            ],
            scopes: [
              { label: 'Event-driven replenishment', nodeIds: ['sale', 'listener', 'po'] },
            ],
          },
        ],
      },

      // ── 07 · Key Features ───────────────────────────────────────────────────
      {
        type: 'features',
        items: [
          {
            tag:         'Inventory · Graph',
            title:       'Transitive Parts Equivalence',
            // IMAGEN: el catálogo o el detalle de una refacción mostrando su grupo de equivalencias (las piezas intercambiables) y la clase (original / genérica / funcional, con color)
            image:       '/images/projects/image404.avif',
            description: 'Auto parts are interchangeable in families: seven part numbers from seven brands can be the same physical piece. Instead of linking them pairwise, I model each family as a group — a part joins the group and is instantly equivalent to every other member (transitivity). Creating a part detects whether the chosen equivalents already form a group, refuses to merge conflicting groups, and cleans up orphaned ones. Each part also carries every identifier it needs (internal code, SKU, QR, ACES) and every supplier keeps their own part number, so the catalog speaks all the dialects of a single piece.',
          },
          {
            tag:         'Supply Chain · Events',
            title:       'Event-Driven Auto-Replenishment',
            // IMAGEN: el módulo de Compras — una requisición automática generada por una venta, con la alerta de "mejor precio" y el ahorro por unidad, lista para dividirse en órdenes de compra por proveedor
            image:       '/images/projects/image404.avif',
            description: 'Inventory replenishes itself. Every POS sale deducts stock and dispatches a VerificarStockBajo event; a listener filters the parts that fell to their minimum and rebuilds an open, automated requisition idempotently — suggesting exactly max − current stock, never creating duplicates. When the buyer turns that requisition into purchase orders, the system compares every supplier’s last cost, flags the cheaper option with its per-unit savings, and splits the result into one purchase order per supplier (with PDF).',
          },
          {
            tag:         'Catalog · Rules Engine',
            title:       'Universal-by-Default Vehicle Fitment',
            // IMAGEN: el "Constructor de Reglas" — multi-select en cascada de marca/modelo/generación/motor con el resumen en vivo ("Compatible con: Ford Lobo o Chevrolet Silverado…"); o la búsqueda por vehículo en el POS
            image:       '/images/projects/image404.avif',
            description: 'Knowing which cars a part fits would explode into a giant tag matrix if modeled naïvely. Instead, a part is universal until you add rules. A rule is a single card that combines multi-selected brands, models, generations (year ranges) and engines — and a rule with no conditions is, by definition, universal and stores zero rows. The matching engine answers "what fits this car?" with one correlated query per supplied dimension; a "Rule Builder" authors the rules and the POS searches parts straight from a vehicle.',
          },
          {
            tag:         'POS · Counter',
            title:       'Scan-Optimized Point of Sale',
            // IMAGEN: el Punto de Venta en operación — barra de búsqueda con autofocus, carrito, selección de niveles de utilidad P1–P4 y el diálogo de procesar venta con métodos de pago
            image:       '/images/projects/image404.avif',
            description: 'The counter is built for speed. The search bar keeps autofocus and the component distinguishes a barcode scanner from manual typing by the time between keystrokes (a 100 ms threshold), so a scan adds straight to the cart. When the requested part is out of stock, the counter surfaces its equivalence family — original, generic and functional alternatives — so the sale is saved instead of lost. The cart applies tiered utility margins (P1–P4) over a base price, respects a minimum authorized price as a negotiation floor, and the checkout handles multiple payment methods, bank accounts, and customer credit with running balances and payments.',
          },
        ],
      },

      // ── 08 · Impact ─────────────────────────────────────────────────────────
      {
        type: 'metrics',
        title: 'Impact',
        items: [
          { value: 'O(1)', label: 'Add part to a family', sub: 'One group join propagates interchangeability to all members (transitivity)' },
          { value: '0',    label: 'Manual reorders',      sub: 'A POS sale triggers an idempotent auto-requisition (suggest = max − stock)' },
          { value: '∞',    label: 'Fitment per rule',     sub: 'A rule with zero conditions matches any vehicle — no fitment matrix to store' },
          { value: '1:N',  label: 'Requisition → orders', sub: 'Best price flagged per part; one purchase order generated per supplier' },
        ],
      },

      // ── 09 · Implementation ─────────────────────────────────────────────────
      {
        type: 'code',
        title: 'Implementation',
        tabs: [
          {
            filename: 'RefaccionService.php',
            language: 'php',
            caption:  'Interchangeability as graph components — a new part joins the group its equivalents already share (or seeds a new one), so the whole family becomes mutually equivalent through a single membership instead of 42 pairwise notes.',
            code: `// Link a new part into an equivalence family. Parts don't link pairwise;
// they join a group, so membership = mutual interchangeability (transitivity).
$grupos = DB::table('tr_refacciones_equivalencias')
    ->whereIn('id_refaccion', $equivalentes)
    ->where('b_activo', 1)
    ->distinct()
    ->pluck('id_equivalencia');

if ($grupos->count() > 1) {
    throw new \\Exception('Las refacciones equivalentes pertenecen a grupos distintos.');
}

if ($grupos->count() === 1) {
    // Join the existing family — one row, now equivalent to every member.
    DB::table('tr_refacciones_equivalencias')->insert([
        'id_refaccion' => $idRefaccion, 'id_equivalencia' => $grupos->first(), 'b_activo' => 1,
    ]);
} else {
    // No family yet: seed the group and attach every member at once.
    $idGrupo = DB::table('tw_equivalencias')->insertGetId([
        's_nombre_equivalencia' => 'Equivalencia ' . now()->format('YmdHis'), 'b_activo' => 1,
    ]);
    foreach (array_merge($equivalentes, [$idRefaccion]) as $id) {
        DB::table('tr_refacciones_equivalencias')->insert([
            'id_refaccion' => $id, 'id_equivalencia' => $idGrupo, 'b_activo' => 1,
        ]);
    }
}`,
          },
          {
            filename: 'GenerarRequisicionAutomatica.php',
            language: 'php',
            caption:  'Inventory replenishes itself: a sale emits VerificarStockBajo; this listener rebuilds an open requisition idempotently (firstOrCreate / updateOrCreate), suggesting max − current stock — no duplicate requisitions, no manual reorder.',
            code: `// Fired by the VerificarStockBajo event that every POS sale emits.
public function handle(VerificarStockBajo $event): void
{
    $bajas = Refaccion::whereIn('id_refaccion', $event->idsRefacciones)->get()
        ->filter(fn ($r) => $r->n_stock_actual <= ($r->n_stock_minimo ?? 0));

    if ($bajas->isEmpty()) return;

    // Idempotent: reuse the open automated requisition or create it once.
    $requisicion = Requisicion::firstOrCreate(
        ['id_estatus_requisicion' => 1, 'id_tipo_requisicion' => 1, 'b_activo' => 1],
        ['id_usuario_crea' => $event->idUsuario, 'd_fecha_solicitud' => now()],
    );

    foreach ($bajas as $r) {
        $sugerida = max(1, ($r->n_stock_maximo ?? 0) - $r->n_stock_actual); // refill to max
        RequisicionRefaccion::updateOrCreate(
            ['id_requisicion' => $requisicion->id_requisicion,
             'id_refaccion'   => $r->id_refaccion,
             'id_estatus_requisicion' => 1],
            ['n_cantidad_sugerida' => $sugerida,
             'n_costo_unitario'    => $r->n_precio_compra ?? 0, 'b_activo' => 1],
        );
    }
}`,
          },
          {
            filename: 'CompatibilidadService.php',
            language: 'php',
            caption:  'The fitment engine: one correlated (NOT EXISTS) OR (EXISTS) per supplied dimension. An unconstrained dimension passes; a rule with no conditions at all is universal and always matches — so universality costs zero stored rows.',
            code: `// Find every part that fits a given vehicle. A rule matches if, per dimension,
// it has no rows (unconstrained) OR the vehicle's value is among them.
$reglas = DB::table('tw_reglas_compatibilidad AS r')->where('r.b_activo', 1);

foreach ($dimensiones as $d) {          // marca, modelo, generación, motor
    if (empty($d['valor'])) continue;   // dimension not provided = wildcard

    $reglas->where(function ($w) use ($d) {
        $w->whereNotExists(fn ($s) => $s->from($d['pivote'])
                ->whereColumn($d['pivote'] . '.id_regla', 'r.id_regla')
                ->where('b_activo', 1))
          ->orWhereExists(fn ($s) => $s->from($d['pivote'])
                ->whereColumn($d['pivote'] . '.id_regla', 'r.id_regla')
                ->where('b_activo', 1)
                ->where($d['columna'], $d['valor']));
    });
}

// Rules with zero conditions survive every filter → universal parts.
$idsCompatibles = $reglas->distinct()->pluck('r.id_refaccion');`,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECT 04 — iGEM BUAP (competition wiki — composable blocks)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug:    'igem-buap',
    index:   '04',
    title:   'iGEM BUAP',
    tagline: 'Interactive wiki for a gold-medal iGEM 2025 team — a scroll-driven animated story, an interactive audiobook, and Tochtli, a RAG chatbot on Claude that answers from the site itself.',

    role:     'Front-End & AI Engineer',
    year:     '2025–26',
    industry: 'Synthetic Biology · Web',

    // Color de marca del equipo (índigo, versión luminosa del brand #292b60) — glow del hero
    accent:   '#4F5BD5',

    // Carrusel hero (landscape 3/2). TODO: reemplazar image404.avif por capturas reales.
    heroImages: [
      '/images/projects/image404.avif', // IMAGEN 1 (hero): el storytelling animado del home — Tochtli, burbujas de diálogo con typewriter y escenas con parallax al hacer scroll
      '/images/projects/image404.avif', // IMAGEN 2 (hero): el storybook/audiolibro interactivo (react-pageflip) con una página abierta y los controles de play/mute
      '/images/projects/image404.avif', // IMAGEN 3 (hero): el chatbot Tochtli abierto — el widget flotante respondiendo una pregunta en streaming con las etiquetas de secciones
    ],

    stack: [
      'React 18', 'TypeScript', 'Vite', 'Tailwind 4',
      'Radix UI', 'Framer Motion', 'react-pageflip',
      'RAG', 'Claude Haiku 4.5', 'Prompt Caching', 'Anthropic SDK', 'Cloudflare Workers',
    ],

    blocks: [
      // ── 01 · Executive Summary ──────────────────────────────────────────────
      {
        type: 'summary',
        body:
          'A multidisciplinary team of BUAP students — biologists, chemists, medics — brought me in as the software engineer for their iGEM 2025 competition wiki: a project that grows a synthetic pulmonary surfactant in Pichia pastoris yeast to help premature babies breathe. I built the site’s interactive spine — a scroll-driven animated story and a voice-narrated, self-reading storybook — and the team went on to win a gold medal at the Grand Jamboree in Paris. The wiki outlived the competition as the project’s living page, and in 2026 I extended it with Tochtli: a retrieval-augmented chatbot on Claude that answers visitors’ questions using only the site’s own content, served from a Cloudflare Worker so a static site can safely run AI.',
      },

      // ── 02 · The Challenge ──────────────────────────────────────────────────
      {
        type: 'challenge',
        body:
          'An iGEM wiki has to explain hard synthetic biology — a pulmonary surfactant grown in Pichia pastoris to help premature babies breathe — to judges, scientists and curious visitors alike, and it must ship as a fully static site: iGEM publishes every wiki on GitLab Pages, with no backend and a hard freeze deadline. My job was to make the science land emotionally without diluting it, for an audience that ranged from Jamboree judges to a curious parent. That meant narrative devices a scientific paper does not have — a story you scroll, a book that reads itself aloud — built to survive an autoplay-blocking browser, a reader who needs reduced motion, and a phone on conference Wi-Fi. Later, adding a chatbot to that same static site meant running AI with no server to hold the secret: an API key can never reach a public build.',
      },

      // ── 03 · Evolution (timeline) ───────────────────────────────────────────
      {
        type: 'timeline',
        title: 'Evolution',
        phases: [
          {
            label: 'Hero & first motion',
            date:  'Sep 2025',
            tag:   'Competition',
            body:  'Joined a wiki already being written by scientists. Started where a visitor lands: a video hero with a wave divider, then swapped the local banner for an embed when the payload hurt load times on conference Wi-Fi.',
          },
          {
            label: 'A story you scroll',
            date:  'Sep 2025',
            tag:   'Competition',
            body:  'The homepage became a sequence of scroll-triggered scenes — Tochtli and friends animating in with typed-out dialogue, layered parallax, and recorded narration per scene, gated behind a one-time sound unlock and a global mute so no reader is ambushed by audio.',
          },
          {
            label: 'The storybook, narrated',
            date:  'Sep 2025',
            tag:   'Wiki freeze',
            body:  'A page-turning book that reads itself: narrator and character voices chained per page, pages auto-advancing when the audio ends, reduced-motion honored. Shipped with image optimization before the iGEM freeze — the version defended in Paris.',
          },
          {
            label: 'Gold in Paris',
            date:  'Oct 2025',
            tag:   'Result',
            body:  'The team won a gold medal at the iGEM Grand Jamboree with this wiki — judged on science, but experienced through the site.',
          },
          {
            label: 'Tochtli, the RAG chatbot',
            date:  'Jul 2026',
            tag:   'Beyond',
            body:  'The wiki outlived the competition as the project’s public page, so I kept building: a chatbot on Claude Haiku 4.5 that answers only from the site’s content, running on a Cloudflare Worker — and a restoration of the voice narration that later edits had broken.',
          },
        ],
      },

      // ── 04 · Key Features ───────────────────────────────────────────────────
      {
        type: 'features',
        items: [
          {
            tag:         'Storytelling · Scroll',
            title:       'A Story You Scroll Through',
            // IMAGEN: una escena del home — Tochtli (avatar) con su burbuja de diálogo escribiéndose (typewriter) y el efecto parallax; idealmente a media transición entre dos escenas
            image:       '/images/projects/image404.avif',
            description: 'The homepage tells the project’s story as a sequence of scroll-triggered scenes: Tochtli and friends animate in and out with Framer Motion, their lines type themselves out, and layered parallax gives depth as you move. Each scene can carry a recorded narration that plays in sync — gated behind a one-time sound unlock and a global mute toggle so it respects the browser’s autoplay policy and never surprises a reader.',
          },
          {
            tag:         'Narrative · Audiobook',
            title:       'An Interactive Storybook',
            // IMAGEN: el storybook (react-pageflip) con una página abierta a medio giro, mostrando ilustración + texto y los controles de reproducción (play/pause, mute)
            image:       '/images/projects/image404.avif',
            description: 'A page-turning book (react-pageflip) that reads itself: a narrator and character voices are synced to each page, pages auto-advance when the audio ends, and illustrations breathe with a subtle Ken Burns motion. It honors prefers-reduced-motion (turning off the slow page-flip and pan), resizes cleanly across mobile, tablet and desktop, and puts play/pause and mute in the reader’s hands.',
          },
          {
            tag:         'AI · RAG',
            title:       'Tochtli — a RAG Chatbot on Claude',
            // IMAGEN: el widget flotante de Tochtli abierto respondiendo en streaming, con las etiquetas de "secciones relacionadas" debajo de la respuesta
            image:       '/images/projects/image404.avif',
            description: 'A floating assistant, in the voice of the team’s mascot, that answers only from the site’s own content. Because the wiki is static, the Anthropic API key lives in a Cloudflare Worker; the whole knowledge base is sent to Claude Haiku 4.5 inside a cached system block, so Spanish questions are answered from an English site with no per-language index, and each reply streams back token by token. It falls back to BM25 retrieval if the corpus outgrows the window, and the Worker adds a CORS allowlist and per-IP rate limiting.',
          },
        ],
      },

      // ── 05 · Architecture ───────────────────────────────────────────────────
      {
        type: 'architecture',
        body:
          'The wiki is a React + Vite single-page app deployed statically to GitLab Pages by iGEM — so there is no server to hold a secret. The Tochtli chatbot solves that with a Cloudflare Worker that owns the API key: the widget POSTs a question, the Worker builds the context and calls Claude, and forwards the SSE stream back as plain text. The retrieval logic lives in one module (tochtli/core.mjs) shared byte-for-byte between the production Worker and a local Vite dev plugin, so both build the request identically.',
        diagrams: [
          {
            nodes: [
              { id: 'wiki',   label: 'Static Wiki',     sublabel: 'React · GitLab Pages', type: 'client',   col: 0, row: 0 },
              { id: 'widget', label: 'Tochtli Widget',  sublabel: 'chat UI',              type: 'client',   col: 0, row: 1 },
              { id: 'kb',     label: 'Knowledge Base',  sublabel: 'site content · JSON',  type: 'db',       col: 2, row: 0 },
              { id: 'worker', label: 'Tochtli Worker',  sublabel: 'Cloudflare · API key', type: 'gateway',  col: 1, row: 1 },
              { id: 'core',   label: 'RAG Core',        sublabel: 'context · caching',    type: 'service',  col: 2, row: 1 },
              { id: 'claude', label: 'Claude Haiku 4.5', sublabel: 'Anthropic · external', type: 'external', col: 3, row: 1 },
            ],
            edges: [
              { from: 'wiki',   to: 'widget', label: 'mounts',     dashed: true },
              { from: 'widget', to: 'worker', label: 'POST /chat' },
              { from: 'worker', to: 'core',   label: 'build ctx'  },
              { from: 'core',   to: 'kb',     label: 'whole base', dashed: true },
              { from: 'core',   to: 'claude', label: 'SSE stream', bidir: true },
            ],
            scopes: [
              { label: 'RAG backend (Cloudflare)', nodeIds: ['worker', 'core'] },
            ],
          },
        ],
      },

      // ── 06 · Impact ─────────────────────────────────────────────────────────
      {
        type: 'metrics',
        title: 'Impact',
        items: [
          { value: 'Gold',  label: 'iGEM 2025 · Paris',   sub: 'The team earned a gold medal at the Grand Jamboree' },
          { value: 'ES/EN', label: 'Cross-lingual RAG',   sub: 'Spanish questions answered from an English site — no per-language index' },
          { value: '0',     label: 'Servers to run',      sub: 'A static wiki plus one Cloudflare Worker; the API key never reaches the browser' },
          { value: '1',     label: 'RAG core, 2 runtimes', sub: 'Local dev plugin and production Worker share one module (tochtli/core.mjs)' },
        ],
      },

      // ── 07 · Implementation ─────────────────────────────────────────────────
      {
        type: 'code',
        title: 'Implementation',
        tabs: [
          {
            filename: 'core.mjs',
            language: 'javascript',
            caption:  'Cross-lingual RAG without a vector DB: the site is small enough to send whole, so instead of lexical retrieval (which fails ES↔EN) the entire knowledge base rides in a cached system block — Claude Haiku 4.5 understands both languages and prompt caching makes every follow-up cheap.',
            code: `// One request body, shared by the local Vite plugin and the Cloudflare Worker.
export function buildRequestBody({ model, contextText, messages }) {
  return {
    model,                       // claude-haiku-4-5
    max_tokens: MAX_TOKENS,
    // Stable blocks → prompt caching: the big context is cached, so each
    // follow-up question is billed at a fraction of the first.
    system: [
      { type: 'text', text: SYSTEM_PROMPT },
      { type: 'text', text: contextText, cache_control: { type: 'ephemeral' } },
    ],
    messages,
  };
}`,
          },
          {
            filename: 'worker/index.mjs',
            language: 'javascript',
            caption:  'A static iGEM wiki has no backend, so the API key lives in a Cloudflare Worker (with a CORS allowlist and per-IP rate limiting). It proxies Claude’s SSE stream, forwarding only the text deltas as a plain-text stream the widget renders token by token.',
            code: `// Turn Anthropic's SSE stream into a plain-text stream of just the deltas.
function sseToText(upstreamBody) {
  const reader = upstreamBody.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) return controller.close();

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const t = line.trim();
        if (!t.startsWith('data:')) continue;
        const data = t.slice(5).trim();
        if (!data || data === '[DONE]') continue;
        try {
          const evt = JSON.parse(data);
          if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
            controller.enqueue(encoder.encode(evt.delta.text));
          }
        } catch { /* partial SSE chunk: ignore */ }
      }
    },
    cancel() { reader.cancel(); },
  });
}`,
          },
          {
            filename: 'TochtliDialogue.tsx',
            language: 'typescript',
            caption:  'Narration that respects the browser’s autoplay policy: a scene’s voice only plays once the reader has unlocked sound (a one-time gesture) and the global toggle is on, and it is torn down when the scene changes.',
            code: `// Play this scene's narration only when sound is unlocked and enabled;
// tear it down when the scene (or those conditions) change.
useEffect(() => {
  if (!audioSrc || !audioUnlocked || !isSoundEnabled) return;

  const audio = new Audio(audioSrc);
  audio.play();

  return () => audio.pause();
}, [audioSrc, audioUnlocked, isSoundEnabled]);`,
          },
          {
            filename: 'book-style/page.tsx',
            language: 'typescript',
            caption:  'The audiobook’s pacing: narrator and character voices are chained by their onended callbacks, so a page turns only when its narration truly finishes — never on a fixed timer. The effect also distinguishes “the reader hit pause” from “the page changed”, so pausing never restarts the narration.',
            code: `// Each panel: narrator voice → character voice → turn the page.
// Chained on 'ended', so pacing follows the audio, not a guessed timeout.
const activePanel = storyData[pageIndex];
const onComplete  = () => queueAdvance(900);

const playDialogue = () => {
  if (!activePanel.audio_dialogo) return onComplete();

  const dialogueAudio = new Audio(activePanel.audio_dialogo);
  dialogueAudio.muted = isMutedRef.current;
  activeAudio.current.dialogue = dialogueAudio;
  dialogueAudio.onended = onComplete;
  // If the browser blocks playback, still advance — never strand the reader.
  dialogueAudio.play().catch(() => onComplete());
};

const playNarration = () => {
  if (!activePanel.audio_narrador) return playDialogue();

  const narratorAudio = new Audio(activePanel.audio_narrador);
  narratorAudio.muted = isMutedRef.current;
  activeAudio.current.narrator = narratorAudio;
  narratorAudio.onended = playDialogue;
  narratorAudio.play().catch(() => playDialogue());
};

playNarration();`,
          },
        ],
      },
    ],
  },
]
