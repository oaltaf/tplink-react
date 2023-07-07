import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, useColorScheme, Alert, Image, FlatList, View } from 'react-native';
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

import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { BASE_URL } from '../utils/Constants';
import Loader from './Loader';

function Schedule({ route }) {
    const [loading, setLoading] = useState(false);

    const [bulb, setBulb] = useState(route.params.selectedDevice || {});
    const [valid, setValid] = useState(false);

    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    // Datetime settings
    const [date, setDate] = useState(new Date());
    const [power, setPower] = useState(false);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const getSchedules = () => {
        console.log('Loading user schedules');
        setLoading(true);

        axios.get(`${BASE_URL}/devices/${bulb.deviceMac}/schedule`, {
            headers: {
                token: bulb.userToken
            }
        }).then(resp => {
            let respSchedules = resp.data.data
            if (!Object.keys(respSchedules).length) {
                setSchedules([])
            } else {
                let schedules = [];
                for (let key of Object.keys(respSchedules)) {
                    schedules.push({
                        taskId: key,
                        scheduleDate: (new Date(respSchedules[key].scheduleData)).toString(),
                        task: respSchedules[key].task,
                    });
                }
                setSchedules(schedules);
            }
            setLoading(false);
        }).catch(err => {
            Alert.alert('Error', err.message, [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel'
                }
            ]);
            setLoading(false);
        })
    }

    const createSchedule = () => {
        console.log('Creating schedule', bulb, date, power);
        axios.post(`${BASE_URL}/devices/${bulb.deviceMac}/schedule`, {
            token: bulb.cloudToken,
            schedule: date,
            opt: power
        },
            {
                headers: {
                    token: bulb.userToken
                }
            }).then((resp) => {
                console.log(resp.data.data);
                setLoading(false);
                getSchedules();
            }).catch((error) => {
                // console.warn(error.message);
                Alert.alert('Error', error.message, [
                    {
                        text: 'Cancel',
                        onPress: () => { },
                        style: 'cancel'
                    }
                ]);

                setLoading(false);
                getSchedules();
            });
    }

    const deleteSchedule = () => {
        axios.post(`${BASE_URL}/devices/${bulb.deviceMac}/schedule`, {
            token: bulb.cloudToken,
            schedule: date,
            opt: power,
            operation: 'remove',
            taskId: selectedSchedule.taskId
        },
            {
                headers: {
                    token: bulb.userToken
                }
            }).then((resp) => {
                console.log(resp.data.data);
                setLoading(false);
                setSelectedSchedule(null)
                getSchedules();
            }).catch((error) => {
                // console.warn(error.message);
                Alert.alert('Error', error.message, [
                    {
                        text: 'Cancel',
                        onPress: () => { },
                        style: 'cancel'
                    }
                ]);

                setLoading(false);
                setSelectedSchedule(null);
                getSchedules();
            });
    }

    useEffect(() => {
        return getSchedules();
    }, [])

    return (
        <>
            {
                loading ? <Loader /> : <Stack spacing={2} justify={'center'} fill style={{ margin: 16 }}>
                    {/* <Avatar
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
            /> */}

                    <Text variant="h4" style={{ fontWeight: 'bold', alignSelf: 'center' }}>
                        {bulb.alias}
                    </Text>

                    {/* Datetime picker to schedule a task */}
                    <View>
                        <Text variant="h6" style={{ fontWeight: 'bold' }}>Schedule : </Text>
                        <Text variant="h6">Date: {date.toDateString()}</Text>
                        <Text variant="h6">Date: {date.toTimeString()}</Text>
                        <Button style={{ marginVertical: 2 }} onPress={showDatepicker} title="Select Date" />
                        <Button style={{ marginVertical: 2 }} onPress={showTimepicker} title="Select Time" />
                        <Button style={{ marginVertical: 2 }} onPress={() => setPower(!power)} title={`Toggle Power : ${power ? 'On' : 'Off'}`} />
                        <Button style={{ marginVertical: 10 }} onPress={() => { createSchedule() }} title={"Schedule"} />
                    </View>

                    <Text variant="h6" style={{ fontWeight: 'bold', marginTop: 20 }}>{schedules && schedules.length ? 'Scheduled Tasks : ' : 'No Scheduled Tasks'}</Text>
                    <FlatList
                        style={{ marginTop: 20 }}
                        data={schedules}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.item}>
                                    <Text style={{ fontSize: 16 }}>{`TaskId : ${item.taskId}`}</Text>
                                    <Text style={{ fontSize: 16 }}>{`Task : ${item.task}`}</Text>
                                    <Text style={{ fontSize: 16 }}>{`Time : ${item.scheduleDate}`}</Text>
                                </View>
                            )
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
    },
    item: {
        padding: 4,
        fontSize: 18,
        // marginVertical: 2,
        borderColor: '#000',
        borderWidth: 2
    },
});

export default Schedule;
