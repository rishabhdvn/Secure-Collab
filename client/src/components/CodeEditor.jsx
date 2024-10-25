import React, { useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";

export const CodeEditor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            const editor = CodeMirror.fromTextArea(
                document.getElementById("realtimeEditor"),
                {
                    mode: { name: "javascript", json: true },
                    theme: "dracula",
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );
            editorRef.current = editor
            editorRef.current.setSize(null, "100%");

            editorRef.current.on("change", (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== "setValue") {
                    socketRef.current.emit("code-change", {
                        roomId,
                        code
                    });
                }
            });
        };

        init();

    }, [socketRef, roomId]);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on("code-change", ({ code }) => {
                if (code != null) {
                    editorRef.current.setValue(code);
                }
            });
        }
        return () => {
            if(socketRef.current){
                socketRef.current.off("code-change");
            }
        }
    }, [socketRef.current]);

    return (
        <div style={{ height: "100vh" }}>
            <textarea id="realtimeEditor"></textarea>
        </div>
    );
};
