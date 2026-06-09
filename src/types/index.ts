// Ez pontosan megfelel a Java TranslationSentenceDTO osztályodnak
export interface TranslationSentenceDTO {
    id: number;
    lessonId: number;
    taskNumber: number;
    huText: string;
    enText: string;
    audioPath: string | null;
}