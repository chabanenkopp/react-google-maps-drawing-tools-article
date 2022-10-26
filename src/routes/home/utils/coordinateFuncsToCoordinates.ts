export const coordinateFuncsToCoordinates = (
  coordinates: google.maps.LatLng[]
) =>
  coordinates.map(({ lat, lng }) => ({
    lat: lat(),
    lng: lng(),
  }));
