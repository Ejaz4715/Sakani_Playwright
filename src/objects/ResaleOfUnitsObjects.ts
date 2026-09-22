export const ResaleOfUnitsObjects={
resaleSettingTab:{
    text:"إعدادات خدمة إعادة البيع"
},
useGeneralResaleSettingsSwitch:{
    role:"switch", name:"استخدام إعدادات إعادة البيع العامة" 
},
resaleFeeTypeDropdownList:{
    xpath:"//app-nsar-dropdown[@formcontrolname='resale_fee_type']/descendant::ng-select"
},
resaleTypeOption:{
    role:"option", name:"النسبة المئوية"
},
resaleFeeValueInputfield:{
    xpath:"//input[@formcontrolname='resale_fee_value']"
},
saveButton:{
    role:"button", name:"حفظ"
},
toastMessage:{
    text:"تم تحديث إعدادات إعادة البيع بنجاح"
}


} as const