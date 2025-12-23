# Coffee Cart: Playwright Learning Lab

A small Playwright Test project for learning end-to-end testing against the demo storefront at https://coffee-cart.app/ — includes Page Objects, fixtures, example tests, and recommended scripts to run tests locally and in CI.

## Quick start

1) Clone the repository and install dependencies:

```bash
git clone https://github.com/UA-5235-TAQC/coffee.cart.5235.git
cd coffee.cart.5235
npm ci
```

2) Install Playwright browsers (required for running tests):

```bash
npx playwright install
```

3) Recommended npm scripts (already present or add to `package.json`):

```json
{
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:debug": "npx playwright test --debug",
    "test:report": "npx playwright show-report"
  }
}
```

4) Run tests:

```bash
npm test               # run Playwright Test
npm run test:headed    # run in headed (visible) browsers
npm run test:report    # open the HTML report after a run
```

## Project structure

- `tests/` — end-to-end test files (Playwright Test)
- `page/` — Page Object Model classes (e.g., `MenuPage`, `CartPage`)
- `fixtures/` — custom fixtures and test setup helpers
- `utils/` — small utility helpers used across tests
- `playwright.config.ts` — Playwright Test configuration (browsers, retries, reporters)

## Next steps

- Verify `playwright.config.ts` has sensible defaults (timeout, retries, reporter).
- Implement Page Objects for menu, cart and checkout flows.
- Add tests for adding an item to cart, changing quantities, and completing checkout.
- Configure CI (GitHub Actions) to run `npm test` and upload Playwright reports/artifacts.

## Assumptions

- `package.json` exists in the repository root and is used to manage scripts and devDependencies.
- Playwright (`@playwright/test`) is installed as a devDependency and browser binaries are installed with `npx playwright install`.

## Environment variables (.env)

This project supports a repository-root `.env` file loaded by `config/env.ts` using `dotenv`. The config file resolves the path as `path.resolve(__dirname, '..', '.env')`, so place the `.env` file in the repository root (one level above the `config/` folder).

Common variables used by the project (and their defaults):

- `BASE_CLIENT_URL` — base URL of the site under test. Default: `https://coffee-cart.app/`.
- `HEADLESS` — whether to run browsers headlessly. Values: `true` or `false` (string). Default: `false`.
- `CI` — numeric flag (0 or 1) indicating CI environment. Default: `1` in the config if not set.
- `RETRY_FAILED_TESTS` — integer number of retries for failed tests. Default: `0`.

Example `.env` file (create at repository root):

```env
# .env (repo root)
BASE_CLIENT_URL=https://coffee-cart.app/
HEADLESS=true
CI=0
RETRY_FAILED_TESTS=1
```

Notes and usage examples:

- `dotenv` is already referenced in `config/env.ts` and the project lists `dotenv` in `devDependencies`.
- To run tests with a one-off environment variable (PowerShell):

```powershell
$env:HEADLESS = 'true'; npm test
```

- Or on Unix/macOS shells:

```bash
HEADLESS=true npm test
```

- If you create a `.env` file at the repo root, values will be picked up automatically by `config/env.ts`.
