import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import {
  APP_CONFIG_PORT,
  DEVICE_SIGNALS_PORT,
  provideGreenKeeperDependencies,
} from '@composition/index';
import { App } from './app';
import { appConfig } from './app.config';
import { mobileOnlyGuard } from './guards/mobile-only.guard';
import DesktopInfoPage from './pages/desktop-info.page';
import Home, { routeMeta } from './pages/index.page';

describe('UI Pages, Guards, and App Bootstrap', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, Home, DesktopInfoPage],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        ...provideGreenKeeperDependencies(),
      ],
    }).compileComponents();
  });

  it('creates App, runs ngOnInit PWA registration, and exposes appConfig', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    expect(appConfig.providers?.length).toBeGreaterThan(0);
    expect(routeMeta).toEqual({
      title: 'GreenKeeper - Cuidados Botânicos',
      canActivate: [mobileOnlyGuard],
    });
  });

  it('renders DesktopInfoPage for non-mobile visitors', () => {
    const fixture = TestBed.createComponent(DesktopInfoPage);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Exclusivo para Celular');
    expect(text).toContain(
      'Este aplicativo funciona exclusivamente em smartphones.',
    );
  });

  it('renders Botanical Dashboard and handles all user interactions via DOM and methods', () => {
    const fixture = TestBed.createComponent(Home);
    const component = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();

    expect(component.activeRoom.roomName).toBe('Banheiro');
    expect(component.activeRoom.plantName).toBe('Calathea');
    expect(component.pendingCount).toBe(3);
    expect(component.wateringStatusLabel).toBe('Rega Pendente');

    (
      root.querySelector('[data-testid="btn-complete-watering"]') as HTMLElement
    ).click();
    fixture.detectChanges();
    expect(component.pendingCount).toBe(2);
    expect(component.wateringStatusLabel).toBe('Rega em Dia');

    (
      root.querySelector('[data-testid="room-pill-corredor"]') as HTMLElement
    ).click();
    fixture.detectChanges();
    expect(component.activeRoom.roomName).toBe('Corredor');

    (
      root.querySelector('[data-testid="room-pill-sala-estar"]') as HTMLElement
    ).click();
    fixture.detectChanges();
    expect(component.activeRoom.roomName).toBe('Sala de Estar');

    (
      root.querySelector('[data-testid="btn-favorite-focus"]') as HTMLElement
    ).click();
    fixture.detectChanges();
    expect(component.snapshot().focusPlant.isFavorite).toBe(true);

    (
      root.querySelector('[data-testid="btn-humidity-increase"]') as HTMLElement
    ).click();
    fixture.detectChanges();
    expect(component.snapshot().humidityPercent).toBe(65);

    (
      root.querySelector('[data-testid="btn-humidity-decrease"]') as HTMLElement
    ).click();
    fixture.detectChanges();
    expect(component.snapshot().humidityPercent).toBe(64);

    (
      root.querySelector('[data-testid="btn-notifications"]') as HTMLElement
    ).click();
    (
      root.querySelector('[data-testid="btn-rega-options"]') as HTMLElement
    ).click();
    (
      root.querySelector('[data-testid="btn-inspecao-options"]') as HTMLElement
    ).click();
    (root.querySelector('[data-testid="btn-camera"]') as HTMLElement).click();
    fixture.detectChanges();
    expect(component.snapshot().lastNotice).toContain('Câmera');
    expect(root.textContent).toContain('Câmera:');
  });

  it('allows mobile devices in mobileOnlyGuard and redirects desktop devices to /desktop-info', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        ...provideGreenKeeperDependencies(),
        {
          provide: DEVICE_SIGNALS_PORT,
          useValue: {
            readSignals: () => ({
              userAgent: 'iPhone',
              userAgentDataMobile: true,
              coarsePointer: true,
              maxTouchPoints: 5,
              viewportWidth: 390,
              devOverrideRequested: false,
            }),
          },
        },
      ],
    });

    const allowedResult = TestBed.runInInjectionContext(() =>
      mobileOnlyGuard(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    );
    expect(allowedResult).toBe(true);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        ...provideGreenKeeperDependencies(),
        {
          provide: DEVICE_SIGNALS_PORT,
          useValue: {
            readSignals: () => ({
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
              userAgentDataMobile: false,
              coarsePointer: false,
              maxTouchPoints: 0,
              viewportWidth: 1280,
              devOverrideRequested: false,
            }),
          },
        },
        {
          provide: APP_CONFIG_PORT,
          useValue: {
            getConfig: () => ({
              appEnv: 'production',
              supabaseUrl: '',
              supabaseAnonKey: '',
              auth0Domain: '',
              auth0ClientId: '',
            }),
          },
        },
      ],
    });

    const blockedResult = TestBed.runInInjectionContext(() =>
      mobileOnlyGuard(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    ) as UrlTree;
    expect(blockedResult.toString()).toBe('/desktop-info');
  });
});
