export const darkColors = ["#A0D7E3", "#FFD470", "#EC838C"] as const;
export const lightColors = ["#074453", "#C48900", "#6A1017"] as const;

export const NUM_CLOTH_COLS = 20 as const;
export const NUM_BODIES = 50 as const;
export const collisionFilters = {
  walls: 0x0001,
  floor: 0x0002,
  balls: 0x0004,
  mouse: 0x0008,
  content: 0x0016,
} as const;
export const GRAVITATIONAL_CONSTANT = 1 as const;
