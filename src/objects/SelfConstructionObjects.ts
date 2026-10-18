export const SelfConstructionObjects = {
    selfConstructionLink: {
        text: "البناء الذاتي",
    },
    engineeringOfficeLink: {
        role: "link",
        name: "المكتب الهندسي",
    },
    interiorDesignOffersLink: {
        role: "link",
        name: "عروض التصاميم الداخلية",
    },
    servicesPackagesLink: {
        role: "link",
        name: "باقات الخدمات",
    },
    //Engineering Office
    addEngineeringOfficeButton: {
        role: "button",
        name: "إضافة مكتب هندسي"
    },
    enginerringOfficeNameInputfield: {
        xpath: "//span[text()=' أسم المكتب الهندسي ']/parent::label/following-sibling::input"
    },
    statusDropdownList: {
        xpath: "//span[text()=' الحالة ']/parent::label/following-sibling::ng-select"
    },
    statusOption: {
        xpath: "//span[text()='Active']"
    },
    crNubmerInputfield: {
        xpath: "//span[text()=' رقم السجل التجاري ']/parent::label/following-sibling::input"
    },
    councilNubmerInputfield: {
        xpath: "//span[text()=' رقم المكتب في الهيئة السعودية للمهندسين ']/parent::label/following-sibling::input"
    },
    buildingPermitPriceInputfield: {
        xpath: "//span[text()=' سعر اصدار رخصة البناء ']/parent::label/following-sibling::input"
    },
    ibanNumberInputfield: {
        xpath: "//span[text()=' رقم الآيبان ']/parent::label/following-sibling::input"
    },
    bankAccountNameInputfield: {
        xpath: "//span[text()=' اسم العميل ']/parent::label/following-sibling::input"
    },
    succsessfullToasMessage: {
        xpath: "simple-snack-bar"
    },
    //Inerior Design Offer
    addNewInteriorOfficeDesignLink: {
        role: "link",
        name: "اضافة مكتب تصميم داخلي جديد",
    },
    designerNameInputfield: {
        xpath: "//span[text()=' اسم المصمم ']/parent::label/following-sibling::input"
    },
    officeNameInputfield: {
        xpath: "//span[text()=' أسم المكتب التجاري ']/parent::label/following-sibling::input"
    },
    aboutDesignerTextarea: {
        xpath: "//span[text()=' نبذة عن المصمم ']/parent::label/following-sibling::textarea"
    },
    emailInputfield: {
        xpath: "//span[text()=' البريد الإلكتروني ']/parent::label/following-sibling::input"
    },
    uploadDesignLogo: {
        xpath: "//h1[contains (text(), 'شعار المصمم')]/parent::div/following-sibling::div/child::input[@type='file']"
    },
    publishToggle: {
        xpath: "//label[contains (text(), 'هل تم نشر المشروع')]/preceding-sibling::ui-switch/button"
    },
    bookingDocumentTemplateSection: {
        text: "قالب مستند الحجز",
    },
    upoladDocument: {
        xpath: "//input[@type='file']"
    },
    documentTemplateTypeDrodpwnList: {
        xpath: "//mat-select"
    },
    documentTemplateTypeOption: {
        xpath: "//mat-option"
    },
    //Self build
    firstServiesPackages: {
        xpath: "(//datatable-body-row)[1]"
    },
    linkedWithSection: {
        text: "صلة القرابة",
    },
    addIconButton: {
        xpath: "//div[contains(text(),' ربط مشروع ASEC بحزمة الخدمة هذه')]/button"
    },

    notFoundOption: {
        xpath: "//div[@class='ng-option ng-option-disabled']"
    },
    selectProjectInputfield: {
        xpath: "//span[text()=' حدد مشروع ASEC ']/parent::label/following-sibling::ng-select/descendant::input"
    },
    selectProjectOption: {
        xpath: "//span[@class='ng-option-label']"
    },
    selectBlockDropdownList: {
        xpath: "//span[text()=' حدد حظر ']/parent::label/following-sibling::ng-select"
    },
    selectBlocksOption: {
        xpath: "(//span[@class='ng-option-label'])[1]"
    },
    deleteButton: {
        xpath: "//button[contains(@class,'btn btn-danger')]"
    },
    updateButton: {
        xpath: "//span[contains(text(),'تحديث')]"
    },
    uploadMasterPlan:{
    xpath:"//h1[contains (text(), 'ملف المخطط الرئيسي')]/parent::div/following-sibling::div/child::input[@type='file']"
    },
    uplaodImage:{
        xpath:"//h1[contains (text(), 'صورة العرض')]/parent::div/following-sibling::div/child::input[@type='file']"
    }
} as const;