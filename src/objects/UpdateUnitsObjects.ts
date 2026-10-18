export const UpdateUnitsObjects = {
  unitDetailsTab: {
    role: "tab",
    name: "تفاصيل الوحدات",
  },
  unitSearchCriteria:
    "//label[normalize-space() = 'بحث بواسطة']/ancestor::app-sapa-dropdown/descendant::ng-select",
  optionsList: {
    role: "listbox",
    name: "Options List",
  },
  unitCodeOption: {
    text: "رمز الوحدة",
  },
  unitCodeInput: {
    role: "textbox",
  },
  searchButton: {
    role: "button",
    name: "بحث",
  },
  unitRows:
    "datatable-body-row",
  updateUnitStatusLink: {
    role: "link",
    name: "تحديث حالة الوحدات",
  },
  pilotLaunchButton: {
    role: "button",
    name: "إطلاق تجريبي",
  },
  uploadInput:
    "//input[@type='file']",
  analyzeFileButton: {
    role: "button",
    name: "تحليل الملف",
  },
  firstAnalysisResult:
    "(//datatable-body-row[1]//datatable-body-cell[4]//span)[1]",
  approveButton: {
    role: "button",
    name: "أعتماد",
  },
  confirmationDialog: {
    role: "dialog",
  },
  approvalSuccessMessage:
    "تم إعتماد الوحدات بنجاح",
  successCheckmark:
    ".icon-checkmark",
  UpdaterejectedMessage:
    "//div[contains (text(), 'Unit should not be booked')]",
  confirmYesButton: {
    role: "button",
    name: "نعم",
  },
  unitPricesFields:
    ".sar-currency",
  downloadUnitPricesButton: {
    role: "button",
    name: "تحميل أسعار الوحدات",
  },
  updateUnitPricesButton: {
    role: "button",
    name: "تحديث أسعار الوحدات",
  },
  updateUnitPricesFileInput:
    "#file",
  updatePricesButton: {
    role: "button",
    name: "تحديث",
  },
  priceAnalysisDetailsContainer:
    "//app-project-update-unit-prices-detail",
  addUnitAnalysisContainer:
    "//app-project-add-units-detail",
  deleteUnitAnalysisContainer:
    "app-project-remove-units-detail",
  priceAnalysisDetailsText:
    "معلومات التحليل",
  confirmUnitPriceUpdateButton: {
    role: "button",
    name: "تأكيد",
  },
  unitPriceWorkbook: {
    sheetName: "Project Units Prices",
    unitCodeColumn: "Product Code|Product Number",
    marketPriceColumn: "Market Price",
    priceColumns: [
      "Market Price",
      "MOH Price",
      "MOH Price Base Land  Price",
      "MOH Price Base Building Price",
      "Building Market Price",
      "Land Market Price",
    ],
  },
  manageProjectButton: {
    role: "button",
    name: "إدارة المشروع"
  },
  manageProjectOptions(option: string) {
    return `//button[normalize-space() = '${option}']`;
  },
  unitTypeDropdown: 
  "//label[normalize-space() = 'نوع الوحدة']/ancestor::app-sapa-dropdown/descendant::ng-select",
  apartmentUnitTypeOption:{
    role: "option", 
    name: "شقة"
  },
  addUnitFileButton: {
    role : "button",
    name: "أضف"
  },
  deleteButton: {
    role : "button",
    name: "حذف"
  }
} as const;