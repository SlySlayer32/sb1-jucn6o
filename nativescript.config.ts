import { NativeScriptConfig } from '@nativescript/core';

export default {
    id: 'org.nativescript.cleaningapp',
    appPath: 'app',
    appResourcesPath: 'App_Resources',
    android: {
        v8Flags: '--expose_gc',
        markingMode: 'none',
        codeCache: true,
        suppressCallJSMethodExceptions: false
    },
    ios: {
        discardUncaughtJsExceptions: false,
        v8Flags: '--expose_gc'
    },
    useLibs: true,
    webpackConfigPath: 'webpack.config.js',
    cssParser: 'rework'
} as NativeScriptConfig;