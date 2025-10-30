'use client';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { mockSearchApi } from '@/lib/mock-api';
import type { Deck, Drop } from '@/types';
import { ExternalLink, FileText, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function SearchPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [decks, setDecks] = useState<Deck[]>([]);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const performSearch = async () => {
      if (query.trim().length < 2) {
        setDecks([]);
        setDrops([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await mockSearchApi.search(query);
        setDecks(results.decks);
        setDrops(results.drops);
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
          <div className="container py-8">
            <h1 className="mb-6 text-3xl font-bold">{t('search.title')}</h1>

            {/* Search Input */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('search.placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 pl-10 text-base"
                autoFocus
              />
            </div>

            {query.trim().length < 2 ? (
              <div className="text-center py-12">
                <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">{t('search.enterSearchTerm')}</p>
                <p className="text-sm text-muted-foreground">{t('search.minTwoCharacters')}</p>
              </div>
            ) : isSearching ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('search.searching')}</p>
              </div>
            ) : (
              <>
                {/* Decks Results */}
                {decks.length > 0 && (
                  <div className="mb-8">
                    <h2 className="mb-4 text-xl font-semibold">
                      {t('search.decks')} ({decks.length})
                    </h2>
                    <div className="space-y-3">
                      {decks.map((deck) => (
                        <Link key={deck.id} href={`/deck/${deck.id}`}>
                          <Card className="transition-all hover:shadow-md">
                            <CardHeader>
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{deck.icon}</span>
                                <div className="flex-1">
                                  <CardTitle className="text-base">{deck.name}</CardTitle>
                                  <CardDescription>{deck.description}</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                  {deck.isPublic && (
                                    <Badge variant="outline">🌍 Public</Badge>
                                  )}
                                  <Badge variant="secondary">{deck.dropCount} drops</Badge>
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drops Results */}
                {drops.length > 0 && (
                  <div>
                    <h2 className="mb-4 text-xl font-semibold">
                      {t('search.drops')} ({drops.length})
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {drops.map((drop) => (
                        <Link key={drop.id} href={`/drop/${drop.id}`}>
                          <Card className="h-full transition-all hover:shadow-md">
                            <CardHeader>
                              <CardTitle className="line-clamp-1 text-base">{drop.title}</CardTitle>
                              <CardDescription className="flex items-center gap-1 text-xs">
                                <ExternalLink className="h-3 w-3" />
                                <span className="truncate">{drop.url}</span>
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {drop.contentPreview && (
                                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                  {drop.contentPreview}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-1">
                                {drop.tags.slice(0, 3).map((tag) => (
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
                {decks.length === 0 && drops.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-lg font-medium">{t('search.noResults')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('search.tryDifferentSearch')}
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
