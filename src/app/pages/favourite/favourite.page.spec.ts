import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { FavouritePage } from './favourite.page';

describe('FavouritePage', () => {
  let component: FavouritePage;
  let fixture: ComponentFixture<FavouritePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavouritePage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FavouritePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
