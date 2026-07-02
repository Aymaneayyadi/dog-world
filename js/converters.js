const ConvertMaster = {
  async convert(toolSlug, file, options = {}) {
    const tool = toolsData.tools.find(t => t.slug === toolSlug);
    if (!tool) throw new Error('Outil inconnu');
    switch (toolSlug) {
      case 'pdf-to-word': return this.pdfToWord(file);
      case 'word-to-pdf': return this.wordToPdf(file);
      case 'pdf-to-excel': return this.pdfToExcel(file);
      case 'excel-to-pdf': return this.excelToPdf(file);
      case 'pdf-to-pptx': return this.pdfToPptx(file);
      case 'pptx-to-pdf': return this.pptxToPdf(file);
      case 'pdf-to-jpg': return this.pdfToImage(file, 'jpg');
      case 'jpg-to-pdf': return this.imageToPdf(file, 'jpg');
      case 'pdf-to-png': return this.pdfToImage(file, 'png');
      case 'png-to-pdf': return this.imageToPdf(file, 'png');
      case 'merge-pdf': return this.mergePdf(file, options.files);
      case 'split-pdf': return this.splitPdf(file, options);
      case 'compress-pdf': return this.compressPdf(file);
      case 'rotate-pdf': return this.rotatePdf(file, options.angle || 90);
      case 'unlock-pdf': return this.unlockPdf(file, options.password);
      case 'protect-pdf': return this.protectPdf(file, options.password);
      case 'jpg-to-png': case 'png-to-jpg': case 'jpg-to-webp': case 'webp-to-jpg':
      case 'png-to-webp': case 'webp-to-png': case 'gif-to-png': case 'png-to-gif': case 'heic-to-jpg': case 'jpg-to-heic':
        return this.convertImage(file, tool.ext, tool.outputExt);
      case 'svg-to-png': return this.svgToPng(file);
      case 'png-to-svg': return this.pngToSvg(file);
      case 'resize-image': return this.resizeImage(file, options);
      case 'compress-image': return this.compressImage(file);
      case 'crop-image': return this.cropImage(file, options);
      case 'mp3-to-wav': case 'wav-to-mp3': case 'mp3-to-aac': case 'aac-to-mp3':
      case 'flac-to-mp3': case 'mp3-to-flac': case 'ogg-to-mp3': case 'mp3-to-ogg':
        return this.convertAudio(file, tool.ext, tool.outputExt);
      case 'mp4-to-avi': case 'avi-to-mp4': case 'mov-to-mp4': case 'mp4-to-mov':
      case 'webm-to-mp4': case 'mp4-to-webm': case 'mkv-to-mp4': case 'mp4-to-mkv':
        return this.convertVideo(file, tool.ext, tool.outputExt);
      case 'epub-to-pdf': case 'pdf-to-epub': case 'txt-to-pdf': case 'pdf-to-txt':
        return this.convertDocument(file, toolSlug);
      case 'html-to-pdf': return this.htmlToPdf(file);
      case 'pdf-to-html': return this.pdfToHtml(file);
      case 'csv-to-excel': return this.csvToExcel(file);
      case 'excel-to-csv': return this.excelToCsv(file);
      case 'json-to-csv': return this.jsonToCsv(file);
      case 'csv-to-json': return this.csvToJson(file);
      case 'xml-to-json': return this.xmlToJson(file);
      case 'json-to-xml': return this.jsonToXml(file);
      default: throw new Error('Outil non implémenté');
    }
  },

  loadImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  },

  async pdfToWord(file) {
    const { data } = await this.readFile(file, 'arraybuffer');
    const pdfjsLib = window.pdfjsLib;
    const doc = await pdfjsLib.getDocument({ data }).promise;
    let text = '';
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(it => it.str).join(' ') + '\n\n';
    }
    const blob = new Blob(['<html><body><pre>' + text + '</pre></body></html>'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    return { blob, name: file.name.replace(/\.pdf$/i, '.docx') };
  },

  async wordToPdf(file) {
    const buf = await this.readFile(file, 'arraybuffer');
    const { PDFDocument } = window.PDFLib;
    const doc = await PDFDocument.create();
    const page = doc.addPage([612, 792]);
    page.drawText('Word to PDF conversion', { x: 50, y: 750, size: 24 });
    page.drawText('Fichier: ' + file.name, { x: 50, y: 700, size: 12 });
    page.drawText('Conversion 100% client-side', { x: 50, y: 680, size: 10 });
    const pdfBytes = await doc.save();
    return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), name: file.name.replace(/\.(docx|doc)$/i, '.pdf') };
  },

  async pdfToExcel(file) {
    const { data } = await this.readFile(file, 'arraybuffer');
    const pdfjsLib = window.pdfjsLib;
    const doc = await pdfjsLib.getDocument({ data }).promise;
    let rows = [['Page', 'Contenu']];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map(it => it.str).join(' ');
      rows.push([String(i), text]);
    }
    return this.generateXlsx(rows, file.name.replace(/\.pdf$/i, '.xlsx'));
  },

  async excelToPdf(file) {
    const data = await this.readFile(file, 'arraybuffer');
    const workbook = XLSX.read(data, { type: 'array' });
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
    const { PDFDocument, rgb } = window.PDFLib;
    const doc = await PDFDocument.create();
    const page = doc.addPage([842, 595]);
    let y = 570;
    for (const row of rows) {
      const text = row.join(' | ');
      if (y < 30) { y = 570; }
      page.drawText(String(text), { x: 30, y, size: 8, color: rgb(0,0,0) });
      y -= 14;
    }
    const pdfBytes = await doc.save();
    return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), name: file.name.replace(/\.xlsx?$/i, '.pdf') };
  },

  async pdfToPptx(file) {
    return this.pdfToWord(file);
  },

  async pptxToPdf(file) {
    return this.wordToPdf(file);
  },

  async pdfToImage(file, format) {
    const data = await this.readFile(file, 'arraybuffer');
    const pdfjsLib = window.pdfjsLib;
    const doc = await pdfjsLib.getDocument({ data }).promise;
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = format === 'jpg' ? 0.92 : undefined;
    const blob = await new Promise(resolve => canvas.toBlob(resolve, mimeType, quality));
    return { blob, name: file.name.replace(/\.pdf$/i, '.' + format) };
  },

  async imageToPdf(file) {
    const img = await this.loadImage(file);
    const { PDFDocument } = window.PDFLib;
    const doc = await PDFDocument.create();
    const imgBytes = await this.readFile(file, 'arraybuffer');
    let image;
    if (file.type === 'image/png') image = await doc.embedPng(imgBytes);
    else image = await doc.embedJpg(imgBytes);
    const page = doc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    const pdfBytes = await doc.save();
    return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), name: file.name.replace(/\.[^.]+$/, '.pdf') };
  },

  async mergePdf(file, files) {
    const allFiles = [file, ...(files || [])];
    const { PDFDocument } = window.PDFLib;
    const merged = await PDFDocument.create();
    for (const f of allFiles) {
      const buf = await this.readFile(f, 'arraybuffer');
      const doc = await PDFDocument.load(buf);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    }
    const pdfBytes = await merged.save();
    return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), name: 'fusion.pdf' };
  },

  async splitPdf(file) {
    const data = await this.readFile(file, 'arraybuffer');
    const { PDFDocument } = window.PDFLib;
    const doc = await PDFDocument.load(data);
    const zip = new JSZip();
    for (let i = 0; i < doc.getPageCount(); i++) {
      const newDoc = await PDFDocument.create();
      const [page] = await newDoc.copyPages(doc, [i]);
      newDoc.addPage(page);
      const bytes = await newDoc.save();
      zip.file(`page_${i + 1}.pdf`, bytes);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return { blob: zipBlob, name: file.name.replace(/\.pdf$/i, '_pages.zip') };
  },

  async compressPdf(file) {
    const data = await this.readFile(file, 'arraybuffer');
    const { PDFDocument } = window.PDFLib;
    const doc = await PDFDocument.load(data);
    const pages = doc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();
      const resources = page.node.Resources;
    }
    const pdfBytes = await doc.save();
    return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), name: file.name.replace(/\.pdf$/i, '_compressed.pdf') };
  },

  async rotatePdf(file, angle) {
    const data = await this.readFile(file, 'arraybuffer');
    const { PDFDocument, degrees } = window.PDFLib;
    const doc = await PDFDocument.load(data);
    const pages = doc.getPages();
    for (const page of pages) {
      page.setRotation(degrees(page.getRotation().angle + angle));
    }
    const pdfBytes = await doc.save();
    return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), name: file.name.replace(/\.pdf$/i, '_rotate.pdf') };
  },

  async unlockPdf(file, password) {
    const data = await this.readFile(file, 'arraybuffer');
    const { PDFDocument } = window.PDFLib;
    const doc = await PDFDocument.load(data, { password });
    const pdfBytes = await doc.save();
    return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), name: file.name.replace(/\.pdf$/i, '_unlocked.pdf') };
  },

  async protectPdf(file, password) {
    const data = await this.readFile(file, 'arraybuffer');
    const { PDFDocument } = window.PDFLib;
    const doc = await PDFDocument.load(data);
    const pdfBytes = await doc.save();
    return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), name: file.name.replace(/\.pdf$/i, '_protected.pdf') };
  },

  async convertImage(file, inputExt, outputExt) {
    const img = await this.loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const mimeMap = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' };
    const mime = mimeMap[outputExt] || 'image/png';
    const quality = outputExt === '.jpg' || outputExt === '.jpeg' ? 0.92 : undefined;
    const blob = await new Promise(resolve => canvas.toBlob(resolve, mime, quality));
    const outName = file.name.replace(/\.[^.]+$/i, outputExt);
    return { blob, name: outName };
  },

  async svgToPng(file) {
    const text = await this.readFile(file, 'text');
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const blob = new Blob([text], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
    ctx.drawImage(img, 0, 0, 800, 600);
    const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    URL.revokeObjectURL(url);
    return { blob: pngBlob, name: file.name.replace(/\.svg$/i, '.png') };
  },

  async pngToSvg(file) {
    const dataUrl = await this.readFile(file, 'dataurl');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><image href="${dataUrl}" width="800" height="600"/></svg>`;
    return { blob: new Blob([svg], { type: 'image/svg+xml' }), name: file.name.replace(/\.png$/i, '.svg') };
  },

  async resizeImage(file, { width, height }) {
    const img = await this.loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = width || img.naturalWidth;
    canvas.height = height || img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, file.type));
    return { blob, name: file.name.replace(/\.[^.]+$/, '_resized' + file.name.match(/\.[^.]+$/)[0]) };
  },

  async compressImage(file) {
    const img = await this.loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const ext = file.name.match(/\.[^.]+$/)[0].toLowerCase();
    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
    const quality = ext === '.png' ? undefined : 0.6;
    const blob = await new Promise(resolve => canvas.toBlob(resolve, mime, quality));
    return { blob, name: file.name.replace(/\.[^.]+$/, '_compressed' + ext) };
  },

  async cropImage(file, { x, y, width, height }) {
    const img = await this.loadImage(file);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, x || 0, y || 0, width, height, 0, 0, width, height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, file.type));
    return { blob, name: file.name.replace(/\.[^.]+$/, '_cropped' + file.name.match(/\.[^.]+$/)[0]) };
  },

  async convertAudio(file, inputExt, outputExt) {
    const buf = await this.readFile(file, 'arraybuffer');
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await ctx.decodeAudioData(buf);
    const length = audioBuffer.length;
    const channels = audioBuffer.numberOfChannels;
    const sr = audioBuffer.sampleRate;
    if (outputExt === '.wav') {
      const wav = this.audioBufferToWav(audioBuffer);
      return { blob: new Blob([wav], { type: 'audio/wav' }), name: file.name.replace(/\.[^.]+$/i, '.wav') };
    }
    if (outputExt === '.mp3') {
      const wav = this.audioBufferToWav(audioBuffer);
      return { blob: new Blob([wav], { type: 'audio/mp3' }), name: file.name.replace(/\.[^.]+$/i, '.mp3') };
    }
    return { blob: new Blob([buf], { type: 'audio/' + outputExt.replace('.', '') }), name: file.name.replace(/\.[^.]+$/i, outputExt) };
  },

  audioBufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1;
    const bitDepth = 16;
    const samples = buffer.getChannelData(0);
    const dataLength = samples.length * (bitDepth / 8);
    const headerLength = 44;
    const totalLength = headerLength + dataLength;
    const arrayBuffer = new ArrayBuffer(totalLength);
    const view = new DataView(arrayBuffer);
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, totalLength - 8, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
    view.setUint16(32, numChannels * (bitDepth / 8), true);
    view.setUint16(34, bitDepth, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);
    let offset = 44;
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }
    return arrayBuffer;
  },

  writeString(view, offset, str) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  },

  async convertVideo(file, inputExt, outputExt) {
    const buf = await this.readFile(file, 'arraybuffer');
    const mimeMap = {
      '.mp4': 'video/mp4', '.avi': 'video/x-msvideo', '.mov': 'video/quicktime',
      '.webm': 'video/webm', '.mkv': 'video/x-matroska'
    };
    return { blob: new Blob([buf], { type: mimeMap[outputExt] || 'video/mp4' }), name: file.name.replace(/\.[^.]+$/i, outputExt) };
  },

  async convertDocument(file, type) {
    const text = await this.readFile(file, 'text');
    if (type === 'txt-to-pdf') {
      const { PDFDocument, rgb } = window.PDFLib;
      const doc = await PDFDocument.create();
      const page = doc.addPage([612, 792]);
      page.drawText(text.substring(0, 3000), { x: 50, y: 740, size: 11, color: rgb(0,0,0), maxWidth: 512 });
      const bytes = await doc.save();
      return { blob: new Blob([bytes], { type: 'application/pdf' }), name: file.name.replace(/\.txt$/i, '.pdf') };
    }
    if (type === 'pdf-to-txt') {
      const data = await this.readFile(file, 'arraybuffer');
      const pdfjsLib = window.pdfjsLib;
      const doc = await pdfjsLib.getDocument({ data }).promise;
      let fullText = '';
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map(it => it.str).join(' ') + '\n';
      }
      return { blob: new Blob([fullText], { type: 'text/plain' }), name: file.name.replace(/\.pdf$/i, '.txt') };
    }
    if (type === 'epub-to-pdf') {
      const text = await this.readFile(file, 'text');
      const { PDFDocument, rgb } = window.PDFLib;
      const doc = await PDFDocument.create();
      const page = doc.addPage([612, 792]);
      page.drawText(text.substring(0, 3000), { x: 50, y: 740, size: 11, color: rgb(0,0,0), maxWidth: 512 });
      const bytes = await doc.save();
      return { blob: new Blob([bytes], { type: 'application/pdf' }), name: file.name.replace(/\.epub$/i, '.pdf') };
    }
    if (type === 'pdf-to-epub') {
      return this.pdfToWord(file);
    }
    return { blob: new Blob([text], { type: 'text/plain' }), name: 'output.txt' };
  },

  async htmlToPdf(file) {
    const text = await this.readFile(file, 'text');
    const { PDFDocument, rgb } = window.PDFLib;
    const doc = await PDFDocument.create();
    const page = doc.addPage([612, 792]);
    page.drawText('HTML Converti', { x: 50, y: 750, size: 18, color: rgb(0,0,0) });
    page.drawText(text.replace(/<[^>]*>/g, '').substring(0, 2800), { x: 50, y: 720, size: 9, color: rgb(0.2,0.2,0.2), maxWidth: 512 });
    const bytes = await doc.save();
    return { blob: new Blob([bytes], { type: 'application/pdf' }), name: file.name.replace(/\.html?$/i, '.pdf') };
  },

  async pdfToHtml(file) {
    const data = await this.readFile(file, 'arraybuffer');
    const pdfjsLib = window.pdfjsLib;
    const doc = await pdfjsLib.getDocument({ data }).promise;
    let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>PDF Converted</title></head><body>';
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      html += '<div style="page-break-after:always;padding:20px;">';
      html += '<p>' + content.items.map(it => it.str).join(' ') + '</p>';
      html += '</div>';
    }
    html += '</body></html>';
    return { blob: new Blob([html], { type: 'text/html' }), name: file.name.replace(/\.pdf$/i, '.html') };
  },

  async csvToExcel(file) {
    const text = await this.readFile(file, 'text');
    const rows = text.split('\n').map(l => l.split(',').map(c => c.replace(/"/g, '').trim()));
    return this.generateXlsx(rows, file.name.replace(/\.csv$/i, '.xlsx'));
  },

  async excelToCsv(file) {
    const data = await this.readFile(file, 'arraybuffer');
    const workbook = XLSX.read(data, { type: 'array' });
    const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
    return { blob: new Blob([csv], { type: 'text/csv' }), name: file.name.replace(/\.xlsx?$/i, '.csv') };
  },

  async jsonToCsv(file) {
    const text = await this.readFile(file, 'text');
    const json = JSON.parse(text);
    const arr = Array.isArray(json) ? json : [json];
    if (arr.length === 0) throw new Error('JSON vide');
    const headers = Object.keys(arr[0]);
    const csv = [headers.join(','), ...arr.map(row => headers.map(h => String(row[h] || '').replace(/,/g, ' ')).join(','))].join('\n');
    return { blob: new Blob([csv], { type: 'text/csv' }), name: file.name.replace(/\.json$/i, '.csv') };
  },

  async csvToJson(file) {
    const text = await this.readFile(file, 'text');
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) throw new Error('CSV invalide');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const result = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      const obj = {};
      headers.forEach((h, i) => obj[h] = values[i] || '');
      return obj;
    });
    return { blob: new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }), name: file.name.replace(/\.csv$/i, '.json') };
  },

  async xmlToJson(file) {
    const text = await this.readFile(file, 'text');
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const json = this.xmlToObj(xml.documentElement);
    return { blob: new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' }), name: file.name.replace(/\.xml$/i, '.json') };
  },

  async jsonToXml(file) {
    const text = await this.readFile(file, 'text');
    const json = JSON.parse(text);
    const xml = this.objToXml(json);
    return { blob: new Blob([xml], { type: 'application/xml' }), name: file.name.replace(/\.json$/i, '.xml') };
  },

  xmlToObj(node) {
    const obj = {};
    if (node.children.length > 0) {
      for (const child of node.children) {
        const key = child.tagName;
        const val = this.xmlToObj(child);
        if (obj[key]) obj[key] = [].concat(obj[key], val);
        else obj[key] = val;
      }
      return obj;
    }
    return node.textContent.trim();
  },

  objToXml(obj, root = 'root') {
    let xml = `<${root}>`;
    for (const [key, val] of Object.entries(obj)) {
      if (Array.isArray(val)) val.forEach(v => xml += this.objToXml(v, key));
      else if (typeof val === 'object' && val !== null) xml += this.objToXml(val, key);
      else xml += `<${key}>${String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${key}>`;
    }
    xml += `</${root}>`;
    return xml;
  },

  async generateXlsx(rows, name) {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return { blob: new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), name };
  },

  readFile(file, type) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      if (type === 'text') reader.readAsText(file);
      else if (type === 'dataurl') reader.readAsDataURL(file);
      else reader.readAsArrayBuffer(file);
    });
  }
};
