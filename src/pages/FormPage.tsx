import { useState } from "react";
import Prompt from "../components/Prompt";

const INIT_VALUE = ''

export default function FormPage() {
    const [value, setValue] = useState(INIT_VALUE);
    const isDirty = value !== INIT_VALUE;

    return (
        <>
            <Prompt when={isDirty} />
            <form>
                <label>Value:
                    <input type="text" value={value} onChange={e => setValue(e.target.value)} />
                </label>
                <button type="submit" disabled={!isDirty}>Submit</button>
            </form>
        </>
    );
}
