import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { SchoolForm } from '../components/SchoolForm';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useSchoolStore } from '../school.store';

export function EditSchoolScreen() {
  const { id } = useLocalSearchParams();
  const { getSchool, updateSchool } = useSchoolStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const school = getSchool(id as string);

  if (!school) return <ActivityIndicator />;

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    await updateSchool(school.id, data);
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
            <Heading size="xl" className="mb-2 text-secondary-900">Editar Escola</Heading>
            <SchoolForm initialData={school} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
}
