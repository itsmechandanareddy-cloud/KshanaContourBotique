import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../App";
import AdminLayout from "../../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { 
  Plus, ShoppingBag, Calendar, IndianRupee, Clock, 
  AlertTriangle, TrendingUp, Package, CheckCircle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

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
      <div className="space-y-8 animate-fade-in" data-testid="admin-dashboard">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-4xl font-medium text-[#2D2420]">
              Dashboard
            </h1>
            <p className="text-[#8A7D76] mt-1">{today}</p>
          </div>
          <Button
            onClick={() => navigate("/admin/orders/new")}
            className="bg-[#C05C3B] hover:bg-[#A84C2F] text-white rounded-full px-6 shadow-[0_4px_12px_rgba(192,92,59,0.25)]"
            data-testid="new-order-button"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>

        {/* Due Soon Warning */}
        {stats?.due_soon?.length > 0 && (
          <div className="bg-[#B85450]/10 border border-[#B85450]/30 rounded-2xl p-4">
            {stats.due_soon.map((order, idx) => (
              <div key={idx} className="flex items-center gap-3 text-[#B85450]">
                <Clock className="w-5 h-5" />
                <span className="font-medium">
                  Order #{order.order_id} for {order.customer_name} is due in {order.days_until} day(s)
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-[#EFEBE4] shadow-[0_4px_24px_-8px_rgba(139,102,85,0.08)] card-hover">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C05C3B]/10 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-[#C05C3B]" />
                </div>
                <div>
                  <p className="text-sm text-[#8A7D76]">Monthly Orders</p>
                  <p className="text-2xl font-semibold text-[#2D2420]">{stats?.monthly_orders || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#EFEBE4] shadow-[0_4px_24px_-8px_rgba(139,102,85,0.08)] card-hover">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D19B5A]/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#D19B5A]" />
                </div>
                <div>
                  <p className="text-sm text-[#8A7D76]">Weekly Orders</p>
                  <p className="text-2xl font-semibold text-[#2D2420]">{stats?.weekly_orders || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#EFEBE4] shadow-[0_4px_24px_-8px_rgba(139,102,85,0.08)] card-hover">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#7E8B76]/10 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-[#7E8B76]" />
                </div>
                <div>
                  <p className="text-sm text-[#8A7D76]">Monthly Income</p>
                  <p className="text-2xl font-semibold text-[#2D2420]">{formatCurrency(stats?.monthly_income || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#EFEBE4] shadow-[0_4px_24px_-8px_rgba(139,102,85,0.08)] card-hover">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#7A8B99]/10 flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-[#7A8B99]" />
                </div>
                <div>
                  <p className="text-sm text-[#8A7D76]">Weekly Income</p>
                  <p className="text-2xl font-semibold text-[#2D2420]">{formatCurrency(stats?.weekly_income || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="bg-[#C05C3B]/5 border-[#C05C3B]/20">
            <CardContent className="p-5 flex items-center gap-4">
              <Package className="w-8 h-8 text-[#C05C3B]" />
              <div>
                <p className="text-sm text-[#8A7D76]">Pending Delivery</p>
                <p className="text-xl font-semibold text-[#2D2420]">{stats?.pending_delivery || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#7A8B99]/5 border-[#7A8B99]/20">
            <CardContent className="p-5 flex items-center gap-4">
              <Clock className="w-8 h-8 text-[#7A8B99]" />
              <div>
                <p className="text-sm text-[#8A7D76]">In Progress</p>
                <p className="text-xl font-semibold text-[#2D2420]">{stats?.in_progress || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#7E8B76]/5 border-[#7E8B76]/20">
            <CardContent className="p-5 flex items-center gap-4">
              <TrendingUp className="w-8 h-8 text-[#7E8B76]" />
              <div>
                <p className="text-sm text-[#8A7D76]">Ready to Deliver</p>
                <p className="text-xl font-semibold text-[#2D2420]">{stats?.ready_to_deliver || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#D4A373]/10 border-[#D4A373]/30">
            <CardContent className="p-5 flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-[#D4A373]" />
              <div>
                <p className="text-sm text-[#8A7D76]">Due Soon (2 days)</p>
                <p className="text-xl font-semibold text-[#2D2420]">{stats?.due_soon_count || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-white border-[#EFEBE4] shadow-[0_4px_24px_-8px_rgba(139,102,85,0.08)]">
            <CardHeader>
              <CardTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">
                Monthly Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EFEBE4" />
                    <XAxis dataKey="month" tick={{ fill: '#8A7D76', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#8A7D76', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        border: '1px solid #EFEBE4',
                        borderRadius: '12px'
                      }}
                    />
                    <Bar dataKey="orders" fill="#C05C3B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#EFEBE4] shadow-[0_4px_24px_-8px_rgba(139,102,85,0.08)]">
            <CardHeader>
              <CardTitle className="font-['Cormorant_Garamond'] text-xl text-[#2D2420]">
                Monthly Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EFEBE4" />
                    <XAxis dataKey="month" tick={{ fill: '#8A7D76', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#8A7D76', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        border: '1px solid #EFEBE4',
                        borderRadius: '12px'
                      }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Bar dataKey="income" fill="#D19B5A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
