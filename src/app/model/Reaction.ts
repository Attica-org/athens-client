export const EMOJI_TYPES = ['LIKE', 'DISLIKE', 'LOVE', 'HAPPY', 'SAD'] as const;

export type EmojiType = (typeof EMOJI_TYPES)[number];

export type Reaction = Record<EmojiType, number>;
