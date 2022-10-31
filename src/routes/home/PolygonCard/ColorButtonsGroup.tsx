import React from "react";
import { rem } from "polished";
import { SpaceProps } from "styled-system";
import { Color, Radius } from "Theme";
import { Flex } from "components/Layout";
import { Container } from "./Container";

export enum ButtonColor {
  Blue = "blue",
  LightBlue = "lightBlue",
  Pink = "pink",
  Red = "red",
  Green = "green",
}

export const NamesToColors = {
  [ButtonColor.Blue]: Color.OlympicBlue,
  [ButtonColor.LightBlue]: Color.PicnicDaySky,
  [ButtonColor.Pink]: Color.FugitiveFlamingo,
  [ButtonColor.Red]: Color.GlowingBrakeDisc,
  [ButtonColor.Green]: Color.PeppermintToad,
};

type SelectedValue = ButtonColor | null;

interface ButtonProps {
  color: ButtonColor;
  selectedValue?: SelectedValue;
  onClick: (value: ButtonColor) => void;
}

interface GroupProps extends SpaceProps {
  selectedValue: SelectedValue;
  children: React.ReactElement<ButtonProps>[] | React.ReactElement<ButtonProps>;
}

const BUTTON_SIZE = rem(24);

function ColorButton({ onClick, selectedValue, color }: ButtonProps) {
  return (
    <Flex
      as="button"
      onClick={() => onClick(color)}
      alignItems="center"
      justifyContent="center"
      width={BUTTON_SIZE}
      height={BUTTON_SIZE}
      borderRadius={Radius.Circle}
      bg={NamesToColors[color]}
      border={
        selectedValue === color ? `3px solid ${Color.BlackOak}` : undefined
      }
    />
  );
}

export function ColorButtonsGroup({
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

ColorButtonsGroup.Button = ColorButton;
