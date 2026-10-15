export const CreatingAnAdvertisingCampaignObjects = {
    advertisingCampaigntLink: {
        xpath: "//span[contains(text(),'الحملات الإعلانية')]"
    },
    newRequestButton: {
        role: "button", name: "طلب جديد"
    },
    whatsAppCheckbox: {
        xpath: "//div[(text()='واتساب')]"
    },
    smsCheckbox: {
        xpath: "//div[(text()='رسائل نصية')]"
    },
    emailCheckbox: {
        xpath: "//div[(text()='بريد إلكتروني')]"
    },
    InAppWebOrProomotionDropdDownButton: {
        xpath: "//div[(text()=' الترويج داخل التطبيق أو الويب ')]"
    },
    sakaniAppNotificationCheckbox: {
        xpath: "//div[(text()='إشعارات تطبيق سكني')]"
    },
    sakaniPlatformBannerCheckbox: {
        xpath: "//div[(text()='مساحة إعلانية في منصة سكني')]"
    },
    PopUpCheckbox: {
        xpath: "//div[(text()='الإعلانات المنبثقة')]"
    },
    directOutreachDropdownButton: {
        xpath: "//div[(text()=' التواصل المباشر ')]"
    },
    coldCallingCheckbox: {
        xpath: "//div[(text()='الاتصال البيعي')]"
    },
    nextButton: {
        role: "button", name: "التالي"
    },
    headingButton: {
        xpath: "(//div[@role='heading'])[2]"
    },
    campaignNameInputfield: {
        xpath: "//label[text()=' عنوان الحملة ']/parent::app-sapa-label-v2/following-sibling::div/descendant::input"
    },
    requestDescriptionTextarea: {
        xpath: "//label[text()=' وصف الطلب ']/parent::app-sapa-label-v2/following-sibling::div/descendant::textarea"
    },
    messageTitleInputfield: {
        xpath: "//label[text()=' عنوان الرسالة ']/parent::app-sapa-label-v2/following-sibling::div/descendant::input"
    },
    messageContentTextarea: {
        xpath: "//label[text()=' محتوى الرسالة ']/parent::app-sapa-label-v2/following-sibling::div/descendant::textarea"
    },
    smsContentTextarea: {
        xpath: "//label[text()=' نص الرسالة ']/parent::app-sapa-label-v2/following-sibling::div/descendant::textarea"
    },
    dateInputField: {
        xpath: "//label[text()=' التاريخ ']/parent::app-sapa-label-v2/following-sibling::div/input[1]"
    },

    emailTitleInputfield: {
        xpath: "//label[text()=' عنوان البريد الإلكتروني ']/parent::app-sapa-label-v2/following-sibling::div/descendant::input"
    },
    emailContectTextarea: {
        xpath: "//label[text()=' محتوى البريد الإلكتروني ']/parent::app-sapa-label-v2/following-sibling::div/descendant::textarea"
    },
    pannerContentTextarea: {
        xpath: "//label[text()=' موجز البنر / التعليمات ']/parent::app-sapa-label-v2/following-sibling::div/descendant::textarea"
    },
    popUpContentTextarea: {
        xpath: "//label[contains(text(),'موجز النافذة المنبثقة / التعليمات')]/parent::app-sapa-label-v2/following-sibling::div/descendant::textarea"
    },
    coldCallTextarea: {
        xpath: "//label[contains(text(),'نص الاتصال / التعليمات')]/parent::app-sapa-label-v2/following-sibling::div/descendant::textarea"
    },
    sendButton: {
        role: "button", name: "إرسال"
    },
    viewRequestButton: {
        role: "button", name: "عرض الطلب"
    },
    requestNumber: {
        xpath: "//label[contains(text(),'رقم الحملة')]/parent::app-sapa-label-v2/following-sibling::div"
    },
    //Sayal
    emailInput: {
        role: "textbox", name: "البريد الإلكتروني *"
    },
    passwordInput: {
        role: "textbox", name: "كلمة المرور *"
    },
    verificationCodeInput: {
        role: "textbox", name: "رمز التحقق *"
    },
    loginButton: {
        role: "button", name: "تسجيل الدخول"
    },
    campaignsLink: {
        role: "link", name: "الحملات"
    },
    campaignsTab: {
        role: "tab", name: "الحملات"
    },
    campaignSearchInput: {
        role: "textbox", name: "بحث"
    },
    campaignSearchButton: {
        role: "button", name: "بحث"
    },
    actionIconButton:{
        xpath:"(//div[@class='menuChildren'])[3]//*[local-name()='svg']"
    },
    rejectButton: {
        role: "menuitem", name: "رفض"
    },
    approveButton: {
        role: "menuitem", name: "قبول"
    },
    rejectionMessageInput: {
        role: "textbox", name: "ادخل نص الرسالة"
    },
    confirmButton: {
        role: "button", name: "تأكيد"
    },
    rejectionSuccessMessage: {
        text: "تم رفض الحملة بنجاح"
    },
    approvalSuccessMessage: {
        text: "تم الموافقة علي الحملة بنجاح"
    },
} as const;