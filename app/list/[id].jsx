import { ROUTES } from "@/utils/routes";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Card,
  Divider,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import { BillingContext } from "../../context/BillingContext";

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams();
  const { lists, addItemToList } = useContext(BillingContext);
  const list = lists.find((l) => l.id === id);
  const navigation = useNavigation();

  const [item, setItem] = useState({ name: "", price: "", quantity: "", total: "" });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [billDate, setBillDate] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Product List",
    });
  }, [list, navigation]);

  useEffect(() => {
    const MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    if (list?.dateCreated) {
      const date = new Date(list.dateCreated);
      const formattedDate = `${date.getDate()} ${
        MONTHS[date.getMonth()]
      } ${date.getFullYear()}`;
      setBillDate(formattedDate);
    }
  }, [list]);

  if (!list) {
    return <Text style={styles.errorText}>List not found</Text>;
  }

  const handleAddItem = () => {
    const newItem = {
      ...item,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
      total: (parseFloat(item.price) * parseInt(item.quantity)).toFixed(2),
      name: item.name.trim(),
    };

    if (!newItem.name || isNaN(newItem.price) || isNaN(newItem.quantity)) {
      setSnackbarMessage("Please fill all fields correctly");
      setSnackbarVisible(true);
      return;
    }

    addItemToList(list.id, newItem);
    setItem({ name: "", price: "", quantity: "", total: "" });
  };

  const totalListAmount = list.items.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  );

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text variant="headlineSmall" style={styles.title}>
          {list.title}
        </Text>

        <Text variant="headlineSmall" style={styles.dateCreated}>
          DATE - <b>{billDate}</b>
        </Text>

        <TextInput
          label="Product Name"
          value={item.name}
          onChangeText={(t) => setItem({ ...item, name: t })}
          style={styles.input}
          mode="outlined"
        />

        <View style={styles.inputContainer}>
          <TextInput
            label="Price"
            keyboardType="numeric"
            value={item.price}
            onChangeText={(t) => setItem({ ...item, price: t })}
            style={styles.input2}
            mode="outlined"
          />
          <TextInput
            label="Quantity"
            keyboardType="numeric"
            value={item.quantity}
            onChangeText={(t) => setItem({ ...item, quantity: t })}
            style={styles.input2}
            mode="outlined"
          />
        </View>

        <View style={styles.buttonContainer}>
          {list?.items?.length !== 0 && (
            <Button
              mode="contained"
              onPress={() => router.push(ROUTES.PdfPreview(id))}
              style={styles.pdfButton}
            >
              <Text style={styles.pdfButtonText}>Create PDF</Text>
            </Button>
          )}

          <Button
            mode="contained"
            onPress={handleAddItem}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Add Item</Text>
          </Button>
        </View>

        <Divider style={styles.divider} />

        <Text variant="titleMedium" style={styles.totalText}>
          Total: ₹{totalListAmount.toFixed(2)}
        </Text>

        <FlatList
          data={list.items}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="bodyLarge" style={styles.cardText}>
                  {item.name}
                </Text>
                <Text variant="bodySmall" style={styles.cardSubText}>
                  ₹{item.price} × Q.{item.quantity} = ₹
                  {(item.price * item.quantity).toFixed(2)}
                </Text>
              </Card.Content>
            </Card>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyList}>No items added yet.</Text>
          }
          style={{ marginTop: 10 }}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        <Text style={styles.snackbarText}>{snackbarMessage}</Text>
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 10,
  },
  title: {
    color: "#ffffff",
    // marginBottom: 10,
  },
  dateCreated: {
    color: "#dededeff",
    marginBottom: 10,
    fontSize: 14,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#2c2c2c",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  input2: {
    width: "calc(50% - 5px)",
    marginBottom: 15,
    backgroundColor: "#2c2c2c",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  button: {
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
  buttonText: {
    color: "#333333",
    fontWeight: "600",
  },
  pdfButton: {
    marginBottom: 10,
    backgroundColor: "#fe3839",
  },
  pdfButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  divider: {
    marginBottom: "10px",
    marginTop: 0,
    backgroundColor: "#444",
  },
  totalText: {
    color: "#ffffff",
    marginBottom: 0,
    textAlign: "right",
  },
  card: {
    backgroundColor: "#2c2c2c",
    marginBottom: 10,
  },
  cardText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  cardSubText: {
    color: "#cccccc",
    marginTop: 4,
  },
  emptyList: {
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
  },
  snackbar: {
    backgroundColor: "#1e1e1e",
    borderColor: "#c90e0e",
    borderWidth: 1,
  },
  snackbarText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
