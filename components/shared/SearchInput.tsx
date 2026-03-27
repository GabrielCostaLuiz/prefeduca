import React from 'react';
import { Box } from '@/components/ui/box';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react-native';

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  className?: string;
}

export function SearchInput({ placeholder, value, onChangeText, className = "" }: SearchInputProps) {
  return (
    <Box className={`my-4 ${className}`}>
      <Input 
        variant="outline" 
        size="md" 
        className="rounded-2xl border-outline-100 bg-white items-center shadow-sm h-12"
      >
        <InputSlot className="pl-4">
          <InputIcon as={SearchIcon} className="text-primary-500" />
        </InputSlot>
        <InputField
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          className="text-typography-900"
        />
      </Input>
    </Box>
  );
}
