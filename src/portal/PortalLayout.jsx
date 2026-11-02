
import React, { useCallback, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import powertekLogo from "../assets/logo.png";
import "./portal.css";

const PortalLayout = ({ profile }) => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(true);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    navigate("/login", { replace: true });
  };

  // ==========================================
  // USER ROLE
  // ==========================================

  const role = profile?.role;

  const isAdmin = role === "admin";
  const isEmployee = role === "employee";
  const isCustomer = role === "customer";

  // ==========================================
  // NAVIGATION ACTIVE CLASS
  // ==========================================

  const navClass = ({ isActive }) =>
    isActive ? "active" : "";

  // ==========================================
  // ROLE LABELS
  // ==========================================

  const roleLabel = {
    admin: "Administrator",
    employee: "Employee",
    customer: "Customer",
  };

  const accessLabel = {
    admin: "ADMINISTRATOR ACCESS",
    employee: "EMPLOYEE WORKSPACE",
    customer: "CUSTOMER WORKSPACE",
  };

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  const fetchNotifications = useCallback(async (userId) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("recipient_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("Notification fetch failed:", error.message);
      return;
    }

    setNotifications(data || []);
    setUnreadCount(
      (data || []).filter((item) => !item.is_read).length
    );
  }, []);

  // ==========================================
  // LOAD + REALTIME NOTIFICATIONS
  // ==========================================

  useEffect(() => {
    let channel;
    let isMounted = true;

    const setupNotifications = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user || !isMounted) {
        setNotificationLoading(false);
        return;
      }

      const userId = profile?.id || user.id;

      await fetchNotifications(userId);

      if (!isMounted) return;

      channel = supabase
        .channel(`notifications-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `recipient_id=eq.${userId}`,
          },
          () => {
            fetchNotifications(userId);
          }
        )
        .subscribe();

      setNotificationLoading(false);
    };

    setupNotifications();

    return () => {
      isMounted = false;

      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [profile?.id, fetchNotifications]);

  // ==========================================
  // MARK ONE NOTIFICATION AS READ
  // ==========================================

  const markAsRead = async (notification) => {
    if (!notification.is_read) {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notification.id);

      if (error) {
        console.error("Could not mark notification as read:", error.message);
        return;
      }

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id
            ? { ...item, is_read: true }
            : item
        )
      );

      setUnreadCount((previous) => Math.max(0, previous - 1));
    }

    setShowNotifications(false);

    if (notification.link) {
      navigate(notification.link);
    }
  };

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(
      (item) => !item.is_read
    );

    if (unreadNotifications.length === 0) return;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("recipient_id", profile?.id || user.id)
      .eq("is_read", false);

    if (error) {
      console.error("Could not mark all as read:", error.message);
      return;
    }

    setNotifications((previous) =>
      previous.map((item) => ({ ...item, is_read: true }))
    );

    setUnreadCount(0);
  };

  // ==========================================
  // FORMAT NOTIFICATION DATE
  // ==========================================

  const formatNotificationDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ==========================================
  // MAIN LAYOUT
  // ==========================================

  return (
    <div className="portal-layout">

      {/* SIDEBAR */}

      <aside className="portal-sidebar">

        {/* COMPANY BRANDING */}

        <div className="portal-brand">
          <img
            src={powertekLogo}
            alt="Powertek Engineering Enterprise"
            className="portal-brand-logo"
          />

          <div className="portal-brand-copy">
            <h2>Powertek</h2>
            <p>Business Portal</p>
          </div>
        </div>

        {/* USER INFORMATION */}

        <div className="portal-user">
          <span className="portal-user-label">
            {accessLabel[role] || "PORTAL ACCESS"}
          </span>

          <strong className="portal-user-name">
            {profile?.full_name || "Portal User"}
          </strong>

          <span className="portal-role-badge">
            {roleLabel[role] || "User"}
          </span>
        </div>

        {/* NAVIGATION */}

        <nav
          className="portal-nav"
          aria-label="Portal navigation"
        >

          <NavLink to="/" end className={navClass}>
            Dashboard
          </NavLink>

          {/* ADMIN NAVIGATION */}

          {isAdmin && (
            <>
              <NavLink to="/employees" className={navClass}>
                Employees
              </NavLink>

              <NavLink to="/customers" className={navClass}>
                Customers & Leads
              </NavLink>

              <NavLink to="/projects" className={navClass}>
                Solar Projects
              </NavLink>

              <NavLink to="/site-visits" className={navClass}>
                Site Visit Reports
              </NavLink>

              <NavLink to="/documents" className={navClass}>
                Document Management
              </NavLink>

              <NavLink to="/tasks" className={navClass}>
                Task Management
              </NavLink>

              <NavLink to="/attendance" className={navClass}>
                Attendance & Leave
              </NavLink>
            </>
          )}

          
  {/* EMPLOYEE NAVIGATION */}

  {isEmployee && (
    <>
      <NavLink to="/tasks" className={navClass}>
        My Tasks
      </NavLink>

      <NavLink to="/site-visits" className={navClass}>
        Site Visit Reports
      </NavLink>

      <NavLink to="/attendance" className={navClass}>
        Attendance & Leave
      </NavLink>
    </>
  )}

          {/* CUSTOMER NAVIGATION */}

          {isCustomer && (
            <>
              <div className="portal-nav-heading">
                MY SOLAR ACCOUNT
              </div>

              <NavLink to="/projects" className={navClass}>
                My Solar Project
              </NavLink>

              <span className="portal-nav-coming">
                Documents — Coming soon
              </span>

              <span className="portal-nav-coming">
                Quotations & Payments — Coming soon
              </span>
            </>
          )}

        </nav>

        {/* SIGN OUT */}

        <button
          type="button"
          className="portal-signout"
          onClick={handleLogout}
        >
          Sign out
        </button>

      </aside>

      {/* MAIN CONTENT */}

      <main className="portal-main">

        {/* TOP BAR */}

        <div className="portal-topbar">

          <div className="portal-topbar-heading">
            <span>POWERTEK ENGINEERING ENTERPRISE</span>
          </div>

          {/* NOTIFICATION BELL */}

          <div className="notification-wrapper">

            <button
              type="button"
              className="notification-bell"
              onClick={() =>
                setShowNotifications((previous) => !previous)
              }
              aria-label="Open notifications"
              aria-expanded={showNotifications}
            >
              <span className="notification-bell-icon">🔔</span>

              {unreadCount > 0 && (
                <span className="notification-count">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN */}

            {showNotifications && (
              <div className="notification-dropdown">

                <div className="notification-header">
                  <div>
                    <h3>Notifications</h3>
                    <p>
                      {unreadCount} unread notification
                      {unreadCount === 1 ? "" : "s"}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="notification-close"
                    onClick={() => setShowNotifications(false)}
                    aria-label="Close notifications"
                  >
                    ×
                  </button>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="notification-mark-all"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}

                <div className="notification-list">

                  {notificationLoading ? (
                    <div className="notification-empty">
                      Loading notifications...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="notification-empty">
                      <span>🔔</span>
                      <strong>You're all caught up!</strong>
                      <p>No notifications yet.</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        type="button"
                        key={notification.id}
                        className={`notification-item ${
                          !notification.is_read ? "unread" : ""
                        }`}
                        onClick={() => markAsRead(notification)}
                      >
                        <span className="notification-item-icon">
                          {notification.type === "task"
                            ? "📋"
                            : notification.type === "project"
                            ? "☀️"
                            : notification.type === "employee"
                            ? "👤"
                            : "🔔"}
                        </span>

                        <span className="notification-item-content">
                          <strong>{notification.title}</strong>

                          <span>{notification.message}</span>

                          <small>
                            {formatNotificationDate(
                              notification.created_at
                            )}
                          </small>
                        </span>

                        {!notification.is_read && (
                          <span className="notification-unread-dot" />
                        )}
                      </button>
                    ))
                  )}

                </div>

              </div>
            )}

          </div>

        </div>

        <Outlet />

      </main>

    </div>
  );
};

export default PortalLayout;
