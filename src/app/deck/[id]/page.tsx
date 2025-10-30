'use client';

import type { DeckDetail } from '@/apis/data-contracts';
import { CreateDeckModal } from '@/components/layout/CreateDeckModal';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { decksApi } from '@/lib/api-client';
import { ExternalLink, Folder, Plus, Search, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function DeckDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const t = useTranslations();
    const [deck, setDeck] = useState<DeckDetail | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [isCreateSubDeckModalOpen, setIsCreateSubDeckModalOpen] = useState(false);

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

    const drops = deck?.drops || [];
    const subDecks = deck?.children || [];

    const filteredDrops = drops.filter((drop) =>
        drop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (drop.content && drop.content.toLowerCase().includes(searchQuery.toLowerCase()))
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
                            <Link href="/dashboard" className="hover:text-foreground">{t('deck.home')}</Link>
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
                            <span className="text-foreground font-semibold">{deck.name}</span>
                        </div>

                        {/* Deck Header */}
                        <div className="mb-8 flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">📁</span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-3xl font-bold">{deck.name}</h1>
                                            {deck.is_public && (
                                                <Badge variant="secondary" className="gap-1">
                                                    🌍 Public
                                                </Badge>
                                            )}
                                        </div>
                                        {deck.description && (
                                            <p className="mt-1 text-muted-foreground">{deck.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" size="icon" asChild>
                                <Link href={`/deck/${deck.id}/settings`}>
                                    <Settings className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        {/* Action Bar */}
                        <div className="mb-6 flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder={t('deck.searching')}
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
                                    <SelectItem value="recent">{t('deck.sortRecent')}</SelectItem>
                                    <SelectItem value="title">{t('deck.sortTitle')}</SelectItem>
                                    <SelectItem value="updated">{t('deck.sortUpdated')}</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button asChild>
                                <Link href={`/deck/${deck.id}/new`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('deck.newDrop')}
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsCreateSubDeckModalOpen(true)}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                {t('deck.subDeck')}
                            </Button>
                        </div>

                        {/* Sub-decks */}
                        {subDecks.length > 0 && (
                            <div className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold">{t('deck.subDecks')} ({subDecks.length})</h2>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    {subDecks.map((subDeck) => (
                                        <Link key={subDeck.id} href={`/deck/${subDeck.id}`}>
                                            <Card className="transition-all hover:shadow-md">
                                                <CardHeader>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-6 h-6 rounded"
                                                            style={{ backgroundColor: subDeck.color_hex }}
                                                        />
                                                        <CardTitle className="text-base">{subDeck.name}</CardTitle>
                                                    </div>
                                                    {subDeck.description && (
                                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                                            {subDeck.description}
                                                        </p>
                                                    )}
                                                </CardHeader>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Drops */}
                        <div>
                            <h2 className="mb-4 text-xl font-semibold">{t('deck.drops')} ({filteredDrops.length})</h2>

                            {filteredDrops.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredDrops.map((drop) => {
                                        const thumbnailUrl = drop.meta_image_url || drop.screenshot_url;
                                        return (
                                            <Link key={drop.id} href={`/drop/${drop.id}`}>
                                                <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                                                    {thumbnailUrl && (
                                                        <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                                            <Image
                                                                src={thumbnailUrl}
                                                                alt={drop.title}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        </div>
                                                    )}
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-base">
                                                            {drop.favicon_url && (
                                                                <Image
                                                                    src={drop.favicon_url}
                                                                    alt=""
                                                                    width={16}
                                                                    height={16}
                                                                    className="shrink-0"
                                                                    unoptimized
                                                                />
                                                            )}
                                                            <span className="line-clamp-1">{drop.title}</span>
                                                        </CardTitle>
                                                        <CardDescription className="flex items-center gap-1 text-xs">
                                                            <ExternalLink className="h-3 w-3 shrink-0" />
                                                            <span className="truncate">{drop.url}</span>
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        {drop.content && (
                                                            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                                                {drop.content}
                                                            </p>
                                                        )}
                                                        {drop.memo && (
                                                            <p className="text-xs italic text-muted-foreground">
                                                                {drop.memo}
                                                            </p>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-12">
                                        <Folder className="mb-4 h-12 w-12 text-muted-foreground" />
                                        <p className="mb-2 text-lg font-medium">{t('deck.noDropsYet')}</p>
                                        <p className="mb-4 text-sm text-muted-foreground">
                                            {t('deck.saveFirstLink')}
                                        </p>
                                        <Button asChild>
                                            <Link href={`/deck/${deck.id}/new`}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                {t('deck.addNewDrop')}
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <CreateDeckModal
                open={isCreateSubDeckModalOpen}
                onOpenChange={setIsCreateSubDeckModalOpen}
                parentId={deck?.id}
                onSuccess={loadDeck}
            />
        </div>
    );
}

