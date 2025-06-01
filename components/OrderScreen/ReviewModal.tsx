import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { MinusIcon, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StarRating } from '@/components/ui';
import { IProduct, IProductReviews, IReviewCreate } from '@/constants';
import { useApi } from '@/hooks/useApi';
import apiService from '@/constants/config/axiosConfig';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  product: IProduct;
}

const USER_ID = "67ea8e54c54fd6723fbf8f0e";

export const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  onClose,
  product
}) => {
  const insets = useSafeAreaInsets();
  const [reviewData, setReviewData] = useState<IProductReviews | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    loading: reviewsLoading,
    errorMessage: reviewsError,
    callApi: callReviewsApi,
  } = useApi<void>();

  const fetchReviews = async () => {
    await callReviewsApi(async () => {
      const { data } = await apiService.get(`/reviews/product/${product.id}?userId=${USER_ID}`);
      setReviewData(data);
      
      // Set user's existing review if any
      if (data.userReview) {
        setUserRating(data.userReview.rating);
        setUserComment(data.userReview.comment);
      }
    });
  };

  const submitReview = async () => {
    if (userRating === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn số sao đánh giá');
      return;
    }

    if (userComment.trim().length === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung đánh giá');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewPayload: IReviewCreate = {
        userId: USER_ID,
        productId: product.id || '',
        rating: userRating,
        comment: userComment.trim()
      };

      if (reviewData?.userReview) {
        // Update existing review
        await apiService.put(`/reviews/${reviewData.userReview.id}`, reviewPayload);
        Alert.alert('Thành công', 'Cập nhật đánh giá thành công!');
      } else {
        // Create new review
        await apiService.post('/reviews', reviewPayload);
        Alert.alert('Thành công', 'Gửi đánh giá thành công!');
      }
      
      // Refresh reviews
      await fetchReviews();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    if (visible) {
      fetchReviews();
    }
  }, [visible]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-full h-full bg-white" style={{ paddingTop: insets.top }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
            <View className="w-8 h-8" />
            <Text className="font-bold text-xl text-center flex-1">
              Đánh giá sản phẩm
            </Text>
            <TouchableOpacity
              className="w-8 h-8 rounded-full items-center justify-center"
              onPress={onClose}
            >
              <MinusIcon size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
            {/* Product Info */}
            <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-100">
              <Image
                source={{ uri: product.imageUrl }}
                className="w-16 h-16 rounded-lg mr-3"
                resizeMode="contain"
              />
              <View className="flex-1">
                <Text className="font-semibold text-lg">{product.title}</Text>
                <Text className="text-gray-600">{product.price.toLocaleString("vi-VN")}đ</Text>
              </View>
            </View>

            {reviewsLoading ? (
              <View className="flex-1 items-center justify-center py-20">
                <ActivityIndicator size="large" color="#FF8C00" />
              </View>
            ) : (
              <>
                {/* Rating Summary */}
                {reviewData && reviewData.totalReviews > 0 && (
                  <View className="p-4 bg-white border-b border-gray-100">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="font-semibold text-lg">Đánh giá tổng quan</Text>
                      <Text className="text-gray-600">{reviewData.totalReviews} đánh giá</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-2xl font-bold mr-2">
                        {reviewData.averageRating.toFixed(1)}
                      </Text>
                      <StarRating rating={reviewData.averageRating} readonly />
                    </View>
                  </View>
                )}

                {/* User Review Section */}
                <View className="p-4 bg-blue-50 border-b border-gray-100">
                  <Text className="font-semibold text-lg mb-3">
                    {reviewData?.userReview ? 'Đánh giá của bạn' : 'Viết đánh giá'}
                  </Text>
                  
                  <View className="mb-3">
                    <Text className="text-gray-700 mb-2">Đánh giá sao:</Text>
                    <StarRating
                      rating={userRating}
                      onPress={setUserRating}
                      size={30}
                    />
                  </View>

                  <View className="mb-3">
                    <Text className="text-gray-700 mb-2">Nội dung đánh giá:</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3 min-h-[100px]"
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                      value={userComment}
                      onChangeText={setUserComment}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>

                  <TouchableOpacity
                    className={`py-3 px-6 rounded-lg ${
                      isSubmitting ? 'bg-gray-400' : 'bg-orange-500'
                    }`}
                    onPress={submitReview}
                    disabled={isSubmitting}
                  >
                    <Text className="text-white font-semibold text-center">
                      {isSubmitting ? 'Đang gửi...' : (reviewData?.userReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Other Reviews */}
                {reviewData && reviewData.reviews.length > 0 && (
                  <View className="p-4">
                    <Text className="font-semibold text-lg mb-3">
                      Đánh giá từ khách hàng khác
                    </Text>
                    
                    {reviewData.reviews
                      .filter(review => review.userId !== USER_ID)
                      .map((review, index) => (
                        <View key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <View className="flex-row items-start mb-2">
                            <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center mr-3">
                              <User size={16} color="gray" />
                            </View>
                            <View className="flex-1">
                              <View className="flex-row items-center justify-between mb-1">
                                <Text className="font-medium">
                                  {review.userName || 'Người dùng ẩn danh'}
                                </Text>
                                <Text className="text-gray-500 text-sm">
                                  {formatDate(review.createdAt)}
                                </Text>
                              </View>
                              <StarRating rating={review.rating} readonly size={16} />
                            </View>
                          </View>
                          <Text className="text-gray-700 ml-11">{review.comment}</Text>
                        </View>
                      ))}
                  </View>
                )}

                {/* No Reviews Message */}
                {reviewData && reviewData.reviews.filter(r => r.userId !== USER_ID).length === 0 && (
                  <View className="p-4">
                    <Text className="text-gray-500 text-center">
                      Chưa có đánh giá nào từ khách hàng khác
                    </Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}; 