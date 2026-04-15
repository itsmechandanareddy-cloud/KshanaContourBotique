import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../App";
import AdminLayout from "../../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  ShoppingBag, IndianRupee, AlertTriangle, Eye,
  Package, CheckCircle, Clock, Users, Boxes,
  Calendar, Phone, Truck
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { toast } from "sonner";

const statusLabels = { pending: "Pending", in_progress: "In Progress", ready: "Ready for Pickup", delivered: "Delivered" };

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [financial, setFinancial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const h = { Authorization: `Bearer ${token}` };
      const [sR, cR, fR] = await Promise.all([
        axios.get(`${API}/dashboard/stats`, { headers: h }),
        axios.get(`${API}/dashboard/charts`, { headers: h }),
        axios.get(`${API}/reports/financial-summary`, { headers: h })
      ]);
      setStats(sR.data);
      setChartData(cR.data);
      setFinancial(fR.data);
    } catch { toast.error("Failed to load reports"); }
    finally { setLoading(false); }
  };

  const fmt = (a) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(a || 0);
  const fmtDate = (d) => { if (!d) return "-"; try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); } catch { return d; } };

  const viewOrdersByStatus = async (status, title) => {
    try {
      const token = localStorage.getItem("token");
      const r = await axios.get(`${API}/reports/orders-by-status?status=${status}`, { headers: { Authorization: `Bearer ${token}` } });
      setModalData(r.data);
      setModalTitle(title);
      setActiveModal("orders");
    } catch { toast.error("Failed to load"); }
  };

  const viewDueSoon = async () => {
    try {
      const token = localStorage.getItem("token");
      const r = await axios.get(`${API}/reports/due-soon`, { headers: { Authorization: `Bearer ${token}` } });
      setModalData(r.data);
      setModalTitle("Due Soon Orders");
      setActiveModal("orders");
    } catch { toast.error("Failed to load"); }
  };

  if (loading) return <AdminLayout><div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C05C3B] border-t-transparent"></div></div></AdminLayout>;

  const f = financial;

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in" data-testid="admin-reports">
        <h1 className="font-['Cormorant_Garamond'] text-4xl font-medium text-[#2D2420]">Reports</h1>

        {/* ===== FINANCIAL CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Orders Income */}
          <Card className="bg-white border-[#EFEBE4] shadow-[0_4px_24px_-8px_rgba(139,102,85,0.08)]">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7E8B76]/10 flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-[#7E8B76]" /></div>
                  <div><p className="text-sm text-[#8A7D76]">Total Orders</p><p className="font-semibold text-[#2D2420]">{f?.orders?.order_count || 0} orders</p></div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveModal("income")} className="border-[#EFEBE4] hover:border-[#C05C3B] hover:text-[#C05C3B] rounded-lg" data-testid="view-income-btn"><Eye className="w-4 h-4 mr-1" />View</Button>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#EFEBE4]">
                <div className="text-center p-3 bg-[#F7F2EB] rounded-xl"><p className="text-xs text-[#8A7D76]">Total Value</p><p className="font-semibold text-[#2D2420] text-sm">{fmt(f?.orders?.total_value)}</p></div>
                <div className="text-center p-3 bg-[#7E8B76]/10 rounded-xl"><p className="text-xs text-[#8A7D76]">Received</p><p className="font-semibold text-[#7E8B76] text-sm">{fmt(f?.orders?.total_received)}</p></div>
                <div className="text-center p-3 bg-[#C05C3B]/10 rounded-xl"><p className="text-xs text-[#8A7D76]">Balance Due</p><p className="font-semibold text-[#C05C3B] text-sm">{fmt(f?.orders?.total_balance)}</p></div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Payments */}
          <Card className="bg-white border-[#EFEBE4] shadow-[0_4px_24px_-8px_rgba(139,102,85,0.08)]">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#B85450]/10 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-[#B85450]" /></div>
                  <div><p className="text-sm text-[#8A7D76]">Pending Payments</p><p className="font-semibold text-[#2D2420]">{(f?.pending?.overdue?.length || 0) + (f?.pending?.upcoming?.length || 0)} orders</p></div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveModal("pending")} className="border-[#EFEBE4] hover:border-[#B85450] hover:text-[#B85450] rounded-lg" data-testid="view-pending-btn"><Eye className="w-4 h-4 mr-1" />View</Button>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#EFEBE4]">
                <div className="text-center p-3 bg-[#B85450]/10 rounded-xl"><p className="text-xs text-[#8A7D76]">Overdue</p><p className="font-semibold text-[#B85450] text-sm">{fmt(f?.pending?.overdue_total)}</p><p className="text-xs text-[#B85450]">{f?.pending?.overdue?.length || 0} orders</p></div>
                <div className="text-center p-3 bg-[#D19B5A]/10 rounded-xl"><p className="text-xs text-[#8A7D76]">Upcoming</p><p className="font-semibold text-[#D19B5A] text-sm">{fmt(f?.pending?.upcoming_total)}</p><p className="text-xs text-[#D19B5A]">{f?.pending?.upcoming?.length || 0} orders</p></div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Payments */}
          <Card className="bg-white border-[#EFEBE4] shadow-[0_4px_24px_-8px_rgba(139,102,85,0.08)]">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7A8B99]/10 flex items-center justify-center"><Users className="w-5 h-5 text-[#7A8B99]" /></div>
                  <div><p className="text-sm text-[#8A7D76]">Employee Payments</p><p className="font-semibold text-[#2D2420]">{f?.employees?.payment_count || 0} payments</p></div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveModal("employees")} className="border-[#EFEBE4] hover:border-[#7A8B99] hover:text-[#7A8B99] rounded-lg" data-testid="view-employees-btn"><Eye className="w-4 h-4 mr-1" />View</Button>
              </div>
              <div className="pt-3 border-t border-[#EFEBE4]"><div className="text-center p-3 bg-[#F7F2EB] rounded-xl"><p className="text-xs text-[#8A7D76]">Total Paid to Employees</p><p className="font-semibold text-[#2D2420]">{fmt(f?.employees?.total_paid)}</p></div></div>
            </CardContent>
          </Card>

          {/* Material Payments */}
          <Card className="bg-white border-[#EFEBE4] shadow-[0_4px_24px_-8px_rgba(139,102,85,0.08)]">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D19B5A]/10 flex items-center justify-center"><Boxes className="w-5 h-5 text-[#D19B5A]" /></div>
                  <div><p className="text-sm text-[#8A7D76]">Raw Material Costs</p><p className="font-semibold text-[#2D2420]">{f?.materials?.item_count || 0} purchases</p></div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveModal("materials")} className="border-[#EFEBE4] hover:border-[#D19B5A] hover:text-[#D19B5A] rounded-lg" data-testid="view-materials-btn"><Eye className="w-4 h-4 mr-1" />View</Button>
              </div>
              <div className="pt-3 border-t border-[#EFEBE4]"><div className="text-center p-3 bg-[#F7F2EB] rounded-xl"><p className="text-xs text-[#8A7D76]">Total Material Cost</p><p className="font-semibold text-[#2D2420]">{fmt(f?.materials?.total_cost)}</p></div></div>
            </CardContent>
          </Card>
        </div>

        {/* ===== STATUS CARDS WITH VIEW ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-[#EFEBE4] cursor-pointer hover:shadow-md transition-shadow" onClick={() => viewOrdersByStatus("pending", "Pending Delivery")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Package className="w-10 h-10 text-[#C05C3B]" />
                  <div><p className="text-sm text-[#8A7D76]">Pending Delivery</p><p className="text-2xl font-semibold text-[#2D2420]">{stats?.pending_delivery || 0}</p></div>
                </div>
                <Eye className="w-5 h-5 text-[#8A7D76]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#EFEBE4] cursor-pointer hover:shadow-md transition-shadow" onClick={() => viewOrdersByStatus("in_progress", "Work in Progress")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Clock className="w-10 h-10 text-[#7A8B99]" />
                  <div><p className="text-sm text-[#8A7D76]">Work in Progress</p><p className="text-2xl font-semibold text-[#2D2420]">{stats?.in_progress || 0}</p></div>
                </div>
                <Eye className="w-5 h-5 text-[#8A7D76]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#EFEBE4] cursor-pointer hover:shadow-md transition-shadow" onClick={() => viewOrdersByStatus("ready", "Ready to Deliver")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-10 h-10 text-[#7E8B76]" />
                  <div><p className="text-sm text-[#8A7D76]">Ready to Deliver</p><p className="text-2xl font-semibold text-[#2D2420]">{stats?.ready_to_deliver || 0}</p></div>
                </div>
                <Eye className="w-5 h-5 text-[#8A7D76]" />
              </div>
            </CardContent>
          </Card>
          <Card className={`border-[#EFEBE4] cursor-pointer hover:shadow-md transition-shadow ${stats?.due_soon_count > 0 ? "bg-[#B85450]/10 border-[#B85450]/30" : "bg-white"}`} onClick={viewDueSoon}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <AlertTriangle className={`w-10 h-10 ${stats?.due_soon_count > 0 ? "text-[#B85450]" : "text-[#D4A373]"}`} />
                  <div><p className="text-sm text-[#8A7D76]">Due Soon</p><p className={`text-2xl font-semibold ${stats?.due_soon_count > 0 ? "text-[#B85450]" : "text-[#2D2420]"}`}>{stats?.due_soon_count || 0}</p></div>
                </div>
                <Eye className="w-5 h-5 text-[#8A7D76]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-white border-[#EFEBE4]">
            <CardHeader><CardTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">Monthly Orders</CardTitle></CardHeader>
            <CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#EFEBE4" /><XAxis dataKey="month" tick={{ fill: "#8A7D76", fontSize: 12 }} /><YAxis tick={{ fill: "#8A7D76", fontSize: 12 }} /><Tooltip contentStyle={{ backgroundColor: "#FFF", border: "1px solid #EFEBE4", borderRadius: "12px" }} /><Bar dataKey="orders" fill="#C05C3B" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></CardContent>
          </Card>
          <Card className="bg-white border-[#EFEBE4]">
            <CardHeader><CardTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">Monthly Revenue</CardTitle></CardHeader>
            <CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="cI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D19B5A" stopOpacity={0.3}/><stop offset="95%" stopColor="#D19B5A" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#EFEBE4" /><XAxis dataKey="month" tick={{ fill: "#8A7D76", fontSize: 12 }} /><YAxis tick={{ fill: "#8A7D76", fontSize: 12 }} /><Tooltip contentStyle={{ backgroundColor: "#FFF", border: "1px solid #EFEBE4", borderRadius: "12px" }} formatter={(v) => fmt(v)} /><Area type="monotone" dataKey="income" stroke="#D19B5A" strokeWidth={3} fillOpacity={1} fill="url(#cI)" /></AreaChart></ResponsiveContainer></div></CardContent>
          </Card>
        </div>
      </div>

      {/* ===== MODALS ===== */}

      {/* Orders by Status / Due Soon */}
      <Dialog open={activeModal === "orders"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#FDFBF7] border-[#EFEBE4] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">{modalTitle} ({modalData.length})</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">
            {modalData.length > 0 ? modalData.map((o, i) => (
              <div key={i} className="p-4 bg-white rounded-xl border border-[#EFEBE4] space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-[#2D2420]">#{o.order_id}</span>
                    <span className="ml-2 text-sm text-[#5C504A]">{o.customer_name}</span>
                    <span className="ml-2 text-xs text-[#8A7D76]">{o.customer_phone}</span>
                  </div>
                  <span className="text-sm font-medium text-[#C05C3B]">{fmt(o.total)}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-[#8A7D76]">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Delivery: {fmtDate(o.delivery_date)}</span>
                  <span className="capitalize px-2 py-0.5 bg-[#F7F2EB] rounded">{o.status?.replace("_", " ")}</span>
                  {o.balance > 0 && <span className="text-[#B85450]">Balance: {fmt(o.balance)}</span>}
                  {o.days_until !== undefined && <span className={o.days_until <= 0 ? "text-[#B85450] font-medium" : "text-[#D4A373]"}>{o.days_until <= 0 ? "Due Today!" : `${o.days_until} day(s) left`}</span>}
                </div>
                {o.items?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {o.items.map((item, j) => <span key={j} className="text-xs bg-[#F7F2EB] px-2 py-1 rounded">{item.service_type} ({fmt(item.cost)})</span>)}
                  </div>
                )}
              </div>
            )) : <p className="text-center text-[#8A7D76] py-4">No orders found</p>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Income Detail */}
      <Dialog open={activeModal === "income"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#FDFBF7] border-[#EFEBE4] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">Order Payments Received</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-[#F7F2EB] rounded-xl"><p className="text-xs text-[#8A7D76]">Total Value</p><p className="font-bold text-[#2D2420]">{fmt(f?.orders?.total_value)}</p></div>
              <div className="text-center p-3 bg-[#7E8B76]/10 rounded-xl"><p className="text-xs text-[#8A7D76]">Received</p><p className="font-bold text-[#7E8B76]">{fmt(f?.orders?.total_received)}</p></div>
              <div className="text-center p-3 bg-[#C05C3B]/10 rounded-xl"><p className="text-xs text-[#8A7D76]">Balance</p><p className="font-bold text-[#C05C3B]">{fmt(f?.orders?.total_balance)}</p></div>
            </div>
            {f?.orders?.payments?.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#EFEBE4]">
                <div><div className="flex items-center gap-2"><span className="font-medium text-[#2D2420] text-sm">#{p.order_id}</span><span className="text-xs text-[#8A7D76]">{p.customer_name}</span></div><div className="flex items-center gap-3 text-xs text-[#8A7D76] mt-1"><span>{fmtDate(p.date)}</span><span className="capitalize px-2 py-0.5 bg-[#F7F2EB] rounded">{p.mode?.replace("_", " ")}</span>{p.notes && <span className="italic">{p.notes}</span>}</div></div>
                <span className="font-semibold text-[#7E8B76] text-sm ml-3">{fmt(p.amount)}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Pending */}
      <Dialog open={activeModal === "pending"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#FDFBF7] border-[#EFEBE4] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-['Cormorant_Garamond'] text-xl text-[#B85450]">Pending Payments</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            {f?.pending?.overdue?.length > 0 && <div><h3 className="text-sm font-bold text-[#B85450] mb-2 uppercase tracking-wider">Overdue ({fmt(f.pending.overdue_total)})</h3><div className="space-y-2">{f.pending.overdue.map((p, i) => <div key={i} className="flex items-center justify-between p-3 bg-[#B85450]/5 rounded-xl border border-[#B85450]/20"><div><div className="flex items-center gap-2"><span className="font-medium text-sm">#{p.order_id}</span><span className="text-xs text-[#8A7D76]">{p.customer_name} {p.customer_phone}</span></div><div className="text-xs text-[#8A7D76] mt-1">Due: {fmtDate(p.delivery_date)}</div></div><div className="text-right"><p className="font-semibold text-[#B85450] text-sm">{fmt(p.balance)}</p><p className="text-xs text-[#8A7D76]">of {fmt(p.total)}</p></div></div>)}</div></div>}
            {f?.pending?.upcoming?.length > 0 && <div><h3 className="text-sm font-bold text-[#D19B5A] mb-2 uppercase tracking-wider">Upcoming ({fmt(f.pending.upcoming_total)})</h3><div className="space-y-2">{f.pending.upcoming.map((p, i) => <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#EFEBE4]"><div><div className="flex items-center gap-2"><span className="font-medium text-sm">#{p.order_id}</span><span className="text-xs text-[#8A7D76]">{p.customer_name}</span></div><div className="text-xs text-[#8A7D76] mt-1">Due: {fmtDate(p.delivery_date)}</div></div><div className="text-right"><p className="font-semibold text-[#D19B5A] text-sm">{fmt(p.balance)}</p></div></div>)}</div></div>}
            {!f?.pending?.overdue?.length && !f?.pending?.upcoming?.length && <p className="text-center text-[#8A7D76] py-4">No pending payments</p>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Payments */}
      <Dialog open={activeModal === "employees"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#FDFBF7] border-[#EFEBE4] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">Employee Payments — {fmt(f?.employees?.total_paid)}</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">
            {f?.employees?.payments?.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#EFEBE4]">
                <div><div className="flex items-center gap-2"><span className="font-medium text-sm">{p.employee_name}</span><span className="text-xs text-[#8A7D76]">({p.employee_role})</span></div><div className="flex items-center gap-3 text-xs text-[#8A7D76] mt-1"><span>{fmtDate(p.date)}</span><span className="capitalize px-2 py-0.5 bg-[#F7F2EB] rounded">{p.mode?.replace("_", " ")}</span>{p.notes && <span className="italic">{p.notes}</span>}</div></div>
                <span className="font-semibold text-[#B85450] text-sm ml-3">{fmt(p.amount)}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Material Payments */}
      <Dialog open={activeModal === "materials"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#FDFBF7] border-[#EFEBE4] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">Raw Material Purchases — {fmt(f?.materials?.total_cost)}</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">
            {f?.materials?.payments?.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#EFEBE4]">
                <div><div className="flex items-center gap-2"><span className="font-medium text-sm">{p.material_name}</span>{p.supplier && <span className="text-xs text-[#8A7D76]">from {p.supplier}</span>}</div><div className="flex items-center gap-3 text-xs text-[#8A7D76] mt-1"><span>{fmtDate(p.date)}</span><span className="capitalize px-2 py-0.5 bg-[#F7F2EB] rounded">{p.mode?.replace("_", " ")}</span><span>{p.quantity} {p.unit}</span></div></div>
                <span className="font-semibold text-[#D19B5A] text-sm ml-3">{fmt(p.amount)}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Reports;
