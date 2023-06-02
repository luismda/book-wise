import { ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'

interface MetricRootProps {
  children: ReactNode
}

function MetricRoot({ children }: MetricRootProps) {
  return <div className="flex w-full items-center gap-5">{children}</div>
}

MetricRoot.displayName = 'Metric.Root'

interface MetricIconProps {
  children: ReactNode
}

function MetricIcon({ children }: MetricIconProps) {
  return <Slot className="h-8 w-8 text-green-100">{children}</Slot>
}

MetricIcon.displayName = 'Metric.Icon'

interface MetricContentProps {
  children: ReactNode
}

function MetricContent({ children }: MetricContentProps) {
  return <div>{children}</div>
}

MetricContent.displayName = 'Metric.Content'

interface MetricValueProps {
  children: ReactNode
}

function MetricValue({ children }: MetricValueProps) {
  return (
    <strong className="block leading-short text-gray-200">{children}</strong>
  )
}

MetricValue.displayName = 'Metric.Value'

interface MetricNameProps {
  children: ReactNode
}

function MetricName({ children }: MetricNameProps) {
  return <span className="text-sm leading-base text-gray-300">{children}</span>
}

export const Metric = {
  Root: MetricRoot,
  Icon: MetricIcon,
  Content: MetricContent,
  Value: MetricValue,
  Name: MetricName,
}
