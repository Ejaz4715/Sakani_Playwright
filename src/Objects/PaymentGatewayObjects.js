const PaymentGatewayObjects = {
  cardNumberFrame: 'iframe[name="card.number"]',
  cardNumberInput: { role: "textbox", name: "رقم البطاقة" },
  expiryDateInput: { role: "textbox", name: "تاريخ الانتهاء" },
  cardHolderNameInput: { role: "textbox", name: "اسم حامل البطاقة" },
  cvvFrame: 'iframe[name="card.cvv"]',
  cvvInput: { role: "textbox", name: "رمز الحماية CVV" },
  payNowButton: { role: "button", name: "إدفع الأن" },
};

module.exports = { PaymentGatewayObjects };
