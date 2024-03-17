import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { baseUrl, apiKey } from '../Api/moviesdb'

const LatestMovies = () => {
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchLatestMovie = async () => {
            try {
                const response = await axios.get(`${baseUrl}/movie/latest`, {
                    params: {
                        api_key: apiKey,
                        language: 'en-US',
                    },
                });
                setMovie(response.data);
            } catch (error) {
                console.error("Failed to fetch the latest movie:", error);
            }
        };

        fetchLatestMovie();
    }, []);

    if (!movie) {
        return <Text>Loading...</Text>; // Or any loading indicator you prefer
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.movieContainer}>
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                    style={styles.moviePoster}
                />
                <Text style={styles.title}>{movie.title}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    movieContainer: {
        alignItems: 'center',
        margin: 20,
    },
    moviePoster: {
        width: 300,
        height: 450,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    overview: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default LatestMovies;
