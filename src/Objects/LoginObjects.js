const LoginObjects = {
  acceptCookiesModal: "#acceptCookiesModal",
  acceptCookiesButton: { role: "button", name: "قبول ملفات تعريف الارتباط" },
  closeCookiesModal: ".svg-icon.icon-close-dark",
  loginButton: "//span[contains (text(), 'تسجيل الدخول')]/parent::a",
  continueWithNafathButton: { role: "button", name: "المتابعة مع نفاذ" },
  nafathIdInput: { role: "textbox", name: "e.g:" },
  continueButton: { role: "button", name: "المتابعة" },
  nafathPromptHeading: { role: "heading", name: "افتح تطبيق نفاذ" },
  newUserContinueButton: { role: "button", name: "موافقة واستمرار" },
  allowNotificationsButton: { role: "button", name: "Allow" },
};

module.exports = { LoginObjects };
