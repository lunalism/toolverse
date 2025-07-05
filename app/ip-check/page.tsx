'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

// dynamic import (SSR 방지)
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

export default function IPCheckerPage() {
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
       <div className="max-w-5xl mx-auto px-4 py-16 space-y-10">
  <div className="text-center space-y-2">
    <h1 className="text-4xl font-bold tracking-tight">🌐 IP 주소 확인기</h1>
    <p className="text-muted-foreground text-base">
      당신의 공용 IP와 위치 정보를 빠르게 확인하세요.
    </p>
  </div>

  {/* 📦 메인 콘텐츠 2단 구성 */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* 왼쪽 섹션 */}
    <div className="space-y-6">
      {/* IP 주소 */}
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

      {/* 위치 정보 */}
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

    {/* 오른쪽 섹션 - 지도 */}
    <div>
      <h3 className="text-center text-sm text-muted-foreground mb-2">🗺️ 지도에서 보기</h3>
      {lat && lng ? (
        <MapView lat={lat} lng={lng} />
      ) : (
        <p className="text-sm text-muted-foreground text-center">위치 정보를 불러오는 중입니다...</p>
      )}
    </div>
  </div>

  <p className="text-xs text-muted-foreground text-center mt-10">
    이 정보는 <strong>ipinfo.io</strong>로부터 직접 조회되며, 브라우저에서 처리됩니다.
  </p>
</div>
    )
}
