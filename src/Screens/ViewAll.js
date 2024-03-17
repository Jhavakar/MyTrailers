import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, SafeAreaView, Pressable } from 'react-native';
import axios from 'axios';
import { baseUrl, apiKey } from '../Api/moviesdb'
import MovieCard from '../Components/MovieCard';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ViewAll = ({ route, navigation }) => {
  const { category } = route.params;
  const [movies, setMovies] = useState([]);

  const getTitleFromCategoryType = (type) => {
    switch(type) {
      case 'popular':
        return "What's Popular";
      case 'upcoming':
        return 'Upcoming';
      case 'now_playing':
        return 'Now Playing';
      default:
        return 'Category';
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      let url = '';
      switch(category.type) {
        case 'popular':
          url = `${baseUrl}/movie/popular`;
          break;
        case 'upcoming':
          url = `${baseUrl}/movie/upcoming`;
          break;
        case 'now_playing':
          url = `${baseUrl}/movie/now_playing`;
          break;
        default:
          console.log('Unknown category');
      }

      if(url) {
        try {
          const response = await axios.get(url, {
            params: {
              api_key: apiKey,
              language: 'en-US',
              page: 1,
            },
          });
          setMovies(response.data.results);
        } catch (error) {
          console.error("Failed to fetch movies:", error);
        }
      }
    };

    fetchMovies();
  }, [category]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#333'}}>
    <ScrollView style={styles.container}>
    <View style={styles.headerContainer}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconContainer}>
          <Icon name="chevron-left" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.title}>{getTitleFromCategoryType(category.type)}</Text>

      </View>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} navigation={navigation} />
      ))}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 20,
  },
  title: {
    fontSize: 36,
      color: '#FFF',
      fontWeight: '600',
      paddingLeft: 10,
  },
  iconContainer: {
    padding: 10,
  },
});

export default ViewAll;
