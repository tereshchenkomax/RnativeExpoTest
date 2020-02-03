import React, {useState} from 'react';
import {Button, Text, StyleSheet} from "react-native";
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
            <Text>Вы действительно хотите пригласить на свидание пользователя с id = {overlay.id}?</Text>
            <Button onPress={() => setInvitation(true)} title={'ДА'}/>
            <Button onPress={() => setVisibleOverlay({visible: false})} title={'НЕТ'}/>
        </Overlay>
        ) : (
            <Overlay isVisible={overlay.visible}
                     overlayStyle={styles.overlay}>
                <Text>Приглашение отправлено</Text>
                <Button onPress={handleOKpress} title={'OK'} />
            </Overlay>
        )
    );
}

const styles = StyleSheet.create({
    overlay: {flexDirection: 'column', justifyContent: 'center', alignContent: 'center'}
});

export default OverlayComponent;
