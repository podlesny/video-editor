import { Caption } from "../types";
const { WebVTTParser } = require("webvtt-parser")

export const makeVTT = (array: Caption[]) => {
  const str = array
    ? array.reduce((str: string, { startTime, endTime, text }) => {
      return (
        str +
        `
${new Date(startTime * 1000).toISOString().slice(11, 23)} --> ${new Date(endTime * 1000)
          .toISOString()
          .slice(11, 23)}
${text}`
      )
    }, `WEBVTT`)
    : ""
  return new Blob([str], { type: "text/plain" })
}

export const parseVTT = (file: File, onFinishedCallback: (list: Caption[]) => void) => {
  let reader = new FileReader()
  reader.readAsText(file)
  reader.onload = () => {
    const parser = new WebVTTParser()
    const data = parser.parse(reader.result, "metadata")
    const list: Caption[] = data.cues.map((item: Caption, index: number) => ({
      ...item,
      id: index.toString(),
    }))
    onFinishedCallback(list)
  }
  reader.onerror = () => {
    console.log(reader.error)
  }
}