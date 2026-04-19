import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function CustomCheckbox({ label, value, onChange }: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onChange(!value)}
      activeOpacity={0.7}
    >
      <View style={[styles.box, value && styles.boxChecked]}>
        {value && <AntDesign name="check" size={16} color="#fff" />}
      </View>

      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  box: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  boxChecked: {
    backgroundColor: "#39FF14",
    borderColor: "#39FF14",
  },
  label: {
    fontSize: 14,
    color: "#fff",
  },
});