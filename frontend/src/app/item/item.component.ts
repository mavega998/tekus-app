import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ApiService } from '../services/api.service';
import { Spot, Currency } from '../models/spot-date.model';
import { CurrencyPipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent implements OnInit {
  @Input() index: number | undefined;
  @Input() data: Spot | undefined;

  @ViewChild('mySwal')
  public readonly mySwal!: SwalComponent;

  public currency2: Currency | undefined;
  public currency3: Currency | undefined;

  constructor(
    private apiService: ApiService,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit(): void {
    this.listenReply();
  }

  showDetail() {
    this.mySwal.fire();
    this.apiService.send('message', this.data?.date);
  }

  listenReply = (): void => {
    if (!this.apiService.isElectron()) {
      return;
    }
    this.apiService.on('reply').subscribe((resp: any) => {
      this.currency2 = undefined;
      this.currency3 = undefined;
      this.currency2 = resp.eur;
      this.currency3 = resp.cop;
    });
  };

  subtitle() {
    return `
    <p>1 ${this.data?.base} -> ${
      this.data?.currency1?.currency
    } ${this.currencyPipe.transform(
      this.data?.currency1?.amount,
      'USD',
      'symbol',
      '1.0-0'
    )}<p>
    <p>1 ${this.data?.base} -> ${
      this.currency2 ? this.currency2.currency : 'cargando'
    } ${
      this.currency2
        ? this.currencyPipe.transform(
            this.currency2.amount,
            'EUR',
            'symbol',
            '1.0-0'
          )
        : 'cargando'
    }<p>
    <p>1 ${this.data?.base} -> ${
      this.currency3 ? this.currency3.currency : 'cargando'
    } ${
      this.currency3
        ? this.currencyPipe.transform(
            this.currency3.amount,
            'EUR',
            'symbol',
            '1.0-0'
          )
        : 'cargando'
    }<p>
    `;
  }
}
