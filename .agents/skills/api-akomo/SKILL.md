---
name: api-akomo-docs
description: provides detailed technical documentation and interaction guidelines for the akomo backend api (api.akomo.xyz).
---
# AKomo API Documentation Skill

## When to use this skill
- when a user or another agent needs to interact with the AKomo backend API.
- when exploring the available endpoints for exchange rates and mobile app builds.
- when planning a new application that consumes data from `api.akomo.xyz`.
- when debugging issues related to fetching BCV, Binance rates, or app builds from the AKomo server.

## Overview
The AKomo API serves as the centralized backend for the AKomo mobile application (market tracking / currency exchange). The root domain is `https://api.akomo.xyz/api`. It mainly handles:
1. **Exchange Rates**: Syncing and providing latest currency rates (USD, EUR, USDT) from sources like BCV and Binance P2P.
2. **Builds**: Managing the download URLs and versions of the mobile application across platforms.

Interactive documentation is available via Swagger at: `https://api.akomo.xyz/api/docs`

## Necessary Inputs
None. This skill provides documentation. If making requests, the HTTP client must respect the base URL and standard headers (e.g., `Content-Type: application/json` for POST requests). Standard REST conventions apply. Authentication/Authorization currently relies on environment secrets for protected operations (e.g., Supabase service role), but public `GET` endpoints are open.

## Workflow
1. **Identify the Data Required**: Determine if you need current rates, historical data, manual rates update, a specific Binance average, or mobile build information.
2. **Choose the Corresponding Endpoint**: Reference the "Endpoints" section or the Swagger UI to find the exact path and method.
3. **Construct the Request**: Include the proper Query Parameters or JSON Body as defined.
4. **Parse the Response**: Ensure your application can parse the specific output formats provided by the API.

## Endpoints

### 1. Exchange Rates
Provides data on currency exchange rates.

#### `GET /api/exchange-rates`
Returns the most recently recorded exchange rates for tracked currencies (USD, EUR, USDT).
- **Output (JSON):**
  ```json
  {
    "rates": [
      {
        "id": "uuid",
        "label": "Dólar BCV",
        "value": "36,25", 
        "currency": "VES"
      }
    ],
    "lastUpdate": "2026-02-26T23:42:50.000Z"
  }
  ```
  *(Note: The `value` is returned as a comma-separated string `36,25` for UI rendering).*

#### `GET /api/exchange-rates/history`
Returns historical exchange rates for the last N days.
- **Query Parameters:**
  - `days` (optional, default: `7`): Number of days of history to fetch.
- **Output (JSON):** Returns an array of objects containing symbol, current price, percentage change, and history points.

#### `POST /api/exchange-rates/bcv`
Manually updates the historical BCV record for USD and EUR.
- **Body:**
  ```json
  {
    "usd": 36.25,
    "eur": 39.10
  }
  ```
- **Output (JSON):**
  ```json
  {
    "message": "BCV rates saved successfully (historical entry)"
  }
  ```

#### `GET /api/exchange-rates/binance/average`
Calculates and returns the average Binance P2P price for a specific asset/fiat pair.
- **Query Parameters:**
  - `asset` (optional, default: `USDT`)
  - `fiat` (optional, default: `VES`)
  - `tradeType` (optional, default: `SELL`)
  - `update` (optional, default: `false`) - If set to `true`, and it's USDT/VES, it will upsert the rate into the database as the latest Binance rate.
- **Output (JSON):**
  ```json
  {
    "average": "39.50"
  }
  ```

*(Note: Standard CRUD routes like `POST /`, `GET /:id`, `PATCH /:id`, and `DELETE /:id` exist but are mostly for internal use or administrative manual updates).*

### 2. Builds
Manages the mobile application build references (links to APKs/IPAs).

#### `GET /api/builds`
Returns a list of available app builds.
- **Output (JSON):**
  ```json
  [
    {
      "url": "https://example.com/build.apk",
      "version": "1.0.0",
      "platform": "android"
    }
  ]
  ```

#### `POST /api/builds`
Registers a newly compiled mobile application build.
- **Body:**
  ```json
  {
    "version": "1.0.1",
    "url": "https://example.com/new-build.apk",
    "platform": "ios"
  }
  ```

## Error Handling
If requests fail, standard NestJS HTTP exceptions will be returned in this generic format:
```json
{
  "statusCode": 400,
  "message": ["The USD rate must be a number"],
  "error": "Bad Request"
}
```
Validation errors for POST bodies return an array of user-friendly validation messages under the `message` property.

## Output Structure when Queried
When another agent queries this skill to understand the API, you must serve these exact endpoint definitions, keeping the expected inputs (Query/Body) and outputs (Responses) explicitly clear. Also point them to the Swagger UI for real-time exploratory testing.
