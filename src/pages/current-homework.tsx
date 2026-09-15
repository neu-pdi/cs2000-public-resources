import React, { useEffect, useState } from 'react';
import { useHistory } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import { getDocumentId } from '../utils/calendar';

/**
 * Redirects to the latest homework, or shows a fallback if the redirect takes too long
 */
export default function CurrentHomeworkRedirect() {
    const [showFallback, setShowFallback] = useState(false);
    const history = useHistory();
    const homeworksUrl = useBaseUrl(`/homework/${getDocumentId('homework')}`);
    const homeworkOneUrl = useBaseUrl(`/homework/1`);
    useEffect(() => {
        // Redirects to the latest homework
        history.replace(homeworksUrl);

        // Adds small delay to show fallback content if redirect takes too long
        const fallbackTimer = window.setTimeout(() => {
            setShowFallback(true);
        }, 250);
        return () => window.clearTimeout(fallbackTimer);
    }, [history, homeworksUrl]);

    if (!showFallback) {
        return null;
    }

    // Fallback while redirecting if redirect takes too long
    return (
        <Layout title="Current Homework">
            <main className="container margin-vert--lg">
            <h1>Current Homework</h1>
            <p>
                The redirect is taking longer than expected
            </p>
            <a href={homeworkOneUrl}>Continue to Homework 1</a>
            </main>
        </Layout>
    );
}