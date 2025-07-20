// src/components/admin/Header.js
'use client'

export default function Header({ onLogout }) {
  return (
    <header className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-green-700">Desa Menur - Admin</h1>
      <button
        onClick={onLogout}
        className="text-sm text-red-600 hover:text-red-800 hover:underline transition"
      >
        Logout
      </button>
    </header>
  )
}
