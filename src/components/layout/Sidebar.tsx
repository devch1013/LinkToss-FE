'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { mockRepositoryApi } from '@/lib/mock-api';
import type { Repository } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Folder,
  Crown,
  Edit,
  Search,
  Star,
  Trash2,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [sharedRepos, setSharedRepos] = useState<Repository[]>([]);

  useEffect(() => {
    const loadRepositories = async () => {
      const repos = await mockRepositoryApi.getRepositories();

      // 내 Repository와 공유받은 Repository 분리
      const myRepos = repos.filter(r => r.role === 'owner' && !r.parentId);
      const shared = repos.filter(r => r.role === 'editor' && !r.parentId);

      setRepositories(myRepos);
      setSharedRepos(shared);
    };

    loadRepositories();
  }, []);

  const renderRepository = (repo: Repository) => {
    const isActive = pathname === `/repository/${repo.id}`;

    return (
      <div key={repo.id} className="space-y-1">
        <Link href={`/repository/${repo.id}`}>
          <div
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <span className="text-lg">{repo.icon}</span>
            <span className="flex-1 truncate">{repo.name}</span>
            {repo.role === 'owner' && <Crown className="h-3 w-3" />}
            {repo.role === 'editor' && <Edit className="h-3 w-3" />}
            <span className="text-xs text-muted-foreground">{repo.documentCount}</span>
          </div>
        </Link>

        {/* Sub-repositories */}
        {repo.subRepositories && repo.subRepositories.length > 0 && (
          <div className="ml-6 space-y-1">
            {repo.subRepositories.map((subRepo) => (
              <Link key={subRepo.id} href={`/repository/${subRepo.id}`}>
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                    pathname === `/repository/${subRepo.id}`
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-accent'
                  )}
                >
                  <span>{subRepo.icon}</span>
                  <span className="flex-1 truncate">{subRepo.name}</span>
                  <span className="text-xs text-muted-foreground">{subRepo.documentCount}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 border-r bg-background">
      <div className="flex h-full flex-col">
        {/* New Repository Button */}
        <div className="p-4">
          <Button className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            새 Repository
          </Button>
        </div>

        <Separator />

        {/* Repository List */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-4 py-4">
            {/* My Repositories */}
            <div>
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
                📁 My Repositories
              </h3>
              <div className="space-y-1">
                {repositories.map((repo) => renderRepository(repo))}
              </div>
            </div>

            {/* Shared with Me */}
            {sharedRepos.length > 0 && (
              <div>
                <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
                  🤝 Shared with Me
                </h3>
                <div className="space-y-1">
                  {sharedRepos.map((repo) => renderRepository(repo))}
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
    </aside>
  );
}
