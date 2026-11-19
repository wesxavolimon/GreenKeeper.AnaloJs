import {
  AppEnvironment,
  DashboardSnapshot,
  DeviceAccessDecision,
  DeviceSignals,
  RoomPlantSummary,
} from './models';

const MOBILE_PHONE_UA_REGEX =
  /Android.*Mobile|iPhone|iPod|Windows Phone|BlackBerry|BB10|Opera Mini|IEMobile|Mobile Safari/i;
const TABLET_OR_DESKTOP_UA_REGEX = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i;
const MAX_MOBILE_VIEWPORT_WIDTH = 540;

export function clampHumidityLevel(value: number): number {
  if (value < 0) {
    return 0;
  }
  if (value > 100) {
    return 100;
  }
  return Math.round(value);
}

export function countPendingTasks(snapshot: DashboardSnapshot): number {
  const roomPending = snapshot.rooms.filter((room) => room.pendingWatering).length;
  const focusPending = snapshot.focusPlant.tasks.filter((task) => !task.completed).length;
  return roomPending + focusPending;
}

export function getActiveRoom(snapshot: DashboardSnapshot): RoomPlantSummary {
  const found = snapshot.rooms.find((room) => room.id === snapshot.activeRoomId);
  return found ?? snapshot.rooms[0];
}

export function evaluateDeviceAccess(
  signals: DeviceSignals,
  appEnv: AppEnvironment,
): DeviceAccessDecision {
  const isExplicitTablet = TABLET_OR_DESKTOP_UA_REGEX.test(signals.userAgent);
  const isMobileUa =
    !isExplicitTablet &&
    (signals.userAgentDataMobile === true ||
      MOBILE_PHONE_UA_REGEX.test(signals.userAgent));
  const isTouchPhoneViewport =
    !isExplicitTablet &&
    signals.viewportWidth > 0 &&
    signals.viewportWidth <= MAX_MOBILE_VIEWPORT_WIDTH &&
    (signals.coarsePointer || signals.maxTouchPoints > 0);

  if (appEnv === 'production' && (isMobileUa || isTouchPhoneViewport)) {
    return {
      allowed: true,
      reason: 'mobile-device',
    };
  }

  if (appEnv !== 'production' && signals.devOverrideRequested) {
    return {
      allowed: true,
      reason: 'dev-override',
    };
  }

  return {
    allowed: false,
    reason: 'blocked-non-mobile',
  };
}

export function isAuthenticated(token: string | null | undefined): token is string {
  return typeof token === 'string' && token.length > 0;
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (typeof exp !== 'number') {
      return true;
    }
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export function validateSession(token: string | null | undefined): boolean {
  if (!isAuthenticated(token)) {
    return false;
  }
  return !isTokenExpired(token);
}
