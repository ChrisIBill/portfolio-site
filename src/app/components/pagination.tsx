'use client'

import { Pagination, PaginationItemType, cn, usePagination } from "@nextui-org/react";
import React from "react";
import { SiteLinks } from '@/app/components/links'
import { FaChevronRight as ChevronRight, FaChevronLeft as ChevronLeft } from "react-icons/fa";


export default function CustomPagination() {
    //const { currentPage, setPage } = usePages();
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
        if (value === PaginationItemType.NEXT) {
            return (
                <button key={key} className={cn("min-w-8 w-8 h-8", className)} onClick={onNext}>
                    <ChevronRight className='text-default-900' />
                </button>
            );
        }

        if (value === PaginationItemType.PREV) {
            return (
                <button key={key} className={cn(className, "min-w-8 w-8 h-8")} onClick={onPrevious}>
                    <ChevronLeft className='text-default-900' />
                </button>
            );
        }

        if (value === PaginationItemType.DOTS) {
            return <button key={key} className={className}>...</button>;
        }

        // cursor is the default item
        return (
            <button
                key={key}
                ref={ref}
                className={cn(
                    className,
                    "pagination-button bg-gradient-to-br from-blue-500 to-purple-600 before:bg-default-900 before:opacity-0",
                    !isActive &&
                    "before:opacity-50",
                    isActive &&
                    "text-white font-bold",
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
            // currentPage={currentPage}
            // onChange={(page) => setPage(page)}
            loop
            total={3}
            initialPage={1}
            className="flex justify-center gap-2"
            radius="full"
            renderItem={renderItem}
            variant="light"
        />
    );
}
