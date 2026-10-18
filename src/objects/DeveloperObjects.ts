export const DeveloperObjects = {
  usernameInput: {
    role: 'textbox',
    name: 'أدخل معرفك أو رقم هاتفك أو بريدك الإلكتروني',
  },
  nafathModel: '//app-nafath-login-modal',
  continueButton: {
    role: 'button',
    name: 'المتابعة',
    exact: true,
  },
  profileIcon: '.svg-icon.svg-icon-v2-24.icon-profile-white-v2',
  switchRoleButton: {
    role: 'button',
    name: 'التبديل إلى',
  },
  developerRoleText: 'شركة تطوير عقارية',
  menuIcon: '.svg-icon.svg-icon-v2-24.icon-menu-v2',
  verifyOTPButton: {
    role: 'button',
    name: 'تحقق',
  },
  otpDigitInput: {
    role: 'spinbutton',
    name: 'X',
  },
  confirmAndContinueButton: {
    role: 'button',
    name: 'تأكيد ومتابعة',
  },
  goToDashboardButton: {
    role: 'button',
    name: 'انتقل إلى لوحة المعلومات',
  },
  projectsLink: {
    role: 'link',
    name: 'المشاريع',
  },
  projectFilter: "//label[contains (text(), 'بحث بواسطة')]/ancestor::app-sapa-dropdown/descendant::ng-select",
  projectNameOption: {
    role: 'option',
    name: 'اسم المشروع',
  },
  projectSearchInput: 'app-project-search',
  searchButton: {
    role: 'button',
    name: 'بحث',
  },
  passwordEyeIcon: '.pointer.icon-password-show',
  paymentScheduleTab: {
    role: 'tab',
    name: /جداول الدفع/,
  },
  addScheduleButton: {
    role: 'button',
    name: /إضافة جدول جديد/,
  },
  cashOption: 'نقدي',
  lendingOption: 'التمويل',
  scheduleNameInput: {
    role: 'textbox',
    name: 'مثال: سبع دفعات',
  },
  confirmButton: {
    role: 'button',
    name: 'تأكيد',
  },
  confirmButtonPopup: "//app-sapa-modal-popup-v2/descendant::button[text() =' تأكيد ']",
  updateButton: {
    role: 'button',
    name: 'تحديث',
  },
  salesContractsTab: {
    role: 'tab',
    name: 'عقود البيع',
  },
  viewAndApproveButton: {
    role: 'button',
    name: 'عرض و اعتماد',
  },
  addUnitSpecificationButton: "//button[contains(text(), 'إضافة مواصفات الوحدة')]/following-sibling::button[contains(text(), 'اعتماد')]",
  otpInput: '//app-sapa-otp-verification//input',
  verifyCodeButton: {
    role: 'button',
    name: 'التحقق من الرمز',
  },
  addAnnexButton: {
    role: 'button',
    name: 'إضافة ملحق',
  },
  unitCodeInput: {
    role: 'textbox',
    name: 'رمز الوحدة',
  },
  addAnnexToSelectedUnitsButton: {
    role: 'button',
    name: 'إضافة ملحق للوحدات المختارة',
  },
  uploadButton: {
    role: 'button',
    name: 'رفع',
  },
  approveButton: {
    role: 'button',
    name: 'اعتماد',
  },
  annexSuccessMessage: 'عزيزي الشريك ، لقد نجحت في إضافة الملحق إلى الوحدات المختارة',
  approvalSuccessMessage: 'عزيزي الشريك، لقد قمت بإضافة الملحق وتوقيع العقد بنجاح',
  approvalModal: 'app-sapa-modal',
  completionPercentageOne: '#completion_percentage_0',
  percentageOne: '#percentage_0',
  completionPercentageTwo: '#completion_percentage_1',
  percentageTwo: '#percentage_1',
  successfulBookingConfirmationMessage: "//p[contains(text(),' تم تأكيد الحجز بنجاح!')]",
  closeConfirmationModal: "app-sapa-modal button[title='Close']",
  companiesButton: "//a[contains(text(),'شركات')]",
  manageReservationsButton: "//span[contains(text(),' إدارة الحجوزات')]/../..",
  individualBooking: "//span[contains(text(),'الحجوزات الفردية')]/../..",
  newBookingButton: "//span[contains(text(),' حجز جديد ')]/..",
  nationalIdentityField: "//label[contains(text(),' رقم الهوية ')]/../..//input",
  nextButton: "//button[contains(text(), 'التالي')]",
  projectNameField: "(//input[@aria-autocomplete='list'])[1]",
  projectNameOptionSelector: "div[role='listbox'] span",
  confirmBookingButton: "//button[contains(text(), ' تأكيد ')]",
  bookingListButton: "//button[contains(text(),'عرض قوائم الحجز')]",
  companyBookings: "//span[contains(text(),'حجوزات الشركة')]/../..",
  companyCRField: "//h5[contains(text(),' البحث عن شركة')]/../..//input",
  companyUserId: "//h5[contains(text(),'ممثل الشركة')]/../..//input",
  continueBookingButton: "//button[contains(text(),' مواصلة الحجز')]",
  bankSelector: "app-bank-list-dropdown-control input[role='combobox']",
  crmBankSelector: "//span[contains(text(),'CRM Bank Test')]",
  confirmCompanyBooking: "//span[contains(text(),'تأكيد')]/..",
  showBookingDetailsButton: "//button[contains(text(),'عرض التفاصيل')]",
  cancelButtonOnPopUp: {
    role: 'button',
    name: 'إلغاء',
  },
  showFirstProjectDetails: 'datatable-selection datatable-body-row:nth-child(1) .pointer.icon-password-show',
  unitCodeTextfield: '.input-icon-container input',

  // Unit reservation
  unitCheckbox(row: number) {
    return `//datatable-row-wrapper[${row}]/descendant::app-sapa-checkbox-v2`;
  },
  contiueBookingButton: "//button[normalize-space() = 'مواصلة الحجز']",
  selectAnotherUnitButton: "//button[normalize-space() = 'حدد وحدة أخرى']",
  bankDropdown: '//app-bank-list-dropdown-control/descendant::input',
  bankOptions(bankName: string) {
    return `//div[@role='option']/descendant::span[normalize-space() = '${bankName}']`;
  },
  selectAndContinueButton: {
    role: 'button',
    name: /^\s*التحديد والاستمرار\s*$/,
  },
  reservationSuccessPopup: "//span[normalize-space() = 'تأكيد الحجز']",
  bookingSearchInput: {
    role: 'textbox',
    name: 'ابحث برمز الوحدة أو رقم الهوية',
  },
  bookingFilterStatusDropdown: "//div[normalize-space() = 'الحالة']/ancestor::app-sapa-dropdown-v2",
  bookingFilterStatusOptions(option: string) {
    return `//div[@role='option']/descendant::span[normalize-space() = '${option}']`;
  },
  viewBookingDetails: "(//span[normalize-space() = 'إظهار التفاصيل'])[1]",
  bookingsTab: {
    role: 'tab',
    name: 'حجوزات',
  },
  confirmBookingActionButton: {
    role: 'button',
    name: 'تأكيد الحجز',
  },
  yesConfirmationButton: {
    role: 'button',
    name: 'نعم',
  },
  confirmBookingSuccessText: 'تهانينا!',
  cancelBookingReasonDropdown: '//app-sapa-dropdown-v2/descendant::input',
  cancelBookingReasonOption(option: string) {
    return `//div[@role='option']/descendant::span[normalize-space() = '${option}']`;
  },
  //---------End of unit reservation objects ----------

  // Generate reports objects
  reportsLink: {
    role: 'link',
    name: 'التقارير',
  },
  reportTypeDropdown: {
    xpath: "//label[text()=' حدد نوع التقرير']/ancestor::app-sapa-dropdown/descendant::ng-select",
  },
  bookingsAndUnitsReportOption: {
    role: 'option',
    name: 'الحجوزات والوحدات',
  },
  issueTheReportButton: {
    role: 'button',
    name: 'إصدار التقرير',
  },
  issueReportButton: {
    role: 'button',
    name: 'إصدار تقرير',
  },
  reportAddedToastMessage: 'تمت إضافة التقرير',
  projectSearchInputFieldForReport: {
    role: 'textbox',
    name: 'بحث عن مشروع',
  },
  projectResult: {
    xpath: "//label[@class='form-check-label']",
  },
  downloadButton: {
    xpath: "(//button[text()=' تحميل '])[1]",
  },
  status: {
    xpath: '(//datatable-body-cell)[3]/descendant::span',
  },
  selectedPaymentMethodCash: {
    xpath: "//datatable-body-cell/descendant::span[contains(text(), 'Cash')]/following-sibling::span[contains(text(), 'محدد')]",
  },
  selectedPaymentMethodLending: {
    xpath: "//datatable-body-cell/descendant::span[contains(text(), 'Lending')]/following-sibling::span[contains(text(), 'محدد')]",
  },
} as const;
