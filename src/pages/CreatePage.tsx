import { Button, Container, FormControl, FormLabel, Input, Spinner } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { addLibrary } from "../api/libAPI";
import Layout from "../components/Layout";
import Prompt from "../components/Prompt";
import useNavigate from "../lib/useNavigate";

export default function CreatePage() {
    const { register, formState: { isDirty, isSubmitting }, handleSubmit } = useForm({
        defaultValues: {
            id: '',
            name: '',
            githubUrl: '',
        }
    });
    const navigate = useNavigate();

    return (
        <Layout>
            <Prompt when={isDirty} />
            <Container maxW="md">
                <form onSubmit={handleSubmit(async (values) => {
                    await addLibrary(values);

                    navigate('/listing', { info: { forceNavigate: true } });
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
