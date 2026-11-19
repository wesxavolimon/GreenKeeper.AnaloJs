## ADDED Requirements

### Requirement: Direct Entry to Dashboard Without Login
The system SHALL navigate mobile users directly to the Dashboard upon launch with no login or authentication screen in this skeleton release.

#### Scenario: Mobile user opens the root URL
- **WHEN** a recognized mobile device opens `/`
- **THEN** the Dashboard renders immediately as the primary view

### Requirement: Botanical Dashboard Visual Structure Adapted to Real Mobile Viewport
The system SHALL implement the *GreenKeeper — Cuidados Botânicos* visual layout (font `Plus Jakarta Sans`, palette `#F4F6F2` / `#1A1E1D` / `emerald-600` / `#B5FF38`, stacked room cards, active *Calathea* card with metrics `Água` and `Luz`, *Planta em Foco* card, dark *Umidade do Ambiente Ideal* widget, and floating bottom camera dock) adapted to fill the real mobile viewport (`100dvh`) without decorative phone bezels or simulated iOS status bars.

#### Scenario: Mobile viewport displays full botanical dashboard without simulated bezel
- **WHEN** the Dashboard renders on a 390x844 mobile viewport
- **THEN** it displays the GreenKeeper leaf header, "Minhas Plantas", task counter, stacked rooms (`Corredor`, `Sala de Estar`, `Banheiro / Calathea`), `Planta em Foco` (`Aloe Arborescens`), `Umidade do Ambiente Ideal`, and floating camera dock without `09:41` fake status bar or outer desktop frame

### Requirement: In-Memory Repository Adapter and Local Dashboard Interactions
The system SHALL load initial dashboard data through an `application` port backed by an in-memory `infrastructure` repository (without database configuration in this skeleton) and support local interactive state updates.

#### Scenario: User completes pending watering task on active plant card
- **WHEN** the user taps "Concluir" on the active plant card
- **THEN** the pending task badge updates locally and the header task counter decreases accordingly

#### Scenario: User adjusts humidifier target level
- **WHEN** the user taps the `+` or `-` control in the climate widget
- **THEN** the displayed humidity percentage updates within valid domain bounds (`0%` to `100%`)

#### Scenario: User selects a stacked room card
- **WHEN** the user taps another room pill in the stacked rooms section
- **THEN** the selected room becomes active via the dashboard use case
