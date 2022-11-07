import React, { forwardRef, useImperativeHandle } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import {
  Circle,
  DrawingManager,
  GoogleMap,
  GoogleMapProps,
  InfoWindow,
  Polygon,
  Polyline,
} from "@react-google-maps/api";
import * as R from "ramda";
import styled from "styled-components";
import { BoxShadow } from "Theme";
import { Box } from "components/Layout";
import { MapSettings } from "./constants";
import * as MT from "./mapTypes";
import {
  BorderWidth,
  ButtonColor,
  NamesToColors,
  PolygonCard,
} from "./PolygonCard";
import { UndoButton } from "./UndoButton";
import {
  calculatePolygonArea,
  coordinateFuncsToCoordinates,
  dropAndReturnElementById,
  dropAndReturnLastElement,
  getPolygonOptionByName,
  processOnVertexOrEdgeClick,
} from "./utils";

export type MapRef = {
  drawCircle: () => void;
  drawPolygon: () => void;
  drawPolyline: () => void;
};

interface MapProps extends GoogleMapProps {
  resetDrawingButtons?: () => void;
}

const POLYGON_NODES_MIN_QUANTITY = 3;
const POLYLINE_NODES_MIN_QUANTITY = 2;

export const DefaultPolygonOptions = {
  name: "",
  borderColor: ButtonColor.Blue,
  backgroundColor: ButtonColor.Blue,
  borderWidth: BorderWidth.ExtraLarge,
};

/**
 * Both center and zoom must be declared outside component to prevent map from
 * being centered to default values after rerenders, clicking on InfoWindow modules, etc.
 */
const {
  MapConfig,
  CircleOptions,
  PolygonOptions,
  PolylineOptions,
  InfoWindowOptions,
} = MapSettings;

const MapStyles = styled(Box)`
  /* Remove default infoWindow close button */
  .gm-ui-hover-effect {
    display: none !important;
  }
  /* set infoWindow triangle styles */
  .gm-style .gm-style-iw-tc {
    display: none;
  }
  .gm-style .gm-style-iw-tc::after {
    width: ${InfoWindowOptions.Triangle.width}px;
    height: ${InfoWindowOptions.Triangle.height}px;
    transform: translateX(50%);
  }
  /* set infoWindow container styles */
  .gm-style-iw.gm-style-iw-c {
    box-shadow: ${BoxShadow.Small};
    padding: 0;

    .gm-style-iw-d {
      overflow: hidden !important;
    }
  }
`;

export const Map = forwardRef<MapRef, MapProps>(
  ({ children, resetDrawingButtons, ...rest }, ref) => {
    const mapRef = React.useRef<GoogleMap | null>(null);
    const drawingRef = React.useRef<DrawingManager | null>(null);

    const [polygons, setPolygons] = React.useState<MT.PolygonType[]>([]);
    const [circles, setCircles] = React.useState<MT.CircleType[]>([]);
    const [distancePolylines, setDistancePolylines] = React.useState<
      MT.DistancePolylineType[]
    >([]);
    const [undoData, setUndoData] = React.useState<MT.UndoDataType | null>(
      null
    );
    const [polygonCardData, setPolygonCardData] =
      React.useState<MT.PolygonCardType | null>(null);
    const [isClickOutsideDisabled, setIsClickOutsideDisabled] =
      React.useState(false);

    const resetDrawingToolsMode = () => {
      drawingRef.current?.state.drawingManager?.setDrawingMode(null);
    };

    useImperativeHandle(ref, () => ({
      drawPolygon: () => {
        if (drawingRef.current) {
          drawingRef.current?.state.drawingManager?.setDrawingMode(
            google.maps.drawing.OverlayType.POLYGON
          );
        }
      },
      drawCircle: () => {
        if (drawingRef.current) {
          drawingRef.current?.state.drawingManager?.setDrawingMode(
            google.maps.drawing.OverlayType.CIRCLE
          );
        }
      },
      drawPolyline: () => {
        if (drawingRef.current) {
          drawingRef.current?.state.drawingManager?.setDrawingMode(
            google.maps.drawing.OverlayType.POLYLINE
          );
        }
      },
    }));

    const handleChangePolygonOptions = ({
      id,
      options,
      polygonOption,
    }: MT.ChangePolygonOptions) => {
      const [polygonsWithoutCurrent, currentPolygon] = dropAndReturnElementById(
        {
          id,
          elements: polygons,
        }
      );

      currentPolygon.polygonInstance?.setOptions(options);

      const updatedPolygons = R.append(
        {
          ...currentPolygon,
          options: {
            ...currentPolygon.options,
            ...polygonOption,
          },
        },
        polygonsWithoutCurrent
      );

      setPolygons(updatedPolygons);
    };

    const handleSetPolygonCardLatLng = (polygon: MT.PolygonType) => {
      const bounds = new window.google.maps.LatLngBounds();

      polygon.coordinates.forEach(({ lat, lng }) =>
        bounds.extend(new window.google.maps.LatLng(lat, lng))
      );

      const polygonBoundingBoxCenter = bounds.getCenter();
      const polygonBoundingBoxCenterNorthEast = bounds.getNorthEast();

      setPolygonCardData({
        id: polygon.id,
        lat: polygonBoundingBoxCenter.lat(),
        lng: polygonBoundingBoxCenterNorthEast.lng(),
      });
    };

    const handleSetCircleDataOnCoordinatesChange = (circle: MT.CircleType) => {
      const { circleInstance } = circle;
      const radius = circleInstance?.getRadius();
      const center = circleInstance?.getCenter();

      if (circleInstance && radius && center) {
        setCircles((prevCircles) => {
          const [circlesWithoutCurrent] = dropAndReturnElementById({
            id: circle.id,
            elements: prevCircles,
          });

          return R.append(
            {
              ...circle,
              radius,
              center,
            },
            circlesWithoutCurrent
          );
        });
      }
    };

    const handleChangePolylineCoordinates = ({
      id,
      coordinates,
    }: {
      id: number;
      coordinates: google.maps.LatLngLiteral[];
    }) => {
      setDistancePolylines((prevPolylines) => {
        const [polylinesWithoutCurrent, currentPolyline] =
          dropAndReturnElementById({
            id,
            elements: prevPolylines,
          });

        return R.append(
          {
            ...currentPolyline,
            coordinates,
          },
          polylinesWithoutCurrent
        );
      });
    };

    return (
      <MapStyles>
        <GoogleMap
          ref={mapRef}
          onDragStart={() => {
            setIsClickOutsideDisabled(true);
          }}
          onDragEnd={() => {
            setIsClickOutsideDisabled(false);
          }}
          {...MapConfig}
          {...rest}
        >
          <DrawingManager
            ref={drawingRef}
            options={{
              drawingControl: false,
              circleOptions: CircleOptions,
              polygonOptions: PolygonOptions,
              polylineOptions: PolylineOptions,
            }}
            onOverlayComplete={(evt) => {
              const { type, overlay } = evt;

              if (overlay) {
                /**
                 * Remove overlay from `DrawingManager` state, clear listeners,
                 * resetting drawing buttons
                 */
                window.google.maps.event.clearInstanceListeners(overlay);
                overlay.setMap(null);
                resetDrawingButtons?.();

                if (type === google.maps.drawing.OverlayType.POLYGON) {
                  const typedOverlay = overlay as google.maps.Polygon;
                  const coordinateFuncs: google.maps.LatLng[] = typedOverlay
                    .getPath()
                    .getArray();

                  const coordinates =
                    coordinateFuncsToCoordinates(coordinateFuncs);

                  if (coordinates.length < POLYGON_NODES_MIN_QUANTITY) {
                    return;
                  }

                  setPolygons((prevPolygons) => [
                    ...prevPolygons,
                    {
                      id: R.inc(polygons.length),
                      coordinates,
                      options: DefaultPolygonOptions,
                      prevCoordinates: [],
                      polygonInstance: null,
                    },
                  ]);

                  resetDrawingToolsMode();

                  return;
                }

                if (type === google.maps.drawing.OverlayType.CIRCLE) {
                  const typedOverlay = overlay as google.maps.Circle;
                  const center = typedOverlay.getCenter();
                  const radius = typedOverlay.getRadius();

                  if (center) {
                    setCircles((prevCircles) => [
                      ...prevCircles,
                      {
                        center,
                        radius,
                        circleInstance: null,
                        id: R.inc(circles.length),
                      },
                    ]);
                  }

                  resetDrawingToolsMode();

                  return;
                }

                if (type === google.maps.drawing.OverlayType.POLYLINE) {
                  const typedOverlay = overlay as google.maps.Polyline;
                  const coordinateFuncs: google.maps.LatLng[] = typedOverlay
                    .getPath()
                    .getArray();

                  const coordinates =
                    coordinateFuncsToCoordinates(coordinateFuncs);

                  if (coordinates.length < POLYLINE_NODES_MIN_QUANTITY) {
                    return;
                  }

                  setDistancePolylines((prevPolylines) => [
                    ...prevPolylines,
                    {
                      id: R.inc(distancePolylines.length),
                      coordinates,
                      polylineInstance: null,
                    },
                  ]);

                  resetDrawingToolsMode();
                }
              }
            }}
          />

          {polygons.map((polygon) => (
            <Polygon
              key={polygon.id}
              editable
              draggable
              paths={polygon.coordinates}
              onLoad={(polygonInstance) => {
                polygonInstance.setOptions(PolygonOptions);

                setPolygons((prevPolygons) => {
                  const [polygonsWithoutLast, lastPolygon] =
                    dropAndReturnLastElement(prevPolygons);

                  return [
                    ...polygonsWithoutLast,
                    { ...lastPolygon, polygonInstance },
                  ];
                });

                handleSetPolygonCardLatLng(polygon);
              }}
              onMouseUp={(event) => {
                const { polygonInstance } = polygon;

                if (polygonInstance) {
                  const coordinateFuncs: google.maps.LatLng[] = polygonInstance
                    .getPath()
                    .getArray();

                  const currentCoordinates =
                    coordinateFuncsToCoordinates(coordinateFuncs);

                  const {
                    isClickedOnEdgeOrVertex,
                    vertexWithChangedCoordinates,
                  } = processOnVertexOrEdgeClick({
                    event,
                    currentCoordinates,
                    prevCoordinates: polygon.coordinates,
                  });

                  if (isClickedOnEdgeOrVertex && vertexWithChangedCoordinates) {
                    if (polygonCardData) {
                      setPolygonCardData(null);
                    }

                    setUndoData({
                      id: polygon.id,
                      lat: vertexWithChangedCoordinates.lat,
                      lng: vertexWithChangedCoordinates.lng,
                    });

                    setPolygons((prevPolygons) => {
                      const [polygonsWithoutCurrent] = dropAndReturnElementById(
                        {
                          id: polygon.id,
                          elements: prevPolygons,
                        }
                      );

                      return R.append(
                        {
                          ...polygon,
                          coordinates: currentCoordinates,
                          prevCoordinates: polygon.coordinates,
                        },
                        polygonsWithoutCurrent
                      );
                    });
                  } else if (
                    !polygonCardData &&
                    !vertexWithChangedCoordinates &&
                    !isClickOutsideDisabled
                  ) {
                    handleSetPolygonCardLatLng(polygon);
                  }
                }
              }}
              onDragStart={() => {
                setUndoData(null);
                setPolygonCardData(null);
              }}
              onDragEnd={() => {
                const { polygonInstance } = polygon;

                if (polygonInstance) {
                  const coordinateFuncs: google.maps.LatLng[] = polygonInstance
                    .getPath()
                    .getArray();

                  const coordinates =
                    coordinateFuncsToCoordinates(coordinateFuncs);

                  setPolygons((prevPolygons) => {
                    const [polygonsWithoutCurrent] = dropAndReturnElementById({
                      id: polygon.id,
                      elements: prevPolygons,
                    });

                    const draggedPolygon = {
                      ...polygon,
                      coordinates,
                      prevCoordinates: [],
                    };

                    handleSetPolygonCardLatLng(draggedPolygon);

                    return R.append(draggedPolygon, polygonsWithoutCurrent);
                  });
                }
              }}
            />
          ))}

          {circles.map((circle) => (
            <Circle
              editable
              key={circle.id}
              center={circle.center}
              radius={circle.radius}
              onLoad={(circleInstance) => {
                circleInstance.setOptions(CircleOptions);

                setCircles((prevCircles) => {
                  const [circlesWithoutLast, lastCircle] =
                    dropAndReturnLastElement(prevCircles);

                  return [
                    ...circlesWithoutLast,
                    { ...lastCircle, circleInstance },
                  ];
                });
              }}
              onRadiusChanged={() => {
                handleSetCircleDataOnCoordinatesChange(circle);
              }}
              onCenterChanged={() => {
                handleSetCircleDataOnCoordinatesChange(circle);
              }}
            />
          ))}

          {distancePolylines.map((polyline) => (
            <Polyline
              editable
              draggable
              key={polyline.id}
              path={polyline.coordinates}
              onLoad={(polylineInstance) => {
                polylineInstance.setOptions(PolylineOptions);

                setDistancePolylines((prevPolylines) => {
                  const [polylinesWithoutLast, lastPolyline] =
                    dropAndReturnLastElement(prevPolylines);

                  return [
                    ...polylinesWithoutLast,
                    { ...lastPolyline, polylineInstance },
                  ];
                });
              }}
              onMouseUp={(event) => {
                const { polylineInstance } = polyline;

                if (polylineInstance) {
                  const coordinateFuncs: google.maps.LatLng[] = polylineInstance
                    .getPath()
                    .getArray();

                  const currentCoordinates =
                    coordinateFuncsToCoordinates(coordinateFuncs);

                  const {
                    isClickedOnEdgeOrVertex,
                    vertexWithChangedCoordinates,
                  } = processOnVertexOrEdgeClick({
                    event,
                    currentCoordinates,
                    prevCoordinates: polyline.coordinates,
                  });

                  if (isClickedOnEdgeOrVertex && vertexWithChangedCoordinates) {
                    handleChangePolylineCoordinates({
                      id: polyline.id,
                      coordinates: currentCoordinates,
                    });
                  }
                }
              }}
              onDragEnd={() => {
                const { polylineInstance } = polyline;

                if (polylineInstance) {
                  const coordinateFuncs: google.maps.LatLng[] = polylineInstance
                    .getPath()
                    .getArray();

                  const currentCoordinates =
                    coordinateFuncsToCoordinates(coordinateFuncs);

                  handleChangePolylineCoordinates({
                    id: polyline.id,
                    coordinates: currentCoordinates,
                  });
                }
              }}
            />
          ))}

          {undoData && (
            <InfoWindow
              position={{
                lat: undoData.lat,
                lng: undoData.lng,
              }}
              options={{
                pixelOffset: new window.google.maps.Size(
                  InfoWindowOptions.Polygon.UndoPixelOffset.X,
                  InfoWindowOptions.Polygon.UndoPixelOffset.Y
                ),
              }}
            >
              <OutsideClickHandler
                onOutsideClick={() => {
                  setUndoData(null);
                }}
                disabled={isClickOutsideDisabled}
              >
                <UndoButton
                  onClick={() => {
                    const [polygonsWithoutCurrent, currentPolygon] =
                      dropAndReturnElementById({
                        id: undoData.id,
                        elements: polygons,
                      });

                    const updatedPolygons = R.append(
                      {
                        ...currentPolygon,
                        coordinates: currentPolygon.prevCoordinates,
                        prevCoordinates: [],
                      },
                      polygonsWithoutCurrent
                    );

                    setPolygons(updatedPolygons);

                    setUndoData(null);
                  }}
                />
              </OutsideClickHandler>
            </InfoWindow>
          )}

          {polygonCardData && (
            <InfoWindow
              position={{
                lat: polygonCardData.lat,
                lng: polygonCardData.lng,
              }}
              options={{
                pixelOffset: new window.google.maps.Size(
                  InfoWindowOptions.Polygon.CardPixelOffset.X,
                  InfoWindowOptions.Polygon.CardPixelOffset.Y
                ),
              }}
            >
              <OutsideClickHandler
                onOutsideClick={() => {
                  setPolygonCardData(null);
                }}
                disabled={isClickOutsideDisabled}
              >
                <PolygonCard
                  area={calculatePolygonArea({
                    polygons,
                    polygonId: polygonCardData.id,
                  })}
                  selectedBackgroundColor={
                    getPolygonOptionByName({
                      polygons,
                      name: "backgroundColor",
                      polygonId: polygonCardData.id,
                    }) as ButtonColor
                  }
                  selectedBorderColor={
                    getPolygonOptionByName({
                      polygons,
                      name: "borderColor",
                      polygonId: polygonCardData.id,
                    }) as ButtonColor
                  }
                  selectedBorderWidth={
                    getPolygonOptionByName({
                      polygons,
                      name: "borderWidth",
                      polygonId: polygonCardData.id,
                    }) as BorderWidth
                  }
                  onChangeBorderColor={(color: ButtonColor) => {
                    handleChangePolygonOptions({
                      id: polygonCardData.id,
                      polygonOption: { borderColor: color },
                      options: { strokeColor: NamesToColors[color] },
                    });
                  }}
                  onChangeBackgroundColor={(color: ButtonColor) => {
                    handleChangePolygonOptions({
                      id: polygonCardData.id,
                      polygonOption: { backgroundColor: color },
                      options: { fillColor: NamesToColors[color] },
                    });
                  }}
                  onChangeBorderWidth={(borderWidth: BorderWidth) => {
                    handleChangePolygonOptions({
                      id: polygonCardData.id,
                      polygonOption: { borderWidth },
                      options: { strokeWeight: borderWidth },
                    });
                  }}
                  onDelete={() => {
                    const [polygonsWithoutCurrent] = dropAndReturnElementById({
                      id: polygonCardData.id,
                      elements: polygons,
                    });

                    setPolygons(polygonsWithoutCurrent);

                    setPolygonCardData(null);
                  }}
                />
              </OutsideClickHandler>
            </InfoWindow>
          )}

          {children}
        </GoogleMap>
      </MapStyles>
    );
  }
);
