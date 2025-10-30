'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockDocumentApi } from '@/lib/mock-api';
import type { Document } from '@/types';
import Link from 'next/link';
import { ExternalLink, Edit, Trash2, Share } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function DocumentDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [document, setDocument] = useState<Document | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadDocument = async () => {
      if (params.id) {
        const doc = await mockDocumentApi.getDocument(params.id as string);
        setDocument(doc);
      }
    };

    if (user && params.id) {
      loadDocument();
    }
  }, [user, params.id]);

  const handleDelete = async () => {
    if (document && confirm(t('document.confirmDelete'))) {
      await mockDocumentApi.deleteDocument(document.id);
      router.push(`/repository/${document.repositoryId}`);
    }
  };

  if (isLoading || !user || !document) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-2xl">🔗</div>
          <p className="mt-2 text-sm text-muted-foreground">{t('common.loading')}</p>
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
          <div className="container max-w-4xl py-8">
            {/* Breadcrumb */}
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground">{t('document.home')}</Link>
              <span>/</span>
              {document.repository && (
                <>
                  <Link href={`/repository/${document.repository.id}`} className="hover:text-foreground">
                    {document.repository.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-foreground">{document.title}</span>
            </div>

            {/* Document Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold">{document.title}</h1>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href={document.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="truncate">{document.url}</span>
                </a>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/document/${document.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t('document.edit')}
                  </Link>
                </Button>
                <Button size="sm" variant="outline" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('document.delete')}
                </Button>
                <Button size="sm" variant="outline">
                  <Share className="mr-2 h-4 w-4" />
                  {t('document.share')}
                </Button>
              </div>
            </div>

            {/* Link Preview */}
            {document.linkMetadata && (
              <Card className="mb-8 overflow-hidden">
                {document.linkMetadata.ogImage && (
                  <img
                    src={document.linkMetadata.ogImage}
                    alt={document.linkMetadata.ogTitle || document.title}
                    className="h-64 w-full object-cover"
                  />
                )}
                <div className="p-6">
                  {document.linkMetadata.ogTitle && (
                    <h3 className="mb-2 text-xl font-semibold">{document.linkMetadata.ogTitle}</h3>
                  )}
                  {document.linkMetadata.ogDescription && (
                    <p className="text-muted-foreground">{document.linkMetadata.ogDescription}</p>
                  )}
                </div>
              </Card>
            )}

            {/* Document Content */}
            {document.content && (
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">{t('document.notes')}</h2>
                <Card className="p-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {/* Simple markdown rendering - in real app, use react-markdown */}
                    {document.content.split('\n').map((line, i) => {
                      if (line.startsWith('# ')) {
                        return <h1 key={i} className="text-2xl font-bold mb-4">{line.slice(2)}</h1>;
                      }
                      if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-xl font-semibold mb-3">{line.slice(3)}</h2>;
                      }
                      if (line.startsWith('- ')) {
                        return <li key={i} className="ml-4">{line.slice(2)}</li>;
                      }
                      if (line.trim() === '') {
                        return <br key={i} />;
                      }
                      return <p key={i} className="mb-2">{line}</p>;
                    })}
                  </div>
                </Card>
              </div>
            )}

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 text-xl font-semibold">{t('document.tags')}</h2>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary" style={{ backgroundColor: tag.color + '20', color: tag.color }}>
                      #{tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Meta Info */}
            <div className="text-sm text-muted-foreground">
              <p>{t('document.createdAt')} {new Date(document.createdAt).toLocaleDateString('ko-KR')}</p>
              <p>{t('document.updatedAt')} {new Date(document.updatedAt).toLocaleDateString('ko-KR')}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
