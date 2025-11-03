'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authClient } from './auth-client';

export function useRequireAuth() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending && !session) {
            router.push('/login');
        }
    }, [session, isPending, router]);

    return { session, isPending };
}