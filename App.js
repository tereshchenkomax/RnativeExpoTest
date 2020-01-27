import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native';
import {SearchBar, ListItem} from 'react-native-elements';
import axios from 'axios';
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {

    const [data, setData] = useState([]);
    const [error, setError] = useState(false);
    const [loading, isLoading] = useState(false);

    const searchFilterFunction = text => {
        const arrayholder = [];
        const newData = arrayholder.filter(item => {
            const itemData = `${item.name.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });

        setData(data)
    };

    const fetchData = async () => {
        try {
            let users = await axios.get('https://jsonplaceholder.typicode.com/users'); //TODO new URL
            return await users.data;
        } catch (error) {
            throw error;
        }
    };

    const renderHeader = () => {
        return (
            <SearchBar
                placeholder="Type Here..."
                lightTheme
                round
                onChangeText={text => searchFilterFunction(text)}
                autoCorrect={false}
            />
        );
    };

    useEffect(() => {
        isLoading(true);
        fetchData()
            .then(data => {
                setData(data);
                isLoading(false);
            })
            .catch(err => setError(err))

    }, []);

    if (loading) {
        return (
            <ErrorBoundary>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator />
                </View>
            </ErrorBoundary>
        )
    }
    return (
        <ErrorBoundary>
            <View style={styles.filter}>
                <Text>Open up App.js to start working on your app!</Text>
                {data.map(user => {
                    return (
                        <View key={user.id}><Text>{user.name}</Text>
                            <Text>{user.email}</Text></View>
                    )
                })}
            </View>
            <View style={styles.container}>
                <Text>Open up App.js to start working on your app!</Text>
                <FlatList
                    data={data}
                    renderItem={({item}) => (
                        <ListItem
                            title={item.name}
                        />
                    )}
                    keyExtractor={item => item.id}
                />
            </View>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filter: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

// import React, { Component } from 'react';
// import { View, Text, FlatList, ActivityIndicator } from 'react-native';
// import { ListItem, SearchBar } from 'react-native-elements';
//
// class FlatListDemo extends Component {
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             loading: false,
//             data: [],
//             error: null,
//         };
//
//         this.arrayholder = [];
//     }
//
//     componentDidMount() {
//         this.makeRemoteRequest();
//     }
//
//     makeRemoteRequest = () => {
//         const url = `https://randomuser.me/api/?&results=20`;
//         this.setState({ loading: true });
//
//         fetch(url)
//             .then(res => res.json())
//             .then(res => {
//                 this.setState({
//                     data: res.results,
//                     error: res.error || null,
//                     loading: false,
//                 });
//                 this.arrayholder = res.results;
//             })
//             .catch(error => {
//                 this.setState({ error, loading: false });
//             });
//     };
//
//     renderSeparator = () => {
//         return (
//             <View
//                 style={{
//                     height: 1,
//                     width: '86%',
//                     backgroundColor: '#CED0CE',
//                     marginLeft: '14%',
//                 }}
//             />
//         );
//     };
//
//     searchFilterFunction = text => {
//         this.setState({
//             value: text,
//         });
//
//         const newData = this.arrayholder.filter(item => {
//             const itemData = `${item.name.title.toUpperCase()} ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
//             const textData = text.toUpperCase();
//
//             return itemData.indexOf(textData) > -1;
//         });
//         this.setState({
//             data: newData,
//         });
//     };
//
//     renderHeader = () => {
//         return (
//             <SearchBar
//                 placeholder="Type Here..."
//                 lightTheme
//                 round
//                 onChangeText={text => this.searchFilterFunction(text)}
//                 autoCorrect={false}
//                 value={this.state.value}
//             />
//         );
//     };
//
//     render() {
//         if (this.state.loading) {
//             return (
//                 <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//                     <ActivityIndicator />
//                 </View>
//             );
//         }
//         return (
//             <View style={{ flex: 1 }}>
//                 <FlatList
//                     data={this.state.data}
//                     renderItem={({ item }) => (
//                         <ListItem
//                             leftAvatar={{ source: { uri: item.picture.thumbnail } }}
//                             title={`${item.name.first} ${item.name.last}`}
//                             subtitle={item.email}
//                         />
//                     )}
//                     keyExtractor={item => item.email}
//                     ItemSeparatorComponent={this.renderSeparator}
//                     ListHeaderComponent={this.renderHeader}
//                 />
//             </View>
//         );
//     }
// }
//
// export default FlatListDemo;
