import { useEffect, useRef, useState } from "react"

import { extractFramesFromVideo, getTimeString } from "../../utils"
import {
    Stack,
    Image,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    Flex,
    Tooltip,
} from "@chakra-ui/react"
import { SliderPosition } from "../../types"

export type TimeLineProps = {
    seekTo: (pos: number) => void
    getDuration: () => number | undefined
    handleCaptionsFilter: (start: number, end: number) => void
    videoFile: File | null
    sliderPosition: SliderPosition
    setSliderPosition: (value: SliderPosition) => void
    setChangesMade: (value: boolean) => void
}

function TimeLine({
    seekTo,
    getDuration,
    handleCaptionsFilter,
    videoFile,
    sliderPosition,
    setSliderPosition,
    setChangesMade,
}: TimeLineProps) {
    const RANGE_MAX = 100
    const [frames, setFrames] = useState<string[] | null>(null)
    const [tooltipPosition, setTooltipPosition] = useState([0, 100])

    useEffect(() => {
        ;(async () => {
            if (!videoFile || timelineRef.current === null) return
            const res: string[] = await extractFramesFromVideo(
                URL.createObjectURL(videoFile),
                timelineRef.current.offsetWidth,
                timelineRef.current.offsetHeight
            )
            setFrames(res)
        })()
        setTooltipPosition([0, 100])
    }, [videoFile])

    const timelineRef = useRef<HTMLDivElement>(null)
    const [showTooltips, setShowTooltips] = useState(false)

    const handleChange = ([start, end]: number[]) => {
        setTooltipPosition([start, end])
    }

    const handleChangeEnd = ([start, end]: number[]) => {
        const duration = getDuration()
        if ((start !== sliderPosition.start || end !== sliderPosition.end) && duration) {
            if(start !== sliderPosition.start){
              seekTo(start * duration / RANGE_MAX)
            }
            if(end !== sliderPosition.end){
              seekTo(end * duration / RANGE_MAX)
            }
            handleCaptionsFilter(start, end)
            setChangesMade(true)
        }
        setSliderPosition({ start, end })
    }

    return (
        <Flex flex={1} ref={timelineRef} position="relative">
            {frames && (
                <>
                    <RangeSlider
                        onChange={handleChange}
                        onChangeEnd={handleChangeEnd}
                        key={JSON.stringify(sliderPosition)}
                        defaultValue={[sliderPosition.start, sliderPosition.end]}
                        zIndex={10}
                        onMouseEnter={() => setShowTooltips(true)}
                        onMouseLeave={() => setShowTooltips(false)}
                    >
                        <RangeSliderTrack
                            transform="translateY(-12%) !important"
                            height="100%"
                            backgroundColor="transparent"
                            top="12% !important"
                        >
                            <RangeSliderFilledTrack backgroundColor="rgba(50, 50, 255, 0.4)" />
                        </RangeSliderTrack>
                        <Tooltip
                            bg="rgb(50, 50, 255)"
                            color="white"
                            placement="top"
                            isOpen={showTooltips}
                            label={`${getTimeString((tooltipPosition[0] / RANGE_MAX) * getDuration()!, false)}`}
                        >
                            <RangeSliderThumb index={0} backgroundColor="rgb(50, 50, 255)" top={0} />
                        </Tooltip>
                        <Tooltip
                            bg="rgb(50, 50, 255)"
                            color="white"
                            placement="top"
                            isOpen={showTooltips}
                            label={`${getTimeString((tooltipPosition[1] / RANGE_MAX) * getDuration()!, false)}`}
                        >
                            <RangeSliderThumb index={1} backgroundColor="rgb(50, 50, 255)" top={0} />
                        </Tooltip>
                    </RangeSlider>

                    <Stack direction="row" gap={0} position="absolute" top={0}>
                        {frames.map((frame: string, index: number) => (
                            <Image src={frame} height="90px" alt="image" key={index} />
                        ))}
                    </Stack>
                </>
            )}
        </Flex>
    )
}

export default TimeLine
