'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDocumentApi } from '@/lib/mock-api';
import { toast } from 'sonner';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NewDocumentPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [metadata, setMetadata] = useState<any>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const fetchMetadata = async () => {
    if (!url) return;

    setIsLoadingMetadata(true);
    try {
      const meta = await mockDocumentApi.fetchMetadata(url);
      setMetadata(meta);
      if (meta.ogTitle && !title) {
        setTitle(meta.ogTitle);
      }
    } catch (error) {
      toast.error(t('newDocument.fetchError'));
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || !title) {
      toast.error(t('newDocument.requiredError'));
      return;
    }

    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);

      await mockDocumentApi.createDocument({
        repositoryId: params.id as string,
        title,
        url,
        content,
        tags: tagArray,
      });

      toast.success(t('newDocument.createSuccess'));
      router.push(`/repository/${params.id}`);
    } catch (error) {
      toast.error(t('newDocument.createError'));
    }
  };

  if (isLoading || !user) {
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
              <Link href="/dashboard" className="hover:text-foreground">{t('common.home')}</Link>
              <span>/</span>
              <Link href={`/repository/${params.id}`} className="hover:text-foreground">{t('newDocument.repository')}</Link>
              <span>/</span>
              <span className="text-foreground">{t('repository.newDocument')}</span>
            </div>

            <h1 className="mb-8 text-3xl font-bold">{t('newDocument.title')}</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="url">{t('newDocument.urlLabel')}</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    type="url"
                    placeholder={t('newDocument.urlPlaceholder')}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={fetchMetadata}
                    disabled={isLoadingMetadata || !url}
                  >
                    {isLoadingMetadata ? t('newDocument.fetching') : t('newDocument.fetch')}
                  </Button>
                </div>
              </div>

              {/* Metadata Preview */}
              {metadata && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t('newDocument.linkPreview')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {metadata.ogTitle && <p><strong>{t('newDocument.titleField')}</strong> {metadata.ogTitle}</p>}
                      {metadata.ogDescription && <p><strong>{t('newDocument.descriptionField')}</strong> {metadata.ogDescription}</p>}
                      {metadata.ogImage && (
                        <img
                          src={metadata.ogImage}
                          alt="Preview"
                          className="mt-2 h-32 w-full rounded object-cover"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Title Input */}
              <div className="space-y-2">
                <Label htmlFor="title">{t('newDocument.titleLabel')}</Label>
                <Input
                  id="title"
                  placeholder={t('newDocument.titlePlaceholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Content Input */}
              <div className="space-y-2">
                <Label htmlFor="content">{t('newDocument.contentLabel')}</Label>
                <Textarea
                  id="content"
                  placeholder={t('newDocument.contentPlaceholder')}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>

              {/* Tags Input */}
              <div className="space-y-2">
                <Label htmlFor="tags">{t('newDocument.tagsLabel')}</Label>
                <Input
                  id="tags"
                  placeholder={t('newDocument.tagsPlaceholder')}
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  {t('newDocument.cancel')}
                </Button>
                <Button type="submit">{t('newDocument.save')}</Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
