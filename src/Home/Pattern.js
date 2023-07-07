import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, useColorScheme, Alert, Image, FlatList, View, TouchableOpacity } from 'react-native';
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

import Dialog from "react-native-dialog";
import { BASE_URL } from '../utils/Constants';

function Pattern({ route }) {
    const defaultPatterns = [
        {
            id: 'default-1',
            colors: [
                '#034F1B',
                '#E6DCB1',
                '#CEAC5C',
                '#BD3634',
                '#7E121D'
            ],
            name: 'Christman Theme'
        },
        {
            id: 'default-2',
            colors: [
                '#FFDCCD',
                '#D42C43',
                '#FCB0B6',
                '#B3023D'
            ],
            name: 'Valentines Theme'
        }, {
            id: 'default-3',
            colors: [
                '#588A87',
                '#B6C6BE',
                '#DFD9CA',
                '#EFCABF',
                '#EEA995',
                '#E0AF61'
            ],
            name: 'Winter Theme'
        }]

    const [color, setColor] = useState('red');
    const [loading, setLoading] = useState(false);
    const [patternModel, setPatternModel] = useState(false);

    const [bulb, setBulb] = useState(route.params.selectedDevice || {});
    const [valid, setValid] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [taskId, setTaskId] = useState(null);
    const [selectedPattern, setSelectedPattern] = useState(null);
    const [patterns, setPatterns] = useState([...defaultPatterns
    ])

    const [patternColors, setPatternColors] = useState([]);
    const [visible, setVisible] = useState(false);
    const [patternName, setPatternName] = useState(null);

    const popColor = (item) => {
        let itemIndex = patternColors.indexOf(item);
        if (itemIndex != -1) {
            let tempPatterns = [...patternColors];
            tempPatterns.splice(itemIndex, 1);
            setPatternColors(tempPatterns);
            tempPatterns = undefined;
        }
    }

    const addColor = () => {
        if (patternColors.length <= 16) {
            setPatternColors([...patternColors, color])
        } else {
            Alert.alert('Warn', 'Reached max limit for pattern colors', [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel'
                }
            ]);
        }
    }

    const createPattern = () => {
        console.log(patternColors, patternName);
        setVisible(false);
        setLoading(true);

        axios.post(`${BASE_URL}/user/pattern`, {
            colors: patternColors,
            name: patternName
        }, {
            headers: {
                token: bulb.userToken
            }
        }).then(resp => {
            setPatternName(null);
            setPatternColors([])
            setPatterns([...defaultPatterns, ...resp.data.data])
            setLoading(false);
        }).catch(err => {
            Alert.alert('Error', err.message, [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel'
                }
            ]);
            setPatternName(null);
            setLoading(false);
        })



    }


    useEffect(() => {
        console.log('Loading user patterns');
        setLoading(true);

        axios.get(`${BASE_URL}/user/pattern`, {
            headers: {
                token: bulb.userToken
            }
        }).then(resp => {
            setPatterns([...resp.data.data, ...patterns]);
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
    }, [])

    const setPattern = () => {
        console.log('Pattern haha', bulb);
        setLoading(true);

        // Set brightness for the bulb
        console.log(isPlaying, taskId);
        if (isPlaying && taskId) {
            axios.post(`${BASE_URL}/devices/${bulb.deviceMac}/pattern`,
                {
                    token: bulb.cloudToken,
                    pattern: selectedPattern.colors,
                    taskId: taskId,
                    operation: 'remove'
                },
                {
                    headers: {
                        token: bulb.userToken
                    }
                })
                .then((resp) => {
                    console.log(resp.data.data);
                    setTaskId(null);
                    setIsPlaying(false);
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
            axios
                .post(`${BASE_URL}/devices/${bulb.deviceMac}/pattern`,
                    {
                        token: bulb.cloudToken,
                        pattern: selectedPattern.colors
                    },
                    {
                        headers: {
                            token: bulb.userToken
                        }
                    })
                .then((resp) => {
                    console.log(resp.data.data);
                    setTaskId(resp.data.data);
                    setIsPlaying(true);
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
        }
    };

    return (
        <>
            {
                loading ? <Loader /> :
                    patternModel ?
                        <Stack spacing={2} justify={'center'} fill style={{ margin: 16 }}>
                            <Button disabled={!patternModel} title="Close Model" onPress={() => setPatternModel(!patternModel)} />
                            <ColorPicker
                                style={{ width: '100%', zIndex: 99 }}
                                value={color}
                                onComplete={({ hex }) => {
                                    setColor(hex);
                                }}
                            >
                                <Preview />
                                <Panel1 />
                                <HueSlider />
                            </ColorPicker>

                            <Text variant="h6" style={{ fontWeight: 'bold', alignSelf: 'center' }}>Generate Pattern</Text>
                            <FlatList
                                style={{ marginTop: 20 }}
                                data={patternColors}
                                // horizontal={true}
                                contentContainerStyle={{ justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}

                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: 60 / 2,
                                            backgroundColor: item,
                                            borderColor: 'black',
                                            borderWidth: 3,
                                            margin: 2
                                        }} onPress={() => popColor(item)}>

                                            {/* <Button styles={styles.item} title={item.name} onPress={() => { console.log(item); setSelectedPattern(item) }} /> */}
                                        </TouchableOpacity>
                                    )
                                }}
                            />

                            <Text variant="h6" style={{ fontWeight: 'bold', alignSelf: 'center' }}>{`Selected Color: ${color}`}</Text>
                            <Button style={{ marginVertical: 10 }} disabled={!color} title="Add Color" onPress={addColor} />
                            <Button disabled={!patternColors.length} title="Create Pattern" onPress={() => setVisible(true)} />
                            <Dialog.Container visible={visible}>
                                <Dialog.Title>Enter Pattern name : </Dialog.Title>
                                <Dialog.Input label={"Pattern name"} onChangeText={setPatternName} />
                                <Dialog.Button label="Cancel" onPress={() => setVisible(false)} />
                                <Dialog.Button label="Confirm" onPress={createPattern} />
                            </Dialog.Container>


                        </Stack >
                        :
                        <Stack spacing={2} justify={'center'} fill style={{ margin: 16 }}>
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
                                style={{ marginVertical: 20, alignSelf: 'center' }}
                                size={126}
                            /> */}
                            <Text variant="h4" style={{ fontWeight: 'bold', alignSelf: 'center' }}>
                                {bulb.alias}
                            </Text>



                            <Text variant="h6" style={{ fontWeight: 'bold', alignSelf: 'center' }}>
                                {selectedPattern ? selectedPattern.name : 'No Selected Pattern'}
                            </Text>

                            <FlatList
                                style={{ marginTop: 20 }}
                                data={patterns}
                                renderItem={({ item }) => <Button styles={styles.item} title={item.name} onPress={() => { console.log(item); setSelectedPattern(item) }} />}
                            />

                            {selectedPattern ?
                                <>
                                    <Button disabled={isPlaying} title="Play" onPress={() => setPattern()} />
                                    <Button disabled={!isPlaying} title="Pause" onPress={() => setPattern(taskId)} />
                                </> : <></>}


                            <Button disabled={patternModel} title="Generate Pattern" onPress={() => setPatternModel(!patternModel)} />
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
        padding: 10,
        fontSize: 18,
        marginVertical: 5
    }
});

export default Pattern;
