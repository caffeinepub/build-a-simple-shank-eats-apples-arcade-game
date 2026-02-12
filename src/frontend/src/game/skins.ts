export interface SkinOption {
  id: string;
  name: string;
  sprite: string;
}

export const SHANK_SKINS: SkinOption[] = [
  {
    id: 'default',
    name: 'Classic',
    sprite: '/assets/generated/shank-sprite.dim_256x256.png',
  },
  {
    id: 'skin1',
    name: 'Neon',
    sprite: '/assets/generated/shank-sprite-skin-1.dim_256x256.png',
  },
  {
    id: 'skin2',
    name: 'Cyber',
    sprite: '/assets/generated/shank-sprite-skin-2.dim_256x256.png',
  },
  {
    id: 'skin3',
    name: 'Retro',
    sprite: '/assets/generated/shank-sprite-skin-3.dim_256x256.png',
  },
];

export const APPLE_SKINS: SkinOption[] = [
  {
    id: 'default',
    name: 'Classic',
    sprite: '/assets/generated/apple-sprite.dim_128x128.png',
  },
  {
    id: 'skin1',
    name: 'Golden',
    sprite: '/assets/generated/apple-sprite-skin-1.dim_128x128.png',
  },
  {
    id: 'skin2',
    name: 'Crystal',
    sprite: '/assets/generated/apple-sprite-skin-2.dim_128x128.png',
  },
];

const SHANK_SKIN_KEY = 'shank-game-shank-skin';
const APPLE_SKIN_KEY = 'shank-game-apple-skin';

export function loadShankSkin(): string {
  const saved = localStorage.getItem(SHANK_SKIN_KEY);
  return saved || 'default';
}

export function saveShankSkin(skinId: string): void {
  localStorage.setItem(SHANK_SKIN_KEY, skinId);
}

export function loadAppleSkin(): string {
  const saved = localStorage.getItem(APPLE_SKIN_KEY);
  return saved || 'default';
}

export function saveAppleSkin(skinId: string): void {
  localStorage.setItem(APPLE_SKIN_KEY, skinId);
}

export function getShankSprite(skinId: string): string {
  const skin = SHANK_SKINS.find(s => s.id === skinId);
  return skin?.sprite || SHANK_SKINS[0].sprite;
}

export function getAppleSprite(skinId: string): string {
  const skin = APPLE_SKINS.find(s => s.id === skinId);
  return skin?.sprite || APPLE_SKINS[0].sprite;
}
