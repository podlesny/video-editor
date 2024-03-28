import VideoPlayer from "../components/VideoPlayer"
import TimeLine from "../components/TimeLine"
import CaptionList from "../components/CaptionList"

import { ChangeEvent, useRef, useState } from "react"
import { Caption, SliderPosition } from "../types"
import NavBar from "../components/NavBar"
import { Flex, ChakraProvider } from "@chakra-ui/react"
import { dataURLtoFile, downloadFile, trimVideo } from "../utils"
import { makeVTT, parseVTT } from "@/utils/captions"
import { GetServerSideProps } from "next"

export type FileEventTarget = EventTarget & { files: FileList }

function MainPage() {
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [videoFileLoaded, setVideoFileLoaded] = useState(false)
    const [captionFileLoaded, setCaptionFileLoaded] = useState(false)
    const [changesMade, setChangesMade] = useState(false)
    const [originalCaptionsList, setOriginalCaptionsList] = useState<Caption[]>([])
    const [captionsList, setCaptionsList] = useState<Caption[]>([])
    const [sliderPosition, setSliderPosition] = useState<SliderPosition>({
        start: 0,
        end: 100,
    })
    const videoPlayerRef = useRef<{ seekTo: (pos: number) => void; getDuration: () => number }>(null)

    const seekTo = (pos: number) => videoPlayerRef?.current?.seekTo(pos)

    const getDuration = () => videoPlayerRef?.current?.getDuration()

    const handleCaptionsFilter = (start: number, end: number) => {
        const duration = getDuration()
        if(!duration) return
        start = start * duration / 100
        end = end * duration / 100
        setCaptionsList(originalCaptionsList.filter((item) => item.startTime >= start && item.endTime <= end))
    }

    const handleCaptionDelete = (id: string) => {
        setCaptionsList(captionsList.filter((item) => item.id !== id))
        setChangesMade(true)
    }

    const handleVideoDownload = () => {
        videoFile && downloadFile(URL.createObjectURL(videoFile))
    }

    const handleCaptionsDownload = () => {
        const vttFile = makeVTT(originalCaptionsList)
        downloadFile(URL.createObjectURL(vttFile))
    }

    const handleSaveChanges = async () => {
        const duration = getDuration()
        if (!videoFile || !duration) return
        await trimVideo(videoFile, duration, sliderPosition, (dataURL: BlobPart) => {
            setVideoFile(dataURLtoFile(dataURL, "new_file.mp4"))
            setChangesMade(false)
            setSliderPosition({
                start: 0,
                end: 100,
            })
            setOriginalCaptionsList(captionsList)
        })
    }

    const handleRevert = () => {
        setSliderPosition({ start: 0, end: 100 })
        setCaptionsList(originalCaptionsList)
        setChangesMade(false)
    }

    return (
        <ChakraProvider>
            <Flex direction="column" style={{ height: "100vh" }}>
                <NavBar
                    videoFileLoaded={videoFileLoaded}
                    captionFileLoaded={captionFileLoaded}
                    changesMade={changesMade}
                    handleVideoDownload={handleVideoDownload}
                    handleCaptionsDownload={handleCaptionsDownload}
                    handleSaveChanges={handleSaveChanges}
                    handleRevert={handleRevert}
                />
                <Flex height="95%">
                    <Flex flex={3} direction="column">
                        <input
                            hidden
                            id="video-file-select"
                            type="file"
                            name="myFile"
                            accept="video/*"
                            onChange={(event) => {
                                const file = (event.target as FileEventTarget).files[0]
                                setVideoFile(file)
                                setVideoFileLoaded(true)
                            }}
                        />
                        <input
                            hidden
                            id="caption-file-select"
                            type="file"
                            name="myFile"
                            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                const files = (event.target as HTMLInputElement).files
                                if (!files) return
                                let file = files[0]
                                if (file) {
                                    parseVTT(file, (list) => {
                                        setCaptionsList(list)
                                        setOriginalCaptionsList(list)
                                        setCaptionFileLoaded(true)
                                    })
                                }
                            }}
                        />
                        <VideoPlayer videoFile={videoFile} ref={videoPlayerRef} captionsList={captionsList} />
                        <TimeLine
                            seekTo={seekTo}
                            videoFile={videoFile}
                            getDuration={getDuration}
                            sliderPosition={sliderPosition}
                            setSliderPosition={setSliderPosition}
                            setChangesMade={setChangesMade}
                            handleCaptionsFilter={handleCaptionsFilter}
                        />
                    </Flex>
                    <CaptionList
                        captionsList={captionsList}
                        handleCaptionDelete={handleCaptionDelete}
                        seekTo={seekTo}
                    />
                </Flex>
            </Flex>
        </ChakraProvider>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    context.res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
    context.res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
    return {
        props: {},
    }
}

export default MainPage
