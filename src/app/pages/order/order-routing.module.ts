import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { orderPage } from './order.page';

const routes: Routes = [
  {
    path: '',
    component: orderPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class orderPageRoutingModule {}
