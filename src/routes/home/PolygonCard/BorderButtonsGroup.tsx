import React from "react";
import { rem } from "polished";
import { SpaceProps } from "styled-system";
import { Color, Radius } from "Theme";
import { Flex } from "components/Layout";
import { Text } from "components/Typography";
import { Container } from "./Container";

export enum BorderWidth {
  ExtraSmall = 1,
  Small,
  Medium,
  Large,
  ExtraLarge,
}

interface ButtonProps {
  borderWidth: BorderWidth;
  selectedValue?: BorderWidth | null;
  onClick: (value: BorderWidth) => void;
}

interface GroupProps extends SpaceProps {
  selectedValue: number | null;
  children: React.ReactElement<ButtonProps>[] | React.ReactElement<ButtonProps>;
}

const BUTTON_SIZE = rem(32);

function ColorButton({ onClick, selectedValue, borderWidth }: ButtonProps) {
  return (
    <Flex
      as="button"
      onClick={() => onClick(borderWidth)}
      alignItems="center"
      justifyContent="center"
      width={BUTTON_SIZE}
      height={BUTTON_SIZE}
      borderRadius={Radius.Circle}
      border={`1px solid ${Color.BleachedSilk}`}
      bg={selectedValue === borderWidth ? Color.BleachedSilk : Color.White}
    >
      <Text color={Color.GreekFlagBlue}>{`${borderWidth}px`}</Text>
    </Flex>
  );
}

export function BorderButtonsGroup({
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

BorderButtonsGroup.Button = ColorButton;
