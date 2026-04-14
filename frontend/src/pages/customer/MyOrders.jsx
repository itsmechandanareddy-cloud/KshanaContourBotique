import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, API } from "../../App";
import axios from "axios";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { 
  ArrowLeft, ShoppingBag, Calendar, IndianRupee, 
  Eye, Clock, CheckCircle, Truck, Package
} from "lucide-react";
import { toast } from "sonner";

const statusColors = {
  pending: "badge-pending",
  in_progress: "badge-in-progress",
  ready: "badge-ready",
  delivered: "badge-delivered"
};

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  ready: "Ready for Pickup",
  delivered: "Delivered"
};

const statusIcons = {
  pending: Package,
  in_progress: Clock,
  ready: CheckCircle,
  delivered: Truck
};

const MyOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C05C3B] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="bg-white border-b border-[#EFEBE4] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/customer")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-['Cormorant_Garamond'] text-2xl font-medium text-[#2D2420]">
            My Orders
          </h1>
        </div>
      </header>

      {/* Orders List */}
      <main className="max-w-4xl mx-auto px-6 py-8" data-testid="customer-orders">
        {orders.length === 0 ? (
          <Card className="bg-white border-[#EFEBE4]">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-[#8A7D76] mb-4" />
              <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#2D2420] mb-2">
                No Orders Yet
              </h3>
              <p className="text-[#8A7D76]">
                Visit our store to place your first order!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status] || Package;
              return (
                <Card 
                  key={order.order_id}
                  className="bg-white border-[#EFEBE4] shadow-[0_4px_24px_-8px_rgba(139,102,85,0.08)] overflow-hidden"
                >
                  <CardContent className="p-0">
                    {/* Status Banner */}
                    <div className={`px-6 py-3 flex items-center gap-3 ${
                      order.status === 'delivered' 
                        ? 'bg-[#7E8B76]/10' 
                        : order.status === 'ready'
                        ? 'bg-[#7E8B76]/10'
                        : 'bg-[#F7F2EB]'
                    }`}>
                      <StatusIcon className={`w-5 h-5 ${
                        order.status === 'delivered' || order.status === 'ready'
                          ? 'text-[#7E8B76]'
                          : 'text-[#D19B5A]'
                      }`} />
                      <span className={`font-medium ${
                        order.status === 'delivered' || order.status === 'ready'
                          ? 'text-[#7E8B76]'
                          : 'text-[#D19B5A]'
                      }`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>

                    {/* Order Details */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-[#2D2420] text-lg">
                            Order #{order.order_id}
                          </p>
                          <p className="text-sm text-[#8A7D76]">
                            {order.items?.length || 0} item(s)
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/customer/orders/${order.order_id}`)}
                          className="border-[#C05C3B] text-[#C05C3B] hover:bg-[#C05C3B]/10 rounded-full"
                          data-testid={`view-order-${order.order_id}`}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-[#5C504A]">
                          <Calendar className="w-4 h-4 text-[#8A7D76]" />
                          <span>Order Date: {formatDate(order.order_date || order.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#5C504A]">
                          <Truck className="w-4 h-4 text-[#8A7D76]" />
                          <span>Delivery: {formatDate(order.delivery_date)}</span>
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#EFEBE4]">
                        <div>
                          <p className="text-sm text-[#8A7D76]">Total Amount</p>
                          <p className="font-semibold text-[#2D2420]">{formatCurrency(order.total)}</p>
                        </div>
                        {order.balance > 0 ? (
                          <div className="text-right">
                            <p className="text-sm text-[#8A7D76]">Balance Due</p>
                            <p className="font-semibold text-[#C05C3B]">{formatCurrency(order.balance)}</p>
                          </div>
                        ) : (
                          <div className="px-4 py-2 bg-[#7E8B76]/10 rounded-full">
                            <p className="text-sm font-medium text-[#7E8B76]">Fully Paid</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
