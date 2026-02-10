import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { orderPage } from './order.page';
// import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { orderPageRoutingModule } from './order-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    // ExploreContainerComponentModule,
    orderPageRoutingModule,
  ],
  declarations: [orderPage],
})
export class orderPageModule {}
