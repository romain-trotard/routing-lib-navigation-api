import './App.css'
import Router, { Routes, useLoaderData } from './Router';

function useNavigate(url: string, { replaceMode = false } = {}) {
    window.navigation.navigate(url, { history: replaceMode ? 'replace' : 'push' });
}

function Home() {
    const loaderData = useLoaderData();

    return <>
        <p>Home</p>
        <a href="/first">Go first page</a>
        <p>Data: {loaderData}</p>
    </>
}

function First() {
    return <>
        <p>First</p>
        <a href="/second">Go second page</a>
    </>
}

function Second() {
    return <>
        <p>Second</p>
        <a href="/">Go home page</a>
    </>
}

function sleep(duration: number) {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
}

const routes: Routes = [
    {
        path: '/',
        component: <Home />,
        loader: async () => {
            await sleep(2000);

            return 'home loader';
        }
    },
    {
        path: '/first',
        component: <First />,
        loader: () => {
            return 'first loader';
        }
    },
    {
        path: '/second',
        component: <Second />,
        loader: () => {
            return 'second loader';
        }
    },
]

function App() {
    return (
        <Router routes={routes} />
    );
}

export default App
