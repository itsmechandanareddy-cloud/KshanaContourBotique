import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../App";
import AdminLayout from "../../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  ShoppingBag, IndianRupee, AlertTriangle, Eye,
  Package, CheckCircle, Clock, Users, Boxes,
  Calendar, TrendingUp, ArrowDownLeft, ArrowUpRight
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { toast } from "sonner";

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
      setStats(sR.data); setChartData(cR.data); setFinancial(fR.data);
    } catch { toast.error("Failed to load reports"); }
    finally { setLoading(false); }
  };

  const fmt = (a) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(a || 0);
  const fmtDate = (d) => { if (!d) return "-"; try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); } catch { return d; } };
  const fmtMonth = (m) => { if (!m) return ""; try { const [y, mo] = m.split("-"); return new Date(parseInt(y), parseInt(mo) - 1).toLocaleDateString("en-IN", { month: "short", year: "numeric" }); } catch { return m; } };

  const viewOrdersByStatus = async (status, title) => {
    try {
      const token = localStorage.getItem("token");
      const r = await axios.get(`${API}/reports/orders-by-status?status=${status}`, { headers: { Authorization: `Bearer ${token}` } });
      setModalData(r.data); setModalTitle(title); setActiveModal("orders");
    } catch { toast.error("Failed"); }
  };
  const viewDueSoon = async () => {
    try {
      const token = localStorage.getItem("token");
      const r = await axios.get(`${API}/reports/due-soon`, { headers: { Authorization: `Bearer ${token}` } });
      setModalData(r.data); setModalTitle("Due Soon Orders"); setActiveModal("orders");
    } catch { toast.error("Failed"); }
  };

  if (loading) return <AdminLayout><div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C05C3B] border-t-transparent"></div></div></AdminLayout>;

  const f = financial;

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in" data-testid="admin-reports">
        <h1 className="font-['Cormorant_Garamond'] text-4xl font-medium text-[#2D2420]">Reports</h1>

        {/* NET SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-[#7E8B76] to-[#6A7562] text-white">
            <CardContent className="p-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"><ArrowDownLeft className="w-6 h-6" /></div><div><p className="text-sm text-white/80">Total Income</p><p className="text-2xl font-semibold">{fmt(f?.net_summary?.total_income)}</p></div></div></CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#B85450] to-[#9A4440] text-white">
            <CardContent className="p-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"><ArrowUpRight className="w-6 h-6" /></div><div><p className="text-sm text-white/80">Total Outgoing</p><p className="text-2xl font-semibold">{fmt(f?.net_summary?.total_outgoing)}</p></div></div></CardContent>
          </Card>
          <Card className={`bg-gradient-to-br ${(f?.net_summary?.net_profit || 0) >= 0 ? "from-[#C05C3B] to-[#A84C2F]" : "from-[#B85450] to-[#9A4440]"} text-white`}>
            <CardContent className="p-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"><TrendingUp className="w-6 h-6" /></div><div><p className="text-sm text-white/80">Net Profit</p><p className="text-2xl font-semibold">{fmt(f?.net_summary?.net_profit)}</p></div></div></CardContent>
          </Card>
        </div>

        {/* FINANCIAL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border-[#EFEBE4]"><CardContent className="p-6 space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#7E8B76]/10 flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-[#7E8B76]" /></div><div><p className="text-sm text-[#8A7D76]">Total Orders</p><p className="font-semibold text-[#2D2420]">{f?.orders?.order_count || 0}</p></div></div><Button variant="outline" size="sm" onClick={() => setActiveModal("income")} className="border-[#EFEBE4] rounded-lg" data-testid="view-income-btn"><Eye className="w-4 h-4 mr-1" />View</Button></div><div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#EFEBE4]"><div className="text-center p-2 bg-[#F7F2EB] rounded-xl"><p className="text-[10px] text-[#8A7D76]">Value</p><p className="font-semibold text-[#2D2420] text-xs">{fmt(f?.orders?.total_value)}</p></div><div className="text-center p-2 bg-[#7E8B76]/10 rounded-xl"><p className="text-[10px] text-[#8A7D76]">Received</p><p className="font-semibold text-[#7E8B76] text-xs">{fmt(f?.orders?.total_received)}</p></div><div className="text-center p-2 bg-[#C05C3B]/10 rounded-xl"><p className="text-[10px] text-[#8A7D76]">Balance</p><p className="font-semibold text-[#C05C3B] text-xs">{fmt(f?.orders?.total_balance)}</p></div></div></CardContent></Card>
          <Card className="bg-white border-[#EFEBE4]"><CardContent className="p-6 space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#B85450]/10 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-[#B85450]" /></div><div><p className="text-sm text-[#8A7D76]">Pending Payments</p><p className="font-semibold text-[#2D2420]">{(f?.pending?.overdue?.length||0)+(f?.pending?.upcoming?.length||0)}</p></div></div><Button variant="outline" size="sm" onClick={() => setActiveModal("pending")} className="border-[#EFEBE4] rounded-lg" data-testid="view-pending-btn"><Eye className="w-4 h-4 mr-1" />View</Button></div><div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#EFEBE4]"><div className="text-center p-2 bg-[#B85450]/10 rounded-xl"><p className="text-[10px] text-[#8A7D76]">Overdue</p><p className="font-semibold text-[#B85450] text-xs">{fmt(f?.pending?.overdue_total)}</p></div><div className="text-center p-2 bg-[#D19B5A]/10 rounded-xl"><p className="text-[10px] text-[#8A7D76]">Upcoming</p><p className="font-semibold text-[#D19B5A] text-xs">{fmt(f?.pending?.upcoming_total)}</p></div></div></CardContent></Card>
          <Card className="bg-white border-[#EFEBE4]"><CardContent className="p-6 space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#7A8B99]/10 flex items-center justify-center"><Users className="w-5 h-5 text-[#7A8B99]" /></div><div><p className="text-sm text-[#8A7D76]">Employee Payments</p><p className="font-semibold text-[#2D2420]">{fmt(f?.employees?.total_paid)}</p></div></div><Button variant="outline" size="sm" onClick={() => setActiveModal("employees")} className="border-[#EFEBE4] rounded-lg"><Eye className="w-4 h-4 mr-1" />View</Button></div></CardContent></Card>
          <Card className="bg-white border-[#EFEBE4]"><CardContent className="p-6 space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#D19B5A]/10 flex items-center justify-center"><Boxes className="w-5 h-5 text-[#D19B5A]" /></div><div><p className="text-sm text-[#8A7D76]">Raw Material Costs</p><p className="font-semibold text-[#2D2420]">{fmt(f?.materials?.total_cost)}</p></div></div><Button variant="outline" size="sm" onClick={() => setActiveModal("materials")} className="border-[#EFEBE4] rounded-lg"><Eye className="w-4 h-4 mr-1" />View</Button></div></CardContent></Card>
        </div>

        {/* STATUS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { status: "pending", label: "Pending Delivery", count: stats?.pending_delivery, icon: Package, color: "#C05C3B" },
            { status: "in_progress", label: "Work in Progress", count: stats?.in_progress, icon: Clock, color: "#7A8B99" },
            { status: "ready", label: "Ready to Deliver", count: stats?.ready_to_deliver, icon: CheckCircle, color: "#7E8B76" },
          ].map(({ status, label, count, icon: Icon, color }) => (
            <Card key={status} className="bg-white border-[#EFEBE4] cursor-pointer hover:shadow-md transition-shadow" onClick={() => viewOrdersByStatus(status, label)}>
              <CardContent className="p-6"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><Icon className="w-10 h-10" style={{ color }} /><div><p className="text-sm text-[#8A7D76]">{label}</p><p className="text-2xl font-semibold text-[#2D2420]">{count || 0}</p></div></div><Eye className="w-5 h-5 text-[#8A7D76]" /></div></CardContent>
            </Card>
          ))}
          <Card className={`border-[#EFEBE4] cursor-pointer hover:shadow-md transition-shadow ${stats?.due_soon_count > 0 ? "bg-[#B85450]/10" : "bg-white"}`} onClick={viewDueSoon}>
            <CardContent className="p-6"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><AlertTriangle className={`w-10 h-10 ${stats?.due_soon_count > 0 ? "text-[#B85450]" : "text-[#D4A373]"}`} /><div><p className="text-sm text-[#8A7D76]">Due Soon</p><p className={`text-2xl font-semibold ${stats?.due_soon_count > 0 ? "text-[#B85450]" : "text-[#2D2420]"}`}>{stats?.due_soon_count || 0}</p></div></div><Eye className="w-5 h-5 text-[#8A7D76]" /></div></CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-white border-[#EFEBE4]"><CardHeader><CardTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">Monthly Orders</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#EFEBE4" /><XAxis dataKey="month" tick={{ fill: "#8A7D76", fontSize: 12 }} /><YAxis tick={{ fill: "#8A7D76", fontSize: 12 }} /><Tooltip contentStyle={{ backgroundColor: "#FFF", border: "1px solid #EFEBE4", borderRadius: "12px" }} /><Bar dataKey="orders" fill="#C05C3B" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>
          <Card className="bg-white border-[#EFEBE4]"><CardHeader><CardTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">Monthly Revenue</CardTitle></CardHeader><CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="cI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D19B5A" stopOpacity={0.3}/><stop offset="95%" stopColor="#D19B5A" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#EFEBE4" /><XAxis dataKey="month" tick={{ fill: "#8A7D76", fontSize: 12 }} /><YAxis tick={{ fill: "#8A7D76", fontSize: 12 }} /><Tooltip contentStyle={{ backgroundColor: "#FFF", border: "1px solid #EFEBE4", borderRadius: "12px" }} formatter={(v) => fmt(v)} /><Area type="monotone" dataKey="income" stroke="#D19B5A" strokeWidth={3} fillOpacity={1} fill="url(#cI)" /></AreaChart></ResponsiveContainer></div></CardContent></Card>
        </div>
      </div>

      {/* ===== ALL MODALS ===== */}

      {/* Orders by Status */}
      <Dialog open={activeModal === "orders"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#FDFBF7] border-[#EFEBE4] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">{modalTitle} ({modalData.length})</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">{modalData.length > 0 ? modalData.map((o, i) => (
            <div key={i} className="p-4 bg-white rounded-xl border border-[#EFEBE4] space-y-2"><div className="flex justify-between"><div><span className="font-semibold text-[#2D2420]">#{o.order_id}</span><span className="ml-2 text-sm text-[#5C504A]">{o.customer_name}</span></div><span className="text-sm font-medium text-[#C05C3B]">{fmt(o.total)}</span></div><div className="flex flex-wrap gap-3 text-xs text-[#8A7D76]"><span><Calendar className="w-3 h-3 inline mr-1" />Delivery: {fmtDate(o.delivery_date)}</span>{o.balance > 0 && <span className="text-[#B85450]">Balance: {fmt(o.balance)}</span>}{o.days_until !== undefined && <span className={o.days_until <= 0 ? "text-[#B85450]" : "text-[#D4A373]"}>{o.days_until <= 0 ? "Due Today!" : `${o.days_until}d left`}</span>}</div>{o.items?.map((item, j) => <span key={j} className="text-xs bg-[#F7F2EB] px-2 py-1 rounded inline-block mr-1">{item.service_type}</span>)}</div>
          )) : <p className="text-center text-[#8A7D76] py-4">No orders</p>}</div>
        </DialogContent>
      </Dialog>

      {/* Income */}
      <Dialog open={activeModal === "income"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#FDFBF7] border-[#EFEBE4] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">Order Payments Received</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">{f?.orders?.payments?.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#EFEBE4]"><div><span className="font-medium text-sm">#{p.order_id}</span><span className="text-xs text-[#8A7D76] ml-2">{p.customer_name}</span><div className="text-xs text-[#8A7D76] mt-1">{fmtDate(p.date)} <span className="capitalize px-1.5 py-0.5 bg-[#F7F2EB] rounded">{p.mode?.replace("_"," ")}</span></div></div><span className="font-semibold text-[#7E8B76] text-sm">{fmt(p.amount)}</span></div>
          ))}</div>
        </DialogContent>
      </Dialog>

      {/* Pending */}
      <Dialog open={activeModal === "pending"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#FDFBF7] border-[#EFEBE4] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-['Cormorant_Garamond'] text-xl text-[#B85450]">Pending Payments</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            {f?.pending?.overdue?.length > 0 && <div><h3 className="text-sm font-bold text-[#B85450] mb-2">OVERDUE ({fmt(f.pending.overdue_total)})</h3>{f.pending.overdue.map((p,i)=><div key={i} className="flex justify-between p-3 bg-[#B85450]/5 rounded-xl border border-[#B85450]/20 mb-1"><div><span className="font-medium text-sm">#{p.order_id}</span><span className="text-xs text-[#8A7D76] ml-2">{p.customer_name}</span><div className="text-xs text-[#8A7D76]">Due: {fmtDate(p.delivery_date)}</div></div><div className="text-right"><p className="font-semibold text-[#B85450] text-sm">{fmt(p.balance)}</p></div></div>)}</div>}
            {f?.pending?.upcoming?.length > 0 && <div><h3 className="text-sm font-bold text-[#D19B5A] mb-2">UPCOMING ({fmt(f.pending.upcoming_total)})</h3>{f.pending.upcoming.map((p,i)=><div key={i} className="flex justify-between p-3 bg-white rounded-xl border border-[#EFEBE4] mb-1"><div><span className="font-medium text-sm">#{p.order_id}</span><span className="text-xs text-[#8A7D76] ml-2">{p.customer_name}</span></div><p className="font-semibold text-[#D19B5A] text-sm">{fmt(p.balance)}</p></div>)}</div>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Payments */}
      <Dialog open={activeModal === "employees"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#FDFBF7] border-[#EFEBE4] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">Employee Payments — {fmt(f?.employees?.total_paid)}</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">{f?.employees?.payments?.map((p,i)=>(
            <div key={i} className="flex justify-between p-3 bg-white rounded-xl border border-[#EFEBE4]"><div><span className="font-medium text-sm">{p.employee_name}</span><span className="text-xs text-[#8A7D76] ml-1">({p.employee_role})</span><div className="text-xs text-[#8A7D76] mt-1">{fmtDate(p.date)} <span className="capitalize px-1.5 py-0.5 bg-[#F7F2EB] rounded">{p.mode?.replace("_"," ")}</span></div></div><span className="font-semibold text-[#B85450] text-sm">{fmt(p.amount)}</span></div>
          ))}</div>
        </DialogContent>
      </Dialog>

      {/* Materials */}
      <Dialog open={activeModal === "materials"} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-[#FDFBF7] border-[#EFEBE4] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">Material Purchases — {fmt(f?.materials?.total_cost)}</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">{f?.materials?.payments?.map((p,i)=>(
            <div key={i} className="flex justify-between p-3 bg-white rounded-xl border border-[#EFEBE4]"><div><span className="font-medium text-sm">{p.material_name}</span>{p.supplier && <span className="text-xs text-[#8A7D76] ml-1">from {p.supplier}</span>}<div className="text-xs text-[#8A7D76] mt-1">{fmtDate(p.date)} <span className="capitalize px-1.5 py-0.5 bg-[#F7F2EB] rounded">{p.mode?.replace("_"," ")}</span> {p.quantity} {p.unit}</div></div><span className="font-semibold text-[#D19B5A] text-sm">{fmt(p.amount)}</span></div>
          ))}</div>
        </DialogContent>
      </Dialog>

    </AdminLayout>
  );
};

export default Reports;
