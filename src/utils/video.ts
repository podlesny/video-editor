import { SliderPosition } from "@/types";
import { FFmpeg, createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { getTimeString, readFileAsBase64 } from ".";

const FF = createFFmpeg({
  // log: true,
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
})
  ; (async function () {
    await FF.load()
  })()

export async function extractFramesFromVideo(videoUrl: string, containerWidth: number, containerHeight: number): Promise<string[]> {
  return new Promise(async (resolve) => {

    // fully download it first (no buffering):
    const videoBlob = await fetch(videoUrl).then(r => r.blob());
    const videoObjectUrl = URL.createObjectURL(videoBlob);
    const video = document.createElement("video");

    let seekResolve: () => void;
    video.addEventListener('seeked', async function () {
      if (seekResolve) seekResolve();
    });

    video.addEventListener('loadeddata', async function () {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const [w, h] = [video.videoWidth, video.videoHeight]

      const frames: string[] = [];
      const ratio = containerWidth * h / (containerHeight * w)
      const numOfFrames = Math.round(ratio) * 2
      const interval = video.duration / numOfFrames

      canvas.width = w * ratio / numOfFrames;
      canvas.height = h;

      let currentTime = 0;
      const duration = video.duration;

      while (currentTime < duration) {
        video.currentTime = currentTime;
        await new Promise(r => seekResolve = r as () => void);

        context?.drawImage(video, 0, 0, w, h);
        const base64ImageData = canvas.toDataURL();
        frames.push(base64ImageData);

        currentTime += interval;
      }
      resolve(frames);
    });

    // set video src *after* listening to events in case it loads so fast
    // that the events occur before we were listening.
    video.src = videoObjectUrl;

  });
}

export async function trimVideo(videoFile: File, duration: number, sliderPosition: SliderPosition, onFinishedCallback: (dataURL: BlobPart) => void) {
  if (!FF.isLoaded()) await FF.load()
  const startTime = duration ? (sliderPosition.start / 100) * duration : 0
  let offset = duration ? (sliderPosition.end / 100) * duration - startTime : 0
  try {
    FF.FS("writeFile", "output_file.mp4", await fetchFile(videoFile))
    await FF.run(
      "-ss",
      getTimeString(startTime),
      "-i",
      "output_file.mp4",
      "-t",
      getTimeString(offset),
      "-c",
      "copy",
      "ping.mp4"
    )

    const data = FF.FS("readFile", "ping.mp4")
    const dataURL = (await readFileAsBase64(new Blob([data.buffer], { type: "video/mp4" }))) as BlobPart

    onFinishedCallback(dataURL)
  }
  catch (error) {
    console.log(error)
  }
}