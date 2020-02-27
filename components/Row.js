import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from "moment";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 12,
		flexDirection: 'row',
		alignItems: 'center',
	},
	text: {
		marginLeft: 12,
		fontSize: 16,
	},
	photo: {
		height: 40,
		width: 40,
		borderRadius: 20,
	},
});

const Row = ({item, overlayHandler}) => (
	<View style={styles.container}>
		<Text style={styles.text} onPress={() => overlayHandler(item.id)}>
			{item.id} - {item.first_name} {item.last_name} - {moment().diff(item.dob, 'years')} years old - {item.gender}
		</Text>
	</View>
);

export default Row;
