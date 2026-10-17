export const ProjectUnitsObjects = {
  propertyText:
    "شقة",
  landUnitCard:
    "//app-dx-project-unit-card",
  unitCard:
    "//app-marketplace-unit-card/descendant::span[text() ='SAR']",
  unitCardApartmentNumber(apartmentNumber: string | number) {
    return `//span[normalize-space() = 'شقة ${apartmentNumber}']`;
  },
  nextPageButton:
    "//a[@aria-label='Next']",
} as const;
