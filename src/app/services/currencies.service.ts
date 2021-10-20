import { Injectable } from '@angular/core';

export enum CurrencyType {
  EUR = 'EUR',
  USD = 'USD'
}

export type CodeToCurrency = {
  [char_code: string] : ICurrency;
}

export interface ICurrency {
  id: string;
  char_code: string;
  name: string;
  value: number;
}

@Injectable({
  providedIn: 'root',
})
export class CurrenciesService {
  private currencies: CodeToCurrency = {};

  public fillCurrencies(data: any[]): CodeToCurrency {
    data.forEach((valute: any) => {
      this.currencies[valute.CharCode] = {
        id: valute.ID,
        char_code: valute.CharCode,
        name: valute.Name,
        value: valute.Value,
      }
    })

    return this.currencies;
  }
}
