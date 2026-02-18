import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  FileText, 
  Download,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { Order } from "./OrdersList";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface FinancialReportsProps {
  orders: Order[];
}

const FinancialReports = ({ orders }: FinancialReportsProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  // Obtener años disponibles
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    orders.forEach(order => {
      const year = new Date(order.createdAt).getFullYear().toString();
      years.add(year);
    });
    return Array.from(years).sort().reverse();
  }, [orders]);

  // Filtrar órdenes por mes y año
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const orderYear = orderDate.getFullYear().toString();
      const orderMonth = orderDate.getMonth();

      if (orderYear !== selectedYear) return false;
      if (selectedMonth === "all") return true;
      return orderMonth === parseInt(selectedMonth);
    });
  }, [orders, selectedMonth, selectedYear]);

  // Calcular métricas financieras
  const financialMetrics = useMemo(() => {
    const totalIncome = filteredOrders.reduce((sum, order) => {
      const paid = order.payments.reduce((paidSum, payment) => paidSum + payment.amount, 0);
      return sum + paid;
    }, 0);

    const totalPending = filteredOrders.reduce((sum, order) => {
      const totalAmount = parseInt(order.totalAmount || "0");
      const paid = order.payments.reduce((paidSum, payment) => paidSum + payment.amount, 0);
      return sum + Math.max(0, totalAmount - paid);
    }, 0);

    const totalRevenue = filteredOrders.reduce((sum, order) => {
      return sum + parseInt(order.totalAmount || "0");
    }, 0);

    const completedOrders = filteredOrders.filter(order => order.status === "ready" || order.status === "delivered").length;
    const pendingOrders = filteredOrders.filter(order => order.status === "in-progress" || order.status === "pending").length;

    return {
      totalIncome,
      totalPending,
      totalRevenue,
      completedOrders,
      pendingOrders,
      totalOrders: filteredOrders.length
    };
  }, [filteredOrders]);

  // Datos para gráfico de barras por mes
  const monthlyData = useMemo(() => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    return months.map((month, index) => {
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getFullYear().toString() === selectedYear && orderDate.getMonth() === index;
      });

      const income = monthOrders.reduce((sum, order) => {
        const paid = order.payments.reduce((paidSum, payment) => paidSum + payment.amount, 0);
        return sum + paid;
      }, 0);

      const pending = monthOrders.reduce((sum, order) => {
        const totalAmount = parseInt(order.totalAmount || "0");
        const paid = order.payments.reduce((paidSum, payment) => paidSum + payment.amount, 0);
        return sum + Math.max(0, totalAmount - paid);
      }, 0);

      return {
        month,
        income,
        pending,
        orders: monthOrders.length
      };
    });
  }, [orders, selectedYear]);

  // Datos para gráfico de pie (métodos de pago)
  const paymentMethodsData = useMemo(() => {
    const methods: { [key: string]: number } = {};
    
    filteredOrders.forEach(order => {
      order.payments.forEach(payment => {
        const method = payment.method === "cash" ? "Efectivo" : 
                     payment.method === "transfer" ? "Transferencia" : "Tarjeta";
        methods[method] = (methods[method] || 0) + payment.amount;
      });
    });

    return Object.entries(methods).map(([name, value]) => ({ name, value }));
  }, [filteredOrders]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent-gold))', 'hsl(var(--success))'];

  const chartConfig = {
    income: {
      label: "Ingresos",
      color: "hsl(var(--primary))",
    },
    pending: {
      label: "Pendientes",
      color: "hsl(var(--warning))",
    },
  };

  const months = [
    { value: "all", label: "Todos los meses" },
    { value: "0", label: "Enero" },
    { value: "1", label: "Febrero" },
    { value: "2", label: "Marzo" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Mayo" },
    { value: "5", label: "Junio" },
    { value: "6", label: "Julio" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Septiembre" },
    { value: "9", label: "Octubre" },
    { value: "10", label: "Noviembre" },
    { value: "11", label: "Diciembre" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Reportes Financieros</h2>
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Análisis detallado</span>
        </div>
      </div>

      {/* Filtros */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Filtros de Período</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Año</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar año" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Mes</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mes" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success/20 rounded-lg">
                <DollarSign className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ingresos</p>
                <p className="text-lg font-bold text-success">
                  ${financialMetrics.totalIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-warning/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pendientes</p>
                <p className="text-lg font-bold text-warning">
                  ${financialMetrics.totalPending.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Ventas</p>
                <p className="text-lg font-bold text-primary">
                  ${financialMetrics.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-accent-gold/20 rounded-lg">
                <FileText className="h-4 w-4 text-accent-gold" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Órdenes</p>
                <p className="text-lg font-bold text-accent-gold">
                  {financialMetrics.totalOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success/20 rounded-lg">
                <CreditCard className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completadas</p>
                <p className="text-lg font-bold text-success">
                  {financialMetrics.completedOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-warning/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">En Proceso</p>
                <p className="text-lg font-bold text-warning">
                  {financialMetrics.pendingOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Ingresos por mes */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Ingresos y Pendientes por Mes - {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="income" fill="var(--color-income)" name="Ingresos" />
                  <Bar dataKey="pending" fill="var(--color-pending)" name="Pendientes" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico de pie - Métodos de pago */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Métodos de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Monto']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lista detallada de órdenes filtradas */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Órdenes del Período Seleccionado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay órdenes en el período seleccionado
              </p>
            ) : (
              filteredOrders.map(order => {
                const totalAmount = parseInt(order.totalAmount || "0");
                const paidAmount = order.payments.reduce((sum, payment) => sum + payment.amount, 0);
                const pendingAmount = totalAmount - paidAmount;

                return (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{order.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={
                          order.status === "ready" || order.status === "delivered" 
                            ? "bg-success/20 text-success" 
                            : "bg-warning/20 text-warning"
                        }>
                          {order.status === "pending" ? "Pendiente" :
                           order.status === "in-progress" ? "En Proceso" :
                           order.status === "ready" ? "Listo" : "Entregado"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent-gold">
                        Total: ${totalAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-success">
                        Pagado: ${paidAmount.toLocaleString()}
                      </p>
                      {pendingAmount > 0 && (
                        <p className="text-sm text-warning">
                          Pendiente: ${pendingAmount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReports;