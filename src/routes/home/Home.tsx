import React from "react";
import { Libraries, LoadScript } from "@react-google-maps/api";
import { rem } from "polished";
import styled from "styled-components";
import { GenericPage } from "components/GenericPage";
import {
  ButtonName,
  DrawingButtonsGroup,
  useDrawingButtons,
} from "./DrawingButtonsGroup";
import { Map, MapRef } from "./Map";

const MAP_BUTTONS_OFFSET_Y = rem(10);

const LIBRARIES: Libraries = ["drawing", "geometry"];

const ButtonsContainer = styled("div")`
  position: absolute;
  left: 50%;
  bottom: ${MAP_BUTTONS_OFFSET_Y};

  transform: translateX(-50%);
`;

function Home() {
  const mapRef = React.useRef<MapRef>(null);
  const { buttonName, setButtonName, resetButtonName } = useDrawingButtons();

  return (
    <GenericPage>
      <LoadScript
        googleMapsApiKey={process.env.GATSBY_GOOGLE_KEY ?? ""}
        libraries={LIBRARIES}
      >
        <Map ref={mapRef} resetDrawingButtons={resetButtonName}>
          <ButtonsContainer>
            <DrawingButtonsGroup selectedValue={buttonName}>
              <DrawingButtonsGroup.Button
                name={ButtonName.Polygon}
                onClick={() => {
                  mapRef.current?.drawPolygon();
                  setButtonName(ButtonName.Polygon);
                }}
              />
              <DrawingButtonsGroup.Button
                name={ButtonName.Circle}
                onClick={() => {
                  mapRef.current?.drawCircle();
                  setButtonName(ButtonName.Circle);
                }}
              />
              <DrawingButtonsGroup.Button
                name={ButtonName.Line}
                onClick={() => {
                  mapRef.current?.drawPolyline();
                  setButtonName(ButtonName.Line);
                }}
              />
            </DrawingButtonsGroup>
          </ButtonsContainer>
        </Map>
      </LoadScript>
    </GenericPage>
  );
}

export default Home;
