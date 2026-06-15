import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import type { TranslationSentenceDTO } from '../types';

export const useSentences = (lessonId: number) => {
    // A memóriák szigorúan típusosak lettek
    const [sentences, setSentences] = useState<TranslationSentenceDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSentences = async () => {
            try {
                setLoading(true);
                // Itt is megmondjuk az Axiosnak, hogy milyen típusú választ várjon
                const response = await axiosClient.get(`/sentences/lesson/${lessonId}`);
                setSentences(response.data);


                setError(null);
            } catch (err) {
                setError('Hiba történt a mondatok letöltésekor.');
                console.error("API Hiba: ", err);
            } finally {
                setLoading(false);
            }
        };
        if (lessonId) {
            fetchSentences();
        }
    }, [lessonId]);


    return { sentences, loading, error };
};