import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Spot } from '../models/spot-date.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  items: Spot[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.loadData().subscribe(
      (data: any) => {
        this.items = data;
      },
      (err) => {
        console.log('Error', err);
        if (environment.production) {
          this.ngOnInit()
        }
      }
    );
  }
}
