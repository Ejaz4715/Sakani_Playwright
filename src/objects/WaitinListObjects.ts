export const WaitinListObjects = {
	waitingListSideButton: {
		role: "link", name: "قائمة الانتظار"
	},
	newRegisterButton: {
		role: "button", name: "سجل جديد"
	},
	searchInputfield: {
		role: "textbox"
	},
	searchButton: {
		role: "button", name: "بحث"
	},
	nextButton: {
		role: "button", name: "التالي"
	},
	projectSearchInputfield: {
		role: "textbox", name: "البحث عن طريق اسم او رمز المشروع"
	},
	selectProjectButton: {
		role: "button", name: "تحديد المشروع"
	},
	projectRadioCheck: {
		css: ".radio-check"
	},
	confirmButton: {
		role: "button", name: "تأكيد"
	},
	confirmButtonPopup: {
		xpath:"(//button[contains(text(),'تأكيد')])[1]"
	},
	registrationSuccessMessage: {
		text: "تم تأكيد التسجيل في قائمة الانتظار بنجاح"
	},


    //User

    userProfile:{
        text:"إدارة الملف الشخصي"
    },
	myActivities: {
		text: "أنشطتي"
	},
	registeredWaitingList: {
		 text: "قائمة الانتظار المسجل بها"
	},
	activeTab: {
		role: "tab", name: "نشطة"
	},
	cancelRequestButton: {
		role: "button", name: "إلغاء الطلب"
	},
	confirmCancellationButton: {
		role: "button", name: "موافق"
	},
	noActiveWaitingListProjectsMessage: {
		role: "heading", name: "ليس لديك أي مشروع ذو اشتراك نشط في قائمة الانتظار الخاصة بك"
	}
} as const