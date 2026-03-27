import { Box } from '@/components/ui/box';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Select, 
  SelectTrigger, 
  SelectInput, 
  SelectIcon, 
  SelectPortal, 
  SelectBackdrop, 
  SelectContent, 
  SelectDragIndicator, 
  SelectDragIndicatorWrapper, 
  SelectItem 
} from '@/components/ui/select';
import { ChevronDownIcon } from 'lucide-react-native';
import { useSchoolStore } from '../../schools/school.store';

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  room: z.string().min(2, 'A sala deve ser informada'),
  schoolId: z.string().min(1, 'A escola deve ser selecionada'),
});

type FormData = z.infer<typeof schema>;

interface ClassFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
  hideSchoolField?: boolean;
}

export function ClassForm({ initialData, onSubmit, isSubmitting, hideSchoolField }: ClassFormProps) {
  const { schools, fetchSchools } = useSchoolStore();

  useEffect(() => {
    if (schools.length === 0) fetchSchools();
  }, [fetchSchools]);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      room: initialData?.room || '',
      schoolId: initialData?.schoolId || '',
    },
  });

  return (
    <VStack space="lg">
      <FormControl isInvalid={!!errors.name}>
        <FormControlLabel>
          <FormControlLabelText>Nome da Turma</FormControlLabelText>
        </FormControlLabel>
        <Input variant="outline" size="md">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                placeholder="Ex: 101A"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </Input>
        <FormControlError>
          <FormControlErrorText>{errors.name?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={!!errors.room}>
        <FormControlLabel>
          <FormControlLabelText>Sala de Aula</FormControlLabelText>
        </FormControlLabel>
        <Input variant="outline" size="md">
          <Controller
            control={control}
            name="room"
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                placeholder="Ex: Sala 01"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </Input>
        <FormControlError>
          <FormControlErrorText>{errors.room?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      {!hideSchoolField && (
        <FormControl isInvalid={!!errors.schoolId}>
          <FormControlLabel>
            <FormControlLabelText>Vincular à Escola</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="schoolId"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} selectedValue={value}>
                <SelectTrigger variant="outline" size="md">
                  <SelectInput placeholder="Selecione a unidade" />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {schools.map((school) => (
                      <SelectItem 
                        key={school.id} 
                        label={school.name} 
                        value={school.id} 
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          />
          <FormControlError>
            <FormControlErrorText>{errors.schoolId?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>
      )}

      <Button 
        onPress={handleSubmit(onSubmit)} 
        disabled={isSubmitting}
        className="bg-primary-0 mt-4 h-12 rounded-xl"
      >
        {isSubmitting ? (
          <ButtonSpinner color="#fff" />
        ) : (
          <ButtonText className="font-bold text-lg">Salvar Turma</ButtonText>
        )}
      </Button>
    </VStack>
  );
}
