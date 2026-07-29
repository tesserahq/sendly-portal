import { useCallback, useEffect, useRef } from 'react'
import type { OnMount } from '@monaco-editor/react'
import type * as MonacoType from 'monaco-editor'
import { getHtmlErrors } from './html-validator'

export function useHtmlValidation(value: string) {
  const editorRef = useRef<MonacoType.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof MonacoType | null>(null)

  const runValidation = useCallback((content: string) => {
    const editor = editorRef.current
    const monaco = monacoRef.current
    if (!editor || !monaco) return
    const model = editor.getModel()
    if (!model) return

    monaco.editor.setModelMarkers(
      model,
      'html-validator',
      getHtmlErrors(content).map((e) => ({
        severity: monaco.MarkerSeverity.Error,
        message: e.message,
        startLineNumber: e.startLine,
        startColumn: e.startCol,
        endLineNumber: e.endLine,
        endColumn: e.endCol,
      }))
    )
  }, [])

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
    runValidation(value)
  }

  // Re-validate whenever value changes, whether from typing or being set
  // externally (e.g. loaded from an API, or reloaded when switching tabs).
  useEffect(() => {
    runValidation(value)
  }, [value, runValidation])

  return { handleMount }
}
