"use client"
import { Button, Dialog, Portal, useDialog, Box, CloseButton } from "@chakra-ui/react"
import { useRef } from 'react';

export const ConfirmDialog = ({ 
  title = "Confirmar",
  message,
  onConfirm,
  confirmText = "Confirmar",
  children
}) => {
  const dialog = useDialog();
  const closeButtonRef = useRef(null);

  const handleConfirm = async () => {
    await onConfirm(); 
    closeButtonRef.current?.click(); 
  };

  return (
    <Dialog.RootProvider value={dialog}>
      <Dialog.Trigger asChild style={{ width: '100%' }}>
        <Box>{children}</Box>
      </Dialog.Trigger>
      
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            
            <Dialog.Body>{message}</Dialog.Body>
            
            <Dialog.Footer> {/* ← Esta línea */}
            <Dialog.ActionTrigger asChild>
              <Button onClick={handleConfirm}>
                {confirmText}
              </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
};