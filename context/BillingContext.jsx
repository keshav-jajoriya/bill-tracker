import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

export const BillingContext = createContext({
  lists: [],
  addList: () => {},
  addItemToList: () => {},
});

export const BillingProvider = ({ children }) => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("billingLists").then((data) => {
      if (data) setLists(JSON.parse(data));
    });
  }, []);

  const persist = (newLists) => {
    setLists(newLists);
    AsyncStorage.setItem("billingLists", JSON.stringify(newLists));
  };

  const addList = (title, address) => {
    const newList = {
      id: Date.now().toString(),
      title,
      currency: "INR",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateCreated: new Date(),
      address,
      items: [],
    };
    persist([...lists, newList]);
  };

  const deleteList = (listId) => {
    const updated = lists?.filter((l) => l.id !== listId);
    persist(updated);
  };

  const addItemToList = (listId, item) => {
    const updated = lists.map((l) => {
      if (l.id === listId) {
        const updatedItems = [...l.items, item];

        // ✅ Calculate grand total for the updated items
        const grandTotal = updatedItems.reduce(
          (sum, i) => sum + parseFloat(i.total || 0),
          0
        );

        return {
          ...l,
          items: updatedItems,
          grandTotal: grandTotal.toFixed(2).toString(),
        };
      }
      return l;
    });

    persist(updated);
  };

  return (
    <BillingContext.Provider
      value={{ lists, addList, deleteList, addItemToList }}
    >
      {children}
    </BillingContext.Provider>
  );
};
