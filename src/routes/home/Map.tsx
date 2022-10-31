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
import { CircleCard } from "./CircleCard";
import { MapSettings } from "./constants";
import * as MT from "./mapTypes";
import {
  BorderWidth,
  ButtonColor,
  NamesToColors,
  PolygonCard,
} from "./PolygonCard";
import { PolylineDistanceCard } from "./PolylineDistanceCard";
import { UndoButton } from "./UndoButton";
import {
  calculatePolygonArea,
  coordinateFuncsToCoordinates,
  dropAndReturnElementById,
  dropAndReturnLastElement,
  getCircleCardCoordinates,
  getDistanceWithUnits,
  getLineDistance,
  getLineExtremeCoordinates,
  getLineTrajectory,
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
    const [circleCardData, setCircleCardData] =
      React.useState<MT.CircleCardType | null>(null);
    const [lineDistanceCardData, setLineDistanceCardData] =
      React.useState<MT.LineDistanceCardType | null>(null);
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

        setCircleCardData({
          radius,
          center,
          id: circle.id,
        });
      }
    };

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

    const handleSetLineDistanceCardData = ({
      id,
      coordinates,
    }: {
      id: number;
      coordinates: google.maps.LatLngLiteral[];
    }) => {
      const { origin, destination } = getLineExtremeCoordinates(coordinates);
      const isMultiLine = coordinates.length > POLYLINE_NODES_MIN_QUANTITY;

      if (destination) {
        setLineDistanceCardData({
          id,
          isMultiLine,
          lat: destination.lat,
          lng: destination.lng,
          distance: getLineDistance({
            from: origin,
            to: destination,
          }),
          trajectory: isMultiLine ? getLineTrajectory(coordinates) : null,
        });
      }
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

          {polygons &&
            polygons.map((polygon) => (
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
                    const coordinateFuncs: google.maps.LatLng[] =
                      polygonInstance.getPath().getArray();

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

                    if (isClickedOnEdgeOrVertex) {
                      if (polygonCardData) {
                        setPolygonCardData(null);
                      }

                      setPolygons((prevPolygons) => {
                        const [polygonsWithoutCurrent] =
                          dropAndReturnElementById({
                            id: polygon.id,
                            elements: prevPolygons,
                          });

                        /**
                         * `event` returns `latLng` of the changed vertex if one of the vertices was dragged. But if polygon
                         * transformation was performed by dragging one of the edges and thus the total quantity of vertices was increased
                         * by 1, `event` returns `latLng` of one of the newly created edges, not the `latLng` of the vertex
                         * that was represented by the edge before dragging. Since we want to display `undo button` above the vertex, not an edge,
                         * the latLng of the newly created vertex can be found in `vertexWithChangedCoordinates`.
                         */
                        if (vertexWithChangedCoordinates) {
                          setUndoData({
                            id: polygon.id,
                            lat: vertexWithChangedCoordinates.lat,
                            lng: vertexWithChangedCoordinates.lng,
                          });

                          /**
                           * Setting prevCoordinates to current and current - to newly obtained coordinates
                           * retrieved after dragging either a vertex or an edge of the polygon
                           */
                          return R.append(
                            {
                              ...polygon,
                              coordinates: currentCoordinates,
                              prevCoordinates: polygon.coordinates,
                            },
                            polygonsWithoutCurrent
                          );
                        }

                        return prevPolygons;
                      });
                    } else if (
                      !polygonCardData &&
                      /**
                       * `vertexWithChangedCoordinates` is chceked because both `onDragEnd` and `onMouseUp` are triggered
                       * each time user clicks or drags the shape, meaning card data is set twice on `dragEnd`, but we need
                       * to set it only once in order to prevent `InfoWindow` from flickering that is seen with async calls
                       */
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
                    const coordinateFuncs: google.maps.LatLng[] =
                      polygonInstance.getPath().getArray();

                    const coordinates =
                      coordinateFuncsToCoordinates(coordinateFuncs);

                    setPolygons((prevPolygons) => {
                      const [polygonsWithoutCurrent] = dropAndReturnElementById(
                        {
                          id: polygon.id,
                          elements: prevPolygons,
                        }
                      );

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

          {circles &&
            circles.map((circle) => (
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

                  setCircleCardData({
                    id: circle.id,
                    radius: circle.radius,
                    center: circle.center,
                  });
                }}
                onRadiusChanged={() => {
                  handleSetCircleDataOnCoordinatesChange(circle);
                }}
                onCenterChanged={() => {
                  handleSetCircleDataOnCoordinatesChange(circle);
                }}
                onClick={() => {
                  if (!circleCardData) {
                    setCircleCardData({
                      id: circle.id,
                      center: circle.center,
                      radius: circle.radius,
                    });
                  }
                }}
              />
            ))}

          {distancePolylines &&
            distancePolylines.map((polyline) => (
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

                  const { coordinates } = polyline;

                  handleSetLineDistanceCardData({
                    coordinates,
                    id: polyline.id,
                  });
                }}
                onMouseUp={(event) => {
                  const { polylineInstance } = polyline;

                  if (polylineInstance) {
                    const coordinateFuncs: google.maps.LatLng[] =
                      polylineInstance.getPath().getArray();

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

                    if (isClickedOnEdgeOrVertex) {
                      setDistancePolylines((prevPolylines) => {
                        const [polylinesWithoutCurrent] =
                          dropAndReturnElementById({
                            id: polyline.id,
                            elements: prevPolylines,
                          });

                        if (vertexWithChangedCoordinates) {
                          handleSetLineDistanceCardData({
                            id: polyline.id,
                            coordinates: currentCoordinates,
                          });

                          return R.append(
                            {
                              ...polyline,
                              coordinates: currentCoordinates,
                            },
                            polylinesWithoutCurrent
                          );
                        }

                        return prevPolylines;
                      });
                    } else if (
                      !lineDistanceCardData &&
                      !vertexWithChangedCoordinates
                    ) {
                      handleSetLineDistanceCardData({
                        id: polyline.id,
                        coordinates: currentCoordinates,
                      });
                    }
                  }
                }}
                onDragStart={() => {
                  setLineDistanceCardData(null);
                }}
                onDragEnd={() => {
                  const { polylineInstance } = polyline;

                  if (polylineInstance) {
                    const coordinateFuncs: google.maps.LatLng[] =
                      polylineInstance.getPath().getArray();
                    const coordinates =
                      coordinateFuncsToCoordinates(coordinateFuncs);

                    setDistancePolylines((prevPolylines) => {
                      const [polylinesWithoutCurrent] =
                        dropAndReturnElementById({
                          id: polyline.id,
                          elements: prevPolylines,
                        });

                      handleSetLineDistanceCardData({
                        coordinates,
                        id: polyline.id,
                      });

                      return R.append(
                        {
                          ...polyline,
                          coordinates,
                        },
                        polylinesWithoutCurrent
                      );
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

          {circleCardData && (
            <InfoWindow
              position={getCircleCardCoordinates({
                center: circleCardData.center,
                radius: circleCardData.radius,
              })}
              options={{
                pixelOffset: new window.google.maps.Size(
                  InfoWindowOptions.Circle.CardPixelOffset.X,
                  InfoWindowOptions.Circle.CardPixelOffset.Y
                ),
              }}
            >
              <OutsideClickHandler
                onOutsideClick={() => {
                  setCircleCardData(null);
                }}
                disabled={isClickOutsideDisabled}
              >
                <CircleCard
                  onDelete={() => {
                    setCircleCardData(null);
                    setCircles((prevCircles) => {
                      const [circlesWithoutCurrent] = dropAndReturnElementById({
                        id: circleCardData.id,
                        elements: prevCircles,
                      });

                      return circlesWithoutCurrent;
                    });
                  }}
                  radius={Math.round(circleCardData.radius)}
                />
              </OutsideClickHandler>
            </InfoWindow>
          )}

          {lineDistanceCardData && (
            <InfoWindow
              position={{
                lat: lineDistanceCardData.lat,
                lng: lineDistanceCardData.lng,
              }}
              options={{
                pixelOffset: new window.google.maps.Size(
                  InfoWindowOptions.LineDistance.CardPixelOffset.X,
                  InfoWindowOptions.LineDistance.CardPixelOffset.Y(
                    Boolean(lineDistanceCardData.trajectory)
                  )
                ),
              }}
            >
              <OutsideClickHandler
                onOutsideClick={() => {
                  setLineDistanceCardData(null);
                }}
                disabled={isClickOutsideDisabled}
              >
                <PolylineDistanceCard
                  isMultiline={lineDistanceCardData.isMultiLine}
                  onDelete={() => {
                    setLineDistanceCardData(null);
                    setDistancePolylines((prevPolylines) => {
                      const [polylinesWithoutCurrent] =
                        dropAndReturnElementById({
                          id: lineDistanceCardData.id,
                          elements: prevPolylines,
                        });

                      return polylinesWithoutCurrent;
                    });
                  }}
                  onRemoveNodes={() => {
                    setDistancePolylines((prevPolylines) => {
                      const [polylinesWithoutCurrent, currentPolyline] =
                        dropAndReturnElementById({
                          id: lineDistanceCardData.id,
                          elements: prevPolylines,
                        });

                      const { origin, destination } = getLineExtremeCoordinates(
                        currentPolyline.coordinates
                      );

                      return [
                        ...polylinesWithoutCurrent,
                        {
                          ...currentPolyline,
                          coordinates: [origin, destination],
                        },
                      ];
                    });

                    setLineDistanceCardData((prev) =>
                      prev
                        ? { ...prev, trajectory: null, isMultiLine: false }
                        : prev
                    );
                  }}
                  distance={getDistanceWithUnits(lineDistanceCardData.distance)}
                  trajectory={
                    lineDistanceCardData.trajectory &&
                    getDistanceWithUnits(lineDistanceCardData.trajectory)
                  }
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
