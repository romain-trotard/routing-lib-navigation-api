import { Box, Flex, Input, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useState } from "react";
import type { Library } from "../api/libAPI";
import Layout from "../components/Layout";
import useLoaderData from "../lib/userLoaderData";
import useNavigate from "../lib/useNavigate";

export default function ListingPage() {
    const [search, setSearch] = useState(() => {
        return (new URL(window.location.href)).searchParams.get('search') ?? ''
    });
    const { libraries } = useLoaderData<{ libraries: Library[] }>();
    const navigate = useNavigate();

    const onSearchChange = (value: string) => {
        setSearch(value);
        navigate(`/listing?search=${value}`, { replaceMode: true });
    }

    const filteredLibraries = libraries.filter(({ name }) => {
        if (search === '') {
            return true;
        }

        return name.toLowerCase().includes(search.toLowerCase());
    });


    return (
        <Layout>
            <Flex justifyContent="space-between" marginBottom={2}>
                <Input placeholder="Search by name" maxW={600} value={search} onChange={e => onSearchChange(e.target.value)} />
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
                        {filteredLibraries.map(({ id, name, githubUrl }) => (
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
