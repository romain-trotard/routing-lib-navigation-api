import { ChakraProvider } from '@chakra-ui/react';
import { getLibraries } from './api/libAPI';
import './App.css'
import createBrowserRouter, { type Routes } from './lib/createBrowserRouter';
import RouterProvider from './lib/RouterProvider';
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

const router = createBrowserRouter({ routes });

function App() {
    return (
        <ChakraProvider>
            <RouterProvider router={router} />
        </ChakraProvider>
    );
}

export default App
