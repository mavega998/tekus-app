export interface Spot {
  base: string;
  currency1: Currency;
  currency2: Currency;
  currency3: Currency;
  date: string;
}

export interface Currency {
  base: string;
  currency: string;
  amount: string;
}
