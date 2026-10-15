export const VoucherManagementObjects = {
  addVoucherButton: {
    role: "button",
    name: "إضافة عرض",
  },
  voucherNameInput: "//input[@formcontrolname='name']",
  voucherLimitInput: "//input[@formcontrolname='voucher_limit']",
  voucherDescriptionInput: "//textarea[@formcontrolname='description']",
  voucherImageInput: "//input[@type = 'file']",
  regionSelect: "//app-region-select-form",
  regionOption: {
    role: "option",
  },
  citySelect: "app-city-select-form",
  cityOption: {
    role: "option",
  },
  saveButton: {
    role: "button",
    name: "حفظ",
  },
  voucherCell: {
    role: "cell",
  },
  editButton: {
    role: "button",
    name: "تعديل",
  },
  deleteButton: {
    role: "button",
    name: "حذف",
  },
  voucherUpdatedToast:
    "//app-toasts/descendant::span[normalize-space() ='تم تحديث قسيمة تحية الجار بنجاح']",
  voucherDeletedToast:
    "//app-toasts/descendant::span[normalize-space() ='تم حذف قسيمة تحية الجار بنجاح']",
} as const;