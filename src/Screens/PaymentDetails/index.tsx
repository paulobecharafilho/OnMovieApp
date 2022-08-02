import { useFocusEffect, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';
import { BackButton } from '../../Components/BackButton';
import { CheckoutDetailsCard } from '../../Components/CheckoutDetailsCard';
import api from '../../services/api';
import { OrderProps, ProjectProps } from '../../utils/Interfaces';

import {
  Container,
  Header,
  HeaderWrapper,
  HeaderTitleWrapper,
  HeaderTitle,
  HeaderSubtitle,
  HeaderLogo,
  Content,
  TitleWrapper,
  Title,
  Subtitle,
  CardsView,
} from './styles';

interface Params {
  userId: number;
  project: ProjectProps;
}

export function PaymentDetails({navigation}) {
  const theme = useTheme();
  const route = useRoute();

  const params = route.params as Params;

  const [orderInfo, setOrderInfo] = useState<OrderProps>({} as OrderProps);

  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function getOrder() {
       await api.get(`get_order_details.php?userId=${params.userId}&projId=${params.project.id_proj}`)
        .then((response) => {
          if(response.data.response === 'Success') {
            console.log(`@PaymentDetails -> ${response.data.orderInfo[0].order_price}`);
            setOrderInfo(response.data.orderInfo[0]);
          }
        })
        setLoading(false);
      }


      getOrder();
    }, [])
  )

  return (
    <Container>

      <Header>
        <HeaderWrapper>
          <BackButton onPress={() => navigation.goBack()} />
          <HeaderTitleWrapper>
            <HeaderTitle>
              Detalhes de pagamento
            </HeaderTitle>
            <HeaderSubtitle>Projeto id: {params.project.id_proj} - {params.project.nome_proj}</HeaderSubtitle>
          </HeaderTitleWrapper>
          <HeaderLogo />
        </HeaderWrapper>
      </Header>

      <Content>
        <TitleWrapper>
          <Title>Detalhamento</Title>
          <Subtitle>Fatura completa deste projeto</Subtitle>
        </TitleWrapper>
        {loading ? <ActivityIndicator /> : 
          <CardsView>
            <CheckoutDetailsCard
              title="Valor total da Edição"
              subtitle= {params.project.nome_proj}
              price={orderInfo.order_price}
            />
            {orderInfo.pay_using_credit ? 
              <CheckoutDetailsCard
                title="Pagamento com Créditos"
                subtitle={`${orderInfo.qtd_format_extra} formatos extras`}
                price={orderInfo.pay_using_credit}
              />
            :null}
            {orderInfo.paid_amount ? 
              <CheckoutDetailsCard
                title="Pagamento com Cartão"
                subtitle={`${orderInfo.qtd_format_extra} formatos extras`}
                price={orderInfo.paid_amount}
              />
            :null}
           
          </CardsView>
        }

        <CardsView>
          <TitleWrapper>
            <Title>Pagamento Utilizando Cartão:</Title>
          </TitleWrapper>

          <Title>Cartão Utilizado:</Title>
          <Title>{orderInfo.four_digits}</Title>
        </CardsView>

      </Content>

    </Container>
  );
}