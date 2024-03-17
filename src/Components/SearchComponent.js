import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const SearchComponent = ({ searchQuery, setSearchQuery, onIconPress, navigation }) => {
    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()} style={styles.iconContainer}>
                <Icon name="chevron-left" size={24} color="#FFF" />
            </Pressable>
            <TextInput
                style={styles.input}
                placeholder="Search Trailers ..."
                placeholderTextColor="#CCC"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <Pressable onPress={onIconPress} style={styles.iconContainer}>
                <Icon name="sliders-h" size={20} style={styles.iconStyle} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderWidth: 0,
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#FFF',
        borderRadius: 20,

    },
    iconContainer: {
        padding: 8,
        marginRight: 10,
    },
    iconStyle: {
        padding: 10,
        backgroundColor: '#2196F3',
        color: '#FFF',
    },
});

export default SearchComponent;
