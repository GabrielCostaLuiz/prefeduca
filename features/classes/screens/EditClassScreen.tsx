import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { ClassForm } from '../components/ClassForm';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useClassStore } from '../class.store';

export function EditClassScreen() {
  const { classId } = useLocalSearchParams();
  const { getClass, updateClass } = useClassStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const clazz = getClass(classId as string);

  if (!clazz) return <ActivityIndicator />;

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    await updateClass(clazz.id, data);
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
            <Heading size="xl" className="mb-2 text-secondary-900">Editar Turma</Heading>
            <ClassForm initialData={clazz} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
}
