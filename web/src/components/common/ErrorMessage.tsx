interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="terminal-center">
      <div className="terminal-error">{message}</div>
    </div>
  );
}
