import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const DetailsScreen = ({ route, navigation }) => {
    const { id } = route.params;

    const [anime, setAnime] = useState({});
    const [characters, setCharacters] = useState([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        getAnime(id);
        getCharacters(id);
    }, []);

    const getAnime = async (animeId) => {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
            const data = await response.json();
            setAnime(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getCharacters = async (animeId) => {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
            const data = await response.json();
            setCharacters(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const { title, synopsis, trailer, duration, aired, season, images, rank, score, scored_by, popularity, status, rating, source } = anime;

    return (
        <ScrollView style={styles.container}>
             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.details}>
                <View style={styles.detailRow}>
                    <Image source={{ uri: images?.jpg.large_image_url }} style={styles.detailImage} />
                    <View style={styles.detailText}>
                        <Text style={styles.detailLine}><Text style={styles.detailTextBold}>Aired:</Text> {aired?.string}</Text>
                        <Text style={styles.detailLine}><Text style={styles.detailTextBold}>Rating:</Text> {rating}</Text>
                        <Text style={styles.detailLine}><Text style={styles.detailTextBold}>Rank:</Text> {rank}</Text>
                        <Text style={styles.detailLine}><Text style={styles.detailTextBold}>Score:</Text> {score}</Text>
                        <Text style={styles.detailLine}><Text style={styles.detailTextBold}>Scored By:</Text> {scored_by}</Text>
                        <Text style={styles.detailLine}><Text style={styles.detailTextBold}>Popularity:</Text> {popularity}</Text>
                        <Text style={styles.detailLine}><Text style={styles.detailTextBold}>Status:</Text> {status}</Text>
                        <Text style={styles.detailLine}><Text style={styles.detailTextBold}>Source:</Text> {source}</Text>
                        <Text style={styles.detailLine}><Text style={styles.detailTextBold}>Season:</Text> {season}</Text>
                        <Text style={styles.detailLine}><Text style={styles.detailTextBold}>Duration:</Text> {duration}</Text>
                    </View>

                </View>
                <Text style={styles.description}>{showMore ? synopsis : (synopsis?.substring(0, 450) + '...')}</Text>
                <TouchableOpacity onPress={() => setShowMore(!showMore)}>
                    <Text style={styles.readMoreButton}>{showMore ? 'Show Less' : 'Read More'}</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Trailer</Text>
            <View style={styles.trailerContainer}>
                {trailer?.embed_url ? (
                    <WebView
                        source={{ uri: trailer?.embed_url }}
                        style={styles.iframe}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        allowsFullscreenVideo={true}
                    />
                ) : (
                    <Text>Trailer not available</Text>
                )}
            </View>
            <Text style={styles.title}>Characters</Text>
            <ScrollView horizontal style={styles.charactersContainer}>
                {characters.map((character, index) => (
                    <TouchableOpacity key={index}>
                        <View style={styles.characterContainer}>
                            <Image source={{ uri: character.character.images?.jpg.image_url }} style={styles.characterImage} />
                            <Text style={styles.characterName}>{character.character.name}</Text>
                            <Text style={styles.characterRole}>{character.role}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEDED',
    },
    title: {
        fontSize: 22,
        marginBottom: 15,
        paddingLeft: 25,
        color: 'white',
        backgroundColor: '#A855F7',
        padding: 10,
        textAlign: 'center',
    },
    details: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        borderColor: '#e5e7eb',
        borderWidth: 5,
        margin: 20,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    detailImage: {
        width: 150,
        height: 200,
        borderRadius: 7,
    },
    detailText: {
        marginLeft: 20,
    },
    detailLine: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: 150
    },
    detailTextBold: {
        fontWeight: 'bold',
        color: '#454e56',
    },
    description: {
        color: '#6c7983',
        lineHeight: 20,
        marginBottom: 20,
    },
    readMoreButton: {
        color: '#27AE60',
        fontWeight: '600',
        fontSize: 16,
    },
    trailerContainer: {
        alignItems: 'center',
        margin: 20,
    },
    iframe: {
        width: 300,
        height: 200,
    },
    charactersContainer: {
        margin: 20,
    },
    characterContainer: {
        alignItems: 'center',
        marginRight: 20,
    },
    characterImage: {
        width: 150,
        height: 200,
        borderRadius: 7,
    },
    characterName: {
        color: '#454e56',
        padding: 5,
    },
    characterRole: {
        color: '#27AE60',
    },
    backButton: {
        position: 'absolute',
        top: -10,
        left: 8,
        zIndex: 10,
        padding: 5,
    },
    backButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 40,
    },
});

export default DetailsScreen;
