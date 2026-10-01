import React, { useEffect, useState } from 'react';
import { useHistory } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import { getDocumentId } from '../utils/calendar';
import ClassSummary from '../components/ClassSummary';

/**
 * Redirects to the latest class, or shows a fallback if the redirect takes too long
 */
export default function CurrentClassRedirect() {
    const [showFallback, setShowFallback] = useState(false);
    const history = useHistory();
    const classUrl = useBaseUrl(`/class/${getDocumentId('lectures')}`);
    useEffect(() => {
        // Redirects to the latest class
        history.replace(classUrl);

        // Adds small delay to show fallback content if redirect takes too long
        const fallbackTimer = window.setTimeout(() => {
            setShowFallback(true);
        }, 250);
        return () => window.clearTimeout(fallbackTimer);
    }, [history, classUrl]);

    if (!showFallback) {
        return null;
    }

    // Fallback while redirecting if redirect takes too long
    return (
        <Layout title="Table of Contents">
            <ClassSummary version="current" />
        </Layout>
    );
}