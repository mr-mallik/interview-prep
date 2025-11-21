export type QAItem = {
  question: string;
  answer: string;
  tags: string[];
};

export type QASection = {
  title: string;
  description?: string;
  items: QAItem[];
};

export type TellMeAboutYourself = {
  question: string;      // Always "Tell me about yourself"
  longAnswer: string;    // ~2 minutes spoken
  shortAnswer: string;   // ~45 seconds spoken
};

export type ApiResponse = {
  roleSummary: string;
  candidateSummary: string;
  tellMeAboutYourself: TellMeAboutYourself;
  sections: QASection[];
  suggestionsForInterviewerQuestions: string[];
};
