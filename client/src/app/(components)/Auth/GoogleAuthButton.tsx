import Image from 'next/image';

interface GoogleAuthButtonProps {
  onClick: () => void;
  text: string;
}

export const GoogleAuthButton = ({ onClick, text }: GoogleAuthButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
        text-gray-700 dark:text-gray-300 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 
        flex items-center justify-center gap-2 transition-all duration-200"
    >
      <Image src="/images/google-icon.svg" alt="Google" width={20} height={20} className="dark:invert" />
      {text}
    </button>
  );
}; 