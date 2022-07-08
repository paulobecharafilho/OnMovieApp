import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { FlatList, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';


export const AudioContainer = styled.View`
  width: 100%;
  padding: 5px 30px;
  

  border: solid 1px;
  border-color: ${({ theme }) => theme.colors.primary_light};
  border-radius: 10px;

  align-items: center;
  `;

export const AudioContainerRow = styled.View`
  width: 100%;
  
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const AudioTitleWrapper = styled.View``;

export const AudioTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(13)}px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const AudioSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_light};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const AudioView = styled(TouchableOpacity)`
  width: 50px;
  height: 50px;

  align-items: center;
  justify-content: center;

  border: solid 1px;
  border-color: ${({ theme }) => theme.colors.primary};
  border-radius: 25px;
`;

export const IconButton = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
  padding: 5px 5px;
`;

export const AudioIcon = styled(FontAwesome)`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const AudioPlayerView = styled.View`
  width: 100%;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const AudioPlayerIcon = styled(FontAwesome)`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.primary};
`;



