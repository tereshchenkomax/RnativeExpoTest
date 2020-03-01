import * as React from 'react';
import {Button, StyleSheet, Text, TextInput, View} from "react-native";

export const AgeFilter = ({age, ageFilter, reset}) => {
    return (
        <View style={styles.ageFilter}>
            <Text style={styles.text}>Age From</Text>
            <TextInput keyboardType={'numeric'}
                       placeholder={'From'}
                       onChangeText={text => ageFilter(text, 'from')}
                       maxLength={2} value={age.from}
                       style={styles.textInput}/>
            <Text style={styles.text}>To</Text>
            <TextInput keyboardType={'numeric'}
                       placeholder={'To'}
                       onChangeText={text => ageFilter(text, 'to')}
                       maxLength={2}
                       value={age.to}
                       style={styles.textInput}/>
            <Button
                title={'Reset'}
                onPress={reset}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    ageFilter: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignContent: 'center'
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
})
