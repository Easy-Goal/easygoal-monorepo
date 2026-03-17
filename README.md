# easygoal-monorepo

Pacotes npm compartilhados do ecossistema Easy Goal.

## Packages

| Package | Descrição |
|---------|-----------|
| `@easygoal/ui` | Design system — componentes React com Tailwind CSS + CVA |
| `@easygoal/auth` | Autenticação SSO — providers, hooks e handlers |
| `@easygoal/core` | Interfaces TypeScript compartilhadas |

## Instalação

```json
"@easygoal/packages": "github:Easy-Goal/easygoal-monorepo"
```

```bash
npm install
```

## @easygoal/ui

Design system com tema dark (azul escuro + laranja). Baseado em Tailwind CSS e CVA.

```tsx
import {
  Button,
  Badge,
  Card, CardHeader, CardTitle, CardContent, CardFooter,
  Input,
  Textarea,
  Avatar,
  Skeleton,
  AlertBox,
  EmptyState,
  LoadingState,
  StatCard,
  MetricCard,
  Logo,
  EasyHeader,
  NotificationBell,
  UserMenu,
  RankBadge,
} from '@easygoal/packages/ui'
```

### Button

```tsx
<Button variant="default">Salvar</Button>
<Button variant="outline">Cancelar</Button>
<Button variant="gradient" loading>Processando...</Button>
<Button variant="destructive" size="sm">Remover</Button>
```

Variants: `default`, `outline`, `ghost`, `gradient`, `glass`, `destructive`
Sizes: `sm`, `md`, `lg`, `xl`, `icon`

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo do card
  </CardContent>
</Card>
```

### Badge

```tsx
<Badge variant="default">Ativo</Badge>
<Badge variant="success">Pago</Badge>
<Badge variant="warning">Pendente</Badge>
<Badge variant="destructive">Cancelado</Badge>
```

### EmptyState

```tsx
<EmptyState
  title="Nenhum resultado"
  description="Crie seu primeiro item para começar."
  action={<Button>Criar</Button>}
/>
```

### AlertBox

```tsx
<AlertBox variant="info" title="Atenção">
  Mensagem informativa.
</AlertBox>
<AlertBox variant="error">Algo deu errado.</AlertBox>
```

---

## @easygoal/auth

Autenticação SSO centralizada via cookie `eg_session` (JWT HS256).

```tsx
import {
  EgSessionProvider,
  useEgSession,
  useSSOLogin,
  useNotifications,
} from '@easygoal/packages/auth'
```

### Configuração

```tsx
// app/layout.tsx
import { EgSessionProvider } from '@easygoal/packages/auth'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <EgSessionProvider ssoUrl={process.env.NEXT_PUBLIC_SSO_URL}>
          {children}
        </EgSessionProvider>
      </body>
    </html>
  )
}
```

### Callback route

```ts
// app/auth/callback/route.ts
import { createCallbackRoute } from '@easygoal/packages/auth/server'
export const GET = createCallbackRoute()
```

### Login/Logout

```tsx
'use client'
import { useSSOLogin, useEgSession } from '@easygoal/packages/auth'

export function LoginButton() {
  const { login } = useSSOLogin()
  const { user } = useEgSession()

  if (user) return <span>Olá, {user.name}</span>
  return <button onClick={login}>Entrar</button>
}
```

### Notificações

```tsx
'use client'
import { useNotifications } from '@easygoal/packages/auth'

export function Bell() {
  const { notifications, unreadCount, markAsRead } = useNotifications({
    apiUrl: '/api/notifications',
    pollingInterval: 30000,
  })
}
```

---

## @easygoal/core

Interfaces TypeScript compartilhadas entre todos os projetos.

```ts
import type { UserProfile, Notification } from '@easygoal/packages/core'
```

```ts
interface UserProfile {
  id: string
  email: string
  name: string
  avatar_url: string | null
  is_producer: boolean
  rank_name: string
  plan_slug: string
}
```

---

## Build

```bash
# Instalar dependências
npm install

# Build de todos os packages
npm run build --workspaces

# Build individual
cd packages/ui && npm run build
cd packages/auth && npm run build
cd packages/core && npm run build
```

## Contribuindo

1. Faça suas alterações no package correspondente
2. Execute o build: `npm run build` no package
3. Confirme que o `dist/` foi atualizado
4. Abra um Pull Request

## Requisitos

- Node.js 18+
- npm 9+
