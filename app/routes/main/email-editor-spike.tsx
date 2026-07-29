/**
 * Throwaway spike for https://github.com/tesserahq/sendly-portal/issues/50.
 * Not linked from nav — visit /email-editor-spike directly. Safe to delete
 * once the exploration questions (image upload storage, layout reuse,
 * custom slash commands) are answered.
 *
 * This uses the low-level Tiptap composition (EditorContent + useEditor)
 * instead of the batteries-included <EmailEditor>, because customizing the
 * slash-command list (adding "Image") is only supported this way — see
 * https://react.email/docs/editor/features/slash-commands#adding-custom-commands.
 * It mirrors what <EmailEditor> wires up internally (StarterKit, Placeholder,
 * EmailTheming, BubbleMenu variants) so we don't lose that behavior.
 */
import { useState } from 'react'
import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import { Placeholder } from '@tiptap/extension-placeholder'
import { StarterKit } from '@react-email/editor/extensions'
import { EmailTheming, useEditorImage, imageSlashCommand } from '@react-email/editor/plugins'
import { SlashCommand, BubbleMenu, defaultSlashCommands } from '@react-email/editor/ui'
import { composeReactEmail } from '@react-email/editor/core'
import '@react-email/editor/themes/default.css'
import '@react-email/editor/styles/bubble-menu.css'
import '@react-email/editor/styles/slash-command.css'

const content = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Welcome to the Newsletter' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "Edit this content, then type '/' to see the custom Image command in the slash menu.",
        },
      ],
    },
  ],
}

export default function StandaloneEditorFull() {
  const [output, setOutput] = useState('')

  const handleUploadImage = async (file: File) => {
    console.log('[spike] onUploadImage called with', file.name, file.type, file.size)
    // Stub for the spike: no storage backend exists in this app yet (see issue #50),
    // so we just hand back a local blob URL to exercise the upload UX/contract.
    return { url: URL.createObjectURL(file) }
  }

  const imageExtension = useEditorImage({ uploadImage: handleUploadImage })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: ({ node }: { node: { type: { name: string }; attrs: { level?: number } } }) =>
          node.type.name === 'heading'
            ? `Heading ${node.attrs.level}`
            : "Press '/' for commands, or paste/drop an image",
        includeChildren: true,
      }),
      EmailTheming.configure({ theme: 'basic' }),
      imageExtension,
    ],
    content,
    immediatelyRender: false,
  })

  const handleExportHtml = async () => {
    if (!editor) return
    const { html } = await composeReactEmail({ editor })
    setOutput(html)
  }

  const handleGetJson = () => {
    if (!editor) return
    setOutput(JSON.stringify(editor.getJSON(), null, 2))
  }

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="page-content">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={handleExportHtml}
            className="px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg)
              text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)">
            Export HTML
          </button>
          <button
            type="button"
            onClick={handleGetJson}
            className="px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg)
              text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)">
            Get JSON
          </button>
        </div>

        <p className="text-xs text-(--re-text) opacity-60 mb-2">
          Tip: paste an image from the clipboard, drag &amp; drop one into the editor, or type{' '}
          <code>/</code> and pick <strong>Image</strong> to upload one.
        </p>

        <EditorContent editor={editor} className="p-4 bg-white rounded-md" />

        <SlashCommand items={[...defaultSlashCommands, imageSlashCommand]} />
        <BubbleMenu
          hideWhenActiveNodes={['button', 'horizontalRule']}
          hideWhenActiveMarks={['link']}
        />
        <BubbleMenu.LinkDefault />
        <BubbleMenu.ButtonDefault />
        <BubbleMenu.ImageDefault />

        {output && (
          <pre
            className="mt-4 w-full p-3 font-mono text-xs bg-(--re-bg) text-(--re-text) border
              border-(--re-border) rounded-lg whitespace-pre-wrap break-words select-all">
            {output}
          </pre>
        )}
      </div>
    </EditorContext.Provider>
  )
}
