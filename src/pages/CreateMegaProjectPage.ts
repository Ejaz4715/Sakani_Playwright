import { expect, Page } from "@playwright/test";
const path = require("path");

import { CreateMegaProjectObjects } from '@objects/CreateMegaProjectObjects';
import { UnitDetailsObjects } from '@objects/UnitDetailsObjects';

export class CreateMegaProjectPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  async clickOnMegaProjects() {
    const megaProjects = this.page.getByRole(
      CreateMegaProjectObjects.megaProjects.role, {
      name: CreateMegaProjectObjects.megaProjects.name
    }
    );
    // await expect(megaProjects).toBeVisible({ timeout: 90000 });
    await megaProjects.click();
  }
  async clickOnAddNewMegaProject() {
    const addNewMegaProjectButton = this.page.getByRole(
      CreateMegaProjectObjects.addNewMegaProjectButton.role, {
      name: CreateMegaProjectObjects.addNewMegaProjectButton.name
    }
    );
    await expect(addNewMegaProjectButton).toBeVisible({ timeout: 90000 });
    await addNewMegaProjectButton.click();
  }
  async enterMegaProjectInformation(megaProjectName: string) {
    const megaProjectInformation = this.page.locator(
      CreateMegaProjectObjects.megaProjectInformation.xpath
    );

    await expect(megaProjectInformation).toBeVisible({ timeout: 90000 });
    await megaProjectInformation.fill(megaProjectName);
  }

  async selectRegion(regionName: string) {
    const regionDropdownList = this.page.locator(
      CreateMegaProjectObjects.regionDropdownList.name
    );
    await expect(regionDropdownList).toBeVisible({ timeout: 90000 });
    await regionDropdownList.click();
    const regionOption = this.page.getByRole(
      CreateMegaProjectObjects.selectedRegion.role,
      {
        name: regionName
      }
    );
    await expect(regionOption).toBeVisible({ timeout: 90000 });
    await regionOption.click();
  }

  async selectCity(cityName: string) {
    const cityDropdownList = this.page.locator(
      CreateMegaProjectObjects.cityDropdownList.name
    );
    await expect(cityDropdownList).toBeVisible({ timeout: 90000 });
    await cityDropdownList.click();
    const cityOption = this.page.getByRole(
      CreateMegaProjectObjects.selectedCity.role,
      {
        name: cityName
      }
    );
    await expect(cityOption).toBeVisible({ timeout: 90000 });
    await cityOption.click();
  }

  async enterLatitude(latitude: string) {
    const latitudeInput = this.page.locator(
      CreateMegaProjectObjects.latitudeInput.xpath
    );
    await expect(latitudeInput).toBeVisible({ timeout: 90000 });
    await latitudeInput.fill(latitude);
  }

  async enterLongitude(longitude: string) {
    const longitudeInput = this.page.locator(
      CreateMegaProjectObjects.longitudeInput.xpath
    );
    await expect(longitudeInput).toBeVisible({ timeout: 90000 });
    await longitudeInput.fill(longitude);
  }
  async enterVideoLink(videoLink: string) {
    const videoLinkInput = this.page.locator(
      CreateMegaProjectObjects.videoLinkInput.xpath
    );
    await expect(videoLinkInput).toBeVisible({ timeout: 90000 });
    await videoLinkInput.fill(videoLink);
  }

  async uploadBannerImage(filePath: string) {
    const uploadBannerImage = this.page.locator(
      CreateMegaProjectObjects.uploadBannerImage.xpath
    );
    // await expect(uploadBannerImage).toBeVisible({ timeout: 90000 });
    await uploadBannerImage.setInputFiles(filePath);
  }
  async uploadImageGallery(filePath: string) {
    const uploadImageGallery = this.page.locator(
      CreateMegaProjectObjects.uploadImageGallery.xpath
    );
    // await expect(uploadImageGallery).toBeVisible({ timeout: 90000 });
    await uploadImageGallery.setInputFiles(filePath);
  }
  async clickOnAddMegaProject() {
    const addMegaProjectButton = this.page.getByRole(
      CreateMegaProjectObjects.addMegaProjectButton.role, {
      name: CreateMegaProjectObjects.addMegaProjectButton.name
    }
    );
    await this.page.waitForTimeout(10000);
    await expect(addMegaProjectButton).toBeVisible({ timeout: 90000 });
    await addMegaProjectButton.click();
  }

  async searchAndSelectProject(projectName: string) {
    const searchProjectInput = this.page.getByRole(
      CreateMegaProjectObjects.searchProjectInput.role
    );
    await this.page.waitForTimeout(10000);
    await expect(searchProjectInput).toBeVisible({ timeout: 90000 });
    await searchProjectInput.last().fill(projectName);
  }
  async selectSearchedProject(projectName: string) {
    const searchedProject = this.page.getByRole(
      CreateMegaProjectObjects.searchedProject.role, {
      name: projectName
    }
    );
    await this.page.waitForTimeout(5000);
    await expect(searchedProject).toBeVisible({ timeout: 90000 });
    await searchedProject.click();

  }

  async clickOnAddToMegaProject() {
    const addToMegaProjectButton = this.page.getByRole(
      CreateMegaProjectObjects.addToMegaProjectButton.role, {
      name: CreateMegaProjectObjects.addToMegaProjectButton.name
    }
    );
    await expect(addToMegaProjectButton).toBeVisible({ timeout: 90000 });
    await addToMegaProjectButton.click();
  }

  async clickOnMegaProjectInformationLink() {
    const megaProjectInformationLink = this.page.getByRole(
      CreateMegaProjectObjects.megaProjectInformationLSection.role, {
      name: CreateMegaProjectObjects.megaProjectInformationLSection.name
    }
    );
    // await expect(megaProjectInformationLink).toBeVisible({ timeout: 90000 });
    await megaProjectInformationLink.click();
  }
  async clickOnEditButton() {
    const editButton = this.page.locator(
      CreateMegaProjectObjects.editButton.xpath
    );
    await expect(editButton).toBeVisible({ timeout: 90000 });
    await editButton.click();
  }
  async enableNonSaudiDestinationSwitch() {
    const enableNonSaudiDestinationSwitch = this.page.locator(
      CreateMegaProjectObjects.enableNonSaudiDestinationSwitch.xpath
    );
    await expect(enableNonSaudiDestinationSwitch).toBeVisible({ timeout: 90000 });
    await enableNonSaudiDestinationSwitch.click();
  }
  async clickOnUpdateButton() {
    const updateButton = this.page.locator(
      CreateMegaProjectObjects.updateButton.xpath
    );
    await this.page.waitForTimeout(5000);
    await expect(updateButton).toBeVisible({ timeout: 90000 });
    await updateButton.click();
  }

  async verifyProjectNotAvailableForNonSaudiMessage() {
    const projectNotAvailableForNonSaudiMessage = this.page.locator(
      CreateMegaProjectObjects.projectNotAvailableForNonSaudiMessage.xpath
    );

    await this.page.waitForTimeout(5000);
    await expect(projectNotAvailableForNonSaudiMessage).toBeVisible({ timeout: 90000 });
  }
async searchForMeagaProject(projectName: string) {
    const searchForMeagaProjectInput = this.page.locator(
      CreateMegaProjectObjects.searchForMeagaProjectInput.xpath
    );
    await this.page.waitForTimeout(10000);
    await expect(searchForMeagaProjectInput).toBeVisible({ timeout: 90000 });
    await searchForMeagaProjectInput.fill(projectName);
  }
async clickOnSearchButton() {
    const searchButton = this.page.locator(
      CreateMegaProjectObjects.searchButton.xpath
    );
    await expect(searchButton).toBeVisible({ timeout: 90000 });
    await searchButton.click();
  }

  async selectSearchedMegaProject() {
    const searchedMegaPrjectResult = this.page.locator(
      CreateMegaProjectObjects.searchedMegaPrjectResult.xpath
    );
    await this.page.waitForTimeout(7000);
    await expect(searchedMegaPrjectResult).toBeVisible({ timeout: 90000 });
    await searchedMegaPrjectResult.click();
  }

    async verifyReserveUnitButtonIsVisible() {
    const reserveButton = this.page.getByRole(
      UnitDetailsObjects.reserveButton.role,
      { name: UnitDetailsObjects.reserveButton.name },
    );

  await this.page.waitForTimeout(5000);
    await expect(reserveButton).toBeVisible({ timeout: 30000 });
  }
}