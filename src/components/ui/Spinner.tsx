import { useEffect } from "react";
import { useState } from "react";
const MAX_LOAD_BEFORE_REDIRECT = 10000

export default function Spinner() {
    const [loadingTimer, setLoadingTimer] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingTimer(loadingTimer + 1);
        }, 1000);

        if (loadingTimer > MAX_LOAD_BEFORE_REDIRECT) {
            window.location.href = '/';
        }
    }, [loadingTimer]);

    if (loadingTimer > MAX_LOAD_BEFORE_REDIRECT) {
        window.location.href = '/';
    }

  return (
    <div className="flex justify-center items-center h-screen">
        {loadingTimer > MAX_LOAD_BEFORE_REDIRECT && (
            <p>Redirecting to home page...</p>
        )}
      <div className="animate-spin rounded-full h-32 p-4 w-32 border-1 border-b-2 border-purple-500">

      <div className="animate-spin rounded-full h-full p-4 w-full border-l-2 border-b-2 border-purple-500">
        <div className="w-full h-full animate-spin border-r-2 p-4 border-b-2 border-indigo-500 rounded-full">
        </div>
        </div>
      </div>
    </div>
  );
}