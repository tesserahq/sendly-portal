export const getStatusBadgeProps = (status?: boolean) => {
  if (status) {
    return { className: 'border-green-500 text-green-600' }
  }

  return { className: 'border-gray-500 text-gray-600' }
}
