export const UnitsDeliveryObjects = {
    unitDeliveryLink: {
        xpath: "//span[contains(text(),'تسليم الوحدات ')]/../.."
    },
    startForPreparingUnitsForDelivery: {
        xpath: "//h6[contains(text(),'تجهيز الوحدات للتسليم')]/..//button"
    },
    startForReadyUnitsForDelivery: {
        xpath: "//h6[contains(text(),'وحدات جاهزة للتسليم')]/..//button"
    },

    searchDropdownMenu: {
        xpath: "(//input[@role='combobox'])[1]/../../../.."
    },

    projectNameSelectorForSearch: {
        xpath: "//ng-dropdown-panel//span[contains(text(),'اسم المشروع')]"
    },

    unitCodeSelectorForSearch: {
        xpath: "//ng-dropdown-panel//span[contains(text(),'رمز الوحدة')]"
    },

    projectNameDropdownOption: {
        xpath: "//ng-dropdown-panel/div/div[2]/div"
    },

    projectNameTextField: {
        xpath: "(//input[@role='combobox'])[2]"
    },
    unitCodeTextField: {
        css: ".input-icon-container>input"
    },

    searchButton: {
        xpath: "//button[contains(text(),'بحث')]"
    },

    selectProjectButton: {xpath: "//button[contains(text(),'حدد المشروع')]"},

    selectUnitButton: {xpath: "//button[contains(text(),'اختر الوحدة')]"},

    readyForDeliveryCheckbox: {css: "label[for='id']"},

    calendarIcon:{css:"app-hijri-datepicker .icon"},

    visibleAllowedDataLocator:{css:"div[role='gridcell'][aria-disabled='false'] .btn-light"},

    timeDropdownMenu:{xpath:"//div[contains(text(),'اختر الوقت')]/..//div[2]"},

    firstAvailableDeliveryTime:{css:"ng-dropdown-panel [role='listbox'] [aria-posinset='1']"},
    sendButton: {xpath:"//button[contains(text(),'إرسال')]"},
    deliveryReadinessSuccessfulMessage:{xpath:"//div[contains(text(),'الوحدة جاهزة للتسليم. لبدء التقديم، يرجى الانتقال إلى صفحة \"الوحدات الجاهزة للتسليم\".')]"},

    unitCheckBox:{css:".datatable-body-cell-label > div> div"},
    sendAllMarkedUnitsButton:{xpath:"//button[contains(text(),'إرسال الكل')]"},
    agreePopUpButton:{xpath:"//button[contains(text(),'نعم')]"},
    deliverySuccessMessage:{xpath:"//h3[contains(text(),'تم اختيار الوحدة بنجاح!')]"},
    unitDeliveryLinkFromSakani:{xpath:"//span[contains(text(),'تسليم الوحدات')]/.."},
    unitDeliveryConfirmationFromSakani:{xpath:"//button[contains(text(),'يرجى الاستمرار في تأكيد تسليم الوحدات')]"},
    pendingUnitDelivery:{xpath:"//a[contains(text(),'قيد الانتظار')]"},
    showDeliveryUnitModelButton:{xpath:"//span[contains(text(),'عرض نموذج تسليم الوحدة')]/.."},
    agreeCheckbox:{xpath:"//span[contains(text(),'نعم')]/../../../input"},
    continueButton:{xpath:"//button[contains(text(),'المتابعة')]"},
    termsAndConditionsCheckbox:{css:"#agreeTermsConditions"},
    agreeOnDeliveryUnit:{xpath:"//button[contains(text(),'قبول تسليم الوحدة')]"},
    verifyField:{xpath:"//app-otp-input//div/input"},
    verifyButton:{xpath:"//div[contains(@class,'modal-footer')]/button[contains(text(),'تحقق')]"},
    unitDeliverySuccessMessage:{xpath:"//p[contains(text(),'تم قبول تاريخ ووقت تسليم الوحدة بنجاح.')]"},

} as const