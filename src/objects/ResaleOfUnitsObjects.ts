export const ResaleOfUnitsObjects = {

    //Admin
    projectNameInputfield: {
        xpath: "//input[@formcontrolname='name']"
    },
    projectSearchButton: {
        role: "button", name: "بحث"
    },
    searchedProjectResult: {
        role: "cell", exact: true
    },
    resaleSettingTab: {
        text: "إعدادات خدمة إعادة البيع"
    },
    useGeneralResaleSettingsSwitch: {
        role: "switch", name: "استخدام إعدادات إعادة البيع العامة"
    },
    resaleFeeTypeDropdownList: {
        xpath: "//app-nsar-dropdown[@formcontrolname='resale_fee_type']/descendant::ng-select"
    },
    resaleTypeOption: {
        role: "option", name: "النسبة المئوية"
    },
    resaleFeeValueInputfield: {
        xpath: "//input[@formcontrolname='resale_fee_value']"
    },
    saveButton: {
        role: "button", name: "حفظ"
    },
    toastMessage: {
        text: "تم تحديث إعدادات إعادة البيع بنجاح"
    },


    requestNumberInputfieldِAdmin: {
        xpath: "//input[@formcontrolname='reference_number']"
    },
    searchButton: {
        xpath: "//button/span[text()='بحث']"
    },
    searchedResult: {
        xpath: "(//datatable-body-cell[2])[1]"
    },

    addBuyerButton: {
        role: "button", name: " إضافة مشتري "
    },
    buyerIDInputfield: {
        xpath: "//input[@formcontrolname='buyer_national_id_number']"
    },
    buyerDobInputfieldButton:{
        xpath:"//input[@placeholder='YYYY/MM/DD']"
    },

    verifyFromBuyerButton: {
        xpath: "//button[text()=' التحقق من المشتري ']"
    },
    buyerSourceDropdownList: {
        xpath: "//app-nsar-dropdown[@formcontrolname='buyer_source']/descendant::ng-select"
    },

    buyerSourceOption: {
        role: "option", name: "البائع"
    },
saveBuyerButton:{
    xpath:"//button[text()=' وفر على المشتري ']"
},
toastMessageBuyer: {
        text: "تم إضافة المشتري بنجاح"
    },



    //User

    resaleOfUnitsButton: {
        xpath: "//span[contains(text(),'إعادة بيع الوحدة على الخارطة')]"
    },
    assignToBuyerOption: {
        text: "إسناد إلى المشتري"
    },
    assignWithoutBuyerOption: {
        text: "دون تحديد مشتري محدد"
    },
    buyerIdInputfield: {
        xpath: "//input[@formcontrolname='buyer_national_id_number']"
    },
    buyerDobInputfield: {
        xpath: "//input[@placeholder='DD/MM/YYYY']"
    },
    verifyButton: {
        xpath: "//button[text()=' تحقق ']"
    },
    nextToFinancialInfoButton: {
        role: "button", name: "التالي: إدخال البيانات المالية"
    },
    resaleReasonDropdownList: {
        xpath: "(//ng-select)[3]"
    },
    resalReasonOption: {
        role: "option", name: "أسباب مالية"
    },
    resaleReasonDetailsTextarea: {
        xpath: "//textarea[@formcontrolname='resale_reason_details']"
    },
    waiverAmountInputfield: {
        xpath: "//input[@formcontrolname='waiver_amount']"
    },
    paymentMethodDropdownList: {
        xpath: "(//ng-select)[4]"
    },
    paymentMethodOption: {
        role: "option", name: "كاش"
    },


    priceAmountInpufield: {
        xpath: "//input[@formcontrolname='price_amount']"
    },

    priceAmountPercentageInputfield: {
        xpath: "//input[@formcontrolname='paid_amount_percentage']"
    },
    complectionPercentageInputfield: {
        xpath: "//input[@formcontrolname='completion_percentage']"
    },

    statusDropdownList: {
        xpath: "(//ng-select)[5]"
    },
    statusOption: {
        role: "option", name: "غير مدفوع"
    },
    addInstallmentButton: {
        xpath: "//button[text()=' إضافة قسط ']"
    },
    desclaimerWaiverChecbox: {
        role: "checkbox", name: "أوافق على اقرار التنازل عن عقد البيع على الخارطة"
    },
    submitButton: {
        role: "button", name: "تقديم الطلب"
    },
    requestNumber: {
        xpath: "//app-resell-units-success/descendant::p"
    },

    //Developer
    resaleRequestSideMenu: {
        role: "link", name: "طلبات إعادة البيع"
    },
    searchByDropdownList: {
        xpath: "//div[contains(text(),'البحث عن طريق')]/ancestor::ng-select"
    },
    searchedByOption: {
        role: "option", name: "البحث بواسطة: رقم المرجع"
    },
    requestNumberInputfield: {
        role: "textbox", name: "أدخل الرقم المرجعي"
    },
    viewDetailsButton: {
        role: "button", name: "عرض التفاصيل"
    },

    approveButton: {
        role: "button", name: "إعتماد"
    },
    sendButton: {
        role: "button", name: "إرسال"
    },
    toastMessagePartener: {
        xpath: "//span[contains(text(),'تمت الموافقة على الطلب بنجاح')]"
    },

    resaleRequestsButton: { text: "طلبات إعادة البيع" },
    buyingRequestSwitchTab: {
        text: "طلبات الشراء"
    },

    waitingtoSignContractTab: { role: "tab", name: "بانتظار توقيع العقد" },
    confirmBookingButton: {
        role: "button", name: "تأكيد الحجز"
    },
    approveSaleContractButton: {
        role: "button", name: "موافقة على العقد"
    },
    viewButton: {
        role: "button", name: "عرض"
    },

    waiverFeesSuccessfullyPaidMessage: {
        text: "تم دفع مبلغ التنازل بنجاح وتم إنشاء حجز جديد!"
    }

} as const