import React, { useEffect, useState } from 'react';
import { useHistory } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import { getDocumentId } from '../utils/calendar';

/**
 * Redirects to the latest lab, or shows a fallback if the redirect takes too long
 */
export default function CurrentLabRedirect() {
    const [showFallback, setShowFallback] = useState(false);
    const history = useHistory();
    const labsUrl = useBaseUrl(`/lab/${getDocumentId('lab')}`);
    const labOneUrl = useBaseUrl(`/lab/1`);
    useEffect(() => {
        // Redirects to the latest lab
        history.replace(labsUrl);

        // Adds small delay to show fallback content if redirect takes too long
        const fallbackTimer = window.setTimeout(() => {
            setShowFallback(true);
        }, 250);
        return () => window.clearTimeout(fallbackTimer);
    }, [history, labsUrl]);

    if (!showFallback) {
        return null;
    }

    // Fallback while redirecting if redirect takes too long
    return (
        <Layout title="Current Lab">
            <main className="container margin-vert--lg">
            <h1>Current Lab</h1>
            <p>
                The redirect is taking longer than expected
            </p>
            <a href={labOneUrl}>Continue to Lab 1</a>
            </main>
        </Layout>
    );
}