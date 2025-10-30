'use client';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { mockDecks } from '@/lib/mock-data';
import { FileText, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ExplorePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const t = useTranslations();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

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

  const publicDecks = mockDecks.filter(r => r.isPublic);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">{t('explore.title')}</h1>
              <p className="mt-2 text-muted-foreground">
                {t('explore.subtitle')}
              </p>
            </div>

            {/* Public Decks */}
            {publicDecks.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {publicDecks.map((deck) => (
                  <Link key={deck.id} href={`/deck/${deck.id}`}>
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{deck.icon}</span>
                          <Badge variant="outline" className="gap-1">
                            <Globe className="h-3 w-3" />
                            Public
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{deck.name}</CardTitle>
                        <CardDescription>{deck.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{deck.dropCount} drops</span>
                          </div>
                          {deck.user && (
                            <div className="flex items-center gap-1">
                              <span>{t('explore.by')}</span>
                              <span className="font-medium">@{deck.user.username}</span>
                            </div>
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
                  <Globe className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 text-lg font-medium">{t('explore.noPublicDecks')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('explore.comingSoon')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
