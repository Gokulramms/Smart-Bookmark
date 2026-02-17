'use client';

import { useState, useCallback } from 'react';
import type { Toast, ToastType } from '@/types';

let toastId = 0;

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, message: string, duration: number = 5000) => {
        const id = String(toastId++);
        const toast: Toast = { id, type, message, duration };

        setToasts(prev => [...prev, toast]);

        // Auto-remove toast after duration
        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = useCallback((message: string, duration?: number) => {
        return showToast('success', message, duration);
    }, [showToast]);

    const error = useCallback((message: string, duration?: number) => {
        return showToast('error', message, duration);
    }, [showToast]);

    const info = useCallback((message: string, duration?: number) => {
        return showToast('info', message, duration);
    }, [showToast]);

    const warning = useCallback((message: string, duration?: number) => {
        return showToast('warning', message, duration);
    }, [showToast]);

    return {
        toasts,
        showToast,
        removeToast,
        success,
        error,
        info,
        warning,
    };
}
