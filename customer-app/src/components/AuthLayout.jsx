function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold text-sky-600">
            fastPAY<span className="text-sky-400">ET</span>
          </h1>
        </div>
        {title && <h2 className="text-xl font-bold mb-6 text-center">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
export default AuthLayout