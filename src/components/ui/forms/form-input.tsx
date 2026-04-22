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
  Input 
} from '@/components/ui';
import { cn } from '@/lib';
import { BaseFieldProps } from './types';

export function FormInput<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  description,
  containerClassName,
  labelClassName,
  inputClassName,
  type = 'text',
  placeholder,
  className,
  ...props
}: BaseFieldProps<TFieldValues, TName> & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={containerClassName}>
          {label && (
            <FormLabel className={cn("font-mono text-[10px] uppercase tracking-widest", labelClassName)}>
              {label}
            </FormLabel>
          )}
          <FormControl>
            <Input 
              {...field} 
              {...props}
              type={type}
              placeholder={placeholder}
              className={cn(
                "rounded-none border-2 border-black h-11",
                type !== 'date' && type !== 'time' && "italic font-bold",
                type === 'date' || type === 'time' ? "font-mono" : "",
                field.name === 'slug' && "font-mono text-sm italic-none font-normal",
                className,
                inputClassName
              )} 
            />
          </FormControl>
          {description && <FormDescription className="italic text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
