import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

("use client");
import {
  Shield,
  LayoutDashboard,
  UserPlus,
  Users,
  UserCheck,
  HeartPlus,
} from "lucide-react";

const Sidebar = ({ activeItem, handleItemClick, className = "" }) => {
  const user = useSelector((state) => state.auth.user);
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      section: "main",
    },
  ];

  const userManagementItems = [
    { id: "appointments", label: "Appointments", icon: HeartPlus, section: "user" },
    { id: "brands", label: "Brands", icon: UserPlus, section: "user" },
    { id: "commission", label: "Commission", icon: UserPlus, section: "user" },
    { id: "commission-settings", label: "Commission Settings", icon: UserPlus, section: "user" },
    { id: "create-user", label: "Create User", icon: UserPlus, section: "user" },
    { id: "doctor", label: "Doctor", icon: UserPlus, section: "user" },
    { id: "dr-availablities", label: "Dr Availablities", icon: UserPlus, section: "user" },
    { id: "finance", label: "Finance", icon: UserPlus, section: "user" },
    { id: "form", label: "Form", icon: UserPlus, section: "user" },
    { id: "lab-booking", label: "Lab Booking", icon: UserPlus, section: "user" },
    { id: "lab-results", label: "Lab Results", icon: UserPlus, section: "user" },
    { id: "labs-emp", label: "Labs Emp", icon: UserPlus, section: "user" },
    { id: "labs-test", label: "Labs Test", icon: UserPlus, section: "user" },
    { id: "medical", label: "Medical", icon: UserPlus, section: "user" },
    { id: "medicine", label: "Medicine", icon: UserPlus, section: "user" },
    { id: "medicine-purchases", label: "Medicine Purchases", icon: UserPlus, section: "user" },
    { id: "patients-list", label: "Patients List", icon: UserPlus, section: "user" },
    { id: "prescriptions", label: "Prescriptions", icon: UserPlus, section: "user" },
    { id: "receptions", label: "Receptions", icon: UserPlus, section: "user" },
    { id: "role-management", label: "Role Management", icon: UserCheck, section: "user" },
    { id: "supplier", label: "Supplier", icon: UserPlus, section: "user" },
    { id: "tax", label: "Tax", icon: UserPlus, section: "user" },
    { id: "tax-group", label: "Tax Group", icon: UserPlus, section: "user" },
    { id: "update-user", label: "Update User", icon: UserPlus, section: "user" },
    { id: "user", label: "User", icon: UserPlus, section: "user" },
    { id: "user-management", label: "User Management", icon: Users, section: "user" },
  ];

  const NavItem = ({ item, isActive, onClick }) => (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-gray-200 text-gray-900 font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <item.icon size={20} />
      <span className="text-sm">{item.label}</span>
    </button>
  );



  // Sidebar scroll position logic
  const navScrollRef = useRef(null);
  const lastScroll = useRef(0);

  // Save scroll position before activeItem changes
  useEffect(() => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollTop = lastScroll.current;
    }
  }, [activeItem]);

  const handleNavScroll = () => {
    if (navScrollRef.current) {
      lastScroll.current = navScrollRef.current.scrollTop;
    }
  };

  return (
    <div
      className={`bg-white border-r h-screen border-gray-200 flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation (scrollable) */}
      <div
        ref={navScrollRef}
        className="flex-1 p-4 space-y-6 overflow-y-auto"
        onScroll={handleNavScroll}
      >
        {/* Main Navigation */}
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
              onClick={handleItemClick}
            />
          ))}
        </div>

        {/* Management Section */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">
             MANAGEMENT SECTION
          </h3>
          <div className="space-y-2">
            {userManagementItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeItem === item.id}
                onClick={handleItemClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "GU"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-gray-500 truncate">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
