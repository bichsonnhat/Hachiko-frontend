import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export const ExpandableText = ({
  text,
  maxLength = 200,
  className,
}: ExpandableTextProps) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View>
      <Text className={className}>
        {expanded ? text : `${text.slice(0, maxLength)}...`}
      </Text>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text className="text-orange-500 font-semibold">
          {expanded ? "Rút gọn" : "Xem thêm"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
