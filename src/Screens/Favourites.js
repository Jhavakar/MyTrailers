import React from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Text, Pressable } from 'react-native';
import MovieCard from '../Components/MovieCard';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Favourites = ({ navigation }) => {
    const favourites = useSelector(state => state.api.favourites);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#333' }}>
            <View>
                <View style={styles.headerContainer}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.iconContainer}>
                        <Icon name="chevron-left" size={24} color="#FFF" />
                    </Pressable>
                    <Text style={styles.title}>My Favourites</Text>
                </View>
                <FlatList
                    data={favourites}
                    keyExtractor={(item) => item.movieId.toString()}
                    renderItem={({ item }) => <MovieCard movie={item} />}
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

export default Favourites;