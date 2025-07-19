import { BillingContext } from "@/context/BillingContext";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, View } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import { WebView } from "react-native-webview";

export default function PdfPreview() {
  const { id } = useLocalSearchParams();
  const { lists } = useContext(BillingContext);
  const navigation = useNavigation();

  const [pdfPath, setPdfPath] = useState(null);
  const [loading, setLoading] = useState(true);

  const list = React.useMemo(() => {
    return lists?.find((l) => l.id === id) || null;
  }, [lists, id]);

  useEffect(() => {
    if (list) {
      generatePDF();
    } else {
      Alert.alert("Not Found", "Could not find a bill with this ID.");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  const generatePDF = async () => {
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial; padding: 20px; color: #333; }
              h1 { text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #999; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .total { text-align: right; font-weight: bold; padding-top: 10px; }
            </style>
          </head>
          <body>
            <h1>${list.title || "No Title"}</h1>
            <p><strong>Date:</strong> ${new Date(
              list.dateCreated
            ).toLocaleDateString()}</p>
            <p><strong>Address:</strong> ${list.address || "N/A"}</p>
            <table>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
              ${
                list.items
                  ?.map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price}</td>
                    <td>${item.total}</td>
                  </tr>`
                  )
                  .join("") || "<tr><td colspan='4'>No items found</td></tr>"
              }
            </table>
            <p class="total">Grand Total: ${list.grandTotal || 0}</p>
          </body>
        </html>
      `;

      const options = {
        html: htmlContent,
        fileName: `Invoice-${list.id || Date.now()}`,
        directory: "Documents",
      };

      const file = await RNHTMLtoPDF?.convert(options);

      if (!file?.filePath) {
        throw new Error("PDF file path not returned");
      }

      setPdfPath(file.filePath);
    } catch (error) {
      console.error("PDF generation failed:", error.message);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "PDF Preview",
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {pdfPath ? (
        <WebView source={{ uri: `file://${pdfPath}` }} style={{ flex: 1 }} />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Button title="Try Generating PDF Again" onPress={generatePDF} />
        </View>
      )}
    </View>
  );
}
