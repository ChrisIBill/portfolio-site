'use client'

import { Pagination, PaginationItemType, cn, usePagination } from "@nextui-org/react";
import React from "react";
import { SiteLinks } from '@/app/components/links'


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
                <>
                    {/* <button key={key} className={cn(className, "bg-default-700 min-w-8 w-8 h-8")} onClick={onNext}> */}
                    {/* <ChevronIcon className="rotate-180" /> */}
                    {/* </button> */}
                </>
            );
        }

        if (value === PaginationItemType.PREV) {
            return (
                <>
                    {/* <button key={key} className={cn(className, "bg-default-700 min-w-8 w-8 h-8")} onClick={onPrevious}> */}
                    {/* <ChevronIcon /> */}
                    {/* </button> */}
                </>
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
                    "pagination-button bg-gradient-to-br from-indigo-500 to-pink-500 ",
                    !isActive &&
                    "before:bg-default-900 before:opacity-50",
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
            total={3}
            initialPage={1}
            className="gap-2"
            radius="full"
            renderItem={renderItem}
            variant="light"
        />
    );
}
