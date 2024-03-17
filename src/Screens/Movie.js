import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground, SafeAreaView, Pressable, } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { baseUrl, apiKey } from '../Api/moviesdb';
import DataTable from "../Components/DataTable";
import axios from 'axios';
import VideoPlayer from "../Components/VideoPlayer";
import { useDispatch, useSelector } from 'react-redux';
import { addFavourite, removeFavourite } from '../store/apiSlice';


const Movie = ({ route, navigation }) => {
    const { movieId } = route.params;
    const [movieDetails, setMovieDetails] = useState(null);
    const [certification, setCertification] = useState('');
    const [videoKey, setVideoKey] = useState(null);
    const [isMainVideoPlayerVisible, setIsMainVideoPlayerVisible] = useState(false);
    const [isVideoPlayerVisible, setIsVideoPlayerVisible] = useState(false);
    const [currentVideoKey, setCurrentVideoKey] = useState(null);


    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {

                const detailsResponse = await axios.get(`${baseUrl}/movie/${movieId}`, {
                    params: {
                        api_key: apiKey,
                        language: 'en-US',
                        append_to_response: 'credits,release_dates'
                    },
                });

                const releaseDates = detailsResponse.data.release_dates.results.find(result => result.iso_3166_1 === 'US');
                const certification = releaseDates ? releaseDates.release_dates.find(release => release.certification).certification : 'Not Rated';

                // Extract cast and directors from the credits
                const cast = detailsResponse.data.credits.cast;
                const directors = detailsResponse.data.credits.crew.filter(member => member.job === 'Director');

                // Update state with all necessary details
                setCertification(certification);
                setMovieDetails({
                    ...detailsResponse.data,
                    poster_path: `https://image.tmdb.org/t/p/w500${detailsResponse.data.poster_path}`,
                    cast: cast, 
                    directors: directors 
                });

            } catch (error) {
                console.error("Failed to fetch movie details:", error);
            }
        };

        const fetchVideoKey = async () => {
            try {
                const response = await axios.get(`${baseUrl}/movie/${movieId}/videos`, {
                    params: {
                        api_key: apiKey,
                        language: 'en-US',
                    },
                });
                const trailers = response.data.results.filter(video => video.type === 'Trailer');
                if (trailers.length > 0) {
                    setVideoKey(trailers[0].key); 
                }
            } catch (error) {
                console.error('Failed to fetch video key:', error);
            }
        };

        fetchMovieDetails();
        fetchVideoKey();
    }, [movieId]);

    const handleTrailerPress = (videoKey) => {
        setCurrentVideoKey(videoKey); 
        setIsMainVideoPlayerVisible(true); 
        setIsVideoPlayerVisible(false); 
        console.log("Video key:", videoKey);
    };

    const dispatch = useDispatch();
    const favourites = useSelector(state => state.api.favourites);
    const isFavourite = favourites.some(favMovie => favMovie.movieId === movieId);

    const toggleFavourite = () => {
        if (isFavourite) {
            dispatch(removeFavourite(movieId));
        } else {
            dispatch(addFavourite({
                movieId: movieId,
                ...movieDetails
            }));
        }
    };


    if (!movieDetails) {
        return <Text>Loading...</Text>;
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#333' }}>
            <View style={styles.headerContainer}>
                <Pressable onPress={() => navigation.goBack()} style={styles.iconContainer}>
                    <Icon name="chevron-left" size={24} color="#FFF" />
                </Pressable>
                <Pressable onPress={toggleFavourite} style={styles.favouriteButton}>
                    <Icon name="heart" size={24} color={isFavourite ? "red" : "lightblue"} />
                </Pressable>
            </View>
            <ScrollView style={styles.container}>
                {isMainVideoPlayerVisible ? (
                    <VideoPlayer videoKey={currentVideoKey || videoKey} />
                ) : (
                    <ImageBackground
                        source={{ uri: movieDetails.poster_path }}
                        style={styles.backgroundImage}
                        blurRadius={5}
                    >
                        <View style={styles.overlay}>
                            <View style={styles.movieImageContainer}>
                                <Image
                                    source={{ uri: movieDetails.poster_path }}
                                    style={styles.poster}
                                    resizeMode="cover"
                                />
                                <Pressable
                                    style={styles.playButton}
                                    onPress={() => setIsMainVideoPlayerVisible(true)}
                                    disabled={!videoKey}>
                                    <Icon name="play-circle" size={50} color="#FFF" />
                                </Pressable>
                            </View>
                        </View>
                    </ImageBackground>
                )}
                <View style={styles.tableContainer}>

                    <View style={styles.movieColumn}>
                        <Text style={styles.movieTitle}>{movieDetails.title}</Text>
                    </View>

                    <View style={styles.ageColumn}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailHeading}>Age</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailText}>{certification}</Text>
                        </View>
                    </View>

                    <View style={styles.column}>
                        <View style={styles.starRating}>
                            <Icon name="star" size={24} color="#FFD700" style={styles.iconStyle} />
                            <Text style={styles.detailHeading}>{parseFloat(movieDetails.vote_average).toFixed(1)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailHeading}>Duration</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailText}>{movieDetails.runtime} mins</Text>
                        </View>
                    </View>
                </View>

                <View>
                    <Text style={styles.genreDetail}>
                    {movieDetails.genres?.map(genre => genre.name).join('  ')}
                    </Text>
                </View>

                <DataTable movieId={movieId} onVideoSelect={handleTrailerPress} />
            </ScrollView>

            {isMainVideoPlayerVisible && (
                <View>
                    <VideoPlayer videoKey={videoKey} />
                </View>
            )}

        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    backgroundImage: {
        width: '100%',
        height: 300,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
    movieImageContainer: {
        width: '90%',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    poster: {
        width: 200,
        height: 300,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        position: 'absolute',
        alignItems: 'center',
    },
    playButton: {
        borderRadius: 30,
        alignItems: 'center',
        position: 'absolute',
        justifyContent: 'center',
    },
    movieTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    detailHeading: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFF',
    },
    detailText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#FFF',
    },
    genreDetail: {
        fontSize: 20,
        fontWeight: '400',
        color: '#FFF',
        paddingLeft: 20,
    },
    ratingCertificationRuntimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    favouriteButton: {
        position: 'absolute',
        top: 12,
        right: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    tableContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    column: {
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 20,
    },
    movieColumn: {
        flexDirection: 'column',
        width: '60%',
    },
    ageColumn: {
        marginTop: 20,
    },
    starRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconStyle: {
        paddingRight: 10,
    },
    iconContainer: {
        padding: 10,
    },
});


export default Movie;
