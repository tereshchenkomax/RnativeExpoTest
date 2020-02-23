import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View, TextInput, Button, Keyboard, Text, SectionList} from 'react-native';
import {ListItem, SearchBar, Overlay} from 'react-native-elements';
import axios from 'axios';
import moment from 'moment';
import ErrorBoundary from "../components/ErrorBoundary";
import GenderPicker from "../components/GenderPicker";
import OverlayComponent from "../components/OverlayComponent";

const pickeItems = [
    {label: 'male', value: 'male', key: 1},
    {label: 'female', value: 'female', key: 2},
    {label: 'both', value: '', key: 3},
]

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

    const fetchData = async () => {
        try {
            let url = 'https://gorest.co.in/public-api/users?_format=json&access-token=xAj8EbuOqdkAvS_0kSRv49F0YrRO8skgwSh4';
            return await axios.get(url)
        } catch (error) {
            setError(error);
        }
    };

    const overlayHandler = (id) => {
        setVisibleOverlay({
            visible: true,
            id: id
        });
    };

    useEffect(() => {
        isLoading(true);
        fetchData()
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
        const searchRegex = searchValue && new RegExp(`${searchValue}`, "gi");
        const result = initialData.filter(
            person => {
                return (!searchRegex || searchRegex.test(person.first_name) || searchRegex.test(person.last_name)) &&
                (!gender || person.gender === gender) &&
                (age.from <= moment().diff(person.dob, 'years')) &&
                (age.to >= moment().diff(person.dob, 'years'))}
        );
        setSortedData(result);
    }, [searchValue, gender, age]);

    const emulateServerDelayWithMemo = (handler, deps) => useCallback(() => setTimeout(handler, 400), [...deps]);

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

    const renderItems = useCallback(({item}) => {
        return (
            <ListItem
                key={item.id}
                title={`#${item.id} - ${item.first_name} ${item.last_name} - ${moment().diff(item.dob, 'years')} years old - ${item.gender}`}
                onPress={() => overlayHandler(item.id)}
                titleStyle={item.status === 'inactive' ? styles.listItemInactive : null}
                bottomDivider
            />
        )
    }, []);

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
                <View style={styles.filterStyles}>
                    <GenderPicker currentItem={gender} pickeItems={pickeItems} setGender={setGender}/>
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
                <SectionList
                    sections={[
                        {title: 'D', data: ['Devin', 'Dan', 'Dominic']},
                        {title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie']},
                    ]}
                    renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
                    renderSectionHeader={({section}) => <Text >{section.title}</Text>}
                    keyExtractor={(item, index) => index}
                />
                <FlatList
                    style={styles.list}
                    data={sortedData}
                    renderItem={renderItems}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={<SearchBar
                        placeholder="Type Here..."
                        lightTheme
                        round
                        onChangeText={setSearchValue}
                        autoCorrect={false}
                        value={searchValue}
                    />}
                />

            </View>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    error: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1
    },
    text: {
        fontSize: 20,
        paddingTop: 7
    },
    list: {
        marginTop: 20
    },
    picker: {
        height: 15,
        width: 100
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
