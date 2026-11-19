import { Component } from '@angular/core';

@Component({
  selector: 'app-desktop-info',
  template: `
    <main
      class="min-h-[100dvh] w-full bg-[#F4F6F2] text-[#1A1E1D] flex items-center justify-center p-6"
      data-testid="desktop-info-page"
    >
      <section
        class="max-w-xl w-full bg-white rounded-[36px] p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] border border-black/[0.04]"
      >
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div
              class="w-11 h-11 rounded-full bg-[#1A1E1D] flex items-center justify-center shadow-sm"
            >
              <svg
                class="w-5 h-5 text-[#B5FF38]"
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
            <div>
              <span
                class="text-[11px] font-bold uppercase tracking-widest text-[#7C8580]"
                >GreenKeeper</span
              >
              <h1 class="text-xl font-extrabold tracking-tight text-[#111614]">
                Cuidados Botânicos
              </h1>
            </div>
          </div>

          <span
            class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white"
            data-testid="mobile-only-badge"
          >
            Exclusivo para Celular
          </span>
        </div>

        <h2
          class="text-2xl font-black tracking-tight text-[#111614] leading-snug mb-3"
        >
          Este aplicativo funciona exclusivamente em smartphones.
        </h2>
        <p class="text-sm text-[#7C8580] leading-relaxed mb-6">
          O <strong class="text-[#1A1E1D]">GreenKeeper</strong> é um Progressive
          Web App (PWA) projetado especificamente para a experiência móvel no
          celular, permitindo acompanhar ambientes, regas, inspeções e umidade
          de forma rápida no dia a dia.
        </p>

        <div class="bg-[#F4F6F2] rounded-3xl p-5 space-y-3 mb-6">
          <p
            class="text-xs font-extrabold uppercase tracking-wider text-[#1A1E1D]"
          >
            Como usar no seu celular
          </p>
          <ol class="text-sm text-[#1A1E1D] space-y-2 list-decimal list-inside">
            <li>
              Abra este mesmo endereço no navegador do seu
              <strong>smartphone</strong> (Android ou iPhone).
            </li>
            <li>
              No menu do navegador, escolha
              <strong>Adicionar à Tela Inicial</strong> para instalar o PWA.
            </li>
            <li>
              Acesse o painel <strong>Minhas Plantas</strong> diretamente pela
              tela inicial do celular.
            </li>
          </ol>
        </div>

        <div
          class="bg-[#1A1E1D] text-white rounded-3xl p-5 flex items-center justify-between"
        >
          <div>
            <span
              class="text-[10px] font-bold uppercase tracking-widest text-[#B5FF38]"
              >Arquitetura PWA</span
            >
            <p class="text-xs text-neutral-300 mt-1">
              AnalogJS • 100% Frontend • Sem Backend Próprio
            </p>
          </div>
          <span
            class="text-xs font-bold px-3 py-1.5 rounded-full bg-white/10 text-[#B5FF38]"
          >
            Mobile Only
          </span>
        </div>
      </section>
    </main>
  `,
})
export default class DesktopInfoPage {}
