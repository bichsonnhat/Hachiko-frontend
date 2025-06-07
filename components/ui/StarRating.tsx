import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  onPress?: (rating: number) => void;
  readonly?: boolean;
  color?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 20,
  onPress,
  readonly = false,
  color = '#FFD700'
}) => {
  const handleStarPress = (star: number) => {
    if (!readonly && onPress) {
      onPress(star);
    }
  };

  return (
    <View className="flex-row items-center">
      {Array.from({ length: maxStars }, (_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= rating;
        
        if (readonly) {
          return (
            <Star
              key={index}
              size={size}
              color={isFilled ? color : '#E5E5E5'}
              fill={isFilled ? color : 'transparent'}
            />
          );
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleStarPress(starNumber)}
            className="mx-0.5"
          >
            <Star
              size={size}
              color={isFilled ? color : '#E5E5E5'}
              fill={isFilled ? color : 'transparent'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}; 