import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';


export const Container = styled(TouchableOpacity)`
  padding: 8px 10px;
  height: 35px;
  
  flex-direction: row;

  border: solid 0.5px;
  border-color: ${({ theme }) => theme.colors.primary};
  border-radius: 30px;
  margin: 10px 10px;

  align-items: center;
`;

export const Icon = styled(FontAwesome5)`
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.shape};
  margin-right: 10px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.shape};
`;