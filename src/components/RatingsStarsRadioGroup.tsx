import * as RadioGroup from '@radix-ui/react-radio-group'
import { Star } from 'phosphor-react'

interface RatingsStarsRadioGroupProps extends RadioGroup.RadioGroupProps {}

export function RatingsStarsRadioGroup(props: RatingsStarsRadioGroupProps) {
  return (
    <RadioGroup.Root className="flex items-center gap-1" {...props}>
      {Array.from({ length: 5 }).map((_, i) => {
        const currentValueIsLowerThanSelectedValue =
          props.value && i + 1 < Number(props.value)

        const currentValueIsLowerThanDefaultValue =
          props.defaultValue && i + 1 < Number(props.defaultValue)

        return (
          <RadioGroup.Item
            key={i}
            value={String(i + 1)}
            aria-label={`${i + 1} ${i + 1 === 1 ? 'estrela' : 'estrelas'}`}
            className="group relative leading-[0] outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Star
              className="h-7 w-7 text-purple-100 transition-colors hover:text-purple-100/80 group-focus:text-purple-100/80 group-disabled:hover:text-purple-100"
              weight={
                currentValueIsLowerThanSelectedValue ||
                currentValueIsLowerThanDefaultValue
                  ? 'fill'
                  : 'regular'
              }
            />

            <RadioGroup.Indicator className="absolute inset-0 z-10">
              <Star
                weight="fill"
                className="h-7 w-7 text-purple-100 group-focus:text-purple-100/75"
              />
            </RadioGroup.Indicator>
          </RadioGroup.Item>
        )
      })}
    </RadioGroup.Root>
  )
}
