import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View, TextInput, Button, Keyboard, Text} from 'react-native';
import {ListItem, SearchBar, Overlay} from 'react-native-elements';
import axios from 'axios';
import moment from 'moment';
import ErrorBoundary from "../components/ErrorBoundary";
import GenderPicker from "../components/GenderPicker";
import OverlayComponent from "../components/OverlayComponent";

export default function HomeScreen() {

    const [data, setData] = useState([]);
    const [holderData, setHolderData] = useState([]);
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
                setData(data.result);
                setHolderData(data.result);
            })
            .catch(err => {
                setError(err);
                console.log(error);
                isLoading(false);
            })

    }, []);

    const emulateServerDelay = (handler) => setTimeout(handler, 400);

    const searchFilterFunction = text => {
        emulateServerDelay(() => {
            if (text.length >= 2) {
                const newData = holderData.filter(item => {
                    const itemFNData = `${item.first_name.toUpperCase()}`;
                    const itemLNData = `${item.last_name.toUpperCase()}`;
                    const textData = text.toUpperCase();
                    return (itemFNData.indexOf(textData) > -1) || (itemLNData.indexOf(textData) > -1)
                });
                setData(newData);
            } else {
                setData(holderData);
            }
        });
        setSearchValue(text);
    };

    const filterByID = id => {
        const newData = holderData.filter(item => (
            item.id !== id
        ));
        setHolderData(newData);
        setData(newData);
    };

    const genderFilterFunction = gender => {
        emulateServerDelay(() => {
            if (gender !== 'both') {
                const newData = holderData.filter(item => (
                    item.gender === gender
                ));
                setData(newData)
            } else {
                setData(holderData)
            }
        });
        setGender(gender)
    };

    const ageFilterFunction = (text, index) => {
        emulateServerDelay(() => {
            if (text !== '') {
                const newData = holderData.filter(item => {
                    const dob = moment().diff(item.dob, 'years');
                    if (index === 'from') {
                        return dob >= text && dob <= age.to
                    }
                    return dob <= text && dob >= age.from
                });
                setData(newData)
            } else {
                setData(holderData)
            }
        });

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
        setGender('both');
        setData(holderData);
        setSearchValue('');
        setAge({
            from: '0',
            to: '99'
        });
        Keyboard.dismiss();
    };
    if (loading) {
        return (
            <ErrorBoundary>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator/>
                </View>
            </ErrorBoundary>
        )

    }

    return (
        <ErrorBoundary>
            <View style={styles.container}>
                <OverlayComponent overlay={overlay} setVisibleOverlay={setVisibleOverlay} filterById={filterByID}/>
                <View style={styles.filterStyles}>
                    <GenderPicker gender={gender} genderFilterFunction={genderFilterFunction}/>
                    <Text style={styles.text}>Age From</Text>
                    <TextInput keyboardType={'numeric'} placeholder={'From'}
                               onChangeText={e => ageFilterFunction(e, 'from')}
                               maxLength={2} value={age.from}
                               style={styles.textInput}/>
                    <Text style={styles.text}>To</Text>
                    <TextInput keyboardType={'numeric'} placeholder={'To'}
                               onChangeText={e => ageFilterFunction(e, 'to')}
                               maxLength={2} value={age.to}
                               style={styles.textInput}/>
                    <Button title={'Reset'} onPress={handleReset}/>
                </View>
                <FlatList
                    style={{marginTop: 100}}
                    data={data}
                    renderItem={({item}) => (
                        <ListItem
                            title={`#${item.id} - ${item.first_name} ${item.last_name} - ${moment().diff(item.dob, 'years')} years old - ${item.gender}`}
                            onPress={() => overlayHandler(item.id)}
                            titleStyle={item.status === 'inactive' ? styles.listItemInactive : null}
                            bottomDivider
                        />
                    )}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={<SearchBar
                        placeholder="Type Here..."
                        lightTheme
                        round
                        onChangeText={text => searchFilterFunction(text)}
                        autoCorrect={false}
                        value={searchValue}
                    />}
                />
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
