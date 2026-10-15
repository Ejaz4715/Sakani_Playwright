export const UserManagementObjects = {
    userManagementLink: {
        role: "link", name: "إدارة المستخدمين"
    },
    usersFilter: { xpath: "//label[contains (text(), 'بحث بواسطة')]/ancestor::app-sapa-dropdown/descendant::ng-select", },
    iDNumberOption: {
        role: "option", name: "رقم الهوية"
    },
    idNumberInputfield: {
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
    deleteIconButton: {
        xpath: ".//span[contains(@class, 'icon-delete')]"
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
        xpath: "app-sapa-checkbox-v2"
    },
    registerButton: {
        role: "button", name: "التسجيل"
    },



} as const;