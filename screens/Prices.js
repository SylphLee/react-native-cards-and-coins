import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, Text, Image } from 'react-native';

export default function Prices() {
  const [tickers, setTickers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const getTickers = useCallback(
    () =>
      fetch('https://api.coinpaprika.com/v1/tickers')
        .then((response) => response.json())
        .then((json) => setTickers(json)),
    []
  );
  const onRefresh = async() => {
    setRefreshing(true);
    await getTickers();
    setRefreshing(false)
  };
  useEffect(() => {
    getTickers();
  }, [getTickers]);
  const cleanedTickers = tickers.filter(
    (ticker) => ticker.circulating_supply !== 0
  );
  return (
   <FlatList
      onRefresh={onRefresh}
      refreshing={refreshing}
      style={{
        flex: 1,
        backgroundColor: "#1e272e",
        paddingHorizontal: 10,
      }}
      data={cleanedTickers}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: 15,
            borderBottomWidth: 0.5,
            borderBottomColor: "rgba(255, 255, 255, 0.2)",
          }}
        />
      )}
      keyExtractor={(coin) => coin.symbol}
      renderItem={({ item }) => (
        <View
          style={{
            paddingTop: 15,
            borderRadius: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                marginRight: 10,
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
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                color: "white",
                marginBottom: 5,
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              ${item.quotes.USD.price.toFixed(2)}
            </Text>
            <Text
              style={{
                color: item.quotes.USD.percent_change_24h > 0 ? "green" : "red",
              }}
            >
              {item.quotes.USD.percent_change_24h > 0 ? "▲" : "▼"}{" "}
              {item.quotes.USD.percent_change_24h}%
            </Text>
          </View>
        </View>
      )}
    />
  );
}
