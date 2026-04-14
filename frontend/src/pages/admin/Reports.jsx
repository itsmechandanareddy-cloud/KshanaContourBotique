import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../App";
import AdminLayout from "../../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { 
  ShoppingBag, IndianRupee, Calendar, Clock, AlertTriangle, 
  TrendingUp, Package, CheckCircle
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, Area, AreaChart
} from "recharts";
import { toast } from "sonner";

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      
      const [statsRes, chartRes] = await Promise.all([
        axios.get(`${API}/dashboard/stats`, { headers }),
        axios.get(`${API}/dashboard/charts`, { headers })
      ]);
      
      setStats(statsRes.data);
      setChartData(chartRes.data);
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 0
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C05C3B] border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in" data-testid="admin-reports">
        {/* Header */}
        <h1 className="font-['Cormorant_Garamond'] text-4xl font-medium text-[#2D2420]">
          Reports Dashboard
        </h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-[#C05C3B] to-[#A84C2F] text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Monthly Revenue</p>
                  <p className="text-2xl font-semibold">{formatCurrency(stats?.monthly_income)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#D19B5A] to-[#B8854A] text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Weekly Revenue</p>
                  <p className="text-2xl font-semibold">{formatCurrency(stats?.weekly_income)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#7E8B76] to-[#6A7562] text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Monthly Orders</p>
                  <p className="text-2xl font-semibold">{stats?.monthly_orders || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#7A8B99] to-[#637382] text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Weekly Orders</p>
                  <p className="text-2xl font-semibold">{stats?.weekly_orders || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-[#EFEBE4]">
            <CardContent className="p-6 flex items-center gap-4">
              <Package className="w-10 h-10 text-[#C05C3B]" />
              <div>
                <p className="text-sm text-[#8A7D76]">Pending Delivery</p>
                <p className="text-2xl font-semibold text-[#2D2420]">{stats?.pending_delivery || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#EFEBE4]">
            <CardContent className="p-6 flex items-center gap-4">
              <Clock className="w-10 h-10 text-[#7A8B99]" />
              <div>
                <p className="text-sm text-[#8A7D76]">Work in Progress</p>
                <p className="text-2xl font-semibold text-[#2D2420]">{stats?.in_progress || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#EFEBE4]">
            <CardContent className="p-6 flex items-center gap-4">
              <CheckCircle className="w-10 h-10 text-[#7E8B76]" />
              <div>
                <p className="text-sm text-[#8A7D76]">Ready to Deliver</p>
                <p className="text-2xl font-semibold text-[#2D2420]">{stats?.ready_to_deliver || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-[#EFEBE4] ${stats?.due_soon_count > 0 ? 'bg-[#B85450]/10 border-[#B85450]/30' : 'bg-white'}`}>
            <CardContent className="p-6 flex items-center gap-4">
              <AlertTriangle className={`w-10 h-10 ${stats?.due_soon_count > 0 ? 'text-[#B85450]' : 'text-[#D4A373]'}`} />
              <div>
                <p className="text-sm text-[#8A7D76]">Due Soon (2 days)</p>
                <p className={`text-2xl font-semibold ${stats?.due_soon_count > 0 ? 'text-[#B85450]' : 'text-[#2D2420]'}`}>
                  {stats?.due_soon_count || 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Due Soon Details */}
        {stats?.due_soon?.length > 0 && (
          <Card className="bg-[#B85450]/5 border-[#B85450]/20">
            <CardHeader>
              <CardTitle className="font-['Cormorant_Garamond'] text-xl text-[#B85450] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Orders Due Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.due_soon.map((order, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#EFEBE4]">
                    <div>
                      <p className="font-semibold text-[#2D2420]">#{order.order_id}</p>
                      <p className="text-sm text-[#5C504A]">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#8A7D76]">Delivery: {order.delivery_date?.split('T')[0]}</p>
                      <p className={`text-sm font-medium ${order.days_until <= 0 ? 'text-[#B85450]' : 'text-[#D4A373]'}`}>
                        {order.days_until <= 0 ? 'Due Today!' : `Due in ${order.days_until} day(s)`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-white border-[#EFEBE4] shadow-[0_4px_24px_-8px_rgba(139,102,85,0.08)]">
            <CardHeader>
              <CardTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">
                Monthly Orders Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EFEBE4" />
                    <XAxis dataKey="month" tick={{ fill: '#8A7D76', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#8A7D76', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        border: '1px solid #EFEBE4',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar dataKey="orders" fill="#C05C3B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#EFEBE4] shadow-[0_4px_24px_-8px_rgba(139,102,85,0.08)]">
            <CardHeader>
              <CardTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">
                Monthly Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D19B5A" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#D19B5A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EFEBE4" />
                    <XAxis dataKey="month" tick={{ fill: '#8A7D76', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#8A7D76', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        border: '1px solid #EFEBE4',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#D19B5A" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorIncome)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;
