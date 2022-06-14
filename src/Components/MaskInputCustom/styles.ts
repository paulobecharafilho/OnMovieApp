import styled from 'styled-components/native';
import MaskInput from 'react-native-mask-input';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';

export const Container = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

export const Input = styled(MaskInput)`
  width: 90%;
  height: 50%;
  
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.shape};

`;
