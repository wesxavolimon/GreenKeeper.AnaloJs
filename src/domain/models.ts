export type AppEnvironment = 'development' | 'test' | 'production';

export type RoomTone = 'emerald' | 'charcoal' | 'light';

export interface PlantMetrics {
  readonly waterPercent: number;
  readonly lightPercent: number;
}

export interface RoomPlantSummary {
  readonly id: string;
  readonly roomName: string;
  readonly plantName: string;
  readonly tone: RoomTone;
  readonly metrics: PlantMetrics;
  readonly pendingWatering: boolean;
}

export interface FocusInspectionTask {
  readonly id: string;
  readonly category: 'Rega' | 'Inspeção';
  readonly frequencyLabel: string;
  readonly tone: 'emerald' | 'white';
  readonly completed: boolean;
}

export interface PlantFocusSummary {
  readonly plantName: string;
  readonly isFavorite: boolean;
  readonly tasks: readonly FocusInspectionTask[];
}

export interface DashboardSnapshot {
  readonly rooms: readonly RoomPlantSummary[];
  readonly activeRoomId: string;
  readonly focusPlant: PlantFocusSummary;
  readonly humidityPercent: number;
  readonly lastNotice: string | null;
}

export interface DeviceSignals {
  readonly userAgent: string;
  readonly userAgentDataMobile: boolean | null;
  readonly coarsePointer: boolean;
  readonly maxTouchPoints: number;
  readonly viewportWidth: number;
  readonly devOverrideRequested: boolean;
}

export type DeviceAccessReason =
  | 'mobile-device'
  | 'dev-override'
  | 'blocked-non-mobile';

export interface DeviceAccessDecision {
  readonly allowed: boolean;
  readonly reason: DeviceAccessReason;
}

export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly picture: string | null;
  readonly provider: 'google';
}
