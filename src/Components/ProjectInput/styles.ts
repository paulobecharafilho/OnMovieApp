import styled from 'styled-components/native';
import { Dimensions, TextInput } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';

export const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
 
`;

export const Input = styled(TextInput)`
  width: ${Dimensions.get('window').width - 30};
  padding: 50px 50px;
  
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.primary};

  text-align: center;

  border: solid 0.5px;
  border-color: ${({ theme }) => theme.colors.primary_light};
  border-radius: 50px;
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