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

function CombineColor({ route }) {
    const [color, setColor] = useState('red');
    const [loading, setLoading] = useState(false);

    const [bulb, setBulb] = useState(route.params.selectedDevice || {});
    const [valid, setValid] = useState(false);

    const setBulbColor = () => {
        console.log('CombineColors haha', color, bulb);
        setLoading(true);

        // Set brightness for the bulb
        axios
            .post(`${BASE_URL}/devices/${bulb.deviceMac}/combinecolor`,
                {
                    token: bulb.cloudToken,
                    color: color
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
                        style={{ width: '100%' }}
                        value={color}
                        onComplete={({ hex }) => {
                            setColor(hex);
                        }}
                    >
                        <Preview />
                        <Panel1 />
                        <HueSlider />
                    </ColorPicker>
                    <Text variant="h4" style={{ fontWeight: 'bold', alignSelf: 'center' }}>
                        {color.toString()}
                    </Text>

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

export default CombineColor;
