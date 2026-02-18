import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Order } from './OrdersList';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

interface PDFGeneratorProps {
  order: Order;
  onGeneratePDF: () => void;
}

export const generateOrderPDF = async (order: Order) => {
  const pdf = new jsPDF();
  
  // Configuración de la página
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Encabezado
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SASTRERÍA PREMIUM', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Confección de Chacabanas Personalizadas', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  
  // Información de la orden
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ORDEN DE TRABAJO', 20, yPosition);
  
  yPosition += 15;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  // Datos del cliente
  const clientInfo = [
    `Orden: #${order.id.slice(0, 8)}`,
    `Fecha: ${new Date(order.createdAt).toLocaleDateString()}`,
    `Cliente: ${order.name}`,
    `Teléfono: ${order.phone}`,
    `Email: ${order.email}`,
    `Ciudad: ${order.city}`,
    `C.C.: ${order.cedula}`,
    `Fecha de Entrega: ${new Date(order.deliveryDate).toLocaleDateString()}`,
  ];

  clientInfo.forEach(info => {
    pdf.text(info, 20, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // Medidas de Pantalón
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MEDIDAS DE PANTALÓN', 20, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const pantalonMeasures = [
    `Cintura Base: ${order.pantalonMeasures.cinturaBase} cm`,
    `Tiro: ${order.pantalonMeasures.tiro} cm`,
    `Contorno Pierna: ${order.pantalonMeasures.contornoPierna} cm`,
    `Contorno Rodilla: ${order.pantalonMeasures.contornoRodilla} cm`,
    `Ancho de Bota: ${order.pantalonMeasures.anchoBota} cm`,
    `Largo: ${order.pantalonMeasures.largo} cm`,
  ];

  pantalonMeasures.forEach(measure => {
    pdf.text(measure, 20, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // Medidas de Blazer
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MEDIDAS DE BLAZER', 20, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const blazerMeasures = [
    `Distancia Hombros: ${order.blazerMeasures.distanciaHombros} cm`,
    `Ancho de Hombros: ${order.blazerMeasures.anchoHombros} cm`,
    `Contorno Pecho: ${order.blazerMeasures.contornoPecho} cm`,
    `Contorno Cintura: ${order.blazerMeasures.contornoCintura} cm`,
    `Largo Vuelo Delantero: ${order.blazerMeasures.largoVueloDelantero} cm`,
    `Largo Vuelo Atrás: ${order.blazerMeasures.largoVueloAtras} cm`,
    `Largo Manga: ${order.blazerMeasures.largoManga} cm`,
    `Contorno Brazo: ${order.blazerMeasures.contornoBrazo} cm`,
    `Contorno Mancilla: ${order.blazerMeasures.contornoMancilla} cm`,
  ];

  blazerMeasures.forEach(measure => {
    pdf.text(measure, 20, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // Detalles adicionales
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DETALLES DEL PEDIDO', 20, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const orderDetails = [
    `Tela Principal: ${order.telaPrincipal}`,
    `Forro: ${order.forro}`,
    `Monto Total: $${parseInt(order.totalAmount || "0").toLocaleString()}`,
  ];

  orderDetails.forEach(detail => {
    pdf.text(detail, 20, yPosition);
    yPosition += 7;
  });

  if (order.notasAdicionales) {
    yPosition += 5;
    pdf.text('Notas Adicionales:', 20, yPosition);
    yPosition += 7;
    
    // Dividir texto largo en múltiples líneas
    const notes = pdf.splitTextToSize(order.notasAdicionales, pageWidth - 40);
    pdf.text(notes, 20, yPosition);
    yPosition += notes.length * 7;
  }

  // Historial de pagos
  if (order.payments.length > 0) {
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('HISTORIAL DE PAGOS', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    order.payments.forEach(payment => {
      const paymentMethod = payment.method === 'cash' ? 'Efectivo' : 
                           payment.method === 'transfer' ? 'Transferencia' : 'Tarjeta';
      const paymentInfo = `${new Date(payment.date).toLocaleDateString()} - $${payment.amount.toLocaleString()} (${paymentMethod})`;
      pdf.text(paymentInfo, 20, yPosition);
      yPosition += 7;
    });
  }

  // Firma
  yPosition += 20;
  pdf.setFontSize(10);
  pdf.text('Firma del Cliente: ________________________', 20, yPosition);
  pdf.text('Fecha: ________________________', 20, yPosition + 15);

  // Pie de página
  pdf.setFontSize(8);
  pdf.text('Sastrería Premium - Confección de Chacabanas Personalizadas', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Descargar el PDF
  pdf.save(`Orden_${order.name}_${order.id.slice(0, 8)}.pdf`);
};

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ order, onGeneratePDF }) => {
  const handleDownloadPDF = async () => {
    try {
      await generateOrderPDF(order);
      onGeneratePDF();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Button
      onClick={handleDownloadPDF}
      variant="outline"
      className="flex items-center space-x-2 hover:bg-primary/10"
    >
      <Download className="h-4 w-4" />
      <span>Descargar PDF</span>
    </Button>
  );
};

export default PDFGenerator;