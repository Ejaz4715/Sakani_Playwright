import {expect, Page} from "@playwright/test";
import {FavoritesObjects} from "@objects/FavoritesObjects";

const DEFAULT_TIMEOUT = 30_000;
const LONG_TIMEOUT = 90_000;

export class FavoritesPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private get favoriteButton() {
        return this.page.locator(FavoritesObjects.favoriteButton).filter({visible: true}).first();
    }

    async openOffPlanProject(userPortalUrl: string, projectId: number) {
        await this.page.goto(`${userPortalUrl}${FavoritesObjects.offPlanProjectPath(projectId)}`);
        await this.favoriteButton.waitFor({state: "visible", timeout: LONG_TIMEOUT});
    }

    async getProjectTitle(): Promise<string> {
        const title = this.page.getByRole("heading").first();
        await title.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return (await title.innerText()).trim();
    }

    async isProjectFavorite(): Promise<boolean> {
        await this.favoriteButton.locator(`${FavoritesObjects.notFavoriteIcon}, ${FavoritesObjects.favoriteIcon}`)
            .waitFor({state: "attached", timeout: DEFAULT_TIMEOUT});
        return await this.favoriteButton.locator(FavoritesObjects.favoriteIcon).count() > 0;
    }

    // If the project is still a favorite from an earlier run, remove it first so the add is really exercised
    async markProjectAsFavorite() {
        if (await this.isProjectFavorite()) {
            await this.favoriteButton.click();
            await this.favoriteButton.locator(FavoritesObjects.notFavoriteIcon).waitFor({state: "attached", timeout: DEFAULT_TIMEOUT});
        }

        const saved = this.page.waitForResponse(r =>
            r.url().includes(FavoritesObjects.favoriteApi) && r.request().method() === "POST", {timeout: DEFAULT_TIMEOUT});
        await this.favoriteButton.click();
        expect((await saved).ok()).toBe(true);
        await this.favoriteButton.locator(FavoritesObjects.favoriteIcon).waitFor({state: "attached", timeout: DEFAULT_TIMEOUT});
    }

    async openFavoritesFromUserProfile() {
        const favoritesLink = this.page.getByText(FavoritesObjects.favoritesSidebarLink, {exact: true}).filter({visible: true}).first();
        await favoritesLink.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await favoritesLink.click();
        await this.page.waitForURL(FavoritesObjects.favoritesUrl, {timeout: DEFAULT_TIMEOUT});
    }

    async openProjectsTab() {
        const projectsTab = this.page.getByText(FavoritesObjects.projectsTab, {exact: true}).filter({visible: true}).first();
        await projectsTab.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await projectsTab.click();
    }

    async isProjectInFavorites(projectTitle: string): Promise<boolean> {
        const card = this.page.locator(FavoritesObjects.favoriteCard).filter({hasText: projectTitle}).first();
        await card.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return await card.isVisible();
    }

    // Click the heart on every card until the list is empty, waiting for each removal to be saved
    async removeAllFavorites() {
        const hearts = this.page.locator(FavoritesObjects.removeFavoriteButton).filter({visible: true});
        const emptyTitle = this.page.getByText(FavoritesObjects.emptyFavoritesTitle, {exact: true});
        await hearts.first().or(emptyTitle).waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});

        while (await hearts.count() > 0) {
            const before = await hearts.count();
            const removed = this.page.waitForResponse(r =>
                r.url().includes(FavoritesObjects.unfavoriteApi) && r.request().method() === "DELETE", {timeout: DEFAULT_TIMEOUT});
            await hearts.first().click();
            expect((await removed).ok()).toBe(true);
            await expect(hearts).not.toHaveCount(before, {timeout: DEFAULT_TIMEOUT});
        }
    }

    async isEmptyFavoritesMessageVisible(): Promise<boolean> {
        const title = this.page.getByText(FavoritesObjects.emptyFavoritesTitle, {exact: true});
        const description = this.page.getByText(FavoritesObjects.emptyFavoritesDescription, {exact: true});
        await title.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        await description.waitFor({state: "visible", timeout: DEFAULT_TIMEOUT});
        return await title.isVisible() && await description.isVisible();
    }
}
