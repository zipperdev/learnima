import React, { useMemo, useRef, useState } from "react";
import { Animated, PanResponder } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import shuffleArray from "./functions/shuffleArray";
import icons from "./icons";

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #ffa962;
    padding: 100px 0;
`;

const CardContainer = styled.View`
    flex: 3;
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
    background-color: #fdfdfd;
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

function App(): JSX.Element {
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
        toValue: -360,
        damping: 50,
        stiffness: 200,
        mass: 1,
        restSpeedThreshold: 200,
        restDisplacementThreshold: 100,
        useNativeDriver: true,
    });
    const animPosXRight = Animated.spring(posX, {
        toValue: 360,
        damping: 50,
        stiffness: 200,
        mass: 1,
        restSpeedThreshold: 200,
        restDisplacementThreshold: 100,
        useNativeDriver: true,
    });

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, { dx }) => posX.setValue(dx),
            onPanResponderGrant: () => animScaleDown.start(),
            onPanResponderRelease: (_, { dx }) => {
                if (dx < -230) {
                    animPosXLeft.start(onDismiss);
                } else if (dx > 230) {
                    animPosXRight.start(onDismiss);
                } else {
                    Animated.parallel([animScaleUp, animPosXCenter]).start();
                }
            },
        })
    ).current;

    const [index, setIndex] = useState(0);
    const mixedIcons = useMemo(() => shuffleArray(icons), []);

    const onDismiss = () => {
        posX.setValue(0);
        scale.setValue(1);
        setIndex((prev) => prev + 1);
    };
    const onRemovePress = () => {
        animPosXLeft.start(onDismiss);
    };
    const onAddPress = () => {
        animPosXRight.start(onDismiss);
    };

    return (
        <Container>
            <CardContainer>
                <Card
                    style={{
                        opacity: backOpacity,
                        transform: [{ scale: backScale }],
                    }}
                >
                    <Ionicons
                        name={mixedIcons[index + 1] as any}
                        color={"#3a3225"}
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
                    <Ionicons
                        name={mixedIcons[index] as any}
                        color={"#3a3225"}
                        size={85}
                    />
                </Card>
            </CardContainer>
            <ButtonContainer>
                <Button activeOpacity={0.7} onPress={onRemovePress}>
                    <Ionicons name="close-circle" color={"#fdfdfd"} size={65} />
                </Button>
                <Button activeOpacity={0.7} onPress={onAddPress}>
                    <Ionicons
                        name="checkmark-circle"
                        color={"#fdfdfd"}
                        size={65}
                    />
                </Button>
            </ButtonContainer>
        </Container>
    );
}

export default App;
