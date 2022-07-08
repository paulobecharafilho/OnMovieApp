import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { TouchableOpacity } from 'react-native';

export const Container = styled(TouchableOpacity)`
    width: 100%;
    padding: 20px 20px;

    border: solid 0.5px;
    border-color: ${({ theme }) => theme.colors.text_light};
    border-radius: 10px;

    margin-bottom: 15px;

    justify-content: space-between;
`;

export const ThumbnailsView = styled.View``;

export const Content = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 20px;
`;

export const InfoWrapper = styled.View``;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.text_light};

  line-height: ${RFValue(18)}px;

  margin-bottom: 8px;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const StatusView = styled.View`
  padding: 1px 6px;
  border-radius: 30px;
  margin-right: 15px;
`;

export const StatusText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(8)}px;
  color: ${({ theme }) => theme.colors.text_light};

  line-height: ${RFValue(12)}px;
`;

export const Scenes = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.text_light};

  line-height: ${RFValue(15)}px;

  margin-right: 15px;
`;

export const Date = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.text_light};

  line-height: ${RFValue(15)}px;
`;

export const Icon = styled(MaterialCommunityIcons)`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(17)}px;
  color: ${({ theme }) => theme.colors.text_light};
`;
