import { motion } from "framer-motion";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
  className?: string;
}

export const AuthLayout = ({ children, title, subtitle, className }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl ${className || ''}`}
      >
        <div className="text-center">
          <Image
            src="/images/fbm-b.png"
            width={140}
            height={50}
            alt="Logo"
            className="mx-auto mb-8"
          />
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-base text-gray-600"
          >
            {subtitle}
          </motion.p>
        </div>
        {children}
      </motion.div>
    </div>
  );
}; 