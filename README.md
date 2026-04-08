# Gestão de Almoxarifado para Construtora

Aplicativo para controle de materiais de construção, estoque, consumo por obra, colaboradores e relatórios gerenciais.

## Como usar com Streamlit

1. Instale as dependências:
   - `py -m pip install -r requirements.txt`
2. Execute o aplicativo:
   - `py -m streamlit run app.py`
3. O navegador abrirá com o dashboard do sistema.

## O que o sistema entrega

- Dashboard com indicadores e gráficos
- Cadastro de obras, materiais, fornecedores, colaboradores e usuários
- Controle de entrada e saída de estoque
- Aplicação e consumo de materiais por obra e categoria
- Alertas de estoque mínimo
- Relatórios com filtros e exportação em CSV compatível com Excel
- Exportação para PDF via impressão do navegador

## Regras implementadas

- Saída bloqueada quando a quantidade excede o estoque disponível
- Aplicação obrigatoriamente vinculada a uma obra
- Saídas exigem data, responsável e destino
- Entradas exigem fornecedor, data, valor unitário e quantidade
- Saldos, consumo acumulado e custos são calculados automaticamente

## Persistência

Os dados demo ficam em memória no `session_state` do Streamlit. O botão `Restaurar base demo` recria os dados iniciais para demonstração.
