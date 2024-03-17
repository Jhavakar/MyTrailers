import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { addFavourite, removeFavourite } from '../store/apiSlice';

const MovieCard = ({ movie, navigation }) => {
    const { id, title, release_date, runtime, certification, poster_path } = movie;

    const dispatch = useDispatch();
    const favourites = useSelector(state => state.api.favourites);
    const isFavourite = favourites.some(favMovie => favMovie.movieId === movie.id);

    const toggleFavourite = () => {
        if (isFavourite) {
            dispatch(removeFavourite(movie.id));
        } else {
            dispatch(addFavourite({
                movieId: movie.id,
                ...movie
            }));
        }
    };

    return (
        <View style={styles.cardContainer}>
            <Pressable onPress={() => navigation.navigate('Movie', { movieId: id })} style={styles.pressableContainer}>
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${poster_path}` }}
                    style={styles.moviePoster}
                />
                <View style={styles.cardContent}>
                    <Text style={styles.movieTitle}>{title}</Text>
                    <Text style={styles.detailText}>Release Date: {new Date(release_date).getFullYear()}</Text>
                    <Text style={styles.detailText}>Runtime: {runtime ? `${runtime} mins` : 'Unknown'}</Text>
                    <Text style={styles.detailText}>Certification: {certification || 'Not Rated'}</Text>
                </View>
                <Pressable onPress={toggleFavourite} style={styles.favouriteButton}>
                    <Icon name="heart" size={24} color={isFavourite ? "red" : "lightblue"} />
                </Pressable>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: '#000',
        borderRadius: 15,
        overflow: 'hidden',
        alignItems: 'center',
        margin: 15,
    },
    pressableContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    cardContent: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    moviePoster: {
        width: 100,
        height: 150,
        resizeMode: 'cover',
    },
    movieTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#FFF',
    },
    detailText: {
        fontSize: 14,
        color: '#FFF',
    },
    favouriteButton: {
        padding: 10, 
    },
});

export default MovieCard;
