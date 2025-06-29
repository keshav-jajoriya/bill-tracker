import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

export const BillingContext = createContext({
  lists: [],
  addList: () => {},
  addItemToList: () => {},
});

export const BillingProvider = ({ children }) => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('billingLists').then((data) => {
      if (data) setLists(JSON.parse(data));
    });
  }, []);

  const persist = (newLists) => {
    setLists(newLists);
    AsyncStorage.setItem('billingLists', JSON.stringify(newLists));
  };

  const addList = (title) => {
    const newList = {
      id: Date.now().toString(),
      title,
      currency: 'INR',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      items: [],
    };
    persist([...lists, newList]);
  };

  const deleteList = (listId) => {
    const updated = lists?.filter((l) => l.id !== listId);
    persist(updated);
  };

  const addItemToList = (listId, item) => {
    const updated = lists.map((l) =>
      l.id === listId ? { ...l, items: [...l.items, item] } : l
    );
    persist(updated);
  };

  return (
    <BillingContext.Provider value={{ lists, addList, deleteList, addItemToList }}>
      {children}
    </BillingContext.Provider>
  );
};
