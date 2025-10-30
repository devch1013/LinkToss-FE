'use client';

import type { DeckDetail } from '@/apis/data-contracts';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { decksApi, dropsApi } from '@/lib/api-client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function NewDropPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [deck, setDeck] = useState<DeckDetail | null>(null);
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [memo, setMemo] = useState('');
    const [tags, setTags] = useState('');

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
            toast.error('URL과 제목을 입력해주세요.');
            return;
        }

        try {
            const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);

            await dropsApi.dropsCreate({
                deck: params.id as string,
                title,
                url,
                memo: memo || null,
                content: null,
                tags: tagArray,
            });

            toast.success('Drop이 생성되었습니다!');
            router.push(`/deck/${params.id}`);
        } catch (error) {
            toast.error('Drop 생성에 실패했습니다.');
        }
    };

    if (isLoading || !user || !deck) {
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
                            <span className="text-foreground">새 Drop</span>
                        </div>

                        <h1 className="mb-8 text-3xl font-bold">새 Drop 추가</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* URL Input */}
                            <div className="space-y-2">
                                <Label htmlFor="url">🔗 링크 URL *</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    placeholder="https://example.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>

                            {/* Title Input */}
                            <div className="space-y-2">
                                <Label htmlFor="title">📄 제목 *</Label>
                                <Input
                                    id="title"
                                    placeholder="Drop 제목"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            {/* Memo Input */}
                            <div className="space-y-2">
                                <Label htmlFor="memo">📝 노트 (마크다운)</Label>
                                <Textarea
                                    id="memo"
                                    placeholder="마크다운 형식으로 노트를 작성하세요...&#10;&#10;# 제목&#10;## 부제목&#10;- 목록"
                                    value={memo}
                                    onChange={(e) => setMemo(e.target.value)}
                                    rows={15}
                                    className="font-mono text-sm"
                                />
                            </div>

                            {/* Tags Input */}
                            <div className="space-y-2">
                                <Label htmlFor="tags">🏷️ 태그</Label>
                                <Input
                                    id="tags"
                                    placeholder="쉼표로 구분 (예: react, nextjs, typescript)"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    취소
                                </Button>
                                <Button type="submit">저장하기</Button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

