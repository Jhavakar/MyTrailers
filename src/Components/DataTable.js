import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import VideoPlayer from '../Components/VideoPlayer';
import { baseUrl, apiKey } from '../Api/moviesdb';
import axios from 'axios';

const DataTable = ({ movieId, onVideoSelect }) => {
    const [selectedHeader, setSelectedHeader] = useState('detail');
    const [movieDetails, setMovieDetails] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isVideoPlayerVisible, setIsVideoPlayerVisible] = useState(false);


    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const detailsResponse = await axios.get(`${baseUrl}/movie/${movieId}`, {
                    params: {
                        api_key: apiKey,
                        append_to_response: 'credits,release_dates'
                    }
                });

                // Extract cast and directors from the credits
                const cast = detailsResponse.data.credits.cast;
                const directors = detailsResponse.data.credits.crew.filter(member => member.job === 'Director');

                setMovieDetails({
                    ...detailsResponse.data,
                    poster_path: `https://image.tmdb.org/t/p/w500${detailsResponse.data.poster_path}`,
                    cast: cast,
                    directors: directors
                });

            } catch (error) {
                console.error('Failed to fetch movie details:', error);
            }
        };

        const fetchVideos = async () => {
            try {
                const response = await axios.get(`${baseUrl}/movie/${movieId}/videos`, {
                    params: { api_key: apiKey },
                });
                // Filter for official trailers and teasers only
                const filteredVideos = response.data.results.filter(video =>
                    (video.type === 'Trailer' || video.type === 'Teaser') &&
                    video.name.includes('Official')
                );

                setVideos(filteredVideos); // Store filtered videos
            } catch (error) {
                console.error('Failed to fetch videos:', error);
            }
        };

        fetchMovieDetails();
        fetchVideos();
    }, [movieId]);

    const getYouTubeThumbnail = (videoId) => {
        return `https://img.youtube.com/vi/${videoId}/0.jpg`;
    };


    return (
        <View style={styles.container}>
            <View style={styles.tableHeader}>
                <Pressable
                    style={[styles.headerItem, selectedHeader === 'detail' ? styles.selectedHeader : null]}
                    onPress={() => { setSelectedHeader('detail'); setIsVideoPlayerVisible(false); }}>
                    <Text style={selectedHeader === 'detail' ? styles.selectedHeaderText : styles.selectedHeaderText}>Detail</Text>
                </Pressable>
                <Pressable
                    style={[styles.headerItem, selectedHeader === 'videos' ? styles.selectedHeader : null]}
                    onPress={() => setSelectedHeader('videos')}>
                    <Text style={selectedHeader === 'videos' ? styles.selectedHeaderText : styles.selectedHeaderText}>Videos</Text>
                </Pressable>
            </View>
            {movieDetails && (
                <View style={styles.row}>
                    {/* Toggle display based on selectedHeader */}
                    {selectedHeader === 'detail' && (
                        <>
                            {movieDetails && (
                                <View>
                                    <Text style={styles.sectionTitle}>Synopsis</Text>
                                    {movieDetails.overview ? (
                                        <Text style={styles.description}>{movieDetails.overview}</Text>
                                    ) : (
                                        <Text style={styles.errorMessage}>No synopsis available.</Text>
                                    )}

                                    <Text style={styles.sectionTitle}>Cast</Text>
                                    {movieDetails.cast.length > 0 ? (
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            {movieDetails.cast.map((cast) => (
                                                cast.profile_path && (
                                                    <View style={styles.castMember} key={cast.id}>
                                                        <Image
                                                            source={{ uri: `https://image.tmdb.org/t/p/w500${cast.profile_path}` }}
                                                            style={styles.castPhoto}
                                                        />
                                                        <Text style={styles.castName}>{cast.name}</Text>
                                                    </View>
                                                )
                                            ))}
                                        </ScrollView>
                                    ) : (
                                        <Text style={styles.errorMessage}>No cast information available.</Text>
                                    )}

                                    <Text style={styles.sectionTitle}>Director</Text>
                                    {movieDetails.directors && movieDetails.directors.length > 0 ? (
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            {movieDetails.directors.map((director) => (
                                                director.profile_path && (
                                                    <View style={styles.directorMember} key={director.id}>
                                                        <Image
                                                            source={{ uri: `https://image.tmdb.org/t/p/w500${director.profile_path}` }}
                                                            style={styles.directorPhoto}
                                                        />
                                                        <Text style={styles.directorName}>{director.name}</Text>
                                                    </View>
                                                )
                                            ))}
                                        </ScrollView>
                                    ) : (
                                        <Text style={styles.errorMessage}>No director information available.</Text>
                                    )}
                                </View>
                            )}
                        </>
                    )}

                    {selectedHeader === 'videos' && (
                        <View style={styles.videosContainer}>
                            {videos.length > 0 ? (
                                videos.map((item) => (
                                    <Pressable
                                        key={item.id.toString()}
                                        onPress={() => onVideoSelect(item.key)}
                                        style={styles.trailerItem}
                                    >
                                        <Image
                                            style={styles.trailerImage}
                                            source={{ uri: getYouTubeThumbnail(item.key) }}
                                        />
                                        <Text style={styles.trailerTitle}>{item.name}</Text>
                                    </Pressable>
                                ))
                            ) : (
                                <Text style={styles.errorMessage}>No videos available.</Text>
                            )}
                        </View>
                    )}


                    {isVideoPlayerVisible && (
                        <View style={styles.videoPlayerOverlay}>
                            <VideoPlayer />
                            <Pressable
                                style={styles.closeButton}
                                onPress={() => setIsVideoPlayerVisible(false)}
                            >
                                <Icon name='close' size={30} color='#FFF' />
                            </Pressable>
                        </View>
                    )}

                </View>
            )}
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    headerItem: {
        padding: 10,
    },
    selectedHeaderText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '600',
    },
    selectedHeader: {
        borderBottomWidth: 2,
        borderBottomColor: '#007bff',
    },
    tableContent: {
        width: '100%',
    },
    description: {
        color: '#FFF',
        paddingLeft: 10,
        paddingBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    buttonContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cell: {
        textAlign: 'center',
        width: '50%',
    },
    castName: {
        color: '#FFF',
        fontSize: 16,
        width: '80%'
    },
    castMember: {
        color: '#FFF',
        alignItems: 'center',
        marginLeft: 10,
        marginBottom: 10,
    },
    castPhoto: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 24,
        paddingLeft: 10,
        paddingBottom: 10,
    },
    directorName: {
        color: '#FFF',
        fontSize: 16,
        width: '80%'

    },
    directorPhoto: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginLeft: 10,
    },
    directorMember: {
        color: '#FFF',
        alignItems: 'center',
        marginLeft: 10,
        marginBottom: 10,
    },
    videoTitle: {
        padding: 10,
        fontSize: 16,
        color: '#FFF',
    },
    trailerItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    trailerThumbnail: {
        width: 100,
        height: 56,
        borderRadius: 4,
        marginRight: 10,
    },
    trailerTitleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    videoPlayerOverlay: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    closeButton: {
        position: 'absolute',
        top: 30,
        right: 30,
    },
    videosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
    },
    trailerItem: {
        width: '48%',
        marginBottom: 20,
    },
    trailerImage: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 8,
    },
    trailerTitle: {
        textAlign: 'center',
        marginTop: 8,
        color: '#FFF',
    },
    errorMessage: {
        color: '#FFF',
        fontSize: 20,
        padding: 10,
        textAlign: 'center',
    },
});

export default DataTable;
