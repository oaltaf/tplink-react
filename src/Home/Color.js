import React, { useContext, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, useColorScheme, Alert, Image } from 'react-native';
import {
    Avatar,
    Button,
    Flex,
    IconButton,
    Spacer,
    Stack,
    TextInput,
    Text,
    Snackbar
} from '@react-native-material/core';

import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';

import Logo from '../logo.png';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';
import Loader from './Loader';
import { BASE_URL } from '../utils/Constants';

function Color({ route }) {
    const ColorNames = {
        '#FFFFFF': 'white',
        '#F3E7D3': 'warmwhite',
        '#FDF4DC': 'daylightwhite',
        '#0000FF': 'blue',
        '#FF0000': 'red',
        '#008000': 'green',
        '#FFFF00': 'yellow'
    };
    const [color, setColor] = useState('red');
    const [colorName, setColorName] = useState('red');
    const [loading, setLoading] = useState(false);

    const [bulb, setBulb] = useState(route.params.selectedDevice || {});
    const [valid, setValid] = useState(false);

    const setBulbColor = () => {
        console.log('Color haha', colorName, bulb);
        setLoading(true);

        // Set brightness for the bulb
        axios
            .post(`${BASE_URL}/devices/${bulb.deviceMac}/color`,
                {
                    token: bulb.cloudToken,
                    color: colorName
                },
                {
                    headers: {
                        token: bulb.userToken
                    }
                })
            .then((resp) => {
                console.log(resp.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err.message)
                Alert.alert('Error', err.message, [
                    {
                        text: 'Cancel',
                        onPress: () => { },
                        style: 'cancel'
                    }
                ]);
                setLoading(false);
            });
    };

    return (
        <>
            {
                loading ? <Loader /> : <Stack spacing={2} justify={'center'} fill style={{ margin: 16 }}>
                    <Avatar
                        // image={{ uri: 'https://mui.com/static/images/avatar/1.jpg' }}
                        image={
                            <Image
                                source={Logo}
                                style={{
                                    width: 126,
                                    height: 126,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    borderRadius: 28
                                }}
                            />
                        }
                        color="white"
                        style={{ marginVertical: 20, alignSelf: 'center' }}
                        size={126}
                    />

                    <Text variant="h4" style={{ fontWeight: 'bold', alignSelf: 'center' }}>
                        {bulb.alias}
                    </Text>

                    {/* <ColorPicker color={color} onColorSelected={setColor} style={{ flex: 0.7 }} /> */}
                    <ColorPicker
                        style={{
                            width: '100%',
                            height: '30%',
                            justifyContent: 'center',
                            paddingHorizontal: 20,
                            backgroundColor: 'rgba(200,100,0,.5)'
                        }}
                        value={color}
                        onComplete={({ hex }) => {
                            // console.log(hex);
                            setColor(hex);
                            setColorName(ColorNames[hex.toUpperCase()]);
                        }}
                    >
                        <Swatches colors={['#FFFFFF', '#F3E7D3', '#FDF4DC', '#0000FF', '#FF0000', '#008000', '#FFFF00']} />
                        <Text variant="h4" style={{ fontWeight: 'bold', alignSelf: 'center', marginTop: 35 }}>
                            {colorName.toUpperCase()}
                        </Text>
                    </ColorPicker>

                    <Button disabled={loading} title="Set Color" onPress={setBulbColor} />
                    {valid && (
                        <Snackbar
                            message={getErrorMessages()}
                            action={
                                <Button
                                    onPress={() => setValid(!valid)}
                                    variant="text"
                                    title="Dismiss"
                                    color="#BB86FC"
                                    compact
                                />
                            }
                            style={styles.snackbar}
                        />
                    )}
                </Stack>
            }
        </>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: '0.8rem'
    },
    snackbar: { position: 'absolute', start: 16, end: 16, bottom: 16 },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    }
});

export default Color;
