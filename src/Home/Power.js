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

import Logo from '../logo.png';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';
import Loader from './Loader';
import { BASE_URL } from '../utils/Constants';

function Power({ route }) {
    const [power, setPower] = useState(false);
    const [loading, setLoading] = useState(false);

    const [bulb, setBulb] = useState(route.params.selectedDevice || {});
    const [valid, setValid] = useState(false);

    const setBulbColor = () => {
        console.log('Power haha', power, bulb);
        setLoading(true);

        // Set brightness for the bulb
        axios
            .post(`${BASE_URL}/devices/${bulb.deviceMac}/power`,
                {
                    token: bulb.cloudToken,
                    power: power
                },
                {
                    headers: {
                        token: bulb.userToken
                    }
                })
            .then((resp) => {
                console.log(resp.data);
                setPower(!power);
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

                    <Text variant="h4" style={{ fontWeight: 'bold', alignSelf: 'center' }}>
                        Set Power: {power ? ' ON' : ' OFF'}
                    </Text>
                    <Button
                        disabled={loading}
                        title="Toggle Power"
                        onPress={() => {
                            setBulbColor(!power);
                        }}
                    />
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

export default Power;
