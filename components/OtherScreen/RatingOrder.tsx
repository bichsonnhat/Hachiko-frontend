import { TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

type RatingOrderProps = {
  rating: number;
  setRating: (rating: number) => void;
};

const Star: React.FC<{ filled: boolean }> = ({ filled }) => (
  <Svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill={filled ? "gold" : "gray"}
  >
    <Path d="M12 .587l3.668 7.568 8.332 1.151-6.003 5.705 1.402 8.24L12 18.896l-7.399 4.355 1.402-8.24L0 9.306l8.332-1.151z" />
  </Svg>
);

export const RatingOrder: React.FC<RatingOrderProps> = ({
  rating,
  setRating,
}) => (
  <View style={{ flexDirection: "row" }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <TouchableOpacity key={i} onPress={() => setRating(i)}>
        <Star filled={i <= rating} />
      </TouchableOpacity>
    ))}
  </View>
);
