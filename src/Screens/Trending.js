import React, { useState, useEffect } from 'react';
import { baseUrl, apiKey } from '../Api/moviesdb'
import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView } from 'react-native';
import axios from 'axios'; 
import MovieCard from '../Components/MovieCard';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Trending = ({ navigation }) => {
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);


    useEffect(() => {
        const fetchNowPlayingMovies = async () => {
            try {
                const nowPlayingMoviesResponse = await axios.get(`${baseUrl}/movie/now_playing`, {
                    params: {
                        api_key: apiKey,
                        language: 'en-US',
                        page: 1,
                    },
                });

                const detailPromises = nowPlayingMoviesResponse.data.results.map((movie) =>
                    axios.get(`${baseUrl}/movie/${movie.id}`, {
                        params: {
                            api_key: apiKey,
                            language: 'en-US',
                            append_to_response: 'release_dates',
                        },
                    })
                );

                const detailsResponses = await Promise.all(detailPromises);

                const moviesWithDetails = detailsResponses.map((response) => {
                    const movieData = response.data;
                    const usReleaseDates = movieData.release_dates.results.find((result) => result.iso_3166_1 === 'US');
                    const certification = usReleaseDates ? usReleaseDates.release_dates[0].certification : 'Not Rated';
                    return {
                        ...movieData,
                        certification,
                    };
                });

                setNowPlayingMovies(moviesWithDetails);
            } catch (error) {
                console.error("Failed to fetch movie details:", error);
            }
        };

        fetchNowPlayingMovies();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#333' }}>
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.iconContainer}>
                        <Icon name="chevron-left" size={24} color="#FFF" />
                    </Pressable>
                    <Text style={styles.title}>What's Trending</Text>
                </View>
                <View>
                    <ScrollView vertical showsHorizontalScrollIndicator={false} style={styles.movieScroll}>
                        {nowPlayingMovies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} navigation={navigation} />
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
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

export default Trending;
