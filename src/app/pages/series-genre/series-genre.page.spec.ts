import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeriesGenrePage } from './series-genre.page';

describe('SeriesGenrePage', () => {
  let component: SeriesGenrePage;
  let fixture: ComponentFixture<SeriesGenrePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SeriesGenrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
