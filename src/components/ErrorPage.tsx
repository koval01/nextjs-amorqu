import { useEffect } from 'react';

export function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="p-4 bg-black text-white h-screen">
      <h1>Amorqu is broken...</h1>
      <h2>An unhandled error occurred!</h2>
      <blockquote>
        <pre>
          {error.message}
        </pre>
      </blockquote>
      {reset && <button onClick={() => reset()}>Try again</button>}
    </div>
  );
}