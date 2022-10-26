import styled from "styled-components";
import {
  color,
  ColorProps,
  display,
  DisplayProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from "styled-system";

interface Props
  extends SpaceProps,
    ColorProps,
    LayoutProps,
    DisplayProps,
    TypographyProps {
  cover?: boolean;
}

const TextFunctions = [display, space, color, typography, layout];

export const Text = styled("span")<Props>`
  ${TextFunctions}
`;
