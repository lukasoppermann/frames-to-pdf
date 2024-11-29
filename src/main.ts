import { exportSelection } from './utilities/exportSelection';
import { sendMessageToCodeTypes, sendMessageToUi } from './utilities/sendMessage';
import { sortFramesByPosition } from './utilities/sortFramesByPosition';
import { getFromStore, saveToStore } from './utilities/store';

const getSelectedFrames = (figma: PluginAPI): FrameNode[] => {
  const selectedFrames = figma.currentPage.selection.filter(node => node.type === 'FRAME' && node.parent === figma.currentPage) as FrameNode[]

  return sortFramesByPosition(selectedFrames);
}



const getUserSelection = async (figma: PluginAPI) => {
  const selectedFrames = getSelectedFrames(figma);
  let previewUint8Array = undefined
  if (selectedFrames.length === 0) {
    figma.notify('Select frames to export', {timeout: 2000});
  } else {
    previewUint8Array = await selectedFrames[0].exportAsync({
      format: 'JPG',
      constraint: { type: 'SCALE', value: 1 },
    })
  }

  sendMessageToUi("selection-update", {
    frames: selectedFrames.map(node => ({
      node: node,
      name: node.name,
      width: node.width,
      height: node.height
    })),
    pagename: figma.currentPage.name,
    previewUint8Array
  });
}



export default async function () {
    // open ui
    figma.showUI(__html__, { width: 300, height: 282, themeColors: true })
    // initialize settings
    sendMessageToUi("initialize-settings", {
      ...{
        format: "JPG",
        scale: 2
      },
      ...getFromStore(figma, "settings")
    });
    await getUserSelection(figma);
    // setup triggers
    figma.on('selectionchange', async () => {
      await getUserSelection(figma);
    });

    figma.ui.onmessage = async (msg) => {
      switch (msg.type) {
        case 'export' as sendMessageToCodeTypes:
          const selectedFrames = getSelectedFrames(figma);
          figma.notify(`Exporting ${selectedFrames.length} frames`, {timeout: 2000});
          // get settings
          const settings = getFromStore(figma, "settings")
          console.log("export settings", settings);
          // export frames
          const frames = await exportSelection(selectedFrames, {format: settings.format, scale: settings.scale});
          sendMessageToUi("download", {
            frames,
            settings
          });
          break;
        case 'settings-update':
          console.log("settings-update", msg.data);
          saveToStore(figma, "settings", msg.data);
          break;
      }
    }
  // figma.on('run', ({ command }: RunEvent) => {
  //   switch (command) {
  //     case "export":
  //       getUserSelection(figma);
  //       break
  //     default:
  //       loadUi(figma)
  //       break
  //   }
  // });
}
