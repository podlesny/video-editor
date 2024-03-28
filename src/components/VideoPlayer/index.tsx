import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

import ReactPlayer from "react-player"
import { Caption } from "../../types"
import { Flex } from "@chakra-ui/react"
import { makeVTT } from "@/utils/captions"

export type VideoPlayerProps = {
    captionsList: Caption[]
    videoFile: File | null
}

const VideoPlayer = forwardRef(({ captionsList, videoFile }: VideoPlayerProps, outerRef) => {
    const playerRef = useRef<any>()
    const [captionsUrl, setCaptionsUrl] = useState<string>("")
    const [videoFileUrl, setVideoFileUrl] = useState<string>("")
    const [prevPosition, setPrevPosition] = useState(0)

    useEffect(() => {
      if (videoFile) setVideoFileUrl(URL.createObjectURL(videoFile))
  }, [videoFile])

    useEffect(() => {
        if (!captionsList) return
        const vttFile = makeVTT(captionsList)
        const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : 0
        setCaptionsUrl(URL.createObjectURL(vttFile))
        setPrevPosition(currentTime)
    }, [captionsList])

    useImperativeHandle(
        outerRef,
        () => {
            return {
                seekTo(pos: number) {
                    seekTo(pos)
                },
                getDuration() {
                    return getDuration()
                },
            }
        },
        []
    )

    const seekTo = (position: number) => {
        playerRef.current.seekTo(position)
    }

    const getDuration = () => {
        return playerRef?.current?.getDuration()
    }

    const getCurrentTime = () => {
      return playerRef?.current?.getCurrentTime()
  }

    const handlePlayerReady = () => {
        if (prevPosition && playerRef.current) {
            seekTo(prevPosition)
            setPrevPosition(0)
        }
    }

    return (
        <Flex flex={10}>
            {videoFile !== null && (
                <ReactPlayer
                    muted
                    key={captionsUrl}
                    url={videoFileUrl}
                    ref={playerRef}
                    controls
                    playing={true}
                    style={{
                        minHeight: "100%",
                        maxHeight: "100%",
                    }}
                    width="100%"
                    config={{
                        file: {
                            tracks: [
                                {
                                    kind: "subtitles",
                                    srcLang: "",
                                    label: "",
                                    default: true,
                                    src: captionsUrl,
                                },
                            ],
                        },
                    }}
                    onReady={handlePlayerReady}
                />
            )}
        </Flex>
    )
})

VideoPlayer.displayName = 'VideoPlayer'

export default VideoPlayer
