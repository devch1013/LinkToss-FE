'use client';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { mockDropApi } from '@/lib/mock-api';
import type { Drop } from '@/types';
import { Edit, ExternalLink, Share, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DropDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [drop, setDrop] = useState<Drop | null>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        const loadDrop = async () => {
            if (params.id) {
                const drop = await mockDropApi.getDrop(params.id as string);
                setDrop(drop);
            }
        };

        if (user && params.id) {
            loadDrop();
        }
    }, [user, params.id]);

    const handleDelete = async () => {
        if (drop && confirm('정말 삭제하시겠습니까?')) {
            await mockDropApi.deleteDrop(drop.id);
            router.push(`/deck/${drop.deckId}`);
        }
    };

    if (isLoading || !user || !drop) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl">🔗</div>
                    <p className="mt-2 text-sm text-muted-foreground">로딩 중...</p>
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
                            <Link href="/dashboard" className="hover:text-foreground">홈</Link>
                            <span>/</span>
                            {drop.deck && (
                                <>
                                    <Link href={`/deck/${drop.deck.id}`} className="hover:text-foreground">
                                        {drop.deck.name}
                                    </Link>
                                    <span>/</span>
                                </>
                            )}
                            <span className="text-foreground">{drop.title}</span>
                        </div>

                        {/* Drop Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold">{drop.title}</h1>
                            <div className="mt-3 flex items-center gap-3">
                                <a
                                    href={drop.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="truncate">{drop.url}</span>
                                </a>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <Button size="sm" variant="outline" asChild>
                                    <Link href={`/drop/${drop.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        수정
                                    </Link>
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    삭제
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Share className="mr-2 h-4 w-4" />
                                    공유
                                </Button>
                            </div>
                        </div>

                        {/* Link Preview */}
                        {drop.linkMetadata && (
                            <Card className="mb-8 overflow-hidden">
                                {drop.linkMetadata.ogImage && (
                                    <img
                                        src={drop.linkMetadata.ogImage}
                                        alt={drop.linkMetadata.ogTitle || drop.title}
                                        className="h-64 w-full object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    {drop.linkMetadata.ogTitle && (
                                        <h3 className="mb-2 text-xl font-semibold">{drop.linkMetadata.ogTitle}</h3>
                                    )}
                                    {drop.linkMetadata.ogDescription && (
                                        <p className="text-muted-foreground">{drop.linkMetadata.ogDescription}</p>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Drop Content */}
                        {drop.content && (
                            <div className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold">📝 노트</h2>
                                <Card className="p-6">
                                    <div className="prose prose-sm max-w-none dark:prose-invert">
                                        {/* Simple markdown rendering - in real app, use react-markdown */}
                                        {drop.content.split('\n').map((line, i) => {
                                            if (line.startsWith('# ')) {
                                                return <h1 key={i} className="text-2xl font-bold mb-4">{line.slice(2)}</h1>;
                                            }
                                            if (line.startsWith('## ')) {
                                                return <h2 key={i} className="text-xl font-semibold mb-3">{line.slice(3)}</h2>;
                                            }
                                            if (line.startsWith('- ')) {
                                                return <li key={i} className="ml-4">{line.slice(2)}</li>;
                                            }
                                            if (line.trim() === '') {
                                                return <br key={i} />;
                                            }
                                            return <p key={i} className="mb-2">{line}</p>;
                                        })}
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* Tags */}
                        {drop.tags && drop.tags.length > 0 && (
                            <div className="mb-8">
                                <h2 className="mb-3 text-xl font-semibold">🏷️ 태그</h2>
                                <div className="flex flex-wrap gap-2">
                                    {drop.tags.map((tag) => (
                                        <Badge key={tag.id} variant="secondary" style={{ backgroundColor: tag.color + '20', color: tag.color }}>
                                            #{tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="text-sm text-muted-foreground">
                            <p>생성일: {new Date(drop.createdAt).toLocaleDateString('ko-KR')}</p>
                            <p>수정일: {new Date(drop.updatedAt).toLocaleDateString('ko-KR')}</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

