import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

import { App } from './app';
import { appConfig } from './app.config';
import Home from './pages/index.page';

describe('App foundation', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, Home],
      providers: [provideRouter([]), provideLocationMocks()],
    }).compileComponents();
  });

  it('should create the app shell and expose appConfig providers', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
    expect(appConfig.providers?.length).toBeGreaterThan(0);
  });

  it('should create the home page placeholder', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('GreenKeeper');
  });
});
