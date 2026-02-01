import { NextResponse } from 'next/server';
import { createClient } from 'microcms-js-sdk';

export async function POST(request: Request) {
  // 権限を強化したAPIキーを使ってクライアントを作成
  const client = createClient({
    serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || '',
    apiKey: process.env.MICROCMS_API_KEY || '',
  });

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // 1. 現在の「いいね数」を取得
    const current = await client.get({
      endpoint: 'blogs',
      contentId: id,
      queries: { fields: 'likes' },
    });

    // 2. 現在の値に+1する（まだ0なら1にする）
    const newCount = (current.likes || 0) + 1;

    // 3. microCMSに書き込み（PATCH）
    const result = await client.update({
      endpoint: 'blogs',
      contentId: id,
      content: {
        likes: newCount,
      },
    });

    return NextResponse.json({ count: newCount, result });
  } catch (error) {
    console.error('Update failed:', error);
    return NextResponse.json({ error: 'Failed to update like' }, { status: 500 });
  }
}