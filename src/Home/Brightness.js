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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Slider from '@react-native-community/slider';

import Logo from '../logo.png';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';
import Loader from './Loader';
import {BASE_URL} from '../utils/Constants';

function Brightness({route}) {
  const [brightness, setBrightness] = useState(0);
  const [loading, setLoading] = useState(false);

  const [bulb, setBulb] = useState(route.params.selectedDevice || {});
  const [valid, setValid] = useState(false);

  const setBulbBrightness = async () => {
    console.log('Login haha', brightness, bulb);
    setLoading(true);

    // Set brightness for the bulb
    axios
      .post(
        `${BASE_URL}/devices/${bulb.deviceMac}/brightness`,
        {
          token: bulb.cloudToken,
          brightness: brightness,
        },
        {
          headers: {
            token: bulb.userToken,
          },
        },
      )
      .then(resp => {
        console.log(resp.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err.message);
        Alert.alert('Error', err.message, [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
        ]);
        setLoading(false);
      });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
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

          <Text variant="h4" style={{fontWeight: 'bold', alignSelf: 'center'}}>
            {bulb.alias}
          </Text>

          <Slider
            style={{height: 40}}
            value={brightness}
            minimumValue={1}
            maximumValue={100}
            maximumTrackTintColor="#FF0000"
            minimumTrackTintColor="#000000"
            step={1}
            onValueChange={setBrightness}
          />
          <Text variant="h4" style={{fontWeight: 'bold', alignSelf: 'center'}}>
            {brightness.toString()}
          </Text>

          <Button
            disabled={loading}
            title="Set Brightness"
            onPress={setBulbBrightness}
          />
        </Stack>
      )}
    </>
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

export default Brightness;
