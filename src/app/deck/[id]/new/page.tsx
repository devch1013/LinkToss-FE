'use client';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { mockDropApi } from '@/lib/mock-api';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function NewDropPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [metadata, setMetadata] = useState<any>(null);
    const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    const fetchMetadata = async () => {
        if (!url) return;

        setIsLoadingMetadata(true);
        try {
            const meta = await mockDropApi.fetchMetadata(url);
            setMetadata(meta);
            if (meta.ogTitle && !title) {
                setTitle(meta.ogTitle);
            }
        } catch (error) {
            toast.error('메타데이터를 가져오는데 실패했습니다.');
        } finally {
            setIsLoadingMetadata(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!url || !title) {
            toast.error('URL과 제목을 입력해주세요.');
            return;
        }

        try {
            const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);

            await mockDropApi.createDrop({
                deckId: params.id as string,
                title,
                url,
                content,
                tags: tagArray,
            });

            toast.success('Drop이 생성되었습니다!');
            router.push(`/deck/${params.id}`);
        } catch (error) {
            toast.error('Drop 생성에 실패했습니다.');
        }
    };

    if (isLoading || !user) {
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
                            <Link href={`/deck/${params.id}`} className="hover:text-foreground">Deck</Link>
                            <span>/</span>
                            <span className="text-foreground">새 Drop</span>
                        </div>

                        <h1 className="mb-8 text-3xl font-bold">새 Drop 추가</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* URL Input */}
                            <div className="space-y-2">
                                <Label htmlFor="url">🔗 링크 URL *</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="url"
                                        type="url"
                                        placeholder="https://example.com"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        onClick={fetchMetadata}
                                        disabled={isLoadingMetadata || !url}
                                    >
                                        {isLoadingMetadata ? '가져오는 중...' : '가져오기'}
                                    </Button>
                                </div>
                            </div>

                            {/* Metadata Preview */}
                            {metadata && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">링크 프리뷰</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            {metadata.ogTitle && <p><strong>제목:</strong> {metadata.ogTitle}</p>}
                                            {metadata.ogDescription && <p><strong>설명:</strong> {metadata.ogDescription}</p>}
                                            {metadata.ogImage && (
                                                <img
                                                    src={metadata.ogImage}
                                                    alt="Preview"
                                                    className="mt-2 h-32 w-full rounded object-cover"
                                                />
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

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

                            {/* Content Input */}
                            <div className="space-y-2">
                                <Label htmlFor="content">📝 노트 (마크다운)</Label>
                                <Textarea
                                    id="content"
                                    placeholder="마크다운 형식으로 노트를 작성하세요...&#10;&#10;# 제목&#10;## 부제목&#10;- 목록"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
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

