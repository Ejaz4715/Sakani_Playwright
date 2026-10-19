import { expect, Locator, Page } from '@playwright/test';
type Element =
  | { readonly xpath: string }
  | {
      readonly role: Parameters<Page['getByRole']>[0];
      readonly name: string;
      readonly exact?: boolean;
    }
  | {
      readonly text: string;
      readonly exact?: boolean;
    };
export class CommonMethods {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  private getElement(elementObject: Element): Locator {
    return 'xpath' in elementObject
      ? this.page.locator(elementObject.xpath)
      : 'role' in elementObject
        ? this.page.getByRole(elementObject.role, {
            name: elementObject.name,
            exact: elementObject.exact,
          })
        : this.page.getByText(elementObject.text, {
            exact: elementObject.exact,
          });
  }
  /**
   * Clicks on a locator if it is visible.
   * @param elementObject The page object describing the element to click.
   * @param options Timeout options.
   */
  async clickIfVisible(elementObject: Element, options: { timeout?: number } = {}) {
    const element = this.getElement(elementObject);
    try {
      await element.waitFor({ state: 'visible', timeout: options.timeout ?? 5000 });
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        return;
      }
      throw error;
    }

    await element.click(options);
  }

  async clickElement(elementObject: Element) {
    const element = this.getElement(elementObject);

    await element.waitFor({ state: 'visible' });
    await element.click();
  }

  async hoverElement(elementObject: Element) {
    const element = this.getElement(elementObject);

    await element.waitFor({ state: 'visible' });
    await element.hover();
  }

  async verifyElementVisible(elementObject: Element) {
    const element = this.getElement(elementObject);

    await expect(element).toBeVisible();
  }

  async verifyEitherElementVisible(firstElement: Element, secondElement: Element) {
    const first = this.getElement(firstElement);
    const second = this.getElement(secondElement);

    await expect.poll(async () => (await first.isVisible()) || (await second.isVisible())).toBe(true);
  }

  async fill(inputField: Element, value: string) {
    const input = this.getElement(inputField);
    await expect(input).toBeVisible();
    await input.fill(value);
  }

  async press(inputField: Element, key: Parameters<Locator['press']>[0]) {
    const input = this.getElement(inputField);
    await expect(input).toBeVisible();
    await input.press(key);
  }

  async uploadFile(inputField: Element, file: Parameters<Locator['setInputFiles']>[0]) {
    const input = this.getElement(inputField);
    await input.setInputFiles(file);
  }
}