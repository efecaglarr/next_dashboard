import { motion } from "framer-motion";

interface AuthInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

export const AuthInput = ({ type, placeholder, value, onChange, required = true, className }: AuthInputProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative w-full px-4"
    >
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className={`
          w-full px-6 py-4 text-base border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200 ease-in-out
          placeholder-gray-400 bg-white/50
          ${className}
        `}
        placeholder={placeholder}
      />
    </motion.div>
  );
}; 