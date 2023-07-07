import React, { useContext, useEffect, useState } from 'react';
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
import { useValidation } from 'react-native-form-validator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { UserContext } from '../Context/User';
import Logo from '../logo.png';
import axios from 'axios';
import { BASE_URL } from '../utils/Constants';

function ForgotPasscode({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(null);
    const [valid, setValid] = useState(false);

    const { validate, getErrorMessages } = useValidation({
        state: { email }
    });


    const forgotPasscode = async () => {
        console.log('forgotPasscode haha');

        const resp = validate({
            email: { email: true, required: true }
        });

        if (resp) {

            axios
                .post(`${BASE_URL}/user/forgotPass`,
                    {
                        email: email.toLowerCase()
                    })
                .then((resp) => {
                    Alert.alert('Success', 'New Password sent to your email', [
                        {
                            text: 'Confirm',
                            onPress: () => { navigation.navigate('Login') },
                            style: 'cancel'
                        }
                    ])
                    setLoading(false);
                })
                .catch((error) => {
                    // console.warn(error.message);
                    Alert.alert('Error', error.message, [
                        {
                            text: 'Cancel',
                            onPress: () => { },
                            style: 'cancel'
                        }
                    ]);

                    setLoading(false);
                });
        } else {
            setValid(true);
        }
    };

    return (
        <Stack spacing={2} justify={'center'} fill style={{ margin: 16 }}>
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
                style={{ marginBottom: 200, alignSelf: 'center' }}
                size={126}
            />
            <TextInput
                value={email}
                label="Email"
                textContentType={'emailAddress'}
                onChangeText={(email) => setEmail(email)}
                leading={(props) => <Icon name="account" {...props} />}
            />

            <Button disabled={loading} title="Forgot Passcode" onPress={forgotPasscode} />

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

export default ForgotPasscode;
