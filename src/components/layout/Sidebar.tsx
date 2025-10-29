'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { mockDeckApi } from '@/lib/mock-api';
import { cn } from '@/lib/utils';
import type { Deck } from '@/types';
import {
  Crown,
  Edit,
  Globe,
  Plus,
  Star,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [sharedDecks, setSharedDecks] = useState<Deck[]>([]);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadDecks = async () => {
      const decks = await mockDeckApi.getDecks();

      // 내 Deck과 공유받은 Deck 분리
      const myDecks = decks.filter(r => r.role === 'owner' && !r.parentId);
      const shared = decks.filter(r => r.role === 'editor' && !r.parentId);

      setDecks(myDecks);
      setSharedDecks(shared);
    };

    loadDecks();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const renderDeck = (deck: Deck) => {
    const isActive = pathname === `/deck/${deck.id}`;

    return (
      <div key={deck.id} className="space-y-1">
        <Link href={`/deck/${deck.id}`}>
          <div
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <span className="text-lg">{deck.icon}</span>
            <span className="flex-1 truncate">{deck.name}</span>
            {deck.role === 'owner' && <Crown className="h-3 w-3" />}
            {deck.role === 'editor' && <Edit className="h-3 w-3" />}
            <span className="text-xs text-muted-foreground">{deck.dropCount}</span>
          </div>
        </Link>

        {/* Sub-decks */}
        {deck.subDecks && deck.subDecks.length > 0 && (
          <div className="ml-6 space-y-1">
            {deck.subDecks.map((subDeck) => (
              <Link key={subDeck.id} href={`/deck/${subDeck.id}`}>
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                    pathname === `/deck/${subDeck.id}`
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-accent'
                  )}
                >
                  <span>{subDeck.icon}</span>
                  <span className="flex-1 truncate">{subDeck.name}</span>
                  <span className="text-xs text-muted-foreground">{subDeck.dropCount}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      ref={sidebarRef}
      className="relative border-r bg-background mr-4"
      style={{ width: `${sidebarWidth}px`, minWidth: '200px', maxWidth: '600px' }}
    >
      <div className="flex h-full flex-col">
        {/* New Deck Button */}
        <div className="p-4">
          <Button className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            새 Deck
          </Button>
        </div>

        <Separator />

        {/* Deck List */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-4 py-4">
            {/* My Decks */}
            <div>
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
                📁 My Decks
              </h3>
              <div className="space-y-1">
                {decks.map((deck) => renderDeck(deck))}
              </div>
            </div>

            {/* Shared with Me */}
            {sharedDecks.length > 0 && (
              <div>
                <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
                  🤝 Shared with Me
                </h3>
                <div className="space-y-1">
                  {sharedDecks.map((deck) => renderDeck(deck))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        {/* Quick Links */}
        <div className="p-3 space-y-1">
          <Link href="/explore">
            <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
              <Globe className="h-4 w-4" />
              <span>탐색</span>
            </div>
          </Link>
          <Link href="/favorites">
            <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
              <Star className="h-4 w-4" />
              <span>즐겨찾기</span>
            </div>
          </Link>
          <Link href="/trash">
            <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent">
              <Trash2 className="h-4 w-4" />
              <span>휴지통</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-primary/20 transition-colors"
        onMouseDown={() => setIsResizing(true)}
      />
    </aside>
  );
}
