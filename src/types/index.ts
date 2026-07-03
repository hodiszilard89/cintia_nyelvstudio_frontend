import type { ButtonProps } from "@chakra-ui/react";

// Ez pontosan megfelel a Java TranslationSentenceDTO osztályodnak
export interface TranslationSentenceDTO {
    id: number;
    lessonId: number;
    taskNumber: number;
    huText: string;
    enText: string;
    audioPath: string | null;
}
export interface VocabularyWordDTO {
    id: number;
    lessonId: number;
    enWord: string;
    phonetic: string | null;
    huTranslation: string;
    audioPath: string | null;
    imageUrl: string | null;
}

export type MachGameWord={
  id: string;
  text: string; 
  type: string;
  wordId: number; 
  isMatched: boolean;

}
export type BookAudioDTO = {
  id: number;
  lessonId: number;
  bookType: 'sbook' | 'wbook'; 
  pageNumber: number;
  title: string;
  fileName: string;
};
export type BookPageDTO = {
    id: number;
    lessonId: number;
    pageOrder: number;
    fileName: string;
    filePath: string;
};

//frontend types
export type PaginationControlsProps = {
    currentPage: number;
    totalPages: number;
    onNext: () => void;
    onPrev: () => void;
};
export type SidebarButtonProps = ButtonProps & {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export type FeedbackSegment = {
  text: string;
  status: 'ok' | 'error';
  correction?: string;
  explanation?: string;
};

export type UseEssayReturn = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>; // A React useState setter hivatalos típusa
  isEvaluating: boolean;
  setIsEvaluating: React.Dispatch<React.SetStateAction<boolean>>;
  feedback: FeedbackSegment[] | null;
  setFeedback: React.Dispatch<React.SetStateAction<FeedbackSegment[] | null>>;
  submitEssay: () => Promise<void>; // Aszinkron függvény, ami nem tér vissza konkrét adattal
};