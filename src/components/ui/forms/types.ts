import { Control, FieldPath, FieldValues } from 'react-hook-form';

export interface BaseFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}
