export interface AccountDetails {
  username: string;
  email: string;
  password?: string; // Optional if you want to use a default or only fill it sometimes
  phone: string;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  dob: string;
}

export interface AddressDetails {
  address: string;
  city: string;
  zipcode: string;
  region?: string; // Make optional or specific if needed
}

export interface PaymentDetails {
  amount: string;
  cardName: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
}
