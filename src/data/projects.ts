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

// ─── Main Project type ─────────────────────────────────────────────────────────
export interface Project {
  slug:     string
  index:    string       // "01", "02", …
  title:    string
  tagline:  string       // one-liner shown in carousel + hero

  // ── Executive Summary sidebar ─────────────────────────────────────────────
  role:     string       // e.g. "Lead Backend Engineer"
  year:     string       // e.g. "2024"
  industry: string       // e.g. "FinTech · B2B SaaS"
  heroImage?:  string    // single hero image (legacy)
  heroImages?: string[]  // auto-fading carousel of hero images

  // ── Stack ─────────────────────────────────────────────────────────────────
  stack: string[]

  // ── Section: Executive Summary ─────────────────────────────────────────────
  summary: string        // 2-3 sentence overview (distinct from tagline)

  // ── Section: The Challenge ────────────────────────────────────────────────
  problem: string        // business language, no jargon

  // ── Section: Architecture ─────────────────────────────────────────────────
  architecture: string   // prose explanation of the pattern used
  archNodes?:   ArchNode[]
  archEdges?:   ArchEdge[]
  archScopes?:  ArchScope[]

  // ── Section: Key Features (split-view) ────────────────────────────────────
  features: ProjectFeature[]

  // ── Section: Code (tabbed viewer) ──────────────────────────────────────────
  codeTabs: {
    filename: string       // e.g. "tenant.middleware.ts"
    code:     string
    language?: string
    caption?:  string
  }[]
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
  // PROJECT 02 — TallerUp (skeleton — details pending)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug:    'tallerup',
    index:   '02',
    title:   'TallerUp',
    tagline: 'Workshop management platform for automotive repair shops — scheduling, diagnostics, and real-time job tracking.',

    role:     'Full-Stack Engineer',
    year:     '2025',
    industry: 'Automotive · SaaS',

    summary:
      'Case study in progress. Technical documentation is being prepared.',

    stack: [
      'NestJS', 'PostgreSQL', 'Next.js 14', 'React Native',
      'Prisma', 'Socket.io', 'Docker',
    ],

    problem:
      'Case study details coming soon.',

    architecture:
      'Case study details coming soon.',

    features: [],

    codeTabs: [
      {
        filename: 'coming-soon.ts',
        language: 'typescript',
        caption:  'Code samples are being prepared for this case study.',
        code: `// TallerUp — Case Study in Progress
// Technical documentation coming soon.`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PROJECT 03 — VagXpress (skeleton — details pending)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug:    'vagxpress',
    index:   '03',
    title:   'VagXpress',
    tagline: 'Last-mile logistics and delivery orchestration — route optimization, driver tracking, and proof-of-delivery.',

    role:     'Backend Engineer',
    year:     '2024',
    industry: 'Logistics · B2B',

    summary:
      'Case study in progress. Technical documentation is being prepared.',

    stack: [
      'Node.js', 'Express', 'MongoDB', 'React',
      'Redis', 'Docker', 'AWS',
    ],

    problem:
      'Case study details coming soon.',

    architecture:
      'Case study details coming soon.',

    features: [],

    codeTabs: [
      {
        filename: 'coming-soon.ts',
        language: 'typescript',
        caption:  'Code samples are being prepared for this case study.',
        code: `// VagXpress — Case Study in Progress
// Technical documentation coming soon.`,
      },
    ],
  },
]
