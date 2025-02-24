import Image from 'next/image';

interface GoogleAuthButtonProps {
  onClick: () => void;
  text: string;
}

export const GoogleAuthButton = ({ onClick, text }: GoogleAuthButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-gray-300 text-gray-700 p-2 rounded hover:bg-gray-50 flex items-center justify-center gap-2"
    >
      <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
      {text}
    </button>
  );
}; 