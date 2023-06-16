import React, { useContext, useMemo, useRef, useState } from "react";
import { Animated, PanResponder } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import styled, { useTheme } from "styled-components/native";
import { WordsContext, WordsContextType } from "../contexts/WordsContext";
import { StepContext, StepContextType } from "../contexts/StepContext";
import shuffleArray from "../functions/shuffleArray";
import icons from "../icons";

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.colors.primary};
    padding: 100px 0;
`;

const CardContainer = styled.View`
    flex: 3;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

const Card = styled(Animated.View)`
    width: 250px;
    aspect-ratio: 1/1;
    border-radius: 14px;
    justify-content: center;
    align-items: center;
    position: absolute;
    background-color: ${(props) => props.theme.colors.foreground};
    elevation: 40;
    box-shadow: 0 0 40px rgb(0, 0, 0);
    shadow-opacity: 0.3;
    shadow-color: rgba(0, 0, 0, 0.7);
`;

const ButtonContainer = styled.View`
    margin-top: 50px;
    flex-direction: row;
    flex: 1;
`;

const Button = styled.TouchableOpacity`
    margin: 0 20px;
`;

const TOTAL_SELECTABLE_COUNTS = 8;

function Select(): JSX.Element {
    const scale = useRef(new Animated.Value(1)).current;
    const posX = useRef(new Animated.Value(0)).current;
    const rotation = posX.interpolate({
        inputRange: [-260, 260],
        outputRange: ["-15deg", "15deg"],
        extrapolate: "clamp",
    });
    const backScale = posX.interpolate({
        inputRange: [-350, 0, 350],
        outputRange: [1, 0.7, 1],
        extrapolate: "clamp",
    });
    const backOpacity = posX.interpolate({
        inputRange: [-350, 0, 350],
        outputRange: [1, 0.5, 1],
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
    const animPosXCenter = Animated.spring(posX, {
        toValue: 0,
        useNativeDriver: true,
    });
    const animPosXLeft = Animated.spring(posX, {
        toValue: -380,
        damping: 50,
        stiffness: 200,
        mass: 1,
        restSpeedThreshold: 150,
        restDisplacementThreshold: 50,
        useNativeDriver: true,
    });
    const animPosXRight = Animated.spring(posX, {
        toValue: 380,
        damping: 50,
        stiffness: 200,
        mass: 1,
        restSpeedThreshold: 150,
        restDisplacementThreshold: 50,
        useNativeDriver: true,
    });

    const theme = useTheme();
    const refIndex = useRef(0);
    const [index, setIndex] = useState(0);
    const [_, setStep] = useContext<StepContextType>(StepContext as any);
    const [__, setWords] = useContext<WordsContextType>(WordsContext as any);
    const mixedIcons = useMemo(() => shuffleArray(icons), []);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, { dx }) => posX.setValue(dx),
            onPanResponderGrant: () => animScaleDown.start(),
            onPanResponderRelease: (_, { dx }) => {
                if (dx < -230) {
                    onRemovePress();
                } else if (dx > 230) {
                    onAddPress();
                } else {
                    Animated.parallel([animScaleUp, animPosXCenter]).start();
                }
            },
        })
    ).current;

    const onDismiss = () => {
        posX.setValue(0);
        scale.setValue(1);
        setIndex((prev) => prev + 1);
    };
    const onRemovePress = () => {
        refIndex.current += 1;
        animPosXLeft.start(onDismiss);
    };
    const onAddPress = () => {
        setWords((state_words) => {
            if (state_words.length + 1 > TOTAL_SELECTABLE_COUNTS) {
                setStep("DROP");
                return state_words;
            } else {
                return [
                    ...state_words,
                    mixedIcons[refIndex.current % mixedIcons.length],
                ];
            }
        });
        refIndex.current += 1;
        animPosXRight.start(onDismiss);
    };

    return (
        <Container>
            <StatusBar backgroundColor={theme.colors.primary} style="light" />
            <CardContainer>
                <Card
                    style={{
                        opacity: backOpacity,
                        transform: [{ scale: backScale }],
                    }}
                >
                    <MaterialCommunityIcons
                        name={
                            mixedIcons[(index % mixedIcons.length) + 1] as any
                        }
                        color={theme.colors.text}
                        size={85}
                    />
                </Card>
                <Card
                    {...panResponder.panHandlers}
                    style={{
                        transform: [
                            { scale },
                            { translateX: posX },
                            { rotateZ: rotation },
                        ],
                    }}
                >
                    <MaterialCommunityIcons
                        name={mixedIcons[index % mixedIcons.length] as any}
                        color={theme.colors.text}
                        size={85}
                    />
                </Card>
            </CardContainer>
            <ButtonContainer>
                <Button activeOpacity={0.7} onPress={onRemovePress}>
                    <Ionicons
                        name="close-circle"
                        color={theme.colors.foreground}
                        size={65}
                    />
                </Button>
                <Button activeOpacity={0.7} onPress={onAddPress}>
                    <Ionicons
                        name="checkmark-circle"
                        color={theme.colors.foreground}
                        size={65}
                    />
                </Button>
            </ButtonContainer>
        </Container>
    );
}

export default Select;
