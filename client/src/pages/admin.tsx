import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface AdminStats {
  totalProducts: number;
  activeProducts: number;
  totalCustomers: number;
  activeCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  unreadMessages: number;
  totalRevenue: number;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Acesso Negado",
        description: "Você precisa fazer login para acessar o painel administrativo.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated,
  });

  // Fetch contact messages
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/admin/contact-messages"],
    enabled: isAuthenticated,
  });

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/admin/products"],
    enabled: isAuthenticated,
  });

  // Fetch customers
  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ["/api/admin/customers"],
    enabled: isAuthenticated,
  });

  // Fetch orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/admin/orders"],
    enabled: isAuthenticated,
  });

  // Update message status mutation
  const updateMessageMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      return await apiRequest(`/api/admin/contact-messages/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Sucesso",
        description: "Mensagem atualizada com sucesso.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sessão Expirada",
          description: "Fazendo login novamente...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Falha ao atualizar mensagem.",
        variant: "destructive",
      });
    },
  });

  // Update order status mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Sucesso",
        description: "Status do pedido atualizado.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sessão Expirada",
          description: "Fazendo login novamente...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Falha ao atualizar status do pedido.",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cuca-yellow mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Painel Administrativo CUCA</h1>
              <p className="text-muted-foreground">Gerencie produtos, pedidos e clientes</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/api/logout"}
            >
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeProducts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalProducts} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalCustomers} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingOrders} pendentes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-AO', {
                    style: 'currency',
                    currency: 'AOA'
                  }).format(stats.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.unreadMessages} mensagens não lidas
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="messages" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Mensagens de Contato</CardTitle>
                <CardDescription>
                  Gerencie as mensagens recebidas dos clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {messagesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cuca-yellow"></div>
                  </div>
                ) : messages && messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message: any) => (
                      <div key={message.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{message.name}</h4>
                            <p className="text-sm text-muted-foreground">{message.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={message.status === 'unread' ? 'destructive' : 'secondary'}>
                              {message.status === 'unread' ? 'Não lida' : 'Lida'}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateMessageMutation.mutate({ 
                                id: message.id, 
                                updates: { status: message.status === 'unread' ? 'read' : 'unread' }
                              })}
                            >
                              {message.status === 'unread' ? <Eye className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <h5 className="font-medium mb-2">{message.subject}</h5>
                        <p className="text-sm text-muted-foreground mb-2">{message.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleString('pt-AO')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    Nenhuma mensagem encontrada
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Produtos</CardTitle>
                <CardDescription>
                  Gerencie o catálogo de produtos CUCA
                </CardDescription>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cuca-yellow"></div>
                  </div>
                ) : products && products.length > 0 ? (
                  <div className="space-y-4">
                    {products.map((product: any) => (
                      <div key={product.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{product.name}</h4>
                              <Badge variant={product.isActive ? 'default' : 'secondary'}>
                                {product.isActive ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                            <div className="flex gap-4 text-sm">
                              <span>Preço: {new Intl.NumberFormat('pt-AO', {
                                style: 'currency',
                                currency: 'AOA'
                              }).format(parseFloat(product.price))}</span>
                              <span>Estoque: {product.stock}</span>
                              <span>Categoria: {product.category}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    Nenhum produto encontrado
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Pedidos</CardTitle>
                <CardDescription>
                  Acompanhe e gerencie os pedidos dos clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cuca-yellow"></div>
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">Pedido #{order.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleString('pt-AO')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              order.status === 'pending' ? 'default' : 
                              order.status === 'completed' ? 'default' : 'secondary'
                            }>
                              {order.status === 'pending' ? 'Pendente' : 
                               order.status === 'completed' ? 'Concluído' : order.status}
                            </Badge>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderMutation.mutate({ 
                                id: order.id, 
                                status: e.target.value 
                              })}
                              className="text-sm border rounded px-2 py-1"
                            >
                              <option value="pending">Pendente</option>
                              <option value="processing">Processando</option>
                              <option value="shipped">Enviado</option>
                              <option value="completed">Concluído</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Total:</strong> {new Intl.NumberFormat('pt-AO', {
                              style: 'currency',
                              currency: 'AOA'
                            }).format(parseFloat(order.total))}</p>
                            <p><strong>Pagamento:</strong> {order.paymentStatus}</p>
                          </div>
                          <div>
                            <p><strong>Método:</strong> {order.paymentMethod || 'N/A'}</p>
                            <p><strong>Endereço:</strong> {order.shippingAddress}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    Nenhum pedido encontrado
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Clientes</CardTitle>
                <CardDescription>
                  Visualize e gerencie os clientes cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {customersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cuca-yellow"></div>
                  </div>
                ) : customers && customers.length > 0 ? (
                  <div className="space-y-4">
                    {customers.map((customer: any) => (
                      <div key={customer.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">
                              {customer.firstName && customer.lastName 
                                ? `${customer.firstName} ${customer.lastName}` 
                                : customer.username}
                            </h4>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                            {customer.phone && (
                              <p className="text-sm text-muted-foreground">{customer.phone}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Cadastrado em: {new Date(customer.createdAt).toLocaleDateString('pt-AO')}
                            </p>
                          </div>
                          <Badge variant={customer.isActive ? 'default' : 'secondary'}>
                            {customer.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    Nenhum cliente encontrado
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}