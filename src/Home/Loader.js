/* eslint-disable */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const Loader = () => {
	return (
		<View style={styles.container}>
			<Spinner
				visible={true}
				textContent={'Loading...'}
				textStyle={styles.spinnerTextStyle}
				cancelable={false}
				animation={'fade'}
			/>
		</View>
	);
};

export default Loader;

const styles = StyleSheet.create({
	spinnerTextStyle: {
		color: '#FFF'
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF'
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5
	}
});
