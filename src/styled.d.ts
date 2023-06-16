import "styled-components/native";

declare module "styled-components/native" {
    export interface DefaultTheme {
        isDarkMode: boolean;
        colors: {
            primary: string;
            text: string;
            foreground: string;
            background: string;
        };
    }
}
