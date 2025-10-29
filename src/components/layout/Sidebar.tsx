'use client';

import type { DeckTree } from '@/apis/data-contracts';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { decksApi } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  Globe,
  Plus,
  Star,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CreateDeckModal } from './CreateDeckModal';

export function Sidebar() {
  const pathname = usePathname();
  const [deckTree, setDeckTree] = useState<DeckTree[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const loadDecks = async () => {
    try {
      const response = await decksApi.decksTree({});
      setDeckTree(response.data);
    } catch (error) {
      console.error('Failed to load deck tree:', error);
    }
  };

  useEffect(() => {
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

  const toggleExpand = (deckId: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deckId)) {
        newSet.delete(deckId);
      } else {
        newSet.add(deckId);
      }
      return newSet;
    });
  };

  const renderDeck = (deck: DeckTree, depth: number = 0) => {
    const isActive = pathname === `/deck/${deck.id}`;
    const children = (deck.children as unknown as DeckTree[]) || [];
    const hasChildren = Array.isArray(children) && children.length > 0;
    const isExpanded = expandedIds.has(deck.id || '');
    const deckColor = deck.color_hex || '#6B7280';

    return (
      <div key={deck.id} className="space-y-1">
        <div
          className={cn(
            'flex items-center gap-1 rounded-md px-2 py-1.5 text-sm transition-colors',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent hover:text-accent-foreground'
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleExpand(deck.id || '');
              }}
              className="p-0.5 hover:bg-accent/50 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}

          <Folder
            className="h-4 w-4 flex-shrink-0"
            style={{ color: deckColor }}
            fill={deckColor}
            fillOpacity={0.2}
          />

          <Link href={`/deck/${deck.id}`} className="flex-1 truncate min-w-0">
            <span className="truncate">{deck.name}</span>
          </Link>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {children.map((child) => renderDeck(child, depth + 1))}
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
          <Button
            className="w-full"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            새 Deck
          </Button>
        </div>

        <Separator />

        {/* Deck List */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-4">
            {deckTree.map((deck) => renderDeck(deck, 0))}
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

      {/* Create Deck Modal */}
      <CreateDeckModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={() => {
          loadDecks();
        }}
      />
    </aside>
  );
}
