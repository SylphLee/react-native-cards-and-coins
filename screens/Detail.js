import React, { useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Dimensions, TouchableOpacity, Share, Platform } from "react-native";
import { useQuery } from "react-query";
import * as WebBrowser from "expo-web-browser";
import { getDetail } from "../api";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("screen");

const ScrollView = styled.ScrollView`
  flex: 1;
  background-color: #1e272e;
  padding: 0px 10px;
`;
const Header = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Image = styled.Image`
  height: 30px;
  width: 30px;
  margin-right: 10px;
  border-radius: 15px;
`;
const Title = styled.Text`
  color: #fd79a8;
  font-size: 18px;
  font-weight: 600;
`;
const SectionTitle = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 10px;
  margin-top: 25px;
`;
const Text = styled.Text`
  color: white;
`;
const Link = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0px;
  border-bottom-width: 1px;
  border-style: solid;
  border-bottom-color: rgba(255, 255, 255, 0.15);
`;
const LinkName = styled.Text`
  text-transform: capitalize;
  color: white;
  font-weight: 500;
  font-size: 16px;
`;

export default function Detail() {  
  const route = useRoute();
  const navigation = useNavigation();
  const { data, isLoading } = useQuery(["coins", route.params["id"]], () =>
    getDetail(route.params["id"])    
  );  
  const onShare = async () => {
    const isAndroid = Platform.OS === "android";
    const homepage = data.links["website"][0];
    try {
      if (isAndroid) {
        await Share.share({
          message: homepage,
          title: route.params["name"],
        });
      } else {
        await Share.share({
          url: homepage,
          title: route.params["name"],
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Header>
          <Image
            source={{
              uri: `https://static.coinpaprika.com/coin/${route.params[
                "id"
              ]}/logo.png`,
            }}
          />
          <Title>{route.params["name"]}</Title>
        </Header>
      ),
    });
  }, []);
  useEffect(() => {
    if (!data) return;
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onShare}>
          <Ionicons name="share-outline" color="white" size={24} />
        </TouchableOpacity>
      ),
    });
  }, [data]);
  const openLink = async (link) => {
    await WebBrowser.openBrowserAsync(link);
  };
  return (
    <ScrollView style={{ flex: 1 }}>
      <SectionTitle>About {route.params["name"]}</SectionTitle>
      <Text>{data?.description}</Text>
      <SectionTitle>Links</SectionTitle>
      {data?.links_extended.map((link, index) => (
        <Link key={index}>
          <TouchableOpacity
            onPress={() => openLink(link.url)}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <LinkName>{link.type.replace("_", " ")}</LinkName>            
            <Ionicons name="arrow-redo-outline" color="white" size={14} />
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  );
}
