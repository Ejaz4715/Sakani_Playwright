export const StampManagementObjects = {

  stampManagementButton: {role:'link', name: 'إدارة الأختام' },
  lastStampViewButton:{role:'cell',child:2},
  lastStampImage:{role:'img'},
  imagePopUp:{role:'button',name: 'Close' },
  stampUpdateButton:{role:'button',name: 'تحديث' },
  uploadAreaButton:"div app-icon-upload-plus",
  uploadFileSelector:"input[type='file']",
  newStampButton:{role:'button',name: 'إضافة ختم جديد'},
  otpVerifyField:{role:'spinbutton'},
  otpVerifyButton:{role:'button',name: 'التحقق من الرمز'},
  stampSuccessfulMessage:"تم حفظ البيانات بنجاح",
} as const;
