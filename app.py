from datetime import date

import pandas as pd
import streamlit as st


st.set_page_config(
    page_title="Construtora Prime | Gestão de Materiais",
    page_icon="🏗️",
    layout="wide",
    initial_sidebar_state="expanded",
)


def seed_data():
    return {
        "projects": [
            {"id": "obra-01", "name": "Residencial Solar das Palmeiras", "type": "Residencial", "location": "Campinas/SP", "stage": "Estrutura", "manager": "Carlos Menezes", "status": "Em andamento"},
            {"id": "obra-02", "name": "Centro Comercial Vista Norte", "type": "Comercial", "location": "Sumare/SP", "stage": "Instalações", "manager": "Marina Rocha", "status": "Em andamento"},
            {"id": "obra-03", "name": "Condomínio Parque das Águas", "type": "Residencial", "location": "Hortolândia/SP", "stage": "Acabamento", "manager": "Renato Alves", "status": "Em andamento"},
        ],
        "suppliers": [
            {"id": "forn-01", "name": "Casa do Cimento", "contact": "Luciana", "phone": "(19) 3322-4455", "city": "Campinas/SP"},
            {"id": "forn-02", "name": "Hidro Forte", "contact": "Edson", "phone": "(19) 3441-1122", "city": "Sumaré/SP"},
            {"id": "forn-03", "name": "Eletro Obra", "contact": "Bianca", "phone": "(19) 3665-7841", "city": "Campinas/SP"},
            {"id": "forn-04", "name": "Acabamentos Delta", "contact": "Rafael", "phone": "(19) 3777-9021", "city": "Americana/SP"},
        ],
        "materials": [
            {"id": "mat-01", "name": "Cimento CP II", "category": "Construção civil", "unit": "saco", "min_stock": 150, "unit_cost": 38.9, "supplier_id": "forn-01", "planned_total": 1200},
            {"id": "mat-02", "name": "Areia média", "category": "Construção civil", "unit": "m3", "min_stock": 25, "unit_cost": 148.0, "supplier_id": "forn-01", "planned_total": 210},
            {"id": "mat-03", "name": "Brita 1", "category": "Construção civil", "unit": "m3", "min_stock": 20, "unit_cost": 165.0, "supplier_id": "forn-01", "planned_total": 180},
            {"id": "mat-04", "name": "Tijolo baiano", "category": "Construção civil", "unit": "unidade", "min_stock": 5000, "unit_cost": 1.12, "supplier_id": "forn-01", "planned_total": 60000},
            {"id": "mat-05", "name": "Tubo PVC 50mm", "category": "Hidráulica", "unit": "barra", "min_stock": 40, "unit_cost": 56.5, "supplier_id": "forn-02", "planned_total": 320},
            {"id": "mat-06", "name": "Fio 2,5mm", "category": "Elétrica", "unit": "metro", "min_stock": 600, "unit_cost": 3.95, "supplier_id": "forn-03", "planned_total": 8200},
            {"id": "mat-07", "name": "Tinta acrílica branca", "category": "Acabamento", "unit": "litro", "min_stock": 120, "unit_cost": 24.8, "supplier_id": "forn-04", "planned_total": 980},
            {"id": "mat-08", "name": "Piso porcelanato 60x60", "category": "Acabamento", "unit": "m2", "min_stock": 90, "unit_cost": 72.0, "supplier_id": "forn-04", "planned_total": 760},
        ],
        "collaborators": [
            {"id": "col-01", "name": "João Batista", "role": "Pedreiro", "project_id": "obra-01", "status": "Ativo", "daily_cost": 210},
            {"id": "col-02", "name": "Luis Fernando", "role": "Servente", "project_id": "obra-01", "status": "Ativo", "daily_cost": 140},
            {"id": "col-03", "name": "Paulo Vitor", "role": "Eletricista", "project_id": "obra-02", "status": "Ativo", "daily_cost": 240},
            {"id": "col-04", "name": "André Souza", "role": "Encanador", "project_id": "obra-02", "status": "Ativo", "daily_cost": 235},
            {"id": "col-05", "name": "Marcos Lima", "role": "Pintor", "project_id": "obra-03", "status": "Ativo", "daily_cost": 215},
            {"id": "col-06", "name": "Célia Moraes", "role": "Mestre de obras", "project_id": "obra-03", "status": "Ativo", "daily_cost": 310},
        ],
        "movements": [
            {"id": "mov-01", "type": "Entrada", "date": "2026-03-01", "material_id": "mat-01", "quantity": 350, "unit_cost": 38.9, "supplier_id": "forn-01", "project_id": "", "responsible": "Administrador", "destination": "Almoxarifado central"},
            {"id": "mov-02", "type": "Entrada", "date": "2026-03-02", "material_id": "mat-02", "quantity": 70, "unit_cost": 148.0, "supplier_id": "forn-01", "project_id": "", "responsible": "Administrador", "destination": "Almoxarifado central"},
            {"id": "mov-03", "type": "Entrada", "date": "2026-03-03", "material_id": "mat-06", "quantity": 3000, "unit_cost": 3.95, "supplier_id": "forn-03", "project_id": "", "responsible": "Administrador", "destination": "Almoxarifado central"},
            {"id": "mov-04", "type": "Entrada", "date": "2026-03-04", "material_id": "mat-05", "quantity": 120, "unit_cost": 56.5, "supplier_id": "forn-02", "project_id": "", "responsible": "Administrador", "destination": "Almoxarifado central"},
            {"id": "mov-05", "type": "Saída", "date": "2026-03-11", "material_id": "mat-01", "quantity": 110, "unit_cost": 38.9, "supplier_id": "", "project_id": "obra-01", "responsible": "Fábio Nunes", "destination": "Fundação bloco A"},
            {"id": "mov-06", "type": "Saída", "date": "2026-03-14", "material_id": "mat-06", "quantity": 920, "unit_cost": 3.95, "supplier_id": "", "project_id": "obra-02", "responsible": "Priscila Ramos", "destination": "Quadro geral"},
            {"id": "mov-07", "type": "Saída", "date": "2026-03-18", "material_id": "mat-07", "quantity": 105, "unit_cost": 24.8, "supplier_id": "", "project_id": "obra-03", "responsible": "Marcos Lima", "destination": "Pavimento 3"},
            {"id": "mov-08", "type": "Saída", "date": "2026-03-19", "material_id": "mat-08", "quantity": 78, "unit_cost": 72.0, "supplier_id": "", "project_id": "obra-03", "responsible": "Marcos Lima", "destination": "Apartamentos finais"},
        ],
        "applications": [
            {"id": "apl-01", "date": "2026-03-11", "project_id": "obra-01", "material_id": "mat-01", "category": "Construção civil", "stage": "Fundação", "quantity": 100, "predicted_quantity": 92, "responsible": "Carlos Menezes"},
            {"id": "apl-02", "date": "2026-03-14", "project_id": "obra-02", "material_id": "mat-06", "category": "Elétrica", "stage": "Infra elétrica", "quantity": 880, "predicted_quantity": 810, "responsible": "Marina Rocha"},
            {"id": "apl-03", "date": "2026-03-18", "project_id": "obra-03", "material_id": "mat-07", "category": "Acabamento", "stage": "Pintura", "quantity": 98, "predicted_quantity": 90, "responsible": "Renato Alves"},
            {"id": "apl-04", "date": "2026-03-19", "project_id": "obra-03", "material_id": "mat-08", "category": "Acabamento", "stage": "Revestimento", "quantity": 74, "predicted_quantity": 70, "responsible": "Renato Alves"},
        ],
    }


def init_state():
    if "db" not in st.session_state:
        st.session_state.db = seed_data()


def df(key):
    return pd.DataFrame(st.session_state.db[key])


def project_name(project_id):
    projects = {item["id"]: item["name"] for item in st.session_state.db["projects"]}
    return projects.get(project_id, "-")


def material_name(material_id):
    materials = {item["id"]: item["name"] for item in st.session_state.db["materials"]}
    return materials.get(material_id, "-")


def supplier_name(supplier_id):
    suppliers = {item["id"]: item["name"] for item in st.session_state.db["suppliers"]}
    return suppliers.get(supplier_id, "-")


def material_lookup():
    return {item["id"]: item for item in st.session_state.db["materials"]}


def stock_df():
    materials = df("materials").copy()
    movements = df("movements").copy()
    if movements.empty:
        movements = pd.DataFrame(columns=["material_id", "type", "quantity"])
    entries = movements[movements["type"] == "Entrada"].groupby("material_id")["quantity"].sum()
    exits = movements[movements["type"] == "Saída"].groupby("material_id")["quantity"].sum()
    materials["entries"] = materials["id"].map(entries).fillna(0.0)
    materials["exits"] = materials["id"].map(exits).fillna(0.0)
    materials["current_stock"] = materials["entries"] - materials["exits"]
    materials["stock_value"] = materials["current_stock"] * materials["unit_cost"]
    materials["status"] = materials.apply(lambda row: "Baixo" if row["current_stock"] <= row["min_stock"] else "OK", axis=1)
    return materials


def application_df():
    apps = df("applications").copy()
    if apps.empty:
        return apps
    mats = material_lookup()
    apps["project"] = apps["project_id"].map(project_name)
    apps["material"] = apps["material_id"].map(material_name)
    apps["unit_cost"] = apps["material_id"].map(lambda x: mats[x]["unit_cost"])
    apps["cost"] = apps["quantity"] * apps["unit_cost"]
    apps["waste"] = (apps["quantity"] - apps["predicted_quantity"]).clip(lower=0)
    return apps


def movement_df():
    mov = df("movements").copy()
    if mov.empty:
        return mov
    mov["material"] = mov["material_id"].map(material_name)
    mov["project"] = mov["project_id"].map(project_name)
    mov["supplier"] = mov["supplier_id"].map(supplier_name)
    mov["total_cost"] = mov["quantity"] * mov["unit_cost"]
    return mov


def add_record(key, payload):
    st.session_state.db[key].insert(0, payload)


def brl(value):
    return f"R$ {value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def sidebar_filters(apps):
    st.sidebar.title("Construtora Prime")
    st.sidebar.caption("Gestão de materiais para obras")
    projects = ["Todas"] + list(df("projects")["name"])
    categories = ["Todas"] + sorted(df("materials")["category"].unique().tolist())
    selected_project = st.sidebar.selectbox("Obra", projects)
    selected_category = st.sidebar.selectbox("Categoria", categories)
    start = st.sidebar.date_input("Data inicial", value=date(2026, 3, 1))
    end = st.sidebar.date_input("Data final", value=date(2026, 3, 31))
    filtered = apps.copy()
    if not filtered.empty:
        filtered["date"] = pd.to_datetime(filtered["date"])
        filtered = filtered[(filtered["date"].dt.date >= start) & (filtered["date"].dt.date <= end)]
        if selected_project != "Todas":
            filtered = filtered[filtered["project"] == selected_project]
        if selected_category != "Todas":
            filtered = filtered[filtered["category"] == selected_category]
    return filtered, selected_project, selected_category


def dashboard_tab():
    stock = stock_df()
    apps = application_df()
    filtered_apps, _, _ = sidebar_filters(apps)
    movements = movement_df()
    low_stock = stock[stock["current_stock"] <= stock["min_stock"]]
    total_collaborators = len(st.session_state.db["collaborators"])
    total_cost = filtered_apps["cost"].sum() if not filtered_apps.empty else 0
    total_waste = filtered_apps["waste"].sum() if not filtered_apps.empty else 0
    biggest_project = filtered_apps.groupby("project")["quantity"].sum().sort_values(ascending=False)
    most_material = filtered_apps.groupby("material")["quantity"].sum().sort_values(ascending=False)

    st.title("Dashboard principal")
    st.caption("Indicadores de estoque, consumo, custos e equipes para tomada de decisão.")

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Materiais cadastrados", len(stock), f"{(stock['current_stock'] > 0).sum()} com saldo")
    c2.metric("Entradas", int(movements[movements["type"] == "Entrada"]["quantity"].sum()))
    c3.metric("Saídas", int(movements[movements["type"] == "Saída"]["quantity"].sum()))
    c4.metric("Custo total", brl(total_cost))

    c5, c6, c7, c8 = st.columns(4)
    c5.metric("Colaboradores", total_collaborators)
    c6.metric("Estoque baixo", len(low_stock))
    c7.metric("Desperdício", f"{total_waste:.0f}")
    c8.metric("Obra com maior consumo", biggest_project.index[0] if not biggest_project.empty else "-")

    left, right = st.columns([1.4, 1])
    with left:
        st.subheader("Consumo por obra")
        if not filtered_apps.empty:
            by_project = filtered_apps.groupby("project")["quantity"].sum().sort_values(ascending=False)
            st.bar_chart(by_project)
            st.subheader("Custo por obra")
            st.bar_chart(filtered_apps.groupby("project")["cost"].sum().sort_values(ascending=False))
        else:
            st.info("Sem dados para os filtros selecionados.")
    with right:
        st.subheader("Aplicação por categoria")
        if not filtered_apps.empty:
            st.bar_chart(filtered_apps.groupby("category")["quantity"].sum().sort_values(ascending=False))
        st.subheader("Materiais com estoque baixo")
        if low_stock.empty:
            st.success("Nenhum material abaixo do mínimo.")
        else:
            st.dataframe(low_stock[["name", "category", "current_stock", "min_stock", "status"]], use_container_width=True, hide_index=True)

    st.subheader("Resumo operacional")
    summary = stock[["name", "category", "current_stock", "min_stock", "unit_cost", "stock_value", "status"]].rename(
        columns={
            "name": "Material",
            "category": "Categoria",
            "current_stock": "Saldo atual",
            "min_stock": "Estoque mínimo",
            "unit_cost": "Custo unitário",
            "stock_value": "Valor em estoque",
            "status": "Status",
        }
    )
    st.dataframe(summary, use_container_width=True, hide_index=True)

    if not most_material.empty:
        st.caption(f"Material mais consumido: {most_material.index[0]}")


def registrations_tab():
    st.title("Cadastros")
    tab1, tab2, tab3, tab4 = st.tabs(["Obras", "Materiais", "Fornecedores", "Colaboradores"])

    with tab1:
        with st.form("project_form", clear_on_submit=True):
            c1, c2 = st.columns(2)
            name = c1.text_input("Nome da obra")
            location = c2.text_input("Local")
            c3, c4, c5 = st.columns(3)
            project_type = c3.selectbox("Tipo", ["Residencial", "Comercial", "Industrial"])
            stage = c4.text_input("Etapa")
            manager = c5.text_input("Responsável")
            submitted = st.form_submit_button("Salvar obra")
            if submitted and name and location:
                add_record("projects", {"id": f"obra-{len(st.session_state.db['projects'])+1:02d}", "name": name, "type": project_type, "location": location, "stage": stage, "manager": manager, "status": "Em andamento"})
                st.success("Obra cadastrada.")
        st.dataframe(df("projects"), use_container_width=True, hide_index=True)

    with tab2:
        with st.form("material_form", clear_on_submit=True):
            c1, c2, c3 = st.columns(3)
            name = c1.text_input("Material")
            category = c2.selectbox("Categoria", ["Construção civil", "Elétrica", "Hidráulica", "Acabamento"])
            unit = c3.selectbox("Unidade", ["saco", "m3", "m2", "barra", "litro", "unidade", "kg", "metro"])
            c4, c5, c6 = st.columns(3)
            min_stock = c4.number_input("Estoque mínimo", min_value=0.0)
            unit_cost = c5.number_input("Custo unitário", min_value=0.0)
            planned_total = c6.number_input("Consumo previsto", min_value=0.0)
            supplier = st.selectbox("Fornecedor", df("suppliers")["name"])
            submitted = st.form_submit_button("Salvar material")
            if submitted and name:
                supplier_id = df("suppliers").loc[df("suppliers")["name"] == supplier, "id"].iloc[0]
                add_record("materials", {"id": f"mat-{len(st.session_state.db['materials'])+1:02d}", "name": name, "category": category, "unit": unit, "min_stock": min_stock, "unit_cost": unit_cost, "supplier_id": supplier_id, "planned_total": planned_total})
                st.success("Material cadastrado.")
        st.dataframe(stock_df()[["name", "category", "unit", "current_stock", "min_stock", "unit_cost", "status"]], use_container_width=True, hide_index=True)

    with tab3:
        with st.form("supplier_form", clear_on_submit=True):
            c1, c2 = st.columns(2)
            name = c1.text_input("Fornecedor")
            contact = c2.text_input("Contato")
            c3, c4 = st.columns(2)
            phone = c3.text_input("Telefone")
            city = c4.text_input("Cidade")
            submitted = st.form_submit_button("Salvar fornecedor")
            if submitted and name:
                add_record("suppliers", {"id": f"forn-{len(st.session_state.db['suppliers'])+1:02d}", "name": name, "contact": contact, "phone": phone, "city": city})
                st.success("Fornecedor cadastrado.")
        st.dataframe(df("suppliers"), use_container_width=True, hide_index=True)

    with tab4:
        with st.form("collab_form", clear_on_submit=True):
            c1, c2, c3 = st.columns(3)
            name = c1.text_input("Nome")
            role = c2.selectbox("Função", ["Pedreiro", "Servente", "Eletricista", "Encanador", "Pintor", "Mestre de obras"])
            project = c3.selectbox("Obra", df("projects")["name"])
            daily_cost = st.number_input("Custo diário", min_value=0.0)
            submitted = st.form_submit_button("Salvar colaborador")
            if submitted and name:
                project_id = df("projects").loc[df("projects")["name"] == project, "id"].iloc[0]
                add_record("collaborators", {"id": f"col-{len(st.session_state.db['collaborators'])+1:02d}", "name": name, "role": role, "project_id": project_id, "status": "Ativo", "daily_cost": daily_cost})
                st.success("Colaborador cadastrado.")
        collabs = df("collaborators").copy()
        collabs["project"] = collabs["project_id"].map(project_name)
        st.dataframe(collabs[["name", "role", "project", "status", "daily_cost"]], use_container_width=True, hide_index=True)


def stock_tab():
    st.title("Controle de estoque")
    stock = stock_df()
    materials = df("materials")
    projects = df("projects")
    suppliers = df("suppliers")

    left, right = st.columns(2)
    with left:
        with st.form("entry_form", clear_on_submit=True):
            st.subheader("Registrar entrada")
            material = st.selectbox("Material", materials["name"], key="entry_material")
            supplier = st.selectbox("Fornecedor", suppliers["name"])
            quantity = st.number_input("Quantidade", min_value=0.01, step=1.0)
            unit_cost = st.number_input("Custo unitário", min_value=0.01, step=0.01)
            responsible = st.text_input("Responsável", value="Administrador")
            destination = st.text_input("Destino", value="Almoxarifado central")
            submitted = st.form_submit_button("Lançar entrada")
            if submitted:
                material_id = materials.loc[materials["name"] == material, "id"].iloc[0]
                supplier_id = suppliers.loc[suppliers["name"] == supplier, "id"].iloc[0]
                add_record("movements", {"id": f"mov-{len(st.session_state.db['movements'])+1:02d}", "type": "Entrada", "date": str(date.today()), "material_id": material_id, "quantity": quantity, "unit_cost": unit_cost, "supplier_id": supplier_id, "project_id": "", "responsible": responsible, "destination": destination})
                st.success("Entrada registrada.")

    with right:
        with st.form("exit_form", clear_on_submit=True):
            st.subheader("Registrar saída")
            material = st.selectbox("Material ", materials["name"], key="exit_material")
            project = st.selectbox("Obra", projects["name"])
            quantity = st.number_input("Quantidade de saída", min_value=0.01, step=1.0)
            responsible = st.text_input("Responsável", value="Administrador", key="exit_resp")
            destination = st.text_input("Destino físico")
            submitted = st.form_submit_button("Lançar saída")
            if submitted:
                material_id = materials.loc[materials["name"] == material, "id"].iloc[0]
                current_stock = float(stock.loc[stock["id"] == material_id, "current_stock"].iloc[0])
                if quantity > current_stock:
                    st.error(f"Saída bloqueada. Estoque disponível: {current_stock:.2f}")
                elif not destination:
                    st.error("Informe o destino da saída.")
                else:
                    project_id = projects.loc[projects["name"] == project, "id"].iloc[0]
                    unit_cost = float(materials.loc[materials["id"] == material_id, "unit_cost"].iloc[0])
                    add_record("movements", {"id": f"mov-{len(st.session_state.db['movements'])+1:02d}", "type": "Saída", "date": str(date.today()), "material_id": material_id, "quantity": quantity, "unit_cost": unit_cost, "supplier_id": "", "project_id": project_id, "responsible": responsible, "destination": destination})
                    st.success("Saída registrada.")

    st.subheader("Estoque atual")
    st.dataframe(stock[["name", "category", "current_stock", "min_stock", "unit_cost", "stock_value", "status"]], use_container_width=True, hide_index=True)

    st.subheader("Histórico de movimentações")
    mov = movement_df()[["date", "type", "material", "quantity", "project", "supplier", "responsible", "destination", "total_cost"]]
    st.dataframe(mov, use_container_width=True, hide_index=True)


def consumption_tab():
    st.title("Aplicação e consumo")
    projects = df("projects")
    materials = df("materials")

    with st.form("application_form", clear_on_submit=True):
        c1, c2, c3 = st.columns(3)
        project = c1.selectbox("Obra", projects["name"])
        material = c2.selectbox("Material", materials["name"])
        category = c3.selectbox("Categoria", ["Construção civil", "Elétrica", "Hidráulica", "Acabamento"])
        c4, c5, c6 = st.columns(3)
        stage = c4.text_input("Etapa da obra")
        predicted = c5.number_input("Quantidade prevista", min_value=0.01, step=1.0)
        quantity = c6.number_input("Quantidade consumida", min_value=0.01, step=1.0)
        responsible = st.text_input("Responsável", value="Administrador")
        submitted = st.form_submit_button("Registrar aplicação")
        if submitted:
            project_id = projects.loc[projects["name"] == project, "id"].iloc[0]
            material_id = materials.loc[materials["name"] == material, "id"].iloc[0]
            add_record("applications", {"id": f"apl-{len(st.session_state.db['applications'])+1:02d}", "date": str(date.today()), "project_id": project_id, "material_id": material_id, "category": category, "stage": stage, "quantity": quantity, "predicted_quantity": predicted, "responsible": responsible})
            waste = max(quantity - predicted, 0)
            if waste > 0:
                st.warning(f"Aplicação registrada com desperdício de {waste:.2f}.")
            else:
                st.success("Aplicação registrada.")

    apps = application_df()
    if not apps.empty:
        st.subheader("Consumo por categoria")
        st.bar_chart(apps.groupby("category")["quantity"].sum().sort_values(ascending=False))
        st.subheader("Comparação previsto x consumido")
        compare = apps.groupby("project")[["predicted_quantity", "quantity"]].sum()
        st.dataframe(compare.rename(columns={"predicted_quantity": "Previsto", "quantity": "Consumido"}), use_container_width=True)
        st.subheader("Lançamentos")
        st.dataframe(apps[["date", "project", "material", "category", "stage", "predicted_quantity", "quantity", "waste", "cost"]], use_container_width=True, hide_index=True)


def reports_tab():
    st.title("Relatórios")
    report_type = st.selectbox(
        "Tipo de relatório",
        ["Entrada e saída", "Consumo por obra", "Aplicação por categoria", "Custo por material", "Estoque atual", "Colaboradores por obra"],
    )

    if report_type == "Entrada e saída":
        report = movement_df()[["date", "type", "material", "quantity", "project", "supplier", "responsible", "destination", "total_cost"]]
    elif report_type == "Consumo por obra":
        report = application_df()[["date", "project", "material", "category", "stage", "predicted_quantity", "quantity", "waste", "cost"]]
    elif report_type == "Aplicação por categoria":
        apps = application_df()
        report = apps.groupby("category").agg(aplicacoes=("id", "count"), quantidade=("quantity", "sum"), previsto=("predicted_quantity", "sum"), desperdicio=("waste", "sum"), custo=("cost", "sum")).reset_index()
    elif report_type == "Custo por material":
        stock = stock_df()
        report = stock[["name", "category", "unit_cost", "current_stock", "stock_value", "status"]]
    elif report_type == "Estoque atual":
        stock = stock_df()
        report = stock[["name", "category", "current_stock", "min_stock", "entries", "exits", "status"]]
    else:
        collabs = df("collaborators").copy()
        collabs["project"] = collabs["project_id"].map(project_name)
        report = collabs[["name", "role", "project", "status", "daily_cost"]]

    st.dataframe(report, use_container_width=True, hide_index=True)
    csv = report.to_csv(index=False).encode("utf-8-sig")
    st.download_button("Exportar Excel (CSV)", data=csv, file_name="relatorio.csv", mime="text/csv")


def main():
    init_state()
    menu = st.sidebar.radio("Menu", ["Dashboard", "Cadastros", "Estoque", "Aplicação e consumo", "Relatórios"])
    if st.sidebar.button("Restaurar base demo"):
        st.session_state.db = seed_data()
        st.rerun()

    if menu == "Dashboard":
        dashboard_tab()
    elif menu == "Cadastros":
        registrations_tab()
    elif menu == "Estoque":
        stock_tab()
    elif menu == "Aplicação e consumo":
        consumption_tab()
    else:
        reports_tab()


if __name__ == "__main__":
    main()
