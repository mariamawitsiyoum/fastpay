function FormInput({ label, required, ...inputProps }) {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...inputProps}
        className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-2"
      />
    </div>
  )
}

export default FormInput