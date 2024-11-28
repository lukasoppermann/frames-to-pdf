import { Settings } from '../App';

async function exportFrame(frameNode: FrameNode, settings: Settings): Promise<Uint8Array> {
  let options: ExportSettings = {
    format: settings.format,
  };
  if (settings.format !== "PDF") {
    (options as ExportSettingsImage) = {
      format: settings.format,
      constraint: {
        type: 'SCALE',
        value: settings.scale
      }
    };
  }
  const bytes = await frameNode.exportAsync(options);
  return new Uint8Array(bytes);
}

export type FrameExport = {
  data: Uint8Array, 
  name: string, 
  width: number, 
  height: number
}

export const exportSelection = async (frames: FrameNode[], settings: Settings): Promise<FrameExport[]> => {
  const exports = await Promise.all(frames.map(async (frame) => ({
    data: await exportFrame(frame, settings),
    name: frame.name,
    width: frame.width,
    height: frame.height
  })))

  return exports
}