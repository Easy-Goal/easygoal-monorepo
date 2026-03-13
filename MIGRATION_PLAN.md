# PLANO DE EXECUÇÃO — ECOSSISTEMA EASY GOAL
> Documento vivo. Atualizar sempre que uma etapa for concluída, redefinida ou expandida.
> Objetivo central: lançamento consistente, fluído e escalável do ecossistema.

---

## DIRETRIZES DE OPERAÇÃO

**Regras de ouro:**
1. **Zero código manual desnecessário:** prefira scripts Bash/Node para criação de pastas, movimentação de arquivos e find & replace em massa.
2. **Scripts First:** escreva o script, o usuário executa, confirma o resultado antes de prosseguir.
3. **Respostas curtas:** apenas diffs precisos e scripts de automação. Sem texto de relleno.
4. **Passo a passo rigoroso:** pare ao final de cada etapa, aguarde validação ("buildou?", "rodou?") antes de avançar.
5. **Documento vivo:** ao concluir uma etapa, marque como ✅ e adicione observações relevantes.

**Gestão de contexto (Handoff):**
Se a sessão estiver longa ou o usuário solicitar "Handoff", gere imediatamente:
- Status atual (etapa concluída + arquivos alterados)
- O que falta (próximas etapas)
- Avisos/pendências
- Prompt de retomada pronto para nova sessão

---

## REPOSITÓRIOS DO ECOSSISTEMA

| Repo | Status | Função |
|------|--------|--------|
| `easygoal-monorepo` | 🔄 Em refatoração | Pacotes compartilhados: `@easygoal/ui`, `@easygoal/auth`, `@easygoal/core` |
| `easy-ia` | 🔄 Pivô estratégico | **SaaS independente multi-tenant** — assistente de IA plugável para qualquer empresa |
| `app-front` | 🔄 Pendente melhorias | App principal — plataforma de usuários, produtores e afiliados |
| `site-easygoal` | ⏳ Aguardando | Site institucional — dita o padrão visual |
| `lp-easy-club` | ⏳ Aguardando | Landing page da comunidade |
| `sso` | 🔄 Em evolução | Servidor de autenticação centralizado |
| `documentacao-easygoal` | ⏳ Aguardando | Design System + docs técnicos (Mintlify) |

---

## PIPELINE DE EXECUÇÃO

### ✅ ETAPA 1 — Setup e Estruturação do Monorepo
**Concluída.** `easygoal-ui` → `easygoal-monorepo` com pacotes `@easygoal/auth`, `@easygoal/ui`, `@easygoal/core`.
- Auth: handlers de session, signout, notifications, callback extraídos
- Core: interfaces UserProfile e Notifications definidas
- UI: Logo, EasyHeader, NotificationBell, UserMenu, RankBadge

---

### ✅ ETAPA 2 — Auditoria Visual e Plano de Documentação
**Concluída.** Ver `ETAPA_2_DOC_PLAN.md`.

---

### ✅ ETAPA 3 — Build e Validação do Monorepo
**Concluída.** Pacotes buildando limpo. Dist commitado e publicado no GitHub.

---

### ✅ ETAPA 4 — Piloto de Integração (Easy IA)
**Concluída.** SSO integrado via `@easygoal/auth`. Navbar com UserMenu, NotificationBell e useNotifications funcionando.
- SSO: endpoint `/api/notifications` criado
- Monorepo: fix de resposta não-JSON no handler de notificações

---

### ✅ ETAPA 5 — Unificação de Core (`@easygoal/core`)
**Concluída.** Interfaces `UserProfile` e `Notification` definidas e exportadas.

---

### ✅ ETAPA 6 — Blueprint de Onboarding
**Concluída.** Ver `ONBOARDING_BLUEPRINT.md`.

---

### ✅ ETAPA 7 — Design System Completo (`@easygoal/ui`)

**Objetivo:** Construir biblioteca de componentes unificada, baseada no melhor de cada projeto, para servir de base para a migração em massa (Etapa 8).

**Decisões de design:**
- Gradiente primário: `linear-gradient(135deg, hsl(18 100% 62%) 0%, hsl(18 100% 50%) 100%)`
- Glow: `0 0 60px hsl(18 100% 62% / 0.3)`
- Card hover: `translateY(-2px)` + border laranja sutil + shadow
- Skeleton: shimmer com gradiente (não pulse simples)
- Button loading: spinner interno (Loader2)
- Raio base: `rounded-xl` (buttons/cards), `rounded-full` (badges/avatars)
- Stack: Tailwind CSS + CVA (class-variance-authority)

**Tier 1 — Primitivos:**
- [ ] `Button` — variants: default, outline, ghost, gradient, glass, destructive + sizes sm/md/lg/xl/icon + prop `loading`
- [ ] `Card` + `CardHeader/Title/Description/Content/Footer` — composable, com card-hover
- [ ] `Badge` — variants: default, secondary, destructive, outline, success, warning
- [ ] `Skeleton` — shimmer animado
- [ ] `Avatar` — fallback de iniciais, sizes xs/sm/md/lg
- [ ] `Input` / `Textarea` — ring laranja no focus, disabled state

**Tier 2 — Feedback & Estado:**
- [ ] `AlertBox` — variants: info, warning, error, success
- [ ] `EmptyState` — variants: inline, dashed, card
- [ ] `LoadingState` — variants: inline, page

**Tier 3 — Data Display:**
- [ ] `StatCard` — trend badge (↑↓), link action, 6 variantes de ícone
- [ ] `MetricCard` — versão simplificada sem trend
- [ ] `QuickLinkCard` — card navegável com seta

**Tokens:**
- [ ] `tokens/animations.ts` — keyframes: shimmer, fade-up, slide-up, float, pulse-ring, stagger
- [ ] `globals.css` exportável — .skeleton, .card-hover, .shadow-glow, stagger helpers

**Output esperado:** Build limpo + push no main + instrução de configuração Tailwind para projetos consumidores.

**Concluída.** Build limpo. 15 componentes + tokens + globals.css. Commit `af8ec07`.

**Consumir nos projetos:**
```ts
// tailwind.config.ts — adicionar ao content:
"./node_modules/@easygoal/ui/src/**/*.{ts,tsx}"

// layout.tsx ou globals.css — importar estilos base:
import "@easygoal/ui/styles";

// Imports de componentes:
import { Button, Card, Badge, StatCard, ... } from "@easygoal/ui";
import { keyframes, animations } from "@easygoal/ui/tokens";
```

---

### ⏳ ETAPA 8 — Migração em Massa (`app-front`, `site-easygoal`, `lp-easy-club`)

**Objetivo:** Substituir componentes locais pelos do monorepo e limpar código morto.

**Ações:**
1. Adicionar `@easygoal/packages` como dependência em cada projeto
2. Adicionar path do monorepo no `tailwind.config` de cada projeto (content scan)
3. Script `find + sed` para substituir imports de componentes locais pelos do `@easygoal/ui`
4. Script para substituir imports de auth locais pelos do `@easygoal/auth`
5. Deletar pastas: `components/shared/`, `components/ui/` (onde já migrado), rotas auth locais
6. Validar build em cada projeto

**Projetos e ordem:**
- `easy-ia` — parcialmente migrado (auth OK, UI parcial)
- `site-easygoal` — foco em UI
- `lp-easy-club` — foco em UI + auth
- `app-front` — maior esforço, validar tudo antes de deletar shared/

**Output:** Scripts de automação Bash robustos. Um por projeto. Pausa para validação entre cada um.

---

### 🔄 ETAPA 8 — Migração em Massa (`app-front`)

**Concluída (app-front).** `site-easygoal` e `lp-easy-club` pendentes.

**O que foi feito no `app-front`:**
- `@easygoal/packages` → `github:Easy-Goal/easygoal-monorepo` (repo renomeado)
- Button com `asChild` + `@radix-ui/react-slot` adicionado ao monorepo
- Export `./ui/styles` no root `package.json` do monorepo
- `@source` no `globals.css` para Tailwind v4 scanear o monorepo
- 61 arquivos migrados: `Button`, `Badge`, `Card/*`, `Input`, `Textarea`, `AlertBox`, `EmptyState`, `LoadingState`
- Permanecem locais (API própria / não no monorepo): `StatCard`, `MetricCard`, `RankBadge`, `Select`, `Label`, `Dialog`, `Checkbox`, `Switch`, `Table`, `DonutChart`, `MiniChart`, `ProductImage`

**Próxima sessão — migrar `site-easygoal` e `lp-easy-club`:**
1. Adicionar `@easygoal/packages: github:Easy-Goal/easygoal-monorepo` em cada projeto
2. Adicionar `@source` no globals.css de cada projeto
3. Script sed para substituir imports locais pelos do `@easygoal/packages/ui`
4. Validar build em cada projeto

---

### 🔄 ETAPA 9 — Melhorias de Produto no `app-front`

**Objetivo:** Elevar a qualidade e completude das funcionalidades core antes do lançamento.

#### ✅ 9.1 — Checkout Estilizado
**Concluído.** Commit `13719e4`.
- Nova página `/checkout?product_id=xxx` com steps visual (Produto → Confirmar → Pagamento)
- Resumo do produto, preço, badge de frequência, código de afiliado
- Redirect direto para AbacatePay com estados loading/erro
- `/saas/[slug]` agora navega para `/checkout` ao invés de chamar a API inline
- **Fix:** conflito de rotas resolvido — página em `/app/checkout/page.tsx` (substituiu a antiga)

#### ⏳ 9.2 — Webhook Logs (Produtor)
**Pendente — requer migração de banco.**
- A UI de configuração de webhook já existe em `/producer/api-keys`
- **O que falta:**
  - Criar tabela `webhook_dispatch_logs` no Supabase:
    ```sql
    create table webhook_dispatch_logs (
      id uuid primary key default gen_random_uuid(),
      api_app_id uuid references api_apps(id) on delete cascade,
      event_type text not null,
      payload jsonb,
      response_status int,
      response_body text,
      duration_ms int,
      success boolean not null default false,
      created_at timestamptz default now()
    );
    create index on webhook_dispatch_logs(api_app_id, created_at desc);
    ```
  - Gravar nessa tabela a cada disparo de webhook (no handler de pagamento)
  - API `GET /api/producer/api-keys/[id]/webhook-logs` — últimas 50 entradas
  - UI: seção "Logs de Disparo" no dialog de configuração de webhook (tabela + retry + health indicator)

#### ✅ 9.3 — Withdrawals (Saques) — visão do produtor
**Concluído.** Commit `13719e4`.
- Página `/producer/withdrawals` com saldo disponível e histórico de saques
- API `/api/producer/withdrawals` filtrando por producer_id via `product_partners`
- Item "Saques" adicionado no Sidebar do produtor
- **Pendente (próxima sessão):** botão de solicitação de saque self-service + validação de chave PIX

#### 9.4 — Páginas Intermediárias de Ações Importantes (UI/UX)
- Confirmação antes de ações destrutivas (cancelar plano, remover produto, excluir conta)
- Feedback visual após ações concluídas (success state pages)
- Telas de "em processamento" para operações assíncronas
- Empty states com CTAs claros em todas as listagens

#### 9.5 — Tag Manager / UTM por Produto (Analytics)
**Responsabilidade dividida: plataforma configura base, produtor customiza por produto.**

- **Configuração base (admin/plataforma):**
  - Google Tag Manager container ID global
  - Eventos padrão rastreados automaticamente: `view_product`, `start_checkout`, `purchase`, `subscribe`, `cancel`
  - UTM defaults por canal (orgânico, afiliado, email)

- **Configuração por produto (produtor — interface simples):**
  - Custom GTM container ID (opcional, sobrescreve o global)
  - UTM parameters customizados por produto (`utm_source`, `utm_medium`, `utm_campaign`)
  - Pixel ID (Meta, TikTok) por produto
  - Toggle: ativar/desativar rastreamento por produto

- **Dados disponíveis para o produtor (dashboard):**
  - Cliques por evento (view, checkout_start, purchase)
  - Conversão por canal UTM
  - Top páginas de origem

- **Dados avançados (responsabilidade do produtor via GTM próprio):**
  - Funil detalhado
  - Audiências de remarketing
  - Atribuição multi-touch

- **Como implementar:**
  - Tabela `product_tracking_config` no Supabase (por produto)
  - Hook `useProductTracking()` no `@easygoal/core` que injeta os scripts corretos
  - Middleware Next.js que adiciona UTMs automaticamente nos links de afiliados

#### ✅ 9.6 — Admin: Gamificação e Gestão de Ranks (UI/CRUD)

**Concluído parcialmente.** CRUD de rank_definitions + dashboard de distribuição construídos.
Engine de auto-rank pendente (ver 9.6-B abaixo).

**Arquivos criados:**
- `src/app/api/admin/ranks/route.ts` — GET/POST
- `src/app/api/admin/ranks/[id]/route.ts` — PUT/DELETE
- `src/app/api/admin/ranks/distribution/route.ts` — GET com membros por rank (lê dados armazenados)
- `src/app/(authenticated)/admin/ranks/page.tsx` — página completa

---

#### ⏳ 9.6-B — Gamificação: Arquitetura de Perfis (Fricção Zero) e Engine de Rank

**Arquitetura revisada — Fricção Zero:**

Todo usuário entra obrigatoriamente como **consumidor**. Não há seleção de tipo de conta no registro. Status `trial` genérico é removido do SSO. Os perfis de Produtor e Afiliado são ativados via opt-in interno (landing pages de upsell dentro do app).

| Perfil | Tabela | Ativado quando | Critério de rank |
|--------|--------|----------------|-----------------|
| **Consumidor** | `users_company` | Sempre — todo usuário (status `active`) | Assinaturas SaaS ativas como comprador |
| **Afiliado** | `affiliates` (status=active) | Opt-in via `/affiliate/join` no app | Conversões indicadas (`total_conversions`) |
| **Produtor** | `producers` (status=verified) | Opt-in via `/producer/join` no app | Assinantes ativos dos seus produtos |

- Visão pós-login: sempre o Dashboard do Consumidor
- Opt-in ativa o perfil → insere registro em `producers` / `affiliates` → dispara refresh do JWT
- Cada perfil tem rank independente (Silver consumidor + Gold afiliado + Bronze produtor simultâneos)

**Problema atual:**
- `rank_definitions.user_type` só tem `"producer"` e `"affiliate"` — falta `"user"` (consumidor)
- `user_ranks` existe mas nunca é populada — não há engine que observe eventos
- `affiliates.rank_name/rank_level` e `producers.rank_name/rank_level` são campos estáticos, setados manualmente — não refletem a atividade real
- JWT do SSO carrega `rank_name` mas só sincroniza no login

**Arquitetura de ranks:**

Ranks são **calculados dinamicamente** via triggers SQL — o campo `rank_name/rank_level` nas tabelas de perfil é apenas um **cache**.

```
Evento de negócio → Trigger Supabase → recalculate_rank(user_id, profile_type) → atualiza cache
```

**Triggers necessários:**

| Evento | Tabela monitorada | Perfil afetado | Função |
|--------|------------------|----------------|--------|
| INSERT/UPDATE `saas_subscriptions` (status→active/cancelled) | saas_subscriptions | Consumidor (comprador) | `recalc_consumer_rank` |
| INSERT/UPDATE `saas_subscriptions` (via produto do produtor) | saas_subscriptions JOIN saas_products | Produtor (vendedor) | `recalc_producer_rank` |
| UPDATE `affiliates.total_conversions` | affiliates | Afiliado | `recalc_affiliate_rank` |

**Função de cálculo de rank (SQL Supabase):**
```sql
-- Consumidor: conta assinaturas ativas
SELECT COUNT(*) FROM saas_subscriptions WHERE user_id = $1 AND status = 'active'
→ compara com rank_definitions WHERE user_type = 'user' ORDER BY min_active_subscriptions DESC LIMIT 1

-- Produtor: conta assinantes ativos dos seus produtos
SELECT COUNT(*) FROM saas_subscriptions s
JOIN saas_products p ON s.saas_product_id = p.id
WHERE p.producer_id = $1 AND s.status = 'active'
→ compara com rank_definitions WHERE user_type = 'producer'

-- Afiliado: usa total_conversions já existente
SELECT total_conversions FROM affiliates WHERE id = $1
→ compara com rank_definitions WHERE user_type = 'affiliate'
```

**O que precisa ser feito:**

1. **SSO:**
   - Remover seleção de tipo de conta no fluxo de registro
   - Remover status `trial` — todo novo usuário entra como `active` consumidor
   - Revisar `EgSessionClaims.rank_name` — exibir rank do consumidor por padrão, ou o mais alto entre os perfis ativos
   - Garantir refresh do JWT quando rank muda (via `refreshUser()` após evento de assinatura/opt-in)

2. **DB migration:**
   - Adicionar `user_type = 'user'` como valor válido em `rank_definitions`
   - Criar função SQL `recalculate_rank(profile_type text, profile_id uuid)` no Supabase
   - Criar triggers em `saas_subscriptions` e `affiliates`
   - Popular `user_ranks` com dados históricos via script one-time

3. **API admin:**
   - `POST /api/admin/ranks/recalculate` — recalcula todos os ranks manualmente (pós-migration)
   - Reescrever `/api/admin/ranks/distribution` com cálculo dinâmico

4. **app-front:**
   - Criar `/affiliate/join` — landing page interna de opt-in de afiliado
   - Criar `/producer/join` — landing page interna de opt-in de produtor
   - Dashboard do consumidor como visão padrão pós-login
   - Exibir rank correto por perfil (consumidor no dashboard geral, afiliado em /affiliate, produtor em /producer)

**Arquivos a criar/modificar:**
- Migration SQL Supabase (executar manualmente)
- `sso/src/` — remover seleção de tipo, remover status `trial`, revisar claims
- `src/app/api/admin/ranks/recalculate/route.ts`
- `src/app/api/admin/ranks/distribution/route.ts` — cálculo dinâmico
- `src/components/ui/RankBadge.tsx` — suportar os 3 tipos de perfil
- `src/app/(authenticated)/affiliate/join/page.tsx`
- `src/app/(authenticated)/producer/join/page.tsx`

#### ✅ 9.7 — Admin: Marketplace Health Dashboard

**Concluído.**

**Arquivos criados:**
- `src/app/api/admin/marketplace-health/route.ts` — GET overview + SaaS perf + funil + categorias + serviços
- `src/app/api/admin/marketplace-health/featured/route.ts` — PATCH toggle is_featured
- `src/app/(authenticated)/admin/marketplace-health/page.tsx` — dashboard completo
- `src/types/database.ts` — `is_featured?: boolean` adicionado em `SaasProductRow` e `ServiceRow`
- Sidebar: link "Marketplace Health" adicionado na seção Produtos

**⚠️ Requer migration no Supabase:**
```sql
alter table services add column if not exists is_featured boolean not null default false;
alter table saas_products add column if not exists is_featured boolean not null default false;
```

---

### ⏳ ETAPA 10 — Implementação do Onboarding Orgânico (Product Tour)

**Objetivo:** Implementar o Product Tour focado exclusivamente na experiência do consumidor. Não forçar escolha de perfil — Produtor e Afiliado aparecem apenas como descoberta orgânica.

**Escopo do tour (consumidor):**
- Navegação principal (Dashboard, Marketplace, Minhas Assinaturas)
- Como explorar e assinar produtos
- Seções "Vender" e "Indicar" apresentadas como CTAs de descoberta, sem obrigar escolha

**Ações:**
1. Definir biblioteca: `driver.js` (leve, sem deps — preferência)
2. Criar componente `<ProductTour>` em `@easygoal/ui`
3. Salvar estado "tour concluído" em `@easygoal/core` (campo em UserProfile)
4. Implementar no `app-front` (fluxo do consumidor padrão)
5. Vincular opt-in de afiliado/produtor às landing pages internas (ver 9.6-B)

**Output:** Componente no monorepo + implementação no app-front + pausa para teste.

---

### ⏳ ETAPA 11 — Documentação Técnica + Comunidade (Build in Public)

**Objetivo:** Executar o plano de documentação e iniciar o "Easy Club" direto no app via changelog público.

**Ações — Documentação:**
1. Atualizar páginas de instalação/consumo dos pacotes `@easygoal/*`
2. Documentar todos os componentes do Design System (Etapa 7) com exemplos
3. Guia de integração SSO para novos projetos
4. Guia de webhooks e tracking para produtores
5. Changelog visível e versionado

**Ações — Comunidade (Build in Public):**
- Adicionar aba "Changelog / Novidades" no painel do usuário consumindo releases do repositório GitHub via API
- Materializa o início do "Easy Club" sem precisar de infraestrutura extra
- Endpoint: `GET https://api.github.com/repos/Easy-Goal/*/releases` → exibir as últimas N releases
- Componente: `<ChangelogFeed>` em `@easygoal/ui` (reutilizável entre projetos)

**Output:** PRs no repo `documentacao-easygoal` + componente `<ChangelogFeed>` no monorepo + aba no app-front.

---

### ⏳ ETAPA 12 — Dogfooding (Paciente Zero) + Validação Final

**Objetivo:** Antes de abrir o marketplace para terceiros, lançar o SaaS próprio de cálculo de restituição do INSS como primeiro produto da plataforma. Estressar em ambiente real todo o fluxo de receita.

**Dogfooding — SaaS INSS:**
- Registrar o produto de restituição INSS no marketplace do app-front
- Configurar checkout, split de pagamentos e webhooks para esse produto
- Cadastrar afiliados-teste e validar painel de afiliados
- Objetivo: encontrar bugs reais antes de expor a terceiros

**Checklist de Go-Live:**
- [ ] Todos os projetos buildando sem erros
- [ ] SSO funcionando em produção (easy-ia, app-front, site-easygoal)
- [ ] Notificações chegando corretamente
- [ ] Checkout testado end-to-end com produto real (SaaS INSS)
- [ ] Webhooks disparando corretamente + logs visíveis (ver 9.2)
- [ ] Split de pagamentos e painel de afiliados validados
- [ ] Analytics capturando eventos básicos
- [ ] Onboarding funcionando em novos usuários
- [ ] Documentação publicada e acessível
- [ ] Performance: Core Web Vitals aceitáveis em todos os projetos
- [ ] AEO: `aeo.js` instalado em `site-easygoal`, `documentacao-easygoal` e `easy-ia` — score aceitável no AEO Checker
- [ ] Páginas de produto no marketplace com schema `SoftwareApplication` + rota `/llm`
- [ ] Monitoramento básico configurado (erros, uptime)

---

### ⏳ ETAPA 13 — Easy IA: Pivô para SaaS Independente Multi-Tenant

**Contexto estratégico:** Com a saída do fornecedor original, o `easy-ia` deixa de ser projeto laboratório interno e passa a ser um **produto SaaS independente**. Qualquer empresa poderá "plugar" o assistente ao seu produto, configurar o contexto de negócio e controlar as interações com seus usuários finais via API ou painel.

**Proposta de valor:**
- Reduz tickets de suporte de primeiro nível respondendo sobre regras de negócio do produto
- O usuário final fala com a IA antes de escalar para suporte humano ou para o produtor
- Cada empresa configura seu próprio contexto, tom de voz e regras de negócio
- Disponível via API (integração headless) e via painel web (controle visual)

---

#### 13.1 — Arquitetura Multi-Tenant

**Modelo de dados (por tenant/empresa):**

```
tenants
├── id, name, slug, plan
├── api_key (para integração via API)
└── created_at

tenant_configs
├── tenant_id
├── business_context (texto livre — "somos uma plataforma de...")
├── tone (formal | casual | técnico)
├── escalation_rules (quando passar para humano)
├── allowed_topics (lista de tópicos permitidos)
└── blocked_topics

knowledge_base
├── tenant_id
├── content (texto ou MD)
├── embedding (pgvector)
├── source (manual | url | pdf | webhook)
└── updated_at

conversations
├── tenant_id
├── end_user_id (identificador externo — quem está conversando)
├── channel (widget | api | whatsapp)
└── messages[]
```

**Fluxo de onboarding do tenant:**
1. Questionário de contexto guiado (wizard no painel)
   - O que faz o produto? Quem é o usuário final?
   - Quais são as 10 perguntas mais frequentes?
   - Qual o tom de comunicação?
   - Quando escalar para suporte humano?
2. Upload ou cole a base de conhecimento (FAQ, docs, PDFs)
3. Testar o assistente em sandbox antes de publicar
4. Obter API key + snippet de integração

---

#### 13.2 — Painel de Controle (Dashboard do Tenant)

Seções do painel:

| Seção | Função |
|-------|--------|
| **Configuração** | Wizard de contexto, tom, regras de escalação |
| **Base de Conhecimento** | CRUD de documentos, upload PDF, sync de URL |
| **Conversas** | Histórico de todas as interações, filtros por data/canal/status |
| **Mensagens** | Editar/aprovar respostas antes de enviar (modo moderado, opcional) |
| **Analytics** | Taxa de resolução, perguntas sem resposta, tópicos mais frequentes |
| **Integrações** | API key, webhook de escalação, snippet de widget |

---

#### 13.3 — Integração via API

Endpoints públicos (autenticados por `api_key`):

```
POST /api/v1/chat          — enviar mensagem, receber resposta da IA
GET  /api/v1/conversations — listar conversas do tenant
POST /api/v1/knowledge     — adicionar documento à base de conhecimento
GET  /api/v1/analytics     — métricas de uso
```

**Widget embeddable:** snippet JS que qualquer empresa cola no seu site/app — abre um chat flutuante conectado ao tenant configurado.

---

#### 13.4 — Engine de Resposta

```
Mensagem do usuário final
  → Busca semântica na knowledge_base (pgvector)
  → Prompt montado: [system_context] + [conhecimento recuperado] + [histórico de conversa]
  → LLM (Claude via Anthropic API)
  → Verificação de regras de escalação
  → Resposta entregue ao usuário OU flag para suporte humano
```

**pgvector:** ativar no Supabase → `CREATE EXTENSION IF NOT EXISTS vector;`
**Embeddings:** gerar via `text-embedding-3-small` (OpenAI) ou `voyage-3` (Anthropic)

---

#### 13.5 — Integração com o Ecossistema EasyGoal

O EasyGoal será o **primeiro cliente/tenant** do easy-ia:
- Tenants: `app-front` (suporte a consumidores/produtores), `easy-ia` (meta — suporte ao próprio SaaS)
- O assistente sabe das regras de negócio do marketplace, checkout, afiliados e ranks
- Escalação: abre ticket no sistema de suporte do EasyGoal ou notifica o produtor

O que era previsto na etapa original de "Assistente Pro para Produtores" agora é um **plano premium do easy-ia** — produtores pagam para ter o assistente configurado para o produto deles.

---

#### 13.6 — QA Automatizado do Marketplace (mantido)

Ferramentas MCP para validar SaaS submetidos ao marketplace (independente do pivot):

- Testar URL `redirect_to` (responde 200?)
- Validar formato e atividade de chaves de API
- Simular payload de webhook e verificar resposta do endpoint
- Entregar relatório de aprovação/rejeição no admin

**Implementação:** `POST /api/admin/saas/validate` + botão "Validar com IA" no admin do app-front.

---

**Stack do easy-ia (SaaS independente):**
- Next.js App Router (já existente)
- Supabase com `pgvector` ativado
- Anthropic API (Claude) para respostas + embeddings
- Autenticação: SSO EasyGoal para painel de tenants + `api_key` para integração headless
- Deploy: Vercel (painel) + edge functions (API pública de chat)

---

### ⏳ ETAPA 13.7 — aeo.js: AEO em Todo o Ecossistema

**Contexto estratégico:**

`aeo.js` é uma lib open-source criada internamente que se integra no build (Next.js, Astro, Vite, Nuxt, Angular, Webpack) e gera automaticamente tudo que motores de IA precisam para indexar e citar um site: `llms.txt`, dados estruturados, versões em Markdown das páginas e regras de `robots.txt` para crawlers de IA.

Ferramenta complementar: **AEO Checker** em `https://check.aeojs.org` — escaneia qualquer site, mais de 30 verificações, sem cadastro.

**Por que isso é estratégico para o ecossistema:**

O `aeo.js` e o `easy-ia` são dois lados da mesma moeda:
- `aeo.js` → faz o conteúdo do produto ser **encontrado e indexado** pelos motores de IA (ChatGPT, Claude, Perplexity, Gemini)
- `easy-ia` → faz esse conteúdo ser **respondido com precisão** pela IA quando o usuário final pergunta

Um produtor que usa os dois fica **citado** pelos motores de IA e ainda oferece um assistente que responde sobre o seu produto. Quem não usa nenhum dos dois, fica **invisível**.

---

#### 13.7.1 — Implementar em Todos os Sites do Ecossistema

| Projeto | Framework | Prioridade | O que gerar |
|---------|-----------|------------|-------------|
| `site-easygoal` | Next.js | Alta | `llms.txt`, dados estruturados, sitemap IA |
| `documentacao-easygoal` | Mintlify/Astro | Alta | Versões Markdown das páginas, `llms.txt` |
| `easy-ia` | Next.js | Alta | `llms.txt`, widget Human/AI nas docs |
| `lp-easy-club` | Next.js/Astro | Média | `llms.txt`, dados estruturados |
| `app-front` | Next.js | Média | Páginas públicas de produto no marketplace |

**Widget Human/AI:** toggle flutuante que mostra como um LLM lê a página — instalar em `site-easygoal`, docs e `easy-ia` para tornar o conceito de AEO visível e concreto para os visitantes.

---

#### 13.7.2 — AEO como Feature de Valor para Produtores

Produtores que hospedam suas landing pages ou documentação em domínios próprios podem usar o `aeo.js` para melhorar a descoberta dos seus SaaS pelos motores de IA.

**Integração com o ecossistema:**
- No painel do produtor em `app-front`: card "AEO Score" linkando para `https://check.aeojs.org` com a URL do produto pré-preenchida
- Guia de implementação do `aeo.js` na documentação técnica (Etapa 11)
- Para produtores nos planos mais altos: onboarding guiado de AEO como parte do setup do produto

---

#### 13.7.3 — Páginas de Produto no Marketplace com AEO

As páginas públicas de cada produto no marketplace (`/marketplace/[slug]`) devem ser AEO-ready:

- `<script type="application/ld+json">` com schema `Product` / `SoftwareApplication`
- Meta tags Open Graph + Twitter Card completos
- Versão Markdown da página acessível via `?format=markdown` ou rota `/marketplace/[slug]/llm`
- `llms.txt` global do marketplace listando todos os produtos ativos

**Impacto:** quando alguém perguntar ao ChatGPT "qual SaaS de X existe no Brasil", os produtos do marketplace podem ser citados.

---

**Stack:**
```bash
npm install aeo.js
```
```js
// next.config.ts
import { withAEO } from 'aeo.js/next'
export default withAEO({ /* config */ })(nextConfig)
```

---

### ⏳ ETAPA 14 — SRE e QA Contínuo

**Objetivo:** Observabilidade centralizada e testes automatizados nos fluxos de receita.

#### 14.1 — Observabilidade

- VPS isolada com Docker + Grafana para centralizar:
  - Logs do Supabase (errors, slow queries)
  - Logs do Vercel (function errors, timeouts)
  - Falhas de webhook (via tabela `webhook_dispatch_logs` da etapa 9.2)
- Alertas Slack/email em falhas críticas (checkout, webhook, auth)

#### 14.2 — Testes E2E com Playwright

- Adicionar Playwright ao monorepo
- Foco exclusivo nos fluxos de receita:
  - [ ] Login SSO → Dashboard consumidor
  - [ ] Checkout end-to-end (produto → pagamento → confirmação)
  - [ ] Cadastro de afiliado (opt-in → link gerado → conversão rastreada)
- CI: rodar em PRs que tocam `app-front` ou `sso`

---

## CONTEXTO PERMANENTE PARA AGENTES

Ao iniciar uma nova sessão com este documento, o agente deve:
1. Ler este arquivo e identificar a primeira etapa com status 🔄 ou ⏳
2. Perguntar ao usuário: "Estamos continuando a Etapa X — [nome]. Confirma?"
3. Executar apenas a etapa confirmada, sem pular para a próxima
4. Ao concluir, marcar como ✅ e atualizar observações neste arquivo

**Stack tecnológico:**
- Framework: Next.js 14/15 (App Router)
- Styling: Tailwind CSS + CVA
- Auth: SSO próprio via `eg_session` JWT (HS256)
- DB: Supabase (PostgreSQL + RLS + Realtime)
- Pagamentos: AbacatePay
- Icons: Lucide React
- Data fetching: React Query (TanStack) no client, fetch nativo no server
- Toasts: Sonner
- Monorepo: npm workspaces + tsup para build

**Princípios de design:**
- Dark mode por padrão (azul escuro `#0F1729` + laranja `#F97316`)
- Gradiente primário: `linear-gradient(135deg, hsl(18 100% 62%) 0%, hsl(18 100% 50%) 100%)`
- Tipografia: Inter (body) + Space Grotesk (headings)
- Componentes: Tailwind + Radix UI (unstyled) onde necessário
