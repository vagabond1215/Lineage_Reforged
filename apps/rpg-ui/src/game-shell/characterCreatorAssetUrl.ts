export const CHARACTER_CREATOR_ASSET_SOURCE_COMMIT =
  '712982fbf72b158280df0ac89dc903d3b1832ab4';

export const CHARACTER_CREATOR_ASSET_BASE_URL =
  `https://raw.githubusercontent.com/vagabond1215/Lineage_Reforged/${CHARACTER_CREATOR_ASSET_SOURCE_COMMIT}/apps/rpg-ui/public`;

type CharacterCreatorAssetUrlOptions = {
  production?: boolean;
  baseUrl?: string;
};

export function resolveCharacterCreatorAssetUrl(
  path: string,
  options: CharacterCreatorAssetUrlOptions = {}
): string {
  const production = options.production ?? import.meta.env?.PROD ?? false;

  if (!production || !path.startsWith('/character-creator/')) {
    return path;
  }

  const baseUrl = (options.baseUrl ?? CHARACTER_CREATOR_ASSET_BASE_URL).replace(
    /\/+$/,
    ''
  );

  return `${baseUrl}${path}`;
}
