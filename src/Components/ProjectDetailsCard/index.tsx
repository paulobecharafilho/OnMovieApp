import React from 'react';
import { StyleSheet, TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components';

import IconChecked from '../../assets/icons/check.svg';
import ChevronRight from '../../assets/icons/chevronRightIcon.svg';

import {
  Container,
  ContainerRow,
  IconAndTitleWrapper,
  IconWrapper,
  Icon,
  MessagesQuantityWrapper,
  MessagesQuantity,
  TitleWrapper,
  Title,
  Subtitle,
  
} from './styles';

interface Props extends TouchableOpacityProps {
  icon: string;
  isCompleted?: boolean;
  title: string;
  subtitle: string;
  isDisabled?: boolean;
  messagesQuantity?: number;
}



export function ProjectDetailsCard( { icon, isCompleted, title, subtitle, isDisabled, messagesQuantity, ...rest }: Props) {
  const theme = useTheme();

  return (
    <Container disabled={isDisabled} {...rest}>
      <ContainerRow>
        <IconAndTitleWrapper>
          <IconWrapper>
            <Icon name={icon} style={{color: isDisabled ? theme.colors.shape_inactive : theme.colors.shape}}/>
            {isCompleted ? <IconChecked width={15} height={15} style={style.IconChecked} /> : null}
            {messagesQuantity ? 
              <MessagesQuantityWrapper>
                <MessagesQuantity>{messagesQuantity}</MessagesQuantity>
              </MessagesQuantityWrapper>
            : null}
          </IconWrapper>

          <TitleWrapper>
            <Title style={{color: isDisabled ? theme.colors.shape_inactive : theme.colors.shape}}>{title}</Title>
            <Subtitle style={{color: isDisabled ? theme.colors.shape_inactive : theme.colors.shape}}>{subtitle}</Subtitle>
          </TitleWrapper>
        </IconAndTitleWrapper>
        
        <ChevronRight />
      </ContainerRow>

    </Container>
  );
}

const style = StyleSheet.create({
  IconChecked: {
    position: 'absolute',
    top: 0,
    right: 0,
  }
})