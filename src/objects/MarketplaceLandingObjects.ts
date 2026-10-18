export const MarketplaceLandingObjects = {
  searchButton: {
    role: "button", name: "بحث", exact: true
  },
  searchInput: {
    role: "textbox",
    name: "ماذا تبحث عنه؟ العقارات أو الخدمات أو الدعم",
  },
  projectResultModal:
    "app-global-search-modal-result-block",
  profileDropDown:
    "button#profile-dropdown",
  profileManagement:
    "div.action-list > div:nth-child(1)> div",
  searchedResutl: {
    xpath: "(//app-global-search-modal-result-block/descendant::div[contains(@class,'title')]/span)[1]"
  },
  readyMadeUnitCard: {
    xpath: "//app-dx-project-unit-card/descendant::span[text() ='SAR']"
  },
  searchTextField: "app-smart-search-input input",
  searchResultsCard: "app-smart-search-dropdown-section",
  searchResultsCardText: "app-smart-search-dropdown p",
  searchIcon:".svg-icon.icon-search-gray",

  financingShowMore: {
    container: "#financing",
    text: "شاهد المزيد",
  },
  news:
    ".footer-link[href='/news']",
  services:
    "//li/button/span[contains(text(),'الخدمات')]/..",
  allServicesButton:
    "//span[contains(text(),'عرض جميع الخدمات')]/..",
  eligibilityCheckerLink:
    "a[href*='check-eligibility']",
  realStateTaxExemptionLink:
    ".dropdown-menu-navbar-default a[href='/services/real-estate-tax-incurred-service']",
  financialAdvisoryLink:
    ".dropdown-menu-navbar-default a[href='/services/financial-advisory']",
  termsAndConditionsLink:
    "a[href='/terms']",
  executiveRegulationLink:
    "a[href='/housing-subsidy-policy']",
  supportAndHelpLink:
    "a[href='/support-and-help']",
  supportAndHelpFAQLink:
    "a[href='/support-and-help/faqs']",
  contactUsLink:
    "a[href='/support-and-help/contact-us']",
  offPlanProjectsProductLink:
    "a[href='/services/off-plan-projects']",
  readyUnitsProductLink:
    "a[href='/services/ready-units']",
  landsProductLink:
    "a[href='/services/lands']",
  offPlanProductHeaderText:
    "//h1[contains(text(),'وحدات البيع على الخارطة')]",
  readyUnitProductHeaderText:
    "//h1[contains(text(),'منتج الوحدات الجاهزة')]",
  landsProductHeaderText:
    "//h1[contains(text(),'أرضك دعمك')]",
} as const;
