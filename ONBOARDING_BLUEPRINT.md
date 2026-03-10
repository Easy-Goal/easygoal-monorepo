# Blueprint de Onboarding — Product Tour EasyGoal

> Este documento NÃO contém código. É um questionário estratégico para o próximo agente
> coletar as respostas certas antes de implementar o Product Tour.

---

## 1. ESCOPO E APLICATIVOS

- [ ] O tour deve cobrir **quais apps**? (`app-front`, `Easy IA`, `site-easygoal`, todos?)
- [ ] O tour é **por app** (cada um tem seu próprio fluxo) ou **cross-app** (um único guia que atravessa o ecossistema)?
- [ ] Existe uma **ordem obrigatória** de onboarding? (ex: usuário DEVE configurar perfil antes de criar metas)

---

## 2. SEGMENTAÇÃO DE USUÁRIOS

- [ ] O tour deve ser **diferente por papel** (`producer` vê um fluxo, `member` vê outro)?
- [ ] Existe um fluxo especial para **super_admin**?
- [ ] Como tratar usuários que chegam via **convite de empresa** vs. cadastro orgânico?

---

## 3. AÇÕES PRIORITÁRIAS A DESTACAR

Para cada app incluso, responda:

### app-front
- [ ] Quais são as **3–5 ações principais** que o novo usuário deve descobrir primeiro?
  - Ex: "Criar primeira meta", "Convidar membro", "Ver dashboard"
- [ ] Existe alguma ação que **deve ser completada** para liberar o restante da plataforma (hard gate)?

### Easy IA
- [ ] Quais funcionalidades de IA o tour deve apresentar?
- [ ] O usuário precisa conectar alguma conta/credencial antes de usar?

---

## 4. PERSISTÊNCIA DO ESTADO DO TOUR

- [ ] Onde salvar o flag `tour_completed`?
  - Opção A: `@easygoal/core` — campo no `UserProfile` (ex: `onboarding: { completed_at, steps_done }`)
  - Opção B: `localStorage` / `sessionStorage` (sem backend)
  - Opção C: Tabela dedicada no Supabase
- [ ] O tour pode ser **reiniciado** pelo usuário (ex: botão "Ver tour novamente")?
- [ ] Precisa de granularidade por **passo** (saber quais steps foram vistos) ou apenas `completed: boolean`?

---

## 5. COMPONENTE E BIBLIOTECA

- [ ] Já existe alguma biblioteca de tour aprovada? (`driver.js`, `react-joyride`, `intro.js`, solução própria?)
- [ ] O tour deve ser **modal/overlay** (bloqueia interação) ou **tooltip não-bloqueante**?
- [ ] Precisa suportar **mobile**?

---

## 6. CONTEÚDO E COPY

- [ ] Quem escreve o copy dos steps? (produto, marketing, o próximo agente gera um rascunho?)
- [ ] Haverá **imagens ou vídeos** nos steps, ou apenas texto + tooltip?
- [ ] O tour deve estar em **PT-BR apenas** ou há planos de internacionalização?

---

## 7. ANALYTICS E MÉTRICAS

- [ ] Precisa rastrear **taxa de conclusão** do tour?
- [ ] Qual ferramenta de analytics já está nos apps? (Mixpanel, Amplitude, GA4, nenhuma?)
- [ ] Quais eventos devem ser disparados? (ex: `onboarding_started`, `onboarding_step_N_viewed`, `onboarding_completed`, `onboarding_skipped`)

---

## 8. CRITÉRIOS DE SAÍDA DO TOUR

- [ ] O usuário pode **pular** o tour? Se sim, mostra novamente na próxima sessão?
- [ ] Após quantas sessões o tour **para de aparecer** automaticamente mesmo sem completar?
- [ ] Existe um **CTA final** ao completar o tour? (ex: "Criar sua primeira meta agora")

---

## 9. INTEGRAÇÃO COM `@easygoal/core`

O próximo agente precisará das seguintes decisões para implementar:

```typescript
// Proposta de extensão no UserProfile (packages/core/src/types/user-profile.ts)
interface OnboardingProgress {
  completed_at: string | null;   // ISO 8601, null = não completou
  skipped_at: string | null;
  last_step_seen: number | null;
  steps_completed: string[];     // IDs dos steps concluídos
}

// Pergunta: adicionar como campo opcional no UserProfile?
// interface UserProfile { ..., onboarding?: OnboardingProgress }
```

- [ ] A proposta acima está alinhada com o modelo de dados do Supabase?
- [ ] O campo `onboarding` fica em `user_metadata` do Supabase Auth ou em tabela separada?

---

## CHECKLIST PARA O PRÓXIMO AGENTE

Antes de escrever uma linha de código do tour, confirme:

1. [ ] Apps cobertos pelo tour definidos
2. [ ] Segmentação por papel definida (sim/não)
3. [ ] Lista de steps por app aprovada pelo produto
4. [ ] Estratégia de persistência decidida
5. [ ] Biblioteca de UI escolhida
6. [ ] Campos de `OnboardingProgress` validados contra o banco
7. [ ] Eventos de analytics mapeados
8. [ ] Comportamento de "pular" e "reiniciar" definido
