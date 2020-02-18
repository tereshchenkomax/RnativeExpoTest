import React from 'react';
import {Picker, StyleSheet} from "react-native";

const GenderPicker = ({currentItem, pickeItems, genderFilterFunction}) => {
    return (
        <Picker
            selectedValue={currentItem}
            style={styles.picker}
            onValueChange={genderFilterFunction}
        >
            {pickeItems && pickeItems[0].value && pickeItems.map(item => {
                return (
                    <Picker.Item label={item.label} value={item.value} key={item.key}/>
                )
            })}
        </Picker>
    );
};

const styles = StyleSheet.create({
    picker: {height: 40, width: 100}
});

export default GenderPicker;
