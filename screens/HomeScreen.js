import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	View,
	TextInput,
	Button,
	Keyboard,
	Text,
} from 'react-native';

import axios from 'axios';
import moment from 'moment';
import ErrorBoundary from "../components/ErrorBoundary";
import GenderPicker from "../components/GenderPicker";
import OverlayComponent from "../components/OverlayComponent";
import {List} from "../components/List";
import {pickeritems} from "../data/pickeritems"
import {fetchData} from "../utils/fetchdata";
import dismissKeyboard from "react-native-web/dist/modules/dismissKeyboard";

export default function HomeScreen(deps) {

	const [initialData, setinitialData] = useState([]);
	const [sortedData, setSortedData] = useState([]);

	const [searchValue, setSearchValue] = useState('');
	const [gender, setGender] = useState('both');
	const [age, setAge] = useState({
		from: '0',
		to: '99'
	});

	const [overlay, setVisibleOverlay] = useState({
		visible: false,
		id: ''
	});

	const [error, setError] = useState(false);
	const [loading, isLoading] = useState(false);

	useEffect(() => {
		isLoading(true);
		const url = 'https://gorest.co.in/public-api/users?_format=json&access-token=xAj8EbuOqdkAvS_0kSRv49F0YrRO8skgwSh4';
		fetchData(url)
			.then(({data}) => {
				isLoading(false);
				setSortedData(data.result.sort((a, b) => a.first_name.localeCompare(b.first_name)));
				setinitialData(data.result);
			})
			.catch(err => {
				setError(err);
				console.log(error);
				isLoading(false);
			})

	}, []);

	useEffect(() => {
		isLoading(true);
		const searchRegex = searchValue && new RegExp(`${searchValue}`, "gi");
		const result = initialData.filter(
			person => {
				return (!searchRegex || searchRegex.test(person.first_name) || searchRegex.test(person.last_name)) &&
					(!gender || person.gender === gender) &&
					(age.from <= moment().diff(person.dob, 'years')) &&
					(age.to >= moment().diff(person.dob, 'years'))
			}
		);
		setTimeout(() => setSortedData(result), 400);
		isLoading(false);
	}, [searchValue, gender, age]);

	const emulateServerDelayWithMemo = (handler, deps) => useCallback(() => setTimeout(handler, 400), [...deps]);

	const overlayHandler = (id) => {
		setVisibleOverlay({
			visible: true,
			id: id
		});
	};

	const setFilterByID = id => {
		const newData = initialData.filter(item => (
			item.id !== id
		));
		setinitialData(newData);
		setSortedData(newData);
	};

	const setAgeFilter = (text, index) => {
		index === 'from' ?
			setAge({
				from: text,
				to: age.to
			}) :
			setAge({
				from: age.from,
				to: text
			})
	};

	const handleReset = () => {
		setGender('');
		setSortedData(initialData);
		setSearchValue('');
		setAge({
			from: '0',
			to: '99'
		});
		Keyboard.dismiss();
	};

	const handleSearch = (text) => {
		setSearchValue(text)
	}

	if (loading) {
		return (
			<ErrorBoundary>
				<View style={styles.error}>
					<ActivityIndicator/>
				</View>
			</ErrorBoundary>
		)

	}

	return (
		<ErrorBoundary>
			<View style={styles.container}>
				<OverlayComponent overlay={overlay} setVisibleOverlay={setVisibleOverlay} filterById={setFilterByID}/>
				<View style={styles.filterStyles} >
					<GenderPicker currentItem={gender} pickeItems={pickeritems} setGender={setGender}/>
					<Text style={styles.text}>Age From</Text>
					<TextInput keyboardType={'numeric'} placeholder={'From'}
							   onChangeText={text => setAgeFilter(text, 'from')}
							   maxLength={2} value={age.from}
							   style={styles.textInput}/>
					<Text style={styles.text}>To</Text>
					<TextInput keyboardType={'numeric'} placeholder={'To'}
							   onChangeText={text => setAgeFilter(text, 'to')}
							   maxLength={2} value={age.to}
							   style={styles.textInput}/>
					<Button title={'Reset'} onPress={handleReset}/>
				</View>
				<List data={sortedData} overlayHandler={overlayHandler} handleSearch={handleSearch}/>
			</View>
		</ErrorBoundary>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	text: {
		fontSize: 20,
		paddingTop: 7
	},
	textInput: {
		width: 50,
		fontSize: 20,
		color: 'blue',
		borderWidth: 1,
		borderColor: 'gray',
		textAlign: 'center'
	},
	listItemInactive: {
		color: 'gray'
	},
	filterStyles: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignContent: 'center'
	},
});
