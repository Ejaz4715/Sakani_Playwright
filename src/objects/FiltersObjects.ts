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


    searchButton: {
        role: "button",
        name: "بحث",
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


    landsRadio: {
        role: "radio",
        name: "أراضي",
    },

    landsValue: {
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
        xpath: "//span[text()='متاح للحجز']/preceding-sibling::input"
    },


    availableSoonCheckbox: {
        role: "checkbox",
        name: "متاح قريباً",
    },


    availableSoonValue: {
        xpath: "//span[text()='متاح قريباً']/preceding-sibling::input"
    },

    lastUnitsRemainingCheckbox: {
        role: "checkbox",
        name: "متبقي آخر الوحدات",
    },

    lastUnitsRemainingValue: {
        xpath: "//span[text()='متبقي آخر الوحدات']/preceding-sibling::input"
    },

    // Property type
    apartmentCheckbox: {
        role: "checkbox",
        name: "شقة",
    },
    apartmentValue: {
        xpath: "//span[text()='شقة']/preceding-sibling::input"
    },

    townhouseCheckbox: {
        role: "checkbox",
        name: "تاون هاوس",
    },

    townhouseValue: {
        xpath: "//span[text()='تاون هاوس']/preceding-sibling::input"
    },

    villaCheckbox: {
        role: "checkbox",
        name: "فيلا",
    },

    villaValue: {
        xpath: "//span[text()='فيلا']/preceding-sibling::input"
    },

    landCheckbox: {
        role: "checkbox",
        name: "أرض",
    },

    landValue: {
        xpath: "//span[text()='أرض']/preceding-sibling::input"
    },

    floorCheckbox: {
        role: "checkbox",
        name: "دور",
    },

    floorValue: {
        xpath: "//span[text()='دور']/preceding-sibling::input"
    },


    buildingCheckbox: {
        role: "checkbox",
        name: "عمارة",
    },

    buildingValue: {
        xpath: "//span[text()='عمارة']/preceding-sibling::input"
    },

    otherCheckbox: {
        role: "checkbox",
        name: "أخرى",
    },

    otherValue: {
        xpath: "//span[text()='أخرى']/preceding-sibling::input"
    },





    //Rooms
    oneRoomCheckbox: {
        xpath:"//app-chip-input[@formcontrolname='num_of_rooms']/descendant::span[text()='1']"
    },
    oneRoomValue: {
        xpath: "(//span[text()='1']/preceding-sibling::input)[1]"
    },


    twoRoomsCheckbox: {
        xpath:"//app-chip-input[@formcontrolname='num_of_rooms']/descendant::span[text()='2']"
    },

    twoRoomsValue: {
        xpath: "(//span[text()='2']/preceding-sibling::input)[1]"
    },

    //Bathrooms
    oneBathroomCheckbox: {
       xpath:"//app-chip-input[@formcontrolname='num_of_bath_rooms']/descendant::span[text()='1']"
    },


    oneBathroomValue: {
        xpath: "(//span[text()='1']/preceding-sibling::input)[2]"
    },
    twoBathroomsCheckbox: {
        xpath:"//app-chip-input[@formcontrolname='num_of_bath_rooms']/descendant::span[text()='2']"
    },
    twoBathroomsValue: {
        xpath: "(//span[text()='2']/preceding-sibling::input)[2]"
    },

} as const;