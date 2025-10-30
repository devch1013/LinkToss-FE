'use client';

import type { Dashboard, Deck, Drop } from '@/apis/data-contracts';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { usersApi } from '@/lib/api-client';
import { ExternalLink, FileText, FolderOpen, Globe, Tag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const t = useTranslations();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<Dashboard | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadStats = async () => {
      const response = await usersApi.usersProfileDashboard();
      setStats(response.data);
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
            {/* Greeting */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold">{t('dashboard.welcome', { name: user.name })}</h1>
              <p className="mt-2 text-muted-foreground">
                {t('dashboard.welcomeMessage')}
              </p>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('dashboard.totalDecks')}</CardTitle>
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.overview.deck_count}개</div>
                    <p className="text-xs text-muted-foreground">
                      {t('dashboard.managedSystematically')}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('dashboard.totalDrops')}</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.overview.drop_count}개</div>
                    <p className="text-xs text-muted-foreground">
                      {t('dashboard.savedLinks')}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('dashboard.publicDecks')}</CardTitle>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.overview.public_deck_count}개</div>
                    <p className="text-xs text-muted-foreground">
                      {t('dashboard.sharing')}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('dashboard.tags')}</CardTitle>
                    <Tag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.overview.tag_count}개</div>
                    <p className="text-xs text-muted-foreground">
                      {t('dashboard.categorizing')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Drops */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{t('dashboard.recentDrops')}</h2>
                <Button variant="ghost" asChild>
                  <Link href="/search">{t('dashboard.viewAll')}</Link>
                </Button>
              </div>

              {stats && stats.recent_drops.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {stats.recent_drops.map((drop: Drop) => (
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
                          {drop.content && (
                            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                              {drop.content}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {typeof drop.tags === 'string' ? (
                              <Badge variant="secondary" className="text-xs">
                                #{drop.tags}
                              </Badge>
                            ) : null}
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
                    <p className="mb-2 text-lg font-medium">{t('dashboard.noDropsYet')}</p>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {t('dashboard.saveFirstLink')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Frequent Decks */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{t('dashboard.frequentDecks')}</h2>
              </div>

              {stats && stats.frequent_decks.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {stats.frequent_decks.map((deck: Deck) => (
                    <Link key={deck.id} href={`/deck/${deck.id}`}>
                      <Card className="h-full transition-all hover:shadow-md">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">📁</span>
                            <div className="flex-1">
                              <CardTitle className="line-clamp-1 text-base">{deck.name}</CardTitle>
                              {deck.is_public && (
                                <Badge variant="outline" className="mt-1 text-xs">
                                  🌍 Public
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {deck.description && (
                            <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                              {deck.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{deck.children_count || 0} {t('dashboard.items')}</span>
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
                    <p className="mb-2 text-lg font-medium">{t('dashboard.createDeck')}</p>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {t('dashboard.manageLinkSystematically')}
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
