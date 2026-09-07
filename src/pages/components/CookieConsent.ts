import { Page, Locator } from '@playwright/test';

/**
 * Cookie-consent handling.
 *
 * The site shows a cookie modal whose implementation differs by route and whose
 * appearance is delayed a few seconds after navigation:
 *   - Marketing / home pages:      Bootstrap     `#acceptCookiesModal`
 *   - Angular app routes (login):  ng-bootstrap  `ngb-modal-window.cookie-modal`
 *
 * Both use a static backdrop that intercepts pointer events until dismissed, so
 * every flow must dismiss it before interacting. Each modal renders two copies of
 * the accept/reject button (desktop + mobile); whichever is visible is clicked.
 */
export class CookieConsent {
  private readonly page: Page;
  readonly modal: Locator;
  readonly shown: Locator;
  readonly acceptButton: Locator;
  readonly rejectButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('#acceptCookiesModal, ngb-modal-window.cookie-modal');
    this.shown = page.locator('#acceptCookiesModal.show, ngb-modal-window.cookie-modal.show');
    // "Accept all cookies" on the marketing pages, "Accept cookies" in the app.
    this.acceptButton = page.getByRole('button', {
      name: /قبول (كل )?ملفات تعريف الارتباط|Accept (all )?cookies/i,
    });
    this.rejectButton = page.getByRole('button', {
      name: /رفض ملفات تعريف الارتباط|Reject cookies/i,
    });
  }

  async accept(): Promise<void> {
    await this.dismiss(this.acceptButton);
  }

  async reject(): Promise<void> {
    await this.dismiss(this.rejectButton);
  }

  async isVisible(): Promise<boolean> {
    return this.shown.first().isVisible().catch(() => false);
  }

  private async dismiss(buttons: Locator): Promise<void> {
    const appeared = await this.shown
      .first()
      .waitFor({ state: 'visible', timeout: 8000 })
      .then(() => true)
      .catch(() => false);
    if (!appeared) return;

    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        break;
      }
    }
    await this.shown.first().waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
  }
}
