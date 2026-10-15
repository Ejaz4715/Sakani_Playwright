export const AdminObjects = {
  loginUsernameInput: 'input[type="text"]',
  loginPasswordInput: 'input[type="password"]',
  loginButton: {
    role: "button",
    name: "تسجيل الدخول",
  },
  otpInput: "//app-sakani-otp//input[@type='text']",
  otpConfirmButton: {
    role: "button",
    name: "تأكيد",
  },
  internalInventoryLink: {
    selector: "a",
    hasText: "المخزون الداخلي",
  },
  projectsLink: {
    role: "link",
    name: "المشاريع",
  },
  resaleRequestsLink: {
    role: "link",
    name: " طلب إعادة البيع ",
  },
  addNewProjectButton: {
    role: "button",
    name: "إضافة مشروع جديد",
  },
  auctionsLink: {
    selector: "a",
    hasText: "المزادات",
  },
  auctionProjectsLink: {
    role: "link",
    name: "مشاريع المزاد",
  },
  newAuctionProjectButton: {
    role: "button",
    name: "مشروع مزاد جديد",
  },
  financialInstitutesLink: {
    role: "link",
    name: "المؤسسات التمويلية",
  },
  voucherManagementLink: {
    role: "link",
    name: "إدارة عروض سكني",
  },
  regionSelectCombobox: {
    role: "combobox",
  },
  genericOption: {
    role: "option",
    exact: true,
  },
  projectNameField: {
    container: "form-field-component",
    label: "إسم المشروع *",
    placeholder: "إسم المشروع",
  },
  projectTypeDropdown:
    "//mat-select[@formcontrolname='project_type']",
  async projectTypeOption(text: string) {
    return `//mat-option/child::span[normalize-space() ='${text}']`;
  },
  regionDropdown:
    "//ng-select[@formcontrolname='region_id']",
  async regionOption(text: string) {
    return `//div[@role='option']/child::span[normalize-space() ='${text}']`;
  },
  cityDropdown:
    "//input[@id='inputCity']",
  async cityOption(text: string) {
    return `//mat-option/child::span[normalize-space() ='${text}']`;
  },
  developerInput:
    "//input[@id='inputDeveloper']",
  async developerOption(text: string) {
    return `//mat-option/child::span[normalize-space() ='${text}']`;
  },
  bookableSwitch: {
    role: "switch",
    name: "قابل للحجز؟",
  },
  statusDropdown:
    "//mat-select[@formcontrolname='status']",
  async projectStatusOption(text: string) {
    return `//mat-option/child::span[normalize-space() ='${text}']`;
  },
  wafiExpiryDate: {
    role: "textbox",
    name: "تاريخ انتهاء رخصة البيع في وافي",
  },
  subsidyTypeDropdown:
    "//mat-select[@formcontrolname='subsidy_type']",
  async subsidyTypeOption(text: string) {
    return `//mat-option/child::span[normalize-space() ='${text}']`;
  },
  maxSubsidyAmountField:
    "//input[@formcontrolname='max_subsidy_amount']",
  projectAgreementDate: {
    role: "textbox",
    name: "تاريخ توقيع الاتفاقيه للمشروع",
  },
  projectLicenseNumber: {
    role: "textbox",
    name: "رقم ترخيص المشروع",
  },
  projectLicenseDate: {
    role: "textbox",
    name: "تاريخ ترخيص المشروع",
  },
  escrowAccountName: {
    role: "textbox",
    name: "اسم حساب الضمان",
  },
  escrowAccountNumber: {
    role: "textbox",
    name: "رقم حساب الضمان",
  },
  bankDropdown:
    "//app-nsar-dropdown[@formcontrolname='bank_name']/descendant::ng-select",
  async bankOption(text: string) {
    return `//div[@role = 'option']/descendant::span[normalize-space() ='${text}']`;
  },
  deductionPercentageField:
    "//input[@formcontrolname='deduct_percentage']",
  deedIssueCityArabic: {
    role: "textbox",
    name: "المدينة المصدر منها الصك (بالعربية)",
  },
  deedIssueCityEnglish: {
    role: "textbox",
    name: "المدينة المصدر منها الصك (بالإنجليزية)",
  },
  deedDate: {
    role: "textbox",
    name: "DD/MM/YYYY",
  },
  saveButton: {
    role: "button",
    name: "حفظ",
  },
  saveSuccessToast: "//app-toasts",
  saveSuccessMessage: {
    text: "تم الحفظ بنجاح!",
  },
  financialInstituteArabicNameInput:
    "//input[@formcontrolname='name']",
  financialInstituteEnglishNameInput:
    "//input[@formcontrolname='name_en']",
  financialInstituteRealNameInput:
    "//input[@formcontrolname='realname']",
  financialInstituteSavedToast:
    "//simple-snack-bar/child::div",
  financialInstituteNameCell(text: string) {
    return `//datatable-body-cell[2]/descendant::span[normalize-space() = '${text}']`;
  },
  financialInstitutesNextPageButton: {
    role: "button",
    name: "التالى",
  },
  azmToggle:
    "//label[contains (text(), 'AZM')]/preceding-sibling::button",
  financingEntitiesHeading: {
    text: /قائمة الجهات التمويلية/i,
  },
  financialEntitiesBankNameCell(text: string) {
    return `//datatable-body-cell[3]/descendant::span[normalize-space() = '${text}']`;
  },
  selectAllRowsCheckbox: {
    role: "checkbox",
    name: "Select all rows",
  },
  banksCheckboxesValue: {
    xpath: "//datatable-body-row"
  },
  unitsTab: {
    role: "tab",
    name: "الوحدات",
    exact: true,
  },
  importNewUnitButton: {
    role: "button",
    name: "استيراد وحدة جديدة",
  },
  residentialUnitType: {
    role: "combobox",
    name: "نوع الوحدة السكنية",
  },
  apartmentOption: {
    role: "option",
    name: "شقة",
  },
  unitsFileInput: "//input[@type='file']",
  importSaveButton: {
    role: "button",
    name: " حفظ",
  },
  importInProgressMessage:
    "//div[text() = 'الرمز المرجعي للعملية']",
  importCompleteMessage: {
    text: "تم الاستيراد بواسطة",
  },
  approveButton: {
    role: "button",
    name: "اعتماد",
  },
  confirmButton: {
    role: "button",
    name: "موافق",
  },
  backButton: {
    role: "button",
    name: "رجوع",
  },
  visualContentTab: {
    selector: "span",
    text: /المحتوى المرئي/i,
  },
  bannerImageInput:
    "//h1[contains (text(), 'الصورة الإعلانية')]/parent::div/following-sibling::div/child::input[@type='file']",
  masterPlanImageInput:
    "//h1[contains (text(), 'ملف المخطط الرئيسي ')]/parent::div/following-sibling::div/child::input[@type='file']",
  aerialImageInput:
    "//h1[contains (text(), 'صورة العر')]/parent::div/following-sibling::div/child::input[@type='file']",
  uploadButton:
    "//mat-icon[contains (text(), 'file_upload')]",
  displayMethodDropdown: {
    selector: "div",
    text: /^Display method$/,
  },
  async displayMethodOption(text: string) {
    return `//div[@role='option']/child::span[normalize-space()='${text}']`;
  },
  detailsTitleArabic: {
    role: "textbox",
    name: "عنوان صفحة التفاصيل (باللغة العربية)",
  },
  detailsTitleEnglish: {
    role: "textbox",
    name: "عنوان صفحة التفاصيل (باللغة الإنجليزية)",
  },
  firstUnitReadyDate: {
    role: "textbox",
    name: "تاريخ جهوزية أول وحدة",
  },
  nameArabic: {
    role: "textbox",
    name: "الاسم (باللغة العربية)",
  },
  nameEnglish: {
    role: "textbox",
    name: "الاسم (باللغة الإنجليزية)",
  },
  summaryArabic: {
    role: "textbox",
    name: "الملخص AR",
  },
  summaryEnglish: {
    role: "textbox",
    name: "ملخص EN",
  },
  descriptionArabic: {
    role: "textbox",
    name: "الوصف (باللغة العربية)",
  },
  descriptionEnglish: {
    role: "textbox",
    name: "الوصف (باللغة الإنجليزية)",
  },
  startingPrice: {
    role: "textbox",
    name: "السعر يبدأ من",
  },
  latitude: {
    role: "spinbutton",
    name: "خط العرض",
  },
  longitude: {
    role: "spinbutton",
    name: "خط الطول",
  },
  uploadStatus:
    "//button[contains (@class, 'uploadStatus')]",
  guarenteeAfterServices:
    "//input[@formcontrolname='guarantees_after_service']",
  mediaSaveButton:
    "#save_btn",
  projectDetailsTab: {
    role: "tab",
    name: "تفاصيل المشروع",
  },
  projectDetailsText: {
    text: "تفاصيل المشروع",
  },
  requestMediaApprovalButton: {
    role: "button",
    name: "تقديم طلب موافقة على نشر المحتوى المرفوع",
  },
  acceptUploadedMediaButton: {
    role: "button",
    name: "قبول المحتوى المرئي المرفوع",
  },
  keepProjectUnpublishedButton: {
    role: "button",
    name: "إبقاء المشروع غير منشور",
  },
  unitModelsSection: {
    text: "نماذج الوحدات",
  },
  unitModelCell: {
    role: "cell",
    name: "model_1",
  },
  mediaDraftSection: {
    text: "المحتوى المرئي ( مسودة )",
  },
  publishUnitButton: {
    role: "button",
    name: "وحدة النشر",
  },
  unitModelLink: {
    selector: "a",
    text: /^model_\d+/,
  },
  projectStatusAvailableOption: {
    role: "option",
    name: "متاح",
  },
  mediaApprovalText: {
    role: "tab",
    name: "تمت الموافقة",
  },
  completionPercentageSwitch: {
    role: "switch", name: "إظهار نسبة الإنجاز"
  },
  completionPercentageValue: {
    xpath: "//mat-slide-toggle[@formcontrolname='completion_percentage_visible']/descendant::button"
  },
  partnerLink: {
    selector: "a",
    hasText: "شريك",
  },
  neighbourGreetingLink: {
    selector: "a",
    hasText: "تحية الجار",
  },

  //Admin - list or real estate brokers and developers
  realEstateDevelopersLink: {
    role: "link",
    name: "شركات التطوير العقارية",
  },
  devloperNameInputField: {
    xpath: "//input[@placeholder='اسم المطور']"
  },
  devloperNameResult: {
    xpath: "//datatable-body-cell[2]",
    exact: true,
  },
  developerInformationPage: {
    xpath: "//app-page-header/descendant::p"
  },
  developarContactInofSwitch: {
    role: "switch", name: "إظهار معلومات الاتصال"
  },
  developarContactInofValue: {
    xpath: "//mat-slide-toggle[@formcontrolname='show_contact_information']/descendant::button"
  },
  developerPhoneNumberInputfiled: {
    xpath: "//app-phone-input/descendant::input"
  },
  bookingAvailableToggle:
    "//label[contains (text(), 'قابل للحجز')]/preceding-sibling::button",
  projectPublishedToggle:
    "//label[contains (text(), 'هل تم نشر المشروع')]/preceding-sibling::button",
  rightTabArrow:
    "//mat-icon[contains (text(), 'chevron_right')]",
} as const;
