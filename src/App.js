import Home from './pages/home'
import { AppProvider } from './state/app-context';
 
function App() {
    return (
        <AppProvider>
            {/* IMPLEMENT ROUTER FOR EXPANSION */}
            <Home />
        </AppProvider>
    );
}

export default App;
