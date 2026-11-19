## ADDED Requirements

### Requirement: 100% Frontend AnalogJS Architecture Without Custom Backend
The system SHALL be structured as a 100% frontend AnalogJS (Angular + Vite) application with TypeScript strict mode enabled and zero custom backend endpoints, server APIs, or Nitro server routes.

#### Scenario: Static SPA production build without server runtime
- **WHEN** the production build executes for Netlify deployment
- **THEN** the build outputs static client assets without requiring a Node.js backend server

### Requirement: Pragmatic Frontend Clean Architecture Layering
The system SHALL organize TypeScript source code into pragmatic Clean Architecture layers (`src/domain`, `src/application`, `src/infrastructure`, `src/app`, `src/composition`) with enforced dependency boundaries.

#### Scenario: Domain layer isolation
- **WHEN** architecture boundary checks analyze files in `src/domain`
- **THEN** zero imports from `@angular/*`, `@analogjs/*`, `src/application`, `src/infrastructure`, or `src/app` exist

#### Scenario: Application layer dependency direction
- **WHEN** architecture boundary checks analyze files in `src/application`
- **THEN** files only depend on `src/domain` and typed ports/interfaces, with zero direct imports from `src/infrastructure` or `src/app`

#### Scenario: Composition root dependency wiring
- **WHEN** the Angular/AnalogJS application bootstraps
- **THEN** concrete infrastructure adapters are bound to application ports exclusively inside `src/composition`

### Requirement: Local and Production Environment Configuration
The system SHALL provide typed configuration loading supporting local development (`.env` / `.env.example`) and Netlify production build environment variables (`VITE_*`) via `netlify.toml`, without embedding secret keys in client bundles.

#### Scenario: Reading public environment configuration
- **WHEN** the environment configuration adapter reads `VITE_APP_ENV` and future integration placeholders
- **THEN** it returns a validated typed configuration object with safe defaults for local development

#### Scenario: Netlify build configuration present
- **WHEN** inspecting the repository root
- **THEN** `netlify.toml` defines the static build command, publish directory, and SPA fallback redirect rule
