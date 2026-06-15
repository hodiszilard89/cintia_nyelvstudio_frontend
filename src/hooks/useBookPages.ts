import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import type {  BookPageDTO } from '../types';

export const useBookPage = (lessonId: number) => {
    // A memóriák szigorúan típusosak lettek
    const [pages, setPages] = useState<BookPageDTO[]>([]);
    const [ba_loading, setLoading] = useState<boolean>(true);
    const [ba_error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAudios = async () => {
            try {
                setLoading(true);
                // Itt is megmondjuk az Axiosnak, hogy milyen típusú választ várjon
                const response = await axiosClient.get(`/book-pages/lesson/${lessonId}`);
                setPages(response.data);
                setError(null);
            } catch (err) {
                setError('Hiba történt a mondatok letöltésekor.');
                console.error("API Hiba: ", err);
            } finally {
                setLoading(false);
            }
        };
        if (lessonId) {
            fetchAudios();
        }
    }, [lessonId]);


    return { pages, ba_loading, ba_error };
};