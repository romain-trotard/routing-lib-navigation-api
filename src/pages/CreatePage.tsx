import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, Container, Flex, FormControl, FormLabel, Input, Spinner } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { addLibrary } from "../api/libAPI";
import Layout from "../components/Layout";
import Prompt from "../components/Prompt";
import useNavigate from "../lib/useNavigate";

function getLatestListingUrl() {
    const { index } = window.navigation.currentEntry;
    const previousEntries = window.navigation.entries().slice(0, index);
    // `findLast` does not exist in TS
    // so doing `.reverse().find()`
    const matchingEntry = previousEntries.reverse().find((entry) => {
        // We have the `url` in the entry, let's
        // extract the `pathname`
        const url = new URL(entry.url);

        return url.pathname.startsWith("/listing");
    })

    return matchingEntry?.url ?? '/listing';
}

export default function CreatePage() {
    const { register, formState: { isDirty, isSubmitting }, handleSubmit } = useForm({
        defaultValues: {
            id: '',
            name: '',
            githubUrl: '',
        }
    });
    const navigate = useNavigate();
    const latestListingUrl = getLatestListingUrl();

    return (
        <Layout>
            <Prompt when={isDirty} />
            <Container maxW="md">
                <Flex as="a" gap={2} alignItems="center" marginBottom={9} href={latestListingUrl}>
                    <ArrowBackIcon />
                    Go to listing page
                </Flex>
                <form onSubmit={handleSubmit(async (values) => {
                    await addLibrary(values);

                    navigate(latestListingUrl, { info: { forceNavigate: true } });
                })}>
                    <FormControl marginBottom={3} isRequired>
                        <FormLabel>Id</FormLabel>
                        <Input type='text' {...register('id', { required: true })} />
                    </FormControl>
                    <FormControl marginBottom={3} isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input type='text' {...register('name', { required: true })} />
                    </FormControl>
                    <FormControl marginBottom={3} isRequired>
                        <FormLabel>Github url</FormLabel>
                        <Input type='text' {...register('githubUrl', { required: true })} />
                    </FormControl>
                    <Button type="submit" variant='outline' disabled={!isDirty || isSubmitting} minW={150}>
                        {
                            isSubmitting ?
                                <Spinner size='xs' /> :
                                "Submit"
                        }
                    </Button>
                </form>
            </Container>
        </Layout>
    );
}
