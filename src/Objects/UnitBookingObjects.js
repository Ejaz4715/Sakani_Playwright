const UnitBookingObjects = {
  // termsCheckbox: { role: 'checkbox', name: /أؤكد قراءة وفهم الشروط والأحكام والموافقة عليها.*/ },
  termsCheckbox: "//input[@formcontrolname='accepted_term']",
  confirmButton: { role: "button", name: "تأكيد" },
  payBookingFeeButton: { role: "button", name: "دفع رسوم الحجز" },
  madaPaymentTitle: { title: "الدفع بواسطة مدى" },
};

module.exports = { UnitBookingObjects };
