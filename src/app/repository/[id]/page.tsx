'use client';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { mockDocumentApi, mockRepositoryApi } from '@/lib/mock-api';
import type { Document, Repository } from '@/types';
import { ExternalLink, Folder, Plus, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function RepositoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const t = useTranslations();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadRepository = async () => {
      if (params.id) {
        const repo = await mockRepositoryApi.getRepository(params.id as string);
        setRepository(repo);

        const docs = await mockDocumentApi.getDocuments(params.id as string);
        setDocuments(docs);
      }
    };

    if (user && params.id) {
      loadRepository();
    }
  }, [user, params.id]);

  if (isLoading || !user || !repository) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-2xl">🔗</div>
          <p className="mt-2 text-sm text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container py-8">
            {/* Breadcrumb */}
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground">{t('repository.home')}</Link>
              <span>/</span>
              <span className="text-foreground">{repository.name}</span>
            </div>

            {/* Repository Header */}
            <div className="mb-8 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{repository.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-bold">{repository.name}</h1>
                      {repository.isPublic && (
                        <Badge variant="secondary" className="gap-1">
                          🌍 Public
                        </Badge>
                      )}
                    </div>
                    {repository.description && (
                      <p className="mt-1 text-muted-foreground">{repository.description}</p>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="icon" asChild>
                <Link href={`/repository/${repository.id}/settings`}>
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Action Bar */}
            <div className="mb-6 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('repository.searching')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">{t('repository.sortRecent')}</SelectItem>
                  <SelectItem value="title">{t('repository.sortTitle')}</SelectItem>
                  <SelectItem value="updated">{t('repository.sortUpdated')}</SelectItem>
                </SelectContent>
              </Select>
              <Button asChild>
                <Link href={`/repository/${repository.id}/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('repository.newDocument')}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/repository/${repository.id}/sub-repository`}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('repository.subRepository')}
                </Link>
              </Button>
            </div>

            {/* Sub-repositories */}
            {repository.subRepositories && repository.subRepositories.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">{t('repository.subRepositories')} ({repository.subRepositories.length})</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {repository.subRepositories.map((subRepo) => (
                    <Link key={subRepo.id} href={`/repository/${subRepo.id}`}>
                      <Card className="transition-all hover:shadow-md">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{subRepo.icon}</span>
                            <CardTitle className="text-base">{subRepo.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{subRepo.documentCount} documents</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">{t('repository.documents')} ({filteredDocuments.length})</h2>

              {filteredDocuments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredDocuments.map((doc) => (
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
                    <Folder className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 text-lg font-medium">{t('repository.noDocumentsYet')}</p>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {t('repository.saveFirstLink')}
                    </p>
                    <Button asChild>
                      <Link href={`/repository/${repository.id}/new`}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('repository.addNewDocument')}
                      </Link>
                    </Button>
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
