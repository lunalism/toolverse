'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

export default function SearchIp() {
    const [ip, setIp] = useState('')
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const handleSearch = async () => {
        if (!ip) return toast.error('IP 주소를 입력해주세요.')
        setLoading(true)
        try {
            const res = await fetch(`/api/ip-proxy?ip=${ip}`)
            if (!res.ok) throw new Error()
            const data = await res.json()
            setResult(data)
        } catch {
            toast.error('IP 정보를 찾을 수 없습니다.')
        } finally {
            setLoading(false)
        }
    }

    const flagEmoji = result?.country
        ? String.fromCodePoint(...[...result.country].map((c) => 127397 + c.charCodeAt(0)))
        : ''

    const hasLoc = result?.loc && result.loc.includes(',')
    const lat = hasLoc ? parseFloat(result.loc.split(',')[0]) : null
    const lng = hasLoc ? parseFloat(result.loc.split(',')[1]) : null

    return (
        <div className="space-y-6">
            <div className="flex gap-2 max-w-md mx-auto">
                <Input
                placeholder="조회할 IP 주소를 입력하세요"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                />
                <Button onClick={handleSearch} disabled={loading}>
                {loading ? '조회 중...' : '조회'}
                </Button>
            </div>

            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Card className="shadow-lg rounded-2xl">
                            <CardHeader className="text-center text-muted-foreground text-sm">🔍 조회된 IP</CardHeader>
                            <CardContent>
                                <div className="px-4 py-2 font-mono text-lg">{result.ip}</div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg rounded-2xl">
                            <CardHeader className="text-center text-muted-foreground text-sm">🌍 위치 정보</CardHeader>
                            <CardContent className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm px-4">
                                <div className="text-muted-foreground">국가</div>
                                <div>{`${flagEmoji} ${result?.country || 'N/A'}`}</div>

                                <div className="text-muted-foreground">도시</div>
                                <div>{result?.city || 'N/A'}</div>

                                <div className="text-muted-foreground">지역</div>
                                <div>{result?.region || 'N/A'}</div>

                                <div className="text-muted-foreground">ISP</div>
                                <div>{result?.org || 'N/A'}</div>

                                <div className="text-muted-foreground">시간대</div>
                                <div>{result?.timezone || 'N/A'}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 지도 */}
                    <div>
                        <h3 className="text-center text-sm text-muted-foreground mb-2">🗺️ 지도에서 보기</h3>
                        {lat && lng ? (
                            <MapView lat={lat} lng={lng} />
                        ) : (
                            <p className="text-sm text-muted-foreground text-center">위치 정보를 불러오는 중입니다...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
