## ADDED Requirements

### Requirement: Installable Web App Manifest
The system SHALL expose a valid Web App Manifest (`manifest.webmanifest`) configured with GreenKeeper metadata, standalone display mode, theme colors aligned with the botanical palette (`#F4F6F2` / `#1A1E1D`), and app icons.

#### Scenario: Browser evaluates PWA installability metadata
- **WHEN** the built application is served over HTTP/HTTPS
- **THEN** `<link rel="manifest">` resolves a valid manifest containing `name`, `short_name`, `display: "standalone"`, `start_url`, and required PNG icons

### Requirement: Service Worker Registration for PWA Shell
The system SHALL register a Service Worker in production builds to precache static shell assets and allow launching the installed PWA cleanly on mobile devices.

#### Scenario: Production build emits service worker assets
- **WHEN** the production PWA build completes
- **THEN** the output directory contains the generated service worker script and precache manifest registered by the client entrypoint
