import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "styled-components";
import { BackButton } from "../../Components/BackButton";
import { ButtonCustom } from "../../Components/ButtonCustom";
import { CalendarModal } from "../../Components/CalendarModal";
import { CheckoutDetailsCard } from "../../Components/CheckoutDetailsCard";
import api from "../../services/api";
import { getPaymentInfo } from "../../services/getPaymentInfo";
import { PaymentInfoProps, ProjectProps } from "../../utils/Interfaces";
import DatePicker, { DatePickerProps } from 'react-native-date-picker'


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

interface Params {
  userId: number;
  projectReceived: ProjectProps;
}

export function CheckoutDetails({ navigation }) {
  const theme = useTheme();
  const route = useRoute();

  const params = route.params as Params;

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoProps>({});
  const [formats, setFormats] = useState("");
  const [selectEditorSelected, setSelectEditorSelected] = useState(false);
  const [iscouponVisible, setIsCouponVisible] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponAux, setCouponAux] = useState('');
  const [isCouponValid, setIsCouponValid] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponDiscountFormatted, setCouponDiscountFormatted] = useState(0);

  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [dateSelected, setDateSelected] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 2)));
  const [dateAux, setDateAux]= useState(new Date())


  const [refreshing, setRefreshing] = useState(false);


  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(100).then(() => {
      setRefreshing(false);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      setFormats("");
      async function getPaymentInfosAux() {
        await getPaymentInfo(
          params.userId,
          params.projectReceived.id_proj,
          couponDiscount,
        ).then((response) => {
          if (response.result === "Success") {
            setPaymentInfo(response.paymentInfo[0]);
            // console.log(
            //   `@CheckoutDetails: useEffect -> paymentInfo -> ${JSON.stringify(
            //     response.paymentInfo[0]
            //   )}`
            // );
          }
        });
      }

      function getFormats() {
        const formatsFormatted: string[] = JSON.parse(
          params.projectReceived.video_format
        );
        let formatsArray: string = "";
        for (let format of formatsFormatted) {
          formatsArray += ` | ${format}`;
          setFormats(formatsArray);
        }
      }

      // console.log(`New Date() -> ${new Date()}... new Date 2 -> ${new Date(new Date().setDate(new Date().getDate() + 2))}`)

      getPaymentInfosAux();
      getFormats();
    }, [coupon])
  );

  function handleChangeToggle() {
    setSelectEditorSelected(!selectEditorSelected);
  }

  async function handleApplyCoupon() {
    // setCoupon(couponAux);
    // onRefresh();

    await api.post(`proc_coupon.php?`, {
      coupon: couponAux
    })
    .then((response) => {
      if (response.data.response === 'Success') {        
        if (response.data.couponInfo[0].perc_desconto > 0) {
          let perc_desconto = response.data.couponInfo[0].perc_desconto;
          let discount = ((paymentInfo.val_edicao * perc_desconto)/100);
          setCouponDiscount(discount);
          setIsCouponValid(true);
          setCoupon(couponAux)
          setIsCouponVisible(false);
          // console.log(`PercCoupon > 0 -> ${discount}`)


        } else if (response.data.couponInfo[0].val_desconto > 0) {
          let val_desconto = response.data.couponInfo[0].val_desconto;
          let discount = val_desconto;
          setCouponDiscount(discount);
          setIsCouponValid(true);
          setCoupon(couponAux)
          setIsCouponVisible(false);
          // console.log(`ValDesconto > 0 -> ${discount}`)
        } 
      } else {
        setIsCouponValid(false);
        Alert.alert(`Cupom inválido`);
      }
    })
    .catch((err) => {
      console.log(`@CheckoutDetails -> erro checkCoupon -> ${err}`)
    })
  }

  function handleRemoveCoupon() {
    setCoupon('');
    setCouponDiscount(0);
    setCouponAux('');
    setIsCouponValid(false);
  }

  function handleGoToCheckoutScreen() {
    handleCloseModal();
    navigation.navigate(`CheckoutScreen`, {
      userId: params.userId,
      project: params.projectReceived,
      dateSelected: String(dateSelected),
      paymentInfo: paymentInfo,
      coupon: coupon,
      couponDiscount: couponDiscount,
      selectEditorSelected: selectEditorSelected,
    })
  }

  function handleCloseModal() {
    setIsCalendarModalVisible(false);
  }

  function handleBackButton() {
    navigation.goBack();
  }

  return (
    <Container>
      <Header>
        <HeaderWrapper>
          <BackButton onPress={handleBackButton} />
          <HeaderTitle>Detalhamento</HeaderTitle>
          <HeaderLogo />
        </HeaderWrapper>
      </Header>

      <Content>
        <ContentContainerInit>
          <CouponWrapper>
            <CouponButton onPress={() => setIsCouponVisible(!iscouponVisible)}>
              <CouponTitle>Se você tem cupom de desconto, clique aqui!</CouponTitle>
            </CouponButton>
            {iscouponVisible ?
              <CouponInputRow>
                <CouponInput 
                  placeholder="digite aqui seu cupom"
                  autoCapitalize="characters"
                  autoCompleteType="off"
                  autoCorrect={false}
                  onChangeText={setCouponAux}
                  value={couponAux}
                  editable={!couponDiscount}
                />
                {!couponDiscount ? 
                  <TouchableOpacity style={[style.button, {backgroundColor: theme.colors.primary}]} onPress={handleApplyCoupon}>
                    <Subtitle style={{color: theme.colors.shape}}>Aplicar</Subtitle>
                  </TouchableOpacity>
                :
                  <TouchableOpacity style={[style.button, {backgroundColor: theme.colors.attention}]} onPress={handleRemoveCoupon}>
                    <Subtitle style={{color: theme.colors.shape}}>Remover</Subtitle>
                  </TouchableOpacity>
                }
              </CouponInputRow>
            : null}
          </CouponWrapper>
          <TitleWrapper>
            <Title>Detalhamento</Title>
            <Subtitle>
              Descrição completa deste projeto - id:{" "}
              {params.projectReceived.id_proj}
            </Subtitle>
          </TitleWrapper>

          <CardsContainer>
            <CheckoutDetailsCard
              title={params.projectReceived.nome_proj}
              subtitle="Valor da Edição"
              price={paymentInfo.val_edicao_real}
            />
            {paymentInfo.qtd_extra_formats  ? 
              <CheckoutDetailsCard
                title="Formatos Extras"
                subtitle={formats}
                price={paymentInfo.val_tot_extr_form_real}
              />
            : null}
            {selectEditorSelected ? (
              <CheckoutDetailsCard
                title="Editor Select"
                subtitle="Adicional por escolha de editor 5 estrelas"
                price={paymentInfo.valor_extra_sel_conv}
              />
            ) : null}
            {isCouponValid && couponDiscount ? (
              <CheckoutDetailsCard
                title="Desconto por cupom"
                subtitle={`Desconto pelo cupom ${coupon}`}
                price={couponDiscount.toFixed(2).replace("." , ",")}
                isDiscount
                // customColor={theme.colors.shape}
              />
            ) : null}
          </CardsContainer>
        </ContentContainerInit>

        <ContentContainerEnd>
          <CheckoutDetailsCard
            title="Editor Select"
            subtitle="Quero um editor 5 estrelas"
            price={paymentInfo.valor_extra_sel_conv}
            hasToggle={true}
            isToggleOn={selectEditorSelected}
            handleChangeToggle={handleChangeToggle}
          />

          <TotalPriceWrapper>
            <PriceSubtitle>Valor total do Projeto</PriceSubtitle>
            <PriceTitle>{selectEditorSelected ? `R$ ${paymentInfo.valor_com_extra_sel_real}`: `R$ ${paymentInfo.val_tot_ped_real}`}</PriceTitle>
          </TotalPriceWrapper>

          <View style={{width: '100%', alignItems: "center"}}>
            <ButtonCustom 
              text={"Avançar"}
              backgroundColor={theme.colors.background_primary}
              highlightColor={theme.colors.shape}
              onPress={() => setIsCalendarModalVisible(true)}
                          
            />
          </View>
        </ContentContainerEnd>
      </Content>
      
      {/* Início do Modal para o calendário */}

      {isCalendarModalVisible ?
      <CalendarModal 
        dateSelected={dateSelected}
        dateAux={dateAux}
        setDateSelected={setDateSelected}
        handleCloseModal={handleCloseModal}
        handleGoToCheckoutScreen={handleGoToCheckoutScreen}
      />
       
      : null}

    </Container>
  );
}

const style = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  }
})
