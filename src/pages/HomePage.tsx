import Layout from "../components/Layout";

export default function HomePage() {
    return (
        <Layout>
            <p>This project uses a custom implementation of routing with the new <strong>Navigation Web API</strong>.</p>
            <p>This implementation is abstract, you can find it under the function <code>createBrowserRouter</code>. It has the following features:</p>
            <div className="featuresWrapper">
                <ul>
                    <li>Single Page Application</li>
                    <li>Being able to do some navigation</li>
                    <li>Implement loader data (like <strong>React Router v6</strong> and <strong>Tanstack Router</strong>)</li>
                    <li>Prompt a modal when leaving a page with unsaved changes</li>
                </ul>
            </div>
            <p>I used this implementation with <strong>React</strong>. But you could use it with any library/framework.</p>
        </Layout>
    );
}

