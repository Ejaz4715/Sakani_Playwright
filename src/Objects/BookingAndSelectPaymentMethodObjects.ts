export const BookingAndSelectPaymentMethodObjects = {

    approveAndcontinueButton: {
        xpath: "//button[contains(text(),'موافقة واستمرار')]"

    },
    payBookingFeesButton: {
        xpath: "//button/span[contains(text(),'دفع رسوم الحجز')]"
    },
    termsCheckbox: {
        xpath: "//input[@formcontrolname='accepted_term']"
    },

    unitCode: {
        xpath: "//app-offplan-comprehensive-information/descendant::h2"
    },

    selectPaymentMehtButton: {
        xpath: "//button[contains(text(),'اختر طريقة الدفع')]"
    },
    flexiblePaymentRadioButton:{
        xpath:"//input[contains(@id, 'flexible_payment_schedule')]"
    },
    saveAndContinueButton:{
        xpath:"//button[contains(text(), 'حفظ ومتابعة')]"
    },
    signContractButton:{
        xpath:"//button[contains(text(), 'توقيع العقد')]"
    },

    bookingDetailsButton:{
        xpath:"//button[contains(text(), 'تفاصيل الحجز')]"
    },


} as const
