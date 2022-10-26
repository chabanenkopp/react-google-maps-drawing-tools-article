import { PolygonType } from "../mapTypes";

export const calculatePolygonArea = ({
  polygons,
  polygonId,
}: {
  polygonId: number;
  polygons: PolygonType[];
}) => {
  const fallBackValue = 0;
  const maxValueInSquareMeters = 10000;
  const squareMetersToSquareKilometersRatio = 10 ** -6;

  const { coordinates } = polygons.find(({ id }) => id === polygonId) ?? {};

  if (coordinates) {
    const squareMeters =
      google.maps.geometry.spherical.computeArea(coordinates);

    const isValueDisplayedInSquareMeters =
      squareMeters <= maxValueInSquareMeters;

    const area = Number.parseFloat(
      (isValueDisplayedInSquareMeters
        ? squareMeters
        : squareMeters * squareMetersToSquareKilometersRatio
      ).toFixed(2)
    );

    return isValueDisplayedInSquareMeters ? `${area} m²` : `${area} km²`;
  }

  return `${fallBackValue} m`;
};
