import {jsPDF} from 'jspdf';
import PDFMerger from 'pdf-merger-js';
import { FrameExport } from './exportSelection';

export type CreatePdfSettings = {format: "JPG" | "PNG" | "PDF", filename: string}

const getOrientation = (width: number, height: number): 'landscape' | 'portrait' => {
  return width > height ? 'landscape' : 'portrait'
}

export const createPdf = async (frames: FrameExport[], settings: CreatePdfSettings) => {
  if (settings.format === "PDF") {
    return await createPdfFromPdfs(frames)
  }
  return createPdfFromImages(frames)
}

const createPdfFromImages = (frames: FrameExport[]) => {
  // create new document
  const doc = new jsPDF({
    orientation: getOrientation(frames[0].width, frames[0].height),
    unit: 'px',
    format: [frames[0].width, frames[0].height],
  });
  // remove first page so that we need to condition in adding loop
  doc.deletePage(1)
  // add frames
  frames.forEach((frame) => {
    // add page
    doc.addPage([frame.width, frame.height], getOrientation(frame.width, frame.height),)
    // add image
    doc.addImage(frame.data, "JPEG", 0, 0, frame.width, frame.height);
  })
  // wait for all frames to be added
  const urlData = doc.output('bloburl');
  // return url data
  return urlData;
}

const createPdfFromPdfs = async (frames: FrameExport[]) => {
  var merger = new PDFMerger();
  await Promise.all(frames.map(async (frame) => {
    // @ts-ignore
    return await merger.add(frame.data)
  }))
  // @ts-ignore
  const mergedPdf = await merger.saveAsBlob()
  return URL.createObjectURL(mergedPdf)
}