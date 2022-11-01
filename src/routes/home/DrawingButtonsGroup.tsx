import React from "react";
import CircleIcon from "images/svg/circle.inline.svg";
import LineIcon from "images/svg/line.inline.svg";
import PolygonIcon from "images/svg/polygon.inline.svg";
import { rem } from "polished";
import styled from "styled-components";
import { SpaceProps } from "styled-system";
import { BoxShadow, Color } from "Theme";
import { Box, Flex } from "components/Layout";

export enum ButtonName {
  Line = "line",
  Circle = "circle",
  Polygon = "polygon",
}

type SelectedValue = ButtonName | null;

interface ButtonProps {
  onClick: () => void;
  name: ButtonName;
  selectedValue?: SelectedValue;
}

interface GroupProps extends SpaceProps {
  selectedValue: SelectedValue;
  children: React.ReactElement<ButtonProps>[] | React.ReactElement<ButtonProps>;
}

const BUTTONS_HEIGHT = rem(40);
const BUTTONS_WIDTH = rem(200);

const getIconCompByName = (name: ButtonName) => {
  switch (name) {
    case ButtonName.Line:
      return <LineIcon />;
    case ButtonName.Circle:
      return <CircleIcon />;
    case ButtonName.Polygon:
      return <PolygonIcon />;

    default:
      return <Box />;
  }
};

const Container = styled(Flex)`
  width: ${BUTTONS_WIDTH};
  height: ${BUTTONS_HEIGHT};

  box-shadow: ${BoxShadow.Small};
  background-color: ${Color.White};

  div:not(:last-child) {
    border-right: 1px solid ${Color.BlackOak};
  }
`;

function DrawingButton({ onClick, selectedValue, name }: ButtonProps) {
  return (
    <Flex
      onClick={onClick}
      flex={1}
      alignItems="center"
      justifyContent="center"
      bg={selectedValue === name ? Color.BleachedSilk : Color.White}
    >
      {getIconCompByName(name)}
    </Flex>
  );
}

export function DrawingButtonsGroup({
  children,
  selectedValue,
  ...props
}: GroupProps) {
  return (
    <Container {...props}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          selectedValue,
        })
      )}
    </Container>
  );
}

DrawingButtonsGroup.Button = DrawingButton;

export const useDrawingButtons = () => {
  const [buttonName, setButtonName] = React.useState<ButtonName | null>(null);

  const resetButtonName = () => {
    setButtonName(null);
  };

  return { buttonName, setButtonName, resetButtonName };
};
