import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { IDropdownItem } from "@/constants/interface/dropdown-item.interface";

interface CustomDropdownProps {
  items: IDropdownItem[];
  placeholder?: string;
  zIndex?: number;
  onSelect?: (value: string | null) => void;
  value?: string | null;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  placeholder = "Chọn",
  zIndex = 1000,
  onSelect,
  value,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(value ?? null);
  const [itemsTemp, setItemsTemp] = useState<IDropdownItem[]>(items);

  useEffect(() => {
    setItemsTemp(items);
  }, [items]);

  useEffect(() => {
    setSelectedValue(value ?? null);
  }, [value]);

  const handleChange = (item: IDropdownItem) => {
    setSelectedValue(item.value);
    onSelect?.(item.value);
  };

  return (
    <View style={[styles.container, { zIndex }]}>
      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        itemTextStyle={styles.itemTextStyle}
        data={itemsTemp}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        search
        searchPlaceholder="Tìm kiếm..."
        value={selectedValue}
        onChange={handleChange}
        maxHeight={200}
        showsVerticalScrollIndicator
        autoScroll
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  dropdown: {
    height: 50,
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  dropdownContainer: {
    borderColor: "#d1d5db",
    borderRadius: 10,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#9ca3af",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#111827",
  },
  itemTextStyle: {
    fontSize: 16,
    color: "#374151",
  },
});

export default CustomDropdown;