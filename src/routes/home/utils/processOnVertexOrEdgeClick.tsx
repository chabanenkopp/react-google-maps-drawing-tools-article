interface VertexWithChangedCoordinatesProps {
  prevCoordinates: google.maps.LatLngLiteral[];
  currentCoordinates: google.maps.LatLngLiteral[];
}

const getVertexWithChangedCoordinates = ({
  prevCoordinates,
  currentCoordinates,
}: VertexWithChangedCoordinatesProps) =>
  currentCoordinates.find(
    ({ lat: prevLat, lng: prevLng }) =>
      !prevCoordinates.some(
        ({ lat: currLat, lng: currLng }) =>
          prevLat === currLat && prevLng === currLng
      )
  );

interface processOnVertexOrEdgeClickProps {
  event: google.maps.MapMouseEvent;
  prevCoordinates: google.maps.LatLngLiteral[];
  currentCoordinates: google.maps.LatLngLiteral[];
}

export const processOnVertexOrEdgeClick = ({
  event,
  prevCoordinates,
  currentCoordinates,
}: processOnVertexOrEdgeClickProps) => {
  const isClickedOnEdgeOrVertex =
    event.edge !== undefined || event.vertex !== undefined;

  const vertexWithChangedCoordinates = isClickedOnEdgeOrVertex
    ? getVertexWithChangedCoordinates({
        prevCoordinates,
        currentCoordinates,
      })
    : undefined;

  return { isClickedOnEdgeOrVertex, vertexWithChangedCoordinates };
};
