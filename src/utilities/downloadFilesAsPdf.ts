export const downloadFilesAsPdf = (link: HTMLAnchorElement, urlData: string, filename: string) => {
  link.href = urlData;
  link.download = filename;
  link.click();
}