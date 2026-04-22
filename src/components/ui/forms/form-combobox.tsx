"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { FieldPath, FieldValues } from "react-hook-form";
import { 
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui";
import { cn } from "@/lib";
import { BaseFieldProps } from "./types";

interface FormComboboxProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> 
  extends BaseFieldProps<TFieldValues, TName> {
  options: { label: string; value: string }[];
  placeholder?: string;
  emptyText?: string;
}

export function FormCombobox<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  description,
  containerClassName,
  options,
  placeholder = "Seleccionar...",
  emptyText = "No se encontraron resultados.",
}: FormComboboxProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", containerClassName)}>
          {label && (
            <FormLabel className="font-mono text-[10px] uppercase tracking-widest font-bold">
              {label}
            </FormLabel>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between rounded-none border-2 border-black h-11 font-bold italic",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? options.find((opt) => opt.value === field.value)?.label
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 rounded-none border-2 border-black" align="start">
              <Command className="rounded-none">
                <CommandInput placeholder={`Buscar ${label?.toLowerCase()}...`} className="h-9 font-mono" />
                <CommandList>
                  <CommandEmpty>{emptyText}</CommandEmpty>
                  <CommandGroup>
                    {options.map((opt) => (
                      <CommandItem
                        value={opt.label}
                        key={opt.value}
                        onSelect={() => {
                          field.onChange(opt.value);
                        }}
                        className="font-medium italic"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            opt.value === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {description && <FormDescription className="italic text-xs">{description}</FormDescription>}
          <FormMessage className="text-[10px] font-bold uppercase" />
        </FormItem>
      )}
    />
  );
}
