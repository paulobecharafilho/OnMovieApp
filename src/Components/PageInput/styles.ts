import styled from 'styled-components/native';
import { TextInput } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';

export const Container = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

export const Input = styled(TextInput)`
  width: 90%;
  height: 50%;
  
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(17)}px;
  color: ${({ theme }) => theme.colors.shape};

`;


export const VisibleButton = styled.TouchableOpacity`
    width: 20px;
    height: 15px;

    position: absolute;
    right: 10px;
`;


export const IconFinal = styled(Feather)`
    font-family: ${({ theme }) => theme.fonts.poppins_regular};
    font-size: ${RFValue(15)}px;
    color: ${({ theme }) => theme.colors.shape};
`;