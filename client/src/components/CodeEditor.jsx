import { useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from '@/contexts/ThemeContext';

const defaultCode = {
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    python: `print("Hello, World!")`,
    cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`
};

export const CodeEditor = ({ socketRef, roomId, onCodeChange, language, editorRef }) => {
    const codeRef = useRef(null);
    const isTyping = useRef(false);
    const { theme } = useTheme();

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        
        monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'light');
        
        if (!codeRef.current) {
            codeRef.current = defaultCode[language];
            editor.setValue(defaultCode[language]);
        }
    };

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on("code-change", ({ code }) => {
                if (code !== null && !isTyping.current) {
                    codeRef.current = code;
                    if (editorRef.current) {
                        const position = editorRef.current.getPosition();
                        editorRef.current.setValue(code);
                        editorRef.current.setPosition(position);
                    }
                }
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off("code-change");
            }
        };
    }, [socketRef.current]);

    const handleEditorChange = (value) => {
        isTyping.current = true;
        codeRef.current = value;
        onCodeChange(value);
        socketRef.current.emit("code-change", {
            roomId,
            code: value,
        });
        setTimeout(() => {
            isTyping.current = false;
        }, 10);
    };

    useEffect(() => {
        if (editorRef.current) {
            codeRef.current = defaultCode[language];
            editorRef.current.setValue(defaultCode[language]);
        }
    }, [language]);

    useEffect(() => {
        if (editorRef.current) {
            const monaco = window.monaco;
            if (monaco) {
                monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'light');
            }
        }
    }, [theme]);

    return (
        <div className="h-full">
            <Editor
                height="100%"
                width="100%"
                language={language}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={codeRef.current || defaultCode[language]}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                }}
            />
        </div>
    );
};
