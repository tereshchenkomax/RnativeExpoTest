import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 8,
		justifyContent: 'center',
		backgroundColor: '#EAEAEA',
	},
	text: {
		fontSize: 13,
	},
});

const SectionHeader = (props) => {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>{props.section.title}</Text>
		</View>
	);
}

export default SectionHeader;
