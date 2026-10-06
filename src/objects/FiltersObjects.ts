export const FiltersObjects = {
    propertiesForSaleButton: {
        role: "button",
        name: "عقارات للشراء",
    },

    offPlanSaleUnits: {
        xpath: "//div[text()=' وحدات البيع على الخارطة ']",
    },
    filterResultButton: {
        xpath: "//span[text()='تصفية النتائج']",
    },
    clearFiltersButton: {
        role: "button",
        name: "مسح",
    },

    //Price
    minimumPriceInputfield: {
        xpath: "//label[text()='سعر الحد الأدنى']/following-sibling::input"
    },
    maximumPriceInputfield: {
        xpath: "//label[text()='سعر الحد الأقصى']/following-sibling::input"
    },
    minimumPriceRequiredMessage: {
        text: "لا يمكن أن يكون الحد الأدنى للسعر فارغًا",
    },
    maximumPriceRequiredMessage: {
        text: "لا يمكن أن يكون السعر الأقصى فارغًا",
    },

    minimumPriceMoreMessage: {
        text: "لا يمكن أن يكون الحد الأدنى للنطاق أكبر من الحد الأقصى للنطاق.",
    },
    maximumPriceMoreMessage: {
        text: "يجب أن تتراوح قيمة النطاق بين 1000 و 20000000.",
    },

    //Area
    minimumAreaInputfield: {
        xpath: "//label[text()='أدنى مساحة']/following-sibling::input"
    },
    maximumAreaInputfield: {
        xpath: "//label[text()='أقصى مساحة']/following-sibling::input"
    },

    minimumAreaRequiredMessage: {
        text: "لا يمكن أن تكون المساحة الدنيا فارغة.",
    },
    maximumAreaRequiredMessage: {
        text: "لا يمكن أن تكون المساحة القصوى فارغة.",
    },
    minimumAreaMoreMessage: {
        text: "لا يمكن أن يكون الحد الأدنى للنطاق أكبر من الحد الأقصى للنطاق.",
    },
    maximumAreaMoreMessage: {
        text: "يجب أن تتراوح قيمة النطاق بين 20 و 5000.",
    },


    //Eleigibility type

    allBeneficiaryRadio: {
        role: "radio",
        name: "الجميع",
    },
    allBeneficiaryValue: {
        xpath: "//span[text()='الجميع']/preceding-sibling::input"
    },

    beneficiaryRadio: {
        role: "radio",
        name: "مستفيد",

    },
    beneficiaryValue: {
        xpath: "//span[text()='مستفيد']/preceding-sibling::input"
    },

    nonBeneficiaryRadio: {
        role: "radio",
        name: "غير مستفيد",

    },


    nonBeneficiaryValue: {
        xpath: "//span[text()='غير مستفيد']/preceding-sibling::input"
    },


    //Cosntrauction status
    underConstructionRadio: {
        role: "radio",
        name: "تحت الإنشاء",
    },

    underConstructionValue: {
        xpath: "//span[text()='تحت الإنشاء']/preceding-sibling::input"
    },


    landRadio: {
        role: "radio",
        name: "أراضي",
    },

    landValue: {
        xpath: "//span[text()='أراضي']/preceding-sibling::input"
    },

    readyUnitsRadio: {
        role: "radio",
        name: "وحدات جاهزة",
    },


    readyUnitsValue: {
        xpath: "//span[text()='وحدات جاهزة']/preceding-sibling::input"
    },

    //Project status

    availableForBookingCheckbox: {
        role: "checkbox",
        name: "متاح للحجز",
    },
availableForBookingValue: {
       xpath:"//span[text()='متاح للحجز']/preceding-sibling::input"
    },


    availableSoonCheckbox: {
        role: "checkbox",
        name: "متاح قريباً",
    },


availableSoonValue: {
        xpath:"//span[text()='متاح قريباً']/preceding-sibling::input"
    },

    lastUnitsRemainingCheckbox: {
        role: "checkbox",
        name: "متبقي آخر الوحدات",
    },

    lastUnitsRemainingValue: {
       xpath:"//span[text()='متبقي آخر الوحدات']/preceding-sibling::input"
    },

    // Property type
    apartmentCheckbox: {
        role: "checkbox",
        name: "شقة",
    },

    
    townhouseCheckbox: {
        role: "checkbox",
        name: "تاون هاوس",
    },
    villaCheckbox: {
        role: "checkbox",
        name: "فيلا",
    },
    landCheckbox: {
        role: "checkbox",
        name: "أرض",
    },

    buildingCheckbox: {
        role: "checkbox",
        name: "عمارة",
    },

    otherCheckbox: {
        role: "checkbox",
        name: "أخرى",
    },





    //Rooms
    oneRoomCheckbox: {
        role: "checkbox",
        name: "1",
        exact: true,
    },
    twoRoomsCheckbox: {
        role: "checkbox",
        name: "2",
        exact: true,
    },

    //Bathrooms
    oneBathroomCheckbox: {
        role: "checkbox",
        name: "1",
        exact: true,
    },
    twoBathroomsCheckbox: {
        role: "checkbox",
        name: "2",
        exact: true,
    },


} as const;