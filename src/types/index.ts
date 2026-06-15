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