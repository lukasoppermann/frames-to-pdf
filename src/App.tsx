import styles from './App.module.css';
import { useEffect, useState } from 'react'
import Button from './components/Button/Button'
import Note from './components/Note/Note'
import { sendMessageToCode } from './utilities/sendMessage'
import { downloadFilesAsPdf } from './utilities/downloadFilesAsPdf'
import { createPdf, CreatePdfSettings } from './utilities/createPdf'
import { Dropdown } from './components/Dropdown/Dropdown'
import { FrameExport } from './utilities/exportSelection'
import Input from './components/Input/input';
import SlidePreview from './components/SlidePreview/SlidePreview';

export type Settings = {
  format: "JPG" | "PNG" | "PDF",
  scale: number,
  filename?: string
}

const App = () => {
  const [selectedFrames, setSelectedFrames] = useState<FrameNode[]>([])
  const [settings, setSettings] = useState<Settings>({format: "JPG", scale: 2})
  const [pagename, setPagename] = useState<string>("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const updateSettings = (key: keyof Settings, value: string | number | undefined) => {
    if(key === "filename" && value === "") value = undefined
    const newSettings = {...settings, [key]: value}
    setSettings(newSettings)
    sendMessageToCode("settings-update", newSettings)
  }

  useEffect(() => {
    onmessage = async (event) => {
      const { type, data }: {type: sendMessageToUiTypes, data: unknown} = event.data.pluginMessage;
      if (type === "selection-update") {
        setSelectedFrames(data.frames)
        setPagename(data.pagename)
        setPreviewImage(data.previewUint8Array ? URL.createObjectURL(new Blob([data.previewUint8Array])) : null)
      }
      if (type === "initialize-settings") {
        setSettings(data as Settings)
      }
      if (type === "download") {
        const { frames, settings } = data as {frames: FrameExport[], settings: CreatePdfSettings}
        const link = document.getElementById('downloadLink') as HTMLAnchorElement;
        const urlData = await createPdf(frames, settings)
        downloadFilesAsPdf(link, urlData, settings.filename)
      }
  }}, [])
 
	return (
		<div className={styles.App}>
    <SlidePreview slides={selectedFrames.length} width={selectedFrames[0]?.width} height={selectedFrames[0]?.height} preview={previewImage}/>
    <div className={styles.AppSettings}>
      <Input className='input__filename' suffix=".pdf" value={settings.filename} placeholder={pagename} onChange={(e) => {updateSettings("filename", e.target.value)}}/>
      <Dropdown selected={settings.format} onChange={(value) => updateSettings("format", value)}
      options={{
        "JPG": "JPG",
        "PNG": "PNG",
        "PDF": "PDF"
      }}/>
      <Dropdown selected={`${settings.scale}`} disabled={settings.format === "PDF"} onChange={(value) => updateSettings("scale", value)}
      options={{
        1: "1x",
        2: "2x",
        3: "3x"
      }}/>
    </div>
      {selectedFrames.length === 0 && (<Note variant="info">Select frames to export</Note>) }

      {selectedFrames.length > 0 && <Button onClick={() => { sendMessageToCode("export") }}>Export {`${selectedFrames.length}`} {selectedFrames.length === 1 ? 'frame' : 'frames'}</Button>}
      <a id="downloadLink"></a>
		</div>
	)
}

export default App
