import { Card } from '../../components/ui/Card.js';
import type { WorldLibraryState } from '../worldPresentationState.js';

export function WorldLibrary({ inventory, highlightedWorldId }: {
  inventory: WorldLibraryState;
  highlightedWorldId: string | undefined;
}) {
  if (inventory.status === 'preview') {
    return <Card title="World inventory unavailable">
      <p>The authenticated World registry is unavailable in this preview. You can review the Creator settings.</p>
    </Card>;
  }
  if (inventory.status === 'loading') return <p role="status">Verifying World inventory…</p>;
  if (inventory.status === 'blocked' || inventory.status === 'readback-failed') {
    return <Card title={inventory.status === 'blocked' ? 'World inventory blocked' : 'World verification failed'}>
      <p role="alert">{inventory.message}</p>
    </Card>;
  }
  if (inventory.status === 'empty') {
    return <Card title="No Worlds yet"><p>Create your first World to add it to this library.</p></Card>;
  }
  if (inventory.status !== 'ready') return null;
  const { world } = inventory;
  return <Card title={world.displayName}>
    {highlightedWorldId === world.worldInstanceId && <p role="status">World created.</p>}
    <dl className="mt-3 space-y-2 text-sm">
      <div><dt>Status</dt><dd>Created</dd></div>
      <div><dt>World ID</dt><dd className="break-all">{world.worldInstanceId}</dd></div>
      <div><dt>Created</dt><dd><time dateTime={world.createdAt}>{new Date(world.createdAt).toLocaleString()}</time></dd></div>
      <div><dt>Rules</dt><dd className="capitalize">{world.rules.progressionMode} · {world.rules.worldKind} · {world.rules.difficulty}</dd></div>
      <div><dt>Scenario</dt><dd className="break-all">{world.scenario.id} · version {world.scenario.version}</dd></div>
    </dl>
  </Card>;
}
