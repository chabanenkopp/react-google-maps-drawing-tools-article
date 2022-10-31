import { fluidRange, math, rem } from "polished";
import {
  createGlobalStyle,
  css,
  FlattenSimpleInterpolation,
} from "styled-components";

export const FONT_STACK = `Poppins, Telegraf, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'`;

export const Color = {
  White: "#FFFFFF",
  Black: "#000",
  QuietBay: "#5E96CD",
  GreekFlagBlue: "#005CA9",
  OlympicBlue: "#003579",
  Optophobia: "#160B0E",
  PicnicDaySky: "#0BC5EA",
  FugitiveFlamingo: "#ED64A6",
  GlowingBrakeDisc: "#E53E3E",
  PeppermintToad: "#009E3D",
  LemonDream: "#ECA400",
  BleachedSilk: "#F2F2F2",
  BlackOak: "#4E4E4E",
};

export const Space = {
  XXS: rem(2),
  XS: rem(4),
  S: rem(8),
  M: rem(16),
  L: rem(32),
  XL: rem(64),
  XXL: rem(128),
  XXXL: rem(256),
  XXXXL: rem(400),
};

export const CustomSpace = {
  5: rem(5),
  6: rem(6),
  10: rem(10),
  11: rem(11),
  12: rem(12),
  18: rem(18),
  24: rem(24),
  28: rem(28),
};

export const FontSize = {
  XXS: rem(10),
  XS: rem(12),
  S: rem(14),
  M: rem(16),
  L: rem(18),
  XL: rem(20),
  XXL: rem(24),
  XXXL: rem(28),
  XXXXL: rem(32),
  XXXXXL: rem(36),
  XXXXXXL: rem(48),
};

export const FontWeight = {
  Thin: 100,
  ExtraLight: 200,
  Light: 300,
  Normal: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
  Black: 900,
};

export const Radius = {
  ExtraSmall: "2px",
  Small: "4px",
  Medium: "6px",
  Large: "8px",
  Circle: "50%",
  Pill: "9999px",
};

export const BoxShadow = {
  Small: "0px 1px 4px 0px #2222223D",
};

export const Device = {
  S: "0",
  M: "768px",
  L: "1024px",
  XL: "1440px",
};

export const Breakpoints = {
  S: Device.S,
  M: Device.M,
  L: Device.L,
  XL: Device.XL,
};

const mediaQuery = ({ mobileFirst = true }) =>
  Object.entries(Device).reduce(
    (deviceMediaQueries, [label, breakpoint]) => ({
      ...deviceMediaQueries,
      [label]: (template: TemplateStringsArray, ...params: string[]) => css`
        @media screen and (${mobileFirst ? "min-width" : "max-width"}: ${math(
            `${breakpoint} - 0.1px`
          )}) {
          ${css(template, ...params)}
        }
      `,
    }),
    {} as Record<
      keyof typeof Device,
      (
        template: TemplateStringsArray,
        ...params: string[]
      ) => FlattenSimpleInterpolation
    >
  );

// mq is for usage within `styled` function
export const MQ = {
  to: mediaQuery({ mobileFirst: false }),
  from: mediaQuery({ mobileFirst: true }),
};

export const GlobalStyles = createGlobalStyle`
  html,
  body {
    min-width: 320px;
    margin: 0;
    color: ${Color.White};
    background-color: ${Color.White};
  }
  html {
    ${fluidRange(
      {
        prop: "font-size",
        fromSize: "13px",
        toSize: "18px",
      },
      "320px",
      "2200px"
    )}
    cursor: initial;
  }
  body {
    font-family: ${FONT_STACK};
    letter-spacing: -${1 / 32}em;
    color: ${Color.BlackOak};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0 0 0.5em 0;
  }
  h1,
  h2,
  h3 {
    line-height: 1.3;
  }
  h4,
  h5,
  h6 {
    line-height: 1.5;
  }
  p {
    margin: 0;
  }

  ol {
    margin: 0;
    padding: 0;
  }

  input,
  textarea,
  button {
    font-family: inherit;
    letter-spacing: inherit;
    box-sizing: border-box;
  }

  input::placeholder {
    font-size: inherit;
  }

  button {
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
  }

  input[type="number"] {
    appearance: textfield;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }

  code,
  kbd,
  samp,
  pre {
    font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 1em;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  :focus {
    outline: none;
  }
`;

export const Theme = {
  Breakpoints,
};
