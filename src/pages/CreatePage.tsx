import { useState } from "react";
import Layout from "../components/Layout";
import Prompt from "../components/Prompt";

const INIT_VALUE = ''

export default function CreatePage() {
    const [value, setValue] = useState(INIT_VALUE);
    const isDirty = value !== INIT_VALUE;

    return (
        <Layout>
            <Prompt when={isDirty} />
            <form>
                <label>Value:
                    <input type="text" value={value} onChange={e => setValue(e.target.value)} />
                </label>
                <button type="submit" disabled={!isDirty}>Submit</button>
            </form>
        </Layout>
    );
}
