interface Props {
  radius: number;
  center: google.maps.LatLng;
}

const HEADING_OFFSET_DIRECTION_IN_DEGREES = 0;

export const getCircleCardCoordinates = ({ radius, center }: Props) => {
  const coordinates = window.google.maps.geometry.spherical.computeOffset(
    center,
    radius,
    HEADING_OFFSET_DIRECTION_IN_DEGREES
  );

  return { lat: coordinates.lat(), lng: coordinates.lng() };
};
