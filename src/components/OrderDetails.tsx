import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Package, 
  CreditCard, 
  Plus,
  Receipt,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Order, Payment } from "./OrdersList";
import PDFGenerator from "./PDFGenerator";
import { toast } from "@/hooks/use-toast";

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
  onAddPayment: (orderId: string, payment: Omit<Payment, "id">) => void;
  onUpdateProgress: (orderId: string, progress: number) => void;
  onMarkReady: (orderId: string) => void;
}

const OrderDetails = ({ order, onBack, onAddPayment, onUpdateProgress, onMarkReady }: OrderDetailsProps) => {
  const [newPayment, setNewPayment] = useState({
    amount: "",
    date: new Date().toISOString().split('T')[0],
    method: "cash" as "cash" | "transfer" | "card",
    notes: ""
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newProgress, setNewProgress] = useState(order.progress.toString());

  const totalPaid = order.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalAmount = parseInt(order.totalAmount || "0");
  const remainingBalance = totalAmount - totalPaid;

  const handleAddPayment = () => {
    if (newPayment.amount && parseFloat(newPayment.amount) > 0) {
      onAddPayment(order.id, {
        amount: parseFloat(newPayment.amount),
        date: newPayment.date,
        method: newPayment.method,
        notes: newPayment.notes
      });
      setNewPayment({
        amount: "",
        date: new Date().toISOString().split('T')[0],
        method: "cash",
        notes: ""
      });
      setShowPaymentForm(false);
    }
  };

  const handleUpdateProgress = () => {
    const progress = parseInt(newProgress);
    if (progress >= 0 && progress <= 100) {
      onUpdateProgress(order.id, progress);
    }
  };

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

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cash":
        return "Efectivo";
      case "transfer":
        return "Transferencia";
      case "card":
        return "Tarjeta";
      default:
        return method;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{order.name}</h1>
            <p className="text-muted-foreground">Orden #{order.id.slice(0, 8)}</p>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {getStatusText(order.status)}
          </Badge>
        </div>
        
        <PDFGenerator 
          order={order} 
          onGeneratePDF={() => toast({
            title: "PDF generado",
            description: "La orden se ha descargado exitosamente.",
          })}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del Cliente */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Información del Cliente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{order.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{order.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{order.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{order.city}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Entrega: {new Date(order.deliveryDate).toLocaleDateString()}</span>
            </div>
            <Separator />
            <div className="text-sm">
              <p><strong>C.C.:</strong> {order.cedula}</p>
              <p><strong>Firma:</strong> {order.firmaCliente}</p>
            </div>
          </CardContent>
        </Card>

        {/* Progreso y Estado */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Progreso del Pedido</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progreso actual</span>
                <span className="font-medium">{order.progress}%</span>
              </div>
              <Progress value={order.progress} className="h-3" />
            </div>
            
            {order.status === "in-progress" && (
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newProgress}
                    onChange={(e) => setNewProgress(e.target.value)}
                    placeholder="Nuevo progreso"
                  />
                  <Button onClick={handleUpdateProgress} size="sm">
                    Actualizar
                  </Button>
                </div>
                
                {order.progress >= 90 && (
                  <Button
                    onClick={() => onMarkReady(order.id)}
                    className="w-full bg-success hover:bg-success/90 text-white"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Marcar como Listo
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información de Pagos */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>Pagos</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowPaymentForm(!showPaymentForm)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total</p>
                <p className="font-semibold text-lg">${totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pagado</p>
                <p className="font-semibold text-lg text-success">${totalPaid.toLocaleString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Saldo</p>
                <p className={`font-semibold text-lg ${remainingBalance > 0 ? 'text-warning' : 'text-success'}`}>
                  ${remainingBalance.toLocaleString()}
                </p>
              </div>
            </div>

            {showPaymentForm && (
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="paymentAmount">Monto</Label>
                    <Input
                      id="paymentAmount"
                      type="number"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentDate">Fecha</Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={newPayment.date}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="paymentMethod">Método</Label>
                  <select
                    id="paymentMethod"
                    value={newPayment.method}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, method: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="cash">Efectivo</option>
                    <option value="transfer">Transferencia</option>
                    <option value="card">Tarjeta</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="paymentNotes">Notas</Label>
                  <Input
                    id="paymentNotes"
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Notas opcionales"
                  />
                </div>
                <Button onClick={handleAddPayment} className="w-full">
                  Registrar Pago
                </Button>
              </div>
            )}

            {order.payments.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Historial de Pagos</h4>
                {order.payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <div>
                      <p className="font-medium">${payment.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {getPaymentMethodText(payment.method)} - {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Medidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Medidas de Pantalón</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><strong>Cintura Base:</strong> {order.pantalonMeasures.cinturaBase} cm</div>
              <div><strong>Tiro:</strong> {order.pantalonMeasures.tiro} cm</div>
              <div><strong>Contorno Pierna:</strong> {order.pantalonMeasures.contornoPierna} cm</div>
              <div><strong>Contorno Rodilla:</strong> {order.pantalonMeasures.contornoRodilla} cm</div>
              <div><strong>Ancho Bota:</strong> {order.pantalonMeasures.anchoBota} cm</div>
              <div><strong>Largo:</strong> {order.pantalonMeasures.largo} cm</div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Medidas de Blazer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><strong>Dist. Hombros:</strong> {order.blazerMeasures.distanciaHombros} cm</div>
              <div><strong>Ancho Hombros:</strong> {order.blazerMeasures.anchoHombros} cm</div>
              <div><strong>Contorno Pecho:</strong> {order.blazerMeasures.contornoPecho} cm</div>
              <div><strong>Contorno Cintura:</strong> {order.blazerMeasures.contornoCintura} cm</div>
              <div><strong>Largo Vuelo Del.:</strong> {order.blazerMeasures.largoVueloDelantero} cm</div>
              <div><strong>Largo Vuelo Atrás:</strong> {order.blazerMeasures.largoVueloAtras} cm</div>
              <div><strong>Largo Manga:</strong> {order.blazerMeasures.largoManga} cm</div>
              <div><strong>Contorno Brazo:</strong> {order.blazerMeasures.contornoBrazo} cm</div>
              <div><strong>Contorno Mancilla:</strong> {order.blazerMeasures.contornoMancilla} cm</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles del Pedido */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-primary" />
            <span>Detalles del Pedido</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Tela Principal:</strong> {order.telaPrincipal}</p>
            </div>
            <div>
              <p><strong>Forro:</strong> {order.forro}</p>
            </div>
          </div>
          {order.notasAdicionales && (
            <div>
              <p><strong>Notas Adicionales:</strong></p>
              <p className="text-muted-foreground mt-1">{order.notasAdicionales}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;