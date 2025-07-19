import { ROUTES } from "@/utils/routes";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "KRR Trophies",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <View style={styles.main_container}>
      <Text style={styles.title}>Welcome to the Billing App</Text>
      <Text style={styles.paragraph}>
        Your one-stop solution for managing your bills efficiently.
      </Text>
      <Text style={styles.paragraph}>
        Click the button below to get started!
      </Text>

      <TouchableOpacity
        onPress={() => router.push(ROUTES.home)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#333333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    color: "#ffffff",
    marginVertical: 4,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#d0bcff",
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: 500,
  },
});
