import React, { useState } from "react";
import Reanimated, { FadeIn, FadeOut } from "react-native-reanimated";
import styled, { ThemeProvider } from "styled-components/native";
import { styledDarkTheme, styledLightTheme } from "./themes/theme";
import { StepContext, StepStateType } from "./contexts/StepContext";
import { WordsContext, WordsStateType } from "./contexts/WordsContext";
import useDarkMode from "./hooks/useDarkMode";
import Select from "./screens/Select";
import Drop from "./screens/Drop";

const ScreenContainer = styled(Reanimated.View)`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`;

function App(): JSX.Element {
    const isDarkMode = useDarkMode();
    const stepState = useState<StepStateType>("SELECT");
    const wordsState = useState<WordsStateType>([]);

    return (
        <ThemeProvider theme={isDarkMode ? styledDarkTheme : styledLightTheme}>
            <StepContext.Provider value={stepState}>
                <WordsContext.Provider value={wordsState}>
                    <Select />
                    {stepState[0] === "DROP" ? (
                        <ScreenContainer entering={FadeIn} exiting={FadeOut}>
                            <Drop />
                        </ScreenContainer>
                    ) : null}
                </WordsContext.Provider>
            </StepContext.Provider>
        </ThemeProvider>
    );
}

export default App;
