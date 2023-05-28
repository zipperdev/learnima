import "styled-components/native";

declare module "styled-components/native" {
    export interface DefaultTheme {
        isDarkMode: boolean;
    }
}
