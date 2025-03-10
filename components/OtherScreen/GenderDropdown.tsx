import React, { useState } from "react";
import { View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const GenderDropdown = ({ zIndex = 1000 }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Nam", value: "male" },
    { label: "Nữ", value: "female" },
    { label: "Khác", value: "other" },
  ]);

  return (
    <View style={{ zIndex: zIndex }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Chọn giới tính"
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
        containerStyle={{ height: 50, marginTop: 10, }}
        style={{
          borderColor: "#d1d5db",
          borderWidth: 1,
          borderRadius: 10,
        }}
        textStyle={{
          fontSize: 16
        }}
        dropDownContainerStyle={{
          borderColor: "#d1d5db",
        }}
      />
    </View>
  );
};

export default GenderDropdown;