import { Caption } from "@/types"
import { getCaptionDurationString } from "@/utils"
import { ArrowRightIcon, CopyIcon, DeleteIcon } from "@chakra-ui/icons"
import { Card, CardBody, CardHeader, Divider, Flex, Heading, IconButton, ListItem, Text } from "@chakra-ui/react"

export type CaptionsListItemProps = {
    item: Caption
    seekTo: (pos: number) => void
    handleCaptionDelete: (id: string) => void
}

export const CaptionListItem = ({ item, seekTo, handleCaptionDelete }: CaptionsListItemProps) => (
    <ListItem>
        <Card width="100%">
            <CardHeader py={2}>
                <Flex>
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                        <Heading size="sm">{getCaptionDurationString(item)}</Heading>
                        <IconButton
                            variant="ghost"
                            colorScheme="blue"
                            aria-label="Go to"
                            onClick={() => seekTo(item.startTime)}
                            icon={<ArrowRightIcon />}
                        />
                    </Flex>
                    <IconButton
                        variant="ghost"
                        colorScheme="green"
                        aria-label="Copy"
                        icon={<CopyIcon />}
                        onClick={() => navigator.clipboard.writeText(item.text)}
                    />
                    <IconButton
                        variant="ghost"
                        colorScheme="red"
                        aria-label="Delete"
                        onClick={() => handleCaptionDelete(item.id)}
                        icon={<DeleteIcon />}
                    />
                </Flex>
            </CardHeader>
            <CardBody textAlign="left" py={2}>
                <Text>{item.text}</Text>
            </CardBody>
            <Divider color="gray.200" />
        </Card>
    </ListItem>
)
