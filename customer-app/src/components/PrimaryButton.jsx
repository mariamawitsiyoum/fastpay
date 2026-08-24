import { motion } from 'framer-motion'

function PrimaryButton({ children, className = '', ...buttonProps }) {
  return (
    <motion.button
      {...buttonProps}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={`w-full bg-sky-500 text-white py-3 px-6 rounded-full hover:bg-sky-600 disabled:opacity-50 ${className}`}
    >
      {children}
    </motion.button>
  )
}

export default PrimaryButton