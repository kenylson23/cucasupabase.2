import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Route, Router, Switch } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HomeStatic from "@/pages/home-static";
import PontosVenda from "@/pages/pontos-venda";
import NotFound from "@/pages/not-found";

// Query client para Netlify (sem servidor backend)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRouter() {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route path="/" component={HomeStatic} />
        <Route path="/pontos-venda" component={PontosVenda} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background text-foreground">
          <AppRouter />
          <Toaster />
        </div>
      </QueryClientProvider>
    </StrictMode>
  );
}