'use client';

import { Message as IMessage } from '@/app/model/Message';
import React from 'react';
import MyMessage from '../atoms/MyMessage';
import YourMessage from '../atoms/YourMessage';

export default function Message() {
  const myRole = 'cons';
  const messages: IMessage[] = [
    {
      chatId: 'a1b2c3d4e5f6g7h8i9j0',
      sender: {
        id: 'abcdef1234567890',
        name: '사용자A',
        photoNum: 1,
        role: 'pros',
      },
      content: '안녕하세요! 토론 시작해볼까요?',
      createdAt: '2024-04-18T10:30:00Z',
    },
    {
      chatId: '1a2b3c4d5e6f7g8h9i0j',
      sender: {
        id: 'abcdef1234567891',
        name: '사용자B',
        photoNum: 4,
        role: 'cons',
      },
      content: '좋습니다! 먼저 시작하시죠',
      createdAt: '2024-04-18T10:31:30Z',
    },
    {
      chatId: '1a2b3c4d5e6f7g8h9i0j',
      sender: {
        id: 'abcdef1234567891',
        name: '사용자B',
        photoNum: 3,
        role: 'cons',
      },
      content: '좋아용',
      createdAt: '2024-04-18T10:31:30Z',
    },
  ];

  return (
    <div>
      {messages.map((message) => (
        <div key={message.chatId}>
          {message.sender.role === myRole ? (
            <MyMessage message={message} />
          ) : (
            <YourMessage message={message} />
          )}
        </div>
      ))}
    </div>
  );
}
