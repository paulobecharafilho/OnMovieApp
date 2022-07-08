import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { FlatList, Platform, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';

interface DurationViewProps extends TouchableOpacityProps {
  isSelected? : boolean
}

interface DurationTextProps extends Text {
  isSelected?: boolean
}

interface FormatProps {
  icons: string[],
  title: string,
}

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background_secondary}
`;

export const ContentBegin = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const TitleBegin = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(25)}px;
  color: ${({ theme }) => theme.colors.primary};

  text-align: center;
`;

export const FormContainer = styled.View`
  flex: 1;
  padding-bottom: ${getBottomSpace() + 20}px;
`;

export const Header = styled.View`
  height: 12%;
  justify-content: flex-end;
  padding: 0 30px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const PageTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.primary}

`;

export const HeaderIcon = styled(Ionicons)`
  font-size: ${RFValue(18)}px;
  color: ${({ theme }) => theme.colors.primary}
`;

export const Content = styled.KeyboardAvoidingView`
  flex: 1;
  padding: 30px 30px ${getBottomSpace() + 20}px 30px;
  
`;

export const InfoContent = styled.View`
  justify-content: space-between;
`;

export const InfoWrapper = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const InfoTitleWrapper = styled.View``;

export const InfoTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(13)}px;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 21px;
`;

export const InfoSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(11)}px;
  color: ${({ theme }) => theme.colors.primary_light};
`;

export const InfoPageNumberWrapper = styled.View`
  width: 8%;

`;

export const InfoPage = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(13)}px;
  color: ${({ theme }) => theme.colors.primary};
`;


export const FormContent = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

export const NameContent = styled.View`
  flex: 1;
  align-items: center;
  margin-top: 80px;
`;

export const TitleWrapper = styled.View`
  width: 100%;
  align-items: center;
`;

export const Subtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_light};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.primary};

  text-align: center;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(18)}px;
  color: ${({ theme }) => theme.colors.primary};

  text-align: center;
`;

export const TimeContent = styled.View`
  flex: 1;
  width: 100%;
  padding-top: 50px;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 30px;
  
`;

export const DurationCompFlatList = styled(FlatList)``;

export const DurationView = styled.TouchableOpacity<DurationViewProps>`
  padding: 5px 10px;
  border-radius: 20px;
  height: 40%;
  align-items: center;
  justify-content: center;
  ${({ isSelected, theme }) => isSelected && `
    border: 1px solid white;
    background-color: ${theme.colors.primary};
  `}

  margin-bottom: 30px;
`;

export const DurationText = styled.Text<DurationTextProps>`
  font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
  font-size: ${RFValue(10)}px;
  color: ${({ isSelected ,theme }) => isSelected ? theme.colors.shape : theme.colors.primary};

  text-align: center;
`;

export const DescriptionContainer = styled.View`
  flex: 3;
  align-items: center;
  margin-top: 40px;
`;

export const LinkContainer = styled.View`
  flex: 1;
  align-items: center;
  margin-top: 40px;
`;

export const FormatsContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
`;

export const FormatsTitleWrapper = styled.View`
  flex: 2;
  justify-content: space-between;
`;


export const FormatsFlatListContainer = styled.View`
  flex: 3;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;
/* 
export const FormatsFlatList = styled(FlatList as new () => FlatList<FormatProps>)`
`; */

export const FormatsValueWrapper = styled.View`
  flex: 1;
`;


