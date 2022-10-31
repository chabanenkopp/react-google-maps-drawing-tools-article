const MAX_DISTANCE_IN_METERS = 1000;
const METERS_TO_KILOMETERS_RATIO = 10 ** -3;

export const getDistanceWithUnits = (distance: number) => {
  const isDistanceInMeters = distance <= MAX_DISTANCE_IN_METERS;

  return isDistanceInMeters
    ? `${parseFloat(distance.toFixed(2))} m`
    : `${parseFloat((distance * METERS_TO_KILOMETERS_RATIO).toFixed(2))} km`;
};
