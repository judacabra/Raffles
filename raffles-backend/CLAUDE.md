# CLAUDE.md

## Project

**raffles-backend** — a http-api project.

## Package Manager

Always use **pnpm**. Never use npm or yarn.

## Imports

Use the `@/*` alias for all internal imports — it maps to `src/*`.

## Active Recipes

- **Helmet** — HTTP security headers
- **CORS** — Cross-Origin Resource Sharing configuration
- **Graceful Shutdown** — Clean shutdown handling for connections and in-flight requests
- **Correlation ID** — Request correlation ID propagation via AsyncLocalStorage
- **Request Logging** — HTTP request/response logging middleware
- **Swagger / OpenAPI** — Auto-generated OpenAPI documentation with Swagger UI
- **Pino Logger** — Structured JSON logging with Pino
- **Health Checks** — Health check endpoints with Terminus
- **Rate Limiting** — Request rate limiting with Throttler

<!-- @spoonfeed:helmet -->
## Helmet
Helmet sets security headers (CSP, X-Frame-Options, etc.) automatically.
Customize header policies in the Helmet registration options.
<!-- @spoonfeed:end:helmet -->

<!-- @spoonfeed:cors -->
## CORS
CORS is configured in main.ts. Allowed origins are set via CORS_ORIGIN env var.
Use comma-separated values for multiple origins. Never use `*` in production.
<!-- @spoonfeed:end:cors -->

<!-- @spoonfeed:graceful-shutdown -->
## Graceful Shutdown
SIGTERM/SIGINT trigger graceful shutdown. In-flight requests complete before exit.
Database connections, queues, and caches are closed cleanly. Timeout is SHUTDOWN_TIMEOUT_MS.
<!-- @spoonfeed:end:graceful-shutdown -->

<!-- @spoonfeed:correlation-id -->
## Correlation ID
Every request gets a correlation ID (from x-correlation-id header or auto-generated UUID).
Access via getCorrelationId() from anywhere in the async call chain. Propagate to downstream HTTP calls and log entries.
<!-- @spoonfeed:end:correlation-id -->

<!-- @spoonfeed:request-logging -->
## Request Logging
All HTTP requests are logged with method, URL, status, and duration.
Enable body logging with REQUEST_LOG_BODY=true (disable in production for PII safety).
<!-- @spoonfeed:end:request-logging -->

<!-- @spoonfeed:swagger -->
## Swagger / OpenAPI
Swagger UI is available at `/{SWAGGER_PATH}`. Use @ApiTags(), @ApiOperation(), and @ApiResponse() on controllers.
DTOs are auto-documented via the Swagger plugin — ensure DTOs use class-validator decorators.
<!-- @spoonfeed:end:swagger -->

<!-- @spoonfeed:pino -->
## Pino Logger
Use `PinoLogger` (injected) for structured logging. Logs are JSON in production, pretty-printed in dev.
Set log level via LOG_LEVEL env var. Use `logger.assign()` to add context fields.
<!-- @spoonfeed:end:pino -->

<!-- @spoonfeed:health-checks -->
## Health Checks
GET `/health` returns service health. Add custom indicators by implementing HealthIndicator.
Includes disk, memory, and database checks out of the box.
<!-- @spoonfeed:end:health-checks -->

<!-- @spoonfeed:throttler -->
## Rate Limiting
Global rate limiting is applied via ThrottlerGuard. Override per-route with @Throttle().
Skip rate limiting on specific routes with @SkipThrottle().
<!-- @spoonfeed:end:throttler -->
