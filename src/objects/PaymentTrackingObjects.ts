export const PaymentTrackingObjects = {
    paymntTrackingTab: {
        xpath: "//span[contains(text(),'تتبع الدفع')]"
    },
    unitCodeInputfield: {
        xpath: "//input[@formcontrolname='unit_code']"
    },
    searchButton: {
        xpath: "//button/span[contains(text(),'بحث')]"
    },
    searchedUnit: {
        xpath: "(//div[@class='datatable-body-cell-label']/span)[2]"
    },
    competionPercentage: {
        xpath: "//div[contains(text(),'نسبة الإنجاز')]"
    },
    specifiedPeriod: {
        xpath: "//div[contains(text(),'وقت محدد')]"
    },
    beneficiariesSideMenu: {
        xpath: "//div[text()='المستفيدين']"
    },
    beneficiariesListSideMenu: {
        xpath: "//div[text()=' قائمة المستفيدين ']"
    },
    searchByDropdownList: {
        xpath: "//app-beneficiaries-list/descendant::div[text()='البحث بواسطة']/ancestor::ng-select"
    },
    searchedOption: {
        role: "option", name: 'رقم عقد الدعم السكني'
    },
    searchUnitInputfield: {
        xpath: "//input[@formcontrolname='search__match']"
    },
    searchButtonForUnit: {
        xpath: "//button[contains(text(),'بحث')]"
    },
    searchedresult: {
        xpath: "//datatable-body-row"
    },
    bookingDetailsTab: {
        xpath: "//a[contains(text(),'تفاصيل الحجوزات')]"
    },
} as const