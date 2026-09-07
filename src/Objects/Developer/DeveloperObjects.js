const DeveloperObjects = {
  usernameInput: {
    role: "textbox",
    name: "أدخل معرفك أو رقم هاتفك أو بريدك الإلكتروني",
  },
  continueButton: { role: "button", name: "المتابعة", exact: true },
  profileIcon: ".svg-icon.svg-icon-v2-24.icon-profile-white-v2",
  switchRoleButton: { role: "button", name: "التبديل إلى" },
  developerRoleText: "شركة تطوير عقارية",
  menuIcon: ".svg-icon.svg-icon-v2-24.icon-menu-v2",
  projectsLink: { role: "link", name: "المشاريع" },
  projectFilter:
    "//label[contains (text(), 'بحث بواسطة')]/ancestor::app-sapa-dropdown/descendant::ng-select",
  projectNameOption: { role: "option", name: "اسم المشروع" },
  projectSearchInput: "app-project-search",
  searchButton: { role: "button", name: "بحث" },
  passwordEyeIcon: ".pointer.icon-password-show",
  paymentScheduleTab: { role: "tab", name: /جداول الدفع/ },
  addScheduleButton: { role: "button", name: /إضافة جدول جديد/ },
  cashOption: "نقدي",
  lendingOption: "التمويل",
  scheduleNameInput: { role: "textbox", name: "مثال: سبع دفعات" },
  confirmButton: { role: "button", name: "تأكيد" },
  confirmButtonPopup:
    "//app-sapa-modal-popup-v2/descendant::button[text() =' تأكيد ']",
  updateButton: { role: "button", name: "تحديث" },
  salesContractsTab: { role: "tab", name: "عقود البيع" },
  viewAndApproveButton: { role: "button", name: "عرض و اعتماد" },
  addUnitSpecificationButton:
    "//button[contains(text(), 'إضافة مواصفات الوحدة')]/following-sibling::button[contains(text(), 'اعتماد')]",
  otpInput: "//app-sapa-otp-verification//input",
  verifyCodeButton: { role: "button", name: "التحقق من الرمز" },
  addAnnexButton: { role: "button", name: "إضافة ملحق" },
  unitCodeInput: { role: "textbox", name: "رمز الوحدة" },
  addAnnexToSelectedUnitsButton: {
    role: "button",
    name: "إضافة ملحق للوحدات المختارة",
  },
  uploadButton: { role: "button", name: "رفع" },
  approveButton: { role: "button", name: "اعتماد" },
  annexSuccessMessage:
    "عزيزي الشريك ، لقد نجحت في إضافة الملحق إلى الوحدات المختارة",
  approvalSuccessMessage:
    "عزيزي الشريك، لقد قمت بإضافة الملحق وتوقيع العقد بنجاح",
  approvalModal: "app-sapa-modal",
  completionPercentageZero: "#completion_percentage_0",
  percentageZero: "#percentage_0",
  completionPercentageOne: "#completion_percentage_1",
  percentageOne: "#percentage_1",
};

module.exports = { DeveloperObjects };
