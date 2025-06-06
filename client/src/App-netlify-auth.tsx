import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NetlifyAuthProvider } from "./components/NetlifyAuthProvider";
import Home from "./pages/home";
import GaleriaFas from "./pages/galeria-fas";
import LoginNetlify from "./pages/login-netlify";
import AdminNetlify from "./pages/admin-netlify";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('401')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/galeria-fas" component={GaleriaFas} />
      <Route path="/login-netlify" component={LoginNetlify} />
      <Route path="/admin-netlify" component={AdminNetlify} />
      <Route>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              404 - Página não encontrada
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              A página que você está procurando não existe.
            </p>
            <a
              href="/"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Voltar ao início
            </a>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NetlifyAuthProvider>
        <AppRouter />
      </NetlifyAuthProvider>
    </QueryClientProvider>
  );
}