'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-2xl">🔗</div>
          <p className="mt-2 text-sm text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-4xl py-8">
            <h1 className="mb-8 text-3xl font-bold">⚙️ 설정</h1>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">프로필</TabsTrigger>
                <TabsTrigger value="security">보안</TabsTrigger>
                <TabsTrigger value="notifications">알림</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>프로필 정보</CardTitle>
                    <CardDescription>공개 프로필 정보를 관리하세요</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatarUrl || undefined} />
                        <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">변경</Button>
                        <Button variant="ghost" size="sm">삭제</Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">이름</Label>
                      <Input id="name" defaultValue={user.name} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">이메일</Label>
                      <Input id="email" defaultValue={user.email} disabled />
                      <p className="text-xs text-muted-foreground">이메일은 변경할 수 없습니다</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">사용자명</Label>
                      <Input id="username" defaultValue={user.username} />
                      <p className="text-xs text-muted-foreground">linktoss.com/@{user.username}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">자기소개</Label>
                      <Textarea id="bio" defaultValue={user.bio || ''} rows={3} />
                    </div>

                    <Button>변경사항 저장</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>연결된 소셜 계정</CardTitle>
                    <CardDescription>소셜 로그인 계정을 관리하세요</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Google</p>
                          <p className="text-sm text-muted-foreground">연결됨</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">연결 해제</Button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">GitHub</p>
                          <p className="text-sm text-muted-foreground">연결 안 됨</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">연결</Button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      ⚠️ 최소 1개의 소셜 계정이 연결되어 있어야 합니다
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>알림 설정</CardTitle>
                    <CardDescription>알림 수신 방법을 선택하세요</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">이메일 알림</p>
                        <p className="text-sm text-muted-foreground">중요한 업데이트를 이메일로 받습니다</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">브라우저 푸시 알림</p>
                        <p className="text-sm text-muted-foreground">실시간 알림을 받습니다</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Repository 초대</p>
                        <p className="text-sm text-muted-foreground">누군가 나를 Repository에 초대했을 때</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" defaultChecked />
                    </div>

                    <Button>저장</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
