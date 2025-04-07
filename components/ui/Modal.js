// components/ui/Modal.js

import React from 'react';
import { Modal as RNModal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import Typography from './Typography';

const Modal = ({
  visible,
  onClose,
  title,
  children,
  footer,
  closeIcon = true,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            {title && (
              <Typography variant="h3">{title}</Typography>
            )}
            
            {closeIcon && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Typography variant="body" color="light">✕</Typography>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.content}>
            {children}
          </View>
          
          {footer && (
            <View style={styles.footer}>
              {footer}
            </View>
          )}
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.lg,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.borderRadius,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  closeButton: {
    padding: SIZES.xs,
  },
  content: {
    padding: SIZES.md,
  },
  footer: {
    padding: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default Modal;