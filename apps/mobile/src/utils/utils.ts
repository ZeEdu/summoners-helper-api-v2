import { Platform } from "react-native";

const isWeb = Platform.OS === 'web'

const cleanDOMElements = (value: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(
    value,
    'text/html',
  );
  return doc.body.textContent || '';
}

const Utils = {
  isWeb,
  cleanDOMElements
}

export default Utils