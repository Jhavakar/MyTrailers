import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, } from 'react-native';
import MovieCard from '../Components/MovieCard';
import SearchComponent from '../Components/SearchComponent';
import ModalPopUp from '../Components/FilterModal';
import axios from 'axios';
import { baseUrl, apiKey } from '../Api/moviesdb';

const Search = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [displayMovies, setDisplayMovies] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            if (!searchQuery) return; 
            try {
                const searchResponse = await axios.get(`${baseUrl}/search/movie`, {
                    params: { api_key: apiKey, query: searchQuery },
                });

                const movieDetailsPromises = searchResponse.data.results.map(movie =>
                    axios.get(`${baseUrl}/movie/${movie.id}`, {
                        params: {
                            api_key: apiKey,
                            language: 'en-US',
                            append_to_response: 'release_dates',
                        },
                    })
                );

                const movieDetailsResponses = await Promise.all(movieDetailsPromises);
                const detailedMovies = movieDetailsResponses.map(response => {
                    const movie = response.data;
                    const usReleaseDates = movie.release_dates.results.find(result => result.iso_3166_1 === 'US');
                    const certification = usReleaseDates ? usReleaseDates.release_dates[0].certification : 'Not Rated';
                    return {
                        ...movie,
                        certification, 
                        runtime: movie.runtime 
                    };
                });

                setMovies(detailedMovies); 
            } catch (error) {
                console.error("Failed to fetch movie details:", error);
            }
        };

        fetchMovies();
    }, [searchQuery]);


    useEffect(() => {
        let filtered = movies;

        // Apply Genre Filter
        if (selectedGenres.length > 0) {
            filtered = filtered.filter(movie =>
                movie.genres && movie.genres.some(genre => selectedGenres.includes(genre.id))
            );
        }
        

        // Apply Year Filter
        if (selectedYear) {
            filtered = filtered.filter(movie => {
                const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
                return releaseYear?.toString() === selectedYear;
            });
        }

        // Apply Language Filter
        if (selectedLanguage) {
            filtered = filtered.filter(movie =>
                movie.original_language === selectedLanguage
            );
        }

        setDisplayMovies(filtered);
    }, [movies, selectedGenres, selectedYear, selectedLanguage]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#333' }}>
            <View style={styles.container}>
                <SearchComponent
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onIconPress={() => setModalVisible(true)}
                    navigation={navigation}
                />
                <FlatList
                    data={displayMovies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <MovieCard movie={item} navigation={navigation} />}
                />
                <ModalPopUp
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    onConfirmGenreSelection={setSelectedGenres}
                    onConfirmYearSelection={setSelectedYear}
                    onConfirmLanguageSelection={setSelectedLanguage}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
    },
});

export default Search;
