export const UserManagementObjects = {
    userManagementLink: {
        role: "link", name: "إدارة المستخدمين"
    },
    usersFilter: { xpath: "//label[contains (text(), 'بحث بواسطة')]/ancestor::app-sapa-dropdown/descendant::ng-select", },
    iDNumberOption: {
        xpath: "//div[@aria-label='Options List']/descendant::span[text()='رقم الهوية']"
    },
    idNumberInputfield: {
        xpath: "//label[text()=' رقم الهوية ']/parent::app-sapa-label-v2/following-sibling::div/input"
    },
    idNumberInputfieldPartners: {
        xpath: "//label[text()=' رقم الهوية']/parent::app-sapa-label/following-sibling::div/input"
    },
    searchButton: {
        role: "button", name: "بحث"
    },
    statusDropDownList: {
        xpath: "(//datatable-body-cell/descendant::ng-select)[1]"
    },
    statusOption: {
        role: "option", name: "تنشيط"
    },
    successActivationMessage: {
        xpath:"//span[text()='تم حفظ البيانات بنجاح']"
    },
    deleteIconButton: {
        xpath: "//span[contains(@class, 'icon-delete')]"
    },
    permissionEditButton:{
        xpath:"//span[contains(@class, 'icon-edit')]"
    },
    bookingsPermission:{
        xpath:"//span[contains(text(), 'إدارة الحجوزات')]"
    },
    mainPermissionsDropdownButton:{
        xpath:"//h3[text()=' شركة تطوير عقارية ']/parent::div//span[contains(text(), 'صلاحيات الخدمات الأساسية')]"
    },
    bookingsManagementPermissionSwitchButton:{
        xpath:"//span[(text()= ' الحجوزات ')]/parent::div/following-sibling::div/descendant::button"
    },
    acceptButton:{
        xpath:"//button[text()=' قبول ']"
    },
    userDeletedMessage:{
        xpath:"//h3[text()='تم حذف المستخدم بنجاح']"
    },

    individualRadioButton: {
        xpath: "//app-ui-select-card[2]"
    },
    companyRepresentativeRadioButton: {
        xpath: "//app-ui-select-card[2]"
    },
    crNumberInputfield: {
        xpath: "//label[text()=' رقم السجل التجاري ']/parent::app-sapa-label-v2/following-sibling::div/input"
    },
    emailInputfield: {
        xpath: "//label[text()=' البريد الإلكتروني ']/parent::app-sapa-label-v2/following-sibling::div/input"
    },
    phoneNumberInputfield: {
        xpath: "//label[text()=' رقم الجوال ']/parent::app-sapa-label-v2/following-sibling::div/descendant::input"
    },
    termsAndConditionsCheckbox: {
        xpath: "//app-sapa-checkbox-v2"
    },
    continueButton: {
        xpath:"//button/span[text()='المتابعة']"
    },
    registerButton: {
        xpath:"//button/span[text()='التسجيل']"
    },
    goToDashboardButton:{
        xpath:"//button/span[text()=' انتقل إلى لوحة المعلومات ']"
    },
    failToLoginMessage:{
        xpath:"//h2[text()=' فشل في عملية الدخول ']"
    },
} as const;