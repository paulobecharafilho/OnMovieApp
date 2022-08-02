import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const ContainerEditor = styled.View`
  max-width: 80%;
  padding: 5px 10px 5px 10px;
  left: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;

  border-top-left-radius: 0px;
  border-top-right-radius: 15px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
`;

export const ContainerUser = styled.View`
  max-width: 80%;
  padding: 5px 10px 5px 10px;
  align-self: flex-end;
  background-color: ${({ theme }) => theme.colors.success};
  margin-bottom: 20px;

  border-top-left-radius: 15px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
`;

export const Message = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.shape};

  margin-bottom: 5px;
`;

export const DateSent = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_light};
  font-size: ${RFValue(8)}px;
  color: ${({ theme }) => theme.colors.shape};
  
  align-self: flex-end;
`;
