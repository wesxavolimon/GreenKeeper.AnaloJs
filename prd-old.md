# 🌿 PRD — GreenKeeper (PlantumHibis)

## 1. Visão do Produto e Proposta de Valor

O **GreenKeeper** (rebatizado visualmente como **PlantumHibis**) é um ecossistema **offline-first, gratuito e multiplataforma** para monitoramento e rotina de cuidados de plantas domésticas.

- **Problema que resolve:** Falta de um aplicativo gratuito que una organização por ambientes físicos, rotina inteligente de cuidados (rega, adubação e poda), identificação botânica e integração meteorológica local sem depender de conexão constante com a internet.
- **Princípio Central (Offline-First):** Todo cadastro (incluindo a criação da conta e geração de UUIDs) ocorre localmente no SQLite do dispositivo, permitindo uso imediato 100% offline. A sincronização com o servidor e entre múltiplos dispositivos ocorre em segundo plano sob demanda.

---

## 2. Ecossistema de Aplicações e Plataformas

| Repositório | Papel no Produto | Stack Principal | Status |
| :--- | :--- | :--- | :--- |
| [`GreenKeeper.Frontend/`](GreenKeeper.Frontend/README.md) | App cliente principal (Android e Windows Desktop) com design system **PlantumHibis** | .NET 10, C# 13, .NET MAUI, SQLite + EF Core 10, SkiaSharp | **Ativo (Produção/Principal)** |
| [`GreenKeeper.Backend/`](GreenKeeper.Backend/README.md) | API REST para contas, autenticação passwordless, sync multi-device e proxy seguro de APIs botânicas | Python, FastAPI, SQLAlchemy Async, Alembic, PostgreSQL / SQL Server | **Ativo (Produção/Principal)** |
| [`GreenKeeper.Frontend.Reactnative/`](GreenKeeper.Frontend.Reactnative/AGENTS.md) | Frente mobile/web visando Android nativo + PWA com build/E2E 100% em Docker | Expo SDK 56, React Native 0.85, TypeScript, Drizzle ORM | **Em desenvolvimento (Esqueleto)** |
| [`GreenKeeper.Frontend.NgNative/`](GreenKeeper.Frontend.NgNative/AGENTS.md) | Spike experimental de viabilidade em Angular nativo + PWA | Nx, Angular 22, `@ng-native`, Expo SDK 57 | **Experimental (Esqueleto)** |
| [`GreenKeeper.AnaloJs/`](GreenKeeper.AnaloJs/graphify-out/GRAPH_REPORT.md) | Frente PWA mobile-only em AnalogJS (dashboard botânico direto sem login + gate mobile-only) | AnalogJS (SPA estática), TypeScript, Vitest, Playwright | **Experimental (Esqueleto)** |

---

## 3. Requisitos Funcionais por Módulo

### 3.1. Autenticação, Cadastro Local-First e Sessão

*Referências:* `GreenKeeper.Frontend/src/GreenKeeper.Domain/Entities/AppUser.cs`, `GreenKeeper.Backend/app/Api/routers/accounts_router.py`, `GreenKeeper.Backend/app/Api/routers/auth_router.py`

1. **Tela Unificada de Acesso (`LoginPage`):**
   - Controle segmentado entre **Entrar** e **Criar conta** (além de placeholders visuais para login social Google/Apple).
2. **Cadastro Local-First (`POST /accounts/register`):**
   - O usuário informa Nome, Apelido e E-mail.
   - O app gera o `UserId` (`Guid`) localmente no SQLite e **libera o uso imediato do aplicativo**, mesmo sem internet.
   - Em background (best-effort), envia o registro ao backend, que cria o usuário como `PENDING_ACTIVATION` e dispara e-mail de confirmação via **Resend**.
3. **Confirmação de Conta (`GET /accounts/confirm/{token}`):**
   - Link clicável enviado por e-mail que retorna página HTML confirmando a ativação da conta (`ACTIVE`).
4. **Login Passwordless via Magic Link / Código de 6 Dígitos:**
   - **Solicitação (`POST /auth/magic-link`):** Envia por e-mail um **código numérico de 6 dígitos** e um link clicável (rate limit: 3 requisições/hora por e-mail).
   - **Validação (`GET /auth/magic/{token}`):** Aceita tanto a digitação manual dos 6 dígitos (útil quando o e-mail é aberto em outro dispositivo) quanto a captura automática por **Deep Link** (`greenkeeper://auth/{token}` via `intent-filter` no Android e protocolo customizado no registro do Windows).
   - **Sessão JWT e Pareamento:** Emite `access_token` (15 min) e `refresh_token` (30 dias, renovado automaticamente via `POST /auth/refresh` ao receber HTTP `401`) e registra o dispositivo automaticamente via `POST /devices`.
5. **Isolamento Multi-Usuário:**
   - Todas as entidades possuem `UserId` e filtro global no EF Core (`AppDbContext`), garantindo que múltiplos perfis locais ou remotos nunca misturem dados.

---

### 3.2. Perfil do Usuário e Configurações (`ConfigSheet` & `PerfilPage`)

*Referências:* `GreenKeeper.Frontend/src/GreenKeeper.Domain/Entities/AppUser.cs`, `GreenKeeper.Backend/app/Api/routers/accounts_router.py`

1. **Menu Global de Configurações (`ConfigSheet`):**
   - Bottom sheet acionado pelo 5º ícone (`⚙`) da barra de navegação inferior, dando acesso rápido a: **Perfil**, **Sincronização**, **Casas**, **Áreas** e **Sobre o App**.
2. **Dados Pessoais e Avatar:**
   - Exibição de avatar com iniciais ou foto de perfil local comprimida (`PhotoBase64`, câmera/galeria/remoção).
   - Edição individual em bottom sheets (`PerfilFieldSheet`) para: **Nome completo**, **Apelido**, **Sexo** e **Data de Nascimento**. O **E-mail** é exibido apenas para leitura (imutável).
3. **Endereço Estruturado com CEP e GPS (`PerfilEnderecoSheet`):**
   - Campos: **CEP**, **Logradouro**, **Número**, **Complemento**, **Bairro**, **Cidade** e **Estado (UF)**.
   - **Busca automática por CEP:** Ao digitar 8 dígitos (ou tocar no botão 🔍), consulta a **AwesomeAPI** (sem API key), preenchendo endereço completo + coordenadas (`Latitude`/`Longitude`) em uma única chamada.
   - **Localização via GPS:** Link *"Usar GPS para localização"* obtém coordenadas diretamente do hardware (`IGeolocationService`), com fallback para geocodificação nativa (`IGeocodingService`).
   - **Sincronização de Perfil:** Salva local-first e sincroniza em background via `PATCH /accounts/{user_id}` (mantendo compatibilidade entre endereço estruturado e `address_line` derivado).
4. **Sobre o App (`AboutSheet`):**
   - Exibe identidade visual PlantumHibis, versão local do app (`AppInfo`) e versão/build do backend consumidos via `GET /version` (com fallback local se offline).
5. **Logout (`ConfirmLogoutSheet`):**
   - Confirmação em bottom sheet para encerrar a sessão ativa.

---

### 3.3. Gestão de Ambientes: Casas e Áreas

*Referências:* `GreenKeeper.Frontend/src/GreenKeeper.Domain/Entities/Casa.cs`, `GreenKeeper.Frontend/src/GreenKeeper.Domain/Entities/Area.cs`, `GreenKeeper.Backend/app/Api/routers/houses_router.py`, `GreenKeeper.Backend/app/Api/routers/areas_router.py`

1. **Casas (`CasasPage` / `CasaEditSheet`):**
   - **Atributos:** Nome, Tipo (`Residência`, `Prédio`, `Comercial`), Endereço estruturado completo (mesmo fluxo de CEP via AwesomeAPI + GPS do Perfil), status (`Ativa`/`Inativa`), `DataEntrada` e `DataSaida`.
   - **Regras de Negócio:**
     - Se o usuário possui **0 casas**, o sistema conduz ao cadastro guiado no primeiro uso.
     - Se possui **1 casa ativa**, ela é selecionada automaticamente nos fluxos de Áreas e Plantas.
     - **Inativação Segura:** Ao inativar uma Casa que possui Áreas vinculadas, o sistema exige a **transferência prévia das Áreas** para outra Casa ativa (e bloqueia a inativação caso não exista outra Casa ativa).
2. **Áreas (`AreasPage` / `AreaEditSheet`):**
   - Representam os cômodos ou espaços físicos (ex.: Varanda, Sala, Quintal) agrupados na listagem por Casa (com badge visual quando a Casa está inativa).
   - **Atributos:** Nome, Casa vinculada (picker permite selecionar apenas Casas ativas), **Luminosidade / Exposição Solar** (`Sombra`, `Meia Sombra`, `Sol Pleno`), Orientação e flag **"Recebe chuva direta"** (`RecebeChuvaDireta`).
   - Permite mover uma Área de uma Casa para outra e excluir Áreas.

---

### 3.4. Gestão de Plantas e Inteligência Botânica (Espécies)

*Referências:* `GreenKeeper.Frontend/src/GreenKeeper.Domain/Entities/Planta.cs`, `GreenKeeper.Frontend/src/GreenKeeper.Domain/Entities/Especie.cs`, `GreenKeeper.Backend/app/Api/routers/plants_router.py`, `GreenKeeper.Backend/app/Api/routers/species_proxy_router.py`

1. **Catálogo e Listagem de Plantas (`PlantasPage`):**
   - Cadastro com Apelido, Espécie, Área vinculada, Foto local (comprimida automaticamente via `ImageCompressionService` para 1–2 MB em `AppData/GreenKeeper/Plants/`), notas/descrição e configuração de poda.
   - Filtro por ciclo de vida/status: **Ativa**, **Removida** ou **Morta** (ao marcar como `Morta`, define automaticamente `DataObito`; reverter para `Ativa` preserva o histórico).
   - Exclusão de planta via bottom sheet de edição.
2. **Descoberta e Identificação de Espécies:**
   - **Autocomplete Textual (Direto do App, sem API Key):** Busca com debounce de 400ms (mínimo 3 caracteres) combinando **Wikipedia OpenSearch (PT-BR)** (nomes populares) e **GBIF (`/v1/species/match`)** (nomes científicos).
   - **Identificação por Foto (`POST /species/identify`):** O usuário tira ou escolhe uma foto; o app comprime a imagem e envia ao backend, que atua como proxy autenticado para o **Pl@ntNet**, retornando sugestões de espécies com score de confiança.
   - **Enriquecimento Automático de Cultivo (`GET /species/enrich`):** Ao escolher uma espécie (por texto ou foto), o backend consulta a **Trefle API** e preenche automaticamente:
     - Exposição solar recomendada (`sun_exposure`)
     - Frequência de rega em dias (`watering_frequency_days`)
     - Faixa de temperatura (`TempMinC` / `TempMaxC`)
     - Umidade (`humidity`), Dificuldade de cultivo (`difficulty`), Toxicidade para humanos (`toxicity_humans`) e Toxicidade para animais (`toxicity_animals`).
   - **Resiliência Offline:** Se o usuário estiver offline ou os provedores externos falharem, o cadastro permite nome de espécie livre, marca `Especie.EnriquecimentoPendente = true` e faz retry silencioso ao abrir a tela de detalhes (`PlantaDetailPage.OnAppearing`).
3. **Tela de Detalhes da Planta (`PlantaDetailPage`):**
   - **Overview Grid Condicional:** Exibe cards de Luz (sempre), Temperatura (se configurada), Umidade, Dificuldade e Toxicidade (exibidos dinamicamente apenas quando disponíveis, sem placeholders vazios).
   - **Cards de Cuidado e Histórico Inline:** Cards uniformes para **Rega**, **Adubação** e **Poda** com badge de prazo (*"em N dias"*, *"hoje"*, *"atrasado"*).

---

### 3.5. Rotina de Cuidados e Tarefas Diárias

*Referências:* `GreenKeeper.Frontend/src/GreenKeeper.Domain/Entities/EventoRega.cs`, `GreenKeeper.Frontend/src/GreenKeeper.Domain/Entities/EventoAdubacao.cs`, `GreenKeeper.Frontend/src/GreenKeeper.Domain/Entities/EventoPoda.cs`, `GreenKeeper.Backend/app/Api/routers/events_router.py`

1. **Registro de Eventos de Cuidado (`RegistrarCuidadoSheet`):**
   - **Rega (`EventoRega`):** Data/hora (permite registro retroativo), volume opcional em mL (`VolumeMl`), observação e flag `PuladaPorChuva`. Recalcula automaticamente a data da próxima rega.
   - **Adubação (`EventoAdubacao`):** Data/hora, tipo de adubo, produto utilizado, observação e cálculo independente da próxima adubação.
   - **Poda (`EventoPoda`):** Registro de manutenção/poda com data, observação e histórico por planta.
2. **Central de Tarefas Diárias (`TarefasDiariasPage`):**
   - Consolida regas e adubações pendentes de todas as plantas ativas em três grupos temporais:
     - **Hoje** (inclui tarefas do dia e atrasadas)
     - **Amanhã**
     - **Esta semana**
   - **Ações Rápidas:**
     - **Concluir tarefa:** Checkbox circular que registra o cuidado imediatamente e move o item para a seção colapsável **Concluídos** (sessão local com botão *"Limpar"*).
     - **Adiar (+1 dia):** Posterga a tarefa em 24 horas com um toque.

---

### 3.6. Inteligência Climática e Supressão por Chuva

*Referências:* `GreenKeeper.Frontend/src/GreenKeeper.Domain/Entities/MedicaoClima.cs`, `GreenKeeper.Frontend/src/GreenKeeper.Domain/Entities/AlertaTermico.cs`

1. **Integração Open-Meteo (`ClimaService`):**
   - Consulta diária gratuita e sem API key (`api.open-meteo.com/v1/forecast`), coletando precipitação diária (`precipitation_sum`) e temperatura atual (`temperature_2m`).
   - **Resolução de Localização (`LocationResolver`):** Prioriza o **GPS em tempo real** (`IGeolocationService`); caso negado ou indisponível, faz fallback para as coordenadas do endereço do Perfil (`AppUser.Latitude/Longitude`). Se nenhuma coordenada existir, oculta silenciosamente o badge climático sem interromper o usuário.
2. **Supressão Automática de Rega por Chuva:**
   - Para plantas localizadas em Áreas com `RecebeChuvaDireta = true`, dias com precipitação relevante registram/suprimem a necessidade de rega manual (`EventoRega.PuladaPorChuva`).
3. **Monitoramento de Segurança Térmica (`ThermalAlertHelper`):**
   - Compara a temperatura atual local com os limites `TempMinC` e `TempMaxC` da espécie de cada planta ativa, disparando alertas de frio extremo (❄️) ou calor excessivo (🔥).

---

### 3.7. Sistema de Alertas Persistidos (`AlertasPage`)

*Referências:* `GreenKeeper.Frontend/src/GreenKeeper.Domain/Entities/Alerta.cs`, `GreenKeeper.Backend/app/Api/routers/alerts_router.py`

1. **Geração Automática e Deduplicada (`IAlertaGeneratorService`):**
   - O sistema gera alertas persistidos no banco local e sincronizados entre dispositivos (`ISyncable`), evitando duplicar alertas não lidos do mesmo tipo para a mesma planta:
     - **Urgente:** Rega atrasada (avaliado ao abrir o Dashboard).
     - **Aviso:** Temperatura crítica fora da faixa segura da espécie (avaliado ao abrir o Dashboard).
     - **Info:** Nova planta adicionada ao catálogo.
     - **Sucesso:** Cuidado (rega, adubação ou poda) concluído.
2. **Consumo e Gestão (`AlertasPage`):**
   - Lista agrupada em **Hoje**, **Esta semana** e **Anterior**.
   - Tocar no alerta marca como **lido** (`IsRead = true`, reduzindo a opacidade).
   - Botão `✕` remove alerta individual (gerando `SyncTombstone` para propagar a exclusão aos demais dispositivos) e botão **"Limpar tudo"** remove todos mediante confirmação.

---

### 3.8. Dashboard / Tela Inicial (`DashboardPage`)

1. **Cabeçalho Contextual:** Saudação dinâmica (*Bom dia / Boa tarde / Boa noite* + apelido do usuário) e badge com a temperatura local atual.
2. **Linha de Indicadores (Stats Row):** 4 contadores em tempo real:
   - Plantas ativas
   - Tarefas pendentes
   - Alertas não lidos
   - Regas pendentes
3. **Quick Actions (Grade 2x2):** Atalhos diretos para *Nova planta*, *Ver tarefas*, *Alertas* e *Registrar cuidado*.
4. **Resumos Prioritários:**
   - **Seção Hoje:** Top 3 tarefas mais urgentes do dia.
   - **Seção Alertas Recentes:** Top 2 alertas mais recentes com indicador colorido por severidade.

---

### 3.9. Sincronização Multi-Dispositivo (`SyncService` & `SyncSheet`)

*Referências:* `GreenKeeper.Frontend/src/GreenKeeper.Domain/Entities/SyncHistoryEntry.cs`, `GreenKeeper.Backend/app/Api/routers/sync_router.py`

1. **Protocolo Ciclo Único (`POST /sync`):**
   - **Push:** Envia todas as entidades locais marcadas com `SyncStatus.PendingSync` (`houses`, `areas`, `plants`, `alerts`, `events`) junto com o `base_version`.
   - **Detecção de Conflito (`base_version`):** Se a versão no servidor divergir do `base_version` enviado pelo cliente, o backend sinaliza conflito sem sobrescrever cegamente.
   - **Pull Incremental por Dispositivo (`sync_deliveries`):** O backend rastreia a última versão entregue para cada par `(user_id, device_id, entity_type)`, devolvendo apenas alterações pendentes para aquele aparelho específico.
   - **Propagação de Exclusão (Soft Delete / Tombstones):** Exclusões locais geram registros `SyncTombstone` que propagam o soft delete para todos os dispositivos pareados.
2. **Interface de Sincronização (`SyncSheet`):**
   - Botão **"Sincronizar agora"** com feedback visual de estado (*Idle*, *Sincronizando* com spinner, *Sucesso* e *Erro*).
   - **Histórico Local:** Lista as últimas 20 execuções locais de sincronização (`SyncHistoryEntry`) com data/hora e status.

---

## 4. Requisitos Não-Funcionais e Arquitetura Técnica

- **Clean Architecture Estrita:** Separação em 4 camadas tanto no `.NET MAUI` (`Domain`, `Application`, `Infrastructure`, `App`) quanto no `FastAPI` (`Domain`, `Application`, `Infrastructure`, `Api`).
- **Banco de Dados Cross-Dialect no Backend:** Suporte transparente a **PostgreSQL** (`asyncpg`, padrão em dev/Docker) e **SQL Server / Azure SQL** (`aioodbc` + ODBC Driver 17) sob o schema isolado `greenkeeper.*`.
- **Segurança:**
  - Tokens de confirmação e magic link nunca são salvos em texto puro (apenas hash **SHA-256**).
  - Chaves de APIs externas (`RESEND_API_KEY`, `TREFLE_API_TOKEN`, `PLANTNET_API_KEY`) residem exclusivamente no `.env` do backend.
- **Design System PlantumHibis & UI:**
  - Suporte completo a **Light Mode e Dark Mode** (`AppThemeBinding`) com paleta semântica `Ph*`.
  - Renderização customizada de ícones SVG via **SkiaSharp** (`Controls/SvgIcon.cs`) com tinting dinâmico em runtime para contornar limitações nativas do MAUI no Windows.
  - Navegação inferior própria de 5 abas (`BottomNavBar`) e modais baseados em `BottomSheetView` customizado sem dependências externas.
- **Observabilidade:** Logging estruturado com **Serilog** (rolling diário em arquivo local + console) e captura global de exceções não tratadas.

---

## 5. Backlog e Gaps Conhecidos (Mapeados em `CLAUDE.md`)

1. **Feedback de falha de envio de e-mail no registro:** Distinguir no frontend quando a conta foi criada mas o Resend falhou ao enviar o e-mail (`registered_email_failed`).
2. **Sincronização da foto de perfil e apelido no backend:** Atualmente `PhotoBase64` e `Apelido` são persistidos apenas localmente no `AppUser`.
3. **Origem do dispositivo no histórico de sync:** Incluir nome amigável do dispositivo em `SyncHistoryEntry` para distinguir syncs em cenários multi-device.
4. **Sync automático em background (Opt-in):** Adicionar flag no Perfil para disparar `ISyncService.RunAsync()` automaticamente (com debounce) ao salvar alterações locais.
5. **Notificações push locais e Single-Instance no Windows:** Evitar abertura de segunda janela ao acionar deep link no Windows com o app já aberto e emitir lembretes locais de rega.
