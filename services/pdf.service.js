import PDFDocument from 'pdfkit'
import fs from 'fs'

export const pdfService = {
  buildBugsPDF,
}


function buildBugsPDF(bugs, fileName = 'Bugs') {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument()
console.log('pdfservice');
    if (!fs.existsSync('./pdf')) {
      fs.mkdirSync('./pdf')
    }

    const stream = fs.createWriteStream(`pdf/${fileName}.pdf`)
    doc.pipe(stream)

    
    bugs.forEach((bug) => {
      doc.fontSize(20)
      doc.text(bug.title, { align: 'left' })
      doc.fontSize(16)
      doc.text(bug.description, { align: 'left' })
      doc.text('Severity: ' + bug.severity, { align: 'left' })
      const d = new Date(bug.createdAt)
      doc.text('Created at: ' + d.toLocaleString(), { align: 'left' })
      doc.moveDown()
    })

    doc.end()

    stream.on('finish', () => {
      resolve()
    })
  })
}


