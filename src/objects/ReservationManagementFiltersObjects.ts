export const ReservationManagementFiltersObjects = {
  filtersButton:"//span[contains(text(),'تصفية بواسطة')]/..",
  allUsers:"app-sapa-item-badge-group-v2 > div > div:nth-child(1)",
  beneficiaryUsers:"app-sapa-item-badge-group-v2 > div > div:nth-child(2)",
  nonBeneficiaryUsers:"app-sapa-item-badge-group-v2 > div > div:nth-child(3)",
  searchButton:"//button[contains(text(),' بحث ')]",
  searchResultTable: "app-sapa-datatable-v2",
  allIndividualBookingsStatusesColumn:"app-sapa-datatable-v2  datatable-body datatable-body-row > div:nth-child(2) > datatable-body-cell:nth-child(3)",
  allcompanyBookingsStatusesColumn:"app-sapa-datatable-v2  datatable-body datatable-body-row > div:nth-child(2) > datatable-body-cell:nth-child(2)",
  IndividualBookingsStatusFilter:".datatable-row-center datatable-header-cell:nth-child(3) .sort-btn",
  companyBookingsStatusFilter:".datatable-row-center datatable-header-cell:nth-child(2) .sort-btn",
  firstBookingDetailsButton:"datatable-row-wrapper:nth-child(1) datatable-body-row  datatable-body-cell > div .cursor-pointer",
  bookingTab:"//a[contains(text(),' حجوزات')]",
  bookingDetails:"app-enquiry-booking-info",

} as const;
