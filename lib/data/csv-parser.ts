// ─── CSV Parser (RFC 4180 compliant) ──────────────────────────────────────────
//
// Robust CSV parser supporting quotes, commas, escaped quotes, and newlines.
// Zero external dependencies.

export interface CsvParseResult {
  headers: string[]
  rows: Record<string, string>[]
  errors: string[]
}

export function parseCsv(text: string): CsvParseResult {
  const lines: string[][] = []
  let currentRow: string[] = []
  let currentField = ''
  let insideQuotes = false
  let i = 0

  while (i < text.length) {
    const char = text[i]
    const nextChar = text[i + 1]

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote: "" -> "
          currentField += '"'
          i += 2
          continue
        } else {
          // End of quoted field
          insideQuotes = false
          i++
          continue
        }
      } else {
        currentField += char
        i++
        continue
      }
    } else {
      if (char === '"') {
        insideQuotes = true
        i++
        continue
      } else if (char === ',') {
        currentRow.push(currentField.trim())
        currentField = ''
        i++
        continue
      } else if (char === '\r') {
        if (nextChar === '\n') {
          currentRow.push(currentField.trim())
          lines.push(currentRow)
          currentRow = []
          currentField = ''
          i += 2
          continue
        } else {
          currentRow.push(currentField.trim())
          lines.push(currentRow)
          currentRow = []
          currentField = ''
          i++
          continue
        }
      } else if (char === '\n') {
        currentRow.push(currentField.trim())
        lines.push(currentRow)
        currentRow = []
        currentField = ''
        i++
        continue
      } else {
        currentField += char
        i++
        continue
      }
    }
  }

  // Final field
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField.trim())
    lines.push(currentRow)
  }

  // Filter empty lines
  const nonEmptyLines = lines.filter((line) => line.length > 0 && line.some((f) => f.length > 0))
  if (nonEmptyLines.length === 0) {
    return { headers: [], rows: [], errors: ['CSV content is empty'] }
  }

  const rawHeaders = nonEmptyLines[0]
  const headers = rawHeaders.map((h) => h.trim().replace(/^[\uFEFF]/, '')) // strip BOM
  const rows: Record<string, string>[] = []
  const errors: string[] = []

  for (let rowIndex = 1; rowIndex < nonEmptyLines.length; rowIndex++) {
    const row = nonEmptyLines[rowIndex]
    if (row.length !== headers.length) {
      errors.push(`Row ${rowIndex + 1}: expected ${headers.length} columns, found ${row.length}`)
      continue
    }

    const rowObj: Record<string, string> = {}
    for (let c = 0; c < headers.length; c++) {
      rowObj[headers[c]] = row[c]
    }
    rows.push(rowObj)
  }

  return { headers, rows, errors }
}
