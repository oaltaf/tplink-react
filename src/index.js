import React, { useContext, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Login from './Home/login';
import Home from './Home/Home';
import Loader from './Home/Loader';
import Brightness from './Home/Brightness';
import CombineColor from './Home/CombineColor';
import Color from './Home/Color';
import Pattern from './Home/Pattern';
import Power from './Home/Power';
import Schedule from './Home/Scheduler';

import { UserContext } from './Context/User';

import { createStackNavigator } from '@react-navigation/stack';
import ForgotPasscode from './Home/forgot-password';
import Lecturer from './Home/Lecturer';


const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();

const DrawerStack = () => {
    const navigation = useNavigation();
    const { user, loading } = useContext(UserContext); // We need to replace this with userContext

    useEffect(() => {
        //Check user available
        // console.log('User ::: >>> ', user);
        // console.log('User useEffect triggered for DrawerStack');
        if (loading) {
            navigation.reset({
                routes: [{ name: 'Loader' }]
            });
        } else {
            if (!user) {
                navigation.reset({
                    routes: [{ name: 'Login' }]
                });
            } else {
                navigation.reset({
                    routes: [{ name: 'Home' }]
                });
            }
        }
    }, []);

    return loading ? (
        <Loader />
    ) : user ? (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Home" component={Home} />
            <HomeStack.Screen name="Lecturer" component={Lecturer} />
            <HomeStack.Screen name="Brightness" component={Brightness} />
            <HomeStack.Screen name="Color" component={Color} />
            <HomeStack.Screen name="CombineColor" component={CombineColor} />
            <HomeStack.Screen name="Pattern" component={Pattern} />
            <HomeStack.Screen name="Power" component={Power} />
            <HomeStack.Screen name='Schedule' component={Schedule} />
        </HomeStack.Navigator>
    ) : (
        <AuthStack.Navigator>
            <AuthStack.Screen name="Login" component={Login} />
            <AuthStack.Screen name="ForgotPassword" component={ForgotPasscode} />
        </AuthStack.Navigator>
    );
};

export default DrawerStack;
