// app/(admin)/admin/login/layout.js
import '@/../styles/globals.css'

export const metadata = {
  title: 'Login Admin',
}

export default function LoginLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  )
}
