import React, {Fragment} from 'react';
import {View, SectionList, StyleSheet, Text} from 'react-native';
import Row from './Row'
import SectionHeader from './SectionHeader';

class ListViewDemo extends React.Component {
	constructor(props) {
		super(props);

		const dataBlob = this.formatData(this.props.data);
		this.state = {
			dataSource: dataBlob,
		};
	}

	formatData(data) {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

		const dataBlob = [];
		const sectionIds = [];
		const rowIds = [];

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

	render() {
		return (
			<Fragment>
				{/*<SectionList*/}
				{/*	style={styles.container}*/}
                {/*    renderItem={(data) => <Row {...data} />}*/}
                {/*    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator}/>}*/}
				{/*	renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}*/}
				{/*	sections={this.state.dataSource}*/}
                {/*    keyExtractor={(item, index) => index}*/}
                {/*/>*/}
				<SectionList
                    style={styles.container}
                    // sections={[{title: 'D', data: ['Devin', 'Dan', 'Dominic']}, {
					// 	title: 'J',
					// 	data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie']
					// }]}
                    sections={this.state.dataSource}
					renderItem={({item}) => <Text style={styles.item}>{item.first_name}</Text>}
                    renderSectionHeader={(sectionData) => <SectionHeader {...sectionData} />}
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator}/>}
                    keyExtractor={(item, index) => index}
                />
			</Fragment>
		);
	}
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

export default ListViewDemo;
