import { Page, Locator, expect } from '@playwright/test';
import { BasePage, APP_READY_TIMEOUT } from './BasePage';
import { CookieConsent } from './components/CookieConsent';

export class LoginPage extends BasePage {
  protected readonly path = '/app/authentication/login';
  readonly cookies: CookieConsent;
  readonly usernameInput: Locator;
  readonly continueButton: Locator;
  readonly nafathButton: Locator;
  readonly termsText: Locator; 
  readonly botChallenge: Locator;
  readonly modalWindow: Locator;
  readonly nafathModal: Locator;
  readonly nafathModalIdInput: Locator;
  readonly nafathModalContinue: Locator;
  readonly nafathPushHeading: Locator;
  readonly nafathChallengeNumber: Locator;
  readonly customerInfoHeading: Locator;
  readonly customerContactDetailsHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.cookies = new CookieConsent(page);

    this.usernameInput = page.locator('#username');
    this.continueButton = page
      .locator('button')
      .filter({ hasText: /^\s*(المتابعة|Continue)\s*$/ })
      .first();
    this.nafathButton = page
      .locator('button')
      .filter({ hasText: /المتابعة مع نفاذ|Continue with Nafath/i })
      .first();
    this.termsText = page.getByText(/I accept Sakani|أوافق على/i);

    this.botChallenge = page.locator(
      'input[id^="cf-chl"], iframe[src*="challenges.cloudflare.com"], iframe[src*="/recaptcha/bframe"]',
    );

    this.modalWindow = page.locator('ngb-modal-window');
    this.nafathModal = this.modalWindow.filter({
      hasText: /Login with nafath|تسجيل الدخول عبر نفاذ/i,
    });
    this.nafathModalIdInput = this.nafathModal.locator('input[type="tel"], input').last();
    this.nafathModalContinue = this.nafathModal
      .locator('button')
      .filter({ hasText: /^\s*(Continue|المتابعة)\s*$/ })
      .first();

    this.nafathPushHeading = page.getByRole('heading', { name: /Open nafath App|افتح تطبيق نفاذ/i });
    this.nafathChallengeNumber = page.locator('ngb-modal-window .nafath-number, ngb-modal-window h1');

    this.customerInfoHeading = page.getByRole('heading', { name: /تأكيد معلوماتك|Confirm your information/i });
    this.customerContactDetailsHeading = page.getByRole('heading', { name: /أضف تفاصيلك|Add your details/i });
  }

  async open(): Promise<void> {
    await this.gotoUntilReady(this.usernameInput);
    await this.cookies.accept();
  }

  async expectFormRendered(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.continueButton).toBeVisible();
    await expect(this.nafathButton).toBeVisible();
  }

  async enterIdentifier(identifier: string): Promise<void> {
    await this.usernameInput.fill(identifier);
  }
  async submitIdentifier(): Promise<void> {
    await expect(this.continueButton).toBeEnabled();
    await this.usernameInput.press('Enter');
  }

  async continueWithId(identifier: string): Promise<void> {
    await this.enterIdentifier(identifier);
    await this.submitIdentifier();
  }

  async isBotChallengeVisible(timeout = 8000): Promise<boolean> {
    return this.botChallenge
      .first()
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);
  }

  async confirmNafathModal(): Promise<string> {
    await expect(this.nafathModal).toBeVisible({ timeout: 60_000 });
    await expect(this.nafathModalContinue).toBeEnabled();
    await this.nafathModalContinue.click();

    await expect(this.nafathPushHeading).toBeVisible({ timeout: 60_000 });
    const text = await this.modalWindow.first().innerText();
    return (text.match(/\b(\d{1,3})\b/) ?? ['', ''])[1];
  }

  async waitForAuthenticated(timeout = 180_000): Promise<void> {
    await this.page.waitForURL((url) => !url.toString().includes('/authentication/login'), {
      waitUntil: 'commit',
      timeout,
    });
  }

  async login(identifier: string): Promise<void> {
    await this.open();
    await this.continueWithId(identifier);
    await this.confirmNafathModal();
    await this.waitForAuthenticated();
  }

  async confirmCustomerInformationIfShown(timeout = 10_000): Promise<void> {
    const shown = await this.customerInfoHeading
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);
    if (!shown) return;
    await this.continueButton.click();
  }
}
