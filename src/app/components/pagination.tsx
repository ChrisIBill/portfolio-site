'use client'

import { Pagination, PaginationItemType, cn, usePagination } from "@nextui-org/react";
import React, { useContext, useEffect, useRef } from "react";
import { InternalLinkType, InternalLinks, InternalLinksType, SiteLinks } from '@/app/components/links'
import { FaChevronRight as ChevronRight, FaChevronLeft as ChevronLeft } from "react-icons/fa";
import { NavigationContext } from "@/lib/navigation-context";
import logger from "@/lib/pino";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";


const CustomPaginationLog = logger.child({ module: 'CustomPagination' })
export default function CustomPagination() {
    //const { currentPage, setPage } = usePages();
    const pathname = usePathname()
    const pageIndex = InternalLinks.indexOf(pathname as InternalLinkType) + 1
    console.log('CustomPagination', { pageIndex })

    const renderItem = ({
        ref,
        key,
        value,
        isActive,
        onNext,
        onPrevious,
        setPage,
        className,
    }: any) => {

        CustomPaginationLog.debug({ message: 'renderItem', key, value, isActive, onNext, onPrevious, setPage, className })
        if (value === PaginationItemType.NEXT) {
            return (
                <button key={key} className={cn("min-w-8 w-8 h-8", className)} onClick={onNext}>
                    <ChevronRight className='text-default-900' />
                </button>
            );
        }
        else if (value === PaginationItemType.PREV) {
            return (
                <button key={key} className={cn(className, "min-w-8 w-8 h-8")} onClick={onPrevious}>
                    <ChevronLeft className='text-default-900' />
                </button>
            );
        }
        else if (value === PaginationItemType.DOTS) {
            return <button key={key} className={className}>...</button>;
        }
        if (value === pageIndex) {
            return <PaginationItem
                key={key}
                className={className}
                value={value}
                isActive={isActive}
                setPage={setPage}
                type='active'
            />
        }
        if (value === pageIndex + 1 || (pageIndex === InternalLinks.length && value === 1)) {
            return <PaginationItem
                key={key}
                className={className}
                value={value}
                isActive={isActive}
                setPage={setPage}
                type='next'
            >next</PaginationItem>
        }
        if (value === pageIndex - 1 || (pageIndex === 1 && value === InternalLinks.length)) {
            return <PaginationItem
                key={key}
                className={className}
                value={value}
                isActive={isActive}
                setPage={setPage}
                type='prev'

            >prev</PaginationItem>
        }

        // cursor is the default item
        return (
            <button
                key={key}
                ref={ref}
                className={cn(
                    className,
                    `pagination-button bg-gradient-to-br from-blue-500 to-purple-600 before:bg-default-900`,
                    isActive &&
                    `text-white font-bold `,
                    onNext && 'bg-default-500',
                )}
                onClick={() => setPage(value)}
            >
            </button>
        );
    };

    return (
        <Pagination
            disableCursorAnimation
            showControls
            page={pageIndex}
            // onChange={(page) => setPage(page)}
            loop
            total={3}
            className="fixed bottom-4 h-16 flex justify-center gap-2 w-full box-border m-0"
            radius="full"
            renderItem={renderItem}
            variant="light"
        />
    );
}



interface PaginationItemProps {
    value: number
    className: string
    isActive: boolean
    setPage: (page: number) => void
    type: 'next' | 'prev' | 'active'
    children?: React.ReactNode
}
const PaginationItem: React.FC<PaginationItemProps> = (props: any) => {
    const { swipePosition, handleRouteRequest } = useContext(NavigationContext);
    const indicatorPosition = (Math.min(Math.max(swipePosition, -100), 100)) / 200
    const { theme } = useTheme()
    const [backgroundColor, setBackgrounColor] = React.useState('rgba(253, 255, 204, 0)')


    const { value, className, isActive, setPage, type } = props
    const [opacity, setOpacity] = React.useState(0)
    //CustomPaginationLog.debug({ message: 'PaginationItem', type })
    useEffect(() => {
        if (props.type === 'active') {
            setOpacity(1 - Math.abs(indicatorPosition * 0.5))
        }
        else if (props.type === 'next' && indicatorPosition > 0) {
            setOpacity(.5 + indicatorPosition)
        }
        else if (props.type === 'prev' && indicatorPosition < 0) {
            setOpacity(.5 + Math.abs(indicatorPosition))
        }
        else setOpacity(.5)
    }, [indicatorPosition, props.type])

    const handleClick = () => {
        handleRouteRequest(InternalLinks[props.value - 1])
    }
    useEffect(() => {
        setBackgrounColor(theme === 'dark' ? `rgba(253, 255, 204, ${1 - opacity})` : `rgba(24, 24, 27, ${1 - opacity})`)
    }, [theme, opacity])

    return (
        <button
            className={cn(
                className,
                `pagination-button bg-gradient-to-br from-blue-500 to-purple-600 `,
                isActive &&
                `text-white font-bold`,
            )}
            style={{
                boxShadow: (!isActive && Math.abs(opacity) > 0.5) ? `0 0 10px 0 rgba(253, 255, 204, ${opacity})` : '',
            }}
            onClick={handleClick}
        >
            <div style={{
                width: `100%`,
                height: `100%`,
                backgroundColor: backgroundColor,
            }}></div>
        </button>
    )
}
//after:bg-default-900 after:opacity-${opacity}
