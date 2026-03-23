import jsPDF from 'jspdf';

interface DashboardData {
  stats: {
    categories: number;
    templates: number;
    reviews: number;
    payments: number;
    totalRevenue: number;
    users: number;
  };
  recentActivity: Array<{
    type: string;
    title: string;
    description: string;
    timestamp: string;
  }>;
}

export const generateDashboardPDF = async (data: DashboardData) => {
  const doc = new jsPDF();
  
  // Set font to support more characters
  doc.setFont('helvetica');
  
  // Title
  doc.setFontSize(20);
  doc.text('CardCraft Pro - Dashboard Report', 105, 20, { align: 'center' });
  
  // Date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
  
  // Statistics Section
  doc.setFontSize(16);
  doc.text('Statistics Overview', 20, 50);
  
  doc.setFontSize(12);
  const statsData = [
    { label: 'Total Categories', value: data.stats.categories },
    { label: 'Total Templates', value: data.stats.templates },
    { label: 'Total Reviews', value: data.stats.reviews },
    { label: 'Total Payments', value: data.stats.payments },
    { label: 'Total Revenue', value: `$${data.stats.totalRevenue.toFixed(2)}` },
    { label: 'Total Users', value: data.stats.users }
  ];
  
  let yPos = 65;
  statsData.forEach((stat, index) => {
    const xPos = (index % 2) * 100 + 20;
    if (index % 2 === 0 && index > 0) yPos += 15;
    doc.text(`${stat.label}:`, xPos, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(stat.value.toString(), xPos + 70, yPos);
    doc.setFont('helvetica', 'normal');
  });
  
  yPos += 30;
  
  // Recent Activity Section
  doc.setFontSize(16);
  doc.text('Recent Activity', 20, yPos);
  yPos += 15;
  
  doc.setFontSize(10);
  data.recentActivity.forEach((activity) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text(activity.title, 20, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 5;
    doc.text(activity.description, 25, yPos);
    yPos += 5;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(activity.timestamp, 25, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    yPos += 10;
  });
  
  // Footer
  const pageCount = doc.internal.pages.length - 1; // pages array includes a dummy page at index 0
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    doc.text('CardCraft Pro Admin Panel', 105, 285, { align: 'center' });
  }
  
  // Save the PDF
  const fileName = `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
  
  return fileName;
};

// Alternative: Generate PDF on server side
export const downloadServerPDF = async () => {
  try {
    const response = await fetch('/api/admin/dashboard/report', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to download PDF:', error);
    return false;
  }
};
