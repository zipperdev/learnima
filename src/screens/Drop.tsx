import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, Easing, PanResponder } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import styled, { useTheme } from "styled-components/native";
import { WordsContext, WordsContextType } from "../contexts/WordsContext";
import { StepContext, StepContextType } from "../contexts/StepContext";
import icons from "../icons";

const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
`;

const Edge = styled.View`
    flex: 1.5;
    justify-content: center;
    align-items: center;
    z-index: -1;
`;

const WordContainer = styled(Animated.View)`
    width: 80%;
    height: 110px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    padding: 15px 10px;
    background-color: ${(props) => props.theme.colors.primary};
`;

const Word = styled.Text`
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    color: ${(props) => props.theme.colors.foreground};
`;

const ResultContainer = styled(Animated.View)`
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    position: absolute;
`;

const Center = styled.View`
    flex: 3;
    justify-content: center;
    align-items: center;
`;

const IconCard = styled(Animated.View)`
    padding: 25px;
    border-radius: 20px;
    background-color: ${(props) => props.theme.colors.foreground};
    elevation: 40;
    box-shadow: 0 0 40px rgb(0, 0, 0);
    shadow-opacity: 0.3;
    shadow-color: rgba(0, 0, 0, 0.5);
`;

const TOTAL_PRACTICE_TIMES = 3;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

const parseNameToWord = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).split("-").join(" ");
};

function Drop(): JSX.Element {
    const scale = useRef(new Animated.Value(1)).current;
    const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const resultYPosition = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;
    const topWordScale = position.y.interpolate({
        inputRange: [-220, 0],
        outputRange: [1.1, 1],
        extrapolate: "clamp",
    });
    const bottomWordScale = position.y.interpolate({
        inputRange: [0, 220],
        outputRange: [1, 1.1],
        extrapolate: "clamp",
    });
    const resultOpacity = resultYPosition.interpolate({
        inputRange: [
            -SCREEN_HEIGHT,
            -SCREEN_HEIGHT / 5,
            SCREEN_HEIGHT / 5,
            SCREEN_HEIGHT,
        ],
        outputRange: [0, 1, 1, 0],
        extrapolate: "clamp",
    });

    const animScaleDown = Animated.spring(scale, {
        toValue: 0.9,
        bounciness: 15,
        speed: 10,
        useNativeDriver: true,
    });
    const animScaleUp = Animated.spring(scale, {
        toValue: 1,
        bounciness: 15,
        speed: 10,
        useNativeDriver: true,
    });
    const animPosReset = Animated.spring(position, {
        toValue: 0,
        damping: 30,
        stiffness: 400,
        mass: 1.5,
        useNativeDriver: true,
    });
    const animPosLinearReset = Animated.timing(position, {
        toValue: {
            x: 0,
            y: 0,
        },
        easing: Easing.out(Easing.exp),
        duration: 400,
        useNativeDriver: true,
    });
    const animScaleReset = Animated.timing(scale, {
        toValue: 0.3,
        easing: Easing.out(Easing.sin),
        duration: 150,
        useNativeDriver: true,
    });
    const animOpacityNone = Animated.timing(opacity, {
        toValue: 0,
        easing: Easing.out(Easing.sin),
        duration: 150,
        useNativeDriver: true,
    });
    const animOpacityReset = Animated.timing(opacity, {
        toValue: 1,
        easing: Easing.out(Easing.sin),
        duration: 150,
        useNativeDriver: true,
    });
    const animResultPosCenter = Animated.timing(resultYPosition, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
    });
    const animResultPosDown = Animated.timing(resultYPosition, {
        toValue: SCREEN_HEIGHT,
        delay: 200,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
    });

    const theme = useTheme();
    const [index, setIndex] = useState(0);
    const [topWord, setTopWord] = useState("");
    const [bottomWord, setBottomWord] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [isTopAnswer, setIsTopAnswer] = useState(true);
    const [_, setStep] = useContext<StepContextType>(StepContext as any);
    const [words, setWords] = useContext<WordsContextType>(WordsContext as any);
    const [wordCorrections, setWordCorrections] = useState<number[]>(
        words.map(() => 0)
    );

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onPanResponderGrant: () => {
                    animScaleDown.start();
                },
                onPanResponderMove: (_, { dx, dy }) => {
                    position.setValue({
                        x: dx,
                        y: dy,
                    });
                },
                onPanResponderRelease: (_, { dy }) => {
                    if (dy < -200 || dy > 200) {
                        Animated.parallel([
                            animScaleReset,
                            animOpacityNone,
                        ]).start(() => {
                            validateCorrection(dy < -200);
                            animPosLinearReset.start(() => {
                                setNextIcon();
                            });
                        });
                    } else {
                        Animated.parallel([animScaleUp, animPosReset]).start();
                    }
                },
            }),
        [index, isTopAnswer]
    );

    const validateCorrection = (isTopSelected: boolean) => {
        const isCorrect =
            (isTopAnswer && isTopSelected) || (!isTopAnswer && !isTopSelected);
        setIsCorrect(isCorrect);

        Animated.sequence([animResultPosCenter, animResultPosDown]).start(() =>
            resultYPosition.setValue(-SCREEN_HEIGHT)
        );

        if (isCorrect) {
            const clonedWordCorrections = wordCorrections;
            wordCorrections[index % words.length] += 1;

            const excludeIndexes: number[] = [];
            for (let i = 0; i < clonedWordCorrections.length; i++) {
                if (clonedWordCorrections[i] >= TOTAL_PRACTICE_TIMES) {
                    excludeIndexes.push(i);
                }
            }

            setWordCorrections(
                clonedWordCorrections.filter(
                    (_, index) => !excludeIndexes.includes(index)
                )
            );
            setWords(
                words.filter((_, index) => !excludeIndexes.includes(index))
            );
        }
    };
    const setNextIcon = () => {
        Animated.parallel([animScaleUp, animOpacityReset]).start();
        setIndex((prev) => prev + 1);
    };

    useEffect(() => {
        if (wordCorrections.length === 0) return setStep("SELECT");

        const bulkIsTopAnswer = Boolean(Math.round(Math.random()));
        setIsTopAnswer(bulkIsTopAnswer);

        const iconsWithoutAnswer = icons.filter(
            (_, keyIndex) => keyIndex !== index % words.length
        );
        const fakeWordIndex = Math.floor(
            Math.random() * iconsWithoutAnswer.length
        );

        const answerWord = parseNameToWord(words[index % words.length]);
        const fakeWord = parseNameToWord(iconsWithoutAnswer[fakeWordIndex]);
        setTopWord(bulkIsTopAnswer ? answerWord : fakeWord);
        setBottomWord(bulkIsTopAnswer ? fakeWord : answerWord);
    }, [index]);

    return (
        <Container>
            <StatusBar backgroundColor={theme.colors.background} />
            <ResultContainer
                style={{
                    zIndex: 10,
                    backgroundColor: isCorrect ? "#27ae60" : "#eb6051",
                    transform: [{ translateY: resultYPosition }],
                    opacity: resultOpacity,
                }}
            >
                <Ionicons
                    name={isCorrect ? "checkmark-circle" : "close-circle"}
                    size={130}
                    color={theme.colors.foreground}
                />
            </ResultContainer>
            <Edge>
                <WordContainer style={{ transform: [{ scale: topWordScale }] }}>
                    <Word adjustsFontSizeToFit>{topWord}</Word>
                </WordContainer>
            </Edge>
            <Center>
                <IconCard
                    {...panResponder.panHandlers}
                    style={{
                        opacity,
                        transform: [
                            ...position.getTranslateTransform(),
                            { scale },
                        ],
                    }}
                >
                    <MaterialCommunityIcons
                        name={words[index % words.length] as any}
                        color={theme.colors.text}
                        size={90}
                    />
                </IconCard>
            </Center>
            <Edge>
                <WordContainer
                    style={{ transform: [{ scale: bottomWordScale }] }}
                >
                    <Word adjustsFontSizeToFit>{bottomWord}</Word>
                </WordContainer>
            </Edge>
        </Container>
    );
}

export default Drop;
