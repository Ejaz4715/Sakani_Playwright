export const TagsObjects ={

    availableSoonTage:{
        xpath:"(//div[contains(@class,'marketplace-project-card__tag')]/descendant::span[text()='سيتاح الحجز قريبًا'])[1]"
    },

    lastUnitsRemainingTag:{
        xpath:"(//div[contains(@class,'marketplace-project-card__tag')]/descendant::span[text()='وحدات قليلة متبقية'])[1]"
    }
}as const