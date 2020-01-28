import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native';
import {SearchBar, ListItem} from 'react-native-elements';
import axios from 'axios';
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {

    const [data, setData] = useState([]);
    const [holderData, setholderData] = useState([]);
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);
    const [loading, isLoading] = useState(false);

    const fetchData = async () => {
        try {
            let url = 'https://gorest.co.in/public-api/users?_format=json&access-token=xAj8EbuOqdkAvS_0kSRv49F0YrRO8skgwSh4';
            let users = await axios.get(url);
            return users
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        isLoading(true);
        fetchData()
            .then(({data}) => {
                isLoading(false);
                setData(data.result);
                setholderData(data.result);
            })
            .catch(err => {
                setError(err);
                console.log(err)
                isLoading(false);
            })

    }, []);

    const searchFilterFunction = text => {
        const newData = holderData.filter(item => {
            const itemFNData = `${item.first_name.toUpperCase()}`;
            const itemLNData = `${item.last_name.toUpperCase()}`;
            const textData = text.toUpperCase();

            return (itemFNData.indexOf(textData) > -1) || (itemLNData.indexOf(textData) > -1)
        });
        setValue(text);
        setData(newData)
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
                <FlatList
                    data={data}
                    renderItem={({item}) => {
                        return (
                            <ListItem
                                title={`${item.first_name} ${item.last_name}`}
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
                        value={value}
                    />}
                />
            </View>

        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
        // alignItems: 'center',
        // justifyContent: 'center',
    },
});
