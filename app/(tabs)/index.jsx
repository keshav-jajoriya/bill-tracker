import { ROUTES } from "@/utils/routes";
import { router, useNavigation } from "expo-router";
import React, { useContext, useLayoutEffect, useState } from "react";
import {
  Alert,
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  UIManager,
  View,
} from "react-native";
import {
  Button,
  IconButton,
  Menu,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import { BillingContext } from "../../context/BillingContext";

// Enable animation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {
  const { lists = [], addList, deleteList } = useContext(BillingContext);

  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [sortOption, setSortOption] = useState("recent");
  const [menuVisible, setMenuVisible] = useState(false);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Create Your List" });
  }, [navigation]);

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const isValidListTitle = (input) => {
    const trimmed = input.trim();
    if (trimmed.length < 3) return "Title must be at least 3 characters";
    if (trimmed.length > 50) return "Title must be under 50 characters";
    if (!/^[a-zA-Z0-9 _-]+$/.test(trimmed))
      return "Only letters, numbers, spaces, dashes, and underscores allowed";
    if (
      lists.some((list) => list.title.toLowerCase() === trimmed.toLowerCase())
    )
      return "A list with this name already exists";
    return null;
  };

  const handleCreate = () => {
    const error = isValidListTitle(title);
    if (error) {
      showSnackbar(error);
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      addList(title.trim());
      setTitle("");
    }
  };

  const handleDelete = (id) => {
    const deleteNow = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      deleteList(id);
    };

    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to delete this list?")) {
        deleteNow();
      }
    } else {
      Alert.alert("Delete List", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: deleteNow, style: "destructive" },
      ]);
    }
  };

  const sortLists = (arr) => {
    switch (sortOption) {
      case "az":
        return [...arr].sort((a, b) => a.title.localeCompare(b.title));
      case "za":
        return [...arr].sort((a, b) => b.title.localeCompare(a.title));
      case "recent":
      default:
        return [...arr].sort((a, b) => Number(b.id) - Number(a.id)); // Assuming id is timestamp
    }
  };

  const filteredLists = sortLists(
    lists.filter((list) =>
      list.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
  );

  const highlightMatch = (text, query) => {
    if (!query.trim()) {
      return [
        <Text key="full" style={styles.listTitleText}>
          {text}
        </Text>,
      ];
    }

    const regex = new RegExp(`(${query})`, "i");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <Text key={index} style={styles.highlightText}>
          {part}
        </Text>
      ) : (
        <Text key={index} style={styles.listTitleText}>
          {part}
        </Text>
      )
    );
  };

  return (
    <>
      <View style={styles.container}>
        <TextInput
          label="New Billing List"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleCreate}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>Create</Text>
        </Button>

        {lists.length > 6 && (
          <>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search billing list..."
              placeholderTextColor="#bbb"
              mode="outlined"
              left={<TextInput.Icon icon="magnify" color="#aaa" />}
              style={styles.searchInput}
            />
            <View style={styles.menuContainer}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button
                    icon="sort"
                    textColor="#fff"
                    mode="outlined"
                    onPress={() => setMenuVisible(true)}
                    style={styles.sortButton}
                  >
                    Sort:{" "}
                    {{
                      az: "A–Z",
                      za: "Z–A",
                      recent: "Recent",
                    }[sortOption]}
                  </Button>
                }
                contentStyle={styles.menuContent}
              >
                <Menu.Item
                  onPress={() => {
                    setSortOption("recent");
                    setMenuVisible(false);
                  }}
                  title="Most Recent"
                  leadingIcon="history"
                  titleStyle={styles.menuItemText}
                />
                <Menu.Item
                  onPress={() => {
                    setSortOption("az");
                    setMenuVisible(false);
                  }}
                  title="A–Z"
                  leadingIcon="sort-alphabetical-ascending"
                  titleStyle={styles.menuItemText}
                />
                <Menu.Item
                  onPress={() => {
                    setSortOption("za");
                    setMenuVisible(false);
                  }}
                  title="Z–A"
                  leadingIcon="sort-alphabetical-descending"
                  titleStyle={styles.menuItemText}
                />
              </Menu>
            </View>
          </>
        )}

        {lists.length > 0 && (
          <Text style={styles.countText}>
            Showing {filteredLists.length} of {lists.length} list
            {lists.length !== 1 ? "s" : ""}
          </Text>
        )}

        <FlatList
          data={filteredLists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Button
                mode="outlined"
                onPress={() => router.push(ROUTES.listDetail(item.id))}
                style={styles.listTitleButton}
              >
                {highlightMatch(item.title, searchQuery)}
              </Button>
              <IconButton
                icon="trash-can-outline"
                iconColor="#fff"
                containerColor="#444"
                size={22}
                onPress={() => handleDelete(item.id)}
              />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No billing lists found.</Text>
          }
          style={{ marginTop: 20 }}
        />
      </View>

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
    padding: 10,
    backgroundColor: "#333",
    flex: 1,
  },
  input: {
    backgroundColor: "#2c2c2c",
  },
  searchInput: {
    marginTop: 20,
    backgroundColor: "#2c2c2c",
    height: 40,
  },
  menuContainer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  sortButton: {
    borderColor: "#555",
    backgroundColor: "#2c2c2c",
    borderRadius: 8
  },
  menuContent: {
    backgroundColor: "#2c2c2c",
    borderRadius: 8,
  },
  menuItemText: {
    color: "#fff",
  },
  createButton: {
    marginTop: 10,
    backgroundColor: "#fff",
  },
  createButtonText: {
    fontWeight: "600",
    color: "#333",
  },
  countText: {
    color: "#bbb",
    marginTop: 15,
    fontSize: 14,
    textAlign: "center",
  },
  listItem: {
    marginVertical: 10,
    padding: 5,
    paddingLeft: 10,
    backgroundColor: "#444",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listTitleButton: {
    flex: 1,
    borderColor: "#fff",
    borderRadius: 8,
  },
  listTitleText: {
    fontWeight: "600",
    color: "#fff",
  },
  highlightText: {
    fontWeight: "700",
    color: "#00e6ff",
  },
  emptyText: {
    color: "#bbb",
    textAlign: "center",
    marginTop: 20,
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
