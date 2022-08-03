import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ListComponent } from './list/list.component';

export const routes: Routes = [
  {
    path: 'list',
    component: ListComponent,
  },
  { path: '', redirectTo: '/list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
