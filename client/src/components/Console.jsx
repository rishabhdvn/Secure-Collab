import React, { useState, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

export const Console = ({ consoleOutput, onInput, isExecuting }) => {
    const [inputValue, setInputValue] = useState('');
    const outputRef = useRef(null);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [consoleOutput]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            onInput(inputValue);
            setInputValue('');
        }
    }

    return (
        <div className="flex flex-col h-[100%] bg-gray-50 dark:bg-[#1e1e1e] p-4 relative">
            {isExecuting && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-[#1e1e1e]/80 z-10">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600 dark:text-green-400" />
                </div>
            )}
            <div ref={outputRef} className="flex-grow overflow-auto">
                <pre className="text-green-600 dark:text-green-400 whitespace-pre-wrap">
                    {consoleOutput || 'Console output will appear here...'}
                </pre>
            </div>
            
            <div className="flex items-center mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="text-green-600 dark:text-green-400 mr-2">&gt;</span>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow bg-transparent text-green-600 dark:text-green-400 focus:outline-none"
                    placeholder="Enter input here..."
                    autoFocus
                />
            </div>
        </div>
    )
}
