// src/components/Admin/AdminLayout.js
import React from 'react';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      {/* Только контент без Navbar и Footer */}
      {children}
    </div>
  );
};

export default AdminLayout;