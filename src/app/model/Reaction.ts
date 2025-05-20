type EmojiType = 'LIKE' | 'DISLIKE' | 'LOVE' | 'HAPPY' | 'SAD';

export type Reaction = Record<EmojiType, number>;
