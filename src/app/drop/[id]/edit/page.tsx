'use client';

import type { Drop } from '@/apis/data-contracts';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { dropsApi } from '@/lib/api-client';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function DropEditPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [drop, setDrop] = useState<Drop | null>(null);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [memo, setMemo] = useState('');
    const [tags, setTags] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        const loadDrop = async () => {
            if (params.id) {
                try {
                    const response = await dropsApi.dropsRead({ id: params.id as string });
                    const dropData = response.data;
                    setDrop(dropData);
                    setTitle(dropData.title);
                    setUrl(dropData.url);
                    setMemo(dropData.memo || '');
                    // tags가 배열이면 join, 문자열이면 그대로 사용
                    const tagsValue = dropData.tags 
                        ? (Array.isArray(dropData.tags) ? dropData.tags.join(', ') : dropData.tags)
                        : '';
                    setTags(tagsValue);
                } catch (error) {
                    console.error('Failed to load drop:', error);
                    toast.error('Drop을 불러오는데 실패했습니다.');
                }
            }
        };

        if (user && params.id) {
            loadDrop();
        }
    }, [user, params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!drop) return;

        if (!title.trim() || !url.trim()) {
            toast.error('제목과 URL은 필수입니다.');
            return;
        }

        setIsSaving(true);
        try {
            const tagArray = tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            await dropsApi.dropsUpdate(
                { id: drop.id! },
                {
                    title: title.trim(),
                    url: url.trim(),
                    memo: memo.trim() || null,
                    tags: tagArray.length > 0 ? tagArray : undefined,
                }
            );

            toast.success('Drop이 수정되었습니다.');
            router.push(`/drop/${drop.id}`);
        } catch (error) {
            console.error('Failed to update drop:', error);
            toast.error('Drop 수정에 실패했습니다.');
        } finally {
            setIsSaving(false);
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
                    <div className="container max-w-3xl py-8">
                        {/* Breadcrumb */}
                        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/dashboard" className="hover:text-foreground">홈</Link>
                            <span>/</span>
                            <Link href={`/deck/${drop.deck}`} className="hover:text-foreground">
                                덱으로 이동
                            </Link>
                            <span>/</span>
                            <Link href={`/drop/${drop.id}`} className="hover:text-foreground">
                                {drop.title}
                            </Link>
                            <span>/</span>
                            <span className="text-foreground">수정</span>
                        </div>

                        {/* Header */}
                        <div className="mb-8 flex items-center justify-between">
                            <h1 className="text-3xl font-bold">Drop 수정</h1>
                            <Button variant="outline" asChild>
                                <Link href={`/drop/${drop.id}`}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    뒤로
                                </Link>
                            </Button>
                        </div>

                        {/* Form */}
                        <Card className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="title">제목 *</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="링크 제목"
                                        required
                                        maxLength={255}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="url">URL *</Label>
                                    <Input
                                        id="url"
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        required
                                        maxLength={200}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="memo">메모</Label>
                                    <Textarea
                                        id="memo"
                                        value={memo}
                                        onChange={(e) => setMemo(e.target.value)}
                                        placeholder="이 링크에 대한 메모를 작성하세요..."
                                        rows={6}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="tags">태그</Label>
                                    <Input
                                        id="tags"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="태그1, 태그2, 태그3"
                                    />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        쉼표(,)로 구분하여 여러 태그를 입력할 수 있습니다.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Button type="submit" disabled={isSaving}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {isSaving ? '저장 중...' : '저장'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => router.back()}>
                                        취소
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}

