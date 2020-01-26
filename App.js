import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import axios from 'axios';
import ErrorBoundary from "./components/ErrorBoundary";

const fetchData = async () => {
    try {
        let users = await axios.get('https://jsonplaceholder.typicode.com/users'); //TODO new URL
        return await users.data;
    } catch (error) {
        throw error;
    }
};

export default function App() {

    const [data, setData] = useState([]);


    useEffect( () => {
        fetchData()
            .then(data => setData(data))
    }, []);

    return (
        <ErrorBoundary>
            <View style={styles.container}>
                <Text>Open up App.js to start working on your app!</Text>
                {data.map(user => {
                  return <Text key={user.id}>{user.name}</Text>
                })}
            </View>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
// import React, {useState} from 'react';
//
// import {
//     StyleSheet,
//     Text,
//     View,
//     TouchableOpacity,
//     TextInput,
//     ScrollView
// } from 'react-native';
//
// import ErrorBoundary from 'react-native-error-boundary'
// // import ErrorBoundary from './components/ErrorBoundary'
// import TodoList from './components/TodoList';
// import Icon from 'react-native-vector-icons/Feather';
//
// const errorHandler = (error, stackTrace) => {
//     /* Log the error to an error reporting service */
//     console.log(error, stackTrace)
// }
//
// export default function App() {
//     const [value, setValue] = useState('');
//     const [todos, setTodos] = useState([]);
//
//     const addTodo = () => {
//         if (value.length > 0) {
//             setTodos([...todos, {text: value, key: Date.now(), checked: false}]);
//             setValue('');
//         }
//     };
//
//
//     return (
//         <ErrorBoundary onError={errorHandler}>
//             <View style={styles.container}>
//                 <Text style={styles.header}>Todo List</Text>
//                 <View style={styles.textInputContainer}>
//                     <TextInput
//                         style={styles.textInput}
//                         multiline={true}
//                         placeholder="What do you want to do today?"
//                         placeholderTextColor="#abbabb"
//                         value={value}
//                         onChangeText={value => setValue(value)}
//                     />
//                     <Text onPress={() => addTodo()}>
//                         >
//                         <Icon name="plus" size={30} color="blue" style={{marginLeft: 15}}/>
//                     </Text>
//                 </View>
//                 <ScrollView style={{width: '100%'}}>
//                     {todos.map(item => (
//                         <TodoList text={item.text} key={item.key}/>
//                     ))}
//                 </ScrollView>
//             </View>
//         </ErrorBoundary>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         backgroundColor: '#F5FCFF'
//     },
//     header: {
//         marginTop: '15%',
//         fontSize: 20,
//         color: 'red',
//         paddingBottom: 10
//     },
//     textInputContainer: {
//         flexDirection: 'row',
//         alignItems: 'baseline',
//         borderColor: 'black',
//         borderBottomWidth: 1,
//         paddingRight: 10,
//         paddingBottom: 10
//     },
//     textInput: {
//         flex: 1,
//         height: 20,
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: 'black',
//         paddingLeft: 10,
//         minHeight: '3%'
//     }
// });