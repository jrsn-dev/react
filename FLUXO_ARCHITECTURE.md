# FLUXO — Arquitetura de Sistema (Blueprint Executável)

Este documento transforma o briefing funcional do FLUXO em uma arquitetura técnica pronta para implementação incremental.

## 1) Escopo de produto e boundaries

**Domínio principal**
- Financeiro
- Tráfego pago
- Tarefas
- Rotinas operacionais
- CRM
- Atendimento WhatsApp
- Relatórios
- Automações

**Princípio de evolução**
- Iniciar com **modular monolith** no backend (NestJS) para reduzir complexidade operacional.
- Migrar para microserviços por domínio somente quando houver gargalo real de escala/equipe.

---

## 2) Arquitetura alvo (alto nível)

- **Frontend Web**: Next.js (App Router), React, Tailwind, shadcn/ui, Framer Motion.
- **Backend API**: NestJS, REST + WebSocket Gateway.
- **Banco transacional**: PostgreSQL (schema por domínio).
- **Cache e sessões efêmeras**: Redis.
- **Mensageria/Jobs**: RabbitMQ (eventos e tarefas assíncronas).
- **Storage**: AWS S3 (anexos, exportações PDF/XLSX).
- **Auth**: JWT access token + refresh token rotativo + OAuth Google.
- **Observabilidade**: Prometheus (métricas), Grafana (dashboards), Sentry (erros), logs estruturados JSON.
- **Infra**: Docker, Kubernetes, Nginx Ingress, Vercel (frontend), AWS (backend/data).

---

## 3) Módulos backend (NestJS)

### 3.1 Núcleo
- `auth`
- `users`
- `companies`
- `roles_permissions` (RBAC)
- `audit_logs`
- `notifications`

### 3.2 Domínios
- `financial`
- `traffic`
- `tasks`
- `routines`
- `crm`
- `whatsapp`
- `reports`
- `automations`

### 3.3 Transversais
- `files` (upload S3)
- `integrations` (Meta, Google Ads, Stripe, Twilio etc.)
- `websocket` (notificações e chat)

---

## 4) Modelo de dados sugerido (PostgreSQL)

> Convenções: UUID PK, `created_at`, `updated_at`, `deleted_at` (soft delete quando aplicável), `company_id` para multi-tenant.

### 4.1 Tabelas núcleo
- `companies`
- `users`
- `roles`
- `permissions`
- `role_permissions`
- `user_roles`
- `audit_logs`
- `notifications`

### 4.2 Financeiro
- `financial_accounts` (contas bancárias/caixas)
- `financial_categories`
- `cost_centers`
- `financial_transactions`
- `financial_recurrences`
- `invoices` (opcional para cobrança)

### 4.3 Tráfego
- `ad_accounts`
- `campaigns`
- `campaign_metrics_daily`
- `campaign_goals`

### 4.4 Tarefas
- `task_boards`
- `task_columns`
- `tasks`
- `task_checklists`
- `task_comments`
- `task_attachments`

### 4.5 Rotinas
- `routine_templates`
- `routine_items`
- `routine_executions`
- `routine_logs`
- `routine_approvals`

### 4.6 CRM
- `crm_leads`
- `crm_pipeline_stages`
- `crm_deals`
- `crm_activities`
- `crm_tags`
- `crm_lead_tags`

### 4.7 WhatsApp
- `whatsapp_sessions`
- `whatsapp_contacts`
- `whatsapp_conversations`
- `whatsapp_messages`
- `quick_replies`

### 4.8 Relatórios/Exportações
- `report_definitions`
- `report_runs`
- `export_files`

---

## 5) Multi-tenant e segurança

### 5.1 Multi-tenant
- Estratégia inicial: **single database + shared schema + `company_id`**.
- Todas as queries de domínio devem incluir escopo por `company_id`.
- Índices compostos: `(company_id, created_at)`, `(company_id, status)` etc.

### 5.2 Segurança
- JWT curto (ex.: 15 min) + refresh rotativo (ex.: 7-30 dias).
- Password hashing com Argon2.
- TLS obrigatório (HTTPS).
- Rate limiting por IP + usuário + rota sensível.
- Criptografia de secrets via KMS/Secrets Manager.
- Auditoria para eventos críticos (financeiro, permissões, exclusões).

---

## 6) API design (REST)

### 6.1 Núcleo
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/users/me`

### 6.2 Financeiro
- `GET /api/financial/transactions`
- `POST /api/financial/transactions`
- `PATCH /api/financial/transactions/:id`
- `GET /api/financial/reports/dre`

### 6.3 Tarefas
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `POST /api/tasks/:id/comments`

### 6.4 CRM
- `GET /api/crm/leads`
- `POST /api/crm/leads`
- `PATCH /api/crm/leads/:id/stage`

### 6.5 WhatsApp
- `POST /api/whatsapp/sessions`
- `GET /api/whatsapp/conversations`
- `POST /api/whatsapp/messages`

### 6.6 WebSocket
- `/ws/notifications`
- `/ws/chat`

---

## 7) Eventos assíncronos (RabbitMQ)

### 7.1 Eventos de domínio
- `financial.transaction.created`
- `task.created`
- `task.overdue`
- `crm.lead.created`
- `campaign.metric.ingested`
- `whatsapp.message.received`

### 7.2 Consumers
- Notificações
- Automação de follow-up
- Geração de relatórios
- Enriquecimento de dados e sync de integrações

---

## 8) Observabilidade e SRE

- **Métricas**: latência p95, p99; throughput; taxa de erro; filas pendentes; tempo de job.
- **Logs**: correlação por `request_id` e `company_id`.
- **Tracing**: OpenTelemetry (opcional em V2).
- **Alertas**: erro 5xx elevado, fila acumulada, falha de integrações externas.

---

## 9) Roadmap técnico por fases

### V1 (90 dias)
- Auth/RBAC
- Dashboard base
- Financeiro core
- Tarefas core
- Notificações internas

### V2 (60-90 dias)
- CRM completo
- Rotinas operacionais
- WhatsApp (MVP multiatendimento)
- Relatórios exportáveis

### V3 (90 dias)
- IA (resumos, insights, sugestões)
- Automações avançadas
- Otimização de escala e split de serviços críticos

---

## 10) Stack frontend (Next.js)

### Organização sugerida
- `app/(auth)`
- `app/(dashboard)`
- `app/(financial)`
- `app/(tasks)`
- `app/(crm)`
- `app/(routines)`
- `app/(whatsapp)`

### Camadas
- UI components (shadcn)
- Feature components por domínio
- `services/api` (SDK HTTP)
- `state` (Zustand/Redux Toolkit apenas onde necessário)
- `hooks` (queries/mutations com TanStack Query)

---

## 11) Critérios de qualidade (Definition of Done)

- Endpoint com validação DTO + testes unitários de serviço.
- Teste de integração para fluxo crítico.
- Controle RBAC validado.
- Logs e métricas instrumentados.
- Tratamento padronizado de erro.
- Documentação OpenAPI atualizada.

---

## 12) Riscos e mitigação

- **Complexidade de integrações**: isolar adaptadores por provider.
- **Escopo inflado**: priorizar KPIs de V1 e cortar features não essenciais.
- **Dependência de canais externos (WhatsApp/APIs Ads)**: fila + retentativas + DLQ.
- **Segurança multi-tenant**: testes automatizados de isolamento por `company_id`.

---

## 13) Próximos passos de implementação

1. Criar monorepo (apps/web, apps/api, packages/ui, packages/config).
2. Provisionar ambiente base (Postgres + Redis + RabbitMQ via Docker Compose).
3. Implementar módulo Auth + RBAC + multi-tenant context.
4. Entregar V1 vertical slice: Financeiro (CRUD + dashboard KPIs).
5. Entregar V1 vertical slice: Tarefas (Kanban + notificações).
6. Preparar CI/CD (lint, test, build, deploy).

