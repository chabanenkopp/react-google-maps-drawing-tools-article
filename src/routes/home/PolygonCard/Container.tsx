import styled from "styled-components";
import { Space } from "Theme";
import { Flex } from "components/Layout";

export const Container = styled(Flex)`
  align-items: center;

  button:not(:last-child) {
    margin-right: ${Space.S};
  }
`;
