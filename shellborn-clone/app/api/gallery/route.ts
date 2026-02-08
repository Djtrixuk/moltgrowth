import { NextResponse } from 'next/server';
import { getMints } from '@/lib/storage';

export async function GET() {
  const nfts = getMints();
  
  return NextResponse.json({
    success: true,
    nfts,
    count: nfts.length
  });
}
