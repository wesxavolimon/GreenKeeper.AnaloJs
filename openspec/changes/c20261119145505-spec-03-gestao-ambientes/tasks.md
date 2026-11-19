# Tasks

## 0. Branch

- [ ] 0.1 **Criar branch `feature/spec-03-gestao-ambientes`**
  - **Comando:** `git checkout develop && git pull && git checkout -b feature/spec-03-gestao-ambientes && git push -u origin feature/spec-03-gestao-ambientes`
  - **Done:** `git branch --show-current` mostra `* feature/spec-03-gestao-ambientes`

---

## 1. Domain — modelos de ambientes

- [ ] 1.1 **Adicionar tipos `HouseType`, `HouseStatus`, `AreaLight` e interfaces `House`, `Area`, `EnvironmentSnapshot` em `src/domain/models.ts`**
  - **O que mudar:** Adicionar ao final do arquivo, após a interface `User`
  - **Novo conteúdo:**
    ```ts
    export type HouseType = 'Residência' | 'Prédio' | 'Comercial';

    export type HouseStatus = 'active' | 'inactive';

    export type AreaLight = 'shadow' | 'half-shadow' | 'full-sun';

    export interface HouseAddress {
      readonly cep: string;
      readonly street: string;
      readonly number: string;
      readonly complement: string;
      readonly district: string;
      readonly city: string;
      readonly state: string;
      readonly latitude: number | null;
      readonly longitude: number | null;
    }

    export interface House {
      readonly id: string;
      readonly ownerId: string;
      readonly name: string;
      readonly type: HouseType;
      readonly address: HouseAddress;
      readonly status: HouseStatus;
      readonly createdAt: string;
      readonly deactivatedAt: string | null;
    }

    export interface Area {
      readonly id: string;
      readonly houseId: string;
      readonly name: string;
      readonly light: AreaLight;
      readonly orientation: string;
      readonly receivesDirectRain: boolean;
    }

    export interface EnvironmentSnapshot {
      readonly ownerId: string;
      readonly houses: readonly House[];
      readonly areas: readonly Area[];
    }
    ```
  - **Contexto:** Decisão 4 do design.md — entidades `House` e `Area` no domain
  - **Done:** `src/domain/models.ts` exporta `House`, `Area`, `HouseType`, `HouseStatus`, `AreaLight`, `HouseAddress` e `EnvironmentSnapshot`

- [ ] 1.2 **Adicionar regras puras de ambientes em `src/domain/rules.ts`**
  - **O que mudar:** Adicionar ao final do arquivo, após `validateSession`
  - **Novo conteúdo:**
    ```ts
    export interface DeactivationCheck {
      readonly allowed: boolean;
      readonly reason: 'no-areas' | 'has-transferable-areas' | 'blocked-single-active-house';
    }

    export function canDeactivateHouse(
      snapshot: EnvironmentSnapshot,
      houseId: string,
    ): DeactivationCheck {
      const areas = snapshot.areas.filter((area) => area.houseId === houseId);
      if (areas.length === 0) {
        return { allowed: true, reason: 'no-areas' };
      }
      const otherActiveHouses = snapshot.houses.filter(
        (house) => house.id !== houseId && house.status === 'active',
      );
      if (otherActiveHouses.length === 0) {
        return { allowed: false, reason: 'blocked-single-active-house' };
      }
      return { allowed: true, reason: 'has-transferable-areas' };
    }

    export function resolveDefaultHouseId(
      snapshot: EnvironmentSnapshot,
    ): string | null {
      const activeHouses = snapshot.houses.filter(
        (house) => house.status === 'active',
      );
      if (activeHouses.length !== 1) {
        return null;
      }
      return activeHouses[0].id;
    }

    export function validateAreaLink(
      snapshot: EnvironmentSnapshot,
      houseId: string,
    ): boolean {
      const house = snapshot.houses.find((item) => item.id === houseId);
      return house !== undefined && house.status === 'active';
    }

    export function summarizeHouseAddress(house: House): string {
      const city = house.address.city.trim();
      const state = house.address.state.trim();
      if (city.length === 0 || state.length === 0) {
        return house.type;
      }
      return `${house.type} · ${city}, ${state}`;
    }
    ```
  - **Contexto:** Decisão 1 do design.md — regras puras de inativação segura, vínculo e seleção padrão
  - **Done:** `src/domain/rules.ts` exporta `canDeactivateHouse`, `resolveDefaultHouseId`, `validateAreaLink` e `summarizeHouseAddress`

- [ ] 1.3 **Atualizar `src/domain/index.ts` para reexportar os novos símbolos**
  - **O que mudar:** Adicionar as exportações de ambientes ao final do arquivo
  - **Novo conteúdo:**
    ```ts
    export * from './models';
    export * from './rules';
    export * from './environments';
    ```
  - **Contexto:** Manter o barrel `src/domain/index.ts` como fonte única de importação do domain
  - **Done:** `src/domain/index.ts` contém `export * from './environments';`

- [ ] 1.4 **Criar `src/domain/environments.ts` com os helpers de ambiente**
  - **O que mudar:** Criar novo arquivo com as regras puras de ambiente
  - **Novo conteúdo:**
    ```ts
    import {
      Area,
      EnvironmentSnapshot,
      House,
      HouseAddress,
      HouseType,
      HouseStatus,
      AreaLight,
    } from './models';

    export interface DeactivationCheck {
      readonly allowed: boolean;
      readonly reason:
        | 'no-areas'
        | 'has-transferable-areas'
        | 'blocked-single-active-house';
    }

    export function canDeactivateHouse(
      snapshot: EnvironmentSnapshot,
      houseId: string,
    ): DeactivationCheck {
      const areas = snapshot.areas.filter((area) => area.houseId === houseId);
      if (areas.length === 0) {
        return { allowed: true, reason: 'no-areas' };
      }
      const otherActiveHouses = snapshot.houses.filter(
        (house) => house.id !== houseId && house.status === 'active',
      );
      if (otherActiveHouses.length === 0) {
        return { allowed: false, reason: 'blocked-single-active-house' };
      }
      return { allowed: true, reason: 'has-transferable-areas' };
    }

    export function resolveDefaultHouseId(
      snapshot: EnvironmentSnapshot,
    ): string | null {
      const activeHouses = snapshot.houses.filter(
        (house) => house.status === 'active',
      );
      if (activeHouses.length !== 1) {
        return null;
      }
      return activeHouses[0].id;
    }

    export function validateAreaLink(
      snapshot: EnvironmentSnapshot,
      houseId: string,
    ): boolean {
      const house = snapshot.houses.find((item) => item.id === houseId);
      return house !== undefined && house.status === 'active';
    }

    export function summarizeHouseAddress(house: House): string {
      const city = house.address.city.trim();
      const state = house.address.state.trim();
      if (city.length === 0 || state.length === 0) {
        return house.type;
      }
      return `${house.type} · ${city}, ${state}`;
    }

    export type {
      Area,
      AreaLight,
      EnvironmentSnapshot,
      House,
      HouseAddress,
      HouseStatus,
      HouseType,
    };
    ```
  - **Contexto:** Decisão 1 e 4 do design.md — separar as regras de ambiente em arquivo próprio para clareza
  - **Done:** `src/domain/environments.ts` exporta `canDeactivateHouse`, `resolveDefaultHouseId`, `validateAreaLink` e `summarizeHouseAddress`

- [ ] 1.5 **Criar `src/domain/environments.spec.ts` com testes unitários**
  - **O que mudar:** Criar novo arquivo de testes cobrindo todas as regras de ambiente
  - **Novo conteúdo:**
    ```ts
    import {
      canDeactivateHouse,
      resolveDefaultHouseId,
      summarizeHouseAddress,
      validateAreaLink,
    } from './environments';
    import { EnvironmentSnapshot, House, Area } from './models';

    const house = (overrides: Partial<House> = {}): House => ({
      id: 'house-1',
      ownerId: 'user-1',
      name: 'Minha Casa',
      type: 'Residência',
      address: {
        cep: '01001-000',
        street: 'Praça da Sé',
        number: '1',
        complement: '',
        district: 'Sé',
        city: 'São Paulo',
        state: 'SP',
        latitude: null,
        longitude: null,
      },
      status: 'active',
      createdAt: '2026-11-19T00:00:00.000Z',
      deactivatedAt: null,
      ...overrides,
    });

    const area = (overrides: Partial<Area> = {}): Area => ({
      id: 'area-1',
      houseId: 'house-1',
      name: 'Sala',
      light: 'full-sun',
      orientation: 'N',
      receivesDirectRain: false,
      ...overrides,
    });

    const snapshot = (overrides: Partial<EnvironmentSnapshot> = {}): EnvironmentSnapshot => ({
      ownerId: 'user-1',
      houses: [house()],
      areas: [area()],
      ...overrides,
    });

    describe('Environment Rules', () => {
      it('allows deactivation when house has no areas', () => {
        expect(canDeactivateHouse(snapshot({ areas: [] }), 'house-1')).toEqual({
          allowed: true,
          reason: 'no-areas',
        });
      });

      it('blocks deactivation when house has areas and no other active house', () => {
        expect(canDeactivateHouse(snapshot(), 'house-1')).toEqual({
          allowed: false,
          reason: 'blocked-single-active-house',
        });
      });

      it('allows deactivation when house has areas and another active house exists', () => {
        const withAnother = snapshot({
          houses: [house(), house({ id: 'house-2', name: 'Casa 2' })],
        });
        expect(canDeactivateHouse(withAnother, 'house-1')).toEqual({
          allowed: true,
          reason: 'has-transferable-areas',
        });
      });

      it('resolves default house id only when exactly one active house exists', () => {
        expect(resolveDefaultHouseId(snapshot())).toBe('house-1');
        expect(
          resolveDefaultHouseId(
            snapshot({ houses: [house(), house({ id: 'house-2' })] }),
          ),
        ).toBeNull();
        expect(
          resolveDefaultHouseId(
            snapshot({ houses: [house({ status: 'inactive' })] }),
          ),
        ).toBeNull();
      });

      it('validates area link only for active houses', () => {
        expect(validateAreaLink(snapshot(), 'house-1')).toBe(true);
        expect(validateAreaLink(snapshot(), 'missing')).toBe(false);
        expect(
          validateAreaLink(
            snapshot({ houses: [house({ status: 'inactive' })] }),
            'house-1',
          ),
        ).toBe(false);
      });

      it('summarizes house address with type and city/state', () => {
        expect(summarizeHouseAddress(house())).toBe('Residência · São Paulo, SP');
        expect(
          summarizeHouseAddress(
            house({
              address: {
                cep: '',
                street: '',
                number: '',
                complement: '',
                district: '',
                city: '',
                state: '',
                latitude: null,
                longitude: null,
              },
            }),
          ),
        ).toBe('Residência');
      });
    });
    ```
  - **Contexto:** Critério de aceitação — 100% de cobertura unitária para o domain
  - **Done:** `npm run test:coverage` passa com 100% para `src/domain/`

- [ ] 1.6 **Commit + push do grupo 1**
  - **Comando:** `git add src/domain/ && git commit -m "feat: add environment domain models and rules" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

---

## 2. Application — port e use cases de ambientes

- [ ] 2.1 **Adicionar `EnvironmentRepositoryPort` em `src/application/ports.ts`**
  - **O que mudar:** Adicionar ao final do arquivo, após `AuthPort`
  - **Novo conteúdo:**
    ```ts
    export interface EnvironmentRepositoryPort {
      getSnapshot(): EnvironmentSnapshot;
      saveSnapshot(snapshot: EnvironmentSnapshot): EnvironmentSnapshot;
    }
    ```
  - **Contexto:** Decisão 2 do design.md — port único com snapshot agregado
  - **Done:** `src/application/ports.ts` exporta `EnvironmentRepositoryPort`

- [ ] 2.2 **Adicionar os use cases de ambientes em `src/application/use-cases.ts`**
  - **O que mudar:** Adicionar ao final do arquivo, após `CheckAuthUseCase`
  - **Novo conteúdo:**
    ```ts
    export class ListEnvironmentsUseCase {
      constructor(private readonly repository: EnvironmentRepositoryPort) {}

      execute(): EnvironmentSnapshot {
        return this.repository.getSnapshot();
      }
    }

    export class SaveHouseUseCase {
      constructor(private readonly repository: EnvironmentRepositoryPort) {}

      execute(
        input: {
          id?: string;
          ownerId: string;
          name: string;
          type: HouseType;
          address: HouseAddress;
          status: HouseStatus;
        },
        actorRole: 'owner' | 'family' = 'owner',
      ): EnvironmentSnapshot {
        if (actorRole !== 'owner') {
          return this.repository.getSnapshot();
        }
        const current = this.repository.getSnapshot();
        const trimmedName = input.name.trim();
        if (trimmedName.length === 0) {
          return current;
        }
        const house: House = {
          id: input.id ?? `house-${current.houses.length + 1}`,
          ownerId: input.ownerId,
          name: trimmedName,
          type: input.type,
          address: input.address,
          status: input.status,
          createdAt:
            current.houses.find((item) => item.id === input.id)?.createdAt ??
            new Date().toISOString(),
          deactivatedAt:
            input.status === 'inactive'
              ? (current.houses.find((item) => item.id === input.id)
                  ?.deactivatedAt ?? new Date().toISOString())
              : null,
        };
        const houses = input.id
          ? current.houses.map((item) => (item.id === input.id ? house : item))
          : [...current.houses, house];
        return this.repository.saveSnapshot({ ...current, houses });
      }
    }

    export class DeactivateHouseUseCase {
      constructor(private readonly repository: EnvironmentRepositoryPort) {}

      execute(houseId: string): EnvironmentSnapshot {
        const current = this.repository.getSnapshot();
        const check = canDeactivateHouse(current, houseId);
        if (!check.allowed) {
          return current;
        }
        const houses = current.houses.map((house) =>
          house.id === houseId
            ? {
                ...house,
                status: 'inactive' as HouseStatus,
                deactivatedAt: house.deactivatedAt ?? new Date().toISOString(),
              }
            : house,
        );
        return this.repository.saveSnapshot({ ...current, houses });
      }
    }

    export class SaveAreaUseCase {
      constructor(private readonly repository: EnvironmentRepositoryPort) {}

      execute(
        input: {
          id?: string;
          houseId: string;
          name: string;
          light: AreaLight;
          orientation: string;
          receivesDirectRain: boolean;
        },
        actorRole: 'owner' | 'family' = 'owner',
      ): EnvironmentSnapshot {
        if (actorRole !== 'owner') {
          return this.repository.getSnapshot();
        }
        const current = this.repository.getSnapshot();
        const trimmedName = input.name.trim();
        if (trimmedName.length === 0 || !validateAreaLink(current, input.houseId)) {
          return current;
        }
        const area: Area = {
          id: input.id ?? `area-${current.areas.length + 1}`,
          houseId: input.houseId,
          name: trimmedName,
          light: input.light,
          orientation: input.orientation,
          receivesDirectRain: input.receivesDirectRain,
        };
        const areas = input.id
          ? current.areas.map((item) => (item.id === input.id ? area : item))
          : [...current.areas, area];
        return this.repository.saveSnapshot({ ...current, areas });
      }
    }

    export class MoveAreaUseCase {
      constructor(private readonly repository: EnvironmentRepositoryPort) {}

      execute(areaId: string, targetHouseId: string): EnvironmentSnapshot {
        const current = this.repository.getSnapshot();
        if (!validateAreaLink(current, targetHouseId)) {
          return current;
        }
        const areas = current.areas.map((area) =>
          area.id === areaId ? { ...area, houseId: targetHouseId } : area,
        );
        return this.repository.saveSnapshot({ ...current, areas });
      }
    }

    export class DeleteAreaUseCase {
      constructor(private readonly repository: EnvironmentRepositoryPort) {}

      execute(areaId: string): EnvironmentSnapshot {
        const current = this.repository.getSnapshot();
        const areas = current.areas.filter((area) => area.id !== areaId);
        if (areas.length === current.areas.length) {
          return current;
        }
        return this.repository.saveSnapshot({ ...current, areas });
      }
    }

    export class ResolveDefaultHouseUseCase {
      constructor(private readonly repository: EnvironmentRepositoryPort) {}

      execute(): { houseId: string | null; blocked: boolean } {
        const current = this.repository.getSnapshot();
        const houseId = resolveDefaultHouseId(current);
        return { houseId, blocked: houseId === null && current.houses.length === 0 };
      }
    }
    ```
  - **Contexto:** UC-01 a UC-09 do use-cases.md; Decisão 2 e 4 do design.md
  - **Done:** `src/application/use-cases.ts` exporta `ListEnvironmentsUseCase`, `SaveHouseUseCase`, `DeactivateHouseUseCase`, `SaveAreaUseCase`, `MoveAreaUseCase`, `DeleteAreaUseCase` e `ResolveDefaultHouseUseCase`

- [ ] 2.3 **Atualizar os imports de `src/application/use-cases.ts`**
  - **O que mudar:** Adicionar os imports de domínio e do novo port ao bloco de imports existente
  - **Novo conteúdo:**
    ```ts
    import {
      Area,
      AreaLight,
      canDeactivateHouse,
      clampHumidityLevel,
      DashboardSnapshot,
      DeviceAccessDecision,
      EnvironmentSnapshot,
      evaluateDeviceAccess,
      House,
      HouseAddress,
      HouseStatus,
      HouseType,
      resolveDefaultHouseId,
      User,
      validateAreaLink,
    } from '@domain/index';
    import {
      AppConfigPort,
      AuthPort,
      DashboardRepositoryPort,
      DeviceSignalsPort,
      EnvironmentRepositoryPort,
      PwaRegistrationPort,
    } from './ports';
    ```
  - **Contexto:** Manter imports mínimos e alinhados ao barrel `@domain/index`
  - **Done:** `src/application/use-cases.ts` importa `EnvironmentRepositoryPort` e os símbolos de ambiente

- [ ] 2.4 **Criar `src/application/environments.spec.ts` com testes unitários**
  - **O que mudar:** Criar novo arquivo de testes cobrindo os use cases de ambiente com um repositório fake
  - **Novo conteúdo:**
    ```ts
    import {
      DeactivateHouseUseCase,
      DeleteAreaUseCase,
      ListEnvironmentsUseCase,
      MoveAreaUseCase,
      ResolveDefaultHouseUseCase,
      SaveAreaUseCase,
      SaveHouseUseCase,
    } from './use-cases';
    import { EnvironmentSnapshot, House, Area } from '@domain/index';

    const baseHouse: House = {
      id: 'house-1',
      ownerId: 'user-1',
      name: 'Minha Casa',
      type: 'Residência',
      address: {
        cep: '01001-000',
        street: 'Praça da Sé',
        number: '1',
        complement: '',
        district: 'Sé',
        city: 'São Paulo',
        state: 'SP',
        latitude: null,
        longitude: null,
      },
      status: 'active',
      createdAt: '2026-11-19T00:00:00.000Z',
      deactivatedAt: null,
    };

    const baseArea: Area = {
      id: 'area-1',
      houseId: 'house-1',
      name: 'Sala',
      light: 'full-sun',
      orientation: 'N',
      receivesDirectRain: false,
    };

    const makeRepo = (initial: EnvironmentSnapshot) => {
      let snapshot = initial;
      return {
        getSnapshot: () => snapshot,
        saveSnapshot: (next: EnvironmentSnapshot) => {
          snapshot = next;
          return snapshot;
        },
      };
    };

    const initialSnapshot: EnvironmentSnapshot = {
      ownerId: 'user-1',
      houses: [baseHouse],
      areas: [baseArea],
    };

    describe('Environment Use Cases', () => {
      it('lists environments', () => {
        const useCase = new ListEnvironmentsUseCase(makeRepo(initialSnapshot));
        expect(useCase.execute().houses).toHaveLength(1);
      });

      it('saves a new house with generated id and current timestamp', () => {
        const repo = makeRepo({ ownerId: 'user-1', houses: [], areas: [] });
        const useCase = new SaveHouseUseCase(repo);
        const next = useCase.execute({
          ownerId: 'user-1',
          name: 'Casa Nova',
          type: 'Prédio',
          address: baseHouse.address,
          status: 'active',
        });
        expect(next.houses).toHaveLength(1);
        expect(next.houses[0].id).toBe('house-1');
        expect(next.houses[0].deactivatedAt).toBeNull();
      });

      it('rejects house save with blank name', () => {
        const repo = makeRepo(initialSnapshot);
        const useCase = new SaveHouseUseCase(repo);
        const next = useCase.execute({
          ownerId: 'user-1',
          name: '   ',
          type: 'Residência',
          address: baseHouse.address,
          status: 'active',
        });
        expect(next.houses).toHaveLength(1);
      });

      it('rejects house save for family role', () => {
        const repo = makeRepo(initialSnapshot);
        const useCase = new SaveHouseUseCase(repo);
        const next = useCase.execute(
          {
            ownerId: 'user-1',
            name: 'Casa Nova',
            type: 'Prédio',
            address: baseHouse.address,
            status: 'active',
          },
          'family',
        );
        expect(next.houses).toHaveLength(1);
      });

      it('updates an existing house preserving id and createdAt', () => {
        const repo = makeRepo(initialSnapshot);
        const useCase = new SaveHouseUseCase(repo);
        const next = useCase.execute({
          id: 'house-1',
          ownerId: 'user-1',
          name: 'Casa Editada',
          type: 'Comercial',
          address: baseHouse.address,
          status: 'active',
        });
        expect(next.houses[0].id).toBe('house-1');
        expect(next.houses[0].name).toBe('Casa Editada');
        expect(next.houses[0].createdAt).toBe(baseHouse.createdAt);
      });

      it('deactivates a house without areas', () => {
        const repo = makeRepo({ ownerId: 'user-1', houses: [baseHouse], areas: [] });
        const useCase = new DeactivateHouseUseCase(repo);
        const next = useCase.execute('house-1');
        expect(next.houses[0].status).toBe('inactive');
        expect(next.houses[0].deactivatedAt).not.toBeNull();
      });

      it('blocks deactivation of single active house with areas', () => {
        const repo = makeRepo(initialSnapshot);
        const useCase = new DeactivateHouseUseCase(repo);
        const next = useCase.execute('house-1');
        expect(next.houses[0].status).toBe('active');
      });

      it('saves a new area linked to an active house', () => {
        const repo = makeRepo(initialSnapshot);
        const useCase = new SaveAreaUseCase(repo);
        const next = useCase.execute({
          houseId: 'house-1',
          name: 'Varanda',
          light: 'half-shadow',
          orientation: 'L',
          receivesDirectRain: true,
        });
        expect(next.areas).toHaveLength(2);
        expect(next.areas[1].id).toBe('area-2');
      });

      it('rejects area save with blank name', () => {
        const repo = makeRepo(initialSnapshot);
        const useCase = new SaveAreaUseCase(repo);
        const next = useCase.execute({
          houseId: 'house-1',
          name: ' ',
          light: 'shadow',
          orientation: 'N',
          receivesDirectRain: false,
        });
        expect(next.areas).toHaveLength(1);
      });

      it('rejects area save linked to inactive house', () => {
        const repo = makeRepo({
          ownerId: 'user-1',
          houses: [{ ...baseHouse, status: 'inactive' }],
          areas: [],
        });
        const useCase = new SaveAreaUseCase(repo);
        const next = useCase.execute({
          houseId: 'house-1',
          name: 'Varanda',
          light: 'shadow',
          orientation: 'N',
          receivesDirectRain: false,
        });
        expect(next.areas).toHaveLength(0);
      });

      it('rejects area save for family role', () => {
        const repo = makeRepo(initialSnapshot);
        const useCase = new SaveAreaUseCase(repo);
        const next = useCase.execute(
          {
            houseId: 'house-1',
            name: 'Varanda',
            light: 'shadow',
            orientation: 'N',
            receivesDirectRain: false,
          },
          'family',
        );
        expect(next.areas).toHaveLength(1);
      });

      it('moves an area to another active house', () => {
        const repo = makeRepo({
          ownerId: 'user-1',
          houses: [baseHouse, { ...baseHouse, id: 'house-2', name: 'Casa 2' }],
          areas: [baseArea],
        });
        const useCase = new MoveAreaUseCase(repo);
        const next = useCase.execute('area-1', 'house-2');
        expect(next.areas[0].houseId).toBe('house-2');
      });

      it('rejects moving an area to an inactive house', () => {
        const repo = makeRepo({
          ownerId: 'user-1',
          houses: [baseHouse, { ...baseHouse, id: 'house-2', status: 'inactive' }],
          areas: [baseArea],
        });
        const useCase = new MoveAreaUseCase(repo);
        const next = useCase.execute('area-1', 'house-2');
        expect(next.areas[0].houseId).toBe('house-1');
      });

      it('deletes an existing area', () => {
        const repo = makeRepo(initialSnapshot);
        const useCase = new DeleteAreaUseCase(repo);
        const next = useCase.execute('area-1');
        expect(next.areas).toHaveLength(0);
      });

      it('keeps snapshot unchanged when deleting a missing area', () => {
        const repo = makeRepo(initialSnapshot);
        const useCase = new DeleteAreaUseCase(repo);
        const next = useCase.execute('missing');
        expect(next.areas).toHaveLength(1);
      });

      it('resolves default house id and blocked flag', () => {
        const single = new ResolveDefaultHouseUseCase(makeRepo(initialSnapshot));
        expect(single.execute()).toEqual({ houseId: 'house-1', blocked: false });

        const none = new ResolveDefaultHouseUseCase(
          makeRepo({ ownerId: 'user-1', houses: [], areas: [] }),
        );
        expect(none.execute()).toEqual({ houseId: null, blocked: true });

        const multiple = new ResolveDefaultHouseUseCase(
          makeRepo({
            ownerId: 'user-1',
            houses: [baseHouse, { ...baseHouse, id: 'house-2' }],
            areas: [],
          }),
        );
        expect(multiple.execute()).toEqual({ houseId: null, blocked: false });
      });
    });
    ```
  - **Contexto:** UC-01 a UC-09 do use-cases.md; critério de 100% de cobertura
  - **Done:** `npm run test:coverage` passa com 100% para `src/application/`

- [ ] 2.5 **Commit + push do grupo 2**
  - **Comando:** `git add src/application/ && git commit -m "feat: add environment application port and use cases" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

---

## 3. Infrastructure — adapter em memória

- [ ] 3.1 **Criar `src/infrastructure/in-memory-environment.repository.ts`**
  - **O que mudar:** Criar novo arquivo com o adapter em memória
  - **Novo conteúdo:**
    ```ts
    import { EnvironmentRepositoryPort } from '@application/index';
    import { EnvironmentSnapshot } from '@domain/index';

    export const INITIAL_ENVIRONMENT_SNAPSHOT: EnvironmentSnapshot = {
      ownerId: 'user-1',
      houses: [
        {
          id: 'house-1',
          ownerId: 'user-1',
          name: 'Minha Casa',
          type: 'Residência',
          address: {
            cep: '01001-000',
            street: 'Praça da Sé',
            number: '1',
            complement: '',
            district: 'Sé',
            city: 'São Paulo',
            state: 'SP',
            latitude: null,
            longitude: null,
          },
          status: 'active',
          createdAt: '2026-11-19T00:00:00.000Z',
          deactivatedAt: null,
        },
      ],
      areas: [
        {
          id: 'area-1',
          houseId: 'house-1',
          name: 'Sala',
          light: 'full-sun',
          orientation: 'N',
          receivesDirectRain: false,
        },
      ],
    };

    export class InMemoryEnvironmentRepository
      implements EnvironmentRepositoryPort
    {
      private snapshot: EnvironmentSnapshot;

      constructor(seed: EnvironmentSnapshot = INITIAL_ENVIRONMENT_SNAPSHOT) {
        this.snapshot = seed;
      }

      getSnapshot(): EnvironmentSnapshot {
        return this.snapshot;
      }

      saveSnapshot(snapshot: EnvironmentSnapshot): EnvironmentSnapshot {
        this.snapshot = snapshot;
        return this.snapshot;
      }
    }
    ```
  - **Contexto:** Decisão 3 do design.md — adapter em memória inicial, port isolado para futuro Supabase
  - **Done:** `src/infrastructure/in-memory-environment.repository.ts` implementa `EnvironmentRepositoryPort`

- [ ] 3.2 **Atualizar `src/infrastructure/index.ts` para exportar o novo adapter**
  - **O que mudar:** Adicionar a linha de export ao final do arquivo
  - **Novo conteúdo:**
    ```ts
    export * from './in-memory-dashboard.repository';
    export * from './in-memory-environment.repository';
    export * from './vite-env-config.adapter';
    export * from './browser-device-signals.adapter';
    export * from './browser-pwa-registration.adapter';
    export * from './auth0.adapter';
    ```
  - **Contexto:** Manter o barrel de infraestrutura como fonte única
  - **Done:** `src/infrastructure/index.ts` contém `export * from './in-memory-environment.repository';`

- [ ] 3.3 **Adicionar testes do adapter em `src/infrastructure/infrastructure.spec.ts`**
  - **O que mudar:** Adicionar um bloco `describe` ao final do arquivo existente
  - **Novo conteúdo:**
    ```ts
    describe('InMemoryEnvironmentRepository', () => {
      it('stores and returns environment snapshots', () => {
        const repo = new InMemoryEnvironmentRepository();
        const initial = repo.getSnapshot();
        expect(initial.houses).toHaveLength(1);
        expect(initial.areas).toHaveLength(1);

        const updated = repo.saveSnapshot({
          ...initial,
          houses: [],
          areas: [],
        });
        expect(updated.houses).toHaveLength(0);
        expect(repo.getSnapshot().areas).toHaveLength(0);
      });

      it('accepts a custom seed snapshot', () => {
        const seed = {
          ownerId: 'user-2',
          houses: [],
          areas: [],
        };
        const repo = new InMemoryEnvironmentRepository(seed);
        expect(repo.getSnapshot().ownerId).toBe('user-2');
      });
    });
    ```
  - **Contexto:** Critério de 100% de cobertura para `src/infrastructure/`
  - **Done:** `npm run test:coverage` passa com 100% para `src/infrastructure/`

- [ ] 3.4 **Commit + push do grupo 3**
  - **Comando:** `git add src/infrastructure/ && git commit -m "feat: add in-memory environment repository adapter" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

---

## 4. Composition — DI wiring

- [ ] 4.1 **Registrar `ENVIRONMENT_REPOSITORY_PORT` e os use cases em `src/composition/index.ts`**
  - **O que mudar:** Adicionar o token, os imports e os providers
  - **Novo conteúdo:**
    ```ts
    import {
      AdjustHumidifierUseCase,
      AppConfigPort,
      AuthPort,
      CheckAuthUseCase,
      CompletePlantTaskUseCase,
      DashboardRepositoryPort,
      DeactivateHouseUseCase,
      DeleteAreaUseCase,
      DeviceSignalsPort,
      EnvironmentRepositoryPort,
      EvaluateDeviceAccessUseCase,
      ListEnvironmentsUseCase,
      LoadDashboardUseCase,
      LoginUseCase,
      LogoutUseCase,
      MoveAreaUseCase,
      PwaRegistrationPort,
      RegisterPwaUseCase,
      ResolveDefaultHouseUseCase,
      SaveAreaUseCase,
      SaveHouseUseCase,
      SelectRoomUseCase,
      ToggleFocusFavoriteUseCase,
      TriggerPlannedFeatureNoticeUseCase,
    } from '@application/index';
    import {
      Auth0Adapter,
      BrowserDeviceSignalsAdapter,
      BrowserPwaRegistrationAdapter,
      InMemoryDashboardRepository,
      InMemoryEnvironmentRepository,
      ViteEnvConfigAdapter,
    } from '@infrastructure/index';

    export const ENVIRONMENT_REPOSITORY_PORT =
      new InjectionToken<EnvironmentRepositoryPort>('ENVIRONMENT_REPOSITORY_PORT');
    ```
  - **Contexto:** Decisão 4 do design.md — composition conhece todos os adapters
  - **Done:** `src/composition/index.ts` exporta `ENVIRONMENT_REPOSITORY_PORT`

- [ ] 4.2 **Adicionar os providers de ambiente em `src/composition/index.ts`**
  - **O que mudar:** Adicionar ao array retornado por `provideGreenKeeperDependencies`, após o provider de `AUTH_PORT`
  - **Novo conteúdo:**
    ```ts
    {
      provide: ENVIRONMENT_REPOSITORY_PORT,
      useFactory: () => new InMemoryEnvironmentRepository(),
    },
    {
      provide: ListEnvironmentsUseCase,
      useFactory: (repo: EnvironmentRepositoryPort) =>
        new ListEnvironmentsUseCase(repo),
      deps: [ENVIRONMENT_REPOSITORY_PORT],
    },
    {
      provide: SaveHouseUseCase,
      useFactory: (repo: EnvironmentRepositoryPort) =>
        new SaveHouseUseCase(repo),
      deps: [ENVIRONMENT_REPOSITORY_PORT],
    },
    {
      provide: DeactivateHouseUseCase,
      useFactory: (repo: EnvironmentRepositoryPort) =>
        new DeactivateHouseUseCase(repo),
      deps: [ENVIRONMENT_REPOSITORY_PORT],
    },
    {
      provide: SaveAreaUseCase,
      useFactory: (repo: EnvironmentRepositoryPort) =>
        new SaveAreaUseCase(repo),
      deps: [ENVIRONMENT_REPOSITORY_PORT],
    },
    {
      provide: MoveAreaUseCase,
      useFactory: (repo: EnvironmentRepositoryPort) =>
        new MoveAreaUseCase(repo),
      deps: [ENVIRONMENT_REPOSITORY_PORT],
    },
    {
      provide: DeleteAreaUseCase,
      useFactory: (repo: EnvironmentRepositoryPort) =>
        new DeleteAreaUseCase(repo),
      deps: [ENVIRONMENT_REPOSITORY_PORT],
    },
    {
      provide: ResolveDefaultHouseUseCase,
      useFactory: (repo: EnvironmentRepositoryPort) =>
        new ResolveDefaultHouseUseCase(repo),
      deps: [ENVIRONMENT_REPOSITORY_PORT],
    },
    ```
  - **Contexto:** Decisão 4 do design.md — DI ligando port → adapter
  - **Done:** `src/composition/index.ts` registra os providers de ambiente

- [ ] 4.3 **Atualizar `src/composition/composition.spec.ts`**
  - **O que mudar:** Adicionar asserções dos novos use cases no teste existente
  - **Novo conteúdo:**
    ```ts
    import {
      AdjustHumidifierUseCase,
      CheckAuthUseCase,
      CompletePlantTaskUseCase,
      DeactivateHouseUseCase,
      DeleteAreaUseCase,
      EvaluateDeviceAccessUseCase,
      ListEnvironmentsUseCase,
      LoadDashboardUseCase,
      LoginUseCase,
      LogoutUseCase,
      MoveAreaUseCase,
      RegisterPwaUseCase,
      ResolveDefaultHouseUseCase,
      SaveAreaUseCase,
      SaveHouseUseCase,
      SelectRoomUseCase,
      ToggleFocusFavoriteUseCase,
      TriggerPlannedFeatureNoticeUseCase,
    } from '@application/index';
    ```
  - **Contexto:** Critério de 100% de cobertura para `src/composition/`
  - **Done:** `npm run test:coverage` passa com 100% para `src/composition/`

- [ ] 4.4 **Commit + push do grupo 4**
  - **Comando:** `git add src/composition/ && git commit -m "feat: wire environment port to in-memory adapter in DI" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

---

## 5. App — telas de ambientes

- [ ] 5.1 **Criar `src/app/pages/environments.page.ts`**
  - **O que mudar:** Criar nova página AnalogJS com a lista de casas expansível
  - **Novo conteúdo:**
    ```ts
    import { RouteMeta } from '@analogjs/router';
    import { Component, inject, signal } from '@angular/core';
    import { Router } from '@angular/router';
    import {
      ListEnvironmentsUseCase,
      ResolveDefaultHouseUseCase,
    } from '@application/index';
    import {
      Area,
      EnvironmentSnapshot,
      House,
      summarizeHouseAddress,
    } from '@domain/index';
    import { mobileOnlyGuard } from '../guards/mobile-only.guard';
    import { authGuard } from '../guards/auth.guard';

    export const routeMeta: RouteMeta = {
      title: 'GreenKeeper - Ambientes',
      canActivate: [mobileOnlyGuard, authGuard],
    };

    interface HouseViewModel {
      readonly house: House;
      readonly summary: string;
      readonly areas: readonly Area[];
      readonly expanded: boolean;
    }

    @Component({
      selector: 'app-environments',
      template: `
        <main
          class="w-full min-h-[100dvh] bg-[#F4F6F2] text-[#1A1E1D] flex flex-col"
          data-testid="environments-page"
        >
          <header class="pt-5 px-6 pb-2 flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-extrabold tracking-tight text-[#111614]">
                Ambientes
              </h1>
              <p class="text-[13px] font-medium text-[#7C8580] mt-0.5">
                Casas e áreas dos seus cuidados
              </p>
            </div>
            <button
              type="button"
              aria-label="Nova casa"
              data-testid="btn-new-house"
              (click)="onNewHouse()"
              class="w-10 h-10 rounded-full bg-[#1A1E1D] text-white font-bold flex items-center justify-center"
            >
              +
            </button>
          </header>

          @if (snapshot().houses.length === 0) {
            <section
              class="flex-1 flex flex-col items-center justify-center px-6 text-center"
              data-testid="environments-empty"
            >
              <p class="text-base font-semibold text-[#111614]">
                Você ainda não cadastrou casas
              </p>
              <p class="text-[13px] text-[#7C8580] mt-1 mb-4">
                Cadastre sua primeira casa para organizar as plantas por ambiente.
              </p>
              <button
                type="button"
                data-testid="btn-first-house"
                (click)="onNewHouse()"
                class="px-5 py-2.5 bg-[#1A1E1D] text-white font-bold rounded-full"
              >
                Cadastrar primeira casa
              </button>
            </section>
          } @else {
            <div class="flex-1 overflow-y-auto no-scrollbar px-6 pt-3 pb-28 space-y-3">
              @for (item of viewModels(); track item.house.id) {
                <section
                  class="bg-white rounded-[28px] px-5 py-4 shadow-sm border border-black/[0.04]"
                  data-testid="house-card-{{ item.house.id }}"
                >
                  <button
                    type="button"
                    class="w-full flex items-center justify-between text-left"
                    data-testid="house-toggle-{{ item.house.id }}"
                    (click)="onToggleHouse(item.house.id)"
                  >
                    <span>
                      <span class="block text-sm font-bold text-[#111614]">
                        {{ item.house.name }}
                      </span>
                      <span class="block text-xs text-[#7C8580]">
                        {{ item.summary }}
                      </span>
                    </span>
                    @if (item.house.status === 'inactive') {
                      <span
                        class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 rounded-full px-2 py-0.5"
                        data-testid="house-inactive-badge-{{ item.house.id }}"
                      >
                        Inativa
                      </span>
                    }
                  </button>

                  @if (item.expanded) {
                    <div class="mt-3 space-y-2">
                      @if (item.areas.length === 0) {
                        <p class="text-xs text-[#7C8580]" data-testid="house-empty-{{ item.house.id }}">
                          Nenhuma área cadastrada
                        </p>
                      } @else {
                        @for (area of item.areas; track area.id) {
                          <button
                            type="button"
                            class="w-full flex items-center justify-between bg-[#F4F6F2] rounded-2xl px-4 py-2.5"
                            data-testid="area-row-{{ area.id }}"
                            (click)="onEditArea(area.id)"
                          >
                            <span class="text-sm font-semibold text-[#111614]">
                              {{ area.name }}
                            </span>
                            <span class="text-[11px] font-medium text-[#7C8580]">
                              {{ area.receivesDirectRain ? 'Chuva direta' : 'Sem chuva direta' }}
                            </span>
                          </button>
                        }
                      }
                      <button
                        type="button"
                        class="text-xs font-bold text-emerald-700"
                        data-testid="btn-new-area-{{ item.house.id }}"
                        (click)="onNewArea(item.house.id)"
                      >
                        + Adicionar área
                      </button>
                    </div>
                  }
                </section>
              }
            </div>
          }
        </main>
      `,
    })
    export default class EnvironmentsPage {
      private readonly listEnvironments = inject(ListEnvironmentsUseCase);
      private readonly resolveDefaultHouse = inject(ResolveDefaultHouseUseCase);
      private readonly router = inject(Router);

      readonly snapshot = signal<EnvironmentSnapshot>(
        this.listEnvironments.execute(),
      );

      readonly viewModels = signal<readonly HouseViewModel[]>([]);

      constructor() {
        this.refreshViewModels();
      }

      private refreshViewModels(): void {
        const current = this.snapshot();
        this.viewModels.set(
          current.houses.map((house) => ({
            house,
            summary: summarizeHouseAddress(house),
            areas: current.areas.filter((area) => area.houseId === house.id),
            expanded: false,
          })),
        );
      }

      onToggleHouse(houseId: string): void {
        this.viewModels.update((items) =>
          items.map((item) =>
            item.house.id === houseId
              ? { ...item, expanded: !item.expanded }
              : item,
          ),
        );
      }

      onNewHouse(): void {
        void this.router.navigate(['/environments/houses/new']);
      }

      onNewArea(houseId: string): void {
        void this.router.navigate(['/environments/areas/new'], {
          queryParams: { houseId },
        });
      }

      onEditArea(areaId: string): void {
        void this.router.navigate(['/environments/areas', areaId]);
      }

      defaultHouseId(): string | null {
        return this.resolveDefaultHouse.execute().houseId;
      }
    }
    ```
  - **Contexto:** UC-01, UC-02, UC-09; ux-design.md — tela de Ambientes
  - **Done:** `src/app/pages/environments.page.ts` exporta `EnvironmentsPage` e `routeMeta`

- [ ] 5.2 **Criar `src/app/pages/house-form.page.ts`**
  - **O que mudar:** Criar nova página AnalogJS com o formulário de casa
  - **Novo conteúdo:**
    ```ts
    import { RouteMeta } from '@analogjs/router';
    import { Component, inject, signal } from '@angular/core';
    import { Router } from '@angular/router';
    import { SaveHouseUseCase } from '@application/index';
    import { HouseAddress, HouseType } from '@domain/index';
    import { mobileOnlyGuard } from '../guards/mobile-only.guard';
    import { authGuard } from '../guards/auth.guard';

    export const routeMeta: RouteMeta = {
      title: 'GreenKeeper - Nova casa',
      canActivate: [mobileOnlyGuard, authGuard],
    };

    const HOUSE_TYPES: readonly HouseType[] = ['Residência', 'Prédio', 'Comercial'];

    @Component({
      selector: 'app-house-form',
      template: `
        <main
          class="w-full min-h-[100dvh] bg-[#F4F6F2] text-[#1A1E1D] flex flex-col p-6"
          data-testid="house-form-page"
        >
          <h1 class="text-2xl font-extrabold tracking-tight text-[#111614]">
            Nova casa
          </h1>

          <label class="mt-4 text-xs font-bold uppercase tracking-wider text-[#7C8580]">
            Nome *
          </label>
          <input
            type="text"
            data-testid="input-house-name"
            [value]="name()"
            (input)="onNameInput($event)"
            class="mt-1 w-full bg-white rounded-2xl px-4 py-3 border border-black/[0.06]"
          />
          @if (error()) {
            <p class="text-xs font-semibold text-red-600 mt-1" data-testid="house-name-error">
              {{ error() }}
            </p>
          }

          <label class="mt-4 text-xs font-bold uppercase tracking-wider text-[#7C8580]">
            Tipo *
          </label>
          <div class="mt-1 flex gap-2">
            @for (type of houseTypes; track type) {
              <button
                type="button"
                class="px-4 py-2 rounded-full text-sm font-semibold border"
                [class.bg-[#1A1E1D]]="type === selectedType()"
                [class.text-white]="type === selectedType()"
                data-testid="house-type-{{ type }}"
                (click)="onSelectType(type)"
              >
                {{ type }}
              </button>
            }
          </div>

          <label class="mt-4 text-xs font-bold uppercase tracking-wider text-[#7C8580]">
            Endereço
          </label>
          <input
            type="text"
            data-testid="input-house-city"
            placeholder="Cidade"
            class="mt-1 w-full bg-white rounded-2xl px-4 py-3 border border-black/[0.06]"
          />
          <input
            type="text"
            data-testid="input-house-state"
            placeholder="Estado"
            class="mt-2 w-full bg-white rounded-2xl px-4 py-3 border border-black/[0.06]"
          />

          <div class="mt-6 flex gap-3">
            <button
              type="button"
              data-testid="btn-cancel-house"
              (click)="onCancel()"
              class="flex-1 px-5 py-3 rounded-full border border-black/10 font-bold"
            >
              Cancelar
            </button>
            <button
              type="button"
              data-testid="btn-save-house"
              (click)="onSave()"
              class="flex-1 px-5 py-3 rounded-full bg-[#1A1E1D] text-white font-bold"
            >
              Salvar
            </button>
          </div>
        </main>
      `,
    })
    export default class HouseFormPage {
      private readonly saveHouse = inject(SaveHouseUseCase);
      private readonly router = inject(Router);

      readonly houseTypes = HOUSE_TYPES;
      readonly name = signal('');
      readonly selectedType = signal<HouseType>('Residência');
      readonly error = signal<string | null>(null);

      onNameInput(event: Event): void {
        this.name.set((event.target as HTMLInputElement).value);
      }

      onSelectType(type: HouseType): void {
        this.selectedType.set(type);
      }

      onSave(): void {
        const trimmed = this.name().trim();
        if (trimmed.length === 0) {
          this.error.set('Informe o nome da casa');
          return;
        }
        const address: HouseAddress = {
          cep: '',
          street: '',
          number: '',
          complement: '',
          district: '',
          city: '',
          state: '',
          latitude: null,
          longitude: null,
        };
        this.saveHouse.execute({
          ownerId: 'user-1',
          name: trimmed,
          type: this.selectedType(),
          address,
          status: 'active',
        });
        void this.router.navigate(['/environments']);
      }

      onCancel(): void {
        void this.router.navigate(['/environments']);
      }
    }
    ```
  - **Contexto:** UC-02, UC-03; ux-design.md — bottom sheet de casa
  - **Done:** `src/app/pages/house-form.page.ts` exporta `HouseFormPage` e `routeMeta`

- [ ] 5.3 **Criar `src/app/pages/area-form.page.ts`**
  - **O que mudar:** Criar nova página AnalogJS com o formulário de área
  - **Novo conteúdo:**
    ```ts
    import { RouteMeta } from '@analogjs/router';
    import { Component, inject, signal } from '@angular/core';
    import { Router } from '@angular/router';
    import { SaveAreaUseCase } from '@application/index';
    import { AreaLight } from '@domain/index';
    import { mobileOnlyGuard } from '../guards/mobile-only.guard';
    import { authGuard } from '../guards/auth.guard';

    export const routeMeta: RouteMeta = {
      title: 'GreenKeeper - Nova área',
      canActivate: [mobileOnlyGuard, authGuard],
    };

    const AREA_LIGHTS: readonly { value: AreaLight; label: string }[] = [
      { value: 'shadow', label: 'Sombra' },
      { value: 'half-shadow', label: 'Meia Sombra' },
      { value: 'full-sun', label: 'Sol Pleno' },
    ];

    @Component({
      selector: 'app-area-form',
      template: `
        <main
          class="w-full min-h-[100dvh] bg-[#F4F6F2] text-[#1A1E1D] flex flex-col p-6"
          data-testid="area-form-page"
        >
          <h1 class="text-2xl font-extrabold tracking-tight text-[#111614]">
            Nova área
          </h1>

          <label class="mt-4 text-xs font-bold uppercase tracking-wider text-[#7C8580]">
            Nome *
          </label>
          <input
            type="text"
            data-testid="input-area-name"
            [value]="name()"
            (input)="onNameInput($event)"
            class="mt-1 w-full bg-white rounded-2xl px-4 py-3 border border-black/[0.06]"
          />
          @if (error()) {
            <p class="text-xs font-semibold text-red-600 mt-1" data-testid="area-name-error">
              {{ error() }}
            </p>
          }

          <label class="mt-4 text-xs font-bold uppercase tracking-wider text-[#7C8580]">
            Luminosidade *
          </label>
          <div class="mt-1 flex gap-2">
            @for (option of lightOptions; track option.value) {
              <button
                type="button"
                class="px-4 py-2 rounded-full text-sm font-semibold border"
                [class.bg-[#1A1E1D]]="option.value === selectedLight()"
                [class.text-white]="option.value === selectedLight()"
                data-testid="area-light-{{ option.value }}"
                (click)="onSelectLight(option.value)"
              >
                {{ option.label }}
              </button>
            }
          </div>

          <label class="mt-4 flex items-center gap-2 text-sm font-semibold text-[#111614]">
            <input
              type="checkbox"
              data-testid="input-area-rain"
              [checked]="receivesDirectRain()"
              (change)="onToggleRain($event)"
            />
            Recebe chuva direta
          </label>

          <div class="mt-6 flex gap-3">
            <button
              type="button"
              data-testid="btn-cancel-area"
              (click)="onCancel()"
              class="flex-1 px-5 py-3 rounded-full border border-black/10 font-bold"
            >
              Cancelar
            </button>
            <button
              type="button"
              data-testid="btn-save-area"
              (click)="onSave()"
              class="flex-1 px-5 py-3 rounded-full bg-[#1A1E1D] text-white font-bold"
            >
              Salvar
            </button>
          </div>
        </main>
      `,
    })
    export default class AreaFormPage {
      private readonly saveArea = inject(SaveAreaUseCase);
      private readonly router = inject(Router);

      readonly lightOptions = AREA_LIGHTS;
      readonly name = signal('');
      readonly selectedLight = signal<AreaLight>('full-sun');
      readonly receivesDirectRain = signal(false);
      readonly error = signal<string | null>(null);

      onNameInput(event: Event): void {
        this.name.set((event.target as HTMLInputElement).value);
      }

      onSelectLight(light: AreaLight): void {
        this.selectedLight.set(light);
      }

      onToggleRain(event: Event): void {
        this.receivesDirectRain.set((event.target as HTMLInputElement).checked);
      }

      onSave(): void {
        const trimmed = this.name().trim();
        if (trimmed.length === 0) {
          this.error.set('Informe o nome da área');
          return;
        }
        this.saveArea.execute({
          houseId: 'house-1',
          name: trimmed,
          light: this.selectedLight(),
          orientation: 'N',
          receivesDirectRain: this.receivesDirectRain(),
        });
        void this.router.navigate(['/environments']);
      }

      onCancel(): void {
        void this.router.navigate(['/environments']);
      }
    }
    ```
  - **Contexto:** UC-05, UC-06, UC-07, UC-08; ux-design.md — bottom sheet de área
  - **Done:** `src/app/pages/area-form.page.ts` exporta `AreaFormPage` e `routeMeta`

- [ ] 5.4 **Criar `src/app/pages/environments.spec.ts` com testes unitários**
  - **O que mudar:** Criar novo arquivo de testes cobrindo as três páginas de ambiente
  - **Novo conteúdo:**
    ```ts
    import { TestBed } from '@angular/core/testing';
    import { provideRouter, Router } from '@angular/router';
    import { provideLocationMocks } from '@angular/common/testing';
    import { provideGreenKeeperDependencies } from '@composition/index';
    import EnvironmentsPage, { routeMeta as environmentsRouteMeta } from './environments.page';
    import HouseFormPage, { routeMeta as houseFormRouteMeta } from './house-form.page';
    import AreaFormPage, { routeMeta as areaFormRouteMeta } from './area-form.page';
    import { mobileOnlyGuard } from '../guards/mobile-only.guard';
    import { authGuard } from '../guards/auth.guard';

    describe('Environment Pages', () => {
      beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [EnvironmentsPage, HouseFormPage, AreaFormPage],
          providers: [
            provideRouter([]),
            provideLocationMocks(),
            ...provideGreenKeeperDependencies(),
          ],
        }).compileComponents();
      });

      it('protects environment routes with mobileOnlyGuard and authGuard', () => {
        expect(environmentsRouteMeta.canActivate).toContain(mobileOnlyGuard);
        expect(environmentsRouteMeta.canActivate).toContain(authGuard);
        expect(houseFormRouteMeta.canActivate).toContain(mobileOnlyGuard);
        expect(houseFormRouteMeta.canActivate).toContain(authGuard);
        expect(areaFormRouteMeta.canActivate).toContain(mobileOnlyGuard);
        expect(areaFormRouteMeta.canActivate).toContain(authGuard);
      });

      it('renders environments page with seeded house and expands areas', () => {
        const fixture = TestBed.createComponent(EnvironmentsPage);
        const root = fixture.nativeElement as HTMLElement;
        fixture.detectChanges();

        expect(root.querySelector('[data-testid="environments-page"]')).toBeTruthy();
        expect(root.querySelector('[data-testid="house-card-house-1"]')).toBeTruthy();

        const toggle = root.querySelector(
          '[data-testid="house-toggle-house-1"]',
        ) as HTMLElement;
        toggle.click();
        fixture.detectChanges();
        expect(root.querySelector('[data-testid="area-row-area-1"]')).toBeTruthy();
      });

      it('navigates to house form from environments page', () => {
        const router = TestBed.inject(Router);
        vi.spyOn(router, 'navigate').mockResolvedValue(true);
        const fixture = TestBed.createComponent(EnvironmentsPage);
        const root = fixture.nativeElement as HTMLElement;
        fixture.detectChanges();

        (root.querySelector('[data-testid="btn-new-house"]') as HTMLElement).click();
        expect(router.navigate).toHaveBeenCalledWith(['/environments/houses/new']);
      });

      it('validates and saves a new house from the house form', () => {
        const router = TestBed.inject(Router);
        vi.spyOn(router, 'navigate').mockResolvedValue(true);
        const fixture = TestBed.createComponent(HouseFormPage);
        const root = fixture.nativeElement as HTMLElement;
        fixture.detectChanges();

        (root.querySelector('[data-testid="btn-save-house"]') as HTMLElement).click();
        fixture.detectChanges();
        expect(root.querySelector('[data-testid="house-name-error"]')).toBeTruthy();

        const input = root.querySelector(
          '[data-testid="input-house-name"]',
        ) as HTMLInputElement;
        input.value = 'Casa Nova';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        (root.querySelector('[data-testid="btn-save-house"]') as HTMLElement).click();
        expect(router.navigate).toHaveBeenCalledWith(['/environments']);
      });

      it('validates and saves a new area from the area form', () => {
        const router = TestBed.inject(Router);
        vi.spyOn(router, 'navigate').mockResolvedValue(true);
        const fixture = TestBed.createComponent(AreaFormPage);
        const root = fixture.nativeElement as HTMLElement;
        fixture.detectChanges();

        (root.querySelector('[data-testid="btn-save-area"]') as HTMLElement).click();
        fixture.detectChanges();
        expect(root.querySelector('[data-testid="area-name-error"]')).toBeTruthy();

        const input = root.querySelector(
          '[data-testid="input-area-name"]',
        ) as HTMLInputElement;
        input.value = 'Varanda';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        (root.querySelector('[data-testid="btn-save-area"]') as HTMLElement).click();
        expect(router.navigate).toHaveBeenCalledWith(['/environments']);
      });
    });
    ```
  - **Contexto:** UC-01 a UC-09; critério de 100% de cobertura para `src/app/`
  - **Done:** `npm run test:coverage` passa com 100% para `src/app/`

- [ ] 5.5 **Commit + push do grupo 5**
  - **Comando:** `git add src/app/ && git commit -m "feat: add environments pages and protected routes" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

---

## 6. E2E e prints (Playwright)

- [ ] 6.1 **Criar `e2e/environments.spec.ts` com testes E2E**
  - **O que mudar:** Criar novo arquivo de testes E2E cobrindo o fluxo de ambientes
  - **Novo conteúdo:**
    ```ts
    import { expect, test } from '@playwright/test';

    test.describe('Environments Management', () => {
      test.use({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      });

      test('redirects unauthenticated user to login page', async ({ page }) => {
        await page.goto('/environments');
        await page.waitForURL(/\/login$/);
        await expect(page.getByTestId('btn-login-google')).toBeVisible();
      });

      test('renders environments page for authenticated mobile user', async ({ page }) => {
        await page.addInitScript(() => {
          Object.defineProperty(window, 'isAuthenticated', {
            value: true,
            configurable: true,
          });
        });
        await page.goto('/environments');
        await expect(page.getByTestId('environments-page')).toBeVisible();
        await expect(page.getByTestId('house-card-house-1')).toBeVisible();
      });
    });
    ```
  - **Contexto:** UC-01, UC-09; critério de prints e testes aprovados antes do merge
  - **Done:** `npm run e2e:screenshots` passa para os testes de ambientes

- [ ] 6.2 **Adicionar captura de tela `mobile-environments.png` em `e2e/screenshots.spec.ts`**
  - **O que mudar:** Adicionar um novo teste ao arquivo existente
  - **Novo conteúdo:**
    ```ts
    test('captures environments page screenshot for authenticated mobile user', async ({
      browser,
    }) => {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 2,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      });
      const page = await context.newPage();

      await page.goto('/environments');
      await expect(page.getByTestId('environments-page')).toBeVisible();
      await page.screenshot({
        path: 'screenshots/mobile-environments.png',
        fullPage: true,
      });

      await context.close();
    });
    ```
  - **Contexto:** Critério de prints automatizados (Playwright em Docker)
  - **Done:** `screenshots/mobile-environments.png` é gerado

- [ ] 6.3 **Commit + push do grupo 6**
  - **Comando:** `git add e2e/ screenshots/ && git commit -m "feat: add environments e2e tests and screenshots" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

---

## 7. Build e verificação

- [ ] 7.1 **Rodar testes com cobertura**
  - **Comando:** `npm run test:coverage`
  - **Done:** 100% de cobertura (lines, branches, functions, statements)

- [ ] 7.2 **Rodar build de produção**
  - **Comando:** `npm run build`
  - **Done:** `dist/analog/public` gerado com sucesso

- [ ] 7.3 **Commit + push do grupo 7**
  - **Comando:** `git add . && git commit -m "feat: complete spec 03 environment management" && git push`
  - **Done:** `git log --oneline -1` mostra o commit acima

---

## Final. PR (manual)

- [ ] Final.1 **[MANUAL] Criar Pull Request no GitHub**
  - Source: `feature/spec-03-gestao-ambientes` → Target: `develop`
  - Solicitar revisão e aguardar aprovação antes de concluir.
  - **Done:** PR criado e aprovado