import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const appid = req.nextUrl.searchParams.get('appid')
  if (!appid) return NextResponse.json({ error: 'Missing appid' }, { status: 400 })

  const res = await fetch(
    `https://store.steampowered.com/api/appdetails?appids=${appid}&filters=genres`
  )
  if (!res.ok) return NextResponse.json({ error: 'Steam error' }, { status: res.status })

  const data = await res.json()
  return NextResponse.json(data)
}
