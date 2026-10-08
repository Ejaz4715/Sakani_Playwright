export const MarketplaceLandingObjects = {
  searchButton: { role: "button", name: "بحث", exact: true },
  searchInput: {
    role: "textbox",
    name: "ماذا تبحث عنه؟ العقارات أو الخدمات أو الدعم",
  },
  projectResultModal: "app-global-search-modal-result-block",
  profileDropDown: "button#profile-dropdown",
  profileManagement: "div.action-list > div:nth-child(1)> div",

  searchedResutl:{
    xpath:"(//app-global-search-modal-result-block/descendant::div[contains(@class,'title')]/span)[1]"
  },
  readyMadeUnitCard:{
    xpath:"//app-dx-project-unit-card/descendant::span[text() ='SAR']"
  }

} as const;
