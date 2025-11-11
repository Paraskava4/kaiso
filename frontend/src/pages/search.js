import { Suspense } from 'react';
import { SearchPage } from '@/page-components';

/**
 * Search Route Component
 *
 * This is the Next.js pages router page component for the search route (/search).
 * It renders the SearchPage component which contains all the search functionality.
 */
export default function Search() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchPage />
    </Suspense>
  );
}
