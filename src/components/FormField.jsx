import React from 'react';

/**
 * Reusable form field component
 */
const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
  options = [],
  className = '',
  disabled = false,
  min,
  max,
  step
}) => {
  const baseInputClasses = "w-full px-4 py-3 border rounded-airbnb-lg focus:outline-none focus:ring-2 focus:ring-airbnb-red-500 focus:border-transparent transition-all duration-200 bg-white";
  const inputClasses = `${baseInputClasses} ${error ? 'border-airbnb-red-500' : 'border-airbnb-200'} ${className}`;

  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
            disabled={disabled}
          >
            <option value="">{placeholder || `Select ${label.toLowerCase()}...`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={inputClasses}
            disabled={disabled}
            rows={4}
          />
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            name={name}
            checked={value}
            onChange={onChange}
            className="h-4 w-4 text-airbnb-red-500 focus:ring-airbnb-red-500 border-airbnb-200 rounded"
            disabled={disabled}
          />
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={inputClasses}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-airbnb-700 mb-2">
        {label} {required && <span className="text-airbnb-red-500">*</span>}
      </label>
      {renderField()}
      {error && (
        <p className="mt-1 text-sm text-airbnb-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField; 