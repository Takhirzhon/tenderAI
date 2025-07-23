(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

    "[project]/app/not-found.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
        "use strict";

        var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
        {
            __turbopack_context__.s({
                "default": () => NotFound
            });
            var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
            var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
            var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
            var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
            var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
            var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
            var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
            ;
            var _s = __turbopack_context__.k.signature();
            'use client';
            ;
            ;
            ;
            ;
            ;
            const updateMessages = [
                "Обновление знаний английского языка...",
                "Загрузка новых идиом...",
                "Оптимизация грамматических структур...",
                "Перезагрузка словарного запаса...",
                "Настройка произношения..."
            ];
            function NotFound() {
                _s();
                const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
                const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(updateMessages[0]);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
                    "NotFound.useEffect": () => {
                        const progressInterval = setInterval({
                            "NotFound.useEffect.progressInterval": () => {
                                setProgress({
                                    "NotFound.useEffect.progressInterval": (prevProgress) => {
                                        if (prevProgress >= 100) {
                                            clearInterval(progressInterval);
                                            return 100;
                                        }
                                        return prevProgress + 1;
                                    }
                                }["NotFound.useEffect.progressInterval"]);
                            }
                        }["NotFound.useEffect.progressInterval"], 200) // 20 seconds total
                            ;
                        const messageInterval = setInterval({
                            "NotFound.useEffect.messageInterval": () => {
                                setMessage(updateMessages[Math.floor(Math.random() * updateMessages.length)]);
                            }
                        }["NotFound.useEffect.messageInterval"], 4000) // Change message every 4 seconds
                            ;
                        const redirectTimer = setTimeout({
                            "NotFound.useEffect.redirectTimer": () => {
                                window.location.href = '/';
                            }
                        }["NotFound.useEffect.redirectTimer"], 20000) // Redirect after 20 seconds
                            ;
                        return ({
                            "NotFound.useEffect": () => {
                                clearInterval(progressInterval);
                                clearInterval(messageInterval);
                                clearTimeout(redirectTimer);
                            }
                        })["NotFound.useEffect"];
                    }
                }["NotFound.useEffect"], []);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-screen bg-[#00008B] text-white font-mono p-4 flex flex-col items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-md text-center",
                        children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "https://cone.red/wp-content/themes/cone-red/assets/images/logo.svg",
                            alt: "Toefl Assist Logo",
                            width: 80,
                            height: 80,
                            className: "mx-auto mb-8"
                        }, void 0, false, {
                            fileName: "[project]/app/not-found.tsx",
                            lineNumber: 50,
                            columnNumber: 9
                        }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold mb-4",
                            children: "Toefl Assist"
                        }, void 0, false, {
                            fileName: "[project]/app/not-found.tsx",
                            lineNumber: 58,
                            columnNumber: 9
                        }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-200 text-[#00008B] p-2 mb-6 inline-block",
                            children: "Ошибка - 404"
                        }, void 0, false, {
                            fileName: "[project]/app/not-found.tsx",
                            lineNumber: 60,
                            columnNumber: 9
                        }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].p, {
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            exit: {
                                opacity: 0,
                                y: -20
                            },
                            transition: {
                                duration: 0.5
                            },
                            className: "text-xl mb-8",
                            children: message
                        }, message, false, {
                            fileName: "[project]/app/not-found.tsx",
                            lineNumber: 64,
                            columnNumber: 9
                        }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full bg-white/20 rounded-full h-4 mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: "bg-white h-full rounded-full",
                                style: {
                                    width: "".concat(progress, "%")
                                },
                                initial: {
                                    width: 0
                                },
                                animate: {
                                    width: "".concat(progress, "%")
                                },
                                transition: {
                                    duration: 0.5
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/not-found.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/not-found.tsx",
                            lineNumber: 75,
                            columnNumber: 9
                        }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-lg mb-8",
                            children: [
                                progress,
                                "% завершено"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/not-found.tsx",
                            lineNumber: 85,
                            columnNumber: 9
                        }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center space-x-4 mb-8",
                            children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "bg-white text-[#00008B] px-4 py-2 rounded flex items-center",
                                    children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                        className: "mr-2 h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/app/not-found.tsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this),
                                        "Главная"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/not-found.tsx",
                                    lineNumber: 89,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/not-found.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: () => window.history.back(),
                                className: "bg-white text-[#00008B] px-4 py-2 rounded flex items-center",
                                children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/app/not-found.tsx",
                                    lineNumber: 98,
                                    columnNumber: 13
                                }, this),
                                    "Назад"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/not-found.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/not-found.tsx",
                            lineNumber: 87,
                            columnNumber: 9
                        }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm",
                            children: "Не выключайте компьютер. Это может занять некоторое время."
                        }, void 0, false, {
                            fileName: "[project]/app/not-found.tsx",
                            lineNumber: 103,
                            columnNumber: 9
                        }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-4 text-xs",
                            children: "Если вы случайно попали на эту страницу, не волнуйтесь. Мы автоматически вернем вас на главную через несколько секунд."
                        }, void 0, false, {
                            fileName: "[project]/app/not-found.tsx",
                            lineNumber: 107,
                            columnNumber: 9
                        }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-8 text-xs",
                            children: [
                                "Поддержка: ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://kobiljon.tech",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "underline",
                                    children: "Kobiljon.tech"
                                }, void 0, false, {
                                    fileName: "[project]/app/not-found.tsx",
                                    lineNumber: 113,
                                    columnNumber: 22
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/not-found.tsx",
                            lineNumber: 112,
                            columnNumber: 9
                        }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/not-found.tsx",
                        lineNumber: 49,
                        columnNumber: 7
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/not-found.tsx",
                    lineNumber: 48,
                    columnNumber: 5
                }, this);
            }
            _s(NotFound, "PPE0fRW7Gw017L8gbec3GxiVG58=");
            _c = NotFound;
            var _c;
            __turbopack_context__.k.register(_c, "NotFound");
            if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
                __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
            }
        }
    }),
}]);

//# sourceMappingURL=app_not-found_tsx_ed628e2a._.js.map