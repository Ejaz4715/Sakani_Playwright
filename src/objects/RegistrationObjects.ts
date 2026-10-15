export const RegistrationObjects = {
    nationalIdInputfield: { role: "textbox", name: "e.g:" },
    mobilePhoneInputfield: { role: "textbox", name: "أدخل رقم هاتفك المحمول" },
    emailInputfield: { role: "textbox", name: "أدخل بريدك الإلكتروني" },

    otp1:{
        xpath:"//input[@autocomplete='one-time-code'][1]"
    },
    otp2:{
        xpath:"//input[@autocomplete='one-time-code'][2]"
    },
    otp3:{
        xpath:"//input[@autocomplete='one-time-code'][3]"
    },
    otp4:{
        xpath:"//input[@autocomplete='one-time-code'][4]"
    },

    continueButton: { role: "button", name: "المتابعة" },

    explorePropertiesButton: { role: "button", name: "استكشاف الخصائص" },

    termsAndConditionsCheckbox: {
        role: "checkbox",
        name: "أؤكد أنني قرأت وفهمت ووافقت على الشروط والأحكام",
    },
    eligibilityCheckButton: { role: "button", name: "تحقق من حالة الاستحقاق" },
    eligibilityTermsCheckbox: {
        role: "checkbox",
        name: "أؤكد قراءة وفهم الشروط والأحكام والموافقة عليها",
    },
    acceptTermsButton: { role: "button", name: "أوافق على الشروط والأحكام" },
    firstCheckbox: "#firstCheckbox-1",
    secondCheckbox: "#secondCheckbox-1",
    thirdCheckbox: "#thirdCheckbox-1",


    currentRegion: {
        xpath: "//app-label[@label='ELIGIBILITY.ADDITIONAL_QUESTIONS_FORM.LABEL.CURRENT_REGION']/parent::div/descendant::ng-select"
    },
    riyadhOption: { role: "option", name: "الرياض" },

    currentCity: {
        xpath: "//app-label[@label='ELIGIBILITY.ADDITIONAL_QUESTIONS_FORM.LABEL.CURRENT_CITY']/parent::div/descendant::ng-select"
    },
    shaqraOption: { role: "option", name: "شقراء" },

    perefferdRegion: {
        xpath: "//app-label[@label='ELIGIBILITY.ADDITIONAL_QUESTIONS_FORM.LABEL.PREFERRED_REGION']/parent::div/descendant::ng-select"
    },
    makkahOption: { role: "option", name: "مكة المكرمة" },

    prefferedCity: {
        xpath: "//app-label[@label='ELIGIBILITY.ADDITIONAL_QUESTIONS_FORM.LABEL.PREFERRED_CITY']/parent::div/descendant::ng-select"
    },
    jeddahOption: { role: "option", name: "جدة" },

    perefferedDistruct: {
        xpath: "//app-label[@label='ELIGIBILITY.ADDITIONAL_QUESTIONS_FORM.LABEL.PREFERRED_DISTRICT']/parent::div/descendant::ng-select"
    },
    distructOption: { role: "option", name: "البلد" },

    currentLivingStatus: {
        xpath: "//app-dropdown[@formcontrolname='living_situation']/descendant::ng-select"
    },
    rentalHouseOption: { role: "option", name: "بيت إيجار" },
    ownHouseOption: { role: "option", name: "بيت ملك" },

    confirmButton: { role: "button", name: "تأكيد" },
    eligibilitySuccessMessage: "تهانينا، أنت الآن مستحق للدعم السكني!",
    notEligibilitySuccessMessage: " عذرا ، أنت غير مؤهل للحصول على الدعم ",
    //Extra fields
    guardianId: {
        xpath: "//input[@formcontrolname='guardian_nin']"
    },
    guardianDob: {
        xpath: "//app-hijri-datepicker[@formcontrolname='guardian_dob']/descendant::input[1]"
    },

    fatherId: {
        xpath: "//input[@formcontrolname='nin_father']"
    },
    fatherDob: {
        xpath: "//app-hijri-datepicker[@formcontrolname='dob_father']/descendant::input[1]"
    },
    motherId: {
        xpath: "//input[@formcontrolname='nin_mother']"
    },
    motherDob: {
        xpath: "//app-hijri-datepicker[@formcontrolname='dob_mother']/descendant::input[1]"
    },
    //Financial Advisory
    financialAdvisoryLink: {
		xpath: "(//a[contains(., 'المستشار العقاري')])[3]",
	},
    startNowButton: { role: "button", name: "ابدأ الآن" },
    startServiceLink: { role: "link", name: "بدء الخدمة" },
	readyUnitsFromMarketText: "الوحدات الجاهزة من السوق",
	readyUnitsCheckbox: { role: "checkbox" },
	submitButton: { role: "button", name: "إرسال" },
	typeOfWorkDropdwonList:{
        xpath:"//app-label[@label='ELIGIBILITY.ADDITIONAL_QUESTIONS_FORM.LABEL.TYPE_OF_WORK']/parent::div/descendant::ng-select"
    },
    typeOfWorkOption: { role: "option", name: "مدني – قطاع حكومي" },
    bankDropdownList:{
        xpath:"//app-label[@label='ELIGIBILITY.ADDITIONAL_QUESTIONS_FORM.LABEL.SALARY_BANK']/parent::div/descendant::ng-select"
    },
    bankOption: { role: "option", name: "Bank Albilad" },
    monthlySalaryInputfield:{
        xpath:"//input[@formcontrolname='monthly_salary']"
    },
    homeAllowanceInputfield:{
        xpath:"//input[@formcontrolname='home_allowance']"
    },
    additionalIncomeInputfield:{
        xpath:"//input[@formcontrolname='additional_income']"
    },
    personalSavingsInputfield:{
        xpath:"//input[@formcontrolname='personal_savings']"
    },
    downPaymentAmountInputfield:{
        xpath:"//input[@formcontrolname='down_payment_amount']"
    },
    monthlyObligationsInputfield:{
        xpath:"//input[@formcontrolname='monthly_obligations']"
    },
    monthRemainingInputfield:{
        xpath:"//input[@formcontrolname='num_months_remaining']"
    }
} as const