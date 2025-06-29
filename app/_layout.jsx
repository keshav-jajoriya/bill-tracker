import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { BillingProvider } from "../context/BillingContext";

export default function Layout() {
  return (
    <PaperProvider>
      <BillingProvider>
        {/* <SafeAreaView
          style={{ flex: 1, backgroundColor: "transparent" }}
          edges={["top", "bottom", "left", "right"]}
        > */}
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: "#1f1f2e" },
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 20,
                color: "#fff",
              },
              headerTintColor: "#fff",
              headerTitleAlign: "left",
              // headerRight: () => (
              //   <IconButton
              //     icon="account-circle"
              //     iconColor="#fff"
              //     onPress={() => router.push(ROUTES.profile)}
              //   />
              // ),
            }}
          />
        {/* </SafeAreaView> */}
      </BillingProvider>
    </PaperProvider>
  );
}
