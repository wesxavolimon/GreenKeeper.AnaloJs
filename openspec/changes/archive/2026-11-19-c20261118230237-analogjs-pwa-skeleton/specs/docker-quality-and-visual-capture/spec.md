## ADDED Requirements

### Requirement: Fully Containerized Local Workflow via Docker Compose
The system SHALL provide a `Dockerfile` and `docker-compose.yml` capable of installing dependencies, running the AnalogJS dev server, executing unit tests with coverage, building the production bundle, and capturing Playwright screenshots without requiring Node.js or browsers on the host.

#### Scenario: Running unit tests inside Docker
- **WHEN** the operator executes the Docker Compose test service
- **THEN** all Vitest unit tests run inside the container and report coverage

### Requirement: 100% Unit Test Coverage Enforcement
The system SHALL enforce 100% unit test coverage (statements, branches, functions, and lines) across all `domain`, `application`, `infrastructure`, `composition`, and UI component/guard logic covered by the Vitest coverage configuration.

#### Scenario: Coverage check fails below 100%
- **WHEN** any line, branch, function, or statement in the measured source tree is uncovered by Vitest
- **THEN** the test command MUST exit with a non-zero status code

### Requirement: Automated Screen Capture via Playwright
The system SHALL include an automated Playwright screenshot script running in Docker that captures PNG images of both the mobile Dashboard (`390x844`) and the desktop Informative Screen (`1280x800`) into a documented output folder.

#### Scenario: Generating mobile and desktop screenshots
- **WHEN** the Playwright screenshot command runs against the built or served app in Docker
- **THEN** PNG screenshots for both mobile Dashboard and desktop Informative Screen are saved and non-empty
