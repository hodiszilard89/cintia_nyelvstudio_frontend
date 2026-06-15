import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import type { VocabularyWordDTO } from '../types';

export const useVocabulary = (lessonId: number) => {
    const [words, setWords] = useState<VocabularyWordDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWords = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get<VocabularyWordDTO[]>(`/vocabulary/lesson/${lessonId}`);
                setWords(response.data);
                setError(null);
            } catch (err) {
                setError('Hiba történt a szavak letöltésekor.');
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) {
            fetchWords();
        }
    }, [lessonId]);

    return { words, loading, error };
};