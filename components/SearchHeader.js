import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

const Header = ({searchValue, handleSearch}) => (
	<View style={styles.container}>
		<TextInput
			value={searchValue}
			style={styles.input}
			placeholder="Search..."
			onChangeText={(text) => handleSearch(text)}
		/>
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 8,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#C1C1C1',
	},
	input: {
		height: 30,
		flex: 1,
		paddingHorizontal: 8,
		fontSize: 15,
		backgroundColor: '#FFFFFF',
		borderRadius: 2,
	},
});

export default Header;
