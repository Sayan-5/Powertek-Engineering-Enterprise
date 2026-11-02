import React, { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import { supabase } from "../lib/supabase";

import "./dashboard-enhancements.css";



const ADMIN_STATS = [

  {

    key: "employees",

    title: "Total Employees",

    description: "Active team members",

    icon: "👥",

    tone: "blue",

  },

  {

    key: "customers",

    title: "Customer Leads",

    description: "Registered customers",

    icon: "🎯",

    tone: "violet",

  },

  {

    key: "activeProjects",

    title: "Active Projects",

    description: "Projects in progress",

    icon: "☀️",

    tone: "amber",

  },

  {

    key: "pendingTasks",

    title: "Pending Tasks",

    description: "Tasks awaiting action",

    icon: "📋",

    tone: "green",

  },

];



const OPERATIONS = [

  {

    title: "Employee Management",

    description: "View and manage your company team.",

    icon: "👨‍💼",

    link: "/employees",

    tone: "blue",

  },

  {

    title: "Customer Management",

    description: "Manage customer details and leads.",

    icon: "🤝",

    link: "/customers",

    tone: "violet",

  },

  {

    title: "Project Operations",

    description: "Monitor solar projects and progress.",

    icon: "🛠️",

    link: "/projects",

    tone: "amber",

  },

  {

    title: "Task Management",

    description: "Create and track work assignments.",

    icon: "📝",

    link: "/tasks",

    tone: "green",

  },

];



function Dashboard({ profile }) {

  const role = profile?.role;



  const [liveCounts, setLiveCounts] = useState({

    employees: 0,

    customers: 0,

    activeProjects: 0,

    pendingTasks: 0,

  });



  const [customerData, setCustomerData] = useState({

    projects: 0,

    projectStatus: "Pending",

  });



  const [employeeCounts, setEmployeeCounts] = useState({

    myTasks: 0,

    completedTasks: 0,

    attendance: 0,

  });



  const [analytics, setAnalytics] = useState({

    monthlyCustomers: [],

    projectStatuses: [],

    taskStatuses: [],

  });



  const [recentActivities, setRecentActivities] = useState([]);



  const [loading, setLoading] = useState(true);

  const [fetchError, setFetchError] = useState("");



  useEffect(() => {

    let isMounted = true;



    const fetchDashboardData = async () => {

      if (!role) {

        setLoading(false);

        return;

      }



      setLoading(true);

      setFetchError("");



      try {

        if (role === "admin") {

          const sixMonthsAgo = new Date();

          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

          sixMonthsAgo.setDate(1);

          const analyticsStart = sixMonthsAgo.toISOString();



          const [employees, customers, projects, tasks, customerHistory, projectHistory, taskHistory, recentProfiles, recentProjects, recentTasks] = await Promise.all([

            supabase

              .from("profiles")

              .select("id", { count: "exact", head: true })

              .eq("role", "employee")

              .eq("status", "active"),



            supabase

              .from("profiles")

              .select("id", { count: "exact", head: true })

              .eq("role", "customer"),



            supabase

              .from("projects")

              .select("id", { count: "exact", head: true })

              .eq("status", "In Progress"),



            supabase

              .from("tasks")

              .select("id", { count: "exact", head: true })

              .eq("status", "Pending"),



            supabase

              .from("profiles")

              .select("created_at")

              .eq("role", "customer")

              .gte("created_at", analyticsStart),



            supabase

              .from("projects")

              .select("created_at, status")

              .gte("created_at", analyticsStart),



            supabase

              .from("tasks")

              .select("created_at, status")

              .gte("created_at", analyticsStart),



            supabase

              .from("profiles")

              .select("full_name, role, created_at")

              .order("created_at", { ascending: false })

              .limit(6),



            supabase

              .from("projects")

              .select("project_name, status, created_at")

              .order("created_at", { ascending: false })

              .limit(6),



            supabase

              .from("tasks")

              .select("title, status, created_at")

              .order("created_at", { ascending: false })

              .limit(6),

          ]);



          if (!isMounted) return;



          const errors = [

            employees.error,

            customers.error,

            projects.error,

            tasks.error,

            customerHistory.error,

            projectHistory.error,

            taskHistory.error,

            recentProfiles.error,

            recentProjects.error,

            recentTasks.error,

          ].filter(Boolean);



          if (errors.length) {

            console.error("Admin dashboard errors:", errors);

            setFetchError(

              "Some dashboard figures could not be loaded. Check your Supabase table permissions and policies."

            );

          }



          setLiveCounts({

            employees: employees.error ? null : employees.count ?? 0,

            customers: customers.error ? null : customers.count ?? 0,

            activeProjects: projects.error ? null : projects.count ?? 0,

            pendingTasks: tasks.error ? null : tasks.count ?? 0,

          });



          const monthKeys = Array.from({ length: 6 }, (_, index) => {

            const date = new Date();

            date.setDate(1);

            date.setMonth(date.getMonth() - (5 - index));

            return {

              key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,

              label: date.toLocaleDateString("en-IN", { month: "short" }),

              count: 0,

            };

          });



          const monthlyCustomers = monthKeys.map((month) => ({

            ...month,

            count: (customerHistory.data || []).filter((item) => {

              if (!item.created_at) return false;

              const date = new Date(item.created_at);

              const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

              return key === month.key;

            }).length,

          }));



          const countStatuses = (rows) => {

            const totals = new Map();

            (rows || []).forEach((item) => {

              const label = (item.status || "Unknown").trim();

              totals.set(label, (totals.get(label) || 0) + 1);

            });

            return Array.from(totals, ([label, count]) => ({ label, count }));

          };



          setAnalytics({

            monthlyCustomers,

            projectStatuses: countStatuses(projectHistory.data),

            taskStatuses: countStatuses(taskHistory.data),

          });



          const activityItems = [

            ...(recentProfiles.data || []).map((item) => ({

              type: item.role === "customer" ? "Customer registered" : item.role === "employee" ? "Employee registered" : "Profile created",

              title: item.full_name || "New profile",

              detail: item.role ? `Role: ${item.role}` : "New profile",

              createdAt: item.created_at,

              icon: item.role === "customer" ? "🤝" : "👤",

              tone: "blue",

            })),

            ...(recentProjects.data || []).map((item) => ({

              type: "Project created",

              title: item.project_name || "Untitled project",

              detail: `Status: ${item.status || "Unknown"}`,

              createdAt: item.created_at,

              icon: "☀️",

              tone: "amber",

            })),

            ...(recentTasks.data || []).map((item) => ({

              type: "Task created",

              title: item.title || "Untitled task",

              detail: `Status: ${item.status || "Unknown"}`,

              createdAt: item.created_at,

              icon: "📋",

              tone: "green",

            })),

          ]

            .filter((item) => item.createdAt)

            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

            .slice(0, 8);



          setRecentActivities(activityItems);

        }



        if (role === "employee") {

          if (!profile?.id) {

            setEmployeeCounts({

              myTasks: null,

              completedTasks: null,

              attendance: null,

            });

          } else {

            const [myTasks, completedTasks, attendance, pendingReports] = await Promise.all([

              supabase

                .from("tasks")

                .select("id", { count: "exact", head: true })

                .eq("assigned_to", profile.id),



              supabase

                .from("tasks")

                .select("id", { count: "exact", head: true })

                .eq("assigned_to", profile.id)

                .eq("status", "Completed"),



              supabase

                .from("attendance")

                .select("id", { count: "exact", head: true })

                .eq("employee_id", profile.id),

              supabase
                .from("site_visits")
                .select("id", { count: "exact", head: true })
                .eq("employee_id", profile.id)
                .eq("status", "Report Pending"),

            ]);



            if (!isMounted) return;



            const employeeErrors = [

              myTasks.error,

              completedTasks.error,

              attendance.error,
              pendingReports.error,

            ].filter(Boolean);



            if (employeeErrors.length) {

              console.error("Employee dashboard errors:", employeeErrors);

              setFetchError(

                "Some employee dashboard figures could not be loaded. Check your Supabase table permissions and policies."

              );

            }



            setEmployeeCounts({

              myTasks: myTasks.error ? null : myTasks.count ?? 0,

              completedTasks: completedTasks.error

                ? null

                : completedTasks.count ?? 0,

              attendance: attendance.error ? null : attendance.count ?? 0,
              pendingReports: pendingReports.error
                ? null
                : pendingReports.count ?? 0,
            });

          }

        }



        if (role === "customer") {

          if (!profile?.id) {

            setCustomerData({ projects: 0, projectStatus: "Pending" });

            return;

          }



          const { data, error } = await supabase

            .from("projects")

            .select("id, status")

            .eq("customer_id", profile.id);



          if (!isMounted) return;



          if (error) {

            console.error("Customer dashboard error:", error);

            setFetchError(

              "Unable to load your solar project information."

            );

            setCustomerData({

              projects: 0,

              projectStatus: "Unavailable",

            });

          } else {

            const customerProjects = data || [];

            const statuses = [

              ...new Set(

                customerProjects.map((project) => project.status).filter(Boolean)

              ),

            ];



            const projectStatus =

              customerProjects.length === 0

                ? "Pending"

                : statuses.length === 1

                  ? statuses[0]

                  : statuses.length > 1

                    ? "Multiple"

                    : "Pending";



            setCustomerData({

              projects: customerProjects.length,

              projectStatus,

            });

          }

        }

      } catch (error) {

        console.error("Dashboard error:", error);

        if (isMounted) {

          setFetchError("Unable to load dashboard data. Please try again.");

        }

      } finally {

        if (isMounted) setLoading(false);

      }

    };



    fetchDashboardData();



    return () => {

      isMounted = false;

    };

  }, [role, profile?.id]);



  const today = useMemo(

    () =>

      new Intl.DateTimeFormat("en-IN", {

        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric",

      }).format(new Date()),

    []

  );



  const headings = {

    admin: "Business Dashboard",

    employee: "Employee Dashboard",

    customer: "My Solar Dashboard",

  };



  const subtitles = {

    admin: "Here's what's happening across your business today.",

    employee: "Your daily workspace and activities at a glance.",

    customer: "Stay updated on your solar project and services.",

  };



  const adminStats = ADMIN_STATS.map((stat) => ({

    ...stat,

    value: loading

      ? "..."

      : liveCounts[stat.key] === null

        ? "N/A"

        : liveCounts[stat.key],

  }));



  const employeeStats = [

    {

      title: "My Tasks",

      value: loading

        ? "..."

        : employeeCounts.myTasks === null

          ? "N/A"

          : employeeCounts.myTasks,

      description: "Your assigned work",

      icon: "📋",

      tone: "blue",

    },

    {

      title: "Completed Tasks",

      value: loading

        ? "..."

        : employeeCounts.completedTasks === null

          ? "N/A"

          : employeeCounts.completedTasks,

      description: "Successfully completed",

      icon: "✅",

      tone: "green",

    },

    {

      title: "Attendance",

      value: loading

        ? "..."

        : employeeCounts.attendance === null

          ? "N/A"

          : employeeCounts.attendance,

      description: "Attendance records",

      icon: "🕒",

      tone: "violet",

    },

    {

      title: "Pending Reports",

      value: loading
        ? "..."
        : employeeCounts.pendingReports === null
          ? "N/A"
          : employeeCounts.pendingReports,

      description: "Assigned site visit reports awaiting submission",

      icon: "📄",

      tone: "amber",

    },

  ];



  const customerStats = [

    {

      title: "My Projects",

      value: loading ? "..." : customerData.projects,

      description: "Registered solar projects",

      icon: "☀️",

      tone: "amber",

    },

    {

      title: "Project Status",

      value: loading ? "..." : customerData.projectStatus,

      description: "Current installation status",

      icon: "📊",

      tone: "blue",

    },

    {

      title: "Documents",

      value: "—",

      description: "Document module not configured",

      icon: "📁",

      tone: "violet",

    },

    {

      title: "Payments",

      value: "—",

      description: "Payment module not configured",

      icon: "💳",

      tone: "green",

    },

  ];



  const statsByRole = {

    admin: adminStats,

    employee: employeeStats,

    customer: customerStats,

  };



  const currentStats = statsByRole[role] || [];



  return (

    <main className="pw-dashboard">

      <section className="pw-dashboard-hero">

        <div className="pw-dashboard-hero-copy">

          <div className="pw-dashboard-eyebrow">

            <span className="pw-live-dot" />

            POWERTEK ENGINEERING ENTERPRISE

          </div>



          <h1>{headings[role] || "Dashboard"}</h1>



          <p>

            Welcome back, <strong>{profile?.full_name || "User"}</strong>.{" "}

            {subtitles[role] || "Welcome to your company portal."}

          </p>



          <div className="pw-dashboard-meta">

            <span>📅 {today}</span>

            <span className="pw-meta-divider" />

            <span>

              {role === "customer"

                ? "Customer workspace"

                : role === "employee"

                  ? "Employee workspace"

                  : "Business operations"}

            </span>

          </div>

        </div>



        <div className="pw-hero-mark" aria-hidden="true">

          <div className="pw-sun-core">☀</div>

          <span className="pw-sun-orbit pw-orbit-one" />

          <span className="pw-sun-orbit pw-orbit-two" />

          <span className="pw-hero-caption">POWERING PROGRESS</span>

        </div>

      </section>



      {fetchError && (

        <div className="pw-dashboard-alert" role="alert">

          <span>⚠️</span>

          <p>{fetchError}</p>

        </div>

      )}



      <section className="pw-dashboard-section">

        <div className="pw-section-heading">

          <div>

            <span className="pw-section-kicker">AT A GLANCE</span>

            <h2>Overview</h2>

            <p>Your key numbers and business indicators.</p>

          </div>

          <span className="pw-data-status">

            <span className="pw-live-dot" />

            {loading ? "Updating data" : "Dashboard overview"}

          </span>

        </div>



        <div className="pw-stats-grid">

          {currentStats.map((stat, index) => (

            <article

              className={`pw-stat-card pw-tone-${stat.tone}`}

              key={stat.title}

              style={{ "--card-index": index }}

            >

              <div className="pw-stat-top">

                <span className="pw-stat-icon">{stat.icon}</span>

                <span className="pw-stat-arrow" aria-hidden="true">

                  ↗

                </span>

              </div>



              <p className="pw-stat-title">{stat.title}</p>

              <h3 className="pw-stat-value">{stat.value}</h3>

              <p className="pw-stat-description">{stat.description}</p>

            </article>

          ))}

        </div>

      </section>



      {role === "admin" && (

        <section className="pw-dashboard-section pw-analytics-section">

          <div className="pw-section-heading">

            <div>

              <span className="pw-section-kicker">BUSINESS INSIGHTS</span>

              <h2>Business Analytics</h2>

              <p>Activity from the last six months, based on saved records.</p>

            </div>

            <span className="pw-data-status">Last 6 months</span>

          </div>



          <div className="pw-analytics-grid">

            <article className="pw-analytics-card pw-customer-chart">

              <div className="pw-analytics-card-heading">

                <div>

                  <h3>Customer registrations</h3>

                  <p>New customer profiles by month</p>

                </div>

                <span className="pw-chart-icon">👥</span>

              </div>



              {loading ? (

                <p className="pw-chart-empty">Loading analytics...</p>

              ) : analytics.monthlyCustomers.length ? (

                <div className="pw-bar-chart" role="img" aria-label="Monthly customer registrations">

                  {analytics.monthlyCustomers.map((month) => {

                    const max = Math.max(1, ...analytics.monthlyCustomers.map((item) => item.count));

                    const height = month.count === 0 ? 4 : Math.max(10, (month.count / max) * 100);

                    return (

                      <div className="pw-bar-column" key={month.key}>

                        <strong>{month.count}</strong>

                        <div className="pw-bar-track">

                          <span className="pw-bar-fill" style={{ height: `${height}%` }} />

                        </div>

                        <small>{month.label}</small>

                      </div>

                    );

                  })}

                </div>

              ) : (

                <p className="pw-chart-empty">No customer registrations found in this period.</p>

              )}

            </article>



            <article className="pw-analytics-card">

              <div className="pw-analytics-card-heading">

                <div>

                  <h3>Project status</h3>

                  <p>Projects created in the last six months</p>

                </div>

                <span className="pw-chart-icon">☀️</span>

              </div>



              {loading ? (

                <p className="pw-chart-empty">Loading analytics...</p>

              ) : analytics.projectStatuses.length ? (

                <div className="pw-status-list">

                  {analytics.projectStatuses.map((item) => {

                    const total = analytics.projectStatuses.reduce((sum, row) => sum + row.count, 0);

                    const percent = total ? (item.count / total) * 100 : 0;

                    return (

                      <div className="pw-status-row" key={item.label}>

                        <div className="pw-status-label">

                          <span>{item.label}</span>

                          <strong>{item.count}</strong>

                        </div>

                        <div className="pw-status-track">

                          <span style={{ width: `${percent}%` }} />

                        </div>

                      </div>

                    );

                  })}

                </div>

              ) : (

                <p className="pw-chart-empty">No project records found in this period.</p>

              )}

            </article>



            <article className="pw-analytics-card pw-task-analytics">

              <div className="pw-analytics-card-heading">

                <div>

                  <h3>Task status</h3>

                  <p>Tasks created in the last six months</p>

                </div>

                <span className="pw-chart-icon">📋</span>

              </div>



              {loading ? (

                <p className="pw-chart-empty">Loading analytics...</p>

              ) : analytics.taskStatuses.length ? (

                <div className="pw-task-status-grid">

                  {analytics.taskStatuses.map((item) => (

                    <div className="pw-task-status-item" key={item.label}>

                      <strong>{item.count}</strong>

                      <span>{item.label}</span>

                    </div>

                  ))}

                </div>

              ) : (

                <p className="pw-chart-empty">No task records found in this period.</p>

              )}

            </article>

          </div>

        </section>

      )}



      {role === "admin" && (

        <section className="pw-dashboard-section">

          <div className="pw-section-heading">

            <div>

              <span className="pw-section-kicker">LIVE UPDATES</span>

              <h2>Recent Activities</h2>

              <p>The latest registrations, projects and tasks recorded in your portal.</p>

            </div>

          </div>



          <div className="pw-activity-card">

            {loading ? (

              <p className="pw-chart-empty">Loading recent activities...</p>

            ) : recentActivities.length ? (

              <div className="pw-activity-list">

                {recentActivities.map((activity, index) => (

                  <article className="pw-activity-item" key={`${activity.type}-${activity.createdAt}-${index}`}>

                    <span className={`pw-activity-icon pw-activity-${activity.tone}`}>

                      {activity.icon}

                    </span>

                    <div className="pw-activity-copy">

                      <strong>{activity.title}</strong>

                      <span>{activity.type} · {activity.detail}</span>

                    </div>

                    <time dateTime={activity.createdAt}>

                      {new Date(activity.createdAt).toLocaleString("en-IN", {

                        day: "numeric",

                        month: "short",

                        year: "numeric",

                        hour: "2-digit",

                        minute: "2-digit",

                      })}

                    </time>

                  </article>

                ))}

              </div>

            ) : (

              <div className="pw-activity-empty">

                <span>🗂️</span>

                <strong>No recent activities yet</strong>

                <p>New employee, customer, project and task records will appear here.</p>

              </div>

            )}

          </div>

        </section>

      )}



      {role === "admin" && (

        <section className="pw-dashboard-section">

          <div className="pw-section-heading">

            <div>

              <span className="pw-section-kicker">WORKSPACE</span>

              <h2>Business Operations</h2>

              <p>Access the important areas of your company portal.</p>

            </div>

          </div>



          <div className="pw-operations-grid">

            {OPERATIONS.map((item) => (

              <Link

                to={item.link}

                className={`pw-operation-card pw-operation-${item.tone}`}

                key={item.title}

              >

                <span className="pw-operation-icon">{item.icon}</span>

                <div className="pw-operation-copy">

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                </div>

                <span className="pw-operation-arrow">→</span>

              </Link>

            ))}

          </div>

        </section>

      )}



      {role === "employee" && (

        <section className="pw-dashboard-section">

          <div className="pw-section-heading">

            <div>

              <span className="pw-section-kicker">YOUR WORKSPACE</span>

              <h2>Daily Activities</h2>

              <p>Continue with your assigned work and attendance.</p>

            </div>

          </div>



          <div className="pw-operations-grid">

            <Link to="/tasks" className="pw-operation-card pw-operation-blue">

              <span className="pw-operation-icon">📋</span>

              <div className="pw-operation-copy">

                <h3>My Tasks</h3>

                <p>View and manage your assigned work.</p>

              </div>

              <span className="pw-operation-arrow">→</span>

            </Link>



            <Link

              to="/attendance"

              className="pw-operation-card pw-operation-green"

            >

              <span className="pw-operation-icon">🕒</span>

              <div className="pw-operation-copy">

                <h3>Attendance</h3>

                <p>View your attendance and leave records.</p>

              </div>

              <span className="pw-operation-arrow">→</span>

            </Link>

          </div>

        </section>

      )}



      {role === "customer" && (

        <section className="pw-dashboard-section">

          <div className="pw-section-heading">

            <div>

              <span className="pw-section-kicker">CUSTOMER WORKSPACE</span>

              <h2>My Solar Services</h2>

              <p>Your personal Powertek customer workspace.</p>

            </div>

          </div>



          <div className="pw-operations-grid">

            <Link

              to="/projects"

              className="pw-operation-card pw-operation-amber"

            >

              <span className="pw-operation-icon">☀️</span>

              <div className="pw-operation-copy">

                <h3>My Solar Project</h3>

                <p>View your solar project information.</p>

              </div>

              <span className="pw-operation-arrow">→</span>

            </Link>



            <article className="pw-operation-card pw-operation-violet">

              <span className="pw-operation-icon">📄</span>

              <div className="pw-operation-copy">

                <h3>My Documents</h3>

                <p>Access your project documents.</p>

                <small>Document access coming soon</small>

              </div>

            </article>

          </div>

        </section>

      )}



      <footer className="pw-dashboard-footer">

        <span>© {new Date().getFullYear()} POWERTEK ENGINEERING ENTERPRISE</span>

        <span>Reliable Energy. Smarter Operations.</span>

      </footer>

    </main>

  );

}



export default Dashboard;
