const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

interface ParsedTag {
  name: string
  closing: boolean
  selfClosing: boolean
  index: number
  length: number
}

function parseHtmlTags(html: string): ParsedTag[] {
  // Blank out comments and script/style bodies so their content isn't parsed as tags
  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, (m) => ' '.repeat(m.length))
    .replace(
      /(<script[^>]*>)([\s\S]*?)(<\/script>)/gi,
      (_m, open, body, close) => open + ' '.repeat(body.length) + close
    )
    .replace(
      /(<style[^>]*>)([\s\S]*?)(<\/style>)/gi,
      (_m, open, body, close) => open + ' '.repeat(body.length) + close
    )

  const tags: ParsedTag[] = []
  // Handles quoted attributes that may contain ">" chars
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)(\s(?:[^>"']|"[^"]*"|'[^']*')*)?(\/?)\s*>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(cleaned)) !== null) {
    const [fullMatch, slash, rawName, , selfSlash] = m
    const name = rawName.toLowerCase()
    tags.push({
      name,
      closing: slash === '/',
      selfClosing: selfSlash === '/' || VOID_ELEMENTS.has(name),
      index: m.index,
      length: fullMatch.length,
    })
  }
  return tags
}

function indexToLineCol(text: string, index: number) {
  const before = text.slice(0, index)
  const lines = before.split('\n')
  return { line: lines.length, col: lines[lines.length - 1].length + 1 }
}

export interface HtmlMarker {
  message: string
  startLine: number
  startCol: number
  endLine: number
  endCol: number
}

export function getHtmlErrors(html: string): HtmlMarker[] {
  const tags = parseHtmlTags(html)
  const stack: Array<{ name: string; index: number; length: number }> = []
  const errors: HtmlMarker[] = []

  for (const tag of tags) {
    if (tag.selfClosing) continue

    if (!tag.closing) {
      stack.push({ name: tag.name, index: tag.index, length: tag.length })
      continue
    }

    // Closing tag — look for a matching opener in the stack
    if (stack.length > 0 && stack[stack.length - 1].name === tag.name) {
      stack.pop()
      continue
    }

    let matchIdx = -1
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i].name === tag.name) {
        matchIdx = i
        break
      }
    }

    if (matchIdx !== -1) {
      // Tags above the match are implicitly unclosed
      for (let i = stack.length - 1; i > matchIdx; i--) {
        const open = stack[i]
        const { line, col } = indexToLineCol(html, open.index)
        errors.push({
          message: `Unclosed tag <${open.name}>`,
          startLine: line,
          startCol: col,
          endLine: line,
          endCol: col + open.length - 1,
        })
      }
      stack.splice(matchIdx)
    } else {
      const { line, col } = indexToLineCol(html, tag.index)
      errors.push({
        message: `Unexpected closing tag </${tag.name}>`,
        startLine: line,
        startCol: col,
        endLine: line,
        endCol: col + tag.length - 1,
      })
    }
  }

  // Anything left in the stack is unclosed
  for (const open of stack) {
    const { line, col } = indexToLineCol(html, open.index)
    errors.push({
      message: `Unclosed tag <${open.name}>`,
      startLine: line,
      startCol: col,
      endLine: line,
      endCol: col + open.length - 1,
    })
  }

  return errors
}
