import * as R from "ramda";

export const getLineExtremeCoordinates = (
  coordinates: google.maps.LatLngLiteral[]
) => ({
  origin: coordinates[0],
  destination: R.last(coordinates)!,
});
