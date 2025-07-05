'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import MyIp from './MyIp'
import SearchIp from './SearchIp'

export default function IPCheckerPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">🌐 IP 주소 확인기</h1>
        <p className="text-muted-foreground text-base">
          내 IP 정보와 원하는 IP의 위치를 손쉽게 확인해보세요.
        </p>
      </div>

      <Tabs defaultValue="myip" className="w-full">
        <TabsList className="grid grid-cols-2 max-w-md mx-auto mb-6">
          <TabsTrigger value="myip">🌐 내 IP 조회</TabsTrigger>
          <TabsTrigger value="search">🔍 IP 검색</TabsTrigger>
        </TabsList>

        <TabsContent value="myip">
          <MyIp />
        </TabsContent>

        <TabsContent value="search">
          <SearchIp />
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground text-center mt-10">
        이 정보는 <strong>ipinfo.io</strong>로부터 직접 조회되며, 브라우저에서 처리됩니다.
      </p>
    </div>
  )
}
