import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/utils/RootNavigation';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UserContextProvider from './src/Context/User';
import DrawerStack from './src';

function App() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<UserContextProvider>
				<NavigationContainer ref={navigationRef}>
					<DrawerStack />
				</NavigationContainer>
			</UserContextProvider>
		</GestureHandlerRootView>
	);
}

export default App;
