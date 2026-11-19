## ADDED Requirements

### Requirement: Mobile-Only Access Detection
The system SHALL evaluate whether the current client is a mobile phone using a pure domain/application rule backed by browser signals (user-agent/client hints, coarse pointer, and mobile viewport width) before unlocking application routes.

#### Scenario: Standard mobile phone browser accesses the app
- **WHEN** a user opens the app on a smartphone browser or installed mobile PWA
- **THEN** the detector classifies the device as mobile and allows direct navigation to the Dashboard

#### Scenario: Desktop or tablet browser accesses the app
- **WHEN** a visitor opens the app from a desktop computer or tablet viewport without development override
- **THEN** the detector classifies the device as non-mobile and blocks access to the Dashboard and all app routes

### Requirement: Controlled Development and Test Override
The system SHALL support an explicit device-gate override exclusively outside production builds (or via explicit test configuration) so developers and automated test runners can inspect mobile routes without compromising production enforcement.

#### Scenario: Production build ignores dev override query parameters
- **WHEN** `APP_ENV` is `production` and a desktop visitor appends a dev override parameter
- **THEN** the gate MUST remain enforced and display only the informative desktop screen

### Requirement: Informative Screen for Non-Mobile Visitors
The system SHALL render a standalone informative page when the device is not recognized as a mobile phone, explaining what GreenKeeper is and instructing the visitor to open and install the PWA from a smartphone.

#### Scenario: Non-mobile visitor lands on root or deep route
- **WHEN** a desktop or tablet visitor navigates to `/` or any app route
- **THEN** the application displays only the informative screen with no dashboard data, plant cards, or interactive app controls
