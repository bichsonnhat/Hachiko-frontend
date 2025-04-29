import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  TextInput,
  Alert,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useCartStore } from "@/stores";
import { useApi } from "@/hooks/useApi";
import {
  MinusIcon,
  ShoppingCart,
  Trash2Icon,
  MapPin,
  MinusCircle,
  PlusCircle,
} from "lucide-react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  IFullOrder,
  IStore,
  IStoreDropdown,
  IVoucher,
  IVoucherDropdown,
  OrderStatus,
} from "@/constants";
import apiService from "@/constants/config/axiosConfig";
import { useRouter } from "expo-router";

type CheckoutBtnProps = {
  getProductName: (productId: string) => string;
};

export const CheckoutBtn: React.FC<CheckoutBtnProps> = ({ getProductName }) => {
  //hard code for testing
  const [shippingFee, setShippingFee] = useState<number>(15000);
  const address = "Địa chỉ giao hàng";

  //cái này cần api current user hay gì đó, kiểu đăng nhập từ clerk thì call api để lấy rồi lưu vô store, lúc xài thì lấy ra thôi
  const userId = "67fe6f866bcac94e258e3a20";
  const username = "Nguyen Van A";
  const userphone = "0123456789";

  const router = useRouter();
  const { errorMessage, callApi: callStoreApi } = useApi<void>();
  const { errorMessage: voucherErrorMessage, callApi: callVoucherApi } =
    useApi<void>();
  const { errorMessage: checkoutErrorMessage, callApi: callCheckoutApi } =
    useApi<void>();

  const [modalVisible, setModalVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const {
    cart,
    clearCart,
    removeFromCart,
    removeExistingFromCart,
    addExistingToCart,
  } = useCartStore();
  const [totalQuantity, setTotalQuantity] = useState(0);

  const [stores, setStores] = useState<IStoreDropdown[]>([]);
  const [storeId, setStoreId] = useState("");
  const [openStoreModal, setOpenStoreModal] = useState(false);

  const [showTimeModal, setShowTimeModal] = useState(false);
  const [shippingTime, setShippingTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerName, setCustomerName] = useState(username);
  const [customerPhone, setCustomerPhone] = useState(userphone);

  const [voucher, setVoucher] = useState<IVoucher[]>([]);
  const [openCoupon, setOpenCoupon] = useState(false);
  const [couponList, setCouponList] = useState<IVoucherDropdown[]>([]);
  const [coupon, setCoupon] = useState("");

  const [percentDiscount, setPercentDiscount] = useState<number>(0);
  const [priceDiscount, setPriceDiscount] = useState<number>(0);
  const [isFreeShip, setIsFreeShip] = useState<boolean>(false);
  const [priceAfterDiscount, setPriceAfterDiscount] = useState<number>(0);

  const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
  const [paymentMethodList, setPaymentMethodList] = useState<
    {
      label: string;
      value: string;
    }[]
  >([
    { label: "Tiền mặt", value: "Tiền mặt" },
    { label: "QR Code", value: "QR Code" },
  ]);
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowPicker(Platform.OS === "ios");

    if (selectedTime) {
      const now = new Date();

      if (selectedTime < now) {
        Alert.alert("Thông báo", "Vui lòng chọn thời gian hợp lệ!");
        return;
      }
      setShippingTime(selectedTime);
    }
  };

  const handleGoToPayment = (checkoutUrl: string) => {
    router.push(`/payment?checkoutUrl=${encodeURIComponent(checkoutUrl)}`);
  };

  const handleClearInfo = () => {
    setStoreId("");
    setShippingTime(new Date());
    setCustomerName(username);
    setCustomerPhone(userphone);
    setCoupon("");
    setPaymentMethod("Tiền mặt");
  };
  const handleCloseModal = () => {
    handleClearInfo();
    setModalVisible(!modalVisible);
  };
  const handleOpenModal = async () => {
    setModalVisible(true);
  };
  const handleClearStorage = () => {
    handleCloseModal();
    clearCart();
  };

  const checkout = async (order: IFullOrder) => {
    await callCheckoutApi(async () => {
      const { data } = await apiService.post("/orders", order);
      if (data) {
        Alert.alert("Thông báo", "Đặt hàng thành công!");
        handleClearStorage();
      }
    });
  };

  const handleWithPayOS = async () => {
    await callCheckoutApi(async () => {
      const newShippingFee = isFreeShip ? 0 : shippingFee;
      const sendData = {
        productName: "Đơn hàng " + userId,
        description: "Thanh toán đơn hàng",
        price: priceAfterDiscount + newShippingFee,
        returnUrl: "exp://192.168.1.9:8081/--/payment/success", //kiểm tra lại url lúc chạy npx expo start, đều là localhost nhưng mà khác mạng thì config ip khác
        cancelUrl: "exp://192.168.1.9:8081/--/payment/failed",
      };
      const { data } = await apiService.post("/orders/payos", sendData);
      if (data) {
        const { checkoutUrl } = data.data;
        handleGoToPayment(checkoutUrl);
      }
    });
  };

  const checkoutCondition = () => {
    return cart.length > 0 && storeId.length > 0 && customerPhone.length > 0;
  };

  const handleCheckout = async () => {
    const newShippingFee = isFreeShip ? 0 : shippingFee;
    const sendData: IFullOrder = {
      order: {
        userId,
        orderAddress: address,
        orderTime: shippingTime,
        orderCost: priceAfterDiscount + newShippingFee,
        paymentMethod,
        ...(coupon.length > 0 ? { voucherId: coupon } : {}),
        recipientName: customerName,
        recipientPhone: customerPhone,
        storeId,
        orderStatus:
          paymentMethod === "Tiền mặt"
            ? OrderStatus.DELIVERING
            : OrderStatus.PENDING,
        createdAt: new Date(),
      },
      orderItems: cart.map((item) => ({
        id: item.id,
        productId: item.productId,
        productImage: item.productImage,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        topping: item.topping,
        note: item.note,
      })),
    };
    if (checkoutCondition()) {
      checkout(sendData);
      if (paymentMethod === "QR Code") {
        handleWithPayOS();
      }
    } else {
      Alert.alert("Kiểm tra giỏ hàng hoặc cung cấp đủ thông tin!");
    }
  };

  const resetDiscount = useCallback(() => {
    setIsFreeShip(false);
    setPercentDiscount(0);
    setPriceDiscount(0);
    setCoupon("");
  }, []);

  const handleQuantityChange = (
    action: string,
    productId: string,
    currentQuantity: number
  ) => {
    if (action === "add") {
      addExistingToCart(productId);
    } else if (action === "remove") {
      if (currentQuantity > 1) {
        removeExistingFromCart(productId);
      } else {
        removeFromCart(productId);
      }
    }
  };

  useEffect(() => {
    const fetchStores = async () => {
      await callStoreApi(async () => {
        const { data } = await apiService.get("/stores");
        if (data) {
          const storeList = data.map((store: IStore) => ({
            label: (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{ uri: store.imageURL }}
                  className="w-10 h-10 rounded-lg mr-2"
                />
                <Text className="text-lg font-normal">{store.name}</Text>
              </View>
            ),
            value: store.id,
          }));
          setStores(storeList);
        }
      });
    };
    const fetchUserVouchers = async () => {
      await callVoucherApi(async () => {
        const { data } = await apiService.get<IVoucher[]>(
          `/vouchers/${userId}`
        );
        if (data) {
          const now = new Date();
          const validVoucher = data.filter(
            (voucher: IVoucher) => new Date(voucher.expiryDate) >= now
          );
          setVoucher(validVoucher);
        }
      });
    };
    fetchStores();
    fetchUserVouchers();
  }, []);

  useEffect(() => {
    const total = cart.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    const quantity = cart.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);

    const newPriceAfterDiscount =
      total - total * percentDiscount - priceDiscount;

    setPriceAfterDiscount(newPriceAfterDiscount);
    setTotalQuantity(quantity);

    const validVouchers = voucher.filter((v) => {
      const enoughItems = quantity >= (v.minOrderItem ?? 0);
      const enoughPrice = total >= (v.minOrderPrice ?? 0);
      return enoughItems && enoughPrice;
    });

    const voucherList = validVouchers.map((voucher: IVoucher) => ({
      label: (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: voucher.imgUrl }}
            className="w-10 h-10 rounded-lg mr-2"
          />
          <Text
            numberOfLines={1}
            className="text-lg font-normal truncate max-w-[90%]"
          >
            {voucher.description}
          </Text>
        </View>
      ),
      value: voucher.id!,
    }));

    setCouponList(voucherList);
  }, [cart, percentDiscount, priceDiscount, voucher]);

  useEffect(() => {
    resetDiscount();
  }, [cart, resetDiscount]);

  useEffect(() => {
    const voucherSelected = voucher.find((v) => v.id === coupon);
    if (!voucherSelected) return;
    const { isFreeShip, discountPercent, discountPrice } = voucherSelected;
    setIsFreeShip(isFreeShip);
    setPercentDiscount(discountPercent);
    setPriceDiscount(discountPrice);
  }, [coupon]);

  useEffect(() => {
    if (errorMessage) {
      console.error("❌ Lỗi khi lấy danh sách cửa hàng:", errorMessage);
    }
    if (voucherErrorMessage) {
      console.error("❌ Lỗi khi lấy danh sách voucher:", voucherErrorMessage);
    }
    if (checkoutErrorMessage) {
      console.error("❌ Lỗi khi đặt hàng:", checkoutErrorMessage);
    }
  }, [errorMessage, voucherErrorMessage, checkoutErrorMessage]);

  return (
    <>
      {cart.length > 0 && (
        <View className="shadow-lg">
          <TouchableOpacity
            onPress={handleOpenModal}
            className="absolute bottom-2 mx-10 w-[80%] h-12 rounded-full bg-white flex items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.5,
              elevation: 5,
            }}
          >
            <View className="flex-row items-center justify-between w-full px-4">
              <View className="flex-row items-center w-[55%]">
                <MapPin size={20} color="orange" />
                <Text
                  className="text-base font-semibold text-black"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Định vị giao hàng
                </Text>
              </View>

              <View className="flex-row items-center gap-2 rounded-full bg-orange-400 px-2 py-1 w-[45%] justify-evenly">
                <View className="flex-row flex justify-center items-center">
                  <Text className="font-semibold text-sm rounded-full bg-white text-black w-6 h-6 text-center leading-6">
                    {totalQuantity}
                  </Text>
                </View>

                <Text className="text-white font-semibold text-base">{`${(
                  priceAfterDiscount + (isFreeShip ? 0 : shippingFee)
                ).toLocaleString()}đ`}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
          >
            <View className="flex-1 bg-black/50 justify-center items-center">
              <View className="w-full h-full bg-gray-100">
                <ScrollView
                  className="flex-1"
                  contentContainerStyle={{ paddingBottom: 60 }}
                  keyboardShouldPersistTaps="handled"
                >
                  <View className="flex-row justify-between px-4 py-2 bg-white mb-4">
                    <TouchableOpacity onPress={handleClearStorage}>
                      <Text className="italic text-xl">Xóa</Text>
                    </TouchableOpacity>
                    <Text className="font-bold text-xl">Xác nhận đơn hàng</Text>
                    <TouchableOpacity
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      onPress={handleCloseModal}
                    >
                      <MinusIcon size={24} color="black" />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-1">
                    <View className="flex-1 justify-start bg-white mb-4 py-4 gap-4">
                      <View className="flex-row px-4">
                        <Text className="font-bold text-2xl">
                          Giao hàng tận nơi
                        </Text>
                        <View className="flex-row items-center rounded-full pl-4">
                          <MapPin size={24} color="orange" />
                        </View>
                      </View>

                      <View className="flex-1 gap-2">
                        <View className="flex-1 gap-2 px-4">
                          <Text className="font-medium text-lg border-gray-200">
                            Vui lòng chọn cửa hàng
                          </Text>
                          <DropDownPicker<any>
                            open={openStoreModal}
                            setOpen={setOpenStoreModal}
                            items={stores}
                            setItems={setStores}
                            value={storeId}
                            setValue={setStoreId}
                            placeholder="Chọn cửa hàng mong muốn"
                            containerStyle={{ marginBottom: 10 }}
                            dropDownContainerStyle={{
                              borderColor: "#d1d5db",
                            }}
                            listMode="SCROLLVIEW"
                            scrollViewProps={{
                              nestedScrollEnabled: true,
                            }}
                            style={{
                              borderColor: "#d1d5db",
                              borderWidth: 1,
                              borderRadius: 10,
                            }}
                          />
                        </View>
                        <View className="flex-1 gap-2 px-4">
                          <Text className="font-medium text-lg border-gray-200">
                            Vui lòng chọn thời gian
                          </Text>
                          <TouchableOpacity
                            onPress={() => setShowTimeModal(true)}
                            className="border border-gray-300 p-4 rounded-lg"
                          >
                            <Text>
                              Giao lúc: {shippingTime.getHours()}:
                              {String(shippingTime.getMinutes()).padStart(
                                2,
                                "0"
                              )}
                            </Text>
                          </TouchableOpacity>
                          <Modal
                            visible={showTimeModal}
                            animationType="slide"
                            transparent
                          >
                            <View className="flex-1 justify-end bg-black/50">
                              <View className="bg-white rounded-t-2xl p-4">
                                <View className="flex-row justify-between items-center mb-2">
                                  <Text className="text-lg font-semibold">
                                    Chọn thời gian giao hàng
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() => setShowTimeModal(false)}
                                  >
                                    <MinusIcon size={24} color="black" />
                                  </TouchableOpacity>
                                </View>
                                {Platform.OS === "ios" || showPicker ? (
                                  <DateTimePicker
                                    mode="time"
                                    value={shippingTime}
                                    onChange={onChangeTime}
                                    display="spinner"
                                  />
                                ) : (
                                  <TouchableOpacity
                                    onPress={() => setShowPicker(true)}
                                    className="p-3 border border-gray-300 rounded-lg mt-2"
                                  >
                                    <Text>
                                      Thời gian: {shippingTime.getHours()}:
                                      {String(
                                        shippingTime.getMinutes()
                                      ).padStart(2, "0")}
                                    </Text>
                                  </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                  onPress={() => setShowTimeModal(false)}
                                  className="bg-orange-500 py-3 rounded-xl items-center mt-6"
                                >
                                  <Text className="text-white font-bold">
                                    Xác nhận
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </Modal>
                        </View>
                        <View className="flex-1 gap-2 px-4">
                          <Text className="font-medium text-lg border-gray-200">
                            Thông tin liên hệ
                          </Text>
                          <TouchableOpacity
                            onPress={() => setShowCustomerModal(true)}
                            className="border border-gray-300 p-4 rounded-lg"
                          >
                            <Text>
                              {customerName.length === 0
                                ? "Tên khách hàng"
                                : customerName}
                              {" - "}
                              {customerPhone.length === 0
                                ? "Số điện thoại"
                                : customerPhone}
                            </Text>
                          </TouchableOpacity>
                          <Modal
                            visible={showCustomerModal}
                            animationType="slide"
                            transparent
                          >
                            <View className="flex-1 justify-end bg-black/50">
                              <View className="bg-white rounded-t-2xl p-4">
                                <View className="flex-row justify-between items-center mb-2">
                                  <Text className="text-lg font-semibold">
                                    Cung cấp thông tin liên hệ
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() => setShowCustomerModal(false)}
                                  >
                                    <MinusIcon size={24} color="black" />
                                  </TouchableOpacity>
                                </View>
                                <Text className="mt-4 mb-1 font-medium">
                                  Tên khách hàng
                                </Text>
                                <TextInput
                                  className="border border-gray-300 p-3 rounded-lg"
                                  placeholder="Nhập tên khách hàng"
                                  value={customerName}
                                  onChangeText={setCustomerName}
                                  multiline
                                />
                                <Text className="mt-4 mb-1 font-medium">
                                  Số điện thoại
                                </Text>
                                <TextInput
                                  className="border border-gray-300 p-3 rounded-lg"
                                  placeholder="Nhập số điện thoại"
                                  value={customerPhone}
                                  onChangeText={setCustomerPhone}
                                  multiline
                                />
                                <TouchableOpacity
                                  onPress={() => setShowCustomerModal(false)}
                                  className="bg-orange-500 py-3 rounded-xl items-center mt-6"
                                >
                                  <Text className="text-white font-bold">
                                    Xác nhận
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </Modal>
                        </View>
                      </View>
                    </View>

                    <View className="flex-1 justify-start bg-white mb-4 py-4 gap-4">
                      <View className="flex-row px-4">
                        <Text className="font-bold text-2xl">
                          Sản phẩm đã chọn
                        </Text>
                        <View className="flex-row items-center rounded-full bg-yellow-100 gap-2 p-2 ml-auto">
                          <ShoppingCart size={18} color="orange" />
                          <TouchableOpacity onPress={handleCloseModal}>
                            <Text className="font-black text-base text-orange-500">
                              Thêm
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View className="flex-1 gap-4">
                        {cart.map((item) => (
                          <View
                            key={item.id}
                            className="flex-row justify-between items-start px-4 py-3"
                          >
                            <View className="flex-row w-[70%] gap-1">
                              <TouchableOpacity
                                onPress={() => removeFromCart(item.productId)}
                                className="flex justify-center items-center"
                              >
                                <Trash2Icon size={25} color="red" />
                              </TouchableOpacity>
                              <View>
                                <TouchableOpacity
                                  onPress={() => setShowPopup(true)}
                                  activeOpacity={0.5}
                                >
                                  <View className="flex-row gap-2 items-center bg-gray-50 rounded-lg px-3 py-2">
                                    <Text className="font-semibold text-lg text-gray-800">
                                      x{item.quantity}{" "}
                                      {getProductName(item.productId)}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                                <Text className="text-base text-gray-600 mt-1">
                                  {item.size}
                                </Text>
                                <Modal
                                  visible={showPopup}
                                  transparent
                                  animationType="fade"
                                  onRequestClose={() => setShowPopup(false)}
                                >
                                  <TouchableWithoutFeedback
                                    onPress={() => setShowPopup(false)}
                                  >
                                    <View className="absolute inset-0 bg-black/50 justify-center items-center">
                                      <TouchableWithoutFeedback>
                                        <View className="bg-white rounded-xl p-6 w-80">
                                          <Text className="text-lg font-bold text-center mb-4">
                                            {getProductName(item.productId)}
                                          </Text>

                                          <View className="flex-row items-center justify-between my-2">
                                            <TouchableOpacity
                                              onPress={() =>
                                                handleQuantityChange(
                                                  "remove",
                                                  item.productId,
                                                  totalQuantity
                                                )
                                              }
                                              className="p-2 rounded-full"
                                            >
                                              <MinusCircle
                                                size={28}
                                                color="#ef4444"
                                              />
                                            </TouchableOpacity>

                                            <Text className="text-2xl font-bold mx-4">
                                              {item.quantity}
                                            </Text>

                                            <TouchableOpacity
                                              onPress={() =>
                                                handleQuantityChange(
                                                  "add",
                                                  item.productId,
                                                  totalQuantity
                                                )
                                              }
                                              className="p-2 rounded-full"
                                            >
                                              <PlusCircle
                                                size={28}
                                                color="#10b981"
                                              />
                                            </TouchableOpacity>
                                          </View>

                                          <Text className="text-gray-500 text-center mt-2">
                                            Nhấn bên ngoài để đóng
                                          </Text>
                                        </View>
                                      </TouchableWithoutFeedback>
                                    </View>
                                  </TouchableWithoutFeedback>
                                </Modal>
                              </View>
                            </View>
                            <View className="flex-row items-center gap-2 justify-end">
                              <Text className="font-semibold text-base text-gray-800">
                                {(item.price * item.quantity).toLocaleString()}đ
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>

                    <View className="flex-1 justify-start bg-white mb-4 py-4 gap-4">
                      <Text className="font-bold text-2xl pl-4">Tổng cộng</Text>
                      <View className="flex-1 gap-4">
                        <View className="flex-row justify-between px-4">
                          <Text className="font-normal text-lg">
                            Thành tiền
                          </Text>
                          <Text className="font-medium text-lg">
                            {priceAfterDiscount.toLocaleString()}đ
                          </Text>
                        </View>
                        <View className="flex-row justify-between px-4">
                          <Text className="font-normal text-lg">
                            Phí vận chuyển
                          </Text>
                          <Text className="font-medium text-lg">
                            {(isFreeShip ? 0 : shippingFee).toLocaleString()}đ
                          </Text>
                        </View>

                        <View className="flex-1 justify-between px-4 gap-2">
                          <Text className="font-normal text-lg border-gray-200">
                            Chọn khuyến mãi
                          </Text>
                          <DropDownPicker<any>
                            open={openCoupon}
                            value={coupon}
                            items={couponList}
                            setOpen={setOpenCoupon}
                            setValue={setCoupon}
                            setItems={setCouponList}
                            placeholder="Chọn khuyến mãi"
                            containerStyle={{ marginBottom: 10 }}
                            dropDownContainerStyle={{
                              borderColor: "#d1d5db",
                            }}
                            listMode="SCROLLVIEW"
                            scrollViewProps={{
                              nestedScrollEnabled: true,
                            }}
                            style={{
                              borderColor: "#d1d5db",
                              borderWidth: 1,
                              borderRadius: 10,
                            }}
                          />
                        </View>
                        <View className="flex-row justify-between px-4">
                          <Text className="font-medium text-lg">
                            Số tiền thanh toán
                          </Text>
                          <Text className="font-medium text-lg">
                            {(
                              priceAfterDiscount +
                              (isFreeShip ? 0 : shippingFee)
                            ).toLocaleString()}
                            đ
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="flex-1 justify-start bg-white mb-4 py-4 gap-4">
                      <Text className="font-bold text-2xl pl-4">
                        Thanh toán
                      </Text>
                      <View className="flex-1 gap-2">
                        <Text className="font-medium text-lg pl-4">
                          Chọn phương thức thanh toán
                        </Text>
                        <View className="flex-1 gap-2">
                          <View className="flex-1 gap-2 px-4">
                            <DropDownPicker
                              open={openPaymentMethod}
                              value={paymentMethod}
                              items={paymentMethodList}
                              setOpen={setOpenPaymentMethod}
                              setValue={setPaymentMethod}
                              setItems={setPaymentMethodList}
                              placeholder="Phương thức thanh toán"
                              dropDownContainerStyle={{
                                borderColor: "#d1d5db",
                              }}
                              listMode="SCROLLVIEW"
                              scrollViewProps={{
                                nestedScrollEnabled: true,
                              }}
                              style={{
                                borderColor: "#d1d5db",
                                borderWidth: 1,
                                borderRadius: 10,
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </ScrollView>
                <View className="absolute bottom-0 left-0 w-full bg-orange-500 shadow-md">
                  <View className="flex-row justify-center items-center p-2 px-6">
                    <View className="flex-col justify-start">
                      <View>
                        <Text className="text-white font-normal text-lg">
                          Giao hàng - {totalQuantity} sản phẩm
                        </Text>
                      </View>
                      <View>
                        <Text className="text-white text-lg font-extrabold">
                          {(
                            priceAfterDiscount + (isFreeShip ? 0 : shippingFee)
                          ).toLocaleString()}
                          đ
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      className="bg-white rounded-full text-center p-3 ml-auto"
                      onPress={handleCheckout}
                    >
                      <Text className="text-orange-500 font-extrabold uppercase">
                        đặt hàng
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};
