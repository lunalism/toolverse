// app/api/ip-proxy/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const ip = searchParams.get('ip')

    if (!ip) {
        return NextResponse.json({ error: 'Missing IP' }, { status: 400 })
    }

    const token = process.env.IPINFO_TOKEN
    const url = `https://ipinfo.io/${ip}/json?token=${token}`

    try {
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch IP data')

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
    }
}
