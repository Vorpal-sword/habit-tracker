'use client';

import { useMutation, useQuery } from 'convex/react';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Skeleton } from '@/components/ui/skeleton';

interface DocumentIdPageProps {
  params: {
    documentId: Id<'documents'>;
  };
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  return <div>page</div>;
}
