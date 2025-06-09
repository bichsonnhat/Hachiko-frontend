import React, { FC } from "react";
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
  Animated,
  Easing,
  Pressable,
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
  Edit,
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
  IProduct,
} from "@/constants";
import * as Location from 'expo-location';

import apiService from "@/constants/config/axiosConfig";
import { useRouter } from "expo-router";
import { DrinkModal } from "@/components/HomeScreen/DrinkModal";
import { generateObjectId } from "@/utils/helpers/randomHexString";
import { ItemType } from "react-native-dropdown-picker";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import MapModal from "../common/MapModal";
import CombinedMapModal from "./OrderMapModal";
import { useAuth } from "@clerk/clerk-expo";
import { IUser } from "@/constants/interface/user.interface";

// Interface for user voucher mapping
interface UserVoucher {
  id: string;
  userId: string;
  voucherId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

type CheckoutBtnProps = {
  getProductName: (productId: string) => string;
  voucherId?: string;
};

export const CheckoutBtn: FC<CheckoutBtnProps> = ({ getProductName, voucherId }) => {
  //hard code for testing
  const [longitude, setLongitude] = useState<number>();
  const [latitude, setLatitude] = useState<number>();
  const [shippingFee, setShippingFee] = useState<number>(15000);
  const [address, setAddress] = useState("Địa chỉ giao hàng");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [user, setUser] = useState<IUser>();
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();

  useEffect(() => {
    async function getCurrentLocation() {
      setIsLoadingLocation(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Quyền truy cập vị trí bị từ chối');
          setIsLoadingLocation(false);
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude)
        setLongitude(location.coords.longitude)
        await fetchAddress(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error('Lỗi khi lấy vị trí hiện tại:', error);
        setAddress('Lỗi khi lấy địa chỉ');
      } finally {
        setIsLoadingLocation(false);
      }
    }
    getCurrentLocation();
  }, []);

  const fetchAddress = async (latitude: number, longitude: number): Promise<void> => {
    setIsLoadingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'MyReactNativeApp/1.0 (phanchauhoang2004@example.com)',
          },
        }
      );
      const data: any = await response.json();
      setAddress(data.display_name || 'Không tìm thấy địa chỉ');
    } catch (error) {
      console.error('Lỗi khi gọi API Nominatim:', error);
      setAddress('Lỗi khi lấy địa chỉ');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Animation value for the edit button
  const editButtonOpacity = new Animated.Value(0.8);

  // Animation effect for the edit button
  useEffect(() => {
    const pulseAnimation = Animated.sequence([
      Animated.timing(editButtonOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(editButtonOpacity, {
        toValue: 0.8,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      })
    ]);

    Animated.loop(pulseAnimation).start();

    return () => {
      editButtonOpacity.stopAnimation();
    };
  }, []);

  //cái này cần api current user hay gì đó, kiểu đăng nhập từ clerk thì call api để lấy rồi lưu vô store, lúc xài thì lấy ra thôi

  const router = useRouter();
  const { errorMessage, callApi: callStoreApi } = useApi<void>();
  const {
    loading: userLoading,
    errorMessage: userError,
    callApi: callUserApi,
  } = useApi<void>();

  const { errorMessage: voucherErrorMessage, callApi: callVoucherApi } =
    useApi<void>();
  const { errorMessage: checkoutErrorMessage, callApi: callCheckoutApi } =
    useApi<void>();
  const { errorMessage: productErrorMessage, callApi: callProductApi } =
    useApi<void>();

  const [modalVisible, setModalVisible] = useState(false);

  // DrinkModal states
  const [drinkModalVisible, setDrinkModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [selectedSize, setSelectedSize] = useState("small");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [selectedCartItemId, setSelectedCartItemId] = useState<string>("");

  const {
    cart,
    clearCart,
    removeFromCart,
    removeExistingFromCart,
    addExistingToCart,
    addNewToCart,
    checkExist,
  } = useCartStore();
  const [totalQuantity, setTotalQuantity] = useState(0);

  const [stores, setStores] = useState<ItemType<any>[]>([]);
  const [storeId, setStoreId] = useState("");
  const [openStoreModal, setOpenStoreModal] = useState(false);

  const [showTimeModal, setShowTimeModal] = useState(false);
  const [shippingTime, setShippingTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("0123456789");

  const [voucher, setVoucher] = useState<IVoucher[]>([]);
  const [openCoupon, setOpenCoupon] = useState(false);
  const [couponList, setCouponList] = useState<ItemType<any>[]>([]);
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
        // If a voucher was used, update its status to inactive
        if (coupon && coupon.length > 0) {
          // Update voucher status outside the checkout API call to avoid blocking checkout completion
          updateVoucherStatus(coupon).catch(err => 
            console.error("Failed to update voucher status:", err)
          );
        }
        Alert.alert("Thông báo", "Đặt hàng thành công!");
        handleClearStorage();
      }
    });
  };

  const updateVoucherStatus = async (voucherId: string) => {
    try {
      // First, find the user-voucher mapping ID for this voucher ID
      const { data: userVouchers } = await apiService.get<UserVoucher[]>(`/user-vouchers/user/${userId}/available`);
      const userVoucherMapping = userVouchers.find((uv: UserVoucher) => uv.voucherId === voucherId);
      
      if (userVoucherMapping) {
        // Update the status of the specific user-voucher mapping
        await apiService.put(`/user-vouchers/${userVoucherMapping.id}`, { status: "INACTIVE" });
        console.log(`Voucher ${voucherId} marked as inactive`);
      } else {
        console.log(`Could not find user-voucher mapping for voucher ${voucherId}`);
      }
    } catch (error) {
      console.error("Error updating voucher status:", error);
    }
  };

  const handleWithPayOS = async () => {
    await callCheckoutApi(async () => {
      const newShippingFee = isFreeShip ? 0 : shippingFee;
      const sendData = {
        productName: "Đơn hàng " + userId,
        description: "Thanh toán đơn hàng",
        price: priceAfterDiscount + newShippingFee,
        returnUrl: "http://localhost:8081/--/payment/success", //kiểm tra lại url lúc chạy npx expo start, đều là localhost nhưng mà khác mạng thì config ip khác
        cancelUrl: "http://localhost:8081/--/payment/failed",
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
        userId: userId ?? "user_2uB6QHmvZojzlQk5o5tb2s1j0xl",
        orderAddress: address,
        orderTime: shippingTime,
        orderCost: priceAfterDiscount + newShippingFee,
        paymentMethod,
        ...(coupon.length > 0 ? { voucherId: coupon } : {}),
        recipientName: customerName,
        recipientPhone: customerPhone,
        storeId,
        orderStatus: OrderStatus.DELIVERING,
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
    const fetchUserData = async () => {
      await callUserApi(async () => {
        const { data } = await apiService.get(`/users/${userId}`);
        if (data) {
          setUser(data);
          setCustomerName(data.lastName + " " + data.firstName)
          setCustomerPhone(data.phoneNumber);
        }
      });
    };
    const fetchStores = async () => {
      await callStoreApi(async () => {
        const { data } = await apiService.get("/stores");
        if (data) {
          const storeList: ItemType<any>[] = data.map((store: IStore) => ({
            label: store.name,
            value: store.id,
            icon: () => (
              <Image
                source={{ uri: store.imageURL }}
                className="w-10 h-10 rounded-lg mr-2"
              />
            )
          }));
          setStores(storeList);
        }
      });
    };
    const fetchUserVouchers = async () => {
      try {
        // If a voucherId is provided, we can skip the API call to fetch all vouchers
        if (voucherId) {
          setCoupon(voucherId);
          return;
        }

        await callVoucherApi(async () => {
          // Use the correct endpoint for fetching available user vouchers
          const { data } = await apiService.get<UserVoucher[]>(
            `/user-vouchers/user/${userId}/available`
          );
          if (data && data.length > 0) {
            // Extract voucher IDs from the user-voucher mappings
            const voucherIds = data.map(mapping => mapping.voucherId);

            // Fetch details for each voucher
            const voucherPromises = voucherIds.map(id =>
              apiService.get<IVoucher>(`/vouchers/${id}`).then(response => response.data)
            );

            const voucherDetails = await Promise.all(voucherPromises);
            setVoucher(voucherDetails);
          } else {
            setVoucher([]);
          }
        });
      } catch (error) {
        console.error("Error in fetchUserVouchers:", error);
        setVoucher([]);
      }
    };
    fetchUserData();
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

    const voucherList: ItemType<any>[] = validVouchers.map((voucher: IVoucher) => ({
      label: voucher.description,
      value: voucher.id!,
      icon: () => (
        <Image
          source={{ uri: voucher.imgUrl }}
          className="w-10 h-10 rounded-lg mr-2"
        />
      )
    }));

    setCouponList(voucherList);
  }, [cart, percentDiscount, priceDiscount, voucher]);

  useEffect(() => {
    resetDiscount();
  }, [cart, resetDiscount]);

  // Set the voucher when voucherId is provided directly
  useEffect(() => {
    if (voucherId && voucherId.length > 0) {
      setCoupon(voucherId);

      // If we already have voucher data, find the matching voucher
      if (voucher.length > 0) {
        const selectedVoucher = voucher.find(v => v.id === voucherId);
        if (selectedVoucher) {
          setIsFreeShip(selectedVoucher.isFreeShip);
          setPercentDiscount(selectedVoucher.discountPercent);
          setPriceDiscount(selectedVoucher.discountPrice);
        }
      } else {
        // If we don't have voucher data yet, we'll need to fetch this specific voucher
        const fetchSingleVoucher = async () => {
          try {
            // Use the correct endpoint: /vouchers/{id} as shown in the API documentation
            const { data } = await apiService.get<IVoucher>(`/vouchers/${voucherId}`);
            if (data) {
              setIsFreeShip(data.isFreeShip);
              setPercentDiscount(data.discountPercent);
              setPriceDiscount(data.discountPrice);
              // Add to voucher list so it shows up in dropdown
              setVoucher(prev => [...prev, data]);
            }
          } catch (error) {
            console.error("Error fetching voucher details:", error);
            // If we can't get the voucher details, don't apply any discount
            setIsFreeShip(false);
            setPercentDiscount(0);
            setPriceDiscount(0);
            
            // Show an alert to the user
            Alert.alert(
              "Thông báo",
              "Không thể áp dụng voucher. Vui lòng thử lại sau.",
              [{ text: "OK" }]
            );
          }
        };

        fetchSingleVoucher();
      }
    }
  }, [voucherId, voucher]);

  // Handle when user selects a voucher from dropdown
  useEffect(() => {
    // Skip if the coupon was set by the voucherId prop
    if (coupon === voucherId) return;

    const voucherSelected = voucher.find((v) => v.id === coupon);
    if (!voucherSelected) return;
    const { isFreeShip, discountPercent, discountPrice } = voucherSelected;
    setIsFreeShip(isFreeShip);
    setPercentDiscount(discountPercent);
    setPriceDiscount(discountPrice);
  }, [coupon, voucherId, voucher]);

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

  // DrinkModal functions
  const toggleTopping = (name: string) => {
    setSelectedToppings((prev) =>
      prev.includes(name)
        ? prev.filter((topping) => topping !== name)
        : [...prev, name]
    );
  };

  const fetchProductDetails = async (productId: string) => {
    await callProductApi(async () => {
      const { data } = await apiService.get(`/products/${productId}`);
      if (data) {
        setSelectedProduct(data);
      }
    });
  };

  // Add this helper function to format sizes
  const formatSize = (size: string): string => {
    switch (size) {
      case 'small':
        return 'Nhỏ';
      case 'medium':
        return 'Vừa';
      default:
        return size;
    }
  };

  const calculatePrice = useCallback(() => {
    if (!selectedProduct) return 0;

    const basePrice = selectedSize === "medium"
      ? selectedProduct.price + 10000
      : selectedProduct.price;

    const toppingPrice = selectedToppings.reduce((total, toppingName) => {
      const topping = TOPPINGS.find((t) => t.name === toppingName);
      return total + (topping?.price || 0);
    }, 0);

    return (basePrice + toppingPrice) * quantity;
  }, [selectedProduct, selectedSize, selectedToppings, quantity]);

  const resetModalState = () => {
    setQuantity(1);
    setNote("");
    setSelectedToppings([]);
    setSelectedSize("small");
    setSelectedProduct(null);
    setSelectedCartItemId("");
  };

  const toggleFavourite = async () => {
    // This is just a placeholder for the required prop
    setIsFavourite(!isFavourite);
  };

  const handleOpenProductModal = async (item: any) => {
    setSelectedCartItemId(item.id);
    await fetchProductDetails(item.productId);

    // Set initial values from the cart item
    setQuantity(item.quantity);
    setNote(item.note);
    setSelectedSize(item.size);
    setSelectedToppings(item.topping ? item.topping.split(", ").filter(Boolean) : []);

    setDrinkModalVisible(true);
  };

  const updateProductInCart = () => {
    if (!selectedProduct || !selectedCartItemId) return;

    // Instead of removing and adding a new item, find and update the existing item
    const updatedCart = cart.map(item => {
      if (item.id === selectedCartItemId) {
        return {
          ...item,
          size: selectedSize,
          topping: selectedToppings.join(", "),
          quantity: quantity,
          price: calculatePrice() / quantity, // Store the unit price
          note: note
        };
      }
      return item;
    });

    // Update the entire cart with the modified items
    clearCart();
    updatedCart.forEach(item => {
      addNewToCart(item);
    });

    setDrinkModalVisible(false);
    resetModalState();
  };

  const handleCancel = () => {
    setOpenStoreModal(false);
  }

  const handleLocationConfirm = ({ address, lat, lon }: { address: string; lat: number; lon: number }) => {
    setAddress(address);
    setLongitude(lat);
    setLongitude(lon);
  };

  return (
    <>
      {cart.length > 0 && (
        <SafeAreaView className="shadow-lg" edges={['bottom']}>
          <TouchableOpacity
            onPress={handleOpenModal}
            disabled={isLoadingLocation}
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
                {isLoadingLocation ? (
                  <Text className="ml-2 text-base font-semibold text-black">Đang lấy vị trí...</Text>
                ) : (
                  <Text
                    className="text-base font-semibold text-black"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {address}
                  </Text>
                )}
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
            statusBarTranslucent={true}
          >
            <View className="flex-1 bg-black/50 justify-center items-center">
              {!isLoadingLocation && (
                <CombinedMapModal
                  initialAddress={address}
                  onClose={handleCancel}
                  onConfirm={handleLocationConfirm}
                  initialLat={latitude}
                  initialLon={longitude}
                  visible={openStoreModal}
                  setSelectedStoreId={setStoreId}
                  setShippingFee={setShippingFee}
                />
              )}
              <View className="w-full h-full bg-gray-100" style={{ paddingTop: insets.top }}>
                <ScrollView
                  className="flex-1"
                  contentContainerStyle={{ paddingBottom: 120 }}
                  keyboardShouldPersistTaps="handled"
                >
                  <View className="flex-1">
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

                    <View className="flex-1 justify-start bg-white mb-4 py-4 gap-4">
                      <View className="flex-row px-4">
                        <Text className="font-bold text-2xl">
                          Giao hàng tận nơi
                        </Text>
                        <View className="flex-row items-center rounded-full pl-4">
                          <MapPin size={24} color="orange" />
                        </View>
                      </View>

                      <View className="flex-1 gap-2 px-4">
                        <Text className="font-medium text-lg border-gray-200">
                          Địa chỉ giao hàng
                        </Text>
                        <TouchableOpacity
                          onPress={() => setOpenStoreModal(true)}
                          className="border border-gray-300 p-4 rounded-lg"
                        >
                          <Text>
                            {address}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View className="flex-1 gap-2">
                        <View className="flex-1 gap-2 px-4">
                          <Text className="font-medium text-lg border-gray-200">
                            Vui lòng chọn cửa hàng
                          </Text>
                          <DropDownPicker<any>
                            open={false}
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
                            statusBarTranslucent={true}
                          >
                            <View className="flex-1 justify-end bg-black/50">
                              <View
                                className="bg-white rounded-t-2xl p-4"
                                style={{ paddingBottom: Math.max(insets.bottom, 16) }}
                              >
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
                            statusBarTranslucent={true}
                          >
                            <View className="flex-1 justify-end bg-black/50">
                              <View
                                className="bg-white rounded-t-2xl p-4"
                                style={{ paddingBottom: Math.max(insets.bottom, 16) }}
                              >
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
                      <View className="bg-blue-50 mx-4 p-3 rounded-lg mb-2 flex-row items-center">
                        <View className="bg-blue-100 rounded-full p-1 mr-2">
                          <Edit size={16} color="#1d4ed8" />
                        </View>
                        <Text className="text-blue-800 text-sm flex-1">
                          Biểu tượng bút <Edit size={12} color="#1d4ed8" /> bên cạnh tên sản phẩm cho phép chỉnh sửa kích thước, số lượng hoặc topping
                        </Text>
                      </View>
                      <View className="flex-1 gap-4">
                        {cart.map((item) => (
                          <View
                            key={item.id}
                            className="flex-row justify-between items-start px-4 py-3 border-b border-gray-200"
                          >
                            <View className="flex-row w-[75%] gap-2">
                              <TouchableOpacity
                                onPress={() => removeFromCart(item.productId)}
                                className="flex justify-center items-center p-1 mt-1"
                              >
                                <Trash2Icon size={22} color="red" />
                              </TouchableOpacity>
                              <View className="flex-1">
                                <Pressable
                                  onPress={() => handleOpenProductModal(item)}
                                  android_ripple={{ color: '#e5e7eb' }}
                                  style={({ pressed }) => [
                                    {
                                      backgroundColor: pressed ? '#f3f4f6' : 'transparent',
                                      borderRadius: 8,
                                    }
                                  ]}
                                  className="flex-row justify-between items-center p-2"
                                >
                                  <View className="flex-row items-center flex-1">
                                    <Text className="font-bold text-base text-gray-800">
                                      {getProductName(item.productId)}
                                    </Text>
                                    <Animated.View
                                      style={{
                                        marginLeft: 8,
                                        backgroundColor: '#dbeafe',
                                        borderRadius: 100,
                                        padding: 4,
                                        opacity: editButtonOpacity
                                      }}
                                    >
                                      <Edit size={12} color="#1d4ed8" />
                                    </Animated.View>
                                  </View>
                                </Pressable>

                                <View className="flex-row flex-wrap mt-1">
                                  <View className="bg-orange-100 rounded-full px-2 py-0.5 mr-2 mb-1">
                                    <Text className="text-sm text-orange-800">
                                      {formatSize(item.size)}
                                    </Text>
                                  </View>

                                  <View className="bg-orange-100 rounded-full px-2 py-0.5 mr-2 mb-1">
                                    <Text className="text-sm text-orange-800">
                                      x{item.quantity}
                                    </Text>
                                  </View>

                                  {item.topping && item.topping.length > 0 && item.topping.split(', ').map((topping, index) => (
                                    <View key={index} className="bg-green-100 rounded-full px-2 py-0.5 mr-2 mb-1">
                                      <Text className="text-sm text-green-800">
                                        {topping}
                                      </Text>
                                    </View>
                                  ))}
                                </View>

                                {item.note && item.note.length > 0 && (
                                  <View className="mt-1 bg-gray-100 rounded-md p-1">
                                    <Text className="text-sm text-gray-600">
                                      <Text className="italic">Ghi chú:</Text> {item.note}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                            <View className="flex-row items-start justify-end w-[25%] mt-1">
                              <Text className="font-bold text-base text-orange-500">
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
                    <View className="flex-1 justify-start bg-white mb-16 py-4 gap-4">
                      <Text className="font-bold text-2xl pl-4">
                        Thanh toán
                      </Text>
                      <View className="flex-1 gap-2">
                        <Text className="font-medium text-lg pl-4">
                          Chọn phương thức thanh toán
                        </Text>
                        <View className="flex-1 gap-2">
                          <View className="flex-1 gap-2 px-4 mb-4">
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
                <View
                  className="absolute bottom-0 left-0 w-full bg-orange-500 shadow-md"
                  style={{ paddingBottom: Math.max(insets.bottom, 0) }}
                >
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
        </SafeAreaView>
      )}

      {selectedProduct && (
        <DrinkModal
          visible={drinkModalVisible}
          onClose={() => setDrinkModalVisible(false)}
          drink={selectedProduct}
          isFavourite={isFavourite}
          toggleFavourite={toggleFavourite}
          quantity={quantity}
          setQuantity={setQuantity}
          note={note}
          setNote={setNote}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedToppings={selectedToppings}
          toggleTopping={toggleTopping}
          calculatePrice={calculatePrice}
          addDrinkToCart={updateProductInCart}
          check={false}
        />
      )}
    </>
  );
};

// Constant for toppings
const TOPPINGS = [
  { id: "1", name: "Trái Vải", price: 8000 },
  { id: "2", name: "Hạt Sen", price: 8000 },
  { id: "3", name: "Thạch Cà Phê", price: 6000 },
  { id: "4", name: "Trân châu trắng", price: 6000 },
  { id: "5", name: "Đào Miếng", price: 10000 },
];
