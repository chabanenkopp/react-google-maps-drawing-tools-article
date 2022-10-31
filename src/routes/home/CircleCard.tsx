import React from "react";
import TrashIcon from "images/svg/trash.inline.svg";
import { rem } from "polished";
import { Color, CustomSpace, FontSize, FontWeight, Radius, Space } from "Theme";
import { Box, Flex } from "components/Layout";
import { Text } from "components/Typography";
import { getDistanceWithUnits } from "./utils/getDistanceWithUnits";

type Props = {
  radius: number;
  onDelete: () => void;
};

export const CIRCLE_CARD_WIDTH = 280;
const CARD_HEIGHT = rem(70);

export function CircleCard({ onDelete, radius }: Props) {
  return (
    <Box
      width={rem(CIRCLE_CARD_WIDTH)}
      height={CARD_HEIGHT}
      borderRadius={Radius.Large}
      bg={Color.White}
      p={CustomSpace[12]}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize={FontSize.L} fontWeight={FontWeight.Normal}>
          Radius
        </Text>

        <TrashIcon onClick={onDelete} cursor="pointer" />
      </Flex>

      <Text
        fontSize={FontSize.XXL}
        fontWeight={FontWeight.Normal}
        color={Color.GreekFlagBlue}
        mt={Space.S}
      >
        {getDistanceWithUnits(radius)}
      </Text>
    </Box>
  );
}
