import { getLineDistance } from "./getLineDistance";

const DEFAULT_DISTANCE = 0;

export const getLineTrajectory = (coordinates: google.maps.LatLngLiteral[]) =>
  coordinates.reduce(
    (
      allFragmentsDistance: number,
      fragmentCoordinates: google.maps.LatLngLiteral,
      idx: number,
      allCoordinates: google.maps.LatLngLiteral[]
    ) => {
      if (idx < allCoordinates.length - 1) {
        const nextLatLng = allCoordinates[idx + 1];

        const fragmentDistance = getLineDistance({
          from: fragmentCoordinates,
          to: nextLatLng,
        });

        return allFragmentsDistance + fragmentDistance;
      }

      return allFragmentsDistance;
    },
    DEFAULT_DISTANCE
  );
