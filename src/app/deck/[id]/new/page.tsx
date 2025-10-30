'use client';

import type { DeckDetail } from '@/apis/data-contracts';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TagInput } from '@/components/ui/tag-input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { decksApi, dropsApi } from '@/lib/api-client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function NewDropPage() {
    const t = useTranslations();
    const params = useParams();
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [deck, setDeck] = useState<DeckDetail | null>(null);
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [memo, setMemo] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    const loadDeck = async () => {
        if (params.id) {
            try {
                const deckResponse = await decksApi.decksRead({ id: params.id as string });
                setDeck(deckResponse.data);
            } catch (error) {
                console.error('Failed to load deck:', error);
            }
        }
    };

    useEffect(() => {
        if (user && params.id) {
            loadDeck();
        }
    }, [user, params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!url || !title) {
            toast.error(t('newDrop.requiredError'));
            return;
        }

        try {
            await dropsApi.dropsCreate({
                deck: params.id as string,
                title,
                url,
                memo: memo || null,
                content: null,
                tags,
            });

            toast.success(t('newDrop.createSuccess'));
            router.push(`/deck/${params.id}`);
        } catch (error) {
            toast.error(t('newDrop.createError'));
        }
    };

    if (isLoading || !user || !deck) {
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
                            {deck.breadcrumb && deck.breadcrumb.map((crumb) => (
                                <div key={crumb.id} className="flex items-center gap-2">
                                    <span>/</span>
                                    <Link
                                        href={`/deck/${crumb.id}`}
                                        className="hover:text-foreground"
                                    >
                                        {crumb.name}
                                    </Link>
                                </div>
                            ))}
                            <span>/</span>
                            <Link href={`/deck/${params.id}`} className="hover:text-foreground">{deck.name}</Link>
                            <span>/</span>
                            <span className="text-foreground">{t('deck.newDrop')}</span>
                        </div>

                        <h1 className="mb-8 text-3xl font-bold">{t('newDrop.title')}</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* URL Input */}
                            <div className="space-y-2">
                                <Label htmlFor="url">{t('newDrop.urlLabel')}</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    placeholder={t('newDrop.urlPlaceholder')}
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>

                            {/* Title Input */}
                            <div className="space-y-2">
                                <Label htmlFor="title">{t('newDrop.titleLabel')}</Label>
                                <Input
                                    id="title"
                                    placeholder={t('newDrop.titlePlaceholder')}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {/* Memo Input */}
                            <div className="space-y-2">
                                <Label htmlFor="memo">{t('newDrop.memoLabel')}</Label>
                                <Textarea
                                    id="memo"
                                    placeholder={t('newDrop.memoPlaceholder')}
                                    value={memo}
                                    onChange={(e) => setMemo(e.target.value)}
                                    rows={15}
                                    className="font-mono text-sm"
                                />
                            </div>

                            {/* Tags Input */}
                            <div className="space-y-2">
                                <Label htmlFor="tags">{t('newDrop.tagsLabel')}</Label>
                                <TagInput
                                    id="tags"
                                    placeholder={t('newDrop.tagsPlaceholder')}
                                    value={tags}
                                    onChange={setTags}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    {t('newDrop.cancel')}
                                </Button>
                                <Button type="submit">{t('newDrop.save')}</Button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

