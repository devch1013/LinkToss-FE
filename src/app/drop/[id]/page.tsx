'use client';

import type { CommentTree, Drop } from '@/apis/data-contracts';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { dropsApi } from '@/lib/api-client';
import { Edit, ExternalLink, MessageCircle, Share, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DropDetailPage() {
    const t = useTranslations();
    const params = useParams();
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [drop, setDrop] = useState<Drop | null>(null);
    const [comments, setComments] = useState<CommentTree[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

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
                    setDrop(response.data);
                } catch (error) {
                    console.error('Failed to load drop:', error);
                }
            }
        };

        const loadComments = async () => {
            if (params.id) {
                try {
                    const response = await dropsApi.dropsCommentsTree({ drop_id: params.id as string });
                    const commentsData = response.data;
                    setComments(Array.isArray(commentsData) ? commentsData : []);
                } catch (error) {
                    console.error('Failed to load comments:', error);
                }
            }
        };

        if (user && params.id) {
            loadDrop();
            loadComments();
        }
    }, [user, params.id]);

    const handleDelete = async () => {
        if (drop && confirm(t('drop.confirmDelete'))) {
            try {
                await dropsApi.dropsDelete({ id: drop.id! });
                router.push(`/deck/${drop.deck}`);
            } catch (error) {
                console.error('Failed to delete drop:', error);
            }
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !drop) return;

        try {
            await dropsApi.dropsCommentsCreate({
                drop: drop.id!,
                content: newComment,
            });
            setNewComment('');
            // 댓글 목록 새로고침
            const response = await dropsApi.dropsCommentsTree({ drop_id: drop.id! });
            const commentsData = response.data;
            setComments(Array.isArray(commentsData) ? commentsData : []);
        } catch (error) {
            console.error('Failed to create comment:', error);
        }
    };

    const handleReplySubmit = async (parentId: string) => {
        if (!replyContent.trim() || !drop) return;

        try {
            await dropsApi.dropsCommentsCreate({
                drop: drop.id!,
                content: replyContent,
                parent: parentId,
            });
            setReplyContent('');
            setReplyingTo(null);
            // 댓글 목록 새로고침
            const response = await dropsApi.dropsCommentsTree({ drop_id: drop.id! });
            const commentsData = response.data;
            setComments(Array.isArray(commentsData) ? commentsData : []);
        } catch (error) {
            console.error('Failed to create reply:', error);
        }
    };

    const renderComment = (comment: CommentTree, depth: number = 0) => {
        const replies = comment.replies ? (typeof comment.replies === 'string' ? JSON.parse(comment.replies) : comment.replies) : [];

        return (
            <div key={comment.id} className={depth > 0 ? 'ml-8 mt-4' : 'mt-4'}>
                <Card className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-sm">{comment.user_name || t('common.anonymous')}</span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(comment.created_at!).toLocaleDateString('en-US')}
                                </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="mt-2"
                                onClick={() => setReplyingTo(comment.id!)}
                            >
                                <MessageCircle className="mr-1 h-3 w-3" />
                                {t('drop.reply')}
                            </Button>

                            {replyingTo === comment.id && (
                                <div className="mt-3">
                                    <Textarea
                                        placeholder={t('drop.replyPlaceholder')}
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        className="mb-2"
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleReplySubmit(comment.id!)}>
                                            {t('common.submit')}
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => {
                                            setReplyingTo(null);
                                            setReplyContent('');
                                        }}>
                                            {t('common.cancel')}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
                {Array.isArray(replies) && replies.length > 0 && (
                    <div>
                        {replies.map((reply: CommentTree) => renderComment(reply, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (isLoading || !user || !drop) {
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
                    <div className="container max-w-4xl py-8">
                        {/* Breadcrumb */}
                        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/dashboard" className="hover:text-foreground">{t('common.home')}</Link>
                            <span>/</span>
                            <Link href={`/deck/${drop.deck}`} className="hover:text-foreground">
                                {t('drop.goToDeck')}
                            </Link>
                            <span>/</span>
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
                                        {t('common.edit')}
                                    </Link>
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t('common.delete')}
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Share className="mr-2 h-4 w-4" />
                                    {t('common.share')}
                                </Button>
                            </div>
                        </div>

                        {/* Memo */}
                        {drop.memo && (
                            <div className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold">{t('drop.memo')}</h2>
                                <Card className="p-6">
                                    <p className="text-sm whitespace-pre-wrap">{drop.memo}</p>
                                </Card>
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="mb-8 text-sm text-muted-foreground">
                            <p>{t('drop.createdAt')}: {new Date(drop.created_at!).toLocaleDateString('en-US')}</p>
                            <p>{t('drop.updatedAt')}: {new Date(drop.updated_at!).toLocaleDateString('en-US')}</p>
                        </div>

                        {/* Comments Section */}
                        <div className="mb-8">
                            <h2 className="mb-4 text-xl font-semibold">{t('drop.commentsCount', { count: comments.length })}</h2>

                            {/* New Comment Form */}
                            <Card className="p-4 mb-6">
                                <Textarea
                                    placeholder={t('drop.commentPlaceholder')}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="mb-2"
                                />
                                <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>
                                    {t('drop.writeComment')}
                                </Button>
                            </Card>

                            {/* Comments List */}
                            {comments.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    {t('drop.firstComment')}
                                </p>
                            ) : (
                                <div>
                                    {comments.map((comment) => renderComment(comment))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

