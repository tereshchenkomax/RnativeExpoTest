import React, {useEffect, useState, Fragment} from 'react';
import {View, SectionList, StyleSheet, Text} from 'react-native';
import Row from './Row'
import SectionHeader from './SectionHeader';

export const List = ({data, overlayHandler}) => {

	const [sections, setSections] = useState([])

	useEffect(() => {
		setSections(formatData(data));
	}, [data]);

	const formatData = (data) => {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

		const dataBlob = [];

		for (let sectionId = 0; sectionId < alphabet.length; sectionId++) {
			const currentChar = alphabet[sectionId];

			const users = data.filter((user) => user.first_name.toUpperCase().indexOf(currentChar) === 0);

			if (users.length > 0) {
				let sectionObj = {
					title: currentChar,
					data: users
				}
				dataBlob.push(sectionObj)
			}
		}
		return dataBlob
	}

	const renderItem = ({item}) => {
		return (
			<Row
				style={styles.item}
				key={item.id}
				overlayHandler={overlayHandler}
				titleStyle={item.status === 'inactive' ? styles.listItemInactive : null}
				item={item}
			/>
		)
	}

	return (
		<Fragment>
			<SectionList
				style={styles.container}
				sections={sections}
				renderItem={renderItem}
				renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
				ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator}/>}
				keyExtractor={(item, index) => index}
			/>
		</Fragment>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20,
	},
	separator: {
		flex: 1,
		height: StyleSheet.hairlineWidth,
		backgroundColor: '#8E8E8E',
	},
});
