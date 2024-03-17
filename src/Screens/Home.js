import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Dimensions, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { baseUrl, apiKey } from '../Api/moviesdb';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase-config";
import { useAuth } from '../Auth/AuthProvider';
import { Button } from 'react-native-paper';


const Home = ({ navigation }) => {
    const { currentUser } = useAuth();
    const [userDetails, setUserDetails] = useState(null);
    const [popularMovies, setPopularMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [latestMovie, setLatestMovie] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollViewRef = useRef();
    const [popoverVisible, setPopoverVisible] = useState(false);
    const iconRef = useRef(null);

    const { width } = Dimensions.get('window');

    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                const popularMoviesResponse = await axios.get(`${baseUrl}/movie/popular`, {
                    params: {
                        api_key: apiKey,
                        language: 'en-US',
                        page: 1,
                    },
                });
                setPopularMovies(popularMoviesResponse.data.results);
            } catch (error) {
                console.error("Failed to fetch popular movies:", error);
            }
        };

        const fetchUpcomingMovies = async () => {
            try {
                const upcomingMoviesResponse = await axios.get(`${baseUrl}/movie/upcoming`, {
                    params: {
                        api_key: apiKey,
                        language: 'en-US',
                        page: 1,
                    },
                });
                setUpcomingMovies(upcomingMoviesResponse.data.results);
            } catch (error) {
                console.error("Failed to fetch upcoming movies:", error);
            }
        };

        const fetchNowPlayingMovies = async () => {
            try {
                const nowPlayingMoviesResponse = await axios.get(`${baseUrl}/movie/now_playing`, {
                    params: {
                        api_key: apiKey,
                        language: 'en-US',
                        page: 1,
                    },
                });
                setNowPlayingMovies(nowPlayingMoviesResponse.data.results);
            } catch (error) {
                console.error("Failed to fetch upcoming movies:", error);
            }
        };

        const fetchLatestMovie = async () => {
            try {
                const response = await axios.get(`${baseUrl}/movie/latest`, {
                    params: {
                        api_key: apiKey,
                        language: 'en-US',
                    },
                });
                setLatestMovie(response.data);
            } catch (error) {
                console.error("Failed to fetch the latest movie:", error);
            }
        };

        fetchPopularMovies();
        fetchUpcomingMovies();
        fetchNowPlayingMovies();
        fetchLatestMovie();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex === 3) {
                nextIndex = 0;
            }
            setCurrentIndex(nextIndex);

            scrollViewRef.current?.scrollTo({
                x: width * nextIndex,
                animated: true,
            });

        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [currentIndex]);

    useEffect(() => {
        const fetchUserData = async () => {

          if (currentUser && currentUser.uid) {
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserDetails(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            }
        };

        fetchUserData();
    }, [currentUser]);

    const togglePopover = () => {
        iconRef.current.measure(() => {
            setPopoverVisible(!popoverVisible);
        });
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };


    const displayPopularMovies = popularMovies.slice(0, 5); // Limit to 5 movies
    const displayUpcomingMovies = upcomingMovies.slice(0, 5); // Limit to 5 movies
    const displayNowPlayingMovies = nowPlayingMovies.slice(0, 5); // Limit to 5 movies


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>MYTRAILER</Text>
                <Icon name="search" size={25} color="#FFF" style={styles.icon} onPress={() => navigation.navigate('Search')} />
                <Pressable ref={iconRef} onPress={togglePopover}>
                    <Icon name="notifications" style={styles.icon} size={25} color="#FFF" />
                </Pressable>
            </View>

            <ScrollView>
                <Pressable ref={iconRef} onPress={togglePopover}>
                </Pressable>

                <Modal
                    animationType="none"
                    transparent={true}
                    visible={popoverVisible}
                    onRequestClose={() => setPopoverVisible(false)}
                >
                    <Pressable style={StyleSheet.absoluteFill} onPress={() => setPopoverVisible(false)}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView} onStartShouldSetResponder={() => true}>
                                {latestMovie && (
                                    <Pressable
                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                        onPress={() => {
                                            setPopoverVisible(false)
                                            setTimeout(() => {
                                                navigation.navigate('Movie', { movieId: latestMovie.id });
                                            }, 20);
                                        }}
                                    >
                                        <Image
                                            source={{ uri: `https://image.tmdb.org/t/p/w500${latestMovie.poster_path}` }}
                                            style={styles.movieIcon}
                                        />
                                        <Text style={{ color: '#FFF' }}>{latestMovie.title}</Text>
                                    </Pressable>
                                )}
                            </View>
                        </View>
                    </Pressable>
                </Modal>

                <Text style={styles.greeting}>{`${getGreeting()}, ${userDetails?.firstName || 'Guest'}`}</Text>

                <ScrollView
                    horizontal
                    ref={scrollViewRef}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    style={styles.movieScroll}
                >
                    {displayNowPlayingMovies.slice(0, 3).map((movie) => (
                        <View key={movie.id} style={styles.movieContainer}>
                            <Pressable onPress={() => navigation.navigate('Movie', { movieId: movie.id })}>
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                                    style={styles.largeMoviePoster}
                                />
                            </Pressable>
                        </View>
                    ))}
                </ScrollView>


                <View style={styles.section}>
                    <View style={styles.sectionHeading}>
                        <Text style={styles.sectionTitle}>What's Popular</Text>
                        <Pressable onPress={() => navigation.navigate('ViewAll', { category: { type: 'popular' } })}>
                            <Text style={styles.ViewAllButtonText}>View All</Text>
                        </Pressable>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.movieScroll}>
                        {displayPopularMovies.map((movie) => (
                            <Pressable
                                key={movie.id}
                                onPress={() => navigation.navigate('Movie', { movieId: movie.id })}
                            >
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                                    style={styles.moviePoster}
                                />
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>


                <View style={styles.section}>
                    <View style={styles.sectionHeading}>
                        <Text style={styles.sectionTitle}>Upcoming</Text>
                        <Pressable onPress={() => navigation.navigate('ViewAll', { category: { type: 'upcoming' } })}>
                            <Text style={styles.ViewAllButtonText}>View All</Text>
                        </Pressable>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.movieScroll}>
                        {displayUpcomingMovies.map((movie) => (
                            <Pressable
                                key={movie.id}
                                onPress={() => navigation.navigate('Movie', { movieId: movie.id })}
                            >
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                                    style={styles.movieIconPoster}
                                />
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeading}>
                        <Text style={styles.sectionTitle}>Now Playing</Text>
                        <Pressable onPress={() => navigation.navigate('ViewAll', { category: { type: 'now_playing' } })}>
                            <Text style={styles.ViewAllButtonText}>View All</Text>
                        </Pressable>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.movieScroll}>
                        {displayNowPlayingMovies.map((movie) => (
                            <Pressable
                                key={movie.id}
                                onPress={() => navigation.navigate('Movie', { movieId: movie.id })}
                            >
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                                    style={styles.moviePoster}
                                />
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 36,
        color: '#2196F3',
        fontWeight: 'bold',
        marginRight: 'auto',
        marginTop: 20,
    },
    icon: {
        padding: 15,
        marginTop: 10,
    },
    greeting: {
        color: '#FFF',
        fontSize: 32,
        paddingLeft: 20,
        paddingBottom: 20,
    },
    section: {
        marginTop: 20,
    },
    sectionHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 28,
        color: '#FFF',
        paddingLeft: 20,
        fontWeight: 'bold',
    },
    movieScroll: {
        paddingLeft: 15,
    },
    moviePoster: {
        width: 120,
        height: 180,
        borderRadius: 10,
        marginRight: 10,
    },
    movieIconPoster: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    largeMoviePoster: {
        width: 400,
        height: 300,
        borderRadius: 10,
        marginRight: 10,
    },
    ViewAllButtonText: {
        color: '#007AFF',
        fontSize: 16,
        marginRight: 20
    },
    image: {
        width: 400,
        height: 260,
        borderRadius: 10,
        marginRight: 10,
    },
    centeredView: {
        flex: 1,
        left: 130,
        top: 60,
    },
    modalView: {
        margin: 20,
        backgroundColor: "#1E1E1E",
        borderRadius: 20,
        padding: 15,
        width: 250,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    movieIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
});

export default Home;
