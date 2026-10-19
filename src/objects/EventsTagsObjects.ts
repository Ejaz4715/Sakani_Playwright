const xpathLiteral = (value: string) => {
    if (!value.includes("'")) {
        return `'${value}'`;
    }
    if (!value.includes('"')) {
        return `"${value}"`;
    }
    return `concat('${value.split("'").join(`', "'", '`)}')`;
};

export const EventsTagsObjects = {
    neighborGreetingLink: {
        text: "تحية الجار",
    },
    eventsTagsLink: {
        role: "link",
        name: "علامات الحدث",
    },
    updateNewTagButton: {
        xpath: "//span[contains(text(),'حدث العلامة الجديد')]/parent::button"
    },
    tageNameInputfield: {
        xpath: "//input[@formcontrolname='tag_name']"
    },
    uploadDesign: {
        xpath: "//lib-sakani-upload-files[@uploader='neighbor_greeting_design_letter_image']/descendant::input"
    },
    appPicker: {
        xpath: "//app-color-picker"
    },
    colorsInputfield: {
        xpath: "//div[@class='hex-text']/descendant::input"
    },
    successfulMessageTagCreation: {
        text: "إنشاء علامة الحدث بنجاح"
    },
    editButton: {
        xpath: "//button[text()=' تعديل ']"
    },
    deleteButton: {
        xpath: "//button[text()=' حذف ']"
    },
    updateButton: {
        xpath: "//button[text()=' تحديث ']"
    },
    updatedMessage: {
        text: "تم الحفظ بنجاح!"
    },
    deletePopupButton: {
        xpath: "(//button[text()=' حذف '])[2]"
    },
    deletedMessage: {
        text: "حذف علامة الحدث بنجاح"
    },
    datatableBodyCellLabel: (name: string) => ({
        xpath: `//div[@class='datatable-body-cell-label'][normalize-space(.)=${xpathLiteral(name)}]`
    })
}as const