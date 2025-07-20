'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [berita, setBerita] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalData, setModalData] = useState(null)
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/laravel-api/api/v1/check-auth', {
          credentials: 'include',
          headers: { Accept: 'application/json' }
        })

        if (!res.ok) {
          router.replace('/login')
          return
        }

        const beritaRes = await fetch('/laravel-api/api/v1/berita', {
          credentials: 'include',
          headers: { Accept: 'application/json' }
        })

        if (beritaRes.ok) {
          const data = await beritaRes.json()
          setBerita(data)
        } else {
          throw new Error('Gagal ambil data berita')
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

    const handleDelete = async (id) => {
      if (!confirm('Yakin hapus berita ini?')) return;

      // Ambil cookie XSRF-TOKEN
      const getCookie = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
      };

      const csrfToken = getCookie('XSRF-TOKEN');

      const res = await fetch(`/laravel-api/api/v1/berita/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'X-XSRF-TOKEN': csrfToken,
        },
      });

      if (res.ok) {
        setBerita((prev) => prev.filter((b) => b.id !== id));
      } else {
        console.error('Gagal hapus berita:', res.status);
      }
    };

    const handleEditSubmit = async (e) => {
      e.preventDefault()

      const form = e.target
      const formData = new FormData(form)

      try {
        // Ambil CSRF cookie
        await fetch('/laravel-api/sanctum/csrf-cookie', {
          credentials: 'include'
        })

        // Ambil token dari cookie browser
        const getCookie = (name) => {
          const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
          if (match) return decodeURIComponent(match[2])
        }

        const xsrfToken = getCookie('XSRF-TOKEN')

        const res = await fetch(`/laravel-api/api/v1/berita/${modalData.id}`, {
          method: 'POST',
          headers: {
            'X-HTTP-Method-Override': 'PUT',
            'X-XSRF-TOKEN': xsrfToken,
            Accept: 'application/json'
            // ❗️Jangan set Content-Type kalau pakai FormData
          },
          credentials: 'include',
          body: formData
        })

        if (res.ok) {
          const updated = await res.json()
          setBerita((prev) =>
            prev.map((b) => (b.id === modalData.id ? updated.berita : b))
          )
          setModalData(null)
        } else {
          const err = await res.json()
          alert(`Gagal update: ${err.message || 'Unknown error'}`)
        }
      } catch (err) {
        console.error('Error updating:', err)
        alert('Terjadi kesalahan saat mengupdate.')
      }
    }

  if (loading) return <p className="p-6 text-gray-600">Memuat...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-800">Dashboard Berita</h1>
      {berita.length === 0 ? (
        <p className="text-gray-600">Belum ada berita.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {berita.map((item) => (
            <li key={item.id} className="bg-white rounded shadow p-4 border border-gray-100">
              <h2 className="font-semibold text-lg text-green-700">{item.judul}</h2>
              <p className="text-gray-700 mt-2 text-sm line-clamp-4">{item.isi}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setModalData(item)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Edit Berita</h2>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="judul"
                defaultValue={modalData.judul}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <textarea
                name="isi"
                defaultValue={modalData.isi}
                className="w-full mb-3 p-2 border rounded"
                rows="4"
                required
              ></textarea>
              <input
                type="file"
                name="gambar"
                className="mb-3"
                accept="image/*"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalData(null)}
                  className="px-3 py-1 text-sm bg-gray-300 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
