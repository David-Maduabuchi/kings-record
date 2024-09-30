import React, { ChangeEvent } from "react";
import "./optionsField.scss";

interface OptionsFieldProps {
  options: string[];
  label: string;
  dataLabel: string;
  value: string; // Value now comes from the parent
  onInputChange: (name: string, value: string) => void; // Passes back the selected option to the parent
}

const OptionsField: React.FC<OptionsFieldProps> = ({
  dataLabel,
  options,
  label,
  value, // Use this value from the parent
  onInputChange,
}) => {
  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    onInputChange(dataLabel, selectedValue); // Update form data in parent
  };

  return (
    <div className="optionsContainer">
      <select
        className="dropDownContainer"
        value={value} // Controlled by parent
        onChange={handleOptionChange}
      >
        <option value="" disabled>
          {label}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OptionsField;
