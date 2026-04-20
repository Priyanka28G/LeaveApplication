import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamRequest } from './team-request';

describe('TeamRequest', () => {
  let component: TeamRequest;
  let fixture: ComponentFixture<TeamRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamRequest],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
