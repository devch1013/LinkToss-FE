'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockRepositories } from '@/lib/mock-data';
import Link from 'next/link';
import { Globe, Star, FileText } from 'lucide-react';

export default function ExplorePage() {
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

  const publicRepos = mockRepositories.filter(r => r.isPublic);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">🌍 Public Repository 탐색</h1>
              <p className="mt-2 text-muted-foreground">
                다른 사용자들이 공개한 Repository를 둘러보세요
              </p>
            </div>

            {/* Public Repositories */}
            {publicRepos.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {publicRepos.map((repo) => (
                  <Link key={repo.id} href={`/repository/${repo.id}`}>
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{repo.icon}</span>
                          <Badge variant="outline" className="gap-1">
                            <Globe className="h-3 w-3" />
                            Public
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{repo.name}</CardTitle>
                        <CardDescription>{repo.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{repo.documentCount} documents</span>
                          </div>
                          {repo.user && (
                            <div className="flex items-center gap-1">
                              <span>by</span>
                              <span className="font-medium">@{repo.user.username}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Globe className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 text-lg font-medium">공개된 Repository가 없습니다</p>
                  <p className="text-sm text-muted-foreground">
                    곧 멋진 Repository들이 공유될 예정입니다!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
