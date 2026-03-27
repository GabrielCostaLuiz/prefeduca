import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { SchoolForm } from '../components/SchoolForm';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSchoolStore } from '../school.store';

export function CreateSchoolScreen() {
  const { addSchool } = useSchoolStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    await addSchool(data);
    setIsSubmitting(false);
    router.back();
  };

  return (
    <Box className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView>
          <Box className="p-6">
            <Heading size="xl" className="mb-2 text-secondary-900">Cadastrar Nova Unidade</Heading>
            <SchoolForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
}
