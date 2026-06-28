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
    year:     '2026',
    industry: 'Retail Tech · B2B SaaS',
    // Carrusel hero con fade automático — muestra la escala del sistema
    heroImages: [
      '/images/projects/nivo/imageNivo1.png', // IMAGEN 1: Dashboard del Super Admin — panel de tenants, planes, métricas globales
      '/images/projects/nivo/imageNivo2.png', // IMAGEN 2: Dashboard del Tenant — ventas del día, inventario, sucursales
      '/images/projects/nivo/imageNivo3.png', // IMAGEN 3: Vista del POS en operación — ticket abierto con productos y métodos de pago
    ],

    summary:
      'Nivo is a Turborepo monorepo powering four apps — a NestJS API (190+ source files, 120+ REST endpoints), a Next.js 14 admin + POS, a customer-facing storefront, and a React Native mobile app — all sharing 86 TypeORM entities across isolated PostgreSQL databases per tenant. I designed and built the database-per-tenant middleware with sub-2 ms connection pooling, a 3-level cascading pricing engine that eliminates thousands of redundant price rows, an offline-first POS sync pipeline via Dexie.js, and Nibbit — an agentic AI assistant powered by Gemini with 14 function-calling tools that drafts purchase requisitions and supplier emails autonomously.',

    stack: [
      'NestJS', 'TypeORM', 'PostgreSQL', 'Redis',
      'BullMQ', 'Stripe', 'Next.js 14', 'React Native',
      'Dexie.js', 'Socket.io', 'Turborepo', 'Docker',
      'Gemini AI', 'Function Calling',
    ],

    // ── The Challenge ──────────────────────────────────────────────────────
    problem:
      'A growing network of shoe-retail franchises needed one platform that could handle the full complexity of physical retail at scale: a matrix inventory system tracking every size, color, and branch combination across hundreds of thousands of active SKUs; complete tenant-to-tenant data isolation so competing franchises could share infrastructure without ever accessing each other\'s records; an offline-capable POS that guaranteed zero wait times at the counter during connectivity blackouts; a cascading pricing engine flexible enough to compute final prices from global landed-cost bases, per-branch cost overrides, and per-list margin exceptions — all while complying with Mexico\'s strict CFDI electronic invoicing regulations.',

    // ── Architecture ──────────────────────────────────────────────────────
    architecture:
      'Database-per-tenant pattern built on NestJS. A Master PostgreSQL database stores tenant records and Stripe subscriptions. On every request, a custom NestJS middleware extracts the subdomain (e.g. acme.nivo.app), queries the master DB to resolve the tenant, and hands a dedicated TypeORM DataSource for that tenant\'s isolated database to the request pipeline. Connections are pooled in-memory via a Map<string, DataSource>, keeping p99 overhead under 2 ms. Async workloads — tenant provisioning, low-stock alerts, invoice generation, report exports — are handled by BullMQ workers backed by Redis.',

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
        caption:  'Resolves subdomain to an isolated TypeORM DataSource, pooled in-memory via Map<string, DataSource> for sub-2 ms overhead per request.',
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
            body:  'With the core reshaped, services and diagnostics can finally be added at any time and nest recursively — matching real operation, and unblocking the loyalty and quality-call modules the team built on top.',
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
            description: 'The old schema modeled a straight line: main service → parts → one note. Real jobs branch. I reshaped the model so a diagnostic can spawn new services and new diagnostics, recursively, and so services and parts can be added to an order at any point in its life. This single change is what unblocked manual corrections, mid-job up-sells, and the downstream loyalty and quality-call flows.',
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
          { value: 'O(1)', label: 'Recursive Levels',   sub: 'Infinite support for nested sub-diagnostics and additional services' },
          { value: '66%',  label: 'Friction Reduction',  sub: 'Three parts quotes unified into a single master note (Wizard)' },
          { value: '∞',    label: 'Version Control',     sub: 'From destructive overwrites to a complete, branchable note history' },
          { value: '-60%', label: 'DB Load (Calendar)',  sub: 'Triple-fetch eliminated and critical tables indexed' },
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
            filename: 'DiagnosticTreeService.php',
            language: 'php',
            caption:  'Recursive operation — a diagnostic spawns services and each service can spawn further diagnostics, with no depth limit. Two flat queries are indexed by parent and assembled through mutual recursion (nodoServicio ↔ nodoDiagnostico): an N+1-free build of an unbounded tree, kept entirely in memory.',
            code: `/**
 * A repair order is not a flat list: a diagnostic can spawn services, and each
 * service can spawn further diagnostics — with no depth limit. Rather than emit
 * recursive SQL (N+1), we pull both node types flat in two queries, index them
 * by parent in memory, and assemble the nested tree in a single pass.
 */
public function build(int $idOrdenServicio): array
{
    $servicios = DB::table('tw_servicios_sugeridos')
        ->where('id_orden_servicio', $idOrdenServicio)
        ->where('b_activo', 1)
        ->get();

    $diagnosticos = DB::table('tw_diagnosticos_sugeridos')
        ->where('id_orden_servicio', $idOrdenServicio)
        ->where('b_activo', 1)
        ->get();

    // Index children by the parent node that generated them.
    $serviciosPorDiagnostico = $servicios->groupBy('id_diagnostico_sugerido');
    $diagnosticosPorServicio = $diagnosticos->groupBy('id_servicio_revision');

    // Roots: services attached to the inspection itself, not to a diagnostic.
    return $serviciosPorDiagnostico->get(null, collect())
        ->map(fn ($s) => $this->nodoServicio($s, $serviciosPorDiagnostico, $diagnosticosPorServicio))
        ->values()
        ->all();
}

private function nodoServicio($servicio, $porDiagnostico, $porServicio): array
{
    // Every diagnostic raised on this service → recurse into its subtree.
    $hijos = $porServicio->get($servicio->id_servicio_revision, collect())
        ->map(fn ($d) => $this->nodoDiagnostico($d, $porDiagnostico, $porServicio));

    return [
        'id'           => $servicio->id_servicio_sugerido,
        'tipo'         => 'servicio',
        'estatus'      => $servicio->id_estatus_servicio_sugerido,
        'diagnosticos' => $hijos->values()->all(),
    ];
}

private function nodoDiagnostico($diagnostico, $porDiagnostico, $porServicio): array
{
    // Every service this diagnostic generated → recurse back into services.
    $hijos = $porDiagnostico->get($diagnostico->id_diagnostico_sugerido, collect())
        ->map(fn ($s) => $this->nodoServicio($s, $porDiagnostico, $porServicio));

    return [
        'id'        => $diagnostico->id_diagnostico_sugerido,
        'tipo'      => 'diagnostico',
        'estatus'   => $diagnostico->id_estatus_servicio_sugerido,
        'servicios' => $hijos->values()->all(),
    ];
}`,
          },
          {
            filename: 'calendario.component.ts',
            language: 'typescript',
            caption:  'Performance — the calendar paginates by visible range and memoizes each range in memory (zero HTTP on revisits); a single batched addEventSource replaces N addEvent calls. This removed the triple-fetch and the O(n) re-render that froze the browser (~60% less DB load).',
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
  // PROJECT 03 — VagXpress (placeholder — case study pending real material)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug:    'vagxpress',
    index:   '03',
    title:   'VagXpress',
    tagline: 'Last-mile logistics & delivery orchestration — case study coming soon.',

    role:     'Backend Engineer',
    year:     '2024',
    industry: 'Logistics · B2B',

    stack: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker'],

    blocks: [
      {
        type: 'summary',
        body: 'Case study in progress. Technical documentation is being prepared.',
      },
    ],
  },
]
