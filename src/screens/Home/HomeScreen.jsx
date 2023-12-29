import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from '../../Auth/axios';
import { useIsFocused, useNavigation } from '@react-navigation/native';


const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [isLogout, setIsLogout] = useState(false)
  const baseUrl = "https://api.jikan.moe/v4";
  const isFocused = useIsFocused();

  useEffect(() => {
   if (searchQuery.length === 0 && isFocused) {
     fetchData()
   }
  }, [searchQuery, isFocused])

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [response1, response2, response3, favouriteData] = await Promise.all([
        fetch(`${baseUrl}/top/anime?filter=bypopularity`),
        fetch(`${baseUrl}/top/anime?filter=airing`),
        fetch(`${baseUrl}/top/anime?filter=upcoming`),
        axios.get(`/post/favourite`)
      ]);

      const [data1, data2, data3] = await Promise.all([
        response1.json(),
        response2.json(),
        response3.json()
      ]);
      const mergedData = [...data1.data, ...data2.data, ...data3.data];
      const res = await mergedData.map((item) => ({
        ...item,
        favourite: favouriteData.data.some((favItem) => Number(favItem.id) === item.mal_id)
      }));
      setData(res);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSarchData = async () => {
    setIsLoading(true);
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${searchQuery}&order_by=popularity&sort=asc&sfw`);
    const data = await response.json();
    setData(data.data)
    setIsLoading(false);
  }

  const handleLogout = async () => {
    await removeTokenFromStorage();
    navigation.navigate('Login');
  };

  const removeTokenFromStorage = async () => {
    try {
      await AsyncStorage.removeItem('token');
      console.log('Token removed from AsyncStorage');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };


  const renderHeaderRight = () => {
    return (
      <TouchableOpacity style={styles.headerRight} onPress={() => {setIsLogout(!isLogout) }}>
        <View style={styles.avatarContainer}>
        <Icon name="user" paddingHorizontal={10}  size={30} color="#900" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderUserProfile = () => {
    return (
      <View style={styles.profileContainer}>
        {userProfile ? (
          <Text>{`Welcome, ${userProfile.name}!`}</Text>
        ) : (
          <ActivityIndicator size="small" color="#0000ff" />
        )}
      </View>
    );
  };

  const renderDataCards = () => {

    const handleFavourite = async (anime, like) => {
      const resData = [...data];
      const updatedResData = resData.map((item) => {
        if (item.mal_id === anime.mal_id) {
          return { ...item, favourite: like ? true : false }
        }
        return item;
      })
      setData(updatedResData)

      const payload = {
        favourite: like,
        id: anime.mal_id
      }
      try {
        const response = await axios.post(`/post/create`, payload)
      } catch (error) {
        console.log(error);
      }
    }

    return (
      <View style={styles.cardsContainer}>
        {data.map((anime, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity>
              <Image source={{ uri: anime.images.jpg.large_image_url }} style={{ width: '100%', height: 160, objectFit: 'contain' }} />
            </TouchableOpacity>
            <View style={{ position: 'absolute', top: 7, right: 3 }}>
              {anime.favourite ? (
                <TouchableOpacity onPress={() => handleFavourite(anime, false)}>
                  <Icon name="heart" size={25} color="#900" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleFavourite(anime, true)}>
                 <Icon name="heart-o" size={25} color="#900" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            onSubmitEditing={handleSarchData}
          />
        </View>
        <View style={styles.avatarContainer}>
          {renderHeaderRight()}
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderDataCards()}
        </ScrollView>
      )}
      {isLogout && <Button title="Logout" onPress={handleLogout} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  profileContainer: {
    marginBottom: 10,
  },
  filterContainer: {
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  loader: {
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  searchBarContainer: {
    flex: 1,
    marginRight: 10,
    marginTop: 6
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    // overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerRight : {
    textAlign: 'center'
  }
});

export default HomeScreen;
