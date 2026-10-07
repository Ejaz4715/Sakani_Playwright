export const ReportTheUnitObjects = {
  marketPlaceDropdownList: {
    xpath: "//app-dx-marketplace-switcher",

  },
 
  rentalPurposeOption: {
   xpath:"//div[@role='listbox']/descendant::span[contains(text(),'عقارات للإيجار')]"
  },
  marketUnitCard: "app-marketplace-market-unit-card",
  reportUnitLink: "الإبلاغ على الوحدة",
  reportCategoryDropdown: {
    role: "combobox",
    value: "1: 1",
  },
  incorrectPropertyPriceOption: {
    role: "radio",
    name: "سعر العقار غير صحيح",
  },
  submitButton: {
    role: "button",
    name: "إرسال",
  },
  successHeading: {
    role: "heading",
    name: "تم الإرسال بنجاح",
  },
} as const;