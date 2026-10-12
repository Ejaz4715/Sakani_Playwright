export const DashboardViewObjects = {

  dashboardViewLink: {
    role: 'link', name: 'لوحة البيانات'
  },
  allDashboardViewElements: ".content app-dashboard",
  bookingViewCard: "//h3[contains(text(),'الحجوزات')]/../..//span[contains(text(),'عرض')]",
  appReservationTable: "app-reservations",
  theProjectsViewCard: "//h3[contains(text(),'المشاريع')]/../..//span[contains(text(),'عرض')]",
  projectsViewCard: "//h4[contains(text(),' مشاريع ')]//../div/span[contains(text(),' عرض الكل ')]",
  appProjectsView: "app-projects",
  updatedBookingCard: "//h4[contains(text(),'أحدث الحجوزات')]//../div/span[contains(text(),' عرض الكل ')]",
  updatedBookingsTable: "app-sapa-datatable-v2",
  payCard: "//h4[contains(text(),'دفع')]//../div/span[contains(text(),'عرض الكل')]",
  allBookingPaymentView: "app-sapa-booking-payment-tracking-list-v2",
} as const;
