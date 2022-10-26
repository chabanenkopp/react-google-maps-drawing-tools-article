import styled from "styled-components";
import {
  alignItems,
  background,
  BackgroundProps,
  border,
  BorderProps,
  boxShadow,
  BoxShadowProps,
  color,
  ColorProps,
  flex,
  flexbox,
  FlexboxProps,
  FlexProps,
  grid,
  gridArea,
  GridAreaProps,
  justifyContent,
  justifyItems,
  layout,
  LayoutProps,
  order,
  OrderProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from "styled-system";

interface LayoutBoxProps
  extends FlexProps,
    SpaceProps,
    OrderProps,
    ColorProps,
    LayoutProps,
    BorderProps,
    PositionProps,
    GridAreaProps,
    BoxShadowProps,
    BackgroundProps,
    TypographyProps {}

interface LayoutFlexProps extends LayoutBoxProps, FlexboxProps {}

const CommonPropFunctions = [
  flex,
  space,
  order,
  color,
  border,
  layout,
  position,
  gridArea,
  boxShadow,
  background,
  typography,
];

export const Box = styled("div")<LayoutBoxProps>`
  ${CommonPropFunctions}
`;

export const Flex = styled("div")<LayoutFlexProps>`
  display: flex;
  ${CommonPropFunctions}
  ${flexbox}
`;

export const Grid = styled("div")`
  display: grid;
  ${CommonPropFunctions}
  ${grid}
  ${alignItems}
  ${justifyContent}
  ${justifyItems}
`;
