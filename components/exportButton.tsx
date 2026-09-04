import { useContext } from 'react'

//

import { DownloadIcon } from './icons'
import { IdeasContext } from '../src/App'
import exportMarkdown, { exportFilename } from '../src/utils/exportMarkdown'

//

// The whole board leaves as one Markdown file - readable in any editor, and
// not a format that needs this app to open it again.
function ExportButton() {
  const { ideas, getDate } = useContext(IdeasContext)

  const download = () => {
    const exportedAt = Date.now()
    const markdown = exportMarkdown(ideas, getDate, exportedAt)
    const url = URL.createObjectURL(
      new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    )

    const link = document.createElement('a')
    link.href = url
    link.download = exportFilename(exportedAt)
    document.body.appendChild(link)
    link.click()
    link.remove()

    // the object url holds the whole board in memory until it is released
    URL.revokeObjectURL(url)
  }

  return (
    <button
      type='button'
      className='export-btn'
      aria-label='Export the board as Markdown'
      onClick={download}>
      <DownloadIcon />
      <span>Export</span>
    </button>
  )
}

export default ExportButton
