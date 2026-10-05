export const DiscountOnReservedUnitsObjects = {
	manageBookingsButton: {
		xpath: "//span[contains(text(),'إدارة الحجوزات')]",
	},
	individualBookingsButton: {
		role: "link",
		name: "الحجوزات الفردية",
	},
	newBookingButton: {
		role: "button",
		name: "حجز جديد",
	},
	userIdInputfield: {
		role: "textbox",
	},
	searchButton: {
		role: "button",
		name: "بحث",
	},
	nextButton: {
		role: "button",
		name: "التالي",
	},
	projectNameInputfield: {
		xpath:"//app-project-filter-dropdown/descendant::input"
	},
	
	projectOption: (projectName: string) => ({
		role: "option" as const,
		name: projectName,
	}),

    firstUnitCheckbox:{
        xpath:"(//app-sapa-checkbox-v2)[1]"
    },
	continueBtookingButton: {
		role: "button",
		name: "مواصلة الحجز",
	},
	banksDropdownList: {
		css: "app-bank-list-dropdown-control",
	},
	
	bankOption: {
		role: "option",
		name: "بنك الأهلي السعودي",
	},

    descountPercentageInputfield:{
        xpath:"//input[@type='number']"
    },
	confirmButton: {
		role: "button",
		name: "تأكيد",
	},
	viewDetailsButton: {
		role: "button",
		name: "عرض التفاصيل",
	},
	bookingsTab: {
		role: "tab",
		name: "حجوزات",
	},
	cancellationReasonDropdownList: {
		xpath:"//app-sapa-dropdown-v2/descendant::ng-select"
	},
	cancellationReasonOption: {
		role: "option",
		name: "الانتقال لمشروع آخر",
	},
	cancelBookingButton: {
		role: "button",
		name: "إلغاء الحجز",
	},
	continueCancellationButton: {
		role: "button",
		name: "المتابعة",
	},
	noButton: {
		role: "button",
		name: "لا",
	},
	cancellationOtpCodeInput: {
		role: "spinbutton",
	},
	verifyCancellationCodeButton: {
		role: "button",
		name: "التحقق من الرمز",
	},
	beneficiaryCancellationToastSuccessMessage: {
		text: "//div[contains(text(),'تم  إلغاء الحجز للمستفيد')]",
	},
	priceQuotationTab: {
		role: "tab",
		name: "عرض السعر",
	},

	
	downloadIcon: {
		css: ".pointer.svg-icon",
	},

    unitPriceBeforeDiscount:{
        xpath:"(//div[contains(text(),'سعر الوحدة')])[2]/parent::div/span"
    },

    unitPriceAfterDiscount:{
        xpath:"(//div[contains(text(),'القيمة الإجمالية')])/parent::div/span"
    },

	payBookingFees:{
		role: "heading",
		name: "دفع رسوم الحجز",
    },

    theBookings:{
        text:"الحجوزات"
    },
    searchForUnitOrIDInputfield:{
      
        role:"textbox", name:"ابحث برمز الوحدة أو رقم الهوية"
    },
	bookingStatusDropdown: {
		xpath:"(//app-sapa-dropdown-v2/descendant::ng-select)[1]"
	},
	priceQuotationStatusOption: {
		role: "option",
		name: "عرض السعر",
	},

    viewDetailsOfSerchedResultButton:{
    text:"إظهار التفاصيل"
    },

	reissuePriceQuotationButton: {
		role: "button",
		name: "إعادة إصدار عرض السعر",
	},
	reissuePriceQuotationSuccessMessage: {
		text: "تمت إعادة إصدار عرض السعر بنجاح.",
	},
    
	extendPriceQuotationButton: {
		role: "button",
		name: "تمديد فترة عرض السعر",
	},
	yesButton: {
		role: "button",
		name:"نعم",
	},
	extendPriceQuotationSuccessMessage: {
		text: "لقد تم تمديد عرض الأسعار هذا بنجاح.",
	},

} as const