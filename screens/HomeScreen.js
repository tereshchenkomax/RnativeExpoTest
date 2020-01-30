import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View, TextInput, Picker, Button, Keyboard, Text} from 'react-native';
import {ListItem, SearchBar, Input} from 'react-native-elements';
import axios from 'axios';
import moment from 'moment';
import ErrorBoundary from "../components/ErrorBoundary";

export default function HomeScreen() {

    const [data, setData] = useState([]);
    const [holderData, setHolderData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [gender, setGender] = useState('both');
    const [age, setAge] = useState({
        from: '0',
        to: '99'
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
                console.log(err)
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

    const ageFilterFunction = (e) => {
        if (e.nativeEvent.text !== '') {
            const newData = holderData.filter(item => (
                moment().diff(item.dob, 'years') >= e.nativeEvent.text
            ))
            setData(newData)
        } else {
            setData(holderData)
        }
        setAge({
            from: e.nativeEvent.text,
            to: age.to
        })
    }

    const handleReset = () => {
        setGender('both');
        setData(holderData);
        setSearchValue('');
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
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignContent: 'center'
                }}>
                    <Picker
                        selectedValue={gender}
                        style={{height: 15, width: 100}}
                        onValueChange={genderFilterFunction}
                    >
                        <Picker.Item label="Male" value="male"/>
                        <Picker.Item label="Female" value="female"/>
                        <Picker.Item label="Both" value="both"/>
                    </Picker>

                    <Text style={{fontSize: 20, paddingTop: 7}}>Age</Text>
                    <TextInput keyboardType={'numeric'} placeholder={'From'} onChange={ageFilterFunction}
                               maxLength={2} value={age.from}
                               style={{width: 50, fontSize: 20}}/>
                    <TextInput keyboardType={'numeric'} placeholder={'To'} onChange={ageFilterFunction}
                               maxLength={2} value={age.to}
                               style={{width: 50, fontSize: 20}}/>
                    <Button title={'Reset'} onPress={handleReset}/>
                </View>
                <FlatList
                    style={{marginTop: 100}}
                    data={data}
                    renderItem={({item}) => {
                        return (
                            <ListItem
                                title={`#${item.id} - ${item.first_name} ${item.last_name} - ${moment().diff(item.dob, 'years')} years old - ${item.gender}`}
                                subtitle={item.gender}
                                bottomDivider
                            />
                        )
                    }}
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
});
