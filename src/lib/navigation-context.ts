import React from 'react';
import { InternalLinkType, InternalLinks } from '@/app/components/links';
import { createContext } from 'react';
import { AnimationStringType } from '@/app/components/navigation-provider';

export type NavigationDirection = 'next' | 'prev';

export interface NavigationContextType {
    animateNavigation: boolean;
    setAnimateNavigation: (value: boolean) => void;
    animationString: string;
    setAnimationString: (value: string) => void;
    currentPage: string;
    setCurrentPage: (value: string) => void;
    handleRouteChange: (direction?: NavigationDirection) => void;
    handleRouteRequest: (route: InternalLinkType) => void;
    swipePosition: number;
    setSwipePosition: (value: number) => void;
}

export const NavigationContext = createContext({
    animateNavigation: false,
    setAnimateNavigation: (value: boolean) => { },
    animationString: '',
    setAnimationString: (value: AnimationStringType) => { },
    currentPage: '/' as InternalLinkType,
    setCurrentPage: (value: InternalLinkType) => { },
    handleRouteChange: (direction?: NavigationDirection) => { },
    handleRouteRequest: (route: InternalLinkType) => { },
    swipePosition: 0,
    setSwipePosition: (value: number) => { },
});

// export interface GenericLoopingIterator<K, T extends readonly K[]> {
//     value: () => K;
//     previous: () => { value: K; done: boolean };
//     next: () => GenericLoopingIterator<K, T>;
// }
//
// export function makeGenericLoopingIterator<K, T extends readonly K[]>(list: T, start: (number | K) = 0, end = list.length - 1): GenericLoopingIterator<K, T> {
//     const begin = typeof start === 'number' ? start : list.indexOf(start);
//     let index = begin;
//     const value = list[begin];
//     return {
//         value: () => list[index],
//         previous: () => {
//             if (index > begin) {
//                 return {
//                     value: list[--index],
//                     done: false,
//                 };
//             } else {
//                 return {
//                     value: list[end],
//                 };
//             }
//         },
//         next: () => {
//             if (index < list.length) {
//                 return {
//                     value: list[index++],
//                 };
//             } else {
//                 return {
//                     value: list[begin],
//                 };
//             }
//         },
//     };
// }
