import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

// Calculate the height based on a 16:9 aspect ratio
const height = (width * 9) / 16;

const VideoPlayer = ({ videoKey }) => {

    return (
        <View style={styles.container}>
            <WebView
                style={{ width, height }} 
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{ uri: `https://www.youtube.com/embed/${videoKey}` }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default VideoPlayer;
