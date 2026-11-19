---
name: Botanical Bento
colors:
  surface: '#f9faf8'
  surface-dim: '#d9dad8'
  surface-bright: '#f9faf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f2'
  surface-container: '#edeeec'
  surface-container-high: '#e7e8e6'
  surface-container-highest: '#e2e3e1'
  on-surface: '#191c1b'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#2e3130'
  inverse-on-surface: '#f0f1ef'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#505f59'
  on-tertiary: '#ffffff'
  tertiary-container: '#687872'
  on-tertiary-container: '#f4fff9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#d5e6df'
  tertiary-fixed-dim: '#bacac3'
  on-tertiary-fixed: '#101e1a'
  on-tertiary-fixed-variant: '#3b4a44'
  background: '#f9faf8'
  on-background: '#191c1b'
  surface-variant: '#e2e3e1'
  primary-dark: '#047857'
  primary-surface: '#ecfdf5'
  primary-surface-tint: '#d1fae5'
  surface-white: '#ffffff'
  surface-bg: '#f5f6f4'
  dark-neutral: '#171717'
  text-high: '#171717'
  text-medium: '#737373'
  text-low: '#a3a3a3'
  alert-pending: '#f59e0b'
  border-subtle: rgba(23, 23, 23, 0.08)
  border-strong: rgba(23, 23, 23, 0.30)
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
  display-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  metric-value:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
  metric-value-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 22px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  overline:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1.25rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

# Design System - GreenKeeper

Design System modular, botânico e contemporâneo para o aplicativo **GreenKeeper**, consolidado a partir do Dashboard modular mobile.

---

## 1. Fundamentos Visuais & Brand Personality
- **Atmosfera**: Botânica serena, sofisticada, tátil e moderna ("Soft Bento & Organic Tech").
- **Princípios**:
  - **Foco em Conteúdo & Vida**: Cores de base limpas com contraste forte que destacam a vegetação e a fotografia de plantas.
  - **Interação Tátil**: Cards arredondados com camadas sobrepostas (*stacked cards*), pílulas de status e botões de ação nítidos com bordas definidas.
  - **Minimalismo Funcional**: Redução de ruído visual; menus e controles de navegação translúcidos e flutuantes.

---

## 2. Paleta de Cores (Color Tokens)

### Cores Primárias & Destaque (Emerald Botanical)
- **Primary / Emerald Active**: `#059669` (Tailwind `emerald-600`) — Ações principais, destaques ativos, indicadores de rega e status completado.
- **Primary Dark**: `#047857` (Tailwind `emerald-700`) — Estados de hover/press e cabeçalhos em pílula esmeralda.
- **Primary Light / Surface**: `#ecfdf5` (Tailwind `emerald-50`) / `#d1fae5` (Tailwind `emerald-100`) — Fundos de badges, chips e pílulas de ação suave.

### Superfícies & Neutros (Warm Minimal Monochrome)
- **Background Principal**: `#f5f6f4` / `#f7f9f6` — Fundo suave, neutro e orgânico.
- **Surface / Cards**: `#ffffff` — Branco puro para cartões modulares e superfícies frontais com máxima legibilidade.
- **Dark Neutral (Accent Cards & Headers)**: `#171717` (Tailwind `neutral-900` / `stone-900`) — Abas de ambiente recolhidas (ex: Sala de Estar), cabeçalhos de alto contraste e textos de maior ênfase.
- **Muted Border**: `rgba(23, 23, 23, 0.08)` a `rgba(23, 23, 23, 0.30)` — Bordas nítidas para botões translúcidos e delimitação de cards.

### Texto & Semântica
- **Text High-Emphasis**: `#171717` — Títulos, nomes científicos de plantas e métricas numéricas.
- **Text Medium-Emphasis**: `#737373` (Tailwind `neutral-500`) — Labels, categorias de ambiente ("BANHEIRO", "SALA") e subtítulos.
- **Text Low-Emphasis**: `#a3a3a3` (Tailwind `neutral-400`) — Metadados secundários e unidades de medida.
- **Alert / Pending**: `#f59e0b` (Tailwind `amber-500`) — Indicador sutil de pendência ("REGA PENDENTE").

---

## 3. Tipografia (Typography Scale)

- **Família Tipográfica**: `Plus Jakarta Sans`, sans-serif (com fallback para `Inter`, `system-ui`).
- **Pesos Utilizados**:
  - `Bold` (700): Títulos de seções, contadores principais e nomes das plantas.
  - `SemiBold` (600): Labels de botões, tags de ambientes e métricas.
  - `Medium` (500) & `Regular` (400): Subtítulos, frequências de cuidado e textos corridos.

### Escala de Tamanhos
- **Display / App Header**: `28px` / `32px` line-height (`text-2xl` a `text-3xl`), font-weight 700.
- **Card Title (Nome da Planta)**: `22px` - `24px`, font-weight 700.
- **Overline / Category Tag**: `11px` - `12px`, uppercase, tracking-wider (`tracking-widest`), font-weight 600.
- **Metric Values**: `18px` - `20px`, font-weight 700.
- **Caption / Secondary**: `12px` - `13px`, font-weight 400 ou 500.

---

## 4. Estrutura, Elevações & Formas (Radii & Surfaces)

### Roundness (Border Radius)
- **Extra Large Cards**: `28px` a `32px` (`rounded-3xl` / `rounded-[2rem]`) para cartões de plantas e blocos modulares.
- **Pills / Floating Controls**: `9999px` (`rounded-full`) para badges, seletor de cômodos sobrepostos e o botão central de câmera.
- **Chips & Metric Boxes**: `16px` (`rounded-2xl`) para blocos de inspeção e métricas de água/luz.

### Profundidade & Glassmorphism
- **Floating Camera Nav**:
  - Background: `rgba(255, 255, 255, 0.85)` com `backdrop-blur-md`.
  - Border: `2px solid rgba(23, 23, 23, 0.30)`.
  - Shadow: Suave e tátil (`shadow-md`).
- **Card Layering**:
  - Efeito em cascata / abas empilhadas (*stacked room cards*) com contraste alternado entre verde esmeralda, preto e branco puro.

---

## 5. Componentes Principais

1. **Top App Bar**:
   - Ícone de folha minimalista em pílula branca.
   - Saudação / Título "Minhas Plantas" com contador dinâmico de tarefas do dia.
2. **Room Selector (Stacked Accordion Tabs)**:
   - Abas sobrepostas representando cômodos ("Corredor", "Sala de Estar", "Banheiro") com cantos arredondados orgânicos.
3. **Plant Focus Card (Modular Bento Card)**:
   - Header com categoria e nome da planta.
   - Grid de métricas de telemetria (Água %, Luz %, Umidade %).
   - Pílula de status dinâmico (Rega pendente, Inspeção periódica).
   - Área visual orgânica para a imagem da espécie.
4. **Floating Action Trigger**:
   - Botão circular de câmera centralizado, translúcido com borda definida para escaneamento e identificação instantânea.
