import React, { useState } from "react";
import { View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface DropdownItem {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  items: DropdownItem[];
  placeholder?: string;
  zIndex?: number;
  onSelect?: (value: string | null) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  placeholder = "Chọn",
  zIndex = 1000,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items_temp, setItems] = useState(items)

  return (
    <View style={{ zIndex: zIndex }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items_temp}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={placeholder}
        listMode="SCROLLVIEW"
        scrollViewProps={{ nestedScrollEnabled: true }}
        containerStyle={{ height: 50, marginTop: 10 }}
        style={{
          borderColor: "#d1d5db",
          borderWidth: 1,
          borderRadius: 10,
        }}
        textStyle={{ fontSize: 16 }}
        dropDownContainerStyle={{
          borderColor: "#d1d5db",
        }}
      />
    </View>
  );
};

export default CustomDropdown;