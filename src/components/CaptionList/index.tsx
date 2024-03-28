import { List, Flex } from "@chakra-ui/react"
import { Caption } from "../../types"
import { CaptionListItem } from "./CaptionListItem"

export type CaptionListProps = {
    captionsList: Caption[]
    handleCaptionDelete: (id: string) => void
    seekTo: (pos: number) => void
}

function CaptionList({ captionsList, handleCaptionDelete, seekTo }: CaptionListProps) {
    return (
        <Flex flex={1} backgroundColor="white" zIndex={100} overflow="scroll">
            <List width="100%">
                {captionsList.map((item, index) => (
                    <CaptionListItem
                        key={index}
                        item={item}
                        seekTo={seekTo}
                        handleCaptionDelete={handleCaptionDelete}
                    />
                ))}
            </List>
        </Flex>
    )
}

export default CaptionList
