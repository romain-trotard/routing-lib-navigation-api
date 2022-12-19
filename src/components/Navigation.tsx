import { Box, Flex } from "@chakra-ui/react";

export default function Navigation() {
    return (
        <Flex paddingY={2} marginBottom={9} justifyContent="center" gap={5}>
            <Box as="a" paddingX={4} paddingY={2} href="/">Home</Box>
            <Box as="a" paddingX={4} paddingY={2} href="/listing">Listing</Box>
            <Box as="a" paddingX={4} paddingY={2} href="/create">Create</Box>
        </Flex>
    );
}
