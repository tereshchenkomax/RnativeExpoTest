import React from 'react';
import {Picker, StyleSheet} from "react-native";

const GenderPicker = ({gender, genderFilterFunction}) => {
    console.log('genderpicker')
    return (
        <Picker
            selectedValue={gender}
            style={styles.picker}
            onValueChange={genderFilterFunction}
        >
            <Picker.Item label="Male" value="male"/>
            <Picker.Item label="Female" value="female"/>
            <Picker.Item label="Both" value="both"/>
        </Picker>
    );
};

const styles = StyleSheet.create({
    picker: {height: 15, width: 100}
});

export default GenderPicker;
