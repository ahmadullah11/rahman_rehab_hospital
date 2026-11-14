"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Upload,
  Trash2,
  LogOut,
  Layers,
  Users,
  TrendingUp,
} from "lucide-react";
import UploadModal from "@/components/UploadModal";
import { GalleryItem } from "@/lib/constants";
import { getDashboardStatsAction, getAllUsersAction, deleteUserAction, updateUserRoleAction } from "@/app/actions/admin";

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"kpis" | "users" | "gallery" | "enquiries">("kpis");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const loadAll = async () => {
    setLoadingData(true);
    try {
      const [statsRes, usrRes] = await Promise.all([
        getDashboardStatsAction(),
        getAllUsersAction(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
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

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to remove this photograph?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    setImages((prev) => prev.filter((i) => i._id !== id));
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {/* Top Header */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-30 px-4 sm:px-6 py-3 sm:py-4">
        <div className="container flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link href="/" className="logo text-base sm:text-lg" style={{ whiteSpace: "nowrap" }}>
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--primary)]">
                <path d="M16 29V14" />
                <path d="M16 18c-5 0-9-3.5-9-9 5 0 9 3.5 9 9z" />
                <path d="M16 14c0-5 3.5-9 9-9 0 5-3.5 9-9 9z" />
              </svg>
              <span>Rahman Rehab<span className="hidden sm:inline">&nbsp;Admin</span></span>
            </Link>
            <span className="hidden md:inline-flex text-xs px-2.5 py-1 rounded-full bg-[var(--soft)] text-[var(--primary)] font-semibold whitespace-nowrap">
              CRUD &amp; KPI Portal
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <Link href="/" className="btn btn-ghost" style={{ padding: "0.4rem 0.6rem", fontSize: "0.78rem" }}>
              <span className="hidden sm:inline">View&nbsp;</span>Website
            </Link>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="btn btn-ghost text-red-500"
              aria-label="Logout"
              style={{ padding: "0.4rem 0.6rem", fontSize: "0.78rem" }}
            >
              <LogOut className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container flex-1 py-6 sm:py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-3 mb-6 sm:mb-8 border-b border-[var(--border)]">
          <button
            onClick={() => setActiveTab("kpis")}
            className={`btn ${activeTab === "kpis" ? "btn-primary" : "btn-ghost"}`}
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            <TrendingUp className="w-4 h-4 mr-1.5" />
            Dashboard KPIs
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
                  Registered Users
                </span>
                <b className="text-3xl font-serif text-[var(--primary)] block">
                  {stats?.totalUsers ?? users.length}
                </b>
                <span className="text-xs text-[var(--muted)] mt-2 block">Patient and family accounts</span>
              </div>
              <div className="card p-6">
                <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-1">
                  Website Visitors
                </span>
                <b className="text-3xl font-serif text-[var(--text)] block">
                  {(stats?.totalVisitors ?? 0).toLocaleString()}
                </b>
                <span className="text-xs text-[var(--muted)] mt-2 block">Tracked visits across the site</span>
              </div>
              <div className="card p-6">
                <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-1">
                  Center Photos
                </span>
                <b className="text-3xl font-serif text-[var(--text)] block">
                  {images.length}
                </b>
                <span className="text-xs text-[var(--muted)] mt-2 block">Gallery images published</span>
              </div>
              <div className="card p-6">
                <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider block mb-1">
                  Direct Enquiries
                </span>
                <b className="text-3xl font-serif text-[var(--primary)] block">
                  {enquiries.length}
                </b>
                <span className="text-xs text-[var(--muted)] mt-2 block">New patient messages</span>
              </div>
            </div>

            {/* Recent Enquiries */}
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--sans)" }}>
                Recent Patient Enquiries
              </h3>
              {enquiries.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">No enquiries submitted yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-[var(--muted)] text-xs uppercase">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Phone</th>
                        <th className="pb-3">Looking For</th>
                        <th className="pb-3">Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {enquiries.slice(0, 5).map((e, idx) => (
                        <tr key={idx}>
                          <td className="py-3 font-semibold">{e.name}</td>
                          <td className="py-3 font-mono">{e.phone}</td>
                          <td className="py-3 text-[var(--muted)]">{e.enquiryFor}</td>
                          <td className="py-3 text-[var(--muted)] max-w-[24rem] truncate">{e.message || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Users */}
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

        {/* Tab 3: Gallery */}
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

        {/* Tab 4: Enquiries */}
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
