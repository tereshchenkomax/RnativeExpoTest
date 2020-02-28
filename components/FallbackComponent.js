import React from 'react';
import {StyleSheet, Text} from 'react-native'

const FallbackComponent = () => {
    return (
        <Text style={styles.error}>
            Opps! These's an error
        </Text>
    );
};

const styles = StyleSheet.create({
        error: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
    }
)

export default FallbackComponent;
