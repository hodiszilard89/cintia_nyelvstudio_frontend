import { useState } from 'react';
import  axiosClient  from '../api/axiosClient'; // Igazítsd az elérési utat, ha máshol van

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyToken = async (googleToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post('/auth/google', {
        token: googleToken,
      });
      setIsLoading(false);
      return response.data;
    } catch (err: any) {
      setIsLoading(false);
      const errorMessage = err.response?.data || 'Hitelesítési hiba a szerveren';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return { verifyToken, isLoading, error };
};