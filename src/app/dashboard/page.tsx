'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockStatsApi, mockDocumentApi, mockRepositoryApi } from '@/lib/mock-api';
import type { DashboardStats, Document, Repository } from '@/types';
import Link from 'next/link';
import { FolderOpen, FileText, Globe, Tag, ExternalLink } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadStats = async () => {
      const data = await mockStatsApi.getDashboardStats();
      setStats(data);
    };

    if (user) {
      loadStats();
    }
  }, [user]);

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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container py-8">
            {/* Greeting */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold">안녕하세요, {user.name}님! 👋</h1>
              <p className="mt-2 text-muted-foreground">
                LinkToss에서 링크를 효율적으로 관리하세요
              </p>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">총 Repository</CardTitle>
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.overview.repositoryCount}개</div>
                    <p className="text-xs text-muted-foreground">
                      체계적으로 관리 중
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">총 Document</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.overview.documentCount}개</div>
                    <p className="text-xs text-muted-foreground">
                      저장된 링크
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Public Repository</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.overview.publicRepositoryCount}개</div>
                    <p className="text-xs text-muted-foreground">
                      공유 중
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">태그</CardTitle>
                    <Tag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.overview.tagCount}개</div>
                    <p className="text-xs text-muted-foreground">
                      분류 중
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Documents */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">📌 최근 저장한 Document</h2>
                <Button variant="ghost" asChild>
                  <Link href="/search">모두 보기</Link>
                </Button>
              </div>

              {stats && stats.recentDocuments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {stats.recentDocuments.map((doc: Document) => (
                    <Link key={doc.id} href={`/document/${doc.id}`}>
                      <Card className="h-full transition-all hover:shadow-md">
                        <CardHeader>
                          <CardTitle className="line-clamp-1 text-base">{doc.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1 text-xs">
                            <ExternalLink className="h-3 w-3" />
                            <span className="truncate">{doc.url}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {doc.contentPreview && (
                            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                              {doc.contentPreview}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag.id} variant="secondary" className="text-xs">
                                #{tag.name}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 text-lg font-medium">아직 저장된 Document가 없습니다</p>
                    <p className="mb-4 text-sm text-muted-foreground">
                      첫 링크를 저장해보세요!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Frequent Repositories */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">📁 자주 사용하는 Repository</h2>
              </div>

              {stats && stats.frequentRepositories.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {stats.frequentRepositories.map((repo: Repository) => (
                    <Link key={repo.id} href={`/repository/${repo.id}`}>
                      <Card className="h-full transition-all hover:shadow-md">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{repo.icon}</span>
                            <div className="flex-1">
                              <CardTitle className="line-clamp-1 text-base">{repo.name}</CardTitle>
                              {repo.isPublic && (
                                <Badge variant="outline" className="mt-1 text-xs">
                                  🌍 Public
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {repo.description && (
                            <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                              {repo.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{repo.documentCount} documents</span>
                            {repo.subRepositoryCount > 0 && (
                              <span>{repo.subRepositoryCount} sub-repos</span>
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
                    <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 text-lg font-medium">Repository를 만들어보세요</p>
                    <p className="mb-4 text-sm text-muted-foreground">
                      링크를 체계적으로 관리할 수 있습니다
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
