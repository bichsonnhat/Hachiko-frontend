import { View } from "react-native";
import React from "react";
import { Ticket, Bell } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import BadgeButton from "../HomeScreen/BadgeButton";
import NotificationButton from "../HomeScreen/NotificationButton";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

export const Header = () => {
  return (
    <ThemedView className={"p-5 pt-10"}>
      <ThemedView className={"flex flex-row items-center"}>
        <ThemedText className={"font-medium text-xs"}>Khác</ThemedText>
        <View className={"ml-auto flex flex-row"}>
          <BadgeButton
            className="mr-2"
            icon={<Ticket size={24} color={Colors.PRIMARY} />}
            text={11}
          />
          <NotificationButton
            icon={<Bell size={24} color="black" />}
            count={1}
          />
        </View>
      </ThemedView>
    </ThemedView>
  );
};
