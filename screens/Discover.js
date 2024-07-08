import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Animated, PanResponder, View, Text, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { useAssets } from 'expo-asset';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #1e272e;
`;

const Card = styled(Animated.createAnimatedComponent(View))`
  background-color: #fd79a8;
  width: 300px;
  height: 500px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  position: absolute;
`;

const Btn = styled.TouchableOpacity`
  margin: 0px 10px;
`;

const BtnContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;

const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

export default function Discover() {
  const [coins, setCoins] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const getCoins = useCallback(
    () =>
      fetch('https://api.coinpaprika.com/v1/coins')
        .then((response) => response.json())
        .then((json) => setCoins(json)),
    []
  );
  const onRefresh = async () => {
    setRefreshing(true);
    await getCoins();
    setRefreshing(false)
  };
  useEffect(() => {
    getCoins();
  }, [getCoins]);
  const cleanedCoins = coins
    ?.filter((coin) => coin.rank !== 0)
    .filter((coin) => coin.is_active === true)
    .slice(0, 100);

  // Values
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ["-15deg", "15deg"],
  });
  const secondScale = position.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.7, 1],
    extrapolate: "clamp",
  })
  // Animations
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const onPressIn = Animated.spring(scale, {
    toValue: 0.95,
    useNativeDriver: true,
  });
  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const goLeft = Animated.spring(position, {
    toValue: -500,
    tension: 5,
    useNativeDriver: true,
    restDisplacementThreshold: 100,
    restSpeedThreshold: 100,
  });
  const goRight = Animated.spring(position, {
    toValue: 500,
    tension: 5,
    useNativeDriver: true,
    restDisplacementThreshold: 100,
    restSpeedThreshold: 100,
  });
  // Pan Responders
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
      onPanResponderGrant: () => onPressIn.start(),
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -250) {
          goLeft.start(onDismiss);
        } else if (dx > 250) {
          goRight.start(onDismiss);
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    })
  ).current;
  // State
  const [index, setIndex] = useState(0);
  const onDismiss = () => {
    scale.setValue(1);
    setIndex((prev) => prev + 1);
    position.setValue(0);
  }
  const closePress = () => {
    goLeft.start(onDismiss);
  }
  const checkPress = () => {
    goRight.start(onDismiss);
  }
  if (!cleanedCoins) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1e272e",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }
  return (
    <Container>
      <CardContainer>
        <Card
          key={index + 1}
          style={{
            transform: [
              { scale: secondScale }
            ]
          }}>
          <Image
            key={index + 1}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginBottom: 10,
            }}
            source={{
              uri: `https://static.coinpaprika.com/coin/${cleanedCoins[index + 1]?.id}/logo.png`,
            }}
          />
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontWeight: "600",
              fontSize: 28,
            }}
          >
          {cleanedCoins[index + 1]?.name}
          </Text>
        </Card>
        <Card
          key={index}
          {...panResponder.panHandlers}
          style={{
            transform: [
              { scale },
              { translateX: position },
              { rotateZ: rotation },
            ],
          }}
        >
          <Image
            key={index + 1}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginBottom: 10,
            }}
            source={{
              uri: `https://static.coinpaprika.com/coin/${cleanedCoins[index]?.id}/logo.png`,
            }}
          />
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontWeight: "600",
              fontSize: 28,
            }}
          >
          {cleanedCoins[index]?.name}
          </Text>
        </Card>
      </CardContainer>
      <BtnContainer>
        <Btn onPress={closePress}>
          <Ionicons name="heart-dislike-outline" color="#fd79a8" size={58} />
        </Btn>
        <Btn onPress={checkPress}>
          <Ionicons name="heart-outline" color="#fd79a8" size={58} />
        </Btn>
      </BtnContainer>
    </Container>
  );
}

