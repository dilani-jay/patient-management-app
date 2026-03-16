export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Input: React.FC<InputProps> = ({
  label,
  id,
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
        </label>
      )}

      <input
        id={id}
        className={`block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 
        outline outline-1 -outline-offset-1 outline-gray-300 
        placeholder:text-gray-400 
        focus:outline focus:outline-2 focus:-outline-offset-2 
        focus:outline-indigo-600 sm:text-sm/6
        ${className}`}
        {...props}
      />
    </div>
  )
}

export default Input;