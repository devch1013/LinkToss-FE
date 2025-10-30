'use client';

import type { Drop } from '@/apis/data-contracts';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TagInput } from '@/components/ui/tag-input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { dropsApi } from '@/lib/api-client';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function DropEditPage() {
    const t = useTranslations();
    const params = useParams();
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [drop, setDrop] = useState<Drop | null>(null);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [memo, setMemo] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        const loadDrop = async () => {
            if (params.id) {
                try {
                    const response = await dropsApi.dropsRead({ id: params.id as string });
                    const dropData = response.data;
                    setDrop(dropData);
                    setTitle(dropData.title);
                    setUrl(dropData.url);
                    setMemo(dropData.memo || '');
                    // Handle tags as array
                    const tagsValue = dropData.tags
                        ? (Array.isArray(dropData.tags) ? dropData.tags : [dropData.tags])
                        : [];
                    setTags(tagsValue);
                } catch (error) {
                    console.error('Failed to load drop:', error);
                    toast.error(t('dropEdit.loadError'));
                }
            }
        };

        if (user && params.id) {
            loadDrop();
        }
    }, [user, params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!drop) return;

        if (!title.trim() || !url.trim()) {
            toast.error(t('dropEdit.requiredError'));
            return;
        }

        setIsSaving(true);
        try {
            await dropsApi.dropsUpdate(
                { id: drop.id! },
                {
                    title: title.trim(),
                    url: url.trim(),
                    memo: memo.trim() || null,
                    tags: tags.length > 0 ? tags : undefined,
                }
            );

            toast.success(t('dropEdit.updateSuccess'));
            router.push(`/drop/${drop.id}`);
        } catch (error) {
            console.error('Failed to update drop:', error);
            toast.error(t('dropEdit.updateError'));
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !user || !drop) {
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
                    <div className="container max-w-3xl py-8">
                        {/* Breadcrumb */}
                        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/dashboard" className="hover:text-foreground">{t('common.home')}</Link>
                            <span>/</span>
                            <Link href={`/deck/${drop.deck}`} className="hover:text-foreground">
                                {t('dropEdit.goToDeck')}
                            </Link>
                            <span>/</span>
                            <Link href={`/drop/${drop.id}`} className="hover:text-foreground">
                                {drop.title}
                            </Link>
                            <span>/</span>
                            <span className="text-foreground">{t('dropEdit.edit')}</span>
                        </div>

                        {/* Header */}
                        <div className="mb-8 flex items-center justify-between">
                            <h1 className="text-3xl font-bold">{t('dropEdit.title')}</h1>
                            <Button variant="outline" asChild>
                                <Link href={`/drop/${drop.id}`}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    {t('dropEdit.back')}
                                </Link>
                            </Button>
                        </div>

                        {/* Form */}
                        <Card className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="title">{t('dropEdit.titleLabel')}</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder={t('dropEdit.titlePlaceholder')}
                                        required
                                        maxLength={255}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="url">{t('dropEdit.urlLabel')}</Label>
                                    <Input
                                        id="url"
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder={t('dropEdit.urlPlaceholder')}
                                        required
                                        maxLength={200}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="memo">{t('dropEdit.memoLabel')}</Label>
                                    <Textarea
                                        id="memo"
                                        value={memo}
                                        onChange={(e) => setMemo(e.target.value)}
                                        placeholder={t('dropEdit.memoPlaceholder')}
                                        rows={6}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="tags">{t('dropEdit.tagsLabel')}</Label>
                                    <TagInput
                                        id="tags"
                                        value={tags}
                                        onChange={setTags}
                                        placeholder={t('dropEdit.tagsPlaceholder')}
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {t('dropEdit.tagsHelp')}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Button type="submit" disabled={isSaving}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {isSaving ? t('dropEdit.saving') : t('dropEdit.save')}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => router.back()}>
                                        {t('dropEdit.cancel')}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}

