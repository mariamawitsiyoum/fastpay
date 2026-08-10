import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { lookupCustomer, searchCustomersByName } from '../api/customers'
import FormInput from '../components/FormInput'
import PrimaryButton from '../components/PrimaryButton'
import Skeleton from '../components/Skeleton'

function CustomerCard({ data }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm p-4"
    >
      <p className="font-bold text-lg text-slate-800">{data.name}</p>
      <p className="text-slate-500 mb-3">{data.phone}</p>

      <div className="flex justify-between mb-1">
        <span className="text-slate-500">KYC Status</span>
        <span className={data.kyc_status === 'verified' ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
          {data.kyc_status}
        </span>
      </div>
      <div className="flex justify-between mb-1">
        <span className="text-slate-500">Daily Limit</span>
        <span className="text-slate-700">{data.daily_limit}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Used Today</span>
        <span className="text-slate-700">{data.used_today}</span>
      </div>
    </motion.div>
  )
}

function CustomerCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <Skeleton className="h-5 w-32 mb-2" />
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full" />
    </div>
  )
}

function CustomerLookup() {
  const [searchType, setSearchType] = useState('phone')
  const [inputValue, setInputValue] = useState('')
  const [searchTerm, setSearchTerm] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const phoneQuery = useQuery({
    queryKey: ['customer-lookup', searchTerm],
    queryFn: () => lookupCustomer(searchTerm),
    enabled: searchType === 'phone' && !!searchTerm,
  })

  const nameQuery = useQuery({
    queryKey: ['customer-search', searchTerm],
    queryFn: () => searchCustomersByName(searchTerm),
    enabled: searchType === 'name' && !!searchTerm,
  })

  function handleSearch(e) {
    e.preventDefault()
    setSelectedCustomer(null)
    setSearchTerm(inputValue)
  }

  function switchType(type) {
    setSearchType(type)
    setInputValue('')
    setSearchTerm(null)
    setSelectedCustomer(null)
  }

  const activeQuery = searchType === 'phone' ? phoneQuery : nameQuery

  return (
    <div className="p-8 bg-slate-50 min-h-full">
      <p className="text-sm text-sky-600 font-semibold uppercase tracking-wide">Agent Tools</p>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Customer Lookup</h1>

      <div className="max-w-md">
        <div className="flex gap-4 mb-4 text-sm">
          <button
            onClick={() => switchType('phone')}
            className={searchType === 'phone' ? 'font-bold text-sky-600 border-b-2 border-sky-600' : 'text-slate-500'}
          >
            Search by Phone
          </button>
          <button
            onClick={() => switchType('name')}
            className={searchType === 'name' ? 'font-bold text-sky-600 border-b-2 border-sky-600' : 'text-slate-500'}
          >
            Search by Name
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <FormInput
            label={searchType === 'phone' ? 'Customer Phone' : 'Customer Name'}
            type="text"
            placeholder={searchType === 'phone' ? 'e.g. 0911000000' : 'e.g. Hana'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <PrimaryButton type="submit" disabled={!inputValue || activeQuery.isFetching}>
            {activeQuery.isFetching ? 'Searching...' : 'Search'}
          </PrimaryButton>
        </form>

        {activeQuery.isFetching && <CustomerCardSkeleton />}

        {activeQuery.isError && !activeQuery.isFetching && (
          <p className="text-red-600">
            {activeQuery.error.response?.status === 404 ? 'Customer not found.' : 'Something went wrong.'}
          </p>
        )}

        {!activeQuery.isFetching && searchType === 'phone' && phoneQuery.data && (
          <CustomerCard data={phoneQuery.data} />
        )}

        {!activeQuery.isFetching && searchType === 'name' && nameQuery.data && !selectedCustomer && (
          <div className="space-y-2">
            {nameQuery.data.customers.length === 0 && (
              <p className="text-slate-500">No customers matched that name.</p>
            )}
            {nameQuery.data.customers.map((customer) => (
              <motion.button
                key={customer.id}
                whileHover={{ y: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedCustomer(customer)}
                className="w-full text-left bg-white rounded-xl shadow-sm p-3"
              >
                <p className="font-semibold text-slate-800">{customer.name}</p>
                <p className="text-sm text-slate-500">{customer.phone}</p>
              </motion.button>
            ))}
          </div>
        )}

        {!activeQuery.isFetching && searchType === 'name' && selectedCustomer && (
          <CustomerCard data={selectedCustomer} />
        )}
      </div>
    </div>
  )
}

export default CustomerLookup
/*Two separate pieces of state: phone (what's currently typed in the box) vs searchedPhone (what was actually last submitted). This separation matters — if we used phone directly as the query key, React Query would try to refetch on every keystroke, which we don't want. We only want to search when the form is submitted
enabled: !!searchedPhone — this tells React Query "don't run this query automatically at all until this condition is true." !!searchedPhone converts null → false and any real string → true. So the query stays dormant until the first search happens
isFetching (vs isLoading) — isFetching is true anytime a request is in-flight, including refetches, which fits a repeatable search button better
error.response?.status === 404 — per the contract, a customer-not-found is a 404 specifically, so we check for that status code to show a more helpful message than a generic error
Color-coded KYC status (green for verified, yellow otherwise) — a small visual cue that'll matter a lot once we build the actual transaction form next, since the agent needs to see this before deciding how much they can process */