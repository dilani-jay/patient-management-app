interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string,
  requiredIndicator?: boolean
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  required,
  requiredIndicator = false,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
          {requiredIndicator && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          required={required}
          className={`block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 
        outline outline-1 -outline-offset-1 outline-gray-300 
        placeholder:text-gray-400 
        focus:outline focus:outline-1 focus:-outline-offset-1 
        focus:outline-blue-600 sm:text-sm/6
        ${className}`}
          {...props}
        />
        {requiredIndicator && !label && (
          <span className="absolute right-2 top-1 text-red-500 text-sm">
            *
          </span>
        )}
      </div>
    </div>
  )
}

export default Input;