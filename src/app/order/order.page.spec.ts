import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { orderPage } from './order.page';

describe('orderPage', () => {
  let component: orderPage;
  let fixture: ComponentFixture<orderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [orderPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule],
    }).compileComponents();

    fixture = TestBed.createComponent(orderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
