export enum ConversionMode {
  PDF_TO_WORD = 'PDF to Word',
  WORD_TO_PDF = 'Word to PDF',
}

export type ConversionStatus = 'idle' | 'converting' | 'success';

export type Page = 'converter' | 'about' | 'contact' | 'privacy';
