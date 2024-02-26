export interface GenericKeyValueObject<T> {
  [key: string]: T;
}
export type OptionsFlags<K, T> = {
  [Property in keyof K]: T;
};
export type UndefinedMap<K, E, T> = {
  [Property in keyof E]: T;
};
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
