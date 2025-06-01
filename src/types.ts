export interface Topic {
  id: string;
  title: string;
  optionA: string;
  optionB: string;
  createdAt: Date;
  author: string;
}

export interface Comment {
  id: string;
  topicId: string;
  text: string;
  author: string;
  choice: 'A' | 'B';
  createdAt: Date;
  votes: number;
}

export type Vote = 'up' | 'down';