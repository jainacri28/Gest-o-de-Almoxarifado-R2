const STORAGE_KEY = "construtora-prime-db-v1";

const categories = ["Construcao civil", "Eletrica", "Hidraulica", "Acabamento"];
const units = ["m2", "m3", "saco", "barra", "litro", "unidade", "kg", "metro"];
const roles = ["Pedreiro", "Servente", "Eletricista", "Encanador", "Pintor", "Mestre de obras", "Engenheiro", "Almoxarife"];

const appState = {
  currentUser: null,
  currentView: "dashboard",
  reportType: "movements",
  filters: { projectId: "", materialId: "", category: "", periodStart: "", periodEnd: "" }
};

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(date) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${date}T00:00:00`));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));
}

function formatNumber(value, decimals = 0) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(Number(value || 0));
}

function parseNumber(value) {
  if (typeof value === "number") return value;
  const sanitized = String(value || "").replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  const result = Number(sanitized);
  return Number.isFinite(result) ? result : 0;
}

function normalize(text) {
  return String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function seedDatabase() {
  return {
    projects: [
      { id: "obra-01", name: "Residencial Solar das Palmeiras", type: "Residencial", location: "Campinas/SP", stage: "Estrutura", startDate: "2026-01-10", expectedEnd: "2026-11-20", manager: "Carlos Menezes", status: "Em andamento", teamSize: 18 },
      { id: "obra-02", name: "Centro Comercial Vista Norte", type: "Comercial", location: "Sumare/SP", stage: "Instalacoes", startDate: "2025-12-02", expectedEnd: "2026-09-30", manager: "Marina Rocha", status: "Em andamento", teamSize: 24 },
      { id: "obra-03", name: "Condominio Parque das Aguas", type: "Residencial", location: "Hortolandia/SP", stage: "Acabamento", startDate: "2025-09-15", expectedEnd: "2026-07-18", manager: "Renato Alves", status: "Em andamento", teamSize: 16 }
    ],
    suppliers: [
      { id: "forn-01", name: "Casa do Cimento", contact: "Luciana", phone: "(19) 3322-4455", email: "vendas@casadocimento.com", city: "Campinas/SP", notes: "Entrega em ate 24h" },
      { id: "forn-02", name: "Hidro Forte", contact: "Edson", phone: "(19) 3441-1122", email: "comercial@hidroforte.com", city: "Sumare/SP", notes: "Tubos e conexoes" },
      { id: "forn-03", name: "Eletro Obra", contact: "Bianca", phone: "(19) 3665-7841", email: "pedidos@eletroobra.com", city: "Campinas/SP", notes: "Cabos e paineis" },
      { id: "forn-04", name: "Acabamentos Delta", contact: "Rafael", phone: "(19) 3777-9021", email: "relacionamento@deltaacab.com", city: "Americana/SP", notes: "Tintas, pisos e argamassas" }
    ],
    materials: [
      { id: "mat-01", name: "Cimento CP II", category: "Construcao civil", unit: "saco", minStock: 150, unitCost: 38.9, supplierId: "forn-01", plannedTotal: 1200 },
      { id: "mat-02", name: "Areia media", category: "Construcao civil", unit: "m3", minStock: 25, unitCost: 148, supplierId: "forn-01", plannedTotal: 210 },
      { id: "mat-03", name: "Brita 1", category: "Construcao civil", unit: "m3", minStock: 20, unitCost: 165, supplierId: "forn-01", plannedTotal: 180 },
      { id: "mat-04", name: "Tijolo baiano", category: "Construcao civil", unit: "unidade", minStock: 5000, unitCost: 1.12, supplierId: "forn-01", plannedTotal: 60000 },
      { id: "mat-05", name: "Tubo PVC 50mm", category: "Hidraulica", unit: "barra", minStock: 40, unitCost: 56.5, supplierId: "forn-02", plannedTotal: 320 },
      { id: "mat-06", name: "Fio 2,5mm", category: "Eletrica", unit: "metro", minStock: 600, unitCost: 3.95, supplierId: "forn-03", plannedTotal: 8200 },
      { id: "mat-07", name: "Tinta acrilica branca", category: "Acabamento", unit: "litro", minStock: 120, unitCost: 24.8, supplierId: "forn-04", plannedTotal: 980 },
      { id: "mat-08", name: "Piso porcelanato 60x60", category: "Acabamento", unit: "m2", minStock: 90, unitCost: 72, supplierId: "forn-04", plannedTotal: 760 },
      { id: "mat-09", name: "Argamassa AC3", category: "Acabamento", unit: "saco", minStock: 85, unitCost: 31.5, supplierId: "forn-04", plannedTotal: 640 },
      { id: "mat-10", name: "Ferro CA-50 10mm", category: "Construcao civil", unit: "barra", minStock: 120, unitCost: 63.2, supplierId: "forn-01", plannedTotal: 1350 }
    ],
    collaborators: [
      { id: "col-01", name: "Joao Batista", role: "Pedreiro", projectId: "obra-01", status: "Ativo", dailyCost: 210, hireDate: "2025-12-03" },
      { id: "col-02", name: "Luis Fernando", role: "Servente", projectId: "obra-01", status: "Ativo", dailyCost: 140, hireDate: "2026-01-11" },
      { id: "col-03", name: "Paulo Vitor", role: "Eletricista", projectId: "obra-02", status: "Ativo", dailyCost: 240, hireDate: "2025-12-10" },
      { id: "col-04", name: "Andre Souza", role: "Encanador", projectId: "obra-02", status: "Ativo", dailyCost: 235, hireDate: "2025-12-20" },
      { id: "col-05", name: "Marcos Lima", role: "Pintor", projectId: "obra-03", status: "Ativo", dailyCost: 215, hireDate: "2026-02-14" },
      { id: "col-06", name: "Celia Moraes", role: "Mestre de obras", projectId: "obra-03", status: "Ativo", dailyCost: 310, hireDate: "2025-10-04" },
      { id: "col-07", name: "Fabio Nunes", role: "Almoxarife", projectId: "obra-01", status: "Ativo", dailyCost: 205, hireDate: "2025-11-19" },
      { id: "col-08", name: "Priscila Ramos", role: "Engenheiro", projectId: "obra-02", status: "Ativo", dailyCost: 420, hireDate: "2025-09-18" },
      { id: "col-09", name: "Roberto Dias", role: "Servente", projectId: "obra-02", status: "Inativo", dailyCost: 140, hireDate: "2025-12-14" }
    ],
    users: [
      { id: "usr-01", name: "Administrador", email: "admin@construtoraprime.com", role: "Administrador", password: "admin123", active: true },
      { id: "usr-02", name: "Marina Rocha", email: "marina@construtoraprime.com", role: "Gestora de obras", password: "obra123", active: true }
    ],
    stockEntries: [
      { id: "mov-01", type: "entrada", date: "2026-03-01", materialId: "mat-01", quantity: 350, unitCost: 38.9, supplierId: "forn-01", projectId: "", responsible: "Administrador", destination: "Almoxarifado central", notes: "Compra mensal" },
      { id: "mov-02", type: "entrada", date: "2026-03-02", materialId: "mat-02", quantity: 70, unitCost: 148, supplierId: "forn-01", projectId: "", responsible: "Administrador", destination: "Almoxarifado central", notes: "Reposicao" },
      { id: "mov-03", type: "entrada", date: "2026-03-03", materialId: "mat-06", quantity: 3000, unitCost: 3.95, supplierId: "forn-03", projectId: "", responsible: "Administrador", destination: "Almoxarifado central", notes: "Infra eletrica" },
      { id: "mov-04", type: "entrada", date: "2026-03-04", materialId: "mat-05", quantity: 120, unitCost: 56.5, supplierId: "forn-02", projectId: "", responsible: "Administrador", destination: "Almoxarifado central", notes: "Tubulacao principal" },
      { id: "mov-05", type: "entrada", date: "2026-03-05", materialId: "mat-07", quantity: 280, unitCost: 24.8, supplierId: "forn-04", projectId: "", responsible: "Administrador", destination: "Almoxarifado central", notes: "Pintura final" },
      { id: "mov-06", type: "entrada", date: "2026-03-05", materialId: "mat-08", quantity: 220, unitCost: 72, supplierId: "forn-04", projectId: "", responsible: "Administrador", destination: "Almoxarifado central", notes: "Piso bloco 1" },
      { id: "mov-07", type: "entrada", date: "2026-03-06", materialId: "mat-09", quantity: 240, unitCost: 31.5, supplierId: "forn-04", projectId: "", responsible: "Administrador", destination: "Almoxarifado central", notes: "Assentamento" },
      { id: "mov-08", type: "entrada", date: "2026-03-06", materialId: "mat-10", quantity: 420, unitCost: 63.2, supplierId: "forn-01", projectId: "", responsible: "Administrador", destination: "Almoxarifado central", notes: "Armadura" },
      { id: "mov-09", type: "entrada", date: "2026-03-07", materialId: "mat-04", quantity: 18000, unitCost: 1.12, supplierId: "forn-01", projectId: "", responsible: "Administrador", destination: "Almoxarifado central", notes: "Alvenaria" },
      { id: "mov-10", type: "entrada", date: "2026-03-08", materialId: "mat-03", quantity: 65, unitCost: 165, supplierId: "forn-01", projectId: "", responsible: "Administrador", destination: "Almoxarifado central", notes: "Base estrutural" },
      { id: "mov-11", type: "saida", date: "2026-03-11", materialId: "mat-01", quantity: 110, unitCost: 38.9, supplierId: "", projectId: "obra-01", responsible: "Fabio Nunes", destination: "Fundacao bloco A", notes: "Concretagem" },
      { id: "mov-12", type: "saida", date: "2026-03-12", materialId: "mat-10", quantity: 125, unitCost: 63.2, supplierId: "", projectId: "obra-01", responsible: "Fabio Nunes", destination: "Pilares", notes: "Estrutura" },
      { id: "mov-13", type: "saida", date: "2026-03-14", materialId: "mat-06", quantity: 920, unitCost: 3.95, supplierId: "", projectId: "obra-02", responsible: "Priscila Ramos", destination: "Quadro geral", notes: "Infra eletrica" },
      { id: "mov-14", type: "saida", date: "2026-03-16", materialId: "mat-05", quantity: 42, unitCost: 56.5, supplierId: "", projectId: "obra-02", responsible: "Andre Souza", destination: "Prumadas", notes: "Torre central" },
      { id: "mov-15", type: "saida", date: "2026-03-18", materialId: "mat-07", quantity: 105, unitCost: 24.8, supplierId: "", projectId: "obra-03", responsible: "Marcos Lima", destination: "Pavimento 3", notes: "Pintura interna" },
      { id: "mov-16", type: "saida", date: "2026-03-19", materialId: "mat-08", quantity: 78, unitCost: 72, supplierId: "", projectId: "obra-03", responsible: "Marcos Lima", destination: "Aptos finais", notes: "Revestimento" },
      { id: "mov-17", type: "saida", date: "2026-03-20", materialId: "mat-09", quantity: 88, unitCost: 31.5, supplierId: "", projectId: "obra-03", responsible: "Marcos Lima", destination: "Assentamento", notes: "Pisos e paredes" },
      { id: "mov-18", type: "saida", date: "2026-03-21", materialId: "mat-04", quantity: 7600, unitCost: 1.12, supplierId: "", projectId: "obra-01", responsible: "Fabio Nunes", destination: "Alvenaria externa", notes: "Fechamento" },
      { id: "mov-19", type: "saida", date: "2026-03-21", materialId: "mat-02", quantity: 28, unitCost: 148, supplierId: "", projectId: "obra-01", responsible: "Fabio Nunes", destination: "Laje tecnica", notes: "Massa de concreto" },
      { id: "mov-20", type: "saida", date: "2026-03-22", materialId: "mat-03", quantity: 20, unitCost: 165, supplierId: "", projectId: "obra-02", responsible: "Administrador", destination: "Estacionamento", notes: "Drenagem" }
    ],
    applications: [
      { id: "apl-01", date: "2026-03-11", projectId: "obra-01", materialId: "mat-01", category: "Construcao civil", stage: "Fundacao", quantity: 100, predictedQuantity: 92, responsible: "Carlos Menezes", notes: "Concretagem do bloco A" },
      { id: "apl-02", date: "2026-03-12", projectId: "obra-01", materialId: "mat-10", category: "Construcao civil", stage: "Estrutura", quantity: 118, predictedQuantity: 112, responsible: "Carlos Menezes", notes: "Armadura de pilares" },
      { id: "apl-03", date: "2026-03-14", projectId: "obra-02", materialId: "mat-06", category: "Eletrica", stage: "Infra eletrica", quantity: 880, predictedQuantity: 810, responsible: "Marina Rocha", notes: "Lancamento de cabos" },
      { id: "apl-04", date: "2026-03-16", projectId: "obra-02", materialId: "mat-05", category: "Hidraulica", stage: "Prumadas", quantity: 38, predictedQuantity: 34, responsible: "Marina Rocha", notes: "Distribuicao de agua" },
      { id: "apl-05", date: "2026-03-18", projectId: "obra-03", materialId: "mat-07", category: "Acabamento", stage: "Pintura", quantity: 98, predictedQuantity: 90, responsible: "Renato Alves", notes: "Pintura de corredores" },
      { id: "apl-06", date: "2026-03-19", projectId: "obra-03", materialId: "mat-08", category: "Acabamento", stage: "Revestimento", quantity: 74, predictedQuantity: 70, responsible: "Renato Alves", notes: "Assentamento de piso" },
      { id: "apl-07", date: "2026-03-20", projectId: "obra-03", materialId: "mat-09", category: "Acabamento", stage: "Assentamento", quantity: 82, predictedQuantity: 76, responsible: "Renato Alves", notes: "Fixacao de porcelanato" }
    ]
  };
}

function loadDB() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const seed = seedDatabase();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(stored);
}

function saveDB(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let db = loadDB();

function resetDB() {
  db = seedDatabase();
  saveDB(db);
  render();
  toast("Base demo restaurada.", "success");
}

function getMaterial(id) {
  return db.materials.find((item) => item.id === id);
}

function getProject(id) {
  return db.projects.find((item) => item.id === id);
}

function getSupplier(id) {
  return db.suppliers.find((item) => item.id === id);
}

function calculateStock() {
  const stockMap = {};
  db.materials.forEach((material) => {
    stockMap[material.id] = {
      materialId: material.id,
      name: material.name,
      category: material.category,
      unit: material.unit,
      minStock: material.minStock,
      unitCost: material.unitCost,
      plannedTotal: material.plannedTotal,
      entries: 0,
      exits: 0,
      applications: 0,
      current: 0,
      totalCostInStock: 0
    };
  });
  db.stockEntries.forEach((movement) => {
    const item = stockMap[movement.materialId];
    if (!item) return;
    if (movement.type === "entrada") item.entries += Number(movement.quantity);
    if (movement.type === "saida") item.exits += Number(movement.quantity);
  });
  db.applications.forEach((application) => {
    const item = stockMap[application.materialId];
    if (item) item.applications += Number(application.quantity);
  });
  Object.values(stockMap).forEach((item) => {
    item.current = item.entries - item.exits;
    item.totalCostInStock = item.current * item.unitCost;
    item.predictedConsumption = db.applications.filter((entry) => entry.materialId === item.materialId).reduce((sum, entry) => sum + Number(entry.predictedQuantity || 0), 0);
    item.actualConsumption = item.applications;
    item.waste = Math.max(item.actualConsumption - item.predictedConsumption, 0);
  });
  return stockMap;
}

function filterByPeriod(items, dateField = "date") {
  return items.filter((item) => {
    const value = item[dateField];
    if (!value) return true;
    const startOk = !appState.filters.periodStart || value >= appState.filters.periodStart;
    const endOk = !appState.filters.periodEnd || value <= appState.filters.periodEnd;
    return startOk && endOk;
  });
}

function filterGlobal(items, fields = {}) {
  return filterByPeriod(items).filter((item) => {
    const projectOk = !appState.filters.projectId || item.projectId === appState.filters.projectId;
    const materialOk = !appState.filters.materialId || item.materialId === appState.filters.materialId;
    const categorySource = fields.category ? item[fields.category] : item.category;
    const categoryOk = !appState.filters.category || categorySource === appState.filters.category;
    return projectOk && materialOk && categoryOk;
  });
}

function getDashboardMetrics() {
  const stock = calculateStock();
  const movements = filterGlobal(db.stockEntries);
  const applications = filterGlobal(db.applications, { category: "category" });
  const entries = movements.filter((item) => item.type === "entrada");
  const exits = movements.filter((item) => item.type === "saida");
  const materialsInStock = Object.values(stock).filter((item) => item.current > 0).length;
  const totalStockUnits = Object.values(stock).reduce((sum, item) => sum + item.current, 0);
  const lowStock = Object.values(stock).filter((item) => item.current <= item.minStock);
  const totalEntryCost = entries.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitCost), 0);
  const totalExitCost = exits.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitCost), 0);
  const totalApplicationCost = applications.reduce((sum, item) => sum + Number(item.quantity) * Number(getMaterial(item.materialId)?.unitCost || 0), 0);
  const totalCollaborators = db.collaborators.length;
  const activeCollaborators = db.collaborators.filter((item) => item.status === "Ativo").length;
  const consumptionByProject = db.projects.map((project) => {
    const projectApplications = applications.filter((item) => item.projectId === project.id);
    const quantity = projectApplications.reduce((sum, item) => sum + Number(item.quantity), 0);
    const cost = projectApplications.reduce((sum, item) => sum + Number(item.quantity) * Number(getMaterial(item.materialId)?.unitCost || 0), 0);
    return { project, quantity, cost };
  });
  const categoryTotals = categories.map((category) => {
    const total = applications.filter((item) => item.category === category).reduce((sum, item) => sum + Number(item.quantity), 0);
    return { category, total };
  });
  const materialConsumption = db.materials.map((material) => {
    const total = applications.filter((item) => item.materialId === material.id).reduce((sum, item) => sum + Number(item.quantity), 0);
    return { material, total };
  });
  const wasteQuantity = applications.reduce((sum, item) => sum + Math.max(Number(item.quantity) - Number(item.predictedQuantity), 0), 0);
  const predictedTotal = applications.reduce((sum, item) => sum + Number(item.predictedQuantity || 0), 0);
  const wasteRate = predictedTotal ? (wasteQuantity / predictedTotal) * 100 : 0;
  const biggestProject = [...consumptionByProject].sort((a, b) => b.quantity - a.quantity)[0];
  const mostConsumedMaterial = [...materialConsumption].sort((a, b) => b.total - a.total)[0];
  return { stock, entries, exits, applications, materialsInStock, totalStockUnits, lowStock, totalEntryCost, totalExitCost, totalApplicationCost, totalCollaborators, activeCollaborators, consumptionByProject, categoryTotals, biggestProject, mostConsumedMaterial, wasteQuantity, wasteRate };
}

function getMovementLabel(type) {
  return type === "entrada" ? "Entrada" : "Saida";
}

function getStatusBadge(current, minStock) {
  if (current <= minStock) return `<span class="badge danger">Estoque baixo</span>`;
  if (current <= minStock * 1.4) return `<span class="badge warning">Atencao</span>`;
  return `<span class="badge success">Saudavel</span>`;
}

function renderLogin() {
  const metrics = getDashboardMetrics();
  return `
    <div class="login-shell">
      <div class="login-panel">
        <section class="login-hero">
          <div class="eyebrow">Controle de estoque para obras</div>
          <h1>Gestao enxuta, leitura rapida e decisao com dados.</h1>
          <p>Aplicativo pronto para escritorio e canteiro, acompanhando materiais, consumo, custos e equipes por obra em uma unica base.</p>
          <div class="hero-grid">
            <div class="hero-card"><span>Materiais cadastrados</span><strong>${db.materials.length}</strong></div>
            <div class="hero-card"><span>Colaboradores ativos</span><strong>${metrics.activeCollaborators}</strong></div>
            <div class="hero-card"><span>Estoque com saldo</span><strong>${metrics.materialsInStock}</strong></div>
            <div class="hero-card"><span>Custo aplicado</span><strong>${formatCurrency(metrics.totalApplicationCost)}</strong></div>
          </div>
        </section>
        <section class="login-form">
          <div class="brand-mark">
            <div class="brand-icon">CP</div>
            <div class="brand-copy">
              <strong>Construtora Prime</strong>
              <span>Gestao de materiais e consumo</span>
            </div>
          </div>
          <form class="form-stack" data-form="login">
            <div class="form-field"><label for="login-email">E-mail</label><input id="login-email" name="email" type="email" value="admin@construtoraprime.com" required></div>
            <div class="form-field"><label for="login-password">Senha</label><input id="login-password" name="password" type="password" value="admin123" required></div>
            <button class="btn" type="submit">Entrar no sistema</button>
          </form>
          <div class="helper">Acesso demo: <code>admin@construtoraprime.com</code> / <code>admin123</code></div>
        </section>
      </div>
    </div>
  `;
}

function renderSidebar() {
  const items = [
    ["dashboard", "Dashboard", "01"],
    ["projects", "Obras", "02"],
    ["materials", "Materiais", "03"],
    ["stock", "Estoque", "04"],
    ["consumption", "Aplicacao e consumo", "05"],
    ["team", "Colaboradores", "06"],
    ["reports", "Relatorios", "07"],
    ["settings", "Usuarios", "08"]
  ];
  return `
    <aside class="sidebar">
      <div class="brand-mark">
        <div class="brand-icon">CP</div>
        <div class="brand-copy"><strong>Construtora Prime</strong><span>Sistema de materiais</span></div>
      </div>
      <div class="sidebar-subtitle">Navegacao</div>
      <div class="nav-list">
        ${items.map(([id, label, order]) => `<button class="nav-btn ${appState.currentView === id ? "active" : ""}" data-view="${id}"><span>${label}</span><span>${order}</span></button>`).join("")}
      </div>
      <div class="sidebar-footer">
        <strong>${escapeHtml(appState.currentUser.name)}</strong>
        <span>${escapeHtml(appState.currentUser.role)}</span>
        <span>${db.projects.filter((item) => item.status === "Em andamento").length} obras em andamento</span>
      </div>
    </aside>
  `;
}

function renderTopbar(title, description, extraActions = "") {
  return `
    <div class="topbar">
      <div class="title-block"><h2>${title}</h2><p>${description}</p></div>
      <div class="topbar-actions">${extraActions}<button class="btn-ghost" type="button" data-action="reset-db">Restaurar base demo</button><button class="btn-secondary" type="button" data-action="logout">Sair</button></div>
    </div>
  `;
}

function renderGlobalFilters() {
  return `
    <section class="panel">
      <div class="panel-header">
        <div><h3>Filtros globais</h3><p>Refine indicadores, graficos e relatorios por obra, material, categoria e periodo.</p></div>
        <button class="btn-ghost" type="button" data-action="clear-filters">Limpar filtros</button>
      </div>
      <form class="filters" data-form="global-filters">
        <div class="form-field"><label>Obra</label><select name="projectId"><option value="">Todas</option>${db.projects.map((project) => `<option value="${project.id}" ${appState.filters.projectId === project.id ? "selected" : ""}>${escapeHtml(project.name)}</option>`).join("")}</select></div>
        <div class="form-field"><label>Material</label><select name="materialId"><option value="">Todos</option>${db.materials.map((material) => `<option value="${material.id}" ${appState.filters.materialId === material.id ? "selected" : ""}>${escapeHtml(material.name)}</option>`).join("")}</select></div>
        <div class="form-field"><label>Categoria</label><select name="category"><option value="">Todas</option>${categories.map((category) => `<option value="${category}" ${appState.filters.category === category ? "selected" : ""}>${category}</option>`).join("")}</select></div>
        <div class="form-field"><label>Inicio</label><input type="date" name="periodStart" value="${appState.filters.periodStart}"></div>
        <div class="form-field"><label>Fim</label><input type="date" name="periodEnd" value="${appState.filters.periodEnd}"></div>
      </form>
    </section>
  `;
}

function renderDashboard() {
  const metrics = getDashboardMetrics();
  const lowStockList = metrics.lowStock.slice(0, 5);
  return `
    ${renderTopbar("Dashboard principal", "Visao consolidada de estoque, consumo, custos e equipes por obra.", '<button class="btn" type="button" data-action="print-dashboard">Exportar dashboard em PDF</button>')}
    ${renderGlobalFilters()}
    <section class="stats-grid">
      <div class="stat-card"><div class="stat-label">Total de materiais cadastrados</div><div class="stat-value">${db.materials.length}</div><div class="stat-subtitle">${metrics.materialsInStock} com saldo em estoque</div></div>
      <div class="stat-card"><div class="stat-label">Entradas no periodo</div><div class="stat-value">${formatNumber(metrics.entries.reduce((sum, item) => sum + Number(item.quantity), 0))}</div><div class="stat-subtitle">${formatCurrency(metrics.totalEntryCost)}</div></div>
      <div class="stat-card"><div class="stat-label">Saidas no periodo</div><div class="stat-value">${formatNumber(metrics.exits.reduce((sum, item) => sum + Number(item.quantity), 0))}</div><div class="stat-subtitle">${formatCurrency(metrics.totalExitCost)}</div></div>
      <div class="stat-card"><div class="stat-label">Custo total geral</div><div class="stat-value">${formatCurrency(metrics.totalApplicationCost)}</div><div class="stat-subtitle">Aplicacao registrada nas obras</div></div>
      <div class="stat-card"><div class="stat-label">Consumo total por obra</div><div class="stat-value">${formatNumber(metrics.consumptionByProject.reduce((sum, item) => sum + item.quantity, 0))}</div><div class="stat-subtitle">${metrics.biggestProject ? escapeHtml(metrics.biggestProject.project.name) : "Sem dados"}</div></div>
      <div class="stat-card"><div class="stat-label">Material mais consumido</div><div class="stat-value">${metrics.mostConsumedMaterial ? formatNumber(metrics.mostConsumedMaterial.total) : "0"}</div><div class="stat-subtitle">${metrics.mostConsumedMaterial ? escapeHtml(metrics.mostConsumedMaterial.material.name) : "Sem dados"}</div></div>
      <div class="stat-card"><div class="stat-label">Total de colaboradores</div><div class="stat-value">${metrics.totalCollaborators}</div><div class="stat-subtitle">${metrics.activeCollaborators} ativos em obra</div></div>
      <div class="stat-card"><div class="stat-label">Indicador de desperdicio</div><div class="stat-value">${formatNumber(metrics.wasteRate, 1)}%</div><div class="stat-subtitle">${formatNumber(metrics.wasteQuantity, 0)} unidades acima do previsto</div></div>
    </section>
    <section class="dashboard-grid">
      <div class="panel">
        <div class="panel-header"><div><h3>Consumo e custo por obra</h3><p>Comparativo das obras com maior uso de materiais e impacto financeiro.</p></div><span class="badge">Tempo real local</span></div>
        <div class="mini-list">
          ${metrics.consumptionByProject.map((item) => {
            const activeTeam = db.collaborators.filter((person) => person.projectId === item.project.id && person.status === "Ativo").length;
            return `<div class="mini-item"><div><strong>${escapeHtml(item.project.name)}</strong><span>${activeTeam} colaboradores ativos</span></div><div><strong>${formatNumber(item.quantity)}</strong><span>${formatCurrency(item.cost)}</span></div></div>`;
          }).join("")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-header"><div><h3>Alertas prioritarios</h3><p>Itens abaixo do estoque minimo e indicadores para reposicao.</p></div></div>
        <div class="mini-list">
          ${lowStockList.length ? lowStockList.map((item) => `<div class="mini-item"><div><strong>${escapeHtml(item.name)}</strong><span>Minimo: ${formatNumber(item.minStock)} ${item.unit}</span></div><div><strong>${formatNumber(item.current)} ${item.unit}</strong><span>${formatCurrency(item.totalCostInStock)}</span></div></div>`).join("") : '<div class="empty-state">Nenhum material com estoque baixo.</div>'}
        </div>
      </div>
    </section>
    <section class="charts-grid">
      <div class="chart-card"><div class="chart-header"><div><h3>Consumo por periodo</h3><p>Aplicacao consolidada por data.</p></div></div><div class="canvas-wrap"><canvas id="chart-period"></canvas></div></div>
      <div class="chart-card"><div class="chart-header"><div><h3>Aplicacao por categoria</h3><p>Distribuicao dos materiais aplicados.</p></div></div><div class="canvas-wrap"><canvas id="chart-category"></canvas></div></div>
      <div class="chart-card"><div class="chart-header"><div><h3>Custo por obra</h3><p>Leitura rapida do custo direto de materiais.</p></div></div><div class="canvas-wrap"><canvas id="chart-cost"></canvas></div></div>
    </section>
  `;
}

function renderProjects() {
  const rows = db.projects.map((project) => {
    const activeTeam = db.collaborators.filter((person) => person.projectId === project.id && person.status === "Ativo").length;
    const cost = db.applications.filter((entry) => entry.projectId === project.id).reduce((sum, entry) => sum + Number(entry.quantity) * Number(getMaterial(entry.materialId)?.unitCost || 0), 0);
    return `<tr><td>${escapeHtml(project.name)}</td><td>${escapeHtml(project.type)}</td><td>${escapeHtml(project.stage)}</td><td>${escapeHtml(project.location)}</td><td>${formatDate(project.startDate)}</td><td>${activeTeam}</td><td>${formatCurrency(cost)}</td><td><span class="badge success">${escapeHtml(project.status)}</span></td></tr>`;
  }).join("");
  return `
    ${renderTopbar("Cadastro de obras", "Gestao das obras ativas com local, etapa, responsavel e equipe.", '<button class="btn" type="button" data-action="focus-form" data-target="project-form">Nova obra</button>')}
    <section class="module-grid">
      <section class="panel" id="project-form">
        <div class="panel-header"><div><h3>Nova obra</h3><p>Cadastre frentes residenciais e comerciais com dados essenciais de acompanhamento.</p></div></div>
        <form class="grid-2" data-form="project">
          <div class="form-field"><label>Nome da obra</label><input name="name" required></div>
          <div class="form-field"><label>Tipo</label><select name="type" required><option value="Residencial">Residencial</option><option value="Comercial">Comercial</option><option value="Industrial">Industrial</option></select></div>
          <div class="form-field"><label>Local</label><input name="location" required></div>
          <div class="form-field"><label>Etapa atual</label><input name="stage" required></div>
          <div class="form-field"><label>Responsavel</label><input name="manager" required></div>
          <div class="form-field"><label>Status</label><select name="status" required><option value="Em andamento">Em andamento</option><option value="Planejamento">Planejamento</option><option value="Concluida">Concluida</option></select></div>
          <div class="form-field"><label>Inicio</label><input type="date" name="startDate" required></div>
          <div class="form-field"><label>Previsao de termino</label><input type="date" name="expectedEnd" required></div>
          <div class="form-field"><label>Total de colaboradores previsto</label><input type="number" min="1" name="teamSize" required></div>
          <div class="form-field"><label>&nbsp;</label><button class="btn" type="submit">Salvar obra</button></div>
        </form>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h3>Resumo por obra</h3><p>Visao rapida das frentes, etapa atual e custo direto de materiais.</p></div></div>
        <div class="mini-list">
          ${db.projects.map((project) => {
            const total = db.applications.filter((entry) => entry.projectId === project.id).reduce((sum, entry) => sum + Number(entry.quantity) * Number(getMaterial(entry.materialId)?.unitCost || 0), 0);
            return `<div class="mini-item"><div><strong>${escapeHtml(project.name)}</strong><span>${escapeHtml(project.stage)} • ${escapeHtml(project.location)}</span></div><div><strong>${formatCurrency(total)}</strong><span>${escapeHtml(project.manager)}</span></div></div>`;
          }).join("")}
        </div>
      </section>
    </section>
    <section class="section-spacer"></section>
    <section class="table-wrap">
      <div class="table-header"><div><h3>Obras cadastradas</h3><p>Acompanhamento centralizado para escritorio e canteiro.</p></div></div>
      <div class="table-scroll"><table><thead><tr><th>Obra</th><th>Tipo</th><th>Etapa</th><th>Local</th><th>Inicio</th><th>Ativos</th><th>Custo de materiais</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>
    </section>
  `;
}

function renderMaterials() {
  const stock = calculateStock();
  const rows = db.materials.map((material) => {
    const item = stock[material.id];
    return `<tr><td>${escapeHtml(material.name)}</td><td>${escapeHtml(material.category)}</td><td>${material.unit}</td><td>${formatNumber(item.current)}</td><td>${formatNumber(material.minStock)}</td><td>${formatCurrency(material.unitCost)}</td><td>${formatCurrency(item.totalCostInStock)}</td><td>${getStatusBadge(item.current, material.minStock)}</td></tr>`;
  }).join("");
  return `
    ${renderTopbar("Cadastro de materiais", "Controle central de itens, unidades de medida, custo unitario e estoque minimo.", '<button class="btn" type="button" data-action="focus-form" data-target="material-form">Novo material</button>')}
    <section class="module-grid">
      <section class="panel" id="material-form">
        <div class="panel-header"><div><h3>Novo material</h3><p>Cadastre materiais por categoria para acompanhar estoque e consumo previsto.</p></div></div>
        <form class="grid-2" data-form="material">
          <div class="form-field"><label>Material</label><input name="name" required></div>
          <div class="form-field"><label>Categoria</label><select name="category" required>${categories.map((category) => `<option value="${category}">${category}</option>`).join("")}</select></div>
          <div class="form-field"><label>Unidade</label><select name="unit" required>${units.map((unit) => `<option value="${unit}">${unit}</option>`).join("")}</select></div>
          <div class="form-field"><label>Fornecedor principal</label><select name="supplierId" required>${db.suppliers.map((supplier) => `<option value="${supplier.id}">${escapeHtml(supplier.name)}</option>`).join("")}</select></div>
          <div class="form-field"><label>Estoque minimo</label><input name="minStock" type="number" min="0" step="0.01" required></div>
          <div class="form-field"><label>Custo unitario</label><input name="unitCost" type="number" min="0" step="0.01" required></div>
          <div class="form-field"><label>Consumo previsto total</label><input name="plannedTotal" type="number" min="0" step="0.01" required></div>
          <div class="form-field"><label>&nbsp;</label><button class="btn" type="submit">Salvar material</button></div>
        </form>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h3>Novo fornecedor</h3><p>Cadastre parceiros para compras, entradas e relacionamento comercial.</p></div></div>
        <form class="grid-2" data-form="supplier">
          <div class="form-field"><label>Fornecedor</label><input name="name" required></div>
          <div class="form-field"><label>Contato</label><input name="contact" required></div>
          <div class="form-field"><label>Telefone</label><input name="phone" required></div>
          <div class="form-field"><label>E-mail</label><input type="email" name="email" required></div>
          <div class="form-field"><label>Cidade</label><input name="city" required></div>
          <div class="form-field"><label>Observacoes</label><input name="notes"></div>
          <div class="form-field"><label>&nbsp;</label><button class="btn-secondary" type="submit">Salvar fornecedor</button></div>
        </form>
        <div class="section-spacer"></div>
        <div class="mini-list">
          ${db.suppliers.map((supplier) => `<div class="mini-item"><div><strong>${escapeHtml(supplier.name)}</strong><span>${escapeHtml(supplier.contact)} • ${escapeHtml(supplier.city)}</span></div><div><strong>${escapeHtml(supplier.phone)}</strong><span>${escapeHtml(supplier.email)}</span></div></div>`).join("")}
        </div>
      </section>
    </section>
    <section class="section-spacer"></section>
    <section class="table-wrap">
      <div class="table-header"><div><h3>Materiais cadastrados</h3><p>Saldo atual, custo total e alerta de reposicao por item.</p></div></div>
      <div class="table-scroll"><table><thead><tr><th>Material</th><th>Categoria</th><th>Unidade</th><th>Saldo atual</th><th>Estoque minimo</th><th>Custo unitario</th><th>Custo total em estoque</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>
    </section>
  `;
}

function renderStock() {
  const stock = calculateStock();
  const movements = [...db.stockEntries].sort((a, b) => b.date.localeCompare(a.date));
  const rows = movements.map((movement) => {
    const material = getMaterial(movement.materialId);
    const project = getProject(movement.projectId);
    const supplier = getSupplier(movement.supplierId);
    return `<tr><td>${formatDate(movement.date)}</td><td><span class="badge ${movement.type === "entrada" ? "success" : "warning"}">${getMovementLabel(movement.type)}</span></td><td>${escapeHtml(material?.name || "-")}</td><td>${formatNumber(movement.quantity)} ${material?.unit || ""}</td><td>${project ? escapeHtml(project.name) : "-"}</td><td>${supplier ? escapeHtml(supplier.name) : "-"}</td><td>${escapeHtml(movement.responsible)}</td><td>${escapeHtml(movement.destination || "-")}</td><td>${formatCurrency(Number(movement.quantity) * Number(movement.unitCost))}</td></tr>`;
  }).join("");
  return `
    ${renderTopbar("Controle de estoque", "Registre entradas e saidas com validacao de saldo, responsavel, destino e custo.", '<button class="btn-secondary" type="button" data-action="export-report" data-report="movements">Exportar Excel</button>')}
    <section class="module-grid">
      <section class="panel">
        <div class="panel-header"><div><h3>Registrar entrada</h3><p>Entradas exigem fornecedor, data, valor unitario e quantidade.</p></div></div>
        <form class="grid-2" data-form="stock-entry">
          <div class="form-field"><label>Data</label><input type="date" name="date" value="${todayISO()}" required></div>
          <div class="form-field"><label>Material</label><select name="materialId" required>${db.materials.map((material) => `<option value="${material.id}">${escapeHtml(material.name)}</option>`).join("")}</select></div>
          <div class="form-field"><label>Fornecedor</label><select name="supplierId" required>${db.suppliers.map((supplier) => `<option value="${supplier.id}">${escapeHtml(supplier.name)}</option>`).join("")}</select></div>
          <div class="form-field"><label>Responsavel</label><input name="responsible" value="${escapeHtml(appState.currentUser.name)}" required></div>
          <div class="form-field"><label>Quantidade</label><input type="number" min="0.01" step="0.01" name="quantity" required></div>
          <div class="form-field"><label>Custo unitario</label><input type="number" min="0.01" step="0.01" name="unitCost" required></div>
          <div class="form-field"><label>Destino</label><input name="destination" value="Almoxarifado central" required></div>
          <div class="form-field"><label>Observacoes</label><input name="notes"></div>
          <div class="form-field"><label>&nbsp;</label><button class="btn" type="submit">Lancar entrada</button></div>
        </form>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h3>Registrar saida</h3><p>Saidas bloqueiam quantidade acima do saldo disponivel e exigem destino e responsavel.</p></div></div>
        <form class="grid-2" data-form="stock-exit">
          <div class="form-field"><label>Data</label><input type="date" name="date" value="${todayISO()}" required></div>
          <div class="form-field"><label>Material</label><select name="materialId" required>${db.materials.map((material) => `<option value="${material.id}">${escapeHtml(material.name)} (saldo: ${formatNumber(stock[material.id].current)} ${material.unit})</option>`).join("")}</select></div>
          <div class="form-field"><label>Obra / destino</label><select name="projectId" required>${db.projects.map((project) => `<option value="${project.id}">${escapeHtml(project.name)}</option>`).join("")}</select></div>
          <div class="form-field"><label>Responsavel</label><input name="responsible" value="${escapeHtml(appState.currentUser.name)}" required></div>
          <div class="form-field"><label>Quantidade</label><input type="number" min="0.01" step="0.01" name="quantity" required></div>
          <div class="form-field"><label>Destino fisico</label><input name="destination" required></div>
          <div class="form-field"><label>Observacoes</label><input name="notes"></div>
          <div class="form-field"><label>&nbsp;</label><button class="btn-danger" type="submit">Lancar saida</button></div>
        </form>
      </section>
    </section>
    <section class="section-spacer"></section>
    <section class="table-wrap">
      <div class="table-header"><div><h3>Historico de movimentacoes</h3><p>Registro completo de entradas e saidas com custo, responsavel e destino.</p></div></div>
      <div class="table-scroll"><table><thead><tr><th>Data</th><th>Tipo</th><th>Material</th><th>Quantidade</th><th>Obra</th><th>Fornecedor</th><th>Responsavel</th><th>Destino</th><th>Custo total</th></tr></thead><tbody>${rows}</tbody></table></div>
    </section>
  `;
}

function renderConsumption() {
  const rows = [...db.applications].sort((a, b) => b.date.localeCompare(a.date)).map((entry) => {
    const material = getMaterial(entry.materialId);
    const waste = Math.max(Number(entry.quantity) - Number(entry.predictedQuantity), 0);
    return `<tr><td>${formatDate(entry.date)}</td><td>${escapeHtml(getProject(entry.projectId)?.name || "-")}</td><td>${escapeHtml(material?.name || "-")}</td><td>${escapeHtml(entry.category)}</td><td>${escapeHtml(entry.stage)}</td><td>${formatNumber(entry.predictedQuantity)} ${material?.unit || ""}</td><td>${formatNumber(entry.quantity)} ${material?.unit || ""}</td><td>${formatNumber(waste)} ${material?.unit || ""}</td><td>${formatCurrency(Number(entry.quantity) * Number(material?.unitCost || 0))}</td></tr>`;
  }).join("");
  return `
    ${renderTopbar("Aplicacao e consumo", "Vincule materiais as obras, etapas e categorias para medir previsto, realizado e desperdicio.", '<button class="btn-secondary" type="button" data-action="export-report" data-report="consumption">Exportar Excel</button>')}
    <section class="module-grid">
      <section class="panel">
        <div class="panel-header"><div><h3>Lancar aplicacao</h3><p>Toda aplicacao precisa estar vinculada a uma obra e atualiza automaticamente os indicadores.</p></div></div>
        <form class="grid-2" data-form="application">
          <div class="form-field"><label>Data</label><input type="date" name="date" value="${todayISO()}" required></div>
          <div class="form-field"><label>Obra</label><select name="projectId" required>${db.projects.map((project) => `<option value="${project.id}">${escapeHtml(project.name)}</option>`).join("")}</select></div>
          <div class="form-field"><label>Material</label><select name="materialId" required>${db.materials.map((material) => `<option value="${material.id}">${escapeHtml(material.name)}</option>`).join("")}</select></div>
          <div class="form-field"><label>Categoria</label><select name="category" required>${categories.map((category) => `<option value="${category}">${category}</option>`).join("")}</select></div>
          <div class="form-field"><label>Etapa da obra</label><input name="stage" required></div>
          <div class="form-field"><label>Responsavel</label><input name="responsible" value="${escapeHtml(appState.currentUser.name)}" required></div>
          <div class="form-field"><label>Quantidade prevista</label><input type="number" min="0.01" step="0.01" name="predictedQuantity" required></div>
          <div class="form-field"><label>Quantidade consumida</label><input type="number" min="0.01" step="0.01" name="quantity" required></div>
          <div class="form-field"><label>Observacoes</label><input name="notes"></div>
          <div class="form-field"><label>&nbsp;</label><button class="btn" type="submit">Registrar aplicacao</button></div>
        </form>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h3>Resumo por categoria</h3><p>Comparacao entre material previsto e consumido em cada frente tecnica.</p></div></div>
        <div class="mini-list">
          ${categories.map((category) => {
            const categoryApps = db.applications.filter((item) => item.category === category);
            const predicted = categoryApps.reduce((sum, item) => sum + Number(item.predictedQuantity), 0);
            const actual = categoryApps.reduce((sum, item) => sum + Number(item.quantity), 0);
            const waste = Math.max(actual - predicted, 0);
            return `<div class="mini-item"><div><strong>${category}</strong><span>Previsto ${formatNumber(predicted)} • Real ${formatNumber(actual)}</span></div><div><strong>${formatNumber(waste)}</strong><span>Desperdicio</span></div></div>`;
          }).join("")}
        </div>
      </section>
    </section>
    <section class="section-spacer"></section>
    <section class="table-wrap">
      <div class="table-header"><div><h3>Consumo por obra e etapa</h3><p>Comparativo entre previsto e realizado com identificacao de excesso de consumo.</p></div></div>
      <div class="table-scroll"><table><thead><tr><th>Data</th><th>Obra</th><th>Material</th><th>Categoria</th><th>Etapa</th><th>Previsto</th><th>Consumido</th><th>Desperdicio</th><th>Custo</th></tr></thead><tbody>${rows}</tbody></table></div>
    </section>
  `;
}

function renderTeam() {
  const totalByProject = db.projects.map((project) => ({ project, total: db.collaborators.filter((person) => person.projectId === project.id).length, active: db.collaborators.filter((person) => person.projectId === project.id && person.status === "Ativo").length }));
  const roleSummary = roles.map((role) => ({ role, total: db.collaborators.filter((person) => person.role === role && person.status === "Ativo").length })).filter((item) => item.total > 0);
  return `
    ${renderTopbar("Gestao de colaboradores", "Controle equipe por obra, funcao e disponibilidade ativa.", '<button class="btn" type="button" data-action="focus-form" data-target="team-form">Novo colaborador</button>')}
    <section class="stats-grid">
      <div class="stat-card"><div class="stat-label">Total geral da empresa</div><div class="stat-value">${db.collaborators.length}</div><div class="stat-subtitle">Base cadastrada</div></div>
      <div class="stat-card"><div class="stat-label">Ativos</div><div class="stat-value">${db.collaborators.filter((item) => item.status === "Ativo").length}</div><div class="stat-subtitle">Disponiveis em obra</div></div>
      <div class="stat-card"><div class="stat-label">Obra com maior equipe</div><div class="stat-value">${Math.max(...totalByProject.map((item) => item.active), 0)}</div><div class="stat-subtitle">${escapeHtml([...totalByProject].sort((a, b) => b.active - a.active)[0]?.project.name || "Sem dados")}</div></div>
      <div class="stat-card"><div class="stat-label">Funcoes ativas</div><div class="stat-value">${roleSummary.length}</div><div class="stat-subtitle">Distribuidas nas obras</div></div>
    </section>
    <section class="module-grid">
      <section class="panel" id="team-form">
        <div class="panel-header"><div><h3>Novo colaborador</h3><p>Associe o colaborador a uma obra e funcao para alimentar os dashboards.</p></div></div>
        <form class="grid-2" data-form="collaborator">
          <div class="form-field"><label>Nome</label><input name="name" required></div>
          <div class="form-field"><label>Funcao</label><select name="role" required>${roles.map((role) => `<option value="${role}">${role}</option>`).join("")}</select></div>
          <div class="form-field"><label>Obra</label><select name="projectId" required>${db.projects.map((project) => `<option value="${project.id}">${escapeHtml(project.name)}</option>`).join("")}</select></div>
          <div class="form-field"><label>Status</label><select name="status" required><option value="Ativo">Ativo</option><option value="Inativo">Inativo</option></select></div>
          <div class="form-field"><label>Custo diario</label><input type="number" min="0.01" step="0.01" name="dailyCost" required></div>
          <div class="form-field"><label>Data de admissao</label><input type="date" name="hireDate" required></div>
          <div class="form-field"><label>&nbsp;</label><button class="btn" type="submit">Salvar colaborador</button></div>
        </form>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h3>Equipe por obra</h3><p>Total geral e quantidade de colaboradores ativos por frente.</p></div></div>
        <div class="mini-list">
          ${totalByProject.map((item) => `<div class="mini-item"><div><strong>${escapeHtml(item.project.name)}</strong><span>${item.total} cadastrados</span></div><div><strong>${item.active}</strong><span>Ativos</span></div></div>`).join("")}
        </div>
      </section>
    </section>
    <section class="section-spacer"></section>
    <section class="table-wrap">
      <div class="table-header"><div><h3>Colaboradores cadastrados</h3><p>Controle por obra, funcao, custo diario e situacao.</p></div></div>
      <div class="table-scroll"><table><thead><tr><th>Colaborador</th><th>Funcao</th><th>Obra</th><th>Status</th><th>Custo diario</th><th>Admissao</th></tr></thead><tbody>${db.collaborators.map((person) => `<tr><td>${escapeHtml(person.name)}</td><td>${escapeHtml(person.role)}</td><td>${escapeHtml(getProject(person.projectId)?.name || "-")}</td><td><span class="badge ${person.status === "Ativo" ? "success" : "warning"}">${person.status}</span></td><td>${formatCurrency(person.dailyCost)}</td><td>${formatDate(person.hireDate)}</td></tr>`).join("")}</tbody></table></div>
    </section>
  `;
}

function buildReportRows() {
  const stock = calculateStock();
  const reportMap = {
    movements: {
      title: "Relatorio de entrada e saida de materiais",
      subtitle: "Historico completo das movimentacoes com custos e responsaveis.",
      columns: ["Data", "Tipo", "Material", "Quantidade", "Obra", "Fornecedor", "Responsavel", "Destino", "Custo total"],
      rows: filterGlobal(db.stockEntries).map((movement) => {
        const material = getMaterial(movement.materialId);
        return [formatDate(movement.date), getMovementLabel(movement.type), material?.name || "-", `${formatNumber(movement.quantity)} ${material?.unit || ""}`, getProject(movement.projectId)?.name || "-", getSupplier(movement.supplierId)?.name || "-", movement.responsible, movement.destination || "-", formatCurrency(Number(movement.quantity) * Number(movement.unitCost))];
      })
    },
    consumption: {
      title: "Relatorio de consumo por obra",
      subtitle: "Comparativo entre previsto e aplicado por obra, etapa e material.",
      columns: ["Data", "Obra", "Material", "Categoria", "Etapa", "Previsto", "Consumido", "Desperdicio", "Custo"],
      rows: filterGlobal(db.applications, { category: "category" }).map((entry) => {
        const material = getMaterial(entry.materialId);
        return [formatDate(entry.date), getProject(entry.projectId)?.name || "-", material?.name || "-", entry.category, entry.stage, `${formatNumber(entry.predictedQuantity)} ${material?.unit || ""}`, `${formatNumber(entry.quantity)} ${material?.unit || ""}`, `${formatNumber(Math.max(Number(entry.quantity) - Number(entry.predictedQuantity), 0))} ${material?.unit || ""}`, formatCurrency(Number(entry.quantity) * Number(material?.unitCost || 0))];
      })
    },
    category: {
      title: "Relatorio de aplicacao por categoria",
      subtitle: "Totais e custos agregados por frente tecnica.",
      columns: ["Categoria", "Aplicacoes", "Quantidade total", "Previsto total", "Desperdicio", "Custo"],
      rows: categories.map((category) => {
        const entries = filterGlobal(db.applications, { category: "category" }).filter((item) => item.category === category);
        const actual = entries.reduce((sum, item) => sum + Number(item.quantity), 0);
        const predicted = entries.reduce((sum, item) => sum + Number(item.predictedQuantity), 0);
        const cost = entries.reduce((sum, item) => sum + Number(item.quantity) * Number(getMaterial(item.materialId)?.unitCost || 0), 0);
        return [category, entries.length, formatNumber(actual), formatNumber(predicted), formatNumber(Math.max(actual - predicted, 0)), formatCurrency(cost)];
      })
    },
    cost: {
      title: "Relatorio de custo por material",
      subtitle: "Custos unitarios, valor em estoque e custo aplicado por item.",
      columns: ["Material", "Categoria", "Unidade", "Custo unitario", "Saldo atual", "Valor em estoque", "Custo aplicado"],
      rows: db.materials.map((material) => {
        const item = stock[material.id];
        const appliedCost = db.applications.filter((entry) => entry.materialId === material.id).reduce((sum, entry) => sum + Number(entry.quantity) * Number(material.unitCost), 0);
        return [material.name, material.category, material.unit, formatCurrency(material.unitCost), formatNumber(item.current), formatCurrency(item.totalCostInStock), formatCurrency(appliedCost)];
      })
    },
    inventory: {
      title: "Relatorio de estoque atual",
      subtitle: "Saldo em estoque, minimo, entradas, saidas e status do item.",
      columns: ["Material", "Categoria", "Saldo atual", "Minimo", "Entradas", "Saidas", "Status"],
      rows: Object.values(stock).map((item) => [item.name, item.category, `${formatNumber(item.current)} ${item.unit}`, `${formatNumber(item.minStock)} ${item.unit}`, formatNumber(item.entries), formatNumber(item.exits), item.current <= item.minStock ? "Estoque baixo" : "Ok"])
    },
    team: {
      title: "Relatorio de colaboradores por obra",
      subtitle: "Distribuicao do quadro operacional da empresa.",
      columns: ["Colaborador", "Funcao", "Obra", "Status", "Custo diario", "Admissao"],
      rows: db.collaborators.map((person) => [person.name, person.role, getProject(person.projectId)?.name || "-", person.status, formatCurrency(person.dailyCost), formatDate(person.hireDate)])
    }
  };
  return reportMap[appState.reportType];
}

function renderReports() {
  const report = buildReportRows();
  return `
    ${renderTopbar("Relatorios", "Filtros por obra, periodo, material e categoria com exportacao em PDF e Excel.", '<button class="btn-secondary" type="button" data-action="export-report" data-report="' + appState.reportType + '">Exportar Excel</button><button class="btn" type="button" data-action="print-report">Exportar PDF</button>')}
    ${renderGlobalFilters()}
    <section class="panel">
      <div class="panel-header"><div><h3>Tipo de relatorio</h3><p>Escolha o recorte desejado para analise e exportacao.</p></div></div>
      <form class="toolbar" data-form="report-picker">
        <div class="form-field">
          <label>Relatorio</label>
          <select name="reportType">
            <option value="movements" ${appState.reportType === "movements" ? "selected" : ""}>Entrada e saida de materiais</option>
            <option value="consumption" ${appState.reportType === "consumption" ? "selected" : ""}>Consumo por obra</option>
            <option value="category" ${appState.reportType === "category" ? "selected" : ""}>Aplicacao por categoria</option>
            <option value="cost" ${appState.reportType === "cost" ? "selected" : ""}>Custo por material</option>
            <option value="inventory" ${appState.reportType === "inventory" ? "selected" : ""}>Estoque atual</option>
            <option value="team" ${appState.reportType === "team" ? "selected" : ""}>Colaboradores por obra</option>
          </select>
        </div>
      </form>
    </section>
    <section class="section-spacer"></section>
    <section class="table-wrap" id="report-area">
      <div class="table-header"><div><h3>${report.title}</h3><p>${report.subtitle}</p></div></div>
      <div class="table-scroll">
        <table>
          <thead><tr>${report.columns.map((column) => `<th>${column}</th>`).join("")}</tr></thead>
          <tbody>${report.rows.length ? report.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${report.columns.length}"><div class="empty-state">Nenhum dado encontrado para os filtros atuais.</div></td></tr>`}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderSettings() {
  return `
    ${renderTopbar("Usuarios do sistema", "Controle simples de acessos para a empresa de pequeno porte.", '<button class="btn" type="button" data-action="focus-form" data-target="user-form">Novo usuario</button>')}
    <section class="module-grid">
      <section class="panel" id="user-form">
        <div class="panel-header"><div><h3>Novo usuario</h3><p>Cadastre perfis de acesso com nome, e-mail, funcao e senha.</p></div></div>
        <form class="grid-2" data-form="user">
          <div class="form-field"><label>Nome</label><input name="name" required></div>
          <div class="form-field"><label>E-mail</label><input type="email" name="email" required></div>
          <div class="form-field"><label>Perfil</label><select name="role" required><option value="Administrador">Administrador</option><option value="Gestor de obras">Gestor de obras</option><option value="Compras">Compras</option><option value="Almoxarife">Almoxarife</option></select></div>
          <div class="form-field"><label>Senha</label><input type="password" name="password" required></div>
          <div class="form-field"><label>&nbsp;</label><button class="btn" type="submit">Salvar usuario</button></div>
        </form>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h3>Resumo de acesso</h3><p>Usuarios prontos para operar escritorio e canteiro com seguranca basica.</p></div></div>
        <div class="mini-list">${db.users.map((user) => `<div class="mini-item"><div><strong>${escapeHtml(user.name)}</strong><span>${escapeHtml(user.email)}</span></div><div><strong>${escapeHtml(user.role)}</strong><span>${user.active ? "Ativo" : "Inativo"}</span></div></div>`).join("")}</div>
      </section>
    </section>
    <section class="section-spacer"></section>
    <section class="table-wrap">
      <div class="table-header"><div><h3>Usuarios cadastrados</h3><p>Base simples para demonstracao do login e perfis da equipe.</p></div></div>
      <div class="table-scroll"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Status</th></tr></thead><tbody>${db.users.map((user) => `<tr><td>${escapeHtml(user.name)}</td><td>${escapeHtml(user.email)}</td><td>${escapeHtml(user.role)}</td><td><span class="badge ${user.active ? "success" : "warning"}">${user.active ? "Ativo" : "Inativo"}</span></td></tr>`).join("")}</tbody></table></div>
    </section>
  `;
}

function renderView() {
  if (!appState.currentUser) return renderLogin();
  const views = { dashboard: renderDashboard, projects: renderProjects, materials: renderMaterials, stock: renderStock, consumption: renderConsumption, team: renderTeam, reports: renderReports, settings: renderSettings };
  return `<div class="app-shell">${renderSidebar()}<main class="content">${views[appState.currentView]()}</main><div class="toast-area" id="toast-area"></div></div>`;
}

function render() {
  document.getElementById("app").innerHTML = renderView();
  bindEvents();
  if (appState.currentUser && appState.currentView === "dashboard") renderDashboardCharts();
}

function toast(message, type = "success") {
  const area = document.getElementById("toast-area");
  if (!area) return;
  const element = document.createElement("div");
  element.className = `toast ${type}`;
  element.textContent = message;
  area.appendChild(element);
  setTimeout(() => element.remove(), 3200);
}

function requireValue(value, message) {
  if (!String(value || "").trim()) throw new Error(message);
}

function handleLogin(form) {
  const email = form.email.value.trim().toLowerCase();
  const password = form.password.value;
  const user = db.users.find((item) => item.email.toLowerCase() === email && item.password === password && item.active);
  if (!user) throw new Error("Credenciais invalidas. Use o acesso demo informado na tela.");
  appState.currentUser = user;
  appState.currentView = "dashboard";
  render();
  toast(`Bem-vindo, ${user.name}.`, "success");
}

function handleProject(form) {
  requireValue(form.name.value, "Informe o nome da obra.");
  requireValue(form.location.value, "Informe o local da obra.");
  db.projects.unshift({ id: uid("obra"), name: form.name.value.trim(), type: form.type.value, location: form.location.value.trim(), stage: form.stage.value.trim(), manager: form.manager.value.trim(), status: form.status.value, startDate: form.startDate.value, expectedEnd: form.expectedEnd.value, teamSize: parseNumber(form.teamSize.value) });
  saveDB(db);
  render();
  toast("Obra cadastrada com sucesso.");
}

function handleMaterial(form) {
  requireValue(form.name.value, "Informe o nome do material.");
  db.materials.unshift({ id: uid("mat"), name: form.name.value.trim(), category: form.category.value, unit: form.unit.value, supplierId: form.supplierId.value, minStock: parseNumber(form.minStock.value), unitCost: parseNumber(form.unitCost.value), plannedTotal: parseNumber(form.plannedTotal.value) });
  saveDB(db);
  render();
  toast("Material cadastrado com sucesso.");
}

function handleSupplier(form) {
  requireValue(form.name.value, "Informe o nome do fornecedor.");
  db.suppliers.unshift({ id: uid("forn"), name: form.name.value.trim(), contact: form.contact.value.trim(), phone: form.phone.value.trim(), email: form.email.value.trim(), city: form.city.value.trim(), notes: form.notes.value.trim() });
  saveDB(db);
  render();
  toast("Fornecedor cadastrado com sucesso.");
}

function handleStockEntry(form) {
  const material = getMaterial(form.materialId.value);
  const quantity = parseNumber(form.quantity.value);
  const unitCost = parseNumber(form.unitCost.value);
  if (quantity <= 0 || unitCost <= 0) throw new Error("Quantidade e custo unitario devem ser maiores que zero.");
  db.stockEntries.unshift({ id: uid("mov"), type: "entrada", date: form.date.value, materialId: form.materialId.value, quantity, unitCost, supplierId: form.supplierId.value, projectId: "", responsible: form.responsible.value.trim(), destination: form.destination.value.trim(), notes: form.notes.value.trim() });
  material.unitCost = unitCost;
  saveDB(db);
  render();
  toast("Entrada registrada com sucesso.");
}

function handleStockExit(form) {
  const material = getMaterial(form.materialId.value);
  const quantity = parseNumber(form.quantity.value);
  requireValue(form.projectId.value, "Toda saida deve registrar a obra de destino.");
  requireValue(form.responsible.value, "Toda saida deve registrar o responsavel.");
  requireValue(form.destination.value, "Toda saida deve registrar o destino.");
  const currentStock = calculateStock()[material.id].current;
  if (quantity <= 0) throw new Error("Quantidade de saida deve ser maior que zero.");
  if (quantity > currentStock) throw new Error(`Saida bloqueada. Estoque disponivel: ${formatNumber(currentStock)} ${material.unit}.`);
  db.stockEntries.unshift({ id: uid("mov"), type: "saida", date: form.date.value, materialId: form.materialId.value, quantity, unitCost: material.unitCost, supplierId: "", projectId: form.projectId.value, responsible: form.responsible.value.trim(), destination: form.destination.value.trim(), notes: form.notes.value.trim() });
  saveDB(db);
  render();
  toast("Saida registrada com sucesso.", "warning");
}

function handleApplication(form) {
  requireValue(form.projectId.value, "Toda aplicacao deve estar vinculada a uma obra.");
  const material = getMaterial(form.materialId.value);
  const quantity = parseNumber(form.quantity.value);
  const predictedQuantity = parseNumber(form.predictedQuantity.value);
  if (quantity <= 0 || predictedQuantity <= 0) throw new Error("Previsto e consumido devem ser maiores que zero.");
  db.applications.unshift({ id: uid("apl"), date: form.date.value, projectId: form.projectId.value, materialId: form.materialId.value, category: form.category.value, stage: form.stage.value.trim(), quantity, predictedQuantity, responsible: form.responsible.value.trim(), notes: form.notes.value.trim() });
  saveDB(db);
  render();
  const waste = Math.max(quantity - predictedQuantity, 0);
  toast(waste > 0 ? `Aplicacao registrada com alerta de desperdicio: ${formatNumber(waste)} ${material.unit}.` : "Aplicacao registrada com sucesso.", waste > 0 ? "warning" : "success");
}

function handleCollaborator(form) {
  db.collaborators.unshift({ id: uid("col"), name: form.name.value.trim(), role: form.role.value, projectId: form.projectId.value, status: form.status.value, dailyCost: parseNumber(form.dailyCost.value), hireDate: form.hireDate.value });
  saveDB(db);
  render();
  toast("Colaborador cadastrado com sucesso.");
}

function handleUser(form) {
  const email = form.email.value.trim().toLowerCase();
  if (db.users.some((user) => user.email.toLowerCase() === email)) throw new Error("Ja existe um usuario com este e-mail.");
  db.users.unshift({ id: uid("usr"), name: form.name.value.trim(), email, role: form.role.value, password: form.password.value, active: true });
  saveDB(db);
  render();
  toast("Usuario cadastrado com sucesso.");
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.currentView = button.dataset.view;
      render();
    });
  });

  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      try {
        const handlers = { login: handleLogin, project: handleProject, material: handleMaterial, supplier: handleSupplier, "stock-entry": handleStockEntry, "stock-exit": handleStockExit, application: handleApplication, collaborator: handleCollaborator, user: handleUser };
        handlers[form.dataset.form]?.(form);
      } catch (error) {
        toast(error.message, "error");
      }
    });
  });

  const globalFilterForm = document.querySelector('[data-form="global-filters"]');
  if (globalFilterForm) {
    globalFilterForm.addEventListener("change", () => {
      appState.filters = { projectId: globalFilterForm.projectId.value, materialId: globalFilterForm.materialId.value, category: globalFilterForm.category.value, periodStart: globalFilterForm.periodStart.value, periodEnd: globalFilterForm.periodEnd.value };
      render();
    });
  }

  const reportPicker = document.querySelector('[data-form="report-picker"]');
  if (reportPicker) {
    reportPicker.addEventListener("change", () => {
      appState.reportType = reportPicker.reportType.value;
      render();
    });
  }

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "logout") {
        appState.currentUser = null;
        render();
      }
      if (action === "reset-db") resetDB();
      if (action === "clear-filters") {
        appState.filters = { projectId: "", materialId: "", category: "", periodStart: "", periodEnd: "" };
        render();
      }
      if (action === "focus-form") document.getElementById(button.dataset.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (action === "export-report") exportReport(button.dataset.report || appState.reportType);
      if (action === "print-report" || action === "print-dashboard") window.print();
    });
  });
}

function exportReport(type) {
  const previous = appState.reportType;
  appState.reportType = type;
  const report = buildReportRows();
  appState.reportType = previous;
  const csv = [report.columns.join(";"), ...report.rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";"))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${normalize(report.title).replace(/\s+/g, "-")}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  toast("Relatorio exportado em formato Excel/CSV.", "success");
}

function drawBarChart(canvas, labels, values, color) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.parentElement.clientWidth;
  const height = canvas.parentElement.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  const padding = 28;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const max = Math.max(...values, 1);
  const barWidth = chartWidth / Math.max(values.length, 1) - 16;
  ctx.font = '12px "Segoe UI", sans-serif';
  ctx.fillStyle = "#6d7782";
  ctx.strokeStyle = "rgba(190, 168, 133, 0.45)";
  for (let i = 0; i < 4; i += 1) {
    const y = padding + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
  values.forEach((value, index) => {
    const x = padding + index * (barWidth + 16) + 8;
    const barHeight = (value / max) * (chartHeight - 28);
    const y = height - padding - barHeight;
    const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(164, 75, 33, 0.24)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, Math.max(barWidth, 16), barHeight, 12);
    ctx.fill();
    ctx.fillStyle = "#6d7782";
    ctx.fillText(labels[index], x, height - 10);
  });
}

function renderDashboardCharts() {
  const metrics = getDashboardMetrics();
  const groupedPeriod = {};
  metrics.applications.forEach((item) => {
    groupedPeriod[item.date] = (groupedPeriod[item.date] || 0) + Number(item.quantity);
  });
  const periodEntries = Object.entries(groupedPeriod).sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
  drawBarChart(document.getElementById("chart-period"), periodEntries.map(([date]) => formatDate(date).slice(0, 5)), periodEntries.map(([, total]) => total), "#284b63");
  drawBarChart(document.getElementById("chart-category"), metrics.categoryTotals.map((item) => item.category.split(" ")[0]), metrics.categoryTotals.map((item) => item.total), "#a44b21");
  drawBarChart(document.getElementById("chart-cost"), metrics.consumptionByProject.map((item) => item.project.name.split(" ")[0]), metrics.consumptionByProject.map((item) => item.cost), "#236c4f");
}

window.addEventListener("resize", () => {
  if (appState.currentUser && appState.currentView === "dashboard") renderDashboardCharts();
});

render();
