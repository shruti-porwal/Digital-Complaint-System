import { analyticsService } from '../services/analyticsService.js'
import ExcelJS from 'exceljs'
import PDFDocument from 'pdfkit'

function buildFilters(query) {
  const filters = {}
  if (query.status) filters.status = query.status
  if (query.category) filters.category = query.category
  if (query.userId) filters.userId = query.userId
  if (query.fromDate) filters.fromDate = query.fromDate
  if (query.toDate) filters.toDate = query.toDate
  return filters
}

export const reportsController = {
  async exportReport(req, res) {
    const { format } = req.query
    const filters = buildFilters(req.query)
    const complaints = analyticsService.getReportData(filters)

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook()
      workbook.creator = 'Digital Complaint System'
      const sheet = workbook.addWorksheet('Complaints', { headerFooter: { firstHeader: 'Complaints Report' } })
      sheet.columns = [
        { header: 'ID', key: 'id', width: 36 },
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Category', key: 'category', width: 12 },
        { header: 'Status', key: 'status', width: 14 },
        { header: 'User ID', key: 'userId', width: 36 },
        { header: 'Created', key: 'createdAt', width: 22 },
        { header: 'Updated', key: 'updatedAt', width: 22 },
        { header: 'Admin Notes', key: 'adminNotes', width: 40 },
      ]
      sheet.addRows(complaints.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        status: c.status,
        userId: c.userId,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt || '',
        adminNotes: c.adminNotes || '',
      })))
      sheet.getRow(1).font = { bold: true }
      const buffer = await workbook.xlsx.writeBuffer()
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', `attachment; filename="complaints-report-${Date.now()}.xlsx"`)
      res.send(Buffer.from(buffer))
      return
    }

    if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 50 })
      const filename = `complaints-report-${Date.now()}.pdf`
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
      doc.pipe(res)
      doc.fontSize(18).text('Complaints Report', { align: 'center' })
      doc.moveDown()
      doc.fontSize(10).text(`Generated: ${new Date().toISOString()} | Total: ${complaints.length}`, { align: 'center' })
      doc.moveDown(2)
      if (complaints.length === 0) {
        doc.text('No complaints match the selected filters.', { align: 'left' })
      } else {
        doc.fontSize(9)
        complaints.forEach((c, i) => {
          if (i > 0) doc.moveDown(0.5)
          doc.text(`[${i + 1}] ${c.title}`, { continued: false })
          doc.text(`    ID: ${c.id} | Category: ${c.category} | Status: ${c.status} | Created: ${c.createdAt}`, { continued: false })
          if (c.adminNotes) doc.text(`    Admin notes: ${c.adminNotes}`, { continued: false })
        })
      }
      doc.end()
      return
    }

    res.status(400).json({ message: 'Invalid format. Use format=excel or format=pdf' })
  },
}
