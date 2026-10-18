export const RealEstateTaxExemptionObjects = {
  realEstateTaxExemptionServiceButton: {
    role: 'link', name: 'تحمل ضريبة التصرفات العقارية'
  },
  startServiceButton: {
    role: 'link', name: 'بدء الخدمة'
  },
  certificateNumberText:
    /^\d{14}$/,
  viewCertificateButton: {
    role: 'button', name: 'عرض الشهادة'
  },
  certificateDialog: {
    role: 'dialog'
  },
  downloadCertificateLink: {
    role: 'link', name: 'تحميل'
  },
  certificateInquiryTab: {
    role: 'tab', name: 'الاستفسار عن الشهادة'
  },
  certificateNumberField: {
    role: 'textbox', name: 'أدخل رقم الشهادة هنا'
  },
  nationalIdField: {
    role: 'textbox', name: 'أدخل رقم الهوية الوطنية هنا'
  },
  verifyButton: {
    role: 'button', name: 'تحقق'
  },
  certificateNotBelongMessage:
    "حامل الهوية لديه شهادة متاحة ",
} as const;
