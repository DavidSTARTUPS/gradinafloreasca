import React, { ComponentProps } from "react"
import { getLocalTimeZone, today } from "@internationalized/date"
import {
  Button,
  CalendarCell as CalendarCellRac,
  CalendarGridBody as CalendarGridBodyRac,
  CalendarGridHeader as CalendarGridHeaderRac,
  CalendarGrid as CalendarGridRac,
  CalendarHeaderCell as CalendarHeaderCellRac,
  Calendar as CalendarRac,
  Heading as HeadingRac,
  RangeCalendar as RangeCalendarRac,
  composeRenderProps,
} from "react-aria-components"
import { ChevronLeft, ChevronRight } from "lucide-react"

// A simple utility to merge class names
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface BaseCalendarProps {
  className?: string
}

type CalendarProps = ComponentProps<typeof CalendarRac> & BaseCalendarProps
type RangeCalendarProps = ComponentProps<typeof RangeCalendarRac> &
  BaseCalendarProps

const CalendarHeader = () => (
  <header className="flex w-full items-center gap-1 pb-1">
    <Button
      slot="previous"
      className="flex size-7 items-center justify-center rounded-md text-gray-400 outline-offset-2 transition-colors hover:bg-white/10 hover:text-white focus:outline-none"
    >
      <ChevronLeft size={16} strokeWidth={2} />
    </Button>
    <HeadingRac className="grow text-center text-sm font-medium text-white" />
    <Button
      slot="next"
      className="flex size-7 items-center justify-center rounded-md text-gray-400 outline-offset-2 transition-colors hover:bg-white/10 hover:text-white focus:outline-none"
    >
      <ChevronRight size={16} strokeWidth={2} />
    </Button>
  </header>
)

const CalendarGridComponent = ({ isRange = false }: { isRange?: boolean }) => {
  const now = today(getLocalTimeZone())

  return (
    <CalendarGridRac className="border-collapse border-spacing-0">
      <CalendarGridHeaderRac>
        {(day) => (
          <CalendarHeaderCellRac className="size-7 rounded-md p-0 text-[10px] font-medium text-gray-400">
            {day}
          </CalendarHeaderCellRac>
        )}
      </CalendarGridHeaderRac>
      <CalendarGridBodyRac className="[&_td]:px-0">
        {(date) => (
          <CalendarCellRac
            date={date}
            className={cn(
              "relative flex size-7 items-center justify-center whitespace-nowrap rounded-md border border-transparent p-0 text-xs font-normal text-gray-200 outline-offset-2 duration-150 focus:outline-none data-[disabled]:pointer-events-none data-[unavailable]:pointer-events-none data-[hovered]:bg-white/10 data-[selected]:bg-brand-accent data-[selected]:text-white data-[unavailable]:line-through data-[disabled]:opacity-30 data-[unavailable]:opacity-30",
              // Range-specific styles
              isRange &&
                "data-[selected]:rounded-none data-[selection-end]:rounded-e-md data-[selection-start]:rounded-s-md data-[invalid]:bg-red-900/30 data-[selected]:bg-white/10 data-[selected]:text-white data-[invalid]:data-[selection-end]:[&:not([data-hover])]:bg-red-500 data-[invalid]:data-[selection-start]:[&:not([data-hover])]:bg-red-500 data-[selection-end]:[&:not([data-hover])]:bg-brand-accent data-[selection-start]:[&:not([data-hover])]:bg-brand-accent data-[invalid]:data-[selection-end]:[&:not([data-hover])]:text-white data-[invalid]:data-[selection-start]:[&:not([data-hover])]:text-white data-[selection-end]:[&:not([data-hover])]:text-white data-[selection-start]:[&:not([data-hover])]:text-white",
              // Today indicator styles
              date.compare(now) === 0 &&
                cn(
                  "after:pointer-events-none after:absolute after:bottom-[2px] after:start-1/2 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-full after:bg-brand-accent",
                  isRange
                    ? "data-[selection-end]:[&:not([data-hover])]:after:bg-[#1A1817] data-[selection-start]:[&:not([data-hover])]:after:bg-[#1A1817]"
                    : "data-[selected]:after:bg-white",
                ),
            )}
          />
        )}
      </CalendarGridBodyRac>
    </CalendarGridRac>
  )
}

const Calendar = ({ className, ...props }: CalendarProps) => {
  return (
    <CalendarRac
      {...props}
      className={composeRenderProps(className, (className) =>
        cn("w-fit p-2", className),
      )}
    >
      <CalendarHeader />
      <CalendarGridComponent />
    </CalendarRac>
  )
}

const RangeCalendar = ({ className, ...props }: RangeCalendarProps) => {
  return (
    <RangeCalendarRac
      {...props}
      className={composeRenderProps(className, (className) =>
        cn("w-fit p-2", className),
      )}
    >
      <CalendarHeader />
      <CalendarGridComponent isRange />
    </RangeCalendarRac>
  )
}

export { Calendar, RangeCalendar }