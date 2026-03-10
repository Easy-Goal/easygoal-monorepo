# ETAPA 2 — Plano de Ação de Documentação
> Roadmap para refatoração do `documentacao-easygoal` (Mintlify)
> Gerado após auditoria visual de: `app-front`, `site-easygoal`, `easy-ia`

---

## 1. PADRÃO DE DESIGN OFICIAL DO ECOSSISTEMA EASYGOAL

### Paleta de Cores (tokens unificados)

| Token               | HSL                  | Hex approx  | Uso                                  |
|---------------------|----------------------|-------------|--------------------------------------|
| `--primary`         | `hsl(24 95% 53%)`    | `#F97316`   | CTAs, botões, destaques              |
| `--primary-hover`   | `hsl(18 100% 55%)`   | `#FF6B1A`   | Hover em botões primários            |
| `--background`      | `hsl(222 47% 11%)`   | `#0E1629`   | Fundo padrão dark                    |
| `--background-deep` | `hsl(220 50% 12%)`   | `#0D1526`   | Fundos mais profundos / sidebars     |
| `--secondary`       | `hsl(222 47% 18%)`   | `#192338`   | Cards, superfícies elevadas          |
| `--text`            | `hsl(0 0% 100%)`     | `#FFFFFF`   | Texto principal                      |
| `--text-muted`      | `hsl(220 13% 70%)`   | `#ABB3C4`   | Texto secundário, labels             |
| `--accent-green`    | `hsl(134 61% 41%)`   | `#29A84A`   | WhatsApp, sucesso, integrações       |
| `--radius`          | `0.75rem`            | —           | Border radius padrão global          |

> **Regra:** Sempre usar variáveis CSS (`var(--primary)`) nos componentes do monorepo. Nunca harcodear valores hex.

---

### Tipografia

| Papel        | Fonte         | Pesos         | Uso                                   |
|--------------|---------------|---------------|---------------------------------------|
| Display/Hero | Space Grotesk | 600, 700      | Títulos de página, seções de hero     |
| Body         | Inter         | 400, 500, 600 | Corpo de texto, UI geral              |
| Monospace    | JetBrains Mono| 400, 500      | Blocos de código, snippets técnicos   |

> **Regra:** `Space Grotesk` para impacto visual, `Inter` para legibilidade funcional.

---

### Sistema de Animações (padrão `site-easygoal`)

As classes de animação abaixo serão exportadas no `@easygoal/ui` como utilitários globais:

```css
/* Fade e movimento */
.animate-fade-in-up    /* 0.6s ease-out, fadeInUp */
.animate-float         /* 6s translateY loop infinito */

/* Gradientes e brilho */
.animate-gradient      /* 8s background-position shift */
.shadow-glow           /* 0 0 60px orange/accent glow */
.text-gradient         /* Gradient text via background-clip */

/* Superfícies */
.glass                 /* backdrop-blur + semi-transparente */
.glass-strong          /* versão mais opaca */
.card-premium          /* card com borda sutil + glow */

/* Interação */
.btn-shimmer           /* efeito de shine em botões */

/* Stagger para listas */
/* delay de 60ms incremental por item */
```

---

## 2. COMPONENTES PARA MIGRAR PARA `@easygoal/ui`

### Da `app-front/src/components/shared/` → `@easygoal/ui/dashboard`

| Componente       | Descrição                            | Prioridade |
|------------------|--------------------------------------|------------|
| `StatCard`       | Métrica com indicador de tendência   | Alta       |
| `MetricCard`     | KPI card                             | Alta       |
| `UserAvatar`     | Avatar com fallback                  | Alta       |
| `EmptyState`     | Estado vazio padronizado             | Alta       |
| `LoadingState`   | Skeleton de carregamento             | Alta       |
| `AlertBox`       | Alertas/notificações inline          | Média      |
| `DonutChart`     | Gráfico donut para dashboard         | Média      |
| `MiniChart`      | Gráfico compacto                     | Baixa      |
| `ProductImage`   | Imagem com fallback inteligente      | Baixa      |
| `QuickLinkCard`  | Card de navegação rápida             | Baixa      |

### Da `app-front/src/components/ui/` → `@easygoal/ui/primitives`

| Componente   | Origem         | Observação                              |
|--------------|----------------|-----------------------------------------|
| `button`     | shadcn + CVA   | Adicionar variante `cta` do site        |
| `card`       | shadcn         | Unificar com `card-premium` do site     |
| `badge`      | shadcn         | Incluir `RankBadge` customizado         |
| `input`      | shadcn         | Manter padrão atual                     |
| `dialog`     | shadcn         | Manter padrão atual                     |
| `table`      | shadcn         | Manter padrão atual                     |
| `select`     | shadcn         | Manter padrão atual                     |
| `checkbox`   | shadcn         | Manter padrão atual                     |

### Da `site-easygoal/src/components/` → `@easygoal/ui/marketing`

| Componente           | Descrição                            |
|----------------------|--------------------------------------|
| `MagneticButton`     | Botão com efeito magnético no hover  |
| `WhatsAppButton`     | CTA flutuante para WhatsApp          |
| `ServicePageTemplate`| Template reutilizável de página      |

---

## 3. PÁGINAS DO MINTLIFY A CRIAR/ALTERAR

### Estrutura recomendada para `documentacao-easygoal`:

```
docs/
├── introduction.mdx           ← ALTERAR: atualizar overview do ecossistema
├── quickstart.mdx             ← ALTERAR: incluir instalação do monorepo
│
├── design-system/
│   ├── colors.mdx             ← CRIAR: tabela de tokens HSL + previews
│   ├── typography.mdx         ← CRIAR: Space Grotesk + Inter + Mono
│   ├── animations.mdx         ← CRIAR: catálogo de classes de animação
│   └── icons.mdx              ← CRIAR: guia Lucide React no ecossistema
│
├── packages/
│   ├── ui/
│   │   ├── overview.mdx       ← CRIAR: visão geral do @easygoal/ui
│   │   ├── primitives.mdx     ← CRIAR: button, card, badge, input, etc.
│   │   ├── dashboard.mdx      ← CRIAR: StatCard, MetricCard, UserAvatar, etc.
│   │   └── marketing.mdx      ← CRIAR: MagneticButton, WhatsAppButton, etc.
│   │
│   ├── auth/
│   │   ├── overview.mdx       ← CRIAR: visão geral do @easygoal/auth
│   │   ├── client.mdx         ← CRIAR: useEgSession, useSSOLogin, EgSessionProvider
│   │   ├── server.mdx         ← CRIAR: getSessionUserId, requireSession, requireAdmin
│   │   └── user-type.mdx      ← CRIAR: interface EgSessionUser documentada
│   │
│   └── core/
│       ├── overview.mdx       ← CRIAR: visão geral do @easygoal/core
│       ├── user-profile.mdx   ← CRIAR: interface unificada de perfil
│       └── notifications.mdx  ← CRIAR: sistema de notificações
│
└── integration/
    ├── app-front.mdx          ← CRIAR: como app-front consome o monorepo
    ├── site-easygoal.mdx      ← CRIAR: como site consome o monorepo
    └── easy-ia.mdx            ← CRIAR: guia de integração SSO (Etapa 4)
```

---

## 4. DIRETRIZES DE COPY E VISUAL PARA MINTLIFY

### Paleta no `mint.json`
```json
{
  "colors": {
    "primary": "#F97316",
    "light": "#FDBA74",
    "dark": "#EA580C",
    "background": {
      "dark": "#0E1629"
    }
  }
}
```

### Tom de Voz
- **Direto e técnico:** Foco em exemplos de código funcionais, não em descrições longas.
- **Progressivo:** Cada página começa com um snippet de instalação/uso mínimo.
- **Consistente:** Todos os componentes documentados com: `Instalação → Props → Exemplo → Variantes`.

### Template de página de componente (padrão)
```mdx
---
title: NomeDoComponente
description: Uma linha descrevendo o componente
---

## Instalação
<CodeGroup>
```bash npm
npm install @easygoal/ui
```
```bash pnpm
pnpm add @easygoal/ui
```
</CodeGroup>

## Uso básico
```tsx
import { NomeDoComponente } from '@easygoal/ui'

<NomeDoComponente prop="valor" />
```

## Props
<ParamField ...>

## Variantes
<Tabs>...
```

---

## 5. ESTADO ATUAL E GAPS IDENTIFICADOS

| Problema                                        | Impacto | Solução                                  |
|-------------------------------------------------|---------|------------------------------------------|
| Tailwind v3 no site + easy-ia vs v4 no app-front | Alto    | Padronizar em v3 no monorepo; planejar migração gradual |
| Animações duplicadas em globals.css de cada projeto | Médio  | Centralizar em `@easygoal/ui/styles`     |
| Tokens HSL levemente divergentes entre projetos | Médio   | Definir `tokens.css` canônico no monorepo |
| `easy-ia` sem auth/SSO                         | Alto    | Coberto na Etapa 4                       |
| Documentação inexistente para `@easygoal/*`    | Alto    | Este plano resolve                       |

---

## 6. CHECKLIST PARA PRÓXIMO AGENTE

- [ ] Criar estrutura de pastas no `documentacao-easygoal` conforme seção 3
- [ ] Atualizar `mint.json` com paleta oficial (seção 4)
- [ ] Escrever página `design-system/colors.mdx` com tokens unificados
- [ ] Escrever página `packages/auth/client.mdx` com `useEgSession` e `useSSOLogin`
- [ ] Escrever página `packages/auth/server.mdx` com helpers de server-side
- [ ] Criar `tokens.css` canônico em `@easygoal/ui` e referenciar nos projetos
- [ ] Decidir versão definitiva do Tailwind para o monorepo (v3 ou v4)

---

**Status:** Etapa 2 concluída. Aguardando validação para iniciar Etapa 3 (Build e Validação do Monorepo).
