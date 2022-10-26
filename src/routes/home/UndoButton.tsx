import React from "react";
import UndoIcon from "images/svg/undo.inline.svg";
import { rem } from "polished";
import { Color, Radius } from "Theme";
import { Flex } from "components/Layout";

type Props = {
  onClick: () => void;
};

const BUTTON_SIZE = rem(40);

export function UndoButton({ onClick }: Props) {
  return (
    <Flex
      onClick={onClick}
      alignItems="center"
      justifyContent="center"
      width={BUTTON_SIZE}
      height={BUTTON_SIZE}
      borderRadius={Radius.MEDIUM}
      bg={Color.White}
    >
      <UndoIcon cursor="pointer" />
    </Flex>
  );
}
