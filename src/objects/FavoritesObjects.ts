export const FavoritesObjects = {
    offPlanProjectPath: (projectId: number) => `/app/offplan-projects/${projectId}`,
    // The project page renders two favorite buttons (one per layout); only one is visible
    favoriteButton: "button.fav-btn",
    // The button label stays "المفضلة"; only the icon changes with the state
    notFavoriteIcon: ".icon-favorite",
    favoriteIcon: ".icon-heart-loved",
    favoriteApi: "/mainIntermediaryApi/v4/beneficiary/project_available_subscriptions",
    favoritesSidebarLink: "المفضلة",
    favoritesUrl: /user-profile\/favorites/,
    projectsTab: "المشاريع",
    favoriteCard: ".split-view-card",
    // Red heart on each card in the favourites list; clicking it removes the favourite
    removeFavoriteButton: "app-marketplace-card .marketplace-card__favorite",
    unfavoriteApi: "/mainIntermediaryApi/v4/beneficiary/project_available_subscriptions/unfavorite",
    emptyFavoritesTitle: "قائمة المفضلة لديك فارغة",
    emptyFavoritesDescription: "تفضل بزيارة صفحة السوق للعثور على خيار سكني مناسب لاحتياجاتك.",
} as const;
