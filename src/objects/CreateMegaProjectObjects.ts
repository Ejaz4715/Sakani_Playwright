export const CreateMegaProjectObjects = {
    internalInvontory: {
        text: 'المخزون الداخلي'
    },
    megaProjects: {
        role: "link", name: 'وجهات NHC'
    },
    addNewMegaProjectButton: {
        role: "button", name: '[AR] Add new Mega project'
    },
    megaProjectInformation: {
        xpath: "//label[contains(text(), 'عنوان الوجهة (باللغة العربية)')]/following-sibling::input"
    },
    regionDropdownList: { name: 'app-region-select-form', role: "combobox" },
    selectedRegion: {
        role: "option", name: 'الرياض'
    },
    cityDropdownList: {
        role: "combobox", name: 'app-city-select-form'
    },
    selectedCity: {
        role: "option", name: 'شقراء'
    },
    latitudeInput: {
        xpath: '//input[@formcontrolname="latitude"]'
    },
    longitudeInput: {
        xpath: '//input[@formcontrolname="longitude"]'
    },
    videoLinkInput: {
        xpath: '//input[@formcontrolname="video_link"]'
    },
    uploadBannerImage: {
        xpath: '//label[@for="banner_image"]/following-sibling::lib-sakani-upload-files/descendant::input'
    },
    uploadImageGallery: {
        xpath: '//label[@for="image_galleries"]/following-sibling::lib-sakani-upload-files/descendant::input'
    },
    addMegaProjectButton: {
        role: "button", name: '[AR] Add mega project'
    },
    searchProjectInput: {
        role: "combobox"
    },
    searchedProject: {
        role: "option"
    },
    addToMegaProjectButton: {
        role: "button", name: '[AR] Add to mega project'
    },
    megaProjectInformationLSection: {
        role: "tab", name: '[AR] Mega project information'
    },
    editButton: {
        xpath: '//button[contains(text(), "تعديل")]'
    },
    enableNonSaudiDestinationSwitch: {
        xpath: '//mat-slide-toggle[@formcontrolname="enable_foreign_users"]/descendant::button'
    },
    updateButton: {
        xpath: '//button[contains(text(), "تحديث")]'

    },
    projectNotAvailableForNonSaudiMessage: {
        xpath: '//span[text()="عذرا المشروع غير متاح لغير السعوديين"]'
    },
    searchForMeagaProjectInput: {
        xpath: '//input[@formcontrolname="name__match"]'
    },
    searchButton: {
        xpath: "//button[contains(text(),'بحث')]"
    },

    searchedMegaPrjectResult: {
        xpath: "//datatable-body-cell[2]"
    },
} as const;