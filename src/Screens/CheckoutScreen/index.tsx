import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  View,
  BackHandler,
} from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import { useTheme } from "styled-components";
import { BackButton } from "../../Components/BackButton";
import { ButtonCustom } from "../../Components/ButtonCustom";
import { CheckoutDetailsCard } from "../../Components/CheckoutDetailsCard";
import { UserDTO } from "../../dtos/UserDTO";
import api, { apiStripe } from "../../services/api";
import { checkoutService } from "../../services/checkoutProject";
import {
  CheckoutInfo,
  PaymentInfoProps,
  ProjectProps,
} from "../../utils/Interfaces";

import {
  Container,
  Header,
  HeaderWrapper,
  HeaderLogo,
  HeaderTitle,
  Content,
  ContentContainerInit,
  TitleWrapper,
  Title,
  Subtitle,
  CardsContainer,
  ContentContainerEnd,
  TotalPriceWrapper,
  PriceTitle,
  PriceSubtitle,
  CouponWrapper,
  CouponButton,
  CouponTitle,
  CouponInputRow,
  CouponInput,
} from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProjetctFiles } from "../../services/getProjectFiles";
import { format, setDate } from "date-fns/esm";

interface Params {
  userId: number;
  project: ProjectProps;
  dateSelected: string;
  paymentInfo: PaymentInfoProps;
  coupon: string;
  couponDiscount: number;
  selectEditorSelected: boolean;
}

interface CheckoutReturnProps {
  result: string;
  checkoutInfo: CheckoutInfo;
}

export function CheckoutScreen({ navigation }) {
  const theme = useTheme();
  const route = useRoute();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const params = route.params as Params;

  const [userInfo, setUserInfo] = useState<UserDTO>();
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo>();

  const [paymentIntent, setPaymentIntent] = useState(``);
  const [paymentOnlyCredits, setPaymentOnlyCredits] = useState(false);
  const [projectRefreshed, setProjectRefreshed] = useState<ProjectProps>();

  const [loading, setLoading] = useState(true);
  const [loadingForButton, setLoadingForButton] = useState(false);

  const API_URL = `https://zrgpro.com/on_app/stripe`;


  useFocusEffect(
    useCallback(() => {
      let dateFormatted = format(new Date(params.dateSelected), `yyyy-MM-dd kk:mm:ss`);

      async function getUserInfo() {
        await api
          .get(`get_user.php?userId=${params.userId}`)
          .then((response) => {
            if (response.data.response === "Success") {
              console.log;
              setUserInfo(response.data.user[0]);
              checkoutProject(response.data.user[0]);
            }
          });
      }

      async function checkoutProject(user: UserDTO) {
        await checkoutService(
          params.userId,
          params.project.id_proj,
          params.couponDiscount,
          params.project.nome_proj,
          params.paymentInfo.valor_extra_sel,
          params.paymentInfo.val_ped + params.couponDiscount,
          dateFormatted,
          params.selectEditorSelected
        )
          .then((result: CheckoutReturnProps) => {
            if ((result.result = "Success")) {
              setCheckoutInfo(result.checkoutInfo);
              if (result.checkoutInfo.payment_using_money <= 0) {
                setPaymentOnlyCredits(true);
                setLoading(false);
              } else {
                initializePaymentSheet(result.checkoutInfo, user);
              }
              // console.log(`@checkoutScreen -> checkoutResult: ${JSON.stringify(result.checkoutInfo)}`)
            } else {
              Alert.alert(`Erro ->`, `Erro ao realizar Checkout`);
            }
          })
          .catch((err) => {
            Alert.alert(`Erro`, `${err}`);
            setLoading(false);
          });
      }

      getUserInfo();
    }, [])
  );




  const fetchPaymentSheetParams = async (
    checkoutInfoReceived: CheckoutInfo,
    user: UserDTO
  ) => {
   
    // console.log(`checkoutReceived: ${JSON.stringify(checkoutInfoReceived)} e val_ped = ${params.paymentInfo.val_ped}`);
    const result = await apiStripe.post(
      `create-payment-intent.php?userId=${params.userId}&projId=${params.project.id_proj}`,
      {
        nomeProj: params.project.nome_proj,
        valPed: params.selectEditorSelected
          ? params.paymentInfo.valor_com_extra_sel
          : params.paymentInfo.val_ped,
        charge: checkoutInfoReceived.card_charge_formatted_to_stripe,
        email: user.email,
        stripe_id: user.stripe_id,
        nomeUser: user.nome,
        avatarUser: user.avatar,

        valTotFormatsExtra: params.paymentInfo.val_formatos_extra,
        qtdExtraFormat: params.paymentInfo.qtd_extra_formats,
        pagUsingCred: checkoutInfoReceived.payment_using_credits,
      }
    );
    setPaymentIntent(result.data.paymentIntentInfo.paymentIntentId);
    // console.log(`@CheckoutScreen - PaymentIntenInfo -> ${JSON.stringify(result.data)}`)
    setLoading(false);

    return {
      paymentIntent: result.data.paymentIntentInfo.paymentIntent,
      ephemeralKey: result.data.paymentIntentInfo.ephemeralKey,
      customer: result.data.paymentIntentInfo.customerId,
      publishableKey: result.data.paymentIntentInfo.publishableKey,
    };
  };

  const initializePaymentSheet = async (checkoutInfoReceived, user) => {
    // console.log(`Iniciando Initialize com checkoutInfoReceived -> ${JSON.stringify(checkoutInfoReceived)}`)
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await fetchPaymentSheetParams(checkoutInfoReceived, user);

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: false,
      merchantDisplayName: "OnMovie",
      
    });
    if (!error) {
      setLoadingForButton(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error, paymentOption } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      // Alert.alert("Success", "Your order is confirmed!");
      await apiStripe
        .post(`success.php?userId=${params.userId}`, {
          paymentIntentId: paymentIntent,
        })
        .then(async (response) => {
          // console.log(`@CheckoutScreen - OnSuccess -> paymentRetrieve = ${JSON.stringify(response.data)}`)

          if (response.data.response === "Success") {
            refreshProject();
          } else if (response.data.response === 'Already Paid') {
            Alert.alert(`Atenção!`, `Este serviço já foi pago. Por favor, entre em contato conosco!`)
          }
          
          else {
            Alert.alert(`Erro -> ${JSON.stringify(response.data)}`)
          }
        });
    }
  };

  async function handlePayWithCredits() {
    await api.post(`proc_solic_serv_credOnly.php?userId=${params.userId}`, 
    {
      projectId: params.project.id_proj,
      valPed: params.selectEditorSelected
          ? params.paymentInfo.valor_com_extra_sel
          : params.paymentInfo.val_ped,
      projectName: params.project.nome_proj,
      paymentCredito: checkoutInfo.payment_using_credits,
    })
    .then((response) => {
      console.log(`@CheckoutScreen: PaymentCredit -> ${JSON.stringify(response.data)}`)
      if (response.data.response === 'Success') {
        refreshProject();
      }
    })
  }

  function refreshProject() {
    api.get(`list_project_by_id.php?userId=${params.userId}&projectId=${params.project.id_proj}`)
    .then( async (response) => {
      if (response.data.response === 'Success') {
        // console.log(`@CheckoutScreen -> refreshProject -> ${JSON.stringify(response.data.projetos[0])}`);
        let item: ProjectProps = response.data.projetos[0];

        await getProjetctFiles(params.userId, item.id_proj).then((result) => {
          if (result.result === "Success") {
            item.files = result.libraryDependenciesFiles;
            item.qtd_files = result.libraryDependenciesFiles.length;
          }
        });

        switch (item.status_proj) {
          case "Rascunho":
            item.newStatusProj = "Criação";
            item.highlightColor = theme.colors.highlight;
            break;

          case "Na Fila":
            item.newStatusProj = "Fila";
            item.highlightColor = theme.colors.secondary;
            break;

          case "em edicao":
            item.newStatusProj = "Edição";
            item.highlightColor = theme.colors.title;
            break;

          case "Em edicao":
            item.newStatusProj = "Edição";
            item.highlightColor = theme.colors.title;
            break;

          case "controle":
            item.newStatusProj = "Edição";
            item.highlightColor = theme.colors.title;
            break;

          case "correcao_controle":
            item.newStatusProj = "Edição";
            item.highlightColor = theme.colors.title;
            break;

          case "em correcao":
            item.newStatusProj = "Correção";
            item.highlightColor = theme.colors.highlight_pink;
            break;

          case "em aprovacao":
            item.newStatusProj = "Aprovação";
            item.highlightColor = theme.colors.attention;
            break;

          case "Em aprovacao":
            item.newStatusProj = "Aprovação";
            item.highlightColor = theme.colors.attention;
            break;

          case "Aprovado":
            item.newStatusProj = "Finalizado";
            item.highlightColor = theme.colors.success;
            break;

          default:
            console.log(
              `Projeto id ${item.id_proj} com status ${item.newStatusProj} não ficou em nenhuma categoria`
            );
        }


        setProjectRefreshed(item);

        navigation.navigate(`ProjectDetails`, {
          project: item,
          userId: params.userId,
        });
      }
    })
  }

  async function handleBackButton() {
    await apiStripe.post(
      `proc_cancel_checkout.php?userId=${params.userId}&projId=${params.project.id_proj}`,
      {
        paymentIntentId: paymentIntent,
      }
    );

    navigation.goBack();
  }

  const backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => handleBackButton() },
    ]);
    return true;
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  

  return (
    <Container>
      <Header>
        <HeaderWrapper>
          <BackButton onPress={handleBackButton} />
          <HeaderTitle>Pagamento</HeaderTitle>
          <HeaderLogo />
        </HeaderWrapper>
      </Header>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Content>
          <ContentContainerInit>
            <TitleWrapper>
              <Title>Checkout</Title>
              <Subtitle>
                Descrição sobre o pagamento do projeto: {params.project.id_proj}
              </Subtitle>
            </TitleWrapper>

            <CardsContainer>
              <CheckoutDetailsCard
                title="Valor total da Edição"
                subtitle={`projeto ${params.project.nome_proj}`}
                price={
                  params.selectEditorSelected
                    ? params.paymentInfo.valor_com_extra_sel_real
                    : params.paymentInfo.val_tot_ped_real
                }
              />
              {checkoutInfo.payment_using_credits ? (
                <CheckoutDetailsCard
                  title="Pagamento em Créditos"
                  subtitle="Valor a ser descontado dos seus créditos"
                  price={
                    checkoutInfo.payment_using_credits
                      ? checkoutInfo.payment_using_credits_formatted
                      : 0
                  }
                  customColor={theme.colors.secondary}
                />
              ) : null}
              {/* {checkoutInfo.payment_using_money ? (
                <CheckoutDetailsCard
                  title="Pagamento em Cartão"
                  subtitle="Valor a ser pago no cartão, já descontando seus créditos"
                  price={checkoutInfo.payment_using_money ? checkoutInfo.payment_using_money_formatted : 0}
                  customColor={theme.colors.secondary}
                />
              ) : null} */}
            </CardsContainer>
          </ContentContainerInit>

          <ContentContainerEnd>
            {/* <CheckoutDetailsCard
              title="Editor Select"
              subtitle="Quero um editor 5 estrelas"
              price={params.paymentInfo.valor_extra_sel_conv}
              hasToggle={true}
              isToggleOn={}
              handleChangeToggle={handleChangeToggle}
            /> */}
            {checkoutInfo.payment_using_money ? (
              <TotalPriceWrapper>
                <PriceSubtitle>Total a ser pago no cartão</PriceSubtitle>
                <PriceTitle>{`R$ ${checkoutInfo.payment_using_money_formatted}`}</PriceTitle>
              </TotalPriceWrapper>
            ) : (
              <TotalPriceWrapper>
                <PriceSubtitle>Pagamento Total utilzando Créditos:</PriceSubtitle>
                <PriceTitle>{`R$ ${checkoutInfo.payment_using_credits_formatted}`}</PriceTitle>
              </TotalPriceWrapper>
            )}

            <View style={{ width: "100%", alignItems: "center" }}>
              {paymentOnlyCredits ? (
                <Button
                  // disabled={!loadingForButton}
                  title="Pagar com créditos"
                  onPress={handlePayWithCredits}
                />
              ) : (
                <Button
                  disabled={!loadingForButton}
                  title="Ir para Pagamento"
                  onPress={openPaymentSheet}
                />
              )}
            </View>
          </ContentContainerEnd>
        </Content>
      )}
    </Container>
  );
}
