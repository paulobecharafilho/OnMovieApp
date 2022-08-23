import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { MaterialIcons, Feather } from '@expo/vector-icons'; 
import { TextInput } from 'react-native';


export const Container = styled.View`
    width: 100%;
    height: 50px;
    background-color: ${({ theme }) => theme.colors.inactive};
    
    border-radius: 10px;
    flex-direction: row;

    align-items: center;
    padding-left: 20px;
    padding-right: 20px;

`;

export const Icon = styled(MaterialIcons)`
    font-family: ${({ theme }) => theme.fonts.poppins_regular};
    font-size: ${RFValue(15)}px;

    margin-right: 10px;
`;

export const Input = styled(TextInput)`
    width: 90%;
    font-family: ${({ theme }) => theme.fonts.poppins_regular};
    font-size: ${RFValue(12)}px;
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