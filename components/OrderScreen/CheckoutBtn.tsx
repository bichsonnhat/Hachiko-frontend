import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useCartStore } from "@/stores";
import { MinusIcon, ShoppingCart, Trash2Icon } from "lucide-react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export const CheckoutBtn = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const { cart, clearCart, removeFromCart } = useCartStore();
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const shippingFee = 40000;

  const [address, setAddress] = useState<{ label: string; value: string }[]>([
    { label: "Hà Nội", value: "Hà Nội" },
    { label: "Hải Phòng", value: "Hải Phòng" },
    { label: "Đà Nẵng", value: "Đà Nẵng" },
    { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
    { label: "Cần Thơ", value: "Cần Thơ" },
    { label: "Nha Trang", value: "Nha Trang" },
  ]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [openAddress, setOpenAddress] = useState(false);

  const [showTimeModal, setShowTimeModal] = useState(false);
  const [shippingTime, setShippingTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

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

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [openCoupon, setOpenCoupon] = useState(false);
  const [couponList, setCouponList] = useState<
    {
      label: string;
      value: string;
    }[]
  >([
    { label: "Giảm 10%", value: "Giảm 10%" },
    { label: "Giảm 20%", value: "Giảm 20%" },
    { label: "Giảm 30%", value: "Giảm 30%" },
  ]);
  const [coupon, setCoupon] = useState("");

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
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleClearInfo = () => {
    setShippingAddress("");
    setShippingTime(new Date());
    setCustomerName("");
    setCustomerPhone("");
    setCoupon("");
    setPaymentMethod("");
  };
  const handleCloseModal = () => {
    handleClearInfo();
    setModalVisible(!modalVisible);
  };
  const handleOpenModal = () => {
    setModalVisible(true);
    console.log("cart", cart);
  };
  const handleClearStorage = () => {
    handleCloseModal();
    clearCart();
  };
  const handleCheckout = () => {
    handleClearStorage();
  };

  useEffect(() => {
    const total = cart.reduce((acc, item) => {
      return acc + item.drink_price * item.drink_quantity;
    }, 0);
    const quantity = cart.reduce((acc, item) => {
      return acc + item.drink_quantity;
    }, 0);
    setTotalQuantity(quantity);
    setTotalPrice(total);
  }, [cart, clearCart]);

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
              <Text
                className="text-lg font-black text-black w-[60%]"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Địa điểm giao hàng, test truncate
              </Text>
              <View className="flex-row items-center gap-2 rounded-full bg-orange-400 px-2 py-1 w-[40%] justify-evenly">
                <Text className="font-black text-lg rounded-full bg-white text-black w-6 h-6 text-center leading-6">
                  {totalQuantity}
                </Text>
                <Text className="text-white font-black text-lg">{`${(
                  totalPrice + shippingFee
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
                      <Text className="font-bold text-2xl pl-4">
                        Giao hàng tận nơi
                      </Text>
                      <View className="flex-1 gap-2">
                        <View className="flex-1 gap-2 px-4">
                          <Text className="font-medium text-lg border-gray-200">
                            Vui lòng chọn địa điểm
                          </Text>
                          <DropDownPicker
                            open={openAddress}
                            value={shippingAddress}
                            items={address}
                            setOpen={setOpenAddress}
                            setValue={setShippingAddress}
                            setItems={setAddress}
                            placeholder="Vui lòng định vị"
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
                            key={item.drink_name}
                            className="flex-row justify-between items-start px-4 py-3"
                          >
                            <View className="flex-row w-[70%] gap-1">
                              <TouchableOpacity
                                onPress={() => removeFromCart(item.drink_name)}
                                className="flex justify-center items-center"
                              >
                                <Trash2Icon size={25} color="red" />
                              </TouchableOpacity>
                              <View>
                                <View className="flex-row gap-2">
                                  <Text className="font-semibold text-lg text-gray-800">
                                    x{item.drink_quantity} {item.drink_name}
                                  </Text>
                                </View>
                                <Text className="text-base text-gray-600 mt-1">
                                  Nhỏ
                                </Text>
                              </View>
                            </View>
                            <View className="flex-row items-center gap-2 justify-end">
                              <Text className="font-semibold text-base text-gray-800">
                                {(
                                  item.drink_price * item.drink_quantity
                                ).toLocaleString()}
                                đ
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
                            {totalPrice.toLocaleString()}đ
                          </Text>
                        </View>
                        <View className="flex-row justify-between px-4">
                          <Text className="font-normal text-lg">
                            Phí vận chuyển
                          </Text>
                          <Text className="font-medium text-lg">
                            {shippingFee.toLocaleString()}đ
                          </Text>
                        </View>

                        <View className="flex-1 justify-between px-4 gap-2">
                          <Text className="font-normal text-lg border-gray-200">
                            Chọn khuyến mãi
                          </Text>
                          <DropDownPicker
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
                            {(totalPrice + shippingFee).toLocaleString()}đ
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
                          {(totalPrice + shippingFee).toLocaleString()}đ
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
