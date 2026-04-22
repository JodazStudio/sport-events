'use client';

import * as React from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui';
import { BaseFieldProps } from './types';

export function FormSelect<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  description,
  containerClassName,
  placeholder,
  options,
  ...props
}: BaseFieldProps<TFieldValues, TName> & {
  options: { value: string; label: string; email?: string }[];
  placeholder?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={containerClassName}>
          {label && <FormLabel className="font-mono text-[10px] uppercase tracking-widest">{label}</FormLabel>}
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="rounded-none border-2 border-black h-11 font-bold italic">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="rounded-none border-2 border-black">
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="font-medium italic">
                  {opt.label} {opt.email && `(${opt.email})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription className="italic text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
