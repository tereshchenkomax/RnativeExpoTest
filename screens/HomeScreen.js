import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import moment from 'moment';
import ErrorBoundary from "../components/ErrorBoundary";
import GenderPicker from "../components/GenderPicker";
import OverlayComponent from "../components/OverlayComponent";
import {List} from "../components/List";
import {pickeritems} from "../data/pickeritems"
import {fetchData} from "../utils/fetchdata";
import {AgeFilter} from "../components/AgeFilter";

export default function HomeScreen() {

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
                return (!searchRegex ||
                    searchValue.length <= 2 ||
                    searchRegex.test(person.first_name) ||
                    searchRegex.test(person.last_name)) &&
                    (!gender || person.gender === gender) &&
                    (age.from <= moment().diff(person.dob, 'years')) &&
                    (age.to >= moment().diff(person.dob, 'years'))
            }
        );
        setTimeout(() => setSortedData(result), 400);
        isLoading(false);
    }, [searchValue, gender, age]);

    const overlayHandler = (id) => {
        setVisibleOverlay({
            visible: true,
            id: id
        });
    };

    const filterByID = id => {
        const newData = initialData.filter(item => (
            item.id !== id
        ));
        setinitialData(newData);
        setSortedData(newData);
    };

    const ageFilter = (text, index) => {
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <OverlayComponent overlay={overlay} setVisibleOverlay={setVisibleOverlay} filterById={filterByID}/>
                    <View style={styles.filterStyles}>
                        <GenderPicker currentItem={gender} pickeItems={pickeritems} setGender={setGender}/>
                        <AgeFilter age={age} ageFilter={ageFilter} reset={handleReset}/>
                    </View>
                    <List searchValue={searchValue} data={sortedData} overlayHandler={overlayHandler}
                          handleSearch={handleSearch}/>
                </View>
            </TouchableWithoutFeedback>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
