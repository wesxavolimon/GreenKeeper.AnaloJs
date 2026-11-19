import { RouteMeta } from '@analogjs/router';
import { Component, inject, signal } from '@angular/core';
import {
  AdjustHumidifierUseCase,
  CompletePlantTaskUseCase,
  LoadDashboardUseCase,
  SelectRoomUseCase,
  ToggleFocusFavoriteUseCase,
  TriggerPlannedFeatureNoticeUseCase,
} from '@application/index';
import {
  countPendingTasks,
  DashboardSnapshot,
  getActiveRoom,
  RoomPlantSummary,
} from '@domain/index';
import { mobileOnlyGuard } from '../guards/mobile-only.guard';

export const routeMeta: RouteMeta = {
  title: 'GreenKeeper - Cuidados Botânicos',
  canActivate: [mobileOnlyGuard],
};

@Component({
  selector: 'app-home',
  template: `
    <main
      class="w-full min-h-[100dvh] bg-[#F4F6F2] text-[#1A1E1D] flex flex-col relative overflow-x-hidden select-none"
      data-testid="mobile-dashboard"
    >
      <!-- BEGIN: HeaderSection -->
      <section class="pt-5 px-6 pb-2 shrink-0" data-purpose="app-header">
        <div class="flex items-center justify-between mb-1.5">
          <div
            class="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-black/5"
          >
            <svg
              class="w-4 h-4 text-neutral-900"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.2"
              viewBox="0 0 24 24"
            >
              <path
                d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"
              ></path>
              <path d="M2 21c0-3 1.85-5.36 5.08-6"></path>
            </svg>
          </div>
          <button
            type="button"
            aria-label="Notificações"
            data-testid="btn-notifications"
            (click)="onPlannedAction('Notificações')"
            class="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:bg-white/60 transition"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight text-[#111614]">
          Minhas Plantas
        </h1>
        <p
          class="text-[13px] font-medium text-[#7C8580] mt-0.5"
          data-testid="pending-tasks-label"
        >
          {{ pendingCount }} tarefas para hoje
        </p>
        @if (snapshot().lastNotice) {
          <p
            class="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl px-3 py-1.5"
            data-testid="planned-feature-notice"
          >
            {{ snapshot().lastNotice }}
          </p>
        }
      </section>
      <!-- END: HeaderSection -->

      <!-- BEGIN: MainScrollArea -->
      <div
        class="flex-1 overflow-y-auto no-scrollbar px-6 pt-3 pb-28 space-y-5"
        data-purpose="content-area"
      >
        <!-- BEGIN: StackedRoomsContainer -->
        <section class="relative pt-1" data-purpose="stacked-room-cards">
          <!-- Layer 1: Corredor -->
          <div
            role="button"
            tabindex="0"
            data-testid="room-pill-corredor"
            (click)="onSelectRoom('corredor')"
            class="w-full bg-emerald-600 text-white rounded-[28px] px-5 py-3.5 flex items-center justify-between shadow-sm cursor-pointer active:scale-[0.99] transition-transform"
          >
            <span class="text-sm font-bold tracking-tight">Corredor</span>
            <div
              class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"
            >
              <svg
                class="w-3.5 h-3.5 text-white"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="8"></circle>
                <circle cx="12" cy="12" fill="currentColor" r="2.5"></circle>
              </svg>
            </div>
          </div>

          <!-- Layer 2: Sala de Estar -->
          <div
            role="button"
            tabindex="0"
            data-testid="room-pill-sala-estar"
            (click)="onSelectRoom('sala-estar')"
            class="-mt-4 w-full bg-[#1A1E1D] text-white rounded-[28px] px-5 pt-5 pb-3.5 flex items-center justify-between shadow-md cursor-pointer active:scale-[0.99] transition-transform relative z-10"
          >
            <span class="text-sm font-semibold tracking-tight text-neutral-200"
              >Sala de Estar</span
            >
            <div
              class="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center"
            >
              <svg
                class="w-3.5 h-3.5 text-neutral-300"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="8"></circle>
                <circle cx="12" cy="12" fill="currentColor" r="2.5"></circle>
              </svg>
            </div>
          </div>

          <!-- Layer 3: Active Primary Card -->
          <article
            class="-mt-4 w-full bg-white rounded-[34px] p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] relative z-20 overflow-hidden border border-black/[0.03]"
            data-purpose="active-plant-card"
            data-testid="active-plant-card"
          >
            <div class="flex items-center justify-between mb-1 relative z-10">
              <span
                class="text-[11px] font-bold uppercase tracking-wider text-neutral-400"
                data-testid="active-room-name"
              >
                {{ activeRoom.roomName }}
              </span>
              <div
                class="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shadow-inner text-neutral-500"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="8"></circle>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
            </div>

            <h2
              class="text-2xl font-black text-[#111614] tracking-tight relative z-10 mb-6"
              data-testid="active-plant-name"
            >
              {{ activeRoom.plantName }}
            </h2>

            <!-- Plant Cutout Realistic Illustration / Visual Graphic -->
            <div
              class="absolute right-[-10px] bottom-0 w-[58%] h-[82%] pointer-events-none select-none z-0 flex items-end justify-end"
            >
              <svg
                class="w-full h-full object-contain filter drop-shadow-[-12px_15px_15px_rgba(0,0,0,0.14)]"
                fill="none"
                viewBox="0 0 200 240"
              >
                <path
                  d="M110 240 C110 180, 120 150, 130 90"
                  stroke="#2D5A27"
                  stroke-linecap="round"
                  stroke-width="6"
                ></path>
                <path
                  d="M100 240 C100 190, 85 160, 65 110"
                  stroke="#3A6B35"
                  stroke-linecap="round"
                  stroke-width="5"
                ></path>
                <path
                  d="M115 240 C125 190, 140 170, 160 130"
                  stroke="#254D20"
                  stroke-linecap="round"
                  stroke-width="4.5"
                ></path>
                <path
                  d="M130 90 C170 80, 195 105, 185 145 C175 185, 140 170, 130 140 Z"
                  fill="#2E6229"
                ></path>
                <path
                  d="M65 110 C30 95, 10 120, 20 155 C30 190, 60 180, 75 150 Z"
                  fill="#3D7537"
                ></path>
                <g>
                  <path
                    d="M100 210 C70 140, 75 60, 115 25 C155 60, 160 140, 115 220 Z"
                    fill="url(#calatheaGrad)"
                  ></path>
                  <path
                    d="M115 25 C115 90, 112 170, 108 215"
                    opacity="0.85"
                    stroke="#89E443"
                    stroke-linecap="round"
                    stroke-width="2.5"
                  ></path>
                  <path
                    d="M114 60 C130 65, 145 75, 150 90"
                    opacity="0.75"
                    stroke="#A7F96B"
                    stroke-linecap="round"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M114 62 C98 67, 85 78, 80 92"
                    opacity="0.75"
                    stroke="#A7F96B"
                    stroke-linecap="round"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M113 95 C132 102, 146 114, 152 130"
                    opacity="0.75"
                    stroke="#A7F96B"
                    stroke-linecap="round"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M112 97 C93 104, 82 116, 76 132"
                    opacity="0.75"
                    stroke="#A7F96B"
                    stroke-linecap="round"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M110 135 C128 142, 140 155, 145 170"
                    opacity="0.75"
                    stroke="#A7F96B"
                    stroke-linecap="round"
                    stroke-width="2"
                  ></path>
                  <path
                    d="M110 137 C92 144, 84 156, 79 171"
                    opacity="0.75"
                    stroke="#A7F96B"
                    stroke-linecap="round"
                    stroke-width="2"
                  ></path>
                </g>
                <path
                  d="M90 220 C60 180, 70 130, 95 100 C120 130, 125 180, 100 225 Z"
                  fill="#4B8B43"
                  opacity="0.95"
                ></path>
                <path
                  d="M95 100 C95 140, 95 190, 96 220"
                  opacity="0.8"
                  stroke="#9EF01A"
                  stroke-width="1.8"
                ></path>
                <defs>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="calatheaGrad"
                    x1="75"
                    x2="160"
                    y1="25"
                    y2="220"
                  >
                    <stop stop-color="#34752E"></stop>
                    <stop offset="0.5" stop-color="#24551F"></stop>
                    <stop offset="1" stop-color="#143711"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <!-- Metrics Container -->
            <div class="relative z-10 pt-16 flex items-center space-x-6">
              <div data-purpose="metric-water">
                <span
                  class="block text-2xl font-black text-neutral-900 tracking-tight leading-none"
                  data-testid="metric-water"
                >
                  {{ activeRoom.metrics.waterPercent }}%
                </span>
                <div class="flex items-center space-x-1.5 mt-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
                  <span class="text-[11px] font-semibold text-neutral-400"
                    >Água</span
                  >
                </div>
              </div>
              <div class="h-7 w-[1px] bg-neutral-200"></div>
              <div data-purpose="metric-light">
                <span
                  class="block text-2xl font-black text-neutral-900 tracking-tight leading-none"
                  data-testid="metric-light"
                >
                  {{ activeRoom.metrics.lightPercent }}%
                </span>
                <div class="flex items-center space-x-1.5 mt-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
                  <span class="text-[11px] font-semibold text-neutral-400"
                    >Luz</span
                  >
                </div>
              </div>
            </div>

            <!-- Bottom Action Badge -->
            <div
              class="relative z-10 mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between"
            >
              <span
                class="text-[11px] font-bold text-neutral-500 uppercase tracking-wider flex items-center"
                data-testid="watering-status-label"
              >
                <span
                  class="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse"
                ></span>
                {{ wateringStatusLabel }}
              </span>
              <button
                type="button"
                data-testid="btn-complete-watering"
                (click)="onCompleteWatering()"
                class="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-600 hover:text-white transition px-3 py-1.5 rounded-full"
              >
                Concluir
              </button>
            </div>
          </article>
        </section>
        <!-- END: StackedRoomsContainer -->

        <!-- BEGIN: PlantInspectionCard -->
        <section
          class="glass-card rounded-[32px] p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] border border-white relative overflow-hidden"
          data-purpose="daily-tasks-card"
        >
          <div class="flex items-center justify-between mb-4">
            <div>
              <span
                class="text-[10px] font-extrabold uppercase tracking-widest text-[#7C8580]"
                >Planta em Foco</span
              >
              <h3 class="text-lg font-bold text-neutral-900">
                {{ snapshot().focusPlant.plantName }}
              </h3>
            </div>
            <button
              type="button"
              aria-label="Favoritar"
              data-testid="btn-favorite-focus"
              (click)="onToggleFavorite()"
              class="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-neutral-400 hover:text-amber-500 transition"
            >
              <svg
                class="w-4 h-4 fill-none stroke-current"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                ></polygon>
              </svg>
            </button>
          </div>

          <!-- Task Item: Rega -->
          <div
            class="bg-emerald-600 text-white rounded-2xl p-3 flex items-center justify-between shadow-md mb-2.5"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-xs"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
              </div>
              <div>
                <p
                  class="text-[10px] font-bold uppercase tracking-wider text-emerald-100"
                >
                  Rega
                </p>
                <p class="text-xs font-bold text-white">1-2 vezes na semana</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Opções de Rega"
              data-testid="btn-rega-options"
              (click)="onPlannedAction('Opções de Rega')"
              class="p-1 text-emerald-100 hover:text-white"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="6" r="1.8"></circle>
                <circle cx="12" cy="12" r="1.8"></circle>
                <circle cx="12" cy="18" r="1.8"></circle>
              </svg>
            </button>
          </div>

          <!-- Task Item: Inspeção -->
          <div
            class="bg-white/90 rounded-2xl p-3 flex items-center justify-between shadow-xs border border-white"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-neutral-700"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path
                    d="M2.5 12c1.7-4.4 5.7-7.5 9.5-7.5s7.8 3.1 9.5 7.5c-1.7 4.4-5.7 7.5-9.5 7.5S4.2 16.4 2.5 12z"
                  ></path>
                </svg>
              </div>
              <div>
                <p
                  class="text-[10px] font-bold uppercase tracking-wider text-neutral-400"
                >
                  Inspeção
                </p>
                <p class="text-xs font-bold text-neutral-800">
                  2 vezes por mês
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Opções de Inspeção"
              data-testid="btn-inspecao-options"
              (click)="onPlannedAction('Opções de Inspeção')"
              class="p-1 text-neutral-400 hover:text-neutral-900"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="6" r="1.8"></circle>
                <circle cx="12" cy="12" r="1.8"></circle>
                <circle cx="12" cy="18" r="1.8"></circle>
              </svg>
            </button>
          </div>
        </section>
        <!-- END: PlantInspectionCard -->

        <!-- BEGIN: ClimateAndHumidityWidget -->
        <section
          class="bg-[#1A1E1D] text-white rounded-[32px] p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] relative overflow-hidden"
          data-purpose="climate-widget"
        >
          <div
            class="absolute right-3 top-3 w-36 h-28 pointer-events-none opacity-90 flex flex-wrap gap-1.5 justify-end p-2"
          >
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500/20"></div>
            <div class="w-2 h-2 rounded-full bg-emerald-500/40"></div>
            <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
            <div class="w-1.5 h-1.5 rounded-full bg-white/40"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-white"></div>
            <div class="w-3.5 h-3.5 rounded-full bg-emerald-400"></div>
            <div class="w-2 h-2 rounded-full bg-emerald-500/80"></div>
            <div class="w-3 h-3 rounded-full bg-white/60"></div>
            <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500/30"></div>
            <div class="w-3 h-3 rounded-full bg-emerald-400/70"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-white/80"></div>
          </div>
          <div class="relative z-10">
            <span
              class="text-3xl font-black tracking-tight text-white"
              data-testid="humidity-percent"
            >
              {{ snapshot().humidityPercent }}%
            </span>
            <p class="text-xs font-medium text-neutral-400 mt-0.5">
              Umidade do Ambiente Ideal
            </p>
          </div>
          <div class="mt-6 flex items-center justify-between relative z-10">
            <button
              type="button"
              aria-label="Diminuir"
              data-testid="btn-humidity-decrease"
              (click)="onAdjustHumidity(-1)"
              class="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center hover:scale-105 hover:bg-emerald-500 active:scale-95 transition shadow-sm"
            >
              <svg
                class="w-4 h-4 stroke-[3]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <line x1="5" x2="19" y1="12" y2="12"></line>
              </svg>
            </button>
            <span
              class="text-xs font-semibold uppercase tracking-wider text-neutral-300"
              >Nível Umidificador</span
            >
            <button
              type="button"
              aria-label="Aumentar"
              data-testid="btn-humidity-increase"
              (click)="onAdjustHumidity(1)"
              class="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center hover:scale-105 hover:bg-emerald-500 active:scale-95 transition shadow-sm"
            >
              <svg
                class="w-4 h-4 stroke-[3]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <line x1="12" x2="12" y1="5" y2="19"></line>
                <line x1="5" x2="19" y1="12" y2="12"></line>
              </svg>
            </button>
          </div>
        </section>
        <!-- END: ClimateAndHumidityWidget -->
      </div>
      <!-- END: MainScrollArea -->

      <!-- BEGIN: FloatingBottomNavigation -->
      <nav
        class="absolute bottom-5 inset-x-0 mx-auto flex items-center justify-center z-40 pointer-events-none"
        data-purpose="floating-dock"
      >
        <button
          type="button"
          aria-label="Câmera"
          data-testid="btn-camera"
          (click)="onPlannedAction('Câmera')"
          class="w-12 h-12 rounded-full flex items-center justify-center text-neutral-900 transition hover:scale-105 active:scale-95 pointer-events-auto relative border-2 border-neutral-900/30 shadow-md bg-white/80"
        >
          <svg
            class="w-6 h-6 fill-none stroke-current"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.2"
            viewBox="0 0 24 24"
          >
            <path
              d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
            ></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        </button>
      </nav>
      <!-- END: FloatingBottomNavigation -->
    </main>
  `,
})
export default class Home {
  private readonly loadDashboard = inject(LoadDashboardUseCase);
  private readonly selectRoom = inject(SelectRoomUseCase);
  private readonly completePlantTask = inject(CompletePlantTaskUseCase);
  private readonly toggleFocusFavorite = inject(ToggleFocusFavoriteUseCase);
  private readonly adjustHumidifier = inject(AdjustHumidifierUseCase);
  private readonly triggerPlannedFeature = inject(
    TriggerPlannedFeatureNoticeUseCase,
  );

  readonly snapshot = signal<DashboardSnapshot>(this.loadDashboard.execute());

  get activeRoom(): RoomPlantSummary {
    return getActiveRoom(this.snapshot());
  }

  get pendingCount(): number {
    return countPendingTasks(this.snapshot());
  }

  get wateringStatusLabel(): string {
    return this.activeRoom.pendingWatering ? 'Rega Pendente' : 'Rega em Dia';
  }

  onSelectRoom(roomId: string): void {
    this.snapshot.set(this.selectRoom.execute(roomId));
  }

  onCompleteWatering(): void {
    this.snapshot.set(this.completePlantTask.execute(this.activeRoom.id));
  }

  onToggleFavorite(): void {
    this.snapshot.set(this.toggleFocusFavorite.execute());
  }

  onAdjustHumidity(delta: number): void {
    this.snapshot.set(this.adjustHumidifier.execute(delta));
  }

  onPlannedAction(label: string): void {
    this.snapshot.set(this.triggerPlannedFeature.execute(label));
  }
}
