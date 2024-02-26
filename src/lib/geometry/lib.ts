export function getPointOnCircle(radius: number, angle: number) {
  return {
    x: radius * Math.cos((Math.PI * 2 * angle) / 360),
    y: radius * Math.sin((Math.PI * 2 * angle) / 360),
  };
}
export function getTangentOfAngle(angle: number) {
  return (
    Math.cos((Math.PI * 2 * angle) / 360) +
    Math.sin((Math.PI * 2 * angle) / 360)
  );
}
export function getVectorMagnitude(vector: { x: number; y: number }) {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2);
}
export function getRadiusFromPoints(
  x: number,
  y: number,
  h: number,
  k: number,
) {
  return Math.sqrt((x - h) ** 2 + (y - k) ** 2);
}
