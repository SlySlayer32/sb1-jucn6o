import { Frame } from '@nativescript/core';

export function navigate(page: string) {
    Frame.topmost().navigate({
        moduleName: page,
        clearHistory: true
    });
}