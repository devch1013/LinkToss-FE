'use client';

import { X } from 'lucide-react';
import { useState, KeyboardEvent, useRef } from 'react';
import { Badge } from './badge';
import { Input } from './input';

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    id?: string;
}

export function TagInput({ value, onChange, placeholder, id }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !value.includes(trimmedTag)) {
            onChange([...value, trimmedTag]);
        }
        setInputValue('');
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' && inputValue.trim()) {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            e.preventDefault();
            removeTag(value[value.length - 1]);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue.trim()) {
                addTag(inputValue);
            }
        }
    };

    return (
        <div
            className="flex min-h-10 w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            onClick={() => inputRef.current?.focus()}
        >
            {value.map((tag, index) => (
                <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeTag(tag);
                        }}
                        className="ml-1 rounded-full hover:bg-muted"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            ))}
            <Input
                ref={inputRef}
                id={id}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={value.length === 0 ? placeholder : ''}
                className="flex-1 border-0 bg-transparent p-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
        </div>
    );
}
