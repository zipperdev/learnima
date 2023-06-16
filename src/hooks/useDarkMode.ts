import { useColorScheme } from "react-native";

const useDarkMode = () => useColorScheme() === "dark";

export default useDarkMode;
