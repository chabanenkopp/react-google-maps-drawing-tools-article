/* eslint-disable @typescript-eslint/restrict-template-expressions */
import poppinsBlackWoff from "./Poppins/Poppins-Black.woff";
import poppinsBlackWoff2 from "./Poppins/Poppins-Black.woff2";
import poppinsBoldWoff from "./Poppins/Poppins-Bold.woff";
import poppinsBoldWoff2 from "./Poppins/Poppins-Bold.woff2";
import poppinsExtraLightWoff from "./Poppins/Poppins-ExtraLight.woff";
import poppinsExtraLightWoff2 from "./Poppins/Poppins-ExtraLight.woff2";
import poppinsLightWoff from "./Poppins/Poppins-Light.woff";
import poppinsLightWoff2 from "./Poppins/Poppins-Light.woff2";
import poppinsMediumWoff from "./Poppins/Poppins-Medium.woff";
import poppinsMediumWoff2 from "./Poppins/Poppins-Medium.woff2";
import poppinsRegularWoff from "./Poppins/Poppins-Regular.woff";
import poppinsRegularWoff2 from "./Poppins/Poppins-Regular.woff2";
import poppinsSemiBoldWoff from "./Poppins/Poppins-SemiBold.woff";
import poppinsSemiBoldWoff2 from "./Poppins/Poppins-SemiBold.woff2";
import poppinsThinWoff from "./Poppins/Poppins-Thin.woff";
import poppinsThinWoff2 from "./Poppins/Poppins-Thin.woff2";
import telegrafRegularWoff from "./Telegraf/TelegrafRegular400.woff";
import telegrafRegularWoff2 from "./Telegraf/TelegrafRegular400.woff2";

const LOCAL_FONTS = `
  @font-face {
    font-family: 'Telegraf';
    src: local('Telegraf Regular'), local('Telegraf-Regular'),
      url(${telegrafRegularWoff2}) format('woff2'),
      url(${telegrafRegularWoff}) format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Poppins';
    src: local('Poppins Black'), local('Poppins-Black'),
      url(${poppinsBlackWoff2}) format('woff2'),
      url(${poppinsBlackWoff}) format('woff');
    font-weight: 900;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Poppins';
    src: local('Poppins Bold'), local('Poppins-Bold'),
      url(${poppinsBoldWoff2}) format('woff2'),
      url(${poppinsBoldWoff}) format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Poppins';
    src: local('Poppins Extra Light'), local('Poppins-ExtraLight'),
      url(${poppinsExtraLightWoff2}) format('woff2'),
      url(${poppinsExtraLightWoff}) format('woff');
    font-weight: 200;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Poppins';
    src: local('Poppins Light'), local('Poppins-Light'),
      url(${poppinsLightWoff2}) format('woff2'),
      url(${poppinsLightWoff}) format('woff');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Poppins';
    src: local('Poppins Medium'), local('Poppins-Medium'),
      url(${poppinsMediumWoff2}) format('woff2'),
      url(${poppinsMediumWoff}) format('woff');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Poppins';
    src: local('Poppins Regular'), local('Poppins-Regular'),
      url(${poppinsRegularWoff2}) format('woff2'),
      url(${poppinsRegularWoff}) format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Poppins';
    src: local('Poppins SemiBold'), local('Poppins-SemiBold'),
      url(${poppinsSemiBoldWoff2}) format('woff2'),
      url(${poppinsSemiBoldWoff}) format('woff');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Poppins';
    src: local('Poppins Thin'), local('Poppins-Thin'),
      url(${poppinsThinWoff2}) format('woff2'),
      url(${poppinsThinWoff}) format('woff');
    font-weight: 100;
    font-style: normal;
    font-display: swap;
  }
`;

export default LOCAL_FONTS;
