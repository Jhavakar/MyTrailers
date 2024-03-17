import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { baseUrl, apiKey } from '../Api/moviesdb';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1899 }, (_, index) => currentYear - index);

const ModalPopUp = ({ modalVisible, setModalVisible,
    onConfirmGenreSelection,
    onConfirmYearSelection,
    onConfirmLanguageSelection,
}) => {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);

    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const [genreVisible, setGenreVisible] = useState(false);
    const [yearVisible, setYearVisible] = useState(false);
    const [languageVisible, setLanguageVisible] = useState(false);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(`${baseUrl}/genre/movie/list`, {
                    params: { api_key: apiKey, language: 'en-US' },
                });
                setGenres(response.data.genres);
            } catch (error) {
                console.log("Error fetching genres:", error);
            }
        };

        const fetchLanguages = async () => {
            try {
                const response = await axios.get(`${baseUrl}/configuration/languages`, {
                    params: { api_key: apiKey },
                });
                setLanguages(response.data);
            } catch (error) {
                console.log("Error fetching languages:", error);
            }
        };

        fetchGenres();
        fetchLanguages();
    }, []);

    const toggleGenre = (genreId) => {
        setSelectedGenres((currentSelectedGenres) => {
            if (currentSelectedGenres.includes(genreId)) {
                return currentSelectedGenres.filter((id) => id !== genreId);
            } else {
                return [...currentSelectedGenres, genreId];
            }
        });
    };

    const handleConfirm = () => {
        // Pass the selected filters back to the parent component
        onConfirmGenreSelection(selectedGenres);
        onConfirmYearSelection(selectedYear);
        onConfirmLanguageSelection(selectedLanguage);
        setModalVisible(false);
    };

    const clearFilters = () => {
        // Reset filter states
        setSelectedGenres([]);
        setSelectedYear('');
        setSelectedLanguage('');

    };

    const collapseAllSections = () => {
        setGenreVisible(false);
        setYearVisible(false);
        setLanguageVisible(false);
    };

    const handleClose = () => {
        collapseAllSections();
        setModalVisible(!modalVisible);
    };

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filter</Text>
                            <Pressable onPress={handleClose}>
                                <Icon name="times" size={24} color="#FFF" />
                            </Pressable>
                        </View>

                        {/* Filter Options */}

                        <View >
                            <Pressable style={styles.filterOption} onPress={() => setGenreVisible(!genreVisible)}>
                                <Text style={styles.optionText}>Genre</Text>
                                <Icon name={genreVisible ? "minus" : "plus"} size={14} color="#FFF" />
                            </Pressable>

                            {genreVisible && (
                                <View style={styles.genreContainer}>
                                    {genres.map((genre) => (
                                        <Pressable
                                            key={genre.id}
                                            style={[
                                                styles.genreButton,
                                                selectedGenres.includes(genre.id) ? styles.genreButtonSelected : {},
                                            ]}
                                            onPress={() => toggleGenre(genre.id)}
                                        >
                                            <Text style={[
                                                styles.genreButtonText,
                                                selectedGenres.includes(genre.id) ? styles.genreButtonTextSelected : {},
                                            ]}>
                                                {genre.name}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            )}

                            <Pressable style={styles.filterOption} onPress={() => setYearVisible(!yearVisible)}>
                                <Text style={styles.optionText}>Year</Text>
                                <Icon name={yearVisible ? "minus" : "plus"} size={14} color="#FFF" />
                            </Pressable>

                            {yearVisible && (
                                <Picker
                                    selectedValue={selectedYear}
                                    onValueChange={(itemValue) => setSelectedYear(itemValue)}>
                                    <Picker.Item label="Select" value="" />
                                    {years.map((year) => (
                                        <Picker.Item key={year} label={year.toString()} value={year.toString()} />
                                    ))}
                                </Picker>
                            )}

                            <Pressable style={styles.filterOption} onPress={() => setLanguageVisible(!languageVisible)}>
                                <Text style={styles.optionText}>Language</Text>
                                <Icon name={languageVisible ? "minus" : "plus"} size={14} color="#FFF" />
                            </Pressable>

                            {languageVisible && (
                                <Picker
                                    selectedValue={selectedLanguage}
                                    onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
                                >
                                    {languages.sort((a, b) => a.english_name.localeCompare(b.english_name)).map((language, index) => (
                                        <Picker.Item key={index} label={language.english_name} value={language.iso_639_1} />
                                    ))}
                                </Picker>
                            )}

                        </View>

                        <View style={styles.buttonsRow}>
                            <Pressable onPress={clearFilters}>
                                <Text style={styles.clearButtonText}>Clear Filters</Text>
                            </Pressable>

                            <Pressable style={styles.confirmButton} onPress={handleConfirm}>
                                <Text style={styles.confirmButtonText}>Confirm</Text>
                            </Pressable>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: '#333',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#FFF'
    },
    filterOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderTopWidth: 2,
        borderTopColor: '#e1e1e1',
    },
    optionText: {
        fontSize: 16,
        color: '#FFF'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    confirmButton: {
        marginTop: 20,
        backgroundColor: '#007AFF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: '100%',
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    clearButtonText: {
        marginTop: 40,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    genreButton: {
        backgroundColor: '#d3d3d3', 
        padding: 8,
        margin: 2,
        width: '40%', 
        alignItems: 'center',
        borderRadius: 25,
        color: '#000', 
    },
    genreButtonSelected: {
        backgroundColor: '#007AFF',
    },
    genreButtonText: {
        color: '#000', 
        textAlign: 'center',
    },
    genreButtonTextSelected: {
        color: '#FFF',
        textAlign: 'center',
    },
    buttonsRow: {
        flexDirection: 'column',
    },
});

export default ModalPopUp;
