import { DashboardRepositoryPort } from '@application/index';
import { DashboardSnapshot } from '@domain/index';

export const INITIAL_BOTANICAL_SNAPSHOT: DashboardSnapshot = {
  activeRoomId: 'banheiro',
  rooms: [
    {
      id: 'corredor',
      roomName: 'Corredor',
      plantName: 'Jiboia Prateada',
      tone: 'emerald',
      metrics: { waterPercent: 62, lightPercent: 74 },
      pendingWatering: false,
    },
    {
      id: 'sala-estar',
      roomName: 'Sala de Estar',
      plantName: 'Monstera Deliciosa',
      tone: 'charcoal',
      metrics: { waterPercent: 45, lightPercent: 88 },
      pendingWatering: false,
    },
    {
      id: 'banheiro',
      roomName: 'Banheiro',
      plantName: 'Calathea',
      tone: 'light',
      metrics: { waterPercent: 18, lightPercent: 98 },
      pendingWatering: true,
    },
  ],
  focusPlant: {
    plantName: 'Aloe Arborescens',
    isFavorite: false,
    tasks: [
      {
        id: 'focus-rega',
        category: 'Rega',
        frequencyLabel: '1-2 vezes na semana',
        tone: 'emerald',
        completed: false,
      },
      {
        id: 'focus-inspecao',
        category: 'Inspeção',
        frequencyLabel: '2 vezes por mês',
        tone: 'white',
        completed: false,
      },
    ],
  },
  humidityPercent: 64,
  lastNotice: null,
};

export class InMemoryDashboardRepository implements DashboardRepositoryPort {
  private snapshot: DashboardSnapshot;

  constructor(seed: DashboardSnapshot = INITIAL_BOTANICAL_SNAPSHOT) {
    this.snapshot = seed;
  }

  getSnapshot(): DashboardSnapshot {
    return this.snapshot;
  }

  saveSnapshot(snapshot: DashboardSnapshot): DashboardSnapshot {
    this.snapshot = snapshot;
    return this.snapshot;
  }
}
