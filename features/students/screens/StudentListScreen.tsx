import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Input, InputField } from '@/components/ui/input';

import { useClassStore } from '../../classes/class.store';
import { useStudentStore } from '../student.store';
import { Class } from '../../classes/class.types';
import { Student } from '../student.types';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import { ActivityIndicator, Alert, RefreshControl, FlatList } from 'react-native';
import {  Plus, Edit2, Trash2, Users2 } from 'lucide-react-native';
import { ClassForm, ClassFormValues } from '../../classes/components/ClassForm';

import Container from '@/components/layout/Container';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { SearchInput } from '@/components/shared/SearchInput';
import { AppModal } from '@/components/shared/AppModal';
import { EmptyState } from '@/components/shared/EmptyState';
import { DetailHeader } from '@/components/shared/DetailHeader';
import { StudentCard } from '../components/StudentCard';

export function StudentListScreen() {
  const { id, classId } = useLocalSearchParams();
  const { getClass, deleteClass, updateClass } = useClassStore();
  const { students, isLoading, fetchStudents, addStudent, deleteStudent, updateStudent } = useStudentStore();
  
  const clazz = getClass(classId as string) as Class | undefined;

  const [searchQuery, setSearchQuery] = useState('');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentName, setStudentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (classId) fetchStudents(classId as string);
  }, [classId, fetchStudents]);

  useEffect(() => {
    if (editingStudent) {
      setStudentName(editingStudent.name);
    } else {
      setStudentName('');
    }
  }, [editingStudent]);

  const filteredStudents = useMemo(() => {
    const classStudents = students.filter((s: Student) => s.classId === classId);
    if (!searchQuery) return classStudents;
    const lowerQuery = searchQuery.toLowerCase();
    return classStudents.filter((s: Student) => s.name.toLowerCase().includes(lowerQuery));
  }, [students, searchQuery, classId]);

  if (!clazz) return (
    <Container>
      <ActivityIndicator size="large" color="#1e40af" />
    </Container>
  );

  const handleCreateOrUpdateStudent = async () => {
    if (!studentName.trim()) return;
    setIsSubmitting(true);
    if (editingStudent) {
      await updateStudent(editingStudent.id, studentName);
    } else {
      await addStudent(classId as string, studentName);
    }
    setIsSubmitting(false);
    setIsStudentModalOpen(false);
    setEditingStudent(null);
    setStudentName('');
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleUpdateClass = async (data: ClassFormValues) => {
    setIsSubmitting(true);
    const { schoolId, ...updateData } = data;
    await updateClass(clazz.id, updateData);
    setIsSubmitting(false);
    setIsClassModalOpen(false);
  };


  const handleDeleteClass = () => {
    Alert.alert('Excluir Turma', 'Essa ação é irreversível e removerá todos os dados da turma.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover Permanentemente', style: 'destructive', onPress: async () => {
        await deleteClass(clazz.id);
        router.push(`/schools/${id}`);
      }},
    ]);
  };

  const handleDeleteStudent = (studentId: string, name: string) => {
    Alert.alert('Remover Aluno', `Deseja remover ${name} da turma?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: async () => {
        await deleteStudent(studentId);
      }},
    ]);
  };

  return (
    <Container>
      <DetailHeader 
        title={clazz.name} 
        onBack={() => router.back()} 
        options={[
          {
            key: 'edit',
            title: 'Editar Turma',
            action: () => setIsClassModalOpen(true),
            icon: Edit2
          },
          {
            key: 'delete',
            title: 'Excluir Turma',
            action: handleDeleteClass,
            icon: Trash2,
            isDestructive: true
          }
        ]}
      />

      {isLoading && students.length === 0 ? (
        <Box className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1e40af" />
        </Box>
      ) : (
        <VStack space="md" className="flex-1">
          <Box className="bg-white p-6 mt-2 border-outline-50 rounded-2xl shadow-soft-1">
            <HStack className="justify-between items-center mb-4">
              <VStack>
                <Text className="text-black font-medium">Sala: {clazz.room}</Text>
                <HStack space="xs" className="items-center mt-1">
                  <Badge action="muted" variant="outline" className="rounded-md border-outline-100 px-2 py-0">
                    <BadgeText size="sm" className="text-typography-500 font-medium lowercase italic">{clazz.shift}</BadgeText>
                  </Badge>
                  <Text size="xs" className="text-typography-400 font-bold">•</Text>
                  <Text size="xs" className="text-typography-500 font-bold">{clazz.academicYear}</Text>
                </HStack>
              </VStack>
            </HStack>
            <Box className="bg-secondary-50 p-4 rounded-xl border border-secondary-100 flex-row items-center justify-between mt-2">
              <VStack>
                <Text className="text-black text-xs font-bold uppercase mb-1">Alunos na Turma</Text>
                <Text className="text-black text-3xl font-black">{filteredStudents.length}</Text>
              </VStack>
              <Box className="bg-secondary-300 p-3 rounded-full">
                <Users2 size={32} className="text-primary-600" />
              </Box>
            </Box>
          </Box>

          <Box className="mt-2 px-1">
            <HStack className="justify-between items-center mb-3">
              <Heading size="lg" className="text-black font-black">Chamada</Heading>
              <Button
                size="sm"
                variant="link"
                onPress={() => {
                  setEditingStudent(null);
                  setIsStudentModalOpen(true);
                }}
                className="py-1"
              >
                <ButtonIcon as={Plus} className="text-primary-0 mr-1" />
                <ButtonText className="text-primary-0 font-black">Novo Aluno</ButtonText>
              </Button>
            </HStack>

            <SearchInput
              placeholder="Buscar por nome do aluno..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Box>

          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
            ItemSeparatorComponent={() => <Box className="h-4" />}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => fetchStudents(classId as string)}
                colors={['#1e40af']}
              />
            }
            renderItem={({ item }) => (
              <StudentCard
                item={item}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
              />
            )}
            ListEmptyComponent={
              <EmptyState
                icon={Users2}
                message={searchQuery ? "Nenhum aluno encontrado para esta busca." : "Nenhum aluno cadastrado nesta turma."}
              />
            }
          />
        </VStack>
      )}


      <AppModal 
        isOpen={isStudentModalOpen} 
        onClose={() => {
          setIsStudentModalOpen(false);
          setEditingStudent(null);
        }} 
        title={editingStudent ? "Editar Aluno" : "Novo Aluno"}
      >
        <VStack space="lg" className="py-2">
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText className="text-black font-bold">Nome Completo do Aluno</FormControlLabelText>
            </FormControlLabel>
            <Input variant="outline" size="md" className="rounded-xl h-12">
              <InputField
                placeholder="Ex: João Silva Santos"
                value={studentName}
                onChangeText={setStudentName}
              />
            </Input>
          </FormControl>
      
          <Button
              size="md"
              onPress={handleCreateOrUpdateStudent}
              disabled={isSubmitting || !studentName}
              className="bg-primary-0 rounded-2xl h-12 shadow-md active:opacity-90 mt-2"
          >
              {isSubmitting ? <ActivityIndicator size="small" color="#fff" /> : <ButtonText className="font-bold">Salvar Aluno</ButtonText>}
          </Button>
        </VStack>
      </AppModal>

      <AppModal 
        isOpen={isClassModalOpen} 
        onClose={() => setIsClassModalOpen(false)} 
        title="Editar Turma"
      >
        <ClassForm 
          initialData={clazz} 
          onSubmit={handleUpdateClass} 
          isSubmitting={isSubmitting} 
          hideSchoolField={true}
        />
      </AppModal>
    </Container>
  );
}
