'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

export default function IPCheckerPage() {
    const [ipData, setIpData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // 이후에 fetch 로직 추가 예정
    useEffect(() => {
        const fetchIPInfo = async () => {
            try {
                const res = await fetch('https://ipinfo.io/json') // 토큰 붙이면 '?token=YOUR_TOKEN'
                const data = await res.json()
                setIpData(data)
            } catch (err) {
                toast.error('IP 정보를 불러오는 데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }
        fetchIPInfo()
    }, [])

    return (
        <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
            {/* 헤더 */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">🌐 IP 주소 확인기</h1>
                <p className="text-muted-foreground text-sm">
                    현재 기기의 공용 IP 주소와 위치 정보를 확인하세요.
                </p>
            </div>

            {/* IP 주소 카드 */}
            <Card className="text-center">
                <CardContent className="py-6">
                <p className="text-sm text-muted-foreground mb-2">내 IP 주소</p>
                <div className="flex justify-center items-center gap-2 text-xl font-mono">
                    <span>{loading ? '로딩 중...' : ipData?.ip || 'N/A'}</span>
                    {!loading && ipData?.ip && (
                    <Button size="icon" variant="ghost"
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

            {/* 상세 정보 (위치 등) */}
            <Card>
                <CardContent className="py-6 space-y-2 text-sm">
                <p><strong>국가:</strong> {loading ? '...' : ipData?.country || 'N/A'}</p>
                <p><strong>도시:</strong> {loading ? '...' : ipData?.city || 'N/A'}</p>
                <p><strong>ISP:</strong> {loading ? '...' : ipData?.org || 'N/A'}</p>
                </CardContent>
            </Card>

            {/* 안내 문구 */}
            <p className="text-xs text-muted-foreground text-center">
                본 정보는 <span className="font-semibold">ipinfo.io</span>를 통해 로드되며, 브라우저에서 직접 요청됩니다.
            </p>
        </div>
    )
}
