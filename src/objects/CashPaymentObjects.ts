export const CashPaymentObjects = {
    sechudlePaymentCard: {
        xpath: "app-payment-schedule-card-selector"
    },
    bookingDetailsButton: {
        xpath: "//button[contains(text(), 'تفاصيل الحجز')]"
    },
    cashPaymentLink: {
        role: "link",
        name: "الدفع نقداً"
    },
    customerTypeDropdown: {
        xpath: "//div[contains(text(),'حدد نوع العميل')]/ancestor::ng-select",
        
    },
    customerTypeOption: {
        role: "option",
        name: "أفراد"
    },

    iDNumberInputfield:{
        xpath:"//input[@type='number']"
    },

    searchButton: {
        role: "button",
        name: "بحث"
    },
    showPasswordIcon: {
        selector: ".pointer.icon-password-show"
    },
    documentCashPaymentButton: {
        role: "button",
        name: "توثيق الدفع نقداً"
    },
    confirmYesButton: {
        role: "button",
        name: "نعم"
    },
    successMessage: {
        text: "تم توثيق الدفع النقدي في المشروع بنجاح"
    }
} as const