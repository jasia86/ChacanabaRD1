import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Calendar, User, Phone, Package, Clock, CheckCircle2 } from "lucide-react";
import { ClientData } from "./ClientForm";

export interface Order extends ClientData {
  id: string;
  status: "pending" | "in-progress" | "ready" | "delivered";
  progress: number;
  createdAt: string;
  payments: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: "cash" | "transfer" | "card";
  notes?: string;
}

interface OrdersListProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onUpdateProgress: (orderId: string, progress: number) => void;
  onMarkReady: (orderId: string) => void;
}

const OrdersList = ({ orders, onViewOrder, onUpdateProgress, onMarkReady }: OrdersListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/20 text-warning border-warning/30";
      case "in-progress":
        return "bg-primary/20 text-primary border-primary/30";
      case "ready":
        return "bg-success/20 text-success border-success/30";
      case "delivered":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "in-progress":
        return "En Proceso";
      case "ready":
        return "Listo";
      case "delivered":
        return "Entregado";
      default:
        return status;
    }
  };

  const calculateDaysRemaining = (deliveryDate: string) => {
    const delivery = new Date(deliveryDate);
    const today = new Date();
    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateProgressByDate = (deliveryDate: string, createdAt: string) => {
    const created = new Date(createdAt);
    const delivery = new Date(deliveryDate);
    const today = new Date();
    
    const totalTime = delivery.getTime() - created.getTime();
    const elapsedTime = today.getTime() - created.getTime();
    
    if (elapsedTime <= 0) return 0;
    if (today >= delivery) return 100;
    
    return Math.min(Math.round((elapsedTime / totalTime) * 100), 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Órdenes Activas</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>{orders.length} órdenes</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No hay órdenes activas</h3>
            <p className="text-muted-foreground">Crea tu primera orden para comenzar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => {
            const daysRemaining = calculateDaysRemaining(order.deliveryDate);
            const autoProgress = calculateProgressByDate(order.deliveryDate, order.createdAt);
            const displayProgress = order.status === "ready" ? 100 : Math.max(order.progress, autoProgress);
            
            return (
              <Card key={order.id} className="shadow-card hover:shadow-elegant transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{order.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">Orden #{order.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{order.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Entrega: {new Date(order.deliveryDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className={daysRemaining < 3 ? "text-warning font-medium" : "text-muted-foreground"}>
                        {daysRemaining > 0 ? `${daysRemaining} días restantes` : "Fecha vencida"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{displayProgress}%</span>
                    </div>
                    <Progress value={displayProgress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total: </span>
                      <span className="font-semibold text-accent-gold">
                        ${parseInt(order.totalAmount || "0").toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      {order.status === "in-progress" && displayProgress >= 90 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onMarkReady(order.id)}
                          className="text-success border-success hover:bg-success/10"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Marcar Listo
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersList;