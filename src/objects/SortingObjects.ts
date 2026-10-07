export const SortingObjects = {
    projectsNames: {
        xpath: "//app-marketplace-project-card-template/descendant::div[contains(@class, 'one-line-text')][1]",
    },

    sortingBasedOnButton: {
        xpath: "//span[text()='ترتيب حسب']",
    },

    recommendedOption: { text: "موصى لك" },
    mostPopularOption: { text: "الأكثر شهرة" },
    newestFirstOption: { text: "الأحدث أولاً" },
    oldestFirstOption: { text: "الأقدم أولا" },
    priceHighToLowOption: { text: "السعر من الأعلى إلى الأدنى" },
    priceLowToHighOption: { text: "السعر من الأدنى إلى الأعلى" },

} as const;