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
| `easy-ia` | 🔄 Integrado ao SSO | Projeto laboratório — primeiro a receber integrações |
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

#### ⏳ 9.6-B — Gamificação: Arquitetura de Perfis e Engine de Rank

**Contexto e regra de negócio revisada:**

Um `user_id` pode ter até 3 perfis **independentes e simultâneos**. O onboarding inicial deixa o usuário escolher com qual perfil começa, mas os 3 podem coexistir:

| Perfil | Tabela | Ativado quando | Critério de rank |
|--------|--------|----------------|-----------------|
| **Consumidor** | `users_company` | Sempre (todo usuário tem) | Assinaturas SaaS ativas como comprador |
| **Afiliado** | `affiliates` (status=active) | Registro opt-in | Conversões indicadas (`total_conversions`) |
| **Produtor** | `producers` (status=verified) | Cadastro aprovado | Assinantes ativos dos seus produtos |

Cada perfil tem seu próprio rank, calculado de forma independente. Um usuário pode ter rank Silver como consumidor, Gold como afiliado e Bronze como produtor ao mesmo tempo.

**Problema atual:**
- `rank_definitions.user_type` só tem `"producer"` e `"affiliate"` — falta `"user"` (consumidor)
- `user_ranks` existe mas nunca é populada — não há engine que observe eventos
- `affiliates.rank_name/rank_level` e `producers.rank_name/rank_level` são campos estáticos, setados manualmente — não refletem a atividade real
- JWT do SSO carrega `rank_name` mas só sincroniza no login

**Arquitetura proposta:**

Ranks são **calculados dinamicamente** a partir da fonte de verdade (tabelas de atividade), não armazenados como valor fixo. O campo `rank_name/rank_level` nas tabelas de perfil é um **cache** que deve ser atualizado por triggers.

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

1. **DB migration:**
   - Adicionar `user_type = 'user'` como valor válido em `rank_definitions` (ou garantir que o CRUD já permita)
   - Criar função SQL `recalculate_rank(profile_type text, profile_id uuid)` no Supabase
   - Criar triggers em `saas_subscriptions` e `affiliates`
   - Popular `user_ranks` com dados históricos via script one-time

2. **API admin:**
   - `POST /api/admin/ranks/recalculate` — recalcula todos os ranks manualmente (para usar após migration)
   - Atualizar `/api/admin/ranks/distribution` para calcular dinamicamente ao invés de ler campos estáticos

3. **SSO:**
   - Revisar `EgSessionClaims.rank_name` — definir qual rank exibir (consumidor por padrão, ou mais alto entre os perfis ativos)
   - Garantir que o JWT é refreshado quando rank muda (via `refreshUser()` após evento de assinatura)

4. **app-front:**
   - Onboarding: tela de seleção de perfil inicial (Consumidor → padrão, Afiliado → opt-in, Produtor → opt-in com cadastro)
   - Exibir rank correto por perfil (consumidor no dashboard geral, afiliado em /affiliate, produtor em /producer)
   - Vincular ao Etapa 10 (Onboarding)

**Arquivos a criar/modificar:**
- Migration SQL Supabase (fora do codebase — executar manualmente)
- `src/app/api/admin/ranks/recalculate/route.ts`
- `src/app/api/admin/ranks/distribution/route.ts` — reescrever com cálculo dinâmico
- `src/components/ui/RankBadge.tsx` — suportar os 3 tipos de perfil
- `sso/src/utils/eg-session.ts` — revisar claim rank_name

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

### ⏳ ETAPA 10 — Implementação do Onboarding (Product Tour)

**Objetivo:** Implementar o Product Tour definido no `ONBOARDING_BLUEPRINT.md`.

**Ações:**
1. Responder as perguntas estratégicas do blueprint com o usuário
2. Definir biblioteca: `driver.js` (leve, sem deps) ou `react-joyride`
3. Criar componente `<ProductTour>` em `@easygoal/ui`
4. Salvar estado "tour concluído" em `@easygoal/core` (campo em UserProfile)
5. Implementar no `app-front` primeiro (fluxo do usuário padrão)
6. Adaptar para `easy-ia` e demais projetos

**Output:** Componente no monorepo + implementação no app-front + pausa para teste.

---

### ⏳ ETAPA 11 — Documentação Técnica (`documentacao-easygoal`)

**Objetivo:** Executar o plano de documentação definido no `ETAPA_2_DOC_PLAN.md`.

**Ações:**
1. Atualizar páginas de instalação/consumo dos pacotes `@easygoal/*`
2. Documentar todos os componentes do Design System (Etapa 7) com exemplos
3. Guia de integração SSO para novos projetos
4. Guia de webhooks e tracking para produtores
5. Changelog visível e versionado

**Output:** PRs no repo `documentacao-easygoal`. Revisar com o usuário antes de publicar.

---

### ⏳ ETAPA 12 — Validação Final e Go-Live

**Objetivo:** Checklist de lançamento com todos os microserviços em ordem.

- [ ] Todos os projetos buildando sem erros
- [ ] SSO funcionando em produção (easy-ia, app-front, site-easygoal)
- [ ] Notificações chegando corretamente
- [ ] Checkout testado end-to-end (pagamento real em sandbox)
- [ ] Webhooks disparando corretamente
- [ ] Analytics capturando eventos básicos
- [ ] Onboarding funcionando em novos usuários
- [ ] Documentação publicada e acessível
- [ ] Performance: Core Web Vitals aceitáveis em todos os projetos
- [ ] Monitoramento básico configurado (erros, uptime)

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
