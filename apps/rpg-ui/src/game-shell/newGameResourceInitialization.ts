import type { PlayerResources } from '../../../../packages/shared/types/src/index.js';

type CoreResources = Pick<PlayerResources, 'hp' | 'mp' | 'stamina'>;

export function fillCoreResourcesToMax<T extends CoreResources>(resources: T): T {
  resources.hp.current = resources.hp.max;
  resources.mp.current = resources.mp.max;
  resources.stamina.current = resources.stamina.max;
  return resources;
}
