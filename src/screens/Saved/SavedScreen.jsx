import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image, StyleSheet } from 'react-native';
import axios from '../../Auth/axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';

const SavedScreen = () => {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = "https://api.jikan.moe/v4";
  const isFocused = useIsFocused();

  useEffect(() => {
      fetchData()
  }, []);
  
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

      const filteredArray = await mergedData.filter(obj2 => {
        return favouriteData.data.some(obj1 => Number(obj1.id) === obj2.mal_id);
    });
    
    const updatedArray = await filteredArray.map(item => ({
        ...item,
        favourite: true
    }));
    
       setData(updatedArray);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };




  const renderDataCards = () => {

    const handleFavourite = async (Aniload, like) => {
      const resData = [...data];
      const updatedResData = resData.map((item) => {
        if (item.mal_id === Aniload.mal_id) {
          return { ...item, favourite: like ? true : false }
        }
        return item;
      })
      setData(updatedResData)
      
      const payload = {
        favourite: like,
        id: Aniload.mal_id
      }
      try {
        const response = await axios.post(`/post/create`, payload)
        if (response.status === 200) {
          fetchData()
        }
        
      } catch (error) {
        console.log(error);
      }
    }

    return (
      <View style={styles.cardsContainer}>
        {data.map((Aniload, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity>
              <Image source={{ uri: Aniload.images.jpg.large_image_url }} style={{ width: '100%', height: 160, objectFit: 'contain' }} />
            </TouchableOpacity>
            <View style={{ position: 'absolute', top: 7, right: 3 }}>
            {Aniload.favourite ? (
                <TouchableOpacity onPress={() => handleFavourite(Aniload, false)}>
                  <Icon name="heart" size={25} color="#900" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleFavourite(Aniload, true)}>
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
    <View>
       {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderDataCards()}
        </ScrollView>
      )}
    </View>
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
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default SavedScreen;
