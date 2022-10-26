interface Props {
  to: google.maps.LatLngLiteral;
  from: google.maps.LatLngLiteral;
}

export const getLineDistance = ({ from, to }: Props) =>
  window.google.maps.geometry.spherical.computeDistanceBetween(from, to);
