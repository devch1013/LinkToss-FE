'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockSearchApi } from '@/lib/mock-api';
import type { Repository, Document } from '@/types';
import Link from 'next/link';
import { Search, Folder, FileText, ExternalLink } from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const performSearch = async () => {
      if (query.trim().length < 2) {
        setRepositories([]);
        setDocuments([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await mockSearchApi.search(query);
        setRepositories(results.repositories);
        setDocuments(results.documents);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [query]);

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
            <h1 className="mb-6 text-3xl font-bold">🔍 검색</h1>

            {/* Search Input */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Repository, Document 검색..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 pl-10 text-base"
                autoFocus
              />
            </div>

            {query.trim().length < 2 ? (
              <div className="text-center py-12">
                <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">검색어를 입력하세요</p>
                <p className="text-sm text-muted-foreground">최소 2자 이상 입력해주세요</p>
              </div>
            ) : isSearching ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">검색 중...</p>
              </div>
            ) : (
              <>
                {/* Repositories Results */}
                {repositories.length > 0 && (
                  <div className="mb-8">
                    <h2 className="mb-4 text-xl font-semibold">
                      📂 Repositories ({repositories.length})
                    </h2>
                    <div className="space-y-3">
                      {repositories.map((repo) => (
                        <Link key={repo.id} href={`/repository/${repo.id}`}>
                          <Card className="transition-all hover:shadow-md">
                            <CardHeader>
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{repo.icon}</span>
                                <div className="flex-1">
                                  <CardTitle className="text-base">{repo.name}</CardTitle>
                                  <CardDescription>{repo.description}</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                  {repo.isPublic && (
                                    <Badge variant="outline">🌍 Public</Badge>
                                  )}
                                  <Badge variant="secondary">{repo.documentCount} docs</Badge>
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents Results */}
                {documents.length > 0 && (
                  <div>
                    <h2 className="mb-4 text-xl font-semibold">
                      📄 Documents ({documents.length})
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {documents.map((doc) => (
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
                  </div>
                )}

                {/* No Results */}
                {repositories.length === 0 && documents.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-lg font-medium">검색 결과가 없습니다</p>
                    <p className="text-sm text-muted-foreground">
                      다른 검색어를 시도해보세요
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
