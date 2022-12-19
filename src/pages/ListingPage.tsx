import { Box, Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import type { Library } from "../api/libAPI";
import Layout from "../components/Layout";
import { useLoaderData } from "../lib/Router";

export default function ListingPage() {
    const { libraries } = useLoaderData<{ libraries: Library[] }>();


    return (
        <Layout>
            <Flex justifyContent="flex-end" marginBottom={2}>
                <Box as="a"
                    paddingX={4}
                    paddingY={2}
                    border="1px solid black"
                    borderRadius={5}
                    href="/create">
                    Create page
                </Box>
            </Flex>
            <TableContainer>
                <Table variant="striped">
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Github link</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {libraries.map(({ id, name, githubUrl }) => (
                            <Tr key={id}>
                                <Td>{name}</Td>
                                <Td>{githubUrl}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Layout>
    );
}
