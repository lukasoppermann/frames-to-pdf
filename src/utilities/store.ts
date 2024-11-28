export type StoreKey = "settings"

export const getFromStore = (figma: PluginAPI, key: StoreKey) => {
  const data = figma.root.getPluginData(key)
  if (!data) return undefined
  return JSON.parse(data)
}

export const saveToStore = (figma: PluginAPI, key: StoreKey, data: unknown): void => {
  figma.root.setPluginData(key, JSON.stringify(data))
}