import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')
  if (!query) return NextResponse.json({ items: [] })

  const res = await fetch(
    `https://store.steampowered.com/api/storesearch?term=${encodeURIComponent(query)}&l=english&cc=US`
  )
  if (!res.ok) return NextResponse.json({ error: 'Steam error' }, { status: res.status })

  const data = await res.json()
  return NextResponse.json(data)
}
