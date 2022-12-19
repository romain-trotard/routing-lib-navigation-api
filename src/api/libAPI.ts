export type Library = {
    id: string;
    name: string;
    githubUrl: string;
}

const libraries = [
    {
        id: 'react-hook-form',
        name: 'React Hook Form',
        githubUrl: 'https://github.com/react-hook-form/react-hook-form',
    },
    {
        id: 'react-router',
        name: 'React Router',
        githubUrl: 'https://github.com/remix-run/react-router',
    },
    {
        id: 'tanstack-router',
        name: 'TanStack Router',
        githubUrl: 'https://github.com/tanstack/router',
    },
    {
        id: 'tanstack-query',
        name: 'TanStack Query',
        githubUrl: 'https://github.com/tanstack/query',
    },
    {
        id: 'jotai',
        name: 'Jotai',
        githubUrl: 'https://github.com/pmndrs/jotai',
    },
];

function sleep(duration: number) {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
}

export async function getLibraries() {
    await sleep(1000);

    return libraries;
}

export async function getLibraryById(id: string) {
    await sleep(1000);

    const lib = libraries.find(lib => lib.id === id);

    if (!lib) {
        throw new Error('Library does not exist');
    }

    return lib;
}

export async function addLibrary(library: Library) {
    await sleep(1000);

    libraries.push(library);
}

