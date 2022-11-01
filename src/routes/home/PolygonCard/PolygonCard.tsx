import React from "react";
import TrashIcon from "images/svg/trash.inline.svg";
import { rem } from "polished";
import styled from "styled-components";
import { Color, CustomSpace, FontSize, FontWeight, Space } from "Theme";
import { Box, Flex } from "components/Layout";
import { Text } from "components/Typography";
import { CardDivider } from "../CardDivider";
import { BorderButtonsGroup, BorderWidth } from "./BorderButtonsGroup";
import { ButtonColor, ColorButtonsGroup } from "./ColorButtonsGroup";

type Props = {
  area: number | string;
  selectedBorderWidth: BorderWidth;
  selectedBorderColor: ButtonColor;
  selectedBackgroundColor: ButtonColor;
  onDelete: () => void;
  onChangeBorderWidth: (value: BorderWidth) => void;
  onChangeBorderColor: (value: ButtonColor) => void;
  onChangeBackgroundColor: (value: ButtonColor) => void;
};

export const POLYGON_CARD_SIZE = 320;
const LEFT_OFFSET = Space.M;

const Title = styled("p")`
  font-size: ${FontSize.L};
  font-weight: ${FontWeight.Normal};
  margin: ${CustomSpace[12]} 0 ${CustomSpace[12]} ${LEFT_OFFSET};
`;

export function PolygonCard({
  area,
  onDelete,
  onChangeBorderColor,
  onChangeBorderWidth,
  onChangeBackgroundColor,
  selectedBorderColor,
  selectedBorderWidth,
  selectedBackgroundColor,
}: Props) {
  return (
    <Box
      width={rem(POLYGON_CARD_SIZE)}
      height={rem(POLYGON_CARD_SIZE)}
      bg={Color.White}
      p={CustomSpace[12]}
    >
      <Flex alignItems="center" justifyContent="flex-end">
        <TrashIcon onClick={onDelete} cursor="pointer" />
      </Flex>

      <Text
        fontSize={FontSize.XXL}
        fontWeight={FontWeight.Normal}
        color={Color.GreekFlagBlue}
        mt={Space.S}
        ml={LEFT_OFFSET}
      >
        {area}
      </Text>

      <CardDivider mt={Space.S} />

      <Title>Border Color</Title>

      <ColorButtonsGroup selectedValue={selectedBorderColor} ml={LEFT_OFFSET}>
        {[
          ButtonColor.Blue,
          ButtonColor.LightBlue,
          ButtonColor.Pink,
          ButtonColor.Red,
          ButtonColor.Green,
        ].map((color) => (
          <ColorButtonsGroup.Button
            key={color}
            color={color}
            onClick={onChangeBorderColor}
          />
        ))}
      </ColorButtonsGroup>

      <CardDivider mt={CustomSpace[12]} />

      <Title>Border width</Title>

      <BorderButtonsGroup selectedValue={selectedBorderWidth} ml={LEFT_OFFSET}>
        {[
          BorderWidth.ExtraSmall,
          BorderWidth.Small,
          BorderWidth.Medium,
          BorderWidth.Large,
          BorderWidth.ExtraLarge,
        ].map((borderWidth) => (
          <BorderButtonsGroup.Button
            key={borderWidth}
            borderWidth={borderWidth}
            onClick={onChangeBorderWidth}
          />
        ))}
      </BorderButtonsGroup>

      <CardDivider mt={CustomSpace[12]} />

      <Title>Background color</Title>

      <ColorButtonsGroup
        selectedValue={selectedBackgroundColor}
        ml={LEFT_OFFSET}
      >
        {[
          ButtonColor.Blue,
          ButtonColor.LightBlue,
          ButtonColor.Pink,
          ButtonColor.Red,
          ButtonColor.Green,
        ].map((color) => (
          <ColorButtonsGroup.Button
            key={color}
            color={color}
            onClick={onChangeBackgroundColor}
          />
        ))}
      </ColorButtonsGroup>
    </Box>
  );
}
