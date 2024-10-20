import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

export const CodeEditor = () => {
    const editorRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current) return;
        const editor = monaco.editor.create(editorRef.current, {
            value: '// Start coding in Here...',
            language: 'java',
            theme: 'vs-dark',
            automaticLayout: true,
        });

        return () => editor.dispose();
    }, []);

    return <div ref={editorRef} style={{ height: '100vh', width: '100%' }} />;
};
