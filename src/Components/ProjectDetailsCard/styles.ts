import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const Container = styled(TouchableOpacity)`
  width: 100%;

  border: solid 0.5px;
  border-color: ${({ theme }) => theme.colors.shape_inactive};
  border-radius: 15px;

  padding: 15px;
  margin-bottom: 15px;
`;

export const ContainerRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const IconAndTitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const IconWrapper = styled.View`
  height: 35px;

  align-items: center;
  justify-content: center;

  margin-right: 15px;
`;

export const Icon = styled(MaterialCommunityIcons)`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(22)}px;
  color: ${({ theme }) => theme.colors.shape};  
`;

export const MessagesQuantityWrapper = styled.View`
  position: absolute;
  width: 14px;
  height: 14px;

  border-radius: 7px;

  top: 0;
  right: 0;

  background-color: ${({ theme }) => theme.colors.attention};

  align-items: center;
  justify-content: center;
`;

export const MessagesQuantity = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(7)}px;
  color: ${({ theme }) => theme.colors.shape};  
`;

export const TitleWrapper = styled.View``;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.shape}; 
`;

export const Subtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.shape}; 
`;
