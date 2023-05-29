# Learnima 애니배움

### Nomadcoders - React Native 마스터클래스 (애니메이션 & 인터랙티브 앱)

애니메이션으로 언어를 배울 수 있는 인터랙티브 react-native 모바일 앱입니다.

---

`Animated`는 주로 `View`에 적용이 잘 된다. (예를 들어서 `TouchableOpacity`는 보기에 안좋음)

### Animated 규칙

-   값을 사용한다면 **반드시 `Animated.Value`를 사용**해야 된다. (`useState` 사용 금지)
-   **값을 절대 직접적으로 정하지 않는다.** (`Y = 10;` 다음과 같이 절대 금지)
-   `Animatable components`(`Animated.View` 등)에만 애니메이션을 줄 수 있다. (`Core components`에는 절대 애니메이션 부여 불가)
    만약 직접 만든 component에 애니메이션을 부여하고 싶다면 `createAnimatedComponent()` 함수를 사용해야 한다.

### useNativeDriver 속성

`useNativeDriver = true`라면 `Native Driver`을 사용하게 된다.
`Native Driver`을 사용한다면 애니메이션에 관한 모든 것이 `native`로 전해져 실행된다.
`react-native`는 *`bridge`를 통해 `native`로 정보를 전달*하는데, 이 과정 필요없이 **처음부터 `native`에서 실행하기에 리렌더링이 필요 없어 성능이 향상**된다.

### useRef

`useRef`는 **렌더링이 일어나도 값을 유지하는 후크**이다.
만약 애니메이션이 `state`에 따라 움직인다면 `useRef`로 렌더링이 일어났을 때 값을 유지시킬 수 있다
(`useRef(new Animated.Value(0)).current` useRef는 current로 값을 알 수 있음)

### Interpolation

`interpolation`을 사용할 때는 `Animated.Value`의 내장 함수인 `interpolate`를 사용하면 된다. (`new Animated.Value(0).interpolate({ ... })`)
`interpolate`는 첫번째 인수에 `inputRange`와 `outputRange`가 있는데, 각 인덱스마다 변환을 줄 값을 말한다.
