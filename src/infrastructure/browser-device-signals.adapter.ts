import { DeviceSignalsPort } from '@application/index';
import { DeviceSignals } from '@domain/index';

export interface BrowserDeviceSource {
  readonly userAgent: string;
  readonly userAgentDataMobile?: boolean | null;
  readonly maxTouchPoints: number;
  readonly innerWidth: number;
  readonly search: string;
  readonly matchesCoarsePointer: boolean;
}

export function readDefaultBrowserDeviceSource(
  win: Window = window,
  nav: Navigator = navigator,
): BrowserDeviceSource {
  const navWithUaData = nav as Navigator & {
    userAgentData?: { mobile?: boolean };
  };
  const matchesCoarsePointer =
    typeof win.matchMedia === 'function'
      ? win.matchMedia('(pointer: coarse)').matches
      : false;

  return {
    userAgent: nav.userAgent,
    userAgentDataMobile: navWithUaData.userAgentData?.mobile ?? null,
    maxTouchPoints: nav.maxTouchPoints ?? 0,
    innerWidth: win.innerWidth,
    search: win.location.search,
    matchesCoarsePointer,
  };
}

export class BrowserDeviceSignalsAdapter implements DeviceSignalsPort {
  constructor(
    private readonly sourceProvider: () => BrowserDeviceSource = () =>
      readDefaultBrowserDeviceSource(),
  ) {}

  readSignals(): DeviceSignals {
    const source = this.sourceProvider();
    const params = new URLSearchParams(source.search);
    return {
      userAgent: source.userAgent,
      userAgentDataMobile: source.userAgentDataMobile ?? null,
      coarsePointer: source.matchesCoarsePointer,
      maxTouchPoints: source.maxTouchPoints,
      viewportWidth: source.innerWidth,
      devOverrideRequested: params.get('mobilePreview') === '1',
    };
  }
}
