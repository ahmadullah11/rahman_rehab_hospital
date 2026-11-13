"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Upload,
  Trash2,
  LogOut,
  Database,
  Layers,
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  Eye,
  CheckCircle2,
  Clock,
} from "lucide-react";
import UploadModal from "@/components/UploadModal";
import { GalleryItem } from "@/lib/constants";
import { getDashboardStatsAction, getAllUsersAction, deleteUserAction, updateUserRoleAction } from "@/app/actions/admin";
import { getAllOrdersAction, updateOrderStatusAction } from "@/app/actions/orders";
import { getProductsAction, deleteProductAction } from "@/app/actions/products";

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"kpis" | "products" | "orders" | "users" | "gallery" | "enquiries">("kpis");
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const loadAll = async () => {
    setLoadingData(true);
    try {
      const [statsRes, prodRes, ordRes, usrRes] = await Promise.all([
        getDashboardStatsAction(),
        getProductsAction(),
        getAllOrdersAction(),
        getAllUsersAction(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (prodRes.success) setProducts(prodRes.products);
      if (ordRes.success) setOrders(ordRes.orders);
      if (usrRes.success) setUsers(usrRes.users);

      const [galRes, enqRes] = await Promise.all([
        fetch("/api/gallery").then((r) => r.json()).catch(() => ({ images: [] })),
        fetch("/api/enquiry").then((r) => r.json()).catch(() => ({ enquiries: [] })),
      ]);

      if (galRes.images) setImages(galRes.images);
      if (enqRes.enquiries) setEnquiries(enqRes.enquiries);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await deleteProductAction(id);
    loadAll();
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to remove this photograph?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    setImages((prev) => prev.filter((i) => i._id !== id));
  };

  const handleUpdateOrderStatus = async (orderId: string, status: any) => {
    await updateOrderStatusAction(orderId, status);
    loadAll();
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {/* Top Header */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-30 px-6 py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="logo text-lg">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6 text-[var(--primary)]">
                <path d="M16 29V14" />
                <path d="M16 18c-5 0-9-3.5-9-9 5 0 9 3.5 9 9z" />
                <path d="M16 14c0-5 3.5-9 9-9 0 5-3.5 9-9 9z" />
              </svg>
              Rahman Rehab Admin
            </Link>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--soft)] text-[var(--primary)] font-semibold">
              CRUD &amp; KPI Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="btn btn-ghost" style={{ padding: "0.4rem 0.9rem", fontSize: "0.82rem" }}>
              View Website
            </Link>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="btn btn-ghost text-red-500"
              style={{ padding: "0.4rem 0.9rem", fontSize: "0.82rem" }}
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container flex-1 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-[var(--border)]">
          <button
            onClick={() => setActiveTab("kpis")}
            className={`btn ${activeTab === "kpis" ? "btn-primary" : "btn-ghost"}`}
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            <TrendingUp className="w-4 h-4 mr-1.5" />
            Dashboard KPIs
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`btn ${activeTab === "products" ? "btn-primary" : "btn-ghost"}`}
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            <Package className="w-4 h-4 mr-1.5" />
            Products CRUD ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`btn ${activeTab === "orders" ? "btn-primary" : "btn-ghost"}`}
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            <ShoppingBag className="w-4 h-4 mr-1.5" />
            Orders View ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`btn ${activeTab === "users" ? "btn-primary" : "btn-ghost"}`}
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            <Users className="w-4 h-4 mr-1.5" />
            Users Management ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`btn ${activeTab === "gallery" ? "btn-primary" : "btn-ghost"}`}
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            <Layers className="w-4 h-4 mr-1.5" />
            Center Photos ({images.length})
          </button>
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`btn ${activeTab === "enquiries" ? "btn-primary" : "btn-ghost"}`}
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            Enquiries ({enquiries.length})
          </button>
        </div>

        {/* Tab 1: KPIs */}
        {activeTab === "kpis" && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card p-6">
                <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-1">
                  Total Revenue
                </span>
                <b className="text-3xl font-serif text-[var(--primary)] block">
                  ${(stats?.totalRevenue || 0).toLocaleString()}
                </b>
                <span className="text-xs text-[var(--muted)] mt-2 block">All completed admissions &amp; packages</span>
              </div>
              <div className="card p-6">
                <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-1">
                  Total Orders
                </span>
                <b className="text-3xl font-serif text-[var(--text)] block">
                  {stats?.totalOrders || orders.length}
                </b>
                <span className="text-xs text-amber-500 font-semibold mt-2 block">
                  {stats?.pendingOrdersCount || 0} Pending orders
                </span>
              </div>
              <div className="card p-6">
                <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-1">
                  Active Products
                </span>
                <b className="text-3xl font-serif text-[var(--text)] block">
                  {stats?.totalProducts || products.length}
                </b>
                <span className="text-xs text-[var(--muted)] mt-2 block">Inpatient packages &amp; therapy</span>
              </div>
              <div className="card p-6">
                <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-1">
                  Total Users
                </span>
                <b className="text-3xl font-serif text-[var(--primary)] block">
                  {stats?.totalUsers || users.length}
                </b>
                <span className="text-xs text-[var(--muted)] mt-2 block">Registered client accounts</span>
              </div>
            </div>

            {/* Recent Orders table */}
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--sans)" }}>
                Recent Patient Orders
              </h3>
              {orders.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No orders placed yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs uppercase">
                        <th className="pb-3">Order #</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o._id}>
                          <td className="py-3 font-mono font-semibold">{o.orderNumber}</td>
                          <td className="py-3">{o.customerName}</td>
                          <td className="py-3 font-semibold text-[var(--primary)]">${o.totalAmount}</td>
                          <td className="py-3 uppercase text-xs">{o.paymentMethod}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-[var(--soft)] text-[var(--primary)]">
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Products CRUD */}
        {activeTab === "products" && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold" style={{ fontFamily: "var(--sans)" }}>
                Rehabilitation Packages &amp; Pharmacy Products
              </h3>
              <Link href="/products" className="btn btn-primary" style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }}>
                Browse Store
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs uppercase">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td className="py-3 font-semibold">{p.title}</td>
                      <td className="py-3 text-[var(--muted)]">{p.category}</td>
                      <td className="py-3 font-semibold text-[var(--primary)]">${p.price}</td>
                      <td className="py-3">{p.inStock ? `${p.stockCount} in stock` : "Out of stock"}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Orders */}
        {activeTab === "orders" && (
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--sans)" }}>
              Patient Orders &amp; Admissions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs uppercase">
                    <th className="pb-3">Order</th>
                    <th className="pb-3">Client</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td className="py-3 font-mono font-semibold">{o.orderNumber}</td>
                      <td className="py-3">
                        <b>{o.customerName}</b>
                        <br />
                        <small className="text-[var(--muted)]">{o.phone}</small>
                      </td>
                      <td className="py-3">{o.items?.length || 0} items</td>
                      <td className="py-3 font-semibold text-[var(--primary)]">${o.totalAmount}</td>
                      <td className="py-3">
                        <select
                          value={o.status}
                          onChange={(e: any) => handleUpdateOrderStatus(o._id, e.target.value)}
                          className="text-xs rounded-md p-1 border border-[var(--border)]"
                          style={{ width: "auto" }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped/Active</option>
                          <option value="delivered">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 text-right">
                        <Link href={`/profile`} className="text-xs text-[var(--primary)] font-semibold">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Users */}
        {activeTab === "users" && (
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--sans)" }}>
              User Accounts
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs uppercase">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="py-3 font-semibold">{u.name}</td>
                      <td className="py-3 text-[var(--muted)]">{u.email}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-[var(--soft)] text-[var(--primary)]">
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Gallery */}
        {activeTab === "gallery" && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold" style={{ fontFamily: "var(--sans)" }}>
                Center Photographs (ImageKit)
              </h3>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="btn btn-primary"
                style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }}
              >
                <Upload className="w-3.5 h-3.5 mr-1" />
                Upload Photo
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img._id} className="relative rounded-xl overflow-hidden aspect-[4/3] group border border-[var(--border)]">
                  <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                    <span className="text-xs font-bold text-[var(--primary)] uppercase">{img.category}</span>
                    <button
                      onClick={() => handleDeleteImage(img._id)}
                      className="self-end p-1.5 rounded-full bg-red-600 text-white cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Enquiries */}
        {activeTab === "enquiries" && (
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--sans)" }}>
              Direct Patient Enquiries
            </h3>
            {enquiries.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No enquiries submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {enquiries.map((e, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                    <div className="flex items-center justify-between mb-1">
                      <b className="text-base">{e.name}</b>
                      <span className="text-xs font-bold uppercase text-[var(--primary)]">{e.enquiryFor}</span>
                    </div>
                    <div className="text-xs text-[var(--muted)] mb-2">
                      Phone: <b>{e.phone}</b> {e.email && `| Email: ${e.email}`}
                    </div>
                    {e.message && <p className="text-sm text-[var(--text)]">{e.message}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upload Modal */}
        {isUploadOpen && (
          <UploadModal
            isOpen={isUploadOpen}
            onClose={() => setIsUploadOpen(false)}
            onUploadSuccess={() => loadAll()}
          />
        )}
      </main>
    </div>
  );
}
