import {
  clampHumidityLevel,
  DashboardSnapshot,
  DeviceAccessDecision,
  evaluateDeviceAccess,
} from '@domain/index';
import {
  AppConfigPort,
  DashboardRepositoryPort,
  DeviceSignalsPort,
  PwaRegistrationPort,
} from './ports';

export class EvaluateDeviceAccessUseCase {
  constructor(
    private readonly deviceSignalsPort: DeviceSignalsPort,
    private readonly appConfigPort: AppConfigPort,
  ) {}

  execute(): DeviceAccessDecision {
    const signals = this.deviceSignalsPort.readSignals();
    const { appEnv } = this.appConfigPort.getConfig();
    return evaluateDeviceAccess(signals, appEnv);
  }
}

export class LoadDashboardUseCase {
  constructor(private readonly repository: DashboardRepositoryPort) {}

  execute(): DashboardSnapshot {
    return this.repository.getSnapshot();
  }
}

export class SelectRoomUseCase {
  constructor(private readonly repository: DashboardRepositoryPort) {}

  execute(roomId: string): DashboardSnapshot {
    const current = this.repository.getSnapshot();
    const exists = current.rooms.some((room) => room.id === roomId);
    if (!exists) {
      return current;
    }
    return this.repository.saveSnapshot({
      ...current,
      activeRoomId: roomId,
    });
  }
}

export class CompletePlantTaskUseCase {
  constructor(private readonly repository: DashboardRepositoryPort) {}

  execute(roomId: string): DashboardSnapshot {
    const current = this.repository.getSnapshot();
    const updatedRooms = current.rooms.map((room) =>
      room.id === roomId ? { ...room, pendingWatering: false } : room,
    );
    return this.repository.saveSnapshot({
      ...current,
      rooms: updatedRooms,
    });
  }
}

export class ToggleFocusFavoriteUseCase {
  constructor(private readonly repository: DashboardRepositoryPort) {}

  execute(): DashboardSnapshot {
    const current = this.repository.getSnapshot();
    return this.repository.saveSnapshot({
      ...current,
      focusPlant: {
        ...current.focusPlant,
        isFavorite: !current.focusPlant.isFavorite,
      },
    });
  }
}

export class AdjustHumidifierUseCase {
  constructor(private readonly repository: DashboardRepositoryPort) {}

  execute(delta: number): DashboardSnapshot {
    const current = this.repository.getSnapshot();
    return this.repository.saveSnapshot({
      ...current,
      humidityPercent: clampHumidityLevel(current.humidityPercent + delta),
    });
  }
}

export class TriggerPlannedFeatureNoticeUseCase {
  constructor(private readonly repository: DashboardRepositoryPort) {}

  execute(featureLabel: string): DashboardSnapshot {
    const current = this.repository.getSnapshot();
    return this.repository.saveSnapshot({
      ...current,
      lastNotice: `${featureLabel}: disponível em breve nos próximos módulos.`,
    });
  }
}

export class RegisterPwaUseCase {
  constructor(private readonly pwaPort: PwaRegistrationPort) {}

  execute(): Promise<boolean> {
    return this.pwaPort.registerServiceWorker();
  }
}
