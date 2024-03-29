import React from "react";

interface ITextInputProps {
  label?: string;
  name?: string;
  placeholder?: string;
  value: string | number;
  type?: "text" | "number";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | false | undefined;
  action?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}

const TextInput: React.FunctionComponent<ITextInputProps> = ({
  label = "",
  name = "",
  placeholder = "Type here",
  value = "",
  type = "text",
  onChange,
  error = "",
  action,
  required = false,
  disabled = false,
}: ITextInputProps) => {
  return (
    <label className="form-control w-full">
      {label && (
        <div className="label -mb-1 flex justify-start gap-0.5">
          <span className="label-text text-base font-medium">{label}</span>
          {required && <span className="font-bold text-red-600">*</span>}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        className={`input input-md input-bordered w-full text-base disabled:bg-gray-100 ${error ? "input-error" : ""}`}
        onChange={onChange}
      />
      {action && <>{action}</>}
      {error && (
        <div className="label -mt-1.5">
          <span className="label-text text-base text-red-600">{error}</span>
        </div>
      )}
    </label>
  );
};

export default TextInput;
