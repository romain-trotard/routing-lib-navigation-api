export default function useNavigate(url: string, { replaceMode = false } = {}) {
    window.navigation.navigate(url, { history: replaceMode ? 'replace' : 'push' });
}

