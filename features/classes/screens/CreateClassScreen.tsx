import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { ClassForm } from '../components/ClassForm';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useClassStore } from '../class.store';

export function CreateClassScreen() {
  const { id } = useLocalSearchParams();
  const { addClass } = useClassStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    await addClass(id as string, data);
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
            <Heading size="xl" className="mb-2 text-secondary-900">
              Cadastrar Nova Turma
            </Heading>
            <ClassForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
}
