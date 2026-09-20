export const FlexiblePaymentObjects = {
    finacialManagemnt: {
        xpath: "//span[contains(text(),'الإدارة المالية')]"
    },
    paymentSchedules: {
        role: "link", name: 'جداول الدفع'
    },
    newScheduleButton: {
        role: "button", name: 'جدول جديد'
    },
    scheduleNameInArabicInputfield: {
        xpath: "(//app-sapa-label-v2/following-sibling::div/input)[1]"
    },
    scheduleTypeDropdownList: {
        xpath: "//app-sapa-dropdown-v2[@formcontrolname='schedule_type']/descendant::ng-select"
    },
    completionPercentageOption: {
        role: "option", name: 'نسبة الإنجاز'
    },
    specificPeriodOption: {
        role: "option", name: 'فترة محددة'
    },
    nextButton: {
        role: "button", name: 'التالي'
    },
    firstPaymentPaidPercentageInputfield: {
        xpath: "//app-completion-percentage-payment-phase[@id='payment-phase-0']/descendant::input[1]"
    },
    firstPaymentCompletionPercentageInputfield: {
        xpath: "//app-completion-percentage-payment-phase[@id='payment-phase-0']/descendant::input[2]"
    },
    secondPaymentPaidPercentageInputfield: {
        xpath: "//app-completion-percentage-payment-phase[@id='payment-phase-1']/descendant::input[1]"
    },
    secondPaymentCompletionPercentageInputfield: {
        xpath: "//app-completion-percentage-payment-phase[@id='payment-phase-1']/descendant::input[2]"
    },
    thirdPaymentPaidPercentageInputfield: {
        xpath: "//app-completion-percentage-payment-phase[@id='payment-phase-2']/descendant::input[1]"
    },
    thirdPaymentCompletionPercentageInputfield: {
        xpath: "//app-completion-percentage-payment-phase[@id='payment-phase-2']/descendant::input[2]"
    },
    projectNameInputfield: {
        role: "textbox", name: 'ابحث برمز المشروع أو اسمه'
    },
    projectResultChecbox: {
        xpath: "(//div[@class='form-check'])[2]"
    },
    confirmButton: {
        role: "button", name: 'تأكيد'
    },
    successfulMessage: {
        xpath: "//span[contains(text(),'تم إنشاء جدول الدفع بنجاح')]"
    },
    planTypeDropdownList: {
        xpath: "//app-sapa-dropdown-v2[@formcontrolname='schedule_template']"
    },
    planTypeOption: {
        role: "option", name: 'شهري'
    },
    planPeriodInputfield: {
        xpath: "//app-sapa-number-input-v2[@formcontrolname='schedule_period']/descendant::input"
    }
} as const