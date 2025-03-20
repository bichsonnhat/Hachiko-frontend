import React, { useState } from "react";
import { View, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface DropdownItem {
    label: string;
    value: string;
}

interface CustomMultiSelectDropDownProps {
    items: DropdownItem[];
    placeholder?: string;
    zIndex?: number;
    onSelect?: (values: string[] | null) => void;
    defaultValues?: string[];
}

const CustomMultiSelectDropDown: React.FC<CustomMultiSelectDropDownProps> = ({
                                                                                 items,
                                                                                 placeholder = "Chọn",
                                                                                 zIndex = 1000,
                                                                                 onSelect,
                                                                                 defaultValues = [],
                                                                             }) => {
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState<string[]>(defaultValues);
    const [items_temp, setItems] = useState(items);

    const handleValueChange = (selectedValues: string[]) => {
        setValues(selectedValues);
        if (onSelect) {
            onSelect(selectedValues.length > 0 ? selectedValues : null);
        }
    };

    return (
        <View style={{ zIndex: zIndex }}>
            <DropDownPicker
                open={open}
                value={values}
                items={items_temp}
                setOpen={setOpen}
                setValue={handleValueChange}
                setItems={setItems}
                placeholder={placeholder}
                multiple={true}
                mode="BADGE"
                badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926"]}
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
                badgeTextStyle={{
                    fontSize: 14,
                }}
                badgeStyle={{
                    padding: 5,
                    borderRadius: 8,
                }}
                showBadgeDot={true}
                searchable={values.length > 10}
                min={0}
                max={null}
            />
            {values.length > 0 && (
                <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 5 }}>
                    Đã chọn {values.length} mục
                </Text>
            )}
        </View>
    );
};

export default CustomMultiSelectDropDown;