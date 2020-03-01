import React, {useState} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from "react-native";
import {Overlay} from "react-native-elements";

function OverlayComponent({overlay, setVisibleOverlay, filterById}) {
    const [invitationSent, setInvitation] = useState(false);

    const handleOKpress = () => {
        setInvitation(false);
        setVisibleOverlay({visible: false});
        filterById(overlay.id);
    };

    return (
        !invitationSent ? (
        <Overlay isVisible={overlay.visible}
                 overlayStyle={styles.overlay}>
            <View style={styles.view}>
                <Text>Вы действительно хотите пригласить на свидание пользователя с id = {overlay.id}?</Text>
                <View style={styles.buttonsWrapper}>
                    <TouchableOpacity
                    style={styles.button}
                    onPress={() => setInvitation(true)}
                    >
                        <Text>ДА</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setVisibleOverlay({visible: false})}
                    >
                        <Text>
                            НЕТ
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Overlay>
        ) : (
            <Overlay isVisible={overlay.visible}
                     overlayStyle={styles.overlay}>
                <View style={styles.view}>
                    <Text>Приглашение отправлено</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleOKpress}
                    >
                        <Text>ОК</Text>
                    </TouchableOpacity>
                </View>
            </Overlay>
        )
    );
}

const styles = StyleSheet.create({
    overlay: {
        height: 500
    },
    view: {
        marginTop: 100,
        height: 300,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    spacing: {
        paddingTop: 20,
        marginBottom: 20
    },
    buttonsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button:{
        alignSelf: 'center',
        backgroundColor: '#DDDDDD',
        width: 100,
        padding: 10
    },
});

export default OverlayComponent;
