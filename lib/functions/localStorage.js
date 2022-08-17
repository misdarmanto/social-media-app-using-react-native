import AsyncStorage from "@react-native-async-storage/async-storage";

export const getDataFromLocalStorage = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log(e);
  }
};

export const storeDataToLocalStorage = async (key, data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const clearLoacalStorage = () => {
  AsyncStorage.clear();
};
