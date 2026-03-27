import React from 'react';
import { 
  Modal, 
  ModalBackdrop, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton 
} from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading';
import { X } from 'lucide-react-native';

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
}

export function AppModal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md' 
}: AppModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size={size}
    >
      <ModalBackdrop />
      <ModalContent className="rounded-3xl shadow-soft-1">
        <ModalHeader className="border-b border-outline-50 pb-2">
          <Heading size="lg" className="text-black font-bold">{title}</Heading>
          <ModalCloseButton>
            <X size={20} className="text-typography-500" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
