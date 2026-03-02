import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'

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
}

/**
 * Appends a signature page to an existing PDF and stamps signature block.
 */
export async function stampSignaturePdf(
  sourcePdfBytes: Uint8Array,
  block: SignatureBlock
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(sourcePdfBytes)
  await appendSignaturePage(pdfDoc, block)
  return pdfDoc.save()
}

/**
 * Generates a standalone signature page PDF when no source PDF exists.
 */
export async function generateSignaturePage(
  proposalId: string,
  block: SignatureBlock
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  // First page — cover
  const coverPage = pdfDoc.addPage([595, 842])
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const { width, height } = coverPage.getSize()

  // Dark background
  coverPage.drawRectangle({
    x: 0, y: 0, width, height,
    color: rgb(0.04, 0.055, 0.1),
  })

  // Purple accent bar at top
  coverPage.drawRectangle({
    x: 0, y: height - 6, width, height: 6,
    color: rgb(0.42, 0.28, 1),
  })

  // Logo area
  coverPage.drawText('AVANT × ANTIMATTER AI', {
    x: 50, y: height - 60,
    font: helveticaBold, size: 18,
    color: rgb(0.42, 0.28, 1),
  })

  coverPage.drawText('ATOM Deployment Proposal', {
    x: 50, y: height - 85,
    font: helvetica, size: 12,
    color: rgb(0.6, 0.6, 0.7),
  })

  // Divider
  coverPage.drawLine({
    start: { x: 50, y: height - 100 },
    end: { x: width - 50, y: height - 100 },
    thickness: 1, color: rgb(0.42, 0.28, 1),
  })

  // Title
  coverPage.drawText('Signature Page', {
    x: 50, y: height - 140,
    font: helveticaBold, size: 24,
    color: rgb(0.97, 0.98, 1),
  })

  coverPage.drawText('Electronic Signature Record', {
    x: 50, y: height - 168,
    font: helvetica, size: 14,
    color: rgb(0.6, 0.6, 0.7),
  })

  await appendSignaturePage(pdfDoc, block)
  return pdfDoc.save()
}

async function appendSignaturePage(pdfDoc: PDFDocument, block: SignatureBlock) {
  const page = pdfDoc.addPage([595, 842])
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const courier = await pdfDoc.embedFont(StandardFonts.Courier)

  const { width, height } = page.getSize()
  const purple = rgb(0.42, 0.28, 1)
  const white = rgb(0.97, 0.98, 1)
  const gray = rgb(0.6, 0.6, 0.7)
  const darkBg = rgb(0.04, 0.055, 0.1)
  const cardBg = rgb(0.06, 0.08, 0.145)

  // Background
  page.drawRectangle({ x: 0, y: 0, width, height, color: darkBg })
  // Top bar
  page.drawRectangle({ x: 0, y: height - 6, width, height: 6, color: purple })

  // Header
  page.drawText('SIGNATURE PAGE', {
    x: 50, y: height - 40,
    font: helveticaBold, size: 10,
    color: purple,
  })

  page.drawText('Avant × Antimatter AI — ATOM Deployment Proposal', {
    x: 50, y: height - 58,
    font: helveticaBold, size: 14,
    color: white,
  })

  // Divider
  page.drawLine({
    start: { x: 50, y: height - 72 },
    end: { x: width - 50, y: height - 72 },
    thickness: 0.5, color: rgb(0.42, 0.28, 1),
  })

  let y = height - 100

  // Signer info card
  const cardX = 50
  const cardW = width - 100
  const cardH = 90
  page.drawRectangle({ x: cardX, y: y - cardH + 16, width: cardW, height: cardH, color: cardBg })
  page.drawRectangle({ x: cardX, y: y + 16, width: 4, height: cardH, color: purple })

  page.drawText('SIGNER INFORMATION', { x: cardX + 12, y: y, font: helveticaBold, size: 8, color: purple })
  y -= 16
  page.drawText(`Name: ${block.signerName}`, { x: cardX + 12, y, font: helveticaBold, size: 11, color: white })
  y -= 16
  page.drawText(`Email: ${block.signerEmail}`, { x: cardX + 12, y, font: helvetica, size: 10, color: gray })
  y -= 14
  page.drawText(`Signed: ${new Date(block.signedAt).toUTCString()}`, { x: cardX + 12, y, font: courier, size: 8, color: gray })
  if (block.ipAddress) {
    y -= 12
    page.drawText(`IP Address: ${block.ipAddress}`, { x: cardX + 12, y, font: courier, size: 8, color: gray })
  }

  y -= 30

  // Signature section
  page.drawText('SIGNATURE', { x: 50, y, font: helveticaBold, size: 8, color: purple })
  y -= 12

  const sigBoxH = 60
  page.drawRectangle({ x: 50, y: y - sigBoxH, width: 240, height: sigBoxH, color: cardBg })
  page.drawRectangle({ x: 50, y: y - sigBoxH, width: 240, height: sigBoxH,
    borderColor: rgb(0.42, 0.28, 0.5), borderWidth: 0.5 })

  if (block.signatureType === 'typed' && block.signatureText) {
    // Draw typed signature
    const sigFontSize = Math.min(24, Math.max(10, 200 / block.signatureText.length))
    page.drawText(block.signatureText, {
      x: 60, y: y - sigBoxH / 2 - 8,
      font: helveticaBold, size: sigFontSize,
      color: white,
    })
  } else if (block.signatureType === 'drawn' && block.signatureDataURL) {
    // Embed drawn signature image
    try {
      const base64Data = block.signatureDataURL.replace(/^data:image\/\w+;base64,/, '')
      const imageBytes = Buffer.from(base64Data, 'base64')
      const image = await pdfDoc.embedPng(imageBytes)
      const imgDims = image.scaleToFit(220, 50)
      page.drawImage(image, {
        x: 60, y: y - 55,
        width: imgDims.width, height: imgDims.height,
      })
    } catch (e) {
      page.drawText('[Drawn signature]', { x: 60, y: y - 35, font: helvetica, size: 10, color: gray })
    }
  }

  page.drawText(block.signerName, {
    x: 55, y: y - sigBoxH - 12,
    font: courier, size: 8, color: gray,
  })
  page.drawText('Signature', { x: 55, y: y - sigBoxH - 22, font: helvetica, size: 7, color: rgb(0.4, 0.4, 0.5) })

  // Initials section
  const initialsX = 320
  page.drawText('INITIALS', { x: initialsX, y: y + 12, font: helveticaBold, size: 8, color: purple })
  const initialsBoxH = 40
  page.drawRectangle({ x: initialsX, y: y - initialsBoxH, width: 120, height: initialsBoxH, color: cardBg })
  page.drawRectangle({ x: initialsX, y: y - initialsBoxH, width: 120, height: initialsBoxH,
    borderColor: rgb(0.42, 0.28, 0.5), borderWidth: 0.5 })

  if (block.initialsText) {
    page.drawText(block.initialsText, {
      x: initialsX + 10, y: y - initialsBoxH / 2 - 8,
      font: helveticaBold, size: 18, color: white,
    })
  }

  y -= sigBoxH + 40

  // Acceptance text
  page.drawText('ACCEPTANCE CLAUSE', { x: 50, y, font: helveticaBold, size: 8, color: purple })
  y -= 12

  const maxCharsPerLine = 90
  const acceptanceLines = wrapText(block.acceptanceText ?? '', maxCharsPerLine)
  const maxLines = Math.min(acceptanceLines.length, 10)

  page.drawRectangle({
    x: 50, y: y - maxLines * 11 - 10, width: width - 100, height: maxLines * 11 + 20, color: cardBg
  })

  for (let i = 0; i < maxLines; i++) {
    page.drawText(acceptanceLines[i], {
      x: 58, y: y - i * 11,
      font: helvetica, size: 7, color: gray,
    })
  }

  y -= maxLines * 11 + 30

  // Audit metadata
  page.drawLine({
    start: { x: 50, y }, end: { x: width - 50, y },
    thickness: 0.5, color: rgb(0.42, 0.28, 1),
  })

  y -= 16
  page.drawText('AUDIT RECORD', { x: 50, y, font: helveticaBold, size: 8, color: purple })
  y -= 12
  const auditLines = [
    `Document: Avant × Antimatter AI — ATOM Deployment Proposal`,
    `Signature Method: ${block.signatureType === 'typed' ? 'Electronic Typed Signature' : 'Electronic Drawn Signature'}`,
    `Timestamp: ${new Date(block.signedAt).toUTCString()}`,
    `IP Address: ${block.ipAddress ?? 'Not captured'}`,
    `This electronic signature carries the same legal weight as a handwritten signature.`,
  ]
  auditLines.forEach((line) => {
    page.drawText(line, { x: 50, y, font: courier, size: 7.5, color: gray })
    y -= 11
  })

  // Page watermark
  page.drawText('EXECUTED', {
    x: width / 2 - 40, y: height / 2,
    font: helveticaBold, size: 48,
    color: rgb(0.42, 0.28, 1),
    rotate: degrees(45),
  })
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim()
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine) lines.push(currentLine)
  return lines
}
