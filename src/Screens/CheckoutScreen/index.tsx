import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  View,
  BackHandler,
  TouchableOpacity,
  StyleSheet,
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
import { getProjectById } from "../../services/getProjectById";

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
  const [qtdFranquias, setQtdFranquias] = useState(0);
  const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfo>();

  const [paymentIntent, setPaymentIntent] = useState(``);
  const [paymentOnlyCredits, setPaymentOnlyCredits] = useState(false);
  const [projectRefreshed, setProjectRefreshed] = useState<ProjectProps>();

  const [loading, setLoading] = useState(true);
  const [loadingForButton, setLoadingForButton] = useState(false);

  const API_URL = `https://onmovie.video/stripe`;

  useFocusEffect(
    useCallback(() => {

      let dateFormatted = format(
        new Date(params.dateSelected),
        `yyyy-MM-dd kk:mm:ss`
      );

      let qtdFranquiasAux = 0;

      // navigation.addListener('beforeRemove', (e) => {
      //     // e.preventDefault();
      //     handleBackButton();
      //     //clear setInterval here and go back
      // })

      async function getUserInfo() {
        await api
          .get(`get_user.php?userId=${params.userId}`)
          .then(async (response) => {
            if (response.data.response === "Success") {
             
              await setUserInfo(response.data.user[0]);
              await getAssinaturas(params.userId);
              await checkoutProject(response.data.user[0]);
            }
          });
      }

      async function getAssinaturas(userId) {
        api.get(`get_assinaturas.php?userId=${userId}`)
        .then((response) => {
          if (response.data.response === 'Success') {
            setQtdFranquias(Number(response.data.qtd_franquias));
            qtdFranquiasAux = Number(response.data.qtd_franquias);
          } else {
            console.log(`@Home - Erro no getAssinaturas -> ${response.data.response}`)
          }
        })
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
            // console.log(`@CheckoutScreen -> CheckoutInfoResult -> ${result.checkoutInfo}`);
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
        .post(`success_app.php?userId=${params.userId}`, {
          paymentIntentId: paymentIntent,
        })
        .then(async (response) => {
          if (response.data.response === "Success") {
            refreshProject();
          } else if (response.data.response === "Already Paid") {
            Alert.alert(
              `Atenção!`,
              `Este serviço já foi pago. Por favor, entre em contato conosco!`
            );
          } else {
            Alert.alert(`Erro -> ${JSON.stringify(response.data)}`);
          }
        });
    }
  };

  async function handlePayWithCredits() {
    await api
      .post(`proc_solic_serv_credOnly.php?userId=${params.userId}`, {
        projectId: params.project.id_proj,
        valPed: params.selectEditorSelected
          ? params.paymentInfo.valor_com_extra_sel
          : params.paymentInfo.val_ped,
        projectName: params.project.nome_proj,
        paymentCredito: checkoutInfo.payment_using_credits,
      })
      .then((response) => {
        if (response.data.response === "Success") {
          refreshProject();
        }
      });
  }

  async function handlePayWithAssinaturas() {
    await api
      .post(`proc_solic_serv_assinatura.php?userId=${params.userId}`, {
        projectId: params.project.id_proj,
        valPed: params.selectEditorSelected
          ? params.paymentInfo.valor_com_extra_sel
          : params.paymentInfo.val_ped,
        projectName: params.project.nome_proj,
      })
      .then((response) => {
        console.log(
          `@CheckoutScreen: PaymentAssinaturas -> ${JSON.stringify(response.data)}`
        );
        if (response.data.response === "Success") {
          refreshProject();
        }
      });
  }


  async function refreshProject() {
    await getProjectById(params.userId, params.project.id_proj, theme)
    .then((result) => {
      if (result.result === 'Success') {
        // console.log(`Refresh Done Successfully -> ${JSON.stringify(result.projectResult)}`);
        let projectRefreshed = result.projectResult;
        navigation.navigate('ProjectDetails', {
          project: projectRefreshed,
          userId: params.userId
        })
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
    handleBackButton();
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
                <PriceSubtitle>
                  Pagamento Total utilzando Créditos:
                </PriceSubtitle>
                <PriceTitle>{`R$ ${checkoutInfo.payment_using_credits_formatted}`}</PriceTitle>
              </TotalPriceWrapper>
            )}
            {qtdFranquias > 0 ?
              <TotalPriceWrapper style={{marginVertical: 30}}>
                <PriceTitle style={{textAlign: "center"}}>
                  Obs: Você é assinatura e possui {qtdFranquias} projetos restantes.
                </PriceTitle>
              </TotalPriceWrapper>
            : null}

            <View style={{ width: "100%", alignItems: "center" }}>
              {qtdFranquias > 0 ? (
                <TouchableOpacity
                // disabled={!loadingForButton}
                onPress={handlePayWithAssinaturas}
                style={[
                  styles.button,
                  { backgroundColor: theme.colors.secondary, marginBottom: 15},
                ]}
              >
                <Title
                  style={{
                    color: theme.colors.shape,
                    fontFamily: theme.fonts.poppins_medium,
                    fontSize: 15,
                  }}
                >
                  Utilizar assinatura!
                </Title>
              </TouchableOpacity>
              ) : null}

              {paymentOnlyCredits ? (
                <TouchableOpacity
                  // disabled={!loadingForButton}
                  onPress={handlePayWithCredits}
                  style={[
                    styles.button,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Title
                    style={{
                      color: theme.colors.shape,
                      fontFamily: theme.fonts.poppins_medium,
                      fontSize: 15,
                    }}
                  >
                    Pagar com Créditos
                  </Title>
                </TouchableOpacity>
              ) : (
                // <Button
                //   // disabled={!loadingForButton}
                //   title="Pagar com créditos"
                //   onPress={handlePayWithCredits}
                // />
                <TouchableOpacity
                  disabled={!loadingForButton}
                  onPress={openPaymentSheet}
                  style={[
                    styles.button,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                   <Title
                    style={{
                      color: theme.colors.shape,
                      fontFamily: theme.fonts.poppins_medium,
                      fontSize: 15,
                    }}
                  >
                    Pagar com Cartão
                  </Title>
                </TouchableOpacity>
                // <Button
                //   disabled={!loadingForButton}
                //   title="Ir para Pagamento"
                //   onPress={openPaymentSheet}
                // />
              )}
            </View>
          </ContentContainerEnd>
        </Content>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 50,
  },
});
