import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsCalendarComponent } from './posts-calendar.component';

describe('PostsCalendarComponent', () => {
  let component: PostsCalendarComponent;
  let fixture: ComponentFixture<PostsCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostsCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
