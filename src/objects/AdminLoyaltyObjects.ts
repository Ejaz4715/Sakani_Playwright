export const AdminLoyaltyObjects = {
  loyaltyProgramLink: {
    selector: 'a',
    text: 'برنامج شراي',
  },
  managePartnersLink: {
    role: 'link',
    name: 'إدارة الشركاء',
  },
  addPartnerLink: {
    role: 'link',
    name: 'إضافة شريك جديد',
  },
  companyNameInput: '//input[@formcontrolname="company_name"]',
  activityInput: "//input[@formcontrolname='activity']",
  isActiveDropdown: "//app-nsar-dropdown[@formcontrolname='is_active']",
  dropdownOption: '//ng-dropdown-panel/descendant::span',
  contactPersonInput: "//input[@formcontrolname='contact_person']",
  contactEmailInput: "//input[@formcontrolname='contact_email']",
  contactPhoneInput: "//app-phone-input[@formcontrolname='contact_phone']/descendant::input",
  contactWhatsappInput: "//app-phone-input[@formcontrolname='contact_whatsapp']/descendant::input",
  ibanInput: "//input[@formcontrolname='iban_number']",
  bankAccountNameInput: "//input[@formcontrolname='bank_account_name']",
  fileInput: "//input[@type='file']",
  saveButton: {
    role: 'button',
    name: 'حفظ',
  },
  partnerAddedSuccessMessage: 'تمت إضافة الشريك الجديد بنجاح',
  manageDealsLink: {
    role: 'link',
    name: 'إدارة الصفقات',
  },
  addNewOfferLink: {
    role: 'link',
    name: 'إضافة عرض جديد',
  },
  companyNameDropdown: "//app-nsar-dropdown[@formcontrolname='promoter_id']",
  campaignStartDateInput: "//app-gregorian-datepicker[@formcontrolname='campaign_start_date']/descendant::input",
  campaignEndDateInput: "//app-gregorian-datepicker[@formcontrolname='offer_expired_at']/descendant::input",
  priceInput: "//input[@formcontrolname='price']",
  discountInput: "//input[@formcontrolname='discount']",
  acceptableQuantityInput: "//input[@formcontrolname='acceptable_quantity_per_user']",
  sakaniCommissionTypeDropdown: "//app-nsar-dropdown[@formcontrolname='sakani_commission_type']",
  sakaniCommissionValueInput: "//input[@formcontrolname='sakani_commission_value']",
  titleInput: "//input[@formcontrolname='title']",
  descriptionInput: "//input[@formcontrolname='description']",
  detailsInput: "//input[@formcontrolname='details']",
  termsAndConditionsRegion: {
    role: 'region',
    name: 'الشروط و الأحكام',
  },
  termsTextarea: 'textarea',
  dealIdentifiersTab: {
    role: 'tab',
    name: 'الرموز التعريفية للصفقة',
  },
  importOfferCodesButton: {
    role: 'button',
    name: 'استيراد رموز العروض',
  },
  importToastMessage: /استيراد/,
  processedStatusCell: {
    role: 'cell',
    name: 'تم إكمال الإجراء',
  },
  approveButton: {
    role: 'button',
    name: 'اعتماد',
  },
  confirmButton: {
    role: 'button',
    name: 'موافق',
  },
  importApprovalRequestText: 'إرسال طلب اعتماد الاستيراد',
  searchInput: {
    role: 'textbox',
    name: 'بحث',
  },
  searchButton: {
    role: 'button',
    name: 'بحث',
  },
  searchResultContainer: 'div',
  editButton: {
    role: 'button',
    name: 'تعديل',
  },
  statusDropdown: {
    selector: 'ng-select',
    text: 'اختيارغير نشط',
  },
  statusDropdownCombobox: {
    role: 'combobox',
  },
  activeStatusOption: {
    role: 'option',
    name: 'نشط',
    exact: true,
  },
  yesButton: {
    role: 'button',
    name: 'نعم',
  },
  activeStatusTable: {
    role: 'table',
  },
  activeStatusText: 'نشط',
} as const;
