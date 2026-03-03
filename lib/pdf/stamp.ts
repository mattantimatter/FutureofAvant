import { PDFDocument, PDFFont, StandardFonts, rgb, degrees } from 'pdf-lib'
import type { FieldPosition } from '@/components/admin/PDFFieldPlacer'

export interface SignatureBlock {
  signerName: string
  signerEmail: string
  signedAt: string
  signatureType: 'typed' | 'drawn'
  signatureText?: string
  signatureDataURL?: string
  initialsText?: string
  ipAddress?: string
  acceptanceText?: string
  fieldPositions?: FieldPosition[]
}

/**
 * Stamps a signature block onto an existing PDF.
 * If fieldPositions is set and non-empty, stamps at those exact page coordinates.
 * Otherwise, appends a dedicated signature page.
 */
export async function stampSignaturePdf(
  sourcePdfBytes: Uint8Array,
  block: SignatureBlock
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(sourcePdfBytes)

  if (block.fieldPositions && block.fieldPositions.length > 0) {
    await stampAtFieldPositions(pdfDoc, block)
    await appendAuditPage(pdfDoc, block)
  } else {
    await appendSignaturePage(pdfDoc, block)
  }

  return pdfDoc.save()
}

/**
 * Generates a standalone signature-page PDF (no source PDF uploaded).
 */
export async function generateSignaturePage(
  proposalId: string,
  block: SignatureBlock
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const cover = pdfDoc.addPage([595, 842])
  const { width, height } = cover.getSize()

  cover.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.008, 0.008, 0.008) })
  cover.drawRectangle({ x: 0, y: height - 5, width, height: 5, color: rgb(0.41, 0.416, 0.674) })
  cover.drawText('AVANT PATHFINDER × ANTIMATTER AI', { x: 50, y: height - 40, font: bold, size: 11, color: rgb(0.41, 0.416, 0.674) })
  cover.drawText('ATOM Deployment Proposal — Signature Page', { x: 50, y: height - 60, font: regular, size: 12, color: rgb(0.96, 0.965, 0.992) })
  cover.drawText(`ID: ${proposalId.slice(0, 8).toUpperCase()}`, { x: 50, y: height - 82, font: regular, size: 9, color: rgb(0.5, 0.5, 0.6) })

  await appendSignaturePage(pdfDoc, block)
  return pdfDoc.save()
}

// ─── Helpers ────────────────────────────────────────────────────

async function stampAtFieldPositions(pdfDoc: PDFDocument, block: SignatureBlock) {
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const pages = pdfDoc.getPages()
  const signedDate = new Date(block.signedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const accent = rgb(0.41, 0.416, 0.674)
  const dark = rgb(0.08, 0.08, 0.15)
  const gray = rgb(0.4, 0.4, 0.5)

  for (const field of block.fieldPositions ?? []) {
    const pageIndex = field.page - 1
    if (pageIndex < 0 || pageIndex >= pages.length) continue
    const page = pages[pageIndex]
    const { x, y, width: w, height: h } = field

    if (field.type === 'signature') {
      // Background box
      page.drawRectangle({ x, y, width: w, height: h, color: rgb(0.96, 0.965, 0.992), borderColor: accent, borderWidth: 1, opacity: 0.92 })
      if (block.signatureType === 'drawn' && block.signatureDataURL) {
        try {
          const img = await pdfDoc.embedPng(Buffer.from(block.signatureDataURL.replace(/^data:image\/\w+;base64,/, ''), 'base64'))
          const dims = img.scaleToFit(w - 8, h - 18)
          page.drawImage(img, { x: x + 4, y: y + 12, width: dims.width, height: dims.height })
        } catch { drawTypedSig(page, block.signatureText ?? block.signerName, x, y, w, h, bold) }
      } else {
        drawTypedSig(page, block.signatureText ?? block.signerName, x, y, w, h, bold)
      }
      page.drawLine({ start: { x: x + 4, y: y + 10 }, end: { x: x + w - 4, y: y + 10 }, thickness: 0.5, color: accent })
      page.drawText(`${block.signerName} · ${signedDate}`, { x: x + 4, y: y + 2, font: regular, size: 5.5, color: gray })

    } else if (field.type === 'initials') {
      page.drawRectangle({ x, y, width: w, height: h, color: rgb(0.93, 0.99, 0.96), borderColor: rgb(0.1, 0.7, 0.5), borderWidth: 1, opacity: 0.92 })
      const initials = block.initialsText ?? block.signerName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
      const fontSize = Math.min(h * 0.5, 20)
      page.drawText(initials, { x: x + w / 2 - initials.length * fontSize * 0.32, y: y + h / 2 - fontSize * 0.35, font: bold, size: fontSize, color: dark })
      page.drawLine({ start: { x: x + 4, y: y + 8 }, end: { x: x + w - 4, y: y + 8 }, thickness: 0.5, color: rgb(0.1, 0.7, 0.5) })

    } else if (field.type === 'text') {
      // Text field — filled in by signer, stored in field.value at signing time
      const textVal = (field as typeof field & { signerValue?: string }).signerValue ?? ''
      page.drawRectangle({ x, y, width: w, height: h, color: rgb(1, 0.98, 0.94), borderColor: rgb(0.9, 0.65, 0.1), borderWidth: 1, opacity: 0.92 })
      if (textVal) {
        const fs = Math.min(h * 0.5, 11)
        page.drawText(textVal, { x: x + 4, y: y + h / 2 - fs * 0.35, font: regular, size: fs, color: dark })
      }
      // Label underline
      if (field.label) {
        page.drawText(field.label, { x: x + 4, y: y + 2, font: regular, size: 5.5, color: rgb(0.6, 0.5, 0.2) })
      }
      page.drawLine({ start: { x: x + 4, y: y + 10 }, end: { x: x + w - 4, y: y + 10 }, thickness: 0.5, color: rgb(0.9, 0.65, 0.1) })

    } else if (field.type === 'date') {
      page.drawRectangle({ x, y, width: w, height: h, color: rgb(0.94, 0.97, 1), borderColor: rgb(0.23, 0.51, 0.96), borderWidth: 1, opacity: 0.92 })
      const dateText = signedDate
      const fs = Math.min(h * 0.42, 10)
      page.drawText(dateText, { x: x + 4, y: y + h / 2 - fs * 0.35, font: regular, size: fs, color: dark })
      page.drawText('Date Signed', { x: x + 4, y: y + 2, font: regular, size: 5.5, color: rgb(0.3, 0.5, 0.8) })
      page.drawLine({ start: { x: x + 4, y: y + 10 }, end: { x: x + w - 4, y: y + 10 }, thickness: 0.5, color: rgb(0.23, 0.51, 0.96) })

    } else if (field.type === 'admin_signature') {
      // Pre-stamped admin/sender signature
      page.drawRectangle({ x, y, width: w, height: h, color: rgb(0.97, 0.95, 1), borderColor: rgb(0.55, 0.36, 1), borderWidth: 1, opacity: 0.92 })
      if (field.dataURL) {
        try {
          const img = await pdfDoc.embedPng(Buffer.from(field.dataURL.replace(/^data:image\/\w+;base64,/, ''), 'base64'))
          const dims = img.scaleToFit(w - 8, h - 18)
          page.drawImage(img, { x: x + 4, y: y + 12, width: dims.width, height: dims.height })
        } catch { drawTypedSig(page, field.value ?? 'Admin', x, y, w, h, bold) }
      } else if (field.value) {
        drawTypedSig(page, field.value, x, y, w, h, bold)
      }
      page.drawLine({ start: { x: x + 4, y: y + 10 }, end: { x: x + w - 4, y: y + 10 }, thickness: 0.5, color: rgb(0.55, 0.36, 1) })
      page.drawText('Sender Signature', { x: x + 4, y: y + 2, font: regular, size: 5.5, color: rgb(0.5, 0.35, 0.8) })
    }
  }
}

function drawTypedSig(page: ReturnType<PDFDocument['getPages']>[number], text: string, x: number, y: number, w: number, h: number, font: PDFFont) {
  const fontSize = Math.max(8, Math.min(h * 0.45, (w - 16) / Math.max(text.length * 0.6, 1), 24))
  page.drawText(text, { x: x + 6, y: y + h / 2 - fontSize * 0.35, font, size: fontSize, color: rgb(0.08, 0.08, 0.15) })
}

async function appendAuditPage(pdfDoc: PDFDocument, block: SignatureBlock) {
  const page = pdfDoc.addPage([595, 842])
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const courier = await pdfDoc.embedFont(StandardFonts.Courier)
  const { width, height } = page.getSize()
  const accent = rgb(0.41, 0.416, 0.674)
  const gray = rgb(0.5, 0.5, 0.6)

  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.008, 0.008, 0.008) })
  page.drawRectangle({ x: 0, y: height - 4, width, height: 4, color: accent })
  page.drawText('ELECTRONIC SIGNATURE AUDIT RECORD', { x: 50, y: height - 32, font: bold, size: 9, color: accent })
  page.drawLine({ start: { x: 50, y: height - 45 }, end: { x: width - 50, y: height - 45 }, thickness: 0.5, color: accent })

  let y = height - 65
  const info = [
    `Signer: ${block.signerName} <${block.signerEmail}>`,
    `Timestamp: ${new Date(block.signedAt).toUTCString()}`,
    `Method: ${block.signatureType === 'typed' ? 'Typed Signature' : 'Drawn Signature'}`,
    `IP Address: ${block.ipAddress ?? 'Not captured'}`,
    `Fields Stamped at Specified Positions: ${block.fieldPositions?.length ?? 0}`,
  ]
  info.forEach((line) => { page.drawText(line, { x: 50, y, font: regular, size: 9, color: gray }); y -= 15 })

  y -= 10
  page.drawText('ACCEPTANCE CLAUSE', { x: 50, y, font: bold, size: 8, color: accent })
  y -= 13
  wrapText(block.acceptanceText ?? '', 88).slice(0, 10).forEach((line) => {
    page.drawText(line, { x: 50, y, font: courier, size: 7.5, color: gray })
    y -= 11
  })
}

async function appendSignaturePage(pdfDoc: PDFDocument, block: SignatureBlock) {
  const page = pdfDoc.addPage([595, 842])
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const courier = await pdfDoc.embedFont(StandardFonts.Courier)
  const { width, height } = page.getSize()
  const bg = rgb(0.008, 0.008, 0.008)
  const cardBg = rgb(0.03, 0.03, 0.05)
  const accent = rgb(0.41, 0.416, 0.674)
  const white = rgb(0.96, 0.965, 0.992)
  const gray = rgb(0.5, 0.5, 0.6)

  page.drawRectangle({ x: 0, y: 0, width, height, color: bg })
  page.drawRectangle({ x: 0, y: height - 5, width, height: 5, color: accent })
  page.drawText('SIGNATURE PAGE', { x: 50, y: height - 35, font: bold, size: 9, color: accent })
  page.drawText('Avant Pathfinder × Antimatter AI — ATOM Deployment Proposal', { x: 50, y: height - 52, font: bold, size: 13, color: white })
  page.drawLine({ start: { x: 50, y: height - 67 }, end: { x: width - 50, y: height - 67 }, thickness: 0.5, color: accent })

  let y = height - 92

  // Signer info card
  page.drawRectangle({ x: 50, y: y - 72, width: width - 100, height: 76, color: cardBg })
  page.drawRectangle({ x: 50, y: y - 72, width: 3, height: 76, color: accent })
  page.drawText('SIGNER', { x: 60, y, font: bold, size: 8, color: accent })
  y -= 14; page.drawText(block.signerName, { x: 60, y, font: bold, size: 13, color: white })
  y -= 14; page.drawText(block.signerEmail, { x: 60, y, font: regular, size: 10, color: gray })
  y -= 12; page.drawText(`Signed: ${new Date(block.signedAt).toUTCString()}`, { x: 60, y, font: courier, size: 8, color: gray })
  if (block.ipAddress) { y -= 11; page.drawText(`IP: ${block.ipAddress}`, { x: 60, y, font: courier, size: 8, color: gray }) }

  y -= 26

  // Signature box
  page.drawText('SIGNATURE', { x: 50, y, font: bold, size: 8, color: accent }); y -= 12
  const sigH = 65
  page.drawRectangle({ x: 50, y: y - sigH, width: 250, height: sigH, color: cardBg, borderColor: accent, borderWidth: 0.5 })
  if (block.signatureType === 'typed' && block.signatureText) {
    const fs = Math.min(22, Math.max(10, 180 / block.signatureText.length))
    page.drawText(block.signatureText, { x: 60, y: y - sigH / 2 - 8, font: bold, size: fs, color: white })
  } else if (block.signatureType === 'drawn' && block.signatureDataURL) {
    try {
      const img = await pdfDoc.embedPng(Buffer.from(block.signatureDataURL.replace(/^data:image\/\w+;base64,/, ''), 'base64'))
      const dims = img.scaleToFit(230, 55)
      page.drawImage(img, { x: 60, y: y - 60, width: dims.width, height: dims.height })
    } catch { page.drawText('[Drawn signature]', { x: 60, y: y - 35, font: regular, size: 10, color: gray }) }
  }

  // Initials box
  page.drawText('INITIALS', { x: 330, y: y + 12, font: bold, size: 8, color: accent })
  const initH = 44
  page.drawRectangle({ x: 330, y: y - initH, width: 120, height: initH, color: cardBg, borderColor: accent, borderWidth: 0.5 })
  if (block.initialsText) {
    page.drawText(block.initialsText, { x: 340, y: y - initH / 2 - 8, font: bold, size: 18, color: white })
  }
  page.drawText(block.signerName, { x: 55, y: y - sigH - 12, font: courier, size: 8, color: gray })
  y -= sigH + 32

  // Acceptance text
  page.drawText('ACCEPTANCE CLAUSE', { x: 50, y, font: bold, size: 8, color: accent }); y -= 12
  const lines = wrapText(block.acceptanceText ?? '', 90)
  const max = Math.min(lines.length, 10)
  page.drawRectangle({ x: 50, y: y - max * 11 - 10, width: width - 100, height: max * 11 + 20, color: cardBg })
  lines.slice(0, max).forEach((line, i) => { page.drawText(line, { x: 58, y: y - i * 11, font: regular, size: 7.5, color: gray }) })
  y -= max * 11 + 26

  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.5, color: accent }); y -= 14
  page.drawText('AUDIT', { x: 50, y, font: bold, size: 8, color: accent }); y -= 12;
  [`Method: ${block.signatureType === 'typed' ? 'Electronic Typed Signature' : 'Electronic Drawn Signature'}`,
    `IP: ${block.ipAddress ?? 'Not captured'}`,
    'This signature carries the same legal weight as a handwritten signature.',
  ].forEach((line) => { page.drawText(line, { x: 50, y, font: courier, size: 7.5, color: gray }); y -= 11 })

  page.drawText('EXECUTED', {
    x: width / 2 - 40, y: height / 2, font: bold, size: 48,
    color: accent, opacity: 0.05, rotate: degrees(45),
  })
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length <= maxChars) { cur = (cur + ' ' + w).trim() }
    else { if (cur) lines.push(cur); cur = w }
  }
  if (cur) lines.push(cur)
  return lines
}
