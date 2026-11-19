## ADDED Requirements

### Requirement: Project README and AGENTS Documentation
The repository SHALL include its own `README.md` and `AGENTS.md` in `GreenKeeper.AnaloJs/`, documenting setup, Docker commands, Netlify deployment configuration, Clean Architecture boundaries, automated screenshot capture, the curated list of relevant skills from `C:\Users\User\.skills-manager\skills`, and the deferred roadmap for upcoming proposes (PostgreSQL/Supabase database, Auth0 + Google login, family email invite + mobile notifications).

#### Scenario: Developer or AI agent inspects repository root docs
- **WHEN** reading `GreenKeeper.AnaloJs/README.md` and `GreenKeeper.AnaloJs/AGENTS.md`
- **THEN** both files accurately describe the current skeleton scope, list the mapped skills from `C:\Users\User\.skills-manager\skills`, and record the 3 deferred upcoming proposes

### Requirement: RTK and Graphify Initialization with Mandatory Pre-Stage Update Rule
The repository SHALL initialize `rtk init --agent antigravity` and `graphify .` (with `.graphifyignore`), and `AGENTS.md` SHALL enforce as a mandatory rule that `graphify update .` MUST be run before every `git add`.

#### Scenario: Graphify and RTK initialized in repository
- **WHEN** inspecting `GreenKeeper.AnaloJs/` after setup
- **THEN** `.graphifyignore`, `graphify-out/`, and RTK agent configuration are present and `AGENTS.md` explicitly mandates `graphify update .` before every `git add`
