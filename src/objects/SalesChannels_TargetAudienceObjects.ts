export const SalesChannels_TargetAudienceObjects = {
  unitDetailsButton: {
    role: 'tab', name: 'تفاصيل الوحدات'
  },
  advancedSearchButton:
    "بحث متقدم",
  mainDataRadioButton:
    "//label[contains(text(),'البيانات الأساسية')]/..",
  searchButton: {
    role: 'button', name: 'بحث'
  },
  mobileSalesChannel:
    "input#sales-channels0",
  opsTeamSalesChannel:
    "input#sales-channels1",
  partnerSalesChannel:
    "input#sales-channels2",
  thirdPartySalesChannel:
    "input#sales-channels3",
  webSalesChannel:
    "input#sales-channels4",
  beneficiaryTargetAudience:
    "input#target-segments0",
  charityTargetAudience:
    "input#target-segments1",
  companyTargetAudience:
    "input#target-segments2",
  nonBeneficiaryTargetAudience:
    "input#target-segments3",
  tanmwiTargetAudience:
    "input#target-segments4",
  searchResultsTable:
    "app-sapa-datatable",
  searchItemsSelector:
    "app-sapa-dropdown ng-select",
  unitCodeOptionSelector:
    "div[role='listbox'] div[role='option']:nth-child(1)",
  unitCodeField:
    ".input-icon-container input",
  emptyResultsTable:
    "//div[contains(text(),'لا يوجد بيانات للعرض')]",
  noBookingText:
    "//span[contains(text(),'لا يمكن حجز هذه الوحدة')]",
} as const;