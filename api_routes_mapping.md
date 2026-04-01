# 📚 Documentação da API — Reativa

> Centraliza todas as rotas da API do Reativa, detalhando métodos, parâmetros e descrições para facilitar a integração entre Frontend e Backend.

---

## Índice

1. [Autenticação](#-1-autenticação-auth)
2. [Atendentes](#-2-atendentes-attendants)
3. [Comissões](#-3-comissões-commissions)
4. [Reengajamento de Clientes](#-4-reengajamento-de-clientes-reengagements)
5. [Dashboard, Ranking & Métricas](#-5-dashboard-ranking--métricas)
6. [Localidades e Filtros Globais](#-6-localidades-e-filtros-globais-locations)

---

## 🔐 1. Autenticação (Auth)

> Todas as rotas **(exceto `/api/login`)** exigem o cabeçalho:
>
> ```
> Authorization: Bearer <token>
> ```

| Método | Rota           | Descrição               | Parâmetros                                                                 |
|--------|----------------|-------------------------|----------------------------------------------------------------------------|
| POST   | `/api/login`   | Login no sistema        | **Body:** `login` (string, obrigatório), `password` (string, obrigatório) |
| POST   | `/api/logout`  | Logout do sistema       | —                                                                          |
| GET    | `/api/user`    | Usuário autenticado     | —                                                                          |

---

## 👥 2. Atendentes (Attendants)

| Método | Rota                                           | Descrição                        | Parâmetros |
|--------|------------------------------------------------|----------------------------------|------------|
| GET    | `/api/attendants`                              | Lista e filtra atendentes        | **Query:** `country_code` (string, opcional), `search` (string, opcional), `type` (int, opcional) |
| POST   | `/api/attendants/create`                       | Cria novo atendente              | **Body:** `user_login` (string, obrigatório), `type` (int, obrigatório), `graduation` (int, obrigatório), `supervisor_id` (int, opcional) |
| GET    | `/api/attendants/{attendant}/show`             | Detalhes e métricas do atendente | **Path:** `attendant` (ID) — **Query:** `start_date` (YYYY-MM-DD, opcional), `end_date` (YYYY-MM-DD, opcional) |
| POST   | `/api/attendants/{attendant}/update`           | Atualiza dados do atendente      | **Path:** `attendant` (ID) — **Body:** `type` (int, opcional), `graduation` (int, opcional), `parent_id` (int, opcional) |
| POST   | `/api/attendants/{attendant}/delete`           | Remove atendente sem relações    | **Path:** `attendant` (ID) |
| GET    | `/api/attendants/{attendant}/children`         | Lista equipe subordinada         | **Path:** `attendant` (ID) |
| POST   | `/api/attendants/{attendant}/link-parent`      | Vincula supervisor (parent)      | **Path:** `attendant` (ID) — **Body:** `parent_id` (int, obrigatório) |

---

## 💰 3. Comissões (Commissions)

> Rotas para configuração e consulta de comissões por atendente e por rede.

| Método | Rota                                                                       | Descrição                        | Parâmetros |
|--------|----------------------------------------------------------------------------|----------------------------------|------------|
| POST   | `/api/attendants/{attendant}/commissions/create`                           | Cria regra de comissão           | **Path:** `attendant` (ID) — **Body:** `commission_percent` (float, obrigatório), `min_sales` (float, obrigatório), `max_sales` (float, obrigatório) |
| POST   | `/api/attendants/{attendant}/commissions/{commissionAttendant}/update`     | Atualiza regra de comissão       | **Path:** `attendant` (ID), `commissionAttendant` (ID) — **Body:** igual ao de criação |
| POST   | `/api/attendants/{attendant}/commissions/{commissionAttendant}/delete`     | Remove configuração de comissão  | **Path:** `attendant` (ID), `commissionAttendant` (ID) |
| GET    | `/api/commissions`                                                         | Relatório pessoal de comissões   | **Query:** `start_date` (opcional), `end_date` (opcional), `order_id` (string, opcional), `login` (string, opcional) |
| GET    | `/api/commissions/network`                                                 | Relatório de comissões da rede   | **Query:** `start_date` (opcional), `end_date` (opcional) |

> ⚠️ **Atenção:** A rota `POST /api/attendants/{personalOrder}/commission` está declarada no arquivo de rotas, porém o método `commissionAttendant` **não foi encontrado** no `AttendantCommissionController`. Chamadas a essa rota resultarão em erro `500`. Verificar e remover ou implementar o método antes de expor ao frontend.

---

## 📞 4. Reengajamento de Clientes (Reengagements)

| Método | Rota                                                | Descrição                                         | Parâmetros |
|--------|-----------------------------------------------------|---------------------------------------------------|------------|
| GET    | `/api/reengagements`                                | Lista geral de clientes inativos com métricas     | **Query:** `inactive_days` (int, default: `60`), `has_orders` (bool), `has_paid_orders` (bool), `without_orders` (bool), `state_id`, `city_id`, `region_id`, `orders_count`, `min_orders`, `max_orders`, `search` — todos opcionais |
| POST   | `/api/reengagements/assign`                         | Designa lote de inativos a um atendente           | **Body:** `attendant_id` (int, obrigatório), `quantity` (int, min: 1, obrigatório) + todos os filtros do GET acima |
| GET    | `/api/reengagements/personal`                       | Lista designados do usuário autenticado           | **Query:** `start_date`, `end_date`, `status` (int), `search` (string) — todos opcionais |
| GET    | `/api/reengagements/user/{user}`                    | Detalhes de um contato específico                 | **Path:** `user` (ID) |
| POST   | `/api/reengagements/user/{user}/update-data`        | Edita dados pessoais do cliente inativo           | **Path:** `user` (ID) — **Body:** `email` (string, opcional), `password` (string, opcional), `birth_date` (YYYY-MM-DD, opcional), `status` (int, opcional) |
| POST   | `/api/reengagements/user/{user}/update-status`      | Altera o status do reengajamento                  | **Path:** `user` (ID) — **Body:** `status` (int, obrigatório) |
| GET    | `/api/reengagements/user/{user}/access-store`       | Gera token especial para acesso à loja            | **Path:** `user` (ID) |
| POST   | `/api/reengagements/{reengagement}/observations`    | Registra observação e agenda próximo contato      | **Path:** `reengagement` (ID) — **Body:** `observation` (string, obrigatório), `next_contact_date` (datetime, obrigatório) |

---

## 📊 5. Dashboard, Ranking & Métricas

| Método | Rota                            | Descrição                                            | Parâmetros |
|--------|---------------------------------|------------------------------------------------------|------------|
| GET    | `/api/dashboard`                | Visão geral — líderes e receita mensal               | **Query:** `start_date` (opcional), `end_date` (opcional) |
| GET    | `/api/leaderboard`              | Gamificação dos atendentes (XP e níveis)             | **Query:** `start_date` (opcional), `end_date` (opcional) |
| GET    | `/api/supervisor/performance`   | Relatório de desempenho da equipe do supervisor      | **Query:** `start_date` (opcional), `end_date` (opcional) |
| GET    | `/api/manager/performance`      | Relatório geral dos times de supervisores            | **Query:** `start_date` (opcional), `end_date` (opcional) |

---

## 🌎 6. Localidades e Filtros Globais (Locations)

| Método | Rota                          | Descrição                         | Parâmetros |
|--------|-------------------------------|-----------------------------------|------------|
| GET    | `/api/locations/countries`    | Lista de países ativos            | — |
| GET    | `/api/locations/regions`      | Lista de regiões por país         | **Query:** `country_id` (int, default: `1`) |
| GET    | `/api/locations/states`       | Lista de estados por país/região  | **Query:** `country_id` (int, default: `1`), `region_id` (int, opcional) |
| GET    | `/api/locations/cities`       | Lista de cidades por estado       | **Query:** `state_id` (int, opcional) |

---

## 📝 Observações Gerais

- Todo parâmetro marcado como **obrigatório** deve sempre ser enviado na requisição; os demais são **opcionais**.
- Utilize sempre o token JWT no cabeçalho `Authorization: Bearer <token>` em todas as rotas protegidas.
- Datas seguem o formato **`YYYY-MM-DD`**; campos de data-hora seguem **`YYYY-MM-DD HH:MM:SS`** (ou ISO 8601).
- Em caso de dúvidas ou inconsistências, consulte o backend ou abra uma issue no repositório.

> 📌 **Última atualização:** Março/2026