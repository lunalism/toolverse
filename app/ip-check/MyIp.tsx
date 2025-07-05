'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

export default function MyIp() {
    const [ipData, setIpData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('https://ipinfo.io/json')
        .then((res) => res.json())
        .then((data) => setIpData(data))
        .catch(() => toast.error('IP 정보를 불러오는 데 실패했습니다.'))
        .finally(() => setLoading(false))
    }, [])

    const flagEmoji = ipData?.country
        ? String.fromCodePoint(...[...ipData.country].map((c) => 127397 + c.charCodeAt(0)))
        : ''

    const hasLoc = ipData?.loc && ipData.loc.includes(',')
    const lat = hasLoc ? parseFloat(ipData.loc.split(',')[0]) : null
    const lng = hasLoc ? parseFloat(ipData.loc.split(',')[1]) : null

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card className="shadow-lg rounded-2xl">
                    <CardHeader className="text-center text-muted-foreground text-sm">📍 내 IP 주소</CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center px-4 py-3 bg-muted rounded-md">
                        <span className="font-mono text-lg">{loading ? '로딩 중...' : ipData?.ip || 'N/A'}</span>
                        {!loading && ipData?.ip && (
                            <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                navigator.clipboard.writeText(ipData.ip)
                                toast.success('IP 주소가 복사되었습니다!')
                            }}
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                        )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg rounded-2xl">
                    <CardHeader className="text-center text-muted-foreground text-sm">🌍 위치 정보</CardHeader>
                    <CardContent className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm px-4">
                        <div className="text-muted-foreground">국가</div>
                        <div>{loading ? '...' : `${flagEmoji} ${ipData?.country || 'N/A'}`}</div>

                        <div className="text-muted-foreground">도시</div>
                        <div>{loading ? '...' : ipData?.city || 'N/A'}</div>

                        <div className="text-muted-foreground">지역</div>
                        <div>{loading ? '...' : ipData?.region || 'N/A'}</div>

                        <div className="text-muted-foreground">ISP</div>
                        <div>{loading ? '...' : ipData?.org || 'N/A'}</div>

                        <div className="text-muted-foreground">시간대</div>
                        <div>{loading ? '...' : ipData?.timezone || 'N/A'}</div>
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
    )
}
