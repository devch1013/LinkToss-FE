'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { decksApi } from '@/lib/api-client';
import { useState } from 'react';
import { toast } from 'sonner';

interface CreateDeckModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

const COLOR_OPTIONS = [
    '#ef4444', // red
    '#f97316', // orange
    '#f59e0b', // amber
    '#eab308', // yellow
    '#84cc16', // lime
    '#22c55e', // green
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#a855f7', // purple
    '#ec4899', // pink
];

export function CreateDeckModal({ open, onOpenChange, onSuccess }: CreateDeckModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [colorHex, setColorHex] = useState(COLOR_OPTIONS[0]);
    const [isPublic, setIsPublic] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('덱 이름을 입력해주세요');
            return;
        }

        setIsLoading(true);

        try {
            await decksApi.decksCreate({
                name: name.trim(),
                description: description.trim() || null,
                color_hex: colorHex,
                is_public: isPublic,
            });

            toast.success('덱을 생성했어요');

            // 폼 초기화
            setName('');
            setDescription('');
            setColorHex(COLOR_OPTIONS[0]);
            setIsPublic(false);

            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error('Failed to create deck:', error);
            toast.error('덱 생성에 실패했어요');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>새 Deck 만들기</DialogTitle>
                        <DialogDescription>
                            새로운 덱을 만들어 링크를 정리하세요
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* 이름 */}
                        <div className="space-y-2">
                            <Label htmlFor="name">이름 *</Label>
                            <Input
                                id="name"
                                placeholder="덱 이름을 입력하세요"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={255}
                                required
                            />
                        </div>

                        {/* 설명 */}
                        <div className="space-y-2">
                            <Label htmlFor="description">설명</Label>
                            <Textarea
                                id="description"
                                placeholder="덱에 대한 설명을 입력하세요"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {/* 폴더 색 */}
                        <div className="space-y-2">
                            <Label>폴더 색</Label>
                            <div className="flex gap-2 flex-wrap">
                                {COLOR_OPTIONS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
                                        style={{
                                            backgroundColor: color,
                                            borderColor: colorHex === color ? '#000' : 'transparent',
                                        }}
                                        onClick={() => setColorHex(color)}
                                        aria-label={`색상 ${color}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* 공개 여부 */}
                        <div className="flex items-center space-x-2">
                            <input
                                id="is_public"
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <Label htmlFor="is_public" className="cursor-pointer">
                                공개 덱으로 설정
                            </Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            취소
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? '생성 중...' : '생성'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

