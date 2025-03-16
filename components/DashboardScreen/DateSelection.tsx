import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarDays } from "lucide-react-native";

type DateSelectionProps = {
  setTimePeriod: (timePeriod: number | null) => void;
};

export const DateSelection: React.FC<DateSelectionProps> = ({
  setTimePeriod,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    const timePeriod = endDate.getTime() - startDate.getTime();
    setTimePeriod(timePeriod);
  }, [startDate, endDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <View className="p-4 bg-white border-b border-gray-200 gap-2">
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600 font-bold text-xl w-[40%]">
          Ngày bắt đầu
        </Text>
        <View className="flex-row items-center justify-between border rounded-2xl border-gray-400 px-1 w-[60%]">
          <TextInput
            className="text-black text-lg font-medium pl-5"
            value={formatDate(startDate)}
            editable={false}
          />
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            className="pr-5"
          >
            <CalendarDays color="#FFA523" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600 font-bold text-xl w-[40%]">
          Ngày kết thúc
        </Text>
        <View className="flex-row items-center justify-between border rounded-2xl border-gray-400 px-1 w-[60%]">
          <TextInput
            className="text-black text-lg font-medium pl-5"
            value={formatDate(endDate)}
            editable={false}
          />
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            className="pr-5"
          >
            <CalendarDays color="#FFA523" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}
    </View>
  );
};
