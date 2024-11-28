import { Settings } from '../App';
import { CreatePdfSettings } from './createPdf';
import { FrameExport } from './exportSelection';

export type sendMessageToCodeTypes = "export" | "settings-update";

export const sendMessageToCode = (type: sendMessageToCodeTypes, data?: unknown): void => {
  parent.postMessage({
    pluginMessage: {
      type,
      data
    },
  }, "*");
}

type SendMessageToUiDownload = (type: 'download', data: { frames: FrameExport[], settings: CreatePdfSettings }) => void;
type SendMessageToUiSelectionUpdate = (type: 'selection-update', data: number) => void; 
type SendMessageToUiInitializeSettings = (type: 'initialize-settings', data: Settings) => void; 

type SendMessageToUi = SendMessageToUiDownload | SendMessageToUiSelectionUpdate | SendMessageToUiInitializeSettings;

export const sendMessageToUi: SendMessageToUi = (type, data) => {
  figma.ui.postMessage({
      type,
      data
  });
}