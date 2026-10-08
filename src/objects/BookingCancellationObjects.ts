export const BookingCancellationObjects = {
  userProfileButton: "//button[@id='profile-dropdown']",
  myBookingsLink: "//div[@aria-labelledby='profile-dropdown']/descendant::span[contains (text(), 'حجوزاتي')]",
  manageProfile: "//div[@aria-labelledby='profile-dropdown']/descendant::span[contains (text(), 'إدارة الملف الشخصي')]",
  activeBookingsTab: { role: "tab", name: "نشطة" },
  completedBookingsTab: { role: "tab", name: "مكتملة" },
  bookingDetailsButton: { role: "button", name: "عرض التفاصيل" },
  cancelBookingText: { text: "إلغاء الحجز" },
  continueButton: { role: "button", name: "المتابعة" },
  projectLocationRadio: { role: "radio", name: "موقع المشروع" },
  confirmCancelButton: { role: "button", name: "تأكيد الإلغاء" },
  yesButton: { role: "button", name: "نعم" },
  cancellationSuccessHeading: {
    role: "heading",
    name: "تم إلغاء الحجز بنجاح!",
  },

  refudedStatus: {
    xpath: "//app-booking-refund-fee-badge/descendant::div[contains(text(),'المبلغ المسترد')]"
  },
  bookedUnitCode:
    "//div[text() = 'رمز الوحدة']/following-sibling::div/child::div",

  viewPriceQuotationButton: {
    xpath: "//div[text()='عرض السعر']/parent::div//following-sibling::app-pdf-viewer/descendant::span"
  },


  compeltiopnPercentageProgress: {
    xpath: "//div[text()='تقدم']"

  },

  noBanksAvailableMessage: {
    xpath: "//app-dx-project-participating-banks/descendant::div[text()=' لا توجد بيانات ']"
  },



  //ReadyMade View project and unit 

  //project + some in unit

  projectInfoSection: {
    xpath: "app-dx-project-information-tpl"
  },

  brochureAndMasterplanSection: {
    xpath: "//app-dx-brochure-masterplan-tpl"
  },

  projectUnitsTypesSection: {
    xpath: "//app-dx-project-unit-types"
  },

  projectFacilitiesSection: {
    xpath: "//app-dx-project-facilities"
  },
  projectInsightSection: {
    xpath: "//app-dx-insight-project-wrapper"
  },
  participatinBanksSection: {
    xpath: "//app-dx-project-participating-banks"
  },
  projectContactsSection: {
    xpath: "//app-dx-project-contacts-tpl"
  },

  projectUnitsSection: {
    xpath: "//app-dx-project-units"
  },
  //unit page
  licenseAndAdvertismentSection: {
    xpath: "//app-dx-advertisement-license-tpl"
  },

  unitDetailsSection:{
    xpath:"//app-dx-propery-unit-details-tpl"
  },
husngAssistancentSection:{
  xpath:"//app-dx-housing-assistance-tpl"
},
brochureCard:{
  xpath:"//span[text()='الكتيب']"
},

masterplanCard:{
  xpath:"//span[text()='المخطط العام']"
},


//Card deatails

favoriteButton:{
  xpath:"(//button/span[text()=' المفضلة '])[1]"
},

shareButton:{
  xpath:"(//button/span[text()=' مشاركة '])[1]"
},
locationSection:{
  xpath:"//app-dx-project-map"
},
schdualePaymentSection:{
  xpath:"//app-dx-cash-payment-schedule-tpl"
},
callButton:{
  xpath:"//button/span[text()='اتصال']"
},
whatsAppButton:{
  xpath:"//button/span[text()='واتساب']"
},

brochureButton:{
  xpath:"//app-pdf-viewer"
},

brochureViewer:{
  xpath:"//p[text()='عرض الكتيب']"
},

closebrochureButton:{
xpath:"//app-modal//span[contains(@class,'svg-icon')]"
},
masterplanButton:{
  xpath:"//div[text()='المخطط الرئيسي']"
},
masreplanViewer:{
  xpath:"//app-image-viewer"
},

closemasterplanButton:{
xpath:"(//app-modal//span[contains(@class,'svg-icon')])[3]"
},



} as const;
