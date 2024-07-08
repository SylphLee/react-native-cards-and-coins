import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, Text, Image } from 'react-native';
import * as WebBrowser from "expo-web-browser";

export default function News() {
  const [news, setNews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const getNews = useCallback(
    () =>
      fetch(
        'https://hn.algolia.com/api/v1/search_by_date?query=cryptocurrency&tags=story&numericFilters=points>20'
      )
        .then((response) => response.json())
        .then((json) => setNews(json)),
    []
  );
  console.log(getNews);
  const onRefresh = async () => {
    setRefreshing(true);
    await getNews();
    setRefreshing(false);
  };
  useEffect(() => {
    getNews();
    
  }, [getNews]);
  const openLink = async (url:string) => {
    const baseUrl = url;
    // await Linking.openURL(baseUrl);
    await WebBrowser.openBrowserAsync(baseUrl);
  }
  return (
    <FlatList
      onRefresh={onRefresh}
      refreshing={refreshing}
      style={{
        flex: 1,
        backgroundColor: '#1e272e',
        paddingHorizontal: 10,
      }}
      data={news.hits}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: 15,
            borderBottomWidth: 0.5,
            borderBottomColor: 'rgba(255, 255, 255, 0.2)',
          }}
        />
      )}
      keyExtractor={(news) => news.hits}
      renderItem={({ item }) => (        
        <View
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",            
            borderRadius: 5,            
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 15,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'left' }}>
            <Text
              style={{
                textAlign: 'left',
                color: 'white',
                fontWeight: '600',
              }}>
              {item.title}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{
                textAlign: 'left',
                color: 'white',
                fontWeight: '600',
                marginTop: 20,
              }}>
              <Text style={{
                color: 'white'
              }}>
              👍{item.points}  💬{item.num_comments}
              </Text>  
            </View>
            <View style={{
                textAlign: 'left',
                color: 'white',
                fontWeight: '600',
                marginTop: 20,
                left: 120,
              }}>
              <Text 
                key={item.key} 
                onPress={() => openLink(item.url)}
                style={{
                color: '#fd79a8'
              }}>
              Read👉
              </Text>  
            </View>                      
          </View>
        </View>
      )}
    />
  );
}
