import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { CreateSchoolDTO } from '../school.types';

import { useSchoolStore } from '../school.store';
import { SchoolForm } from '../components/SchoolForm';
import { useClassStore } from '../../classes/class.store';
import { ClassForm, ClassFormValues } from '../../classes/components/ClassForm';
import { ClassCard } from '../../classes/components/ClassCard';
import { Class } from '../../classes/class.types';

import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  FlatList,
} from 'react-native';
import { Plus, Users, Edit2, Trash2 } from 'lucide-react-native';
import Container from '@/components/layout/Container';
import { EmptyState } from '@/components/shared/EmptyState';
import { SearchInput } from '@/components/shared/SearchInput';
import { AppModal } from '@/components/shared/AppModal';
import { DetailHeader } from '@/components/shared/DetailHeader';

export function SchoolDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getSchool, deleteSchool, updateSchool, fetchSchools } =
    useSchoolStore();
  const {
    classes,
    fetchClasses,
    isLoading: loadingClasses,
    addClass,
    deleteClass,
    updateClass,
  } = useClassStore();
  const school = getSchool(id as string);

  const [searchQuery, setSearchQuery] = useState('');
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSchools();
      fetchClasses(id as string);
    }
  }, [id, fetchClasses, fetchSchools]);

  const filteredClasses = useMemo(() => {
    if (!searchQuery) return classes;
    const lowerQuery = searchQuery.toLowerCase();
    return classes.filter(
      (c: Class) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.room.toLowerCase().includes(lowerQuery),
    );
  }, [classes, searchQuery]);

  if (!school)
    return (
      <Container>
        <ActivityIndicator size="large" color="#1e40af" />
      </Container>
    );

  const handleUpdateSchool = async (data: CreateSchoolDTO) => {
    setIsSubmitting(true);
    await updateSchool(school.id, data);
    setIsSubmitting(false);
    setIsSchoolModalOpen(false);
  };

  const handleDeleteSchool = () => {
    Alert.alert(
      'Excluir Escola',
      'Tem certeza que deseja excluir esta unidade?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteSchool(school.id);
            router.back();
          },
        },
      ],
    );
  };

  const handleCreateOrUpdateClass = async (data: ClassFormValues) => {
    setIsSubmitting(true);
    if (editingClass) {
      const { schoolId, ...updateData } = data;
      await updateClass(editingClass.id, updateData);
    } else {
      await addClass(id as string, data);
    }
    setIsSubmitting(false);
    setIsClassModalOpen(false);
    setEditingClass(null);
  };

  const handleEditClass = (clazz: Class) => {
    setEditingClass(clazz);
    setIsClassModalOpen(true);
  };

  const handleDeleteClass = (classId: string) => {
    Alert.alert('Excluir Turma', 'Tem certeza que deseja remover esta turma?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          await deleteClass(classId);
        },
      },
    ]);
  };

  return (
    <Container>
      <DetailHeader
        title={school.name}
        onBack={() => router.back()}
        options={[
          {
            key: 'edit',
            title: 'Editar Unidade',
            action: () => setIsSchoolModalOpen(true),
            icon: Edit2,
          },
          {
            key: 'delete',
            title: 'Excluir Unidade',
            action: handleDeleteSchool,
            icon: Trash2,
            isDestructive: true,
          },
        ]}
      />

      {loadingClasses && classes.length === 0 ? (
        <Box className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1e40af" />
        </Box>
      ) : (
        <VStack space="md" className="flex-1">
          <Box className="bg-white p-6 mt-2 border-outline-50 rounded-2xl shadow-soft-1">
            <Box className="bg-secondary-50 p-3 rounded-xl border border-secondary-100">
              <Text className="text-black text-xs font-bold uppercase mb-1">
                Endereço
              </Text>
              <Text className="text-black font-medium">{school.address}</Text>
            </Box>
            <HStack space="md" className="mt-4">
              {[
                { title: 'Total de Turmas', value: classes.length },
                {
                  title: 'Total de Alunos',
                  value: classes.reduce(
                    (acc: number, c: Class) => acc + c.studentsCount,
                    0,
                  ),
                },
              ].map((item) => (
                <Box
                  key={item.title}
                  className="flex-1 bg-secondary-50 p-3 rounded-xl border border-secondary-100"
                >
                  <Text className="text-black text-xs font-bold uppercase mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-black text-xl font-black">
                    {item.value}
                  </Text>
                </Box>
              ))}
            </HStack>
          </Box>

          <Box className="mt-2 px-1">
            <HStack className="justify-between items-center mb-2">
              <Heading size="lg" className="text-black font-bold">
                Turmas Vinculadas
              </Heading>
              <Button
                size="sm"
                variant="link"
                onPress={() => {
                  setEditingClass(null);
                  setIsClassModalOpen(true);
                }}
                className="py-1"
              >
                <ButtonIcon as={Plus} className="text-primary-0 mr-1" />
                <ButtonText className="text-primary-0 font-bold">
                  Nova Turma
                </ButtonText>
              </Button>
            </HStack>

            <SearchInput
              placeholder="Buscar turma ou sala..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Box>

          <FlatList
            data={filteredClasses}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
            ItemSeparatorComponent={() => <Box className="h-4" />}
            refreshControl={
              <RefreshControl
                refreshing={loadingClasses}
                onRefresh={() => fetchClasses(id as string)}
                colors={['#1e40af']}
              />
            }
            renderItem={({ item }) => (
              <ClassCard
                item={item}
                onEdit={handleEditClass}
                onDelete={handleDeleteClass}
              />
            )}
            ListEmptyComponent={
              <EmptyState
                icon={Users}
                message={
                  searchQuery
                    ? 'Nenhuma turma encontrada nesta unidade.'
                    : 'Nenhuma turma cadastrada nesta escola.'
                }
              />
            }
          />
        </VStack>
      )}

      <AppModal
        isOpen={isClassModalOpen}
        onClose={() => {
          setIsClassModalOpen(false);
          setEditingClass(null);
        }}
        title={editingClass ? 'Editar Turma' : 'Nova Turma'}
      >
        <ClassForm
          initialData={editingClass || { schoolId: id as string }}
          onSubmit={handleCreateOrUpdateClass}
          isSubmitting={isSubmitting}
          hideSchoolField={true}
        />
      </AppModal>

      <AppModal
        isOpen={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
        title="Editar Unidade"
      >
        <SchoolForm
          initialData={school}
          onSubmit={handleUpdateSchool}
          isSubmitting={isSubmitting}
        />
      </AppModal>
    </Container>
  );
}
