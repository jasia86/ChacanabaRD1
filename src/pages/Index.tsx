import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ClientForm, { ClientData } from "@/components/ClientForm";
import OrdersList, { Order, Payment } from "@/components/OrdersList";
import OrderDetails from "@/components/OrderDetails";
import FinancialReports from "@/components/FinancialReports";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Cargar órdenes del localStorage al iniciar
  useEffect(() => {
    const savedOrders = localStorage.getItem("tailor-orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Guardar órdenes en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("tailor-orders", JSON.stringify(orders));
  }, [orders]);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  };

  const handleCreateOrder = (clientData: ClientData) => {
    const newOrder: Order = {
      ...clientData,
      id: generateId(),
      status: "in-progress",
      progress: 5,
      createdAt: new Date().toISOString(),
      payments: []
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveTab("orders");
    
    toast({
      title: "Orden creada exitosamente",
      description: `Orden para ${clientData.name} ha sido registrada.`,
    });
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
  };

  const handleAddPayment = (orderId: string, payment: Omit<Payment, "id">) => {
    const paymentWithId: Payment = {
      ...payment,
      id: generateId()
    };

    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, payments: [...order.payments, paymentWithId] }
        : order
    ));

    // Actualizar la orden seleccionada si está mostrando detalles
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? {
        ...prev,
        payments: [...prev.payments, paymentWithId]
      } : null);
    }

    toast({
      title: "Pago registrado",
      description: `Pago de $${payment.amount.toLocaleString()} registrado exitosamente.`,
    });
  };

  const handleUpdateProgress = (orderId: string, progress: number) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, progress, status: progress >= 100 ? "ready" : "in-progress" }
        : order
    ));

    // Actualizar la orden seleccionada si está mostrando detalles
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? {
        ...prev,
        progress,
        status: progress >= 100 ? "ready" : "in-progress"
      } : null);
    }

    toast({
      title: "Progreso actualizado",
      description: `Progreso actualizado a ${progress}%.`,
    });
  };

  const handleMarkReady = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: "ready", progress: 100 }
        : order
    ));

    // Actualizar la orden seleccionada si está mostrando detalles
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? {
        ...prev,
        status: "ready",
        progress: 100
      } : null);
    }

    toast({
      title: "Orden lista",
      description: "La prenda está lista para ser recogida.",
    });
  };

  // Si hay una orden seleccionada, mostrar los detalles
  if (selectedOrder) {
    return (
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <OrderDetails
          order={selectedOrder}
          onBack={handleBackToOrders}
          onAddPayment={handleAddPayment}
          onUpdateProgress={handleUpdateProgress}
          onMarkReady={handleMarkReady}
        />
      </Layout>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "orders" && (
        <OrdersList
          orders={orders}
          onViewOrder={handleViewOrder}
          onUpdateProgress={handleUpdateProgress}
          onMarkReady={handleMarkReady}
        />
      )}
      
      {activeTab === "new-order" && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Nueva Orden</h2>
          <ClientForm onSubmit={handleCreateOrder} />
        </div>
      )}

      {activeTab === "reports" && (
        <FinancialReports orders={orders} />
      )}
    </Layout>
  );
};

export default Index;
