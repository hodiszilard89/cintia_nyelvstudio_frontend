import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import type { TranslationSentenceDTO } from '../types';

export const useSentences = (lessonId: number, taskNumber: number) => {
    // A memóriák szigorúan típusosak lettek
    const [sentences, setSentences] = useState<TranslationSentenceDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSentences = async () => {
            try {
                setLoading(true);
                // Itt is megmondjuk az Axiosnak, hogy milyen típusú választ várjon
                const response = await axiosClient.get<TranslationSentenceDTO[]>(
                    `/sentences/lesson/${lessonId}/task/${taskNumber}`
                );
                
                setSentences(response.data);
                setError(null);
            } catch (err) {
                setError('Hiba történt a mondatok letöltésekor.');
                console.error("API Hiba: ", err);
            } finally {
                setLoading(false);
            }
        };

        if (lessonId && taskNumber) {
            fetchSentences();
        }
    }, [lessonId, taskNumber]);

    return { sentences, loading, error };
};