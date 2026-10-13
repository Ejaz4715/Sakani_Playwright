export const RequestPublishProjectObjects = {
    projectsLink: {
        role: "link",
        name: "المشاريع",
    },
    newProjectButton: {
        role: "link",
        name: "مشروع جديد",
    },
    projectNameInputfield: {
        xpath: "//label[text()=' اسم المشروع ']/parent::app-sapa-label-v2/following-sibling::div/input"
    },
    proejctTypeDropddownList: {
        xpath: "//label[text()=' نوع المشروع ']/parent::app-sapa-label-v2/following-sibling::div/ng-select"
    },
    projectTypeOption: {
        role: "option",
        name: "مشاريع البيع على الخارطة على أراضي الوزارة",
    },

    regionDropdownList: {
        xpath: "//label[text()=' المنطقة ']/parent::app-sapa-label-v2/following-sibling::div/ng-select"
    },
    regionOption: {
        role: "option",
        name: "الرياض",
    },
    cityDropdownList: {
        xpath: "//label[text()=' المدينة ']/parent::app-sapa-label-v2/following-sibling::div/ng-select"
    },
    cityOption: {
        role: "option",
        name: "شقراء",
        exact: true,
    },
    developerDropdownList: {
        xpath: "//label[text()=' المطور العقاري ']/parent::app-sapa-label-v2/following-sibling::div/ng-select"
    },
    developerOption: {
        role: "option",
        name: "شركة روشن العقارية شركة شخص واحد مساهمة مقفلة",
    },
    bookableToggle: {
        xpath: "(//app-sapa-toggle-v2/descendant::label)[1]"
    },
    signAggrementProjectDateInputfield: {
        xpath: "//label[text()=' تاريخ توقيع اتفاقية المشروع ']/parent::app-sapa-label-v2/following-sibling::div/input[1]"
    },
    projectLicenseNumberInpufield: {
        xpath: "//label[text()=' رقم ترخيص المشروع ']/parent::app-sapa-label-v2/following-sibling::div/input"
    },
    projectLicenseDateInputfield: {
        xpath: "//label[text()=' تاريخ ترخيص المشروع  ']/parent::app-sapa-label-v2/following-sibling::div/input[1]"
    },
    escrowAccountNameInputfield: {
        xpath: "//label[text()=' اسم حساب الضمان ']/parent::app-sapa-label-v2/following-sibling::div/input"
    },
    escrowAccountNubmerInputfield: {
        xpath: "//label[text()=' رقم حساب الضمان  ']/parent::app-sapa-label-v2/following-sibling::div/input"
    },
    escrowBankNameDropdownList: {
        xpath: "//label[text()=' البنك المصدر منه الضمان ']/parent::app-sapa-label-v2/following-sibling::div/ng-select"
    },
    escrowBankNameOption: {
        role: "option",
        name: "CRM Bank Test",
    },
    projectDeductPerecentageInputfield: {
        xpath: "//label[text()='  نسبة الاستقطاع عند الالغاء ']/parent::app-sapa-label-v2/following-sibling::div/input"
    },
    deedCityInputfield: {
        xpath: "//label[text()=' المدينة المصدر منها ']/parent::app-sapa-label-v2/following-sibling::div/input"
    },
    landDeliveryDateToDeveloperInputfield: {
        xpath: "//label[text()=' تاريخ تسليم الأرض ']/parent::app-sapa-label-v2/following-sibling::div/input[1]"
    },
    nextButton: {
        role: "button",
        name: "التالي",
    },
    bankCheckbox: {
        xpath: "(//app-sapa-checkbox-v2)[1]"
    },
    lendingPaymentDropdownButton: {
        xpath: "//span[text()=' التمويل ']"
    },
    cashPaymentDropdwonButton: {
        xpath: "//span[text()=' نقدي ']"
    },
    templateNameForLendingInputfield: {
        xpath: "(//label[text()=' اسم قالب جدول الدفع ']/parent::div/descendant::input)[1]" // lending
    },
    firstPayCompletionPercentageForLending: {
        xpath: "(//label[text()=' نسبة الإنجاز ']/parent::div/descendant::input)[1]" //50
    },
    firstPayPaidPercentageForLending: {
        xpath: "(//label[text()=' نسبة المبلغ المدفوع ']/parent::div/descendant::input)[1]" //40
    },
    lastPayCompletionPercentageForLending: {
        xpath: "(//label[text()=' نسبة الإنجاز ']/parent::div/descendant::input)[2]" //100
    },
    lastPayPaidPercentageForLending: {
        xpath: "(//label[text()=' نسبة المبلغ المدفوع ']/parent::div/descendant::input)[2]" //60
    },

    templateNameForCashInputfield: {
        xpath: "(//label[text()=' اسم قالب جدول الدفع ']/parent::div/descendant::input)[2]" //cash
    },
    firstPayCompletionPercentageForCash: {
        xpath: "(//label[text()=' نسبة الإنجاز ']/parent::div/descendant::input)[3]" //50
    },
    firstPayPaidPercentageForCash: {
        xpath: "(//label[text()=' نسبة المبلغ المدفوع ']/parent::div/descendant::input)[3]" //40
    },
    lastPayCompletionPercentageForCash: {
        xpath: "(//label[text()=' نسبة الإنجاز ']/parent::div/descendant::input)[4]" //100
    },
    lastPayPaidPercentageForCash: {
        xpath: "(//label[text()=' نسبة المبلغ المدفوع ']/parent::div/descendant::input)[4]" //60
    },

    confirmAndSendButton: {
        role: "button",
        name: "تأكيد وإرسال",
    },
    sendButton: {
        role: "button",
        name: "إرسال",
    },
    successMessage: {
        name: "تهانينا!",
    },

    projectManagementButton: {
        role: "button",
        name: "إدارة المشروع"
    },
    addUnitsButton: {
        role: "button",
        name: "إضافة وحدات"
    },
    unitTypeDropdownList: {
        xpath: "//label[text()=' نوع الوحدة']/parent::app-sapa-label/following-sibling::div/ng-select"
    },
    apartementOption: {
        role: "option",
        name: "شقة",
    },

    //Admin
    developerProjectsTab: {
        text: "قائمة إنشاء مشاريع SAPA"
    },
    approveButton: {
        role: "button",
        name: "قبول"
    },
    approvedSuccessToast: {
        text: "تمت الموافقة على المشروع بنجاح!"
    },
    approvedUnitSuccessToast: {
        text: "لقد قمت بقبول طلب الحذف بنجاح."
    },
    //user
    projectName: {
        xpath: "//app-dx-project-information-tpl/h3"
    }
} as const