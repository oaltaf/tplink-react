import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Alert,
  Image,
} from 'react-native';
import {
  Avatar,
  Button,
  Flex,
  IconButton,
  Spacer,
  Stack,
  TextInput,
  Text,
  Snackbar,
} from '@react-native-material/core';
import {useValidation} from 'react-native-form-validator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {UserContext} from '../Context/User';
import Logo from '../logo.png';

import auth from '@react-native-firebase/auth';
import axios from 'axios';
import {BASE_URL} from '../utils/Constants';

function Lecturer({route}) {
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [fullname, setFullName] = useState(null);
  const [phone, setPhone] = useState(null);

  const [valid, setValid] = useState(false);

  const {validate, getErrorMessages} = useValidation({
    state: {email, password, fullname, phone},
  });

  const CreateLecturer = async () => {
    console.log('CreateLecturer haha');

    const resp = validate({
      email: {email: true, required: true},
      password: {required: true},
      phone: {numbers: true, required: true},
      fullname: {minlength: 3, maxlength: 20, required: true},
    });

    if (resp) {
      console.log('Input is valid');
      let userToken = await auth().currentUser.getIdToken();
      console.log('user token is :: ' + userToken);

      axios
        .post(
          `${BASE_URL}/lecturer/create`,
          {
            email: email.toLowerCase(),
            password: password,
            fullname: fullname,
            phone: phone,
          },
          {
            headers: {
              token: userToken,
            },
          },
        )
        .then(resp => {
          Alert.alert('Success', 'Email sent to new User with credentials', [
            {
              text: 'Confirm',
              onPress: () => {},
              style: 'cancel',
            },
          ]);
          setLoading(false);
        })
        .catch(error => {
          console.log(error);
          // console.warn(error.message);
          Alert.alert('Error', error.message, [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
          ]);

          setLoading(false);
        });
    } else {
      setValid(true);
    }
  };

  return (
    <Stack spacing={2} justify={'center'} fill style={{margin: 16}}>
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
              borderRadius: 28,
            }}
          />
        }
        color="white"
        style={{marginVertical: 20, alignSelf: 'center'}}
        size={126}
      />
      <TextInput
        label="Full name"
        value={fullname || ''}
        autoComplete={'name'}
        textContentType={'name'}
        onChangeText={fullname => setFullName(fullname)}
        leading={props => <Icon name="account" {...props} />}
      />

      <TextInput
        label="Phone"
        value={phone || ''}
        keyboardType={'phone-pad'}
        autoComplete={'tel-device'}
        textContentType={'telephoneNumber'}
        onChangeText={phone => setPhone(phone)}
        leading={props => <Icon name="phone" {...props} />}
      />

      <TextInput
        value={email}
        label="Email"
        textContentType={'emailAddress'}
        onChangeText={email => setEmail(email)}
        leading={props => <Icon name="account" {...props} />}
      />

      <TextInput
        value={password}
        label="Password"
        secureTextEntry={showPassword}
        textContentType={'password'}
        onChangeText={password => setPassword(password)}
        leading={props => <Icon name="key" {...props} />}
        trailing={props => (
          <IconButton
            onPress={() => {
              setShowPassword(!showPassword);
            }}
            icon={props => <Icon name="eye" {...props} />}
            {...props}
          />
        )}
      />

      <Button
        disabled={loading}
        title="Create Lecturer"
        onPress={CreateLecturer}
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
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: '0.8rem',
  },
  snackbar: {position: 'absolute', start: 16, end: 16, bottom: 16},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
});

export default Lecturer;
