import React from 'react';
import { Portal, Dialog, Paragraph, Button } from 'react-native-paper';

interface SessionExpiredDialogProps {
  visible: boolean;
  onDismiss: () => void;
}

const SessionExpiredDialog: React.FC<SessionExpiredDialogProps> = ({ visible, onDismiss }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Sesión Expirada</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Su sesión ha expirado, por favor vuelva a autenticarse. Disculpe las molestias.</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Aceptar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default SessionExpiredDialog;