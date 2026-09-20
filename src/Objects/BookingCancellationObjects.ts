const BookingCancellationObjects = {
  userProfileButton: "//button[@id='profile-dropdown']",
  myBookingsLink: { text: "حجوزاتي" },
  activeBookingsTab: { role: "tab", name: "نشطة" },
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
  bookedUnitCode:
    "//div[text() = 'رمز الوحدة']/following-sibling::div/child::div",
};

module.exports = { BookingCancellationObjects };
