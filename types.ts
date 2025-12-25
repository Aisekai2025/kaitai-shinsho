
export enum CharacterType {
  RYOTAKU = '前野良沢',
  GENPAKU = '杉田玄白',
  AI = 'AI',
  GENNAI = '平賀源内',
  USER = 'あなた'
}

export interface ChatMessage {
  id: string;
  sender: CharacterType;
  content: string;
  timestamp: Date;
  isAnalysis?: boolean;
}

export interface ConsultationResponse {
  analysis: string;
  messages: {
    sender: CharacterType;
    content: string;
  }[];
}
