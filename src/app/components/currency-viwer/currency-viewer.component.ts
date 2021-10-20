import { Component, OnInit } from '@angular/core';
import { CodeToCurrency, CurrenciesService, CurrencyType } from '../../services/currencies.service';
import { DataRequestService, INTERVAL_REQUEST } from '../../services/data-request.service';

@Component({
  selector: 'app-currency-viewer',
  templateUrl: './currency-viewer.component.html',
  styleUrls: ['./currency-viewer.component.scss']
})
export class CurrencyViewerComponent implements OnInit {
  public currencies: CodeToCurrency = {}
  public data_currencies: any;
  public all_currencies_type: CurrencyType[];
  public current_currency_type: CurrencyType | undefined;

  constructor(public data_request_service: DataRequestService, private currencies_service: CurrenciesService) {
    this.all_currencies_type = Object.values(CurrencyType);
    this.current_currency_type = this.all_currencies_type[0];
  }

  public async ngOnInit() {
    await this.getDataCurrencies();
  }

  private getDataCurrencies = async () => {
    this.data_currencies = await this.data_request_service.getDataOnSource(0);

    if (this.data_currencies) {
      this.currencies = this.currencies_service.fillCurrencies(this.data_currencies);
    }

    setTimeout(() => this.getDataCurrencies(), INTERVAL_REQUEST)
  }

  public get currency_value() {
    return this.current_currency_type ? this.currencies[this.current_currency_type]?.value : '-'
  }
}
