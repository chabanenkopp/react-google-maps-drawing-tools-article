import { rem } from "polished";
import styled from "styled-components";
import { space, SpaceProps } from "styled-system";
import { Color, FontSize, FontWeight, Space } from "Theme";

const BUTTON_HEIGHT = rem(40);

export const Button = styled("button")<SpaceProps>`
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: ${BUTTON_HEIGHT};

  white-space: nowrap;

  font-size: ${FontSize.M};
  font-weight: ${FontWeight.SemiBold};
  text-decoration: none;

  color: ${Color.White};
  background-color: ${Color.GreekFlagBlue};

  padding: ${Space.XS} ${Space.M};

  ${space}
`;
