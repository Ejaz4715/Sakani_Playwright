export const LoyaltyAdminDealsObjects = {
  officeNameDropdown:
    "//app-nsar-dropdown[@formcontrolname='promoter_id']//input[@role='combobox']",
  dropdownOption: {
    role: 'option'
  },
  statusDropdown:
    "//app-nsar-dropdown[@formcontrolname='status']",
  campaignStartDateCalendarIcon:
    "//app-gregorian-datepicker[@formcontrolname='campaign_start_date']//div[contains(@class,'input-icon-container')]/*[contains(@class,'icon')]",
  campaignEndDateCalendarIcon:
    "//app-gregorian-datepicker[@formcontrolname='offer_expired_at']//div[contains(@class,'input-icon-container')]/*[contains(@class,'icon')]",
  calendarDay: {
    role: 'gridcell'
  },
  calendarNextMonthButton: {
    role: 'button', name: 'Next month'
  },
  calendarPreviousMonthButton: {
    role: 'button', name: 'Previous month'
  },
  dealTitleField:
    "//textarea[@formcontrolname='title']",
  dealDescriptionField:
    "//textarea[@formcontrolname='description']",
  dealDetailsField:
    "//textarea[@formcontrolname='details']",
  uploadFilesComponent:
    "lib-sakani-upload-files",
  dealImageUploadText:
    "أضف ملف (.png .jpeg .jpg)",
  dealPdfUploadText:
    "أضف ملف (.pdf)",
  fileInput:
    "input[type='file']",
  fileStorageUrl:
    "pre-sakani-uploaded-files-temp",
  dealCompanyHeading: {
    role: 'heading'
  },
  recordOfficeNameField:
    "//app-nsar-dropdown[@formcontrolname='promoter_id']",
  recordStatusField:
    "//app-nsar-dropdown[@formcontrolname='status']",
  backToListLink:
    "الرجوع للقائمة",
  dealsListRow: {
    role: 'row'
  },
  editDealInList:
    "تعديل",
  activeStatus:
    "نشط",
  inactiveStatus:
    "غير نشط",
  dealStatusCell:
    /^(نشط|غير نشط)$/,
  deleteModal:
    "app-basic-modal",
  modalCancelButton: {
    role: 'button', name: 'إغلاق'
  },
  modalConfirmButton: {
    role: 'button', name: 'تأكيد'
  },
  filterForm:
    "form",
  filterDropdown:
    "ng-select",
  filterSearchTextbox: {
    role: 'textbox', name: 'بحث'
  },
  filterSelectedValue:
    ".ng-value",
  filterSearchButton: {
    role: 'button', name: 'بحث', exact: true
  },
  filterResetButton: {
    role: 'button', name: 'اعاده تعيين'
  },
} as const;
