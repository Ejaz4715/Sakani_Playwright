export const PublishUnitObjects = {

    //Partners
    developerBrokerRoleText: "شركة وساطة عقارية",

    servicesLink: {
        role: "link",
        name: "الخدمات",
    },

    managePublishButton: {
        role: "button",
        name: "إدارة النشر",
    },
    publishTab: {
        role: "tab",
        name: "نشر",
    },
    startButton: {
        role: "button",
        name: "البدء",
    },
    singleUnitOption: {

        role: "label",
        name: "نشر وحدة واحدة حدد وحدة واحدة من الصكوك ليتم نشرها في منصة سكني",
    },
    nextButton: {
        role: "button",
        name: "التالي",
    },
    adLicenseNumberInputfield: {
        xpath: "//input[@placeholder='رقم ترخيص الإعلان']",
    },
    advertiserIdTypeDropdownList: {
        xpath: "//app-sapa-dropdown[@formcontrolname='id_type']/descendant::ng-select",
    },
    advertiserIdTypeOption: {
        role: "option",
        name: "مكتب وساطة",
    },
    advertiserIdNumberInputfield: {
        xpath: "//input[@placeholder='رقم هوية المعلن']",
    },
    continueButton: {
        role: "button",
        name: "المتابعة",
    },
    preferredCommunicationTypeDropdownList: {
        selector: "#preferred_communication_type",
    },
    preferredCommunicationTypeOption: {
        role: "option",
        name: "الواتساب",
    },
    heightInputfield: {
        xpath: "//label[@for='height']/parent::div/descendant::input",
    },
    widthInputfield: {
        xpath: "//label[@for='width']/parent::div/descendant::input",
    },
    buildingYearDropdownList: {
        xpath: "//label[@for='building_year']/parent::div/descendant::ng-select",
    },

    buildingYearOption: {
        role: "option",
        name: "2026",
    },

    descriptionTextarea: {
        xpath: "//label[@for='description']/following-sibling::textarea",
    },
    exteriorPhotoInputfield: {
        xpath: "//label[@for='exterior_photo_form']/parent::div/descendant::input",
    },
    interiorPhotoInputfield: {
        xpath: "//label[@for='interior_photo_form']/parent::div/descendant::input",
    },
    dataAccuracyDisclaimerCheckbox: {
        xpath: "//span[contains(text(),'قر على صحة البيانات المدخلة')]/parent::div/preceding-sibling::app-sapa-checkbox",
    },
    sendPublishUnitButton: {
        role: "button",
        name: "إرسال نشر وحدة",
    },
    publishUnitSendModal: {
        selector: "app-publish-unit-send-modal",
    },
    adLicenseNumberToSearchInputfield: {
        xpath: "//label[contains(text(),' رقم ترخيص الإعلان')]/parent::app-sapa-label/following-sibling::div/input",
    },
    adLicenseStatus: {
        xpath: "(//datatable-body-cell/div/div)[5]",
    },


    //Admin
    externalInventoryLink: {
        selector: "a",
        hasText: "المخزون الخارجي",
    },
    readyMarketUnitsLink: {
        role: "link",
        name: "وحدات جاهزة من السوق",
    },
    requestTab: {
        role: "tab",
        name: "الطلب",
    },
    adminAdLicenseNumberInputfield: {
        role: "textbox",
        name: "رقم ترخيص الإعلان",
    },
    adLicenseNumberResultCell: (name: string) => ({
        role: "cell" as const,
        name,
    }),
    viewPublishUnitLink: {
        role: "link",
        name: "عرض",
    },
    acceptButton: {
        role: "button",
        name: "قبول",
    },
    publishUnitApprovalSuccessMessage: "تم الموافقة على هذه الوحدة بنجاح",
    

} as const;