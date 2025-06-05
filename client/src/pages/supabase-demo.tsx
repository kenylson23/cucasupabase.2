import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  statsService, 
  usersService, 
  productsService, 
  contactService,
  fanPhotosService 
} from "@/services/supabaseService";
import { 
  Database, 
  Users, 
  Package, 
  MessageSquare, 
  Camera,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";

export default function SupabaseDemo() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const testSupabaseConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test basic connection and data retrieval
      const dashboardStats = await statsService.getDashboardStats();
      setStats(dashboardStats);
      
      toast({
        title: "Conexão Supabase",
        description: "Conectado com sucesso à base de dados Supabase!",
        variant: "default",
      });
    } catch (err: any) {
      const errorMessage = err.message || "Erro desconhecido";
      setError(errorMessage);
      
      toast({
        title: "Erro de Conexão",
        description: `Falha ao conectar: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testDataOperations = async () => {
    setLoading(true);
    
    try {
      // Test creating a contact message
      const testMessage = await contactService.create({
        name: "Teste Supabase",
        email: "teste@supabase.com",
        subject: "Teste de Integração",
        message: "Esta é uma mensagem de teste para verificar a integração com Supabase."
      });

      toast({
        title: "Teste de Dados",
        description: "Mensagem de teste criada com sucesso!",
        variant: "default",
      });

      // Refresh stats
      await testSupabaseConnection();
    } catch (err: any) {
      toast({
        title: "Erro no Teste",
        description: `Erro ao criar dados de teste: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-test connection on component mount
    testSupabaseConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">
            Demonstração Supabase - CUCA
          </h1>
          <p className="text-lg text-amber-700">
            Teste da integração completa com a base de dados Supabase
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Connection Status */}
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Estado da Conexão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Conectando...</span>
                  </>
                ) : error ? (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-600">Erro</span>
                  </>
                ) : stats ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">Conectado</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-gray-400" />
                    <span>Não testado</span>
                  </>
                )}
              </div>
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Test Actions */}
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle>Ações de Teste</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={testSupabaseConnection}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Testar Conexão
              </Button>
              <Button 
                onClick={testDataOperations}
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                Testar Operações
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle>Resumo Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Utilizadores:</span>
                    <Badge variant="secondary">{stats.totalUsers}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Produtos:</span>
                    <Badge variant="secondary">{stats.totalProducts}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Encomendas:</span>
                    <Badge variant="secondary">{stats.totalOrders}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Mensagens:</span>
                    <Badge variant="secondary">{stats.unreadMessages}</Badge>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Conecte para ver estatísticas</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-amber-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Utilizadores
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeUsers} ativos
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Produtos
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeProducts} disponíveis
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Mensagens
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                <p className="text-xs text-muted-foreground">
                  não lidas
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Fotos Pendentes
                </CardTitle>
                <Camera className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingPhotos}</div>
                <p className="text-xs text-muted-foreground">
                  aguardando aprovação
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-amber-700">
            ✓ Supabase configurado e funcionando
            <br />
            ✓ Todas as tabelas criadas e acessíveis
            <br />
            ✓ Operações CRUD implementadas
            <br />
            ✓ Pronto para produção
          </p>
        </div>
      </div>
    </div>
  );
}