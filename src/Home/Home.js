import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Alert,
  Image,
  FlatList,
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
import {UserContext} from '../Context/User';

import auth from '@react-native-firebase/auth';
import Loader from './Loader';
import {BASE_URL} from '../utils/Constants';

const Home = ({navigation}) => {
  let {user, logOut} = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);

  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const navigationItems = [
    {
      component: 'Power',
      name: 'Set Power',
    },
    {
      component: 'Brightness',
      name: 'Set Brightness',
    },
    {
      component: 'Color',
      name: 'Set Color',
    },
    {
      component: 'CombineColor',
      name: 'Set Combine Color',
    },

    {
      component: 'Pattern',
      name: 'Set Pattern',
    },
    {
      component: 'Schedule',
      name: 'Set a Schedule',
    },
  ];

  const getCloudToken = async () => {
    try {
      let userToken = await auth().currentUser.getIdToken();
      console.log('my token', userToken);
      let resp = await axios.post(
        `${BASE_URL}/token`,
        {},
        {
          headers: {
            token: userToken,
          },
        },
      );
      console.log('Cloud token resp : ', resp.data.data);

      let cloudToken = resp.data.data;
      return {cloudToken, userToken};
    } catch (error) {
      console.log('getCloudToken Errorr : ', error);
      throw error;
    }
  };

  const getUserDevices = async () => {
    try {
      let {cloudToken, userToken} = await getCloudToken();
      let resp = await axios.post(
        `${BASE_URL}/devices`,
        {
          token: cloudToken,
        },
        {
          headers: {
            token: userToken,
          },
        },
      );
      console.log('Devices resp :: ', resp.data.data);
      for (let device in resp.data.data) {
        resp.data.data[device]['cloudToken'] = cloudToken;
        resp.data.data[device]['userToken'] = userToken;
      }

      return resp.data.data;
    } catch (error) {
      console.log('getCloudToken Errorr : ', error);
      throw error;
    }
  };

  useEffect(() => {
    getUserDevices()
      .then(devices => {
        setDevices(devices);
        setInitLoading(false);
      })
      .catch(() => {
        // console.warn(error.message);
        Alert.alert('Error', error.message, [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
        ]);

        setInitLoading(false);
      });

    auth()
      .currentUser.getIdTokenResult()
      .then(Resp => {
        return Resp.claims.admin ? setIsAdmin(true) : setIsAdmin(false);
      });
  }, []);

  return (
    <>
      {initLoading ? (
        <Loader />
      ) : selectedDevice ? (
        <Stack spacing={2} fill style={{margin: 16}}>
          <Button
            style={{marginVertical: 20}}
            title="< Go Back"
            onPress={() => {
              setSelectedDevice(null);
            }}
          />
          {/* <Text>{selectedDevice.alias}</Text> */}
          <FlatList
            style={{marginTop: 20}}
            data={navigationItems}
            renderItem={({item}) => (
              <Button
                color="#B9FF66"
                style={styles.item}
                title={item.name}
                onPress={() => {
                  console.log(item);
                  navigation.navigate(item.component, {selectedDevice});
                }}
              />
            )}
          />
        </Stack>
      ) : (
        <Stack spacing={2} fill style={{margin: 16}}>
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
          {/* Show some devices */}
          {/* <Text>{JSON.stringify(devices)}</Text> */}
          <FlatList
            style={{marginTop: 20}}
            data={devices}
            renderItem={({item}) => (
              <Button
                style={styles.item}
                title={item.alias}
                onPress={() => {
                  console.log(item);
                  setSelectedDevice(item);
                }}
              />
            )}
          />

          {/* <Button disabled={loading} title="Set Brightness" onPress={() => { }} /> */}
          {isAdmin ? (
            <Button
              style={styles.item}
              title={'Create lecturer'}
              onPress={() => {
                console.log('Create Lecturer');
                navigation.navigate('Lecturer');
              }}
            />
          ) : (
            <></>
          )}
          <Button style={styles.item} title={'Logout'} onPress={logOut} />
        </Stack>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    marginVertical: 5,
  },
});

export default Home;
