import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface SortIconProps {
  direction: 'asc' | 'desc',
}

const SortIcon: React.FC<SortIconProps> = ({
    direction
}) => {
  const Icon = direction === 'asc' ? ChevronUpIcon : ChevronDownIcon
  
  return (
    <Icon aria-hidden="true" className="size-4 text-gray-400" strokeWidth={2.5} />
  )
}

export default SortIcon;