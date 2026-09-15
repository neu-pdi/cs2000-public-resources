import React, { useEffect, useState } from 'react';
import { useHistory } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import { getDocumentId } from '../utils/calendar';
import DaySummary from '../components/DaySummary';

/**
 * Redirects to the latest lecture day, or shows a fallback if the redirect takes too long
 */
export default function CurrentDayRedirect() {
    const [showFallback, setShowFallback] = useState(false);
    const history = useHistory();
    const daysUrl = useBaseUrl(`/days/${getDocumentId('lectures')}`);
    useEffect(() => {
        // Redirects to the latest lecture day
        history.replace(daysUrl);

        // Adds small delay to show fallback content if redirect takes too long
        const fallbackTimer = window.setTimeout(() => {
            setShowFallback(true);
        }, 250);
        return () => window.clearTimeout(fallbackTimer);
    }, [history, daysUrl]);

    if (!showFallback) {
        return null;
    }

    // Fallback while redirecting if redirect takes too long
    return (
        <Layout title="Table of Contents">
            <DaySummary version="current" />
        </Layout>
    );
}