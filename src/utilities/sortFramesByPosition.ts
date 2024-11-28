export const sortFramesByPosition = (frames: FrameNode[]) => {
  return frames.sort((a, b) => {
    if (a.y === b.y) {
      return a.x - b.x
    }
    return a.y - b.y
  })
}