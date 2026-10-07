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

    viewPriceQuotationButton:{
      xpath:"//div[text()='عرض السعر']/parent::div//following-sibling::app-pdf-viewer/descendant::span"
    },
} as const;
