import { AddIcon, CheckIcon, DownloadIcon, RepeatClockIcon } from "@chakra-ui/icons"
import { Button, Flex } from "@chakra-ui/react"

export type NavBarProps = {
    videoFileLoaded: boolean
    captionFileLoaded: boolean
    changesMade: boolean
    handleVideoDownload: () => void
    handleCaptionsDownload: () => void
    handleSaveChanges: () => void
    handleRevert: () => void
}

const NavBar = ({
    videoFileLoaded,
    captionFileLoaded,
    changesMade,
    handleVideoDownload,
    handleCaptionsDownload,
    handleSaveChanges,
    handleRevert,
}: NavBarProps) => {
    return (
        <Flex flex={1} alignItems={"center"} justifyContent="center">
            <Flex alignItems={"center"}>
                {changesMade && (
                    <div style={{ position: "absolute", left: "1%" }}>
                        <Button
                            alignSelf="flex-start"
                            variant={"solid"}
                            onClick={handleSaveChanges}
                            colorScheme={"blue"}
                            size={"sm"}
                            leftIcon={<CheckIcon />}
                        >
                            Save changes
                        </Button>
                        <Button
                            ml={4}
                            alignSelf="flex-start"
                            variant={"solid"}
                            onClick={handleRevert}
                            colorScheme={"red"}
                            size={"sm"}
                            leftIcon={<RepeatClockIcon />}
                        >
                            Revert
                        </Button>
                    </div>
                )}
                {videoFileLoaded ? (
                    <Button
                        alignSelf="flex-start"
                        variant={"solid"}
                        onClick={handleVideoDownload}
                        colorScheme={"teal"}
                        size={"sm"}
                        mr={4}
                        leftIcon={<DownloadIcon />}
                    >
                        Download video
                    </Button>
                ) : (
                    <Button
                        variant={"solid"}
                        onClick={() => document.getElementById("video-file-select")?.click()}
                        colorScheme={"yellow"}
                        size={"sm"}
                        mr={4}
                        leftIcon={<AddIcon />}
                    >
                        Select video
                    </Button>
                )}
                {captionFileLoaded ? (
                    <Button
                        variant={"solid"}
                        onClick={handleCaptionsDownload}
                        colorScheme={"teal"}
                        size={"sm"}
                        leftIcon={<DownloadIcon />}
                    >
                        Download captions
                    </Button>
                ) : (
                    <Button
                        variant={"solid"}
                        onClick={() => document.getElementById("caption-file-select")?.click()}
                        colorScheme={"yellow"}
                        size={"sm"}
                        leftIcon={<AddIcon />}
                    >
                        Select captions
                    </Button>
                )}
            </Flex>
        </Flex>
    )
}

export default NavBar
