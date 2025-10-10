import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type Category = {
  icon: string;
  family?: string;
  bg: string;
  label: string;
};

function CategoryItem({ icon, family = "Ionicons", bg, label }: Category) {
  const IconComponent =
    family === "MaterialCommunityIcons" ? MaterialCommunityIcons : Ionicons;
  return (
    <View className="items-center">
      <View
        className="w-[63px] h-[63px] rounded-lg justify-center items-center shadow-sm"
        style={{ backgroundColor: bg }}
      >
        <IconComponent name={icon as any} size={25} color="#fff" />
      </View>
      <Text className="mt-2.5 text-[13px] font-karla-bold text-black text-center">
        {label}
      </Text>
    </View>
  );
}

export default function CategoriesGrid({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <View className="flex-row justify-around my-5 px-4">
      {categories.map((c) => (
        <CategoryItem key={c.label} {...c} />
      ))}
    </View>
  );
}
