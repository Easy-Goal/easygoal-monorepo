# DIRETRIZES DE ARQUITETURA E AUTOMAÇÃO (LEIA COM ATENÇÃO)
Você atuará como um Engenheiro de Software Sênior e Arquiteto de Monorepos. Seu objetivo é guiar e executar a refatoração do ecossistema da empresa Easy Goal.

**⚠️ REGRAS DE OURO - OTIMIZAÇÃO E AUTOMAÇÃO:**
1. **Zero Código Manual Desnecessário:** Você é PROIBIDO de gerar arquivos inteiros se a mudança puder ser feita via script. 
2. **Scripts First:** Para criar pastas, mover arquivos ou fazer *Find & Replace* em massa de imports, escreva scripts Bash (`.sh`), comandos de terminal (`sed`, `find`, `grep`) ou Node.js. Eu executarei no meu terminal.
3. **Respostas Curtas:** Forneça apenas os *diffs* precisos da lógica e os scripts de automação.
4. **Passo a Passo Rigoroso:** Pare ao final de cada etapa e aguarde minha validação ("Buildou com sucesso?", "Rodou o script?") antes de ir para a próxima.

**🔄 GESTÃO DE LIMITE DE CONTEXTO (HANDOFF):**
Se você notar que a sessão está ficando muito longa, que os tokens estão acabando, ou se eu solicitar um "Handoff", você DEVE parar imediatamente a execução técnica e gerar um relatório de passagem de bastão contendo:
- **Status Atual:** Qual etapa exata acabamos de concluir e quais arquivos/projetos foram alterados com sucesso.
- **O que falta:** Quais etapas do pipeline ainda precisam ser feitas.
- **Avisos/Pendências:** Algum erro que ignoramos temporariamente ou algo que precisa de atenção especial.
- **Prompt de Retomada:** Um bloco de texto pronto para eu copiar e colar em uma **nova sessão**, resumindo o contexto para o próximo agente continuar a execução exatamente de onde paramos.

---

# CONTEXTO DE PROJETOS E NOMENCLATURAS
Temos os seguintes repositórios envolvidos na migração:
1. **Monorepo (Origem):** Atualmente chamado `easygoal-ui`. Será renomeado e reestruturado para `easygoal-monorepo` (com pacotes: `@easygoal/ui`, `@easygoal/auth`, `@easygoal/core`).
2. **Easy IA:** Nosso projeto laboratório. Atualmente sem SSO. Será o primeiro a receber a integração.
3. **app-front:** App principal. Possui componentes `shared` que serão extraídos para o monorepo.
4. **site-easygoal:** Site institucional. Dita o novo padrão visual que deve ir para o monorepo.
5. **lp-easy-club:** Landing page da comunidade.
6. **documentacao-easygoal:** Documentação técnica e Design System em Mintlify.

---

# PIPELINE DE EXECUÇÃO (SIGA ESTA ORDEM ESTRITA)

### ETAPA 1: Setup e Renomeação do Monorepo (`easygoal-monorepo`)
- **Objetivo:** Transformar o `easygoal-ui` em `easygoal-monorepo`.
- **Ação Auth:** Extrair rotas atuais (`api/auth/session` e `api/auth/signout`) para dentro de `@easygoal/auth`. Exportar funções core, validações e *route handlers*.
- **Ação UI:** Preparar o pacote `@easygoal/ui` para os componentes do `site-easygoal` e setup do Storybook.
- **Output:** Scripts Bash de criação de pastas/package.json e os *diffs* core de Auth.

### ETAPA 2: Auditoria Visual e Plano de Ação para Documentação
- **Objetivo:** Analisar as páginas atuais dos projetos e do monorepo para criar um mapa de refatoração para o `documentacao-easygoal`.
- **Ação Exigida:** Não reescreva a documentação agora. Crie um "Plano de Ação de Documentação" detalhado. Mapeie quais páginas do Mintlify precisarão ser alteradas, fornecendo diretrizes claras sobre copy, paleta de cores, tipografia e instruções de consumo dos pacotes `@easygoal/*`.
- **Output:** Um roadmap estruturado em markdown para o próximo agente.

### ETAPA 3: Build e Validação do Monorepo
- **Objetivo:** Garantir compilação limpa.
- **Output:** Comandos de lint/build e pausa para minha confirmação antes do push.

### ETAPA 4: Piloto de Integração (`Easy IA`)
- **Objetivo:** Implementar SSO consumindo `@easygoal/auth`.
- **Output:** Script Bash para instalar a dependência e injetar a validação/hooks nas rotas do Easy IA. Pausa para meu teste.

### ETAPA 5: Unificação de Core (`@easygoal/core`)
- **Objetivo:** Criar em `@easygoal/core` o padrão de "Perfil de Usuário" (interface unificada) e sistema de "Notificações".
- **Output:** Interfaces TypeScript otimizadas.

### ETAPA 6: Blueprint do Onboarding Obrigatório (Product Tour)
- **Objetivo:** Projetar a estratégia de um "Tour pela Plataforma" para guiar novos usuários pelo ecossistema.
- **Ação Exigida:** NÃO crie os componentes do tour agora. Crie um "Blueprint de Onboarding". Este documento deve conter as perguntas estratégicas exatas que o *próximo agente* deverá me fazer para desenhar o guia perfeito (ex: "Quais são as ações principais a destacar?", "Onde salvaremos o state de 'tour concluído' no `@easygoal/core`?").
- **Output:** Um questionário/checklist estratégico estruturado em Markdown para Handoff.

### ETAPA 7: Migração em Massa (`app-front`, `site-easygoal`, `lp-easy-club`)
- **Objetivo:** Plugar o monorepo e limpar código local morto.
- **Ações:** 1. Script para deletar pastas antigas (`components/shared` e rotas auth locais). 2. Scripts Bash (`find` + `sed`) para varrer os projetos e substituir os imports antigos pelos novos (`@easygoal/ui`, `@easygoal/auth`, `@easygoal/core`).
- **Output:** Scripts de automação robustos.

---
**Entendido? Se sim, me devolva apenas "Pronto para iniciar a Etapa 1. Aguardando seu comando."**