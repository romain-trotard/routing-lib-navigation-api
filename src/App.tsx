import { ChakraProvider } from '@chakra-ui/react';
import { getLibraries } from './api/libAPI';
import './App.css'
import Router, { Routes } from './lib/Router';
import CreatePage from './pages/CreatePage';
import HomePage from './pages/HomePage';
import ListingPage from './pages/ListingPage';


function sleep(duration: number) {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
}

const routes: Routes = [
    {
        path: '/',
        component: <HomePage />,
        loader: async () => {
            await sleep(2000);

            return 'home loader';
        }
    },
    {
        path: '/listing',
        component: <ListingPage />,
        loader: async () => {
            const libraries = await getLibraries();

            return { libraries };
        }
    },
    {
        path: '/create',
        component: <CreatePage />,
    },
]

function App() {
    return (
        <ChakraProvider>
            <Router routes={routes} />
        </ChakraProvider>
    );
}

export default App
