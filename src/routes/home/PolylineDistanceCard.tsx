import React from "react";
import TrashIcon from "images/svg/trash.inline.svg";
import { rem } from "polished";
import styled from "styled-components";
import { Color, CustomSpace, FontSize, FontWeight, Radius, Space } from "Theme";
import { Box, Button, Flex } from "components";
import { Text } from "components/Typography";
import { CardDivider } from "./CardDivider";
import { LINE_DISTANCE_CARD_WIDTH, LineDistanceCardHeight } from "./constants";

type Props = {
  isMultiline: boolean;
  distance: number | string;
  trajectory?: number | string | null;
  onDelete: () => void;
  onRemoveNodes: () => void;
};

const Title = styled("p")`
  font-size: ${FontSize.L};
  font-weight: ${FontWeight.Normal};

  margin: ${Space.S} 0;
`;

export function PolylineDistanceCard({
  onDelete,
  distance,
  trajectory,
  onRemoveNodes,
  isMultiline,
}: Props) {
  return (
    <Box
      width={rem(LINE_DISTANCE_CARD_WIDTH)}
      height={rem(
        isMultiline
          ? LineDistanceCardHeight.MEDIUM
          : LineDistanceCardHeight.SMALL
      )}
      bg={Color.White}
      borderRadius={Radius.LARGE}
      p={CustomSpace[12]}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Title>Distance</Title>

        <TrashIcon onClick={onDelete} cursor="pointer" />
      </Flex>

      <Text
        fontSize={FontSize.XXL}
        fontWeight={FontWeight.Normal}
        color={Color.GreekFlagBlue}
      >
        {distance}
      </Text>

      {trajectory && (
        <>
          <CardDivider mt={Space.S} />

          <Title>Trajectory</Title>

          <Text
            fontSize={FontSize.XXL}
            fontWeight={FontWeight.Normal}
            color={Color.LemonDream}
          >
            {trajectory}
          </Text>

          <Button onClick={onRemoveNodes} mt={Space.M}>
            Remove steps
          </Button>
        </>
      )}
    </Box>
  );
}
