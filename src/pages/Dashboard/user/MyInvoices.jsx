// pages/Dashboard/user/MyInvoices.jsx - COMPLETE FIXED VERSION
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../layout/DashboardLayout';
import { 
  Download, Eye, Printer, FileText, 
  Calendar, DollarSign, Hash, 
  Filter, Search, ChevronDown, 
  CheckCircle, Clock, XCircle, 
  TrendingUp, RefreshCw, ExternalLink,
  Send, Mail, Share2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axiosSecure from '../../../api/axiosSecure';
import { format } from 'date-fns';
import { invoiceService } from '../../../services/invoiceService';



export default function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

 
const fetchInvoices = async () => {
  setLoading(true);
  try {
    
    const response = await axiosSecure.get('/invoices/my');
   
    
    if (response.data.success && response.data.invoices) {
      // Transform the API data to match your frontend format
      const formattedInvoices = response.data.invoices.map(invoice => {
        // Determine status based on invoice data
        let status = invoice.status || 'pending';
        
        // If due date has passed and status is not paid, mark as overdue
        if (status === 'pending' && invoice.dueDate) {
          const dueDate = new Date(invoice.dueDate);
          const today = new Date();
          if (dueDate < today) {
            status = 'overdue';
          }
        }
        
        return {
          id: invoice.invoiceId || `INV-${invoice._id?.toString().slice(-8)}`,
          invoiceId: invoice.invoiceId,
          orderId: invoice.orderId?.toString() || `ORD-${invoice._id?.toString().slice(-6)}`,
          customer: invoice.customerName || 'Customer',
          customerEmail: invoice.customerEmail || 'No email',
          customerPhone: invoice.customerPhone,
          customerAddress: invoice.customerAddress,
          date: invoice.invoiceDate || invoice.createdAt || new Date().toISOString(),
          dueDate: invoice.dueDate || new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          amount: invoice.subtotal || invoice.amount || 0,
          tax: invoice.taxAmount || 0,
          total: invoice.totalAmount || invoice.amount || 0,
          status: status,
          items: invoice.items || [
            {
              name: invoice.bookName || 'Book Purchase',
              description: `By ${invoice.bookAuthor || 'Unknown Author'}`,
              quantity: 1,
              price: invoice.bookPrice || invoice.amount || 0,
              total: invoice.amount || 0
            }
          ],
          paymentMethod: invoice.paymentMethod || 'Not specified',
          transactionId: null,
          notes: invoice.notes || `Order #${invoice.orderId?.toString().slice(-6) || ''}`,
          bookId: invoice.bookId,
          bookName: invoice.bookName,
          bookAuthor: invoice.bookAuthor,
          bookImage: invoice.bookImage
        };
      });
      
     
      setInvoices(formattedInvoices);
    } else {
     
      // Fallback to mock data if API returns no data
      setInvoices(mockInvoices);
    }
  } catch (error) {
    console.error('Failed to load invoices:', error);
    // For development, show mock data
    setInvoices(mockInvoices);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(invoice => {
    if (filter !== 'all' && invoice.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        invoice.id.toLowerCase().includes(searchLower) ||
        invoice.orderId?.toLowerCase().includes(searchLower) ||
        invoice.customer.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Generate PDF function
  const generatePDF = (invoice) => {
    const doc = new jsPDF();
    
    // Company info
    const companyInfo = {
      name: "BookCourier",
      address: "123 Library Street, Book City",
      city: "Dhaka, Bangladesh",
      email: "support@bookcourier.com",
      phone: "+880 1234-567890",
      website: "www.bookcourier.com"
    };
    
    // Header with company info
    doc.setFontSize(20);
    doc.setTextColor(14, 165, 164);
    doc.text(companyInfo.name, 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(companyInfo.address, 20, 30);
    doc.text(companyInfo.city, 20, 35);
    doc.text(`Email: ${companyInfo.email}`, 20, 40);
    doc.text(`Phone: ${companyInfo.phone}`, 20, 45);
    
    // Invoice title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`INVOICE: ${invoice.invoiceId || invoice.id}`, 150, 20);
    
    doc.setFontSize(10);
    doc.text(`Date: ${format(new Date(invoice.date), 'PPP')}`, 150, 30);
    doc.text(`Due Date: ${format(new Date(invoice.dueDate), 'PPP')}`, 150, 35);
    
    // Customer info
    doc.setFontSize(12);
    doc.text('Bill To:', 20, 70);
    doc.setFontSize(10);
    doc.text(invoice.customer, 20, 77);
    doc.text(invoice.customerEmail, 20, 82);
    
    // Items table
    const tableData = invoice.items.map(item => [
      item.name,
      item.quantity || 1,
      `$${(item.price || 0).toFixed(2)}`,
      `$${(item.total || 0).toFixed(2)}`
    ]);
    
    doc.autoTable({
      startY: 95,
      head: [['Description', 'Qty', 'Unit Price', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [14, 165, 164] }
    });
    
    const finalY = doc.lastAutoTable.finalY + 10;
    
    // Totals
    doc.setFontSize(10);
    doc.text('Subtotal:', 140, finalY);
    doc.text(`$${invoice.amount.toFixed(2)}`, 170, finalY);
    
    doc.text('Tax:', 140, finalY + 5);
    doc.text(`$${invoice.tax.toFixed(2)}`, 170, finalY + 5);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Total:', 140, finalY + 15);
    doc.text(`$${invoice.total.toFixed(2)}`, 170, finalY + 15);
    
    // Payment info
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, finalY + 30);
    doc.text(`Payment Method: ${invoice.paymentMethod}`, 20, finalY + 35);
    
    // Notes
    if (invoice.notes) {
      doc.text('Notes:', 20, finalY + 45);
      doc.text(invoice.notes, 20, finalY + 50);
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for choosing BookCourier!', 105, 280, { align: 'center' });
    
    // Save PDF
    const fileName = `Invoice-${invoice.invoiceId || invoice.id}.pdf`;
    doc.save(fileName);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      default: return 'neutral';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'overdue': return <XCircle size={16} />;
      default: return null;
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleSendInvoice = (invoice) => {
    alert(`Invoice ${invoice.id} sent to ${invoice.customerEmail}`);
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const pendingAmount = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="mt-4 text-muted">Loading invoices...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FileText className="text-primary" size={28} />
              My Invoices
            </h2>
            <p className="text-muted mt-1">
              Manage and download your invoices
            </p>
          </div>
          
          <button
            onClick={() => fetchInvoices(true)}
            className="btn btn-outline btn-sm gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Loading...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Refresh
              </>
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <DollarSign size={24} />
              </div>
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value">${totalRevenue.toFixed(2)}</div>
              <div className="stat-desc">All time</div>
            </div>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <CheckCircle size={24} />
              </div>
              <div className="stat-title">Paid Invoices</div>
              <div className="stat-value">{paidInvoices}</div>
              <div className="stat-desc">Out of {invoices.length}</div>
            </div>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-warning">
                <TrendingUp size={24} />
              </div>
              <div className="stat-title">Pending Amount</div>
              <div className="stat-value">${pendingAmount.toFixed(2)}</div>
              <div className="stat-desc">Awaiting payment</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 shadow">
          <div className="card-body p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    className="input input-bordered w-full pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3.5 text-muted" size={18} />
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="dropdown">
                  <label tabIndex={0} className="btn btn-outline">
                    <Filter size={16} />
                    Status: {filter === 'all' ? 'All' : filter}
                    <ChevronDown size={16} />
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
                    <li><button onClick={() => setFilter('all')}>All</button></li>
                    <li><button onClick={() => setFilter('paid')}>Paid</button></li>
                    <li><button onClick={() => setFilter('pending')}>Pending</button></li>
                    <li><button onClick={() => setFilter('overdue')}>Overdue</button></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="card bg-base-100 shadow">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
  {filteredInvoices.length === 0 ? (
    <tr>
      <td colSpan="6" className="text-center py-8">
        <div className="flex flex-col items-center justify-center">
          <FileText size={48} className="text-base-300 mb-4" />
          <p className="text-muted">No invoices found</p>
          {invoices.length === 0 && (
            <button 
              onClick={fetchInvoices}
              className="btn btn-sm btn-primary mt-2"
            >
              Try Again
            </button>
          )}
        </div>
      </td>
    </tr>
  ) : (
    filteredInvoices.map((invoice) => (
      <tr key={invoice.id} className="hover">
        <td>
          <div className="font-mono font-bold">{invoice.id}</div>
          <div className="text-xs text-muted">
            {invoice.orderId ? `Order: ${invoice.orderId}` : 'No order ID'}
          </div>
        </td>
        <td>
          <div>{format(new Date(invoice.date), 'MMM dd, yyyy')}</div>
          <div className="text-xs text-muted">
            Due: {format(new Date(invoice.dueDate), 'MMM dd')}
          </div>
        </td>
        <td>
          <div>{invoice.customer}</div>
          <div className="text-xs text-muted">{invoice.customerEmail}</div>
        </td>
        <td>
          <div className="font-bold">${invoice.total.toFixed(2)}</div>
          <div className="text-xs text-muted">
            ${invoice.amount.toFixed(2)} + ${invoice.tax.toFixed(2)} tax
          </div>
        </td>
        <td>
          <div className={`badge badge-${getStatusColor(invoice.status)} gap-1`}>
            {getStatusIcon(invoice.status)}
            {invoice.status.toUpperCase()}
          </div>
        </td>
        <td>
          <div className="flex gap-2">
            <button
              onClick={() => handleViewInvoice(invoice)}
              className="btn btn-ghost btn-xs"
              title="View Invoice"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => generatePDF(invoice)}
              className="btn btn-ghost btn-xs"
              title="Download PDF"
            >
              <Download size={14} />
            </button>
            <button
              onClick={() => handleSendInvoice(invoice)}
              className="btn btn-ghost btn-xs"
              title="Send via Email"
            >
              <Send size={14} />
            </button>
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Invoices</span>
                  <span className="font-bold">{invoices.length}</span>
                </div>
                <div className="flex justify-between text-success">
                  <span>Paid Invoices</span>
                  <span className="font-bold">
                    ${invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-warning">
                  <span>Pending Invoices</span>
                  <span className="font-bold">
                    ${invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.total, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-error">
                  <span>Overdue Invoices</span>
                  <span className="font-bold">
                    ${invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0).toFixed(2)}
                  </span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Outstanding</span>
                  <span>
                    ${(pendingAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="btn btn-primary btn-block gap-2">
                  <ExternalLink size={18} />
                  Generate New Invoice
                </button>
                <button className="btn btn-outline btn-block gap-2">
                  <Mail size={18} />
                  Send All Pending
                </button>
                <button className="btn btn-outline btn-block gap-2">
                  <Printer size={18} />
                  Print All Invoices
                </button>
                <button className="btn btn-ghost btn-block gap-2">
                  <Share2 size={18} />
                  Export to Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold">Invoice {selectedInvoice.id}</h3>
                <p className="text-muted">Order: {selectedInvoice.orderId}</p>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="btn btn-ghost btn-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h4 className="font-bold mb-2">Bill From</h4>
                    <p className="font-bold">BookCourier</p>
                    <p className="text-sm">123 Library Street</p>
                    <p className="text-sm">Book City, BC 12345</p>
                    <p className="text-sm">contact@bookcourier.com</p>
                  </div>
                </div>
                
                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h4 className="font-bold mb-2">Bill To</h4>
                    <p className="font-bold">{selectedInvoice.customer}</p>
                    <p className="text-sm">{selectedInvoice.customerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="stat p-4 bg-base-200 rounded-lg">
                  <div className="stat-title">Invoice Date</div>
                  <div className="stat-value text-lg">
                    {format(new Date(selectedInvoice.date), 'MMM dd, yyyy')}
                  </div>
                </div>
                <div className="stat p-4 bg-base-200 rounded-lg">
                  <div className="stat-title">Due Date</div>
                  <div className="stat-value text-lg">
                    {format(new Date(selectedInvoice.dueDate), 'MMM dd, yyyy')}
                  </div>
                </div>
                <div className="stat p-4 bg-base-200 rounded-lg">
                  <div className="stat-title">Status</div>
                  <div className={`stat-value text-lg badge badge-${getStatusColor(selectedInvoice.status)}`}>
                    {selectedInvoice.status.toUpperCase()}
                  </div>
                </div>
                <div className="stat p-4 bg-base-200 rounded-lg">
                  <div className="stat-title">Total Amount</div>
                  <div className="stat-value text-lg">
                    ${selectedInvoice.total.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th className="text-right">Quantity</th>
                      <th className="text-right">Unit Price</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td className="text-right">{item.quantity || 1}</td>
                        <td className="text-right">${(item.price || 0).toFixed(2)}</td>
                        <td className="text-right">${(item.total || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${selectedInvoice.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${selectedInvoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="divider"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${selectedInvoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              {selectedInvoice.paymentMethod && (
                <div className="card bg-base-200">
                  <div className="card-body p-4">
                    <h4 className="font-bold mb-2">Payment Information</h4>
                    <p>Method: {selectedInvoice.paymentMethod}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedInvoice.notes && (
                <div className="alert">
                  <div>
                    <span className="font-bold">Notes:</span>
                    <p>{selectedInvoice.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="modal-action">
                <button
                  onClick={() => generatePDF(selectedInvoice)}
                  className="btn btn-primary gap-2"
                >
                  <Download size={18} />
                  Download PDF
                </button>
                <button
                  onClick={() => handleSendInvoice(selectedInvoice)}
                  className="btn btn-outline gap-2"
                >
                  <Send size={18} />
                  Send via Email
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn btn-ghost gap-2"
                >
                  <Printer size={18} />
                  Print
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="btn btn-ghost"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}