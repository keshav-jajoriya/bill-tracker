import { ROUTES } from "@/utils/routes";
import { router, useNavigation } from "expo-router";
import React, { useContext, useLayoutEffect, useState } from "react";
import { Alert, FlatList, Platform, StyleSheet, View } from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { BillingContext } from "../../context/BillingContext";

export default function HomeScreen() {
  const { lists, addList, deleteList } = useContext(BillingContext);
  const [title, setTitle] = useState("");

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Create Your List",
    });
  }, [navigation]);

  const handleCreate = () => {
    if (title.trim()) {
      addList(title.trim());
      setTitle("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="New Billing List"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
      />
      <Button
        mode="contained"
        onPress={handleCreate}
        style={styles.createButton}
      >
        <Text style={styles.createButtonText}>Create</Text>
      </Button>

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Button
              mode="outlined"
              onPress={() => router.push(ROUTES.listDetail(item.id))}
              style={styles.listTitleButton}
            >
              <Text style={styles.listTitleText}>{item.title}</Text>
            </Button>
            <IconButton
              icon="trash-can-outline"
              iconColor="#fff"
              containerColor="#c90e0e"
              size={22}
              onPress={() => {
                if (Platform.OS === "web") {
                  const confirmed = window.confirm(
                    "Are you sure you want to delete?"
                  );
                  if (confirmed) deleteList(item.id);
                } else {
                  Alert.alert(
                    "Delete Item",
                    "Are you sure you want to delete this?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        onPress: () => deleteList(item.id),
                        style: "destructive",
                      },
                    ]
                  );
                }
              }}
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={{ color: "#bbb", textAlign: 'center' }}>No lists yet.</Text>
        }
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#333333",
    flex: 1,
  },
  createButton: {
    marginTop: 10,
    backgroundColor: "#ffffff",
  },
  createButtonText: {
    fontWeight: "600",
    color: "#333333",
  },
  listItem: {
    marginVertical: 10,
    padding: 5,
    paddingLeft: 10,
    backgroundColor: "#444444",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listTitleButton: {
    flex: 1,
    borderColor: "#ffffff",
    borderRadius: 8,
  },
  listTitleText: {
    fontWeight: "600",
    color: "#ffffff",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#c90e0e",
    borderWidth: 1,
    borderRadius: 8,
  },
  deleteText: {
    fontWeight: "bold",
    color: "#c90e0e",
  },
});
