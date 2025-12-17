# Coffee Cart: Playwright Learning Lab

Цей репозиторій буде використаний для створення навчального тестового середовища з метою вивчення написання автоматизованих end-to-end тестів за допомогою Playwright для сайту https://coffee-cart.app/.

## Мета
- Побудувати базову інфраструктуру для E2E-тестів.
- Практикувати написання тестів для основних сценаріїв (перегляд меню, додавання в кошик, оформлення замовлення тощо).
- Налаштувати зручні команди запуску, репорти та налагодження тестів.

## Технології
- Playwright Test (@playwright/test)
- TypeScript або JavaScript (на вибір групи)
- HTML-демо застосунок: https://coffee-cart.app/

## Попередні вимоги
- Встановлений Node.js LTS (рекомендовано останню LTS-версію)
- Git

Перевірка версій:
```bash
node -v
npm -v
git --version
```

## Початок роботи (локально)
1) Клонувати репозиторій:
```bash
git clone https://github.com/ua5235/coffee.cart.5235.git
cd coffee.cart.5235
```

2) Ініціалізувати проєкт і встановити Playwright Test:
```bash
npm init -y
npm i -D @playwright/test
npx playwright install
```

3) Додати базову структуру тестів (рекомендовано):
- створити папку `tests` для E2E-тестів
- опційно: `pages` (Page Object Model), `fixtures` (фікстури), `utils` (утиліти)

4) Приклад першого тесту (JavaScript) у файлі `tests/smoke.spec.js`:
```js
// tests/smoke.spec.js
const { test, expect } = require('@playwright/test');

test('Home page opens', async ({ page }) => {
	await page.goto('https://coffee-cart.app/');
	await expect(page).toHaveTitle(/Coffee/);
});
```

5) Запуск тестів:
```bash
npx playwright test           # звичайний прогін
npx playwright test --ui      # UI-режим Playwright
npx playwright test --headed  # у видимому браузері
npx playwright show-report    # перегляд HTML-звіту
```

## Структура (рекомендація)
- `tests/` — E2E-тести
- `pages/` — Page Object-и (наприклад, `MenuPage`, `CartPage`)
- `fixtures/` — загальні сетапи/хелпери для тестів
- `playwright.config.(ts|js)` — конфігурація Playwright (бразуери, ретраї, репорти)

## Наступні кроки
- Додати `playwright.config.ts` з базовими налаштуваннями (timeout, retries, reporter).
- Реалізувати POM для ключових сторінок: меню, кошик, checkout.
- Написати перші сценарії: додавання напою до кошика, зміна кількості, оформлення замовлення.
- Налаштувати збір артефактів: скріншоти/відео при падіннях.

## Корисні посилання
- Playwright Docs: https://playwright.dev/
- Getting Started: https://playwright.dev/docs/intro
- Test Runner: https://playwright.dev/docs/test-intro

---
Навчальні приклади будуть додаватися по мірі прогресу курсу UA-5235.
