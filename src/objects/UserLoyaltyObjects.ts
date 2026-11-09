export const UserLoyaltyObjects = {
  sakaniLogo: {
    xpath: "//img[@alt='Sakani logo']",
  },
  laterButton: {
    role: 'button',
    name: 'لاحقاً',
  },
  buyNowLinkOnLandingPage: {
    role: 'link',
    name: 'اشتري الآن',
  },
  buyNowButtonOnDealDetailsPage: {
    role: 'button',
    name: 'اشتري الآن',
  },
  creditCardPaymentRadio: {
    role: 'radio',
    name: 'بطاقة الائتمان/الخصم ادفع باستخدام بطاقة مدى أو ماستركارد أو فيزا',
  },
  continuePaymentButton: {
    role: 'button',
    name: 'متابعة الدفع',
  },
  paymentFailedHeading: {
    role: 'heading',
    name: 'فشل الدفع',
    exact: true,
  },
} as const;
