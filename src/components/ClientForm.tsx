import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar, User, Phone, Mail, MapPin, Scissors, Shirt } from "lucide-react";

export interface ClientData {
  date: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  pantalonMeasures: {
    cinturaBase: string;
    tiro: string;
    contornoPierna: string;
    contornoRodilla: string;
    anchoBota: string;
    largo: string;
  };
  blazerMeasures: {
    distanciaHombros: string;
    anchoHombros: string;
    contornoPecho: string;
    contornoCintura: string;
    largoVueloDelantero: string;
    largoVueloAtras: string;
    largoManga: string;
    contornoBrazo: string;
    contornoMancilla: string;
  };
  telaPrincipal: string;
  forro: string;
  firmaCliente: string;
  cedula: string;
  notasAdicionales: string;
  totalAmount: string;
  deliveryDate: string;
}

interface ClientFormProps {
  onSubmit: (data: ClientData) => void;
}

const ClientForm = ({ onSubmit }: ClientFormProps) => {
  const [formData, setFormData] = useState<ClientData>({
    date: new Date().toISOString().split('T')[0],
    name: "",
    phone: "",
    email: "",
    city: "",
    pantalonMeasures: {
      cinturaBase: "",
      tiro: "",
      contornoPierna: "",
      contornoRodilla: "",
      anchoBota: "",
      largo: "",
    },
    blazerMeasures: {
      distanciaHombros: "",
      anchoHombros: "",
      contornoPecho: "",
      contornoCintura: "",
      largoVueloDelantero: "",
      largoVueloAtras: "",
      largoManga: "",
      contornoBrazo: "",
      contornoMancilla: "",
    },
    telaPrincipal: "",
    forro: "",
    firmaCliente: "",
    cedula: "",
    notasAdicionales: "",
    totalAmount: "",
    deliveryDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updatePantalonMeasure = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pantalonMeasures: { ...prev.pantalonMeasures, [field]: value }
    }));
  };

  const updateBlazerMeasure = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      blazerMeasures: { ...prev.blazerMeasures, [field]: value }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {/* Información del Cliente */}
      <Card className="shadow-card">
        <CardHeader className="bg-gradient-subtle">
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <span>Información del Cliente</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Fecha</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateField("date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Cliente</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
                placeholder="Nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>Teléfono</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                required
                placeholder="+57 300 123 4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span>Correo Electrónico</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
                placeholder="cliente@ejemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Ciudad</span>
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                required
                placeholder="Ciudad de residencia"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula de Ciudadanía</Label>
              <Input
                id="cedula"
                value={formData.cedula}
                onChange={(e) => updateField("cedula", e.target.value)}
                required
                placeholder="12345678"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medidas de Pantalón */}
      <Card className="shadow-card">
        <CardHeader className="bg-gradient-subtle">
          <CardTitle className="flex items-center space-x-2">
            <Scissors className="h-5 w-5 text-primary" />
            <span>Medidas para Pantalón</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cinturaBase">Cintura Base (cm)</Label>
              <Input
                id="cinturaBase"
                value={formData.pantalonMeasures.cinturaBase}
                onChange={(e) => updatePantalonMeasure("cinturaBase", e.target.value)}
                placeholder="85"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiro">Tiro (cm)</Label>
              <Input
                id="tiro"
                value={formData.pantalonMeasures.tiro}
                onChange={(e) => updatePantalonMeasure("tiro", e.target.value)}
                placeholder="28"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contornoPierna">Contorno Pierna (cm)</Label>
              <Input
                id="contornoPierna"
                value={formData.pantalonMeasures.contornoPierna}
                onChange={(e) => updatePantalonMeasure("contornoPierna", e.target.value)}
                placeholder="60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contornoRodilla">Contorno Rodilla (cm)</Label>
              <Input
                id="contornoRodilla"
                value={formData.pantalonMeasures.contornoRodilla}
                onChange={(e) => updatePantalonMeasure("contornoRodilla", e.target.value)}
                placeholder="40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anchoBota">Ancho de Bota (cm)</Label>
              <Input
                id="anchoBota"
                value={formData.pantalonMeasures.anchoBota}
                onChange={(e) => updatePantalonMeasure("anchoBota", e.target.value)}
                placeholder="22"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="largo">Largo (cm)</Label>
              <Input
                id="largo"
                value={formData.pantalonMeasures.largo}
                onChange={(e) => updatePantalonMeasure("largo", e.target.value)}
                placeholder="108"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medidas de Blazer */}
      <Card className="shadow-card">
        <CardHeader className="bg-gradient-subtle">
          <CardTitle className="flex items-center space-x-2">
            <Shirt className="h-5 w-5 text-primary" />
            <span>Medidas para Blazer</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distanciaHombros">Distancia Hombros (cm)</Label>
              <Input
                id="distanciaHombros"
                value={formData.blazerMeasures.distanciaHombros}
                onChange={(e) => updateBlazerMeasure("distanciaHombros", e.target.value)}
                placeholder="42"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anchoHombros">Ancho de Hombros (cm)</Label>
              <Input
                id="anchoHombros"
                value={formData.blazerMeasures.anchoHombros}
                onChange={(e) => updateBlazerMeasure("anchoHombros", e.target.value)}
                placeholder="45"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contornoPecho">Contorno Pecho (cm)</Label>
              <Input
                id="contornoPecho"
                value={formData.blazerMeasures.contornoPecho}
                onChange={(e) => updateBlazerMeasure("contornoPecho", e.target.value)}
                placeholder="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contornoCintura">Contorno Cintura (cm)</Label>
              <Input
                id="contornoCintura"
                value={formData.blazerMeasures.contornoCintura}
                onChange={(e) => updateBlazerMeasure("contornoCintura", e.target.value)}
                placeholder="90"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="largoVueloDelantero">Largo Vuelo Delantero (cm)</Label>
              <Input
                id="largoVueloDelantero"
                value={formData.blazerMeasures.largoVueloDelantero}
                onChange={(e) => updateBlazerMeasure("largoVueloDelantero", e.target.value)}
                placeholder="75"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="largoVueloAtras">Largo Vuelo Atrás (cm)</Label>
              <Input
                id="largoVueloAtras"
                value={formData.blazerMeasures.largoVueloAtras}
                onChange={(e) => updateBlazerMeasure("largoVueloAtras", e.target.value)}
                placeholder="77"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="largoManga">Largo Manga (cm)</Label>
              <Input
                id="largoManga"
                value={formData.blazerMeasures.largoManga}
                onChange={(e) => updateBlazerMeasure("largoManga", e.target.value)}
                placeholder="65"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contornoBrazo">Contorno Brazo (cm)</Label>
              <Input
                id="contornoBrazo"
                value={formData.blazerMeasures.contornoBrazo}
                onChange={(e) => updateBlazerMeasure("contornoBrazo", e.target.value)}
                placeholder="35"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contornoMancilla">Contorno Mancilla (cm)</Label>
              <Input
                id="contornoMancilla"
                value={formData.blazerMeasures.contornoMancilla}
                onChange={(e) => updateBlazerMeasure("contornoMancilla", e.target.value)}
                placeholder="25"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalles Adicionales */}
      <Card className="shadow-card">
        <CardHeader className="bg-gradient-subtle">
          <CardTitle>Detalles del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telaPrincipal">Tela Principal</Label>
              <Input
                id="telaPrincipal"
                value={formData.telaPrincipal}
                onChange={(e) => updateField("telaPrincipal", e.target.value)}
                placeholder="Tipo y color de tela"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="forro">Forro</Label>
              <Input
                id="forro"
                value={formData.forro}
                onChange={(e) => updateField("forro", e.target.value)}
                placeholder="Tipo y color de forro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Monto Total ($)</Label>
              <Input
                id="totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) => updateField("totalAmount", e.target.value)}
                placeholder="500000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Fecha de Entrega</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => updateField("deliveryDate", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="firmaCliente">Firma del Cliente</Label>
            <Input
              id="firmaCliente"
              value={formData.firmaCliente}
              onChange={(e) => updateField("firmaCliente", e.target.value)}
              placeholder="Nombre y firma del cliente"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notasAdicionales">Notas Adicionales</Label>
            <Textarea
              id="notasAdicionales"
              value={formData.notasAdicionales}
              onChange={(e) => updateField("notasAdicionales", e.target.value)}
              placeholder="Detalles especiales, modificaciones, observaciones..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="submit" className="px-8 py-3 bg-gradient-primary hover:bg-primary-hover">
          Crear Orden
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;