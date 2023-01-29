import Layout from "../components/Layout";
import useLoaderData from "../lib/userLoaderData";

export default function HomePage() {
    const loaderData = useLoaderData();

    return (
        <Layout>
            <p>Home</p>
            <a href="/first">Go first page</a>
            <p>Data: {loaderData}</p>
        </Layout>
    );
}

