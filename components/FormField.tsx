import { Controller, Control, FieldValues, Path } from "react-hook-form";

import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: FormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
  <FormItem>
    <FormLabel className="label">{label}</FormLabel>
    <FormControl>
      <Input
        className="input"
        type={type}
        placeholder={placeholder}
        {...field}
      />
    </FormControl>
    
    {fieldState.error && (
      <p className="text-sm text-red-500">
        {fieldState.error.message}
      </p>
    )}
  </FormItem>
)}

    />
  );
};

export default FormField;