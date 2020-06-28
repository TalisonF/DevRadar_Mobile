import React, { useEffect, useState } from "react";
import { StyleSheet, PermissionsAndroid, Platform, Image, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { TextInput } from "react-native-gesture-handler";
import { Icon } from 'react-native-elements'
import api from "../services/api"

export default Main = ({ navigation }) => {

    const [devs, setDevs] = useState([])
    const [currentRegion, setCurrenteRegion] = useState(null)
    const [techs, setTechs] = useState("")

    useEffect(() => {
        async function loadInitialPosition() {
            requestLocationPermission();
            Geolocation.getCurrentPosition(({ coords }) => {
                setCurrenteRegion({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04
                })
            }
            )
        }

        loadInitialPosition();
    }, [])

    async function requestLocationPermission() {
        if (Platform.OS === 'ios') return;
        const chckLocationPermission = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (chckLocationPermission === PermissionsAndroid.RESULTS.GRANTED) {

        } else {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'Permitir o acesso a localização atual.',
                        'message': 'Para encontrarmos os parceiros próximos a você é necessário ativar a localização.'
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                } else {
                    alert("Para esta função e necessário ativar a localização");
                }
            } catch (err) {
                alert(err)
            }
        }
    };

    async function loadDevs() {
        const { latitude, longitude } = currentRegion;

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs,
            }
        });
        setDevs(response.data)
    }

    function handleRegionChanged(region) {
        setCurrenteRegion(region)
    }

    if (!currentRegion) {
        return null;
    }
    return (
        <>
            <MapView
                onRegionChangeComplete={handleRegionChanged}
                initialRegion={currentRegion}
                showsUserLocation={true}
                style={styles.map}
            >
                {devs.map(dev => (
                    <Marker 
                        key={dev.id} 
                        coordinate={{ 
                                latitude: dev.latitude, 
                                longitude: dev.longitude
                            }}
                        >
                        <Image 
                            style={styles.avatar} 
                            source={{ uri: dev.avatar_url }} 
                        />
                        <Callout onPress={() => {
                            navigation.navigate('Profile', { github_username: dev.github_username })
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio} >{dev.bio}</Text>
                                <Text style={styles.devTechs}>{JSON.parse(dev.techs).join(", ")}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}

            </MapView>
            <View style={styles.searchForm}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar devs por techs..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    value={techs}
                    onChangeText={setTechs}

                />
                <TouchableOpacity style={styles.loadButton} onPress={loadDevs}>
                    <Icon name='my-location' type="material" size={20} color='#fff' />
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: "#FFF"
    },
    callout: {
        width: 260
    },
    devName: {
        fontWeight: "bold",
        fontSize: 16
    },
    devBio: {
        color: "#666",
        marginTop: 5,
    },
    devTechs: {
        marginTop: 5
    },
    searchForm: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: "#fff",
        color: "#333",
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: "#8E4DFF",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 15
    }
})
