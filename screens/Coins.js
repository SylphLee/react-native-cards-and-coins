import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";

export default function Coins() {
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
    .filter((coin) => coin.rank !== 0)
    .filter((coin) => coin.is_active === true)
    .slice(0, 100);
  const navigation = useNavigation();
  return (
    <FlatList
      onRefresh={onRefresh}
      refreshing={refreshing}
      style={{
        flex: 1,
        backgroundColor: "#1e272e",
        paddingHorizontal: 10,
      }}
      data={cleanedCoins}
      ItemSeparatorComponent={() => <View style={{ height: 10, width: 10 }} />}
      columnWrapperStyle={{
        justifyContent: "space-between",
      }}
      numColumns={3}
      keyExtractor={(coin) => coin.symbol}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Detail", {
              id: item.id,
              name: item.name,
              symbol: item.symbol,
            })
          }
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: 20,
            borderRadius: 5,
            alignItems: "center",
            flex: 0.31,
          }}
        >
          <Image
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginBottom: 10,
            }}
            source={{
              uri: `https://static.coinpaprika.com/coin/${item.id}/logo.png`,
            }}
          />
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontWeight: "600",
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}