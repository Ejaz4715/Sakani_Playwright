export const UpdateUnitsObjects = {
  unitDetailsTab: {
    role: "tab",
    name: "تفاصيل الوحدات",
  },
  unitSearchCriteria: "//label[normalize-space() = 'بحث بواسطة']/ancestor::app-sapa-dropdown/descendant::ng-select",
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
  unitRows: "datatable-body-row",
  updateUnitStatusLink: {
    role: "link",
    name: "تحديث حالة الوحدات",
  },
  pilotLaunchButton: {
    role: "button",
    name: "إطلاق تجريبي",
  },
  uploadInput: "//input[@type='file']",
  analyzeFileButton: {
    role: "button",
    name: "تحليل الملف",
  },
  firstAnalysisResult: "(//datatable-body-row[1]//datatable-body-cell[4]//span)[1]",
  approveButton: {
    role: "button",
    name: "أعتماد",
  },
  confirmationDialog: {
    role: "dialog",
  },
  approvalSuccessMessage: "تم إعتماد الوحدات بنجاح",
  successCheckmark: ".icon-checkmark",
  UpdaterejectedMessage: "//div[contains (text(), 'Unit should not be booked')]",
  confirmYesButton: {
    role: "button",
    name: "نعم",
  },
} as const;