import { test as base, Page } from '@playwright/test';
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/UserLoginPage';
import { MarketplacePage } from '@pages/MarketplacePage';
import { MyBookingsPage } from '@pages/MyBookingsPage';
import { RegisterInterestPage } from '@pages/RegisterInterestPage';
import { MortgageCalculatorPage } from '@pages/MortgageCalculatorPage';
import { Header } from '@components/Header';
import { TEST_USER } from '@data/testData';

type Fixtures = {
  homePage: HomePage;
  loginPage: LoginPageType;
  marketplacePage: MarketplacePage;
  myBookingsPage: MyBookingsPage; 
  registerInterestPage: RegisterInterestPage;
  mortgageCalculatorPage: MortgageCalculatorPage;
  header: Header;
  authenticatedPage: Page;
};

async function preAcceptCookies(page: Page): Promise<void> {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem('accept_cookies', 'true');
    } catch {
    }
  });
}

async function installCookieAutoDismiss(page: Page): Promise<void> {
  const shown = page
    .locator('#acceptCookiesModal.show, ngb-modal-window.cookie-modal.show')
    .first();
  await page.addLocatorHandler(
    shown,
    async () => {
      const accept = page.getByRole('button', {
        name: /قبول (كل )?ملفات تعريف الارتباط|Accept (all )?cookies/i,
      });
      const count = await accept.count();
      for (let i = 0; i < count; i++) {
        const btn = accept.nth(i);
        if (await btn.isVisible().catch(() => false)) {
          await btn.click({ timeout: 5000 }).catch(() => {});
          break;
        }
      }
    },
    { noWaitAfter: true },
  );
}

async function installPrivacyPolicyAutoDismiss(page: Page): Promise<void> {
  const accept = page.getByRole('button', { name: /موافقة واستمرار|Agree and continue/i });
  await page.addLocatorHandler(accept, async () => {
    await accept.first().click().catch(() => {});
  });
}

async function installCoachMarkAutoDismiss(page: Page): Promise<void> {
  const coachMark = page
    .locator('ngb-tooltip-window, [class*="coach"], [class*="onboarding"]')
    .filter({ hasText: /Find more Sakani products|منتجات سكني/i })
    .first();

  await page.addLocatorHandler(
    coachMark,
    async () => {
      await coachMark
        .locator('button, [class*="close"], svg')
        .first()
        .click({ timeout: 3000 })
        .catch(() => {});
    },
    { noWaitAfter: true },
  );
}

export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await preAcceptCookies(page);
    await installCookieAutoDismiss(page);
    await installPrivacyPolicyAutoDismiss(page);
    await installCoachMarkAutoDismiss(page);
    await use(page);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  marketplacePage: async ({ page }, use) => {
    await use(new MarketplacePage(page));
  },
  myBookingsPage: async ({ page }, use) => {
    await use(new MyBookingsPage(page));
  },
  registerInterestPage: async ({ page }, use) => {
    await use(new RegisterInterestPage(page));
  },
  mortgageCalculatorPage: async ({ page }, use) => {
    await use(new MortgageCalculatorPage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },

  authenticatedPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.login(TEST_USER.nationalId);
    await new Header(page).expectAuthenticated(/ALSHAIKHA|اليامي/);
    await use(page);
  },
});

export { expect } from '@playwright/test';
