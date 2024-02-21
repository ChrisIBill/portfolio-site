export interface GenericKeyValueObject<T> {
  [key: string]: T;
}
export interface Coordinates {
  x: number;
  y: number;
}
export type directionType = "up" | "down" | "left" | "right";
export const directionToCoordsMap: GenericKeyValueObject<Coordinates> = {
  up: {
    x: 0,
    y: -1,
  },
  down: {
    x: 0,
    y: 1,
  },
  left: {
    x: -1,
    y: 0,
  },
  right: {
    x: 1,
    y: 0,
  },
} as const;
