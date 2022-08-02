import { TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

import { ButtonProps } from ".";

export const Container = styled(TouchableOpacity)<ButtonProps>`
  width: 70%;

  background-color: ${({ theme, disabled, highlightColor }) =>
    disabled
      ? theme.colors.inactive
      : highlightColor
        ? highlightColor
        : theme.colors.shape};

  border-radius: 45px;

  padding: 15px 60px;
  box-shadow: 5px 3px 3px ${({ theme }) => theme.colors.title};

`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
  font-size: ${RFValue(15)}px;

  text-align: center;
`;
