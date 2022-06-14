import { TextInput } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  width: 80%;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
`;

export const Error = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_light};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.attention};

`;