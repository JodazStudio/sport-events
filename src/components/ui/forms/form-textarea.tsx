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
  Textarea 
} from '@/components/ui';
import { cn } from '@/lib';
import { BaseFieldProps } from './types';

export function FormTextarea<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  description,
  containerClassName,
  placeholder,
  rows = 3,
  className,
  ...props
}: BaseFieldProps<TFieldValues, TName> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={containerClassName}>
          {label && <FormLabel className="font-mono text-[10px] uppercase tracking-widest">{label}</FormLabel>}
          <FormControl>
            <Textarea 
              {...field} 
              {...props}
              placeholder={placeholder}
              rows={rows}
              className={cn("rounded-none border-2 border-black italic min-h-[100px]", className)} 
            />
          </FormControl>
          {description && <FormDescription className="italic text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
