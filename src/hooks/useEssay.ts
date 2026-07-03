import { useState } from 'react'
import type { FeedbackSegment, UseEssayReturn } from '../types';


export const useEssay = (): UseEssayReturn => {
  // Explicit típusmegadás a state-eknél (bár a string és boolean esetén a TS magától is kitalálná)
  const [text, setText] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackSegment[] | null>(null);

  const submitEssay = async (): Promise<void> => {
    // Ha a szöveg üres, nem is indítunk kérést
    if (text.trim() === "") return;

    setIsEvaluating(true); 

    try {
      const response = await fetch('/api/evaluate', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text })
      });
      
      const data: FeedbackSegment[] = await response.json(); // Itt is megmondjuk, mit várunk a JSON-ből!
      setFeedback(data); 

    } catch (error) {
      console.error("Hiba történt az esszé értékelésekor:", error);
      // Itt akár egy hiba state-et is beállíthatnál
    } finally {
      setIsEvaluating(false); 
    }
  };

  return { 
    text, 
    setText, 
    isEvaluating, 
    setIsEvaluating, 
    feedback, 
    setFeedback, 
    submitEssay 
  };
};