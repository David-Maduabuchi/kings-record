import React from "react";
import "./InputField.scss";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type = "email",
  label,
  placeholder,
  ...otherProps
}) => {
  return (
    <div className="InputComponent">
      <label
        htmlFor={type}
      className="text-sm font-medium leading-6 text-[#2D3748]"
      >
        {label}
        <span className="red-color ml-1">{otherProps.required && "*"}</span>
      </label>
      <div className="mt-2">
        <input
          id={label}
          name={type}
          autoComplete="off"
          type={type}
          placeholder={placeholder} // Add placeholder if provided
          {...otherProps}
          className=" block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};

export default InputField;
