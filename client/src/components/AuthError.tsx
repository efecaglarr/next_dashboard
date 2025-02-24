interface AuthErrorProps {
  message: string;
  onRetry?: () => void;
}

export const AuthError = ({ message, onRetry }: AuthErrorProps) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <p className="font-bold">Authentication Error</p>
      <p className="text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try Again
        </button>
      )}
    </div>
  );
}; 