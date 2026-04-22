'use client';

import * as React from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  Switch 
} from '@/components/ui';
import { cn } from '@/lib';
import { BaseFieldProps } from './types';

export function FormSwitch<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  description,
  containerClassName,
}: BaseFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-center justify-between rounded-none border-2 border-black p-4 shadow-inner bg-muted/10", containerClassName)}>
          <div className="space-y-0.5">
            {label && <FormLabel className="font-bold italic uppercase text-sm">{label}</FormLabel>}
            {description && <FormDescription className="italic text-xs">{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch 
              checked={field.value} 
              onCheckedChange={field.onChange} 
              className="data-[state=checked]:bg-primary" 
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
