import { DefaultTheme } from "styled-components";
import { darkColors, lightColors } from "./colors";

export const styledLightTheme: DefaultTheme = {
    isDarkMode: false,
    colors: lightColors,
};

export const styledDarkTheme: DefaultTheme = {
    isDarkMode: true,
    colors: darkColors,
};
