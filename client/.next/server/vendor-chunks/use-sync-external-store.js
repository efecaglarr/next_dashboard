"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/use-sync-external-store";
exports.ids = ["vendor-chunks/use-sync-external-store"];
exports.modules = {

/***/ "(ssr)/./node_modules/use-sync-external-store/cjs/use-sync-external-store-with-selector.development.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/use-sync-external-store/cjs/use-sync-external-store-with-selector.development.js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("/**\n * @license React\n * use-sync-external-store-with-selector.development.js\n *\n * Copyright (c) Meta Platforms, Inc. and affiliates.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n */\n\n\n true &&\n  (function () {\n    function is(x, y) {\n      return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);\n    }\n    \"undefined\" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&\n      \"function\" ===\n        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart &&\n      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());\n    var React = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js\"),\n      objectIs = \"function\" === typeof Object.is ? Object.is : is,\n      useSyncExternalStore = React.useSyncExternalStore,\n      useRef = React.useRef,\n      useEffect = React.useEffect,\n      useMemo = React.useMemo,\n      useDebugValue = React.useDebugValue;\n    exports.useSyncExternalStoreWithSelector = function (\n      subscribe,\n      getSnapshot,\n      getServerSnapshot,\n      selector,\n      isEqual\n    ) {\n      var instRef = useRef(null);\n      if (null === instRef.current) {\n        var inst = { hasValue: !1, value: null };\n        instRef.current = inst;\n      } else inst = instRef.current;\n      instRef = useMemo(\n        function () {\n          function memoizedSelector(nextSnapshot) {\n            if (!hasMemo) {\n              hasMemo = !0;\n              memoizedSnapshot = nextSnapshot;\n              nextSnapshot = selector(nextSnapshot);\n              if (void 0 !== isEqual && inst.hasValue) {\n                var currentSelection = inst.value;\n                if (isEqual(currentSelection, nextSnapshot))\n                  return (memoizedSelection = currentSelection);\n              }\n              return (memoizedSelection = nextSnapshot);\n            }\n            currentSelection = memoizedSelection;\n            if (objectIs(memoizedSnapshot, nextSnapshot))\n              return currentSelection;\n            var nextSelection = selector(nextSnapshot);\n            if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))\n              return (memoizedSnapshot = nextSnapshot), currentSelection;\n            memoizedSnapshot = nextSnapshot;\n            return (memoizedSelection = nextSelection);\n          }\n          var hasMemo = !1,\n            memoizedSnapshot,\n            memoizedSelection,\n            maybeGetServerSnapshot =\n              void 0 === getServerSnapshot ? null : getServerSnapshot;\n          return [\n            function () {\n              return memoizedSelector(getSnapshot());\n            },\n            null === maybeGetServerSnapshot\n              ? void 0\n              : function () {\n                  return memoizedSelector(maybeGetServerSnapshot());\n                }\n          ];\n        },\n        [getSnapshot, getServerSnapshot, selector, isEqual]\n      );\n      var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);\n      useEffect(\n        function () {\n          inst.hasValue = !0;\n          inst.value = value;\n        },\n        [value]\n      );\n      useDebugValue(value);\n      return value;\n    };\n    \"undefined\" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&\n      \"function\" ===\n        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop &&\n      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());\n  })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdXNlLXN5bmMtZXh0ZXJuYWwtc3RvcmUvY2pzL3VzZS1zeW5jLWV4dGVybmFsLXN0b3JlLXdpdGgtc2VsZWN0b3IuZGV2ZWxvcG1lbnQuanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVhO0FBQ2IsS0FBcUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixtQkFBTyxDQUFDLGlHQUFPO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksd0NBQXdDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUciLCJzb3VyY2VzIjpbIi9Vc2Vycy9lZmUvRGVza3RvcC9Db2RlL25leHRfZGFzaGJvYXJkL2NsaWVudC9ub2RlX21vZHVsZXMvdXNlLXN5bmMtZXh0ZXJuYWwtc3RvcmUvY2pzL3VzZS1zeW5jLWV4dGVybmFsLXN0b3JlLXdpdGgtc2VsZWN0b3IuZGV2ZWxvcG1lbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZSBSZWFjdFxuICogdXNlLXN5bmMtZXh0ZXJuYWwtc3RvcmUtd2l0aC1zZWxlY3Rvci5kZXZlbG9wbWVudC5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgTWV0YSBQbGF0Zm9ybXMsIEluYy4gYW5kIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgJiZcbiAgKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBpcyh4LCB5KSB7XG4gICAgICByZXR1cm4gKHggPT09IHkgJiYgKDAgIT09IHggfHwgMSAvIHggPT09IDEgLyB5KSkgfHwgKHggIT09IHggJiYgeSAhPT0geSk7XG4gICAgfVxuICAgIFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18gJiZcbiAgICAgIFwiZnVuY3Rpb25cIiA9PT1cbiAgICAgICAgdHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5yZWdpc3RlckludGVybmFsTW9kdWxlU3RhcnQgJiZcbiAgICAgIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5yZWdpc3RlckludGVybmFsTW9kdWxlU3RhcnQoRXJyb3IoKSk7XG4gICAgdmFyIFJlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpLFxuICAgICAgb2JqZWN0SXMgPSBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBPYmplY3QuaXMgPyBPYmplY3QuaXMgOiBpcyxcbiAgICAgIHVzZVN5bmNFeHRlcm5hbFN0b3JlID0gUmVhY3QudXNlU3luY0V4dGVybmFsU3RvcmUsXG4gICAgICB1c2VSZWYgPSBSZWFjdC51c2VSZWYsXG4gICAgICB1c2VFZmZlY3QgPSBSZWFjdC51c2VFZmZlY3QsXG4gICAgICB1c2VNZW1vID0gUmVhY3QudXNlTWVtbyxcbiAgICAgIHVzZURlYnVnVmFsdWUgPSBSZWFjdC51c2VEZWJ1Z1ZhbHVlO1xuICAgIGV4cG9ydHMudXNlU3luY0V4dGVybmFsU3RvcmVXaXRoU2VsZWN0b3IgPSBmdW5jdGlvbiAoXG4gICAgICBzdWJzY3JpYmUsXG4gICAgICBnZXRTbmFwc2hvdCxcbiAgICAgIGdldFNlcnZlclNuYXBzaG90LFxuICAgICAgc2VsZWN0b3IsXG4gICAgICBpc0VxdWFsXG4gICAgKSB7XG4gICAgICB2YXIgaW5zdFJlZiA9IHVzZVJlZihudWxsKTtcbiAgICAgIGlmIChudWxsID09PSBpbnN0UmVmLmN1cnJlbnQpIHtcbiAgICAgICAgdmFyIGluc3QgPSB7IGhhc1ZhbHVlOiAhMSwgdmFsdWU6IG51bGwgfTtcbiAgICAgICAgaW5zdFJlZi5jdXJyZW50ID0gaW5zdDtcbiAgICAgIH0gZWxzZSBpbnN0ID0gaW5zdFJlZi5jdXJyZW50O1xuICAgICAgaW5zdFJlZiA9IHVzZU1lbW8oXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmdW5jdGlvbiBtZW1vaXplZFNlbGVjdG9yKG5leHRTbmFwc2hvdCkge1xuICAgICAgICAgICAgaWYgKCFoYXNNZW1vKSB7XG4gICAgICAgICAgICAgIGhhc01lbW8gPSAhMDtcbiAgICAgICAgICAgICAgbWVtb2l6ZWRTbmFwc2hvdCA9IG5leHRTbmFwc2hvdDtcbiAgICAgICAgICAgICAgbmV4dFNuYXBzaG90ID0gc2VsZWN0b3IobmV4dFNuYXBzaG90KTtcbiAgICAgICAgICAgICAgaWYgKHZvaWQgMCAhPT0gaXNFcXVhbCAmJiBpbnN0Lmhhc1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRTZWxlY3Rpb24gPSBpbnN0LnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChpc0VxdWFsKGN1cnJlbnRTZWxlY3Rpb24sIG5leHRTbmFwc2hvdCkpXG4gICAgICAgICAgICAgICAgICByZXR1cm4gKG1lbW9pemVkU2VsZWN0aW9uID0gY3VycmVudFNlbGVjdGlvbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIChtZW1vaXplZFNlbGVjdGlvbiA9IG5leHRTbmFwc2hvdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50U2VsZWN0aW9uID0gbWVtb2l6ZWRTZWxlY3Rpb247XG4gICAgICAgICAgICBpZiAob2JqZWN0SXMobWVtb2l6ZWRTbmFwc2hvdCwgbmV4dFNuYXBzaG90KSlcbiAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRTZWxlY3Rpb247XG4gICAgICAgICAgICB2YXIgbmV4dFNlbGVjdGlvbiA9IHNlbGVjdG9yKG5leHRTbmFwc2hvdCk7XG4gICAgICAgICAgICBpZiAodm9pZCAwICE9PSBpc0VxdWFsICYmIGlzRXF1YWwoY3VycmVudFNlbGVjdGlvbiwgbmV4dFNlbGVjdGlvbikpXG4gICAgICAgICAgICAgIHJldHVybiAobWVtb2l6ZWRTbmFwc2hvdCA9IG5leHRTbmFwc2hvdCksIGN1cnJlbnRTZWxlY3Rpb247XG4gICAgICAgICAgICBtZW1vaXplZFNuYXBzaG90ID0gbmV4dFNuYXBzaG90O1xuICAgICAgICAgICAgcmV0dXJuIChtZW1vaXplZFNlbGVjdGlvbiA9IG5leHRTZWxlY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgaGFzTWVtbyA9ICExLFxuICAgICAgICAgICAgbWVtb2l6ZWRTbmFwc2hvdCxcbiAgICAgICAgICAgIG1lbW9pemVkU2VsZWN0aW9uLFxuICAgICAgICAgICAgbWF5YmVHZXRTZXJ2ZXJTbmFwc2hvdCA9XG4gICAgICAgICAgICAgIHZvaWQgMCA9PT0gZ2V0U2VydmVyU25hcHNob3QgPyBudWxsIDogZ2V0U2VydmVyU25hcHNob3Q7XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG1lbW9pemVkU2VsZWN0b3IoZ2V0U25hcHNob3QoKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbnVsbCA9PT0gbWF5YmVHZXRTZXJ2ZXJTbmFwc2hvdFxuICAgICAgICAgICAgICA/IHZvaWQgMFxuICAgICAgICAgICAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBtZW1vaXplZFNlbGVjdG9yKG1heWJlR2V0U2VydmVyU25hcHNob3QoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgIF07XG4gICAgICAgIH0sXG4gICAgICAgIFtnZXRTbmFwc2hvdCwgZ2V0U2VydmVyU25hcHNob3QsIHNlbGVjdG9yLCBpc0VxdWFsXVxuICAgICAgKTtcbiAgICAgIHZhciB2YWx1ZSA9IHVzZVN5bmNFeHRlcm5hbFN0b3JlKHN1YnNjcmliZSwgaW5zdFJlZlswXSwgaW5zdFJlZlsxXSk7XG4gICAgICB1c2VFZmZlY3QoXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpbnN0Lmhhc1ZhbHVlID0gITA7XG4gICAgICAgICAgaW5zdC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBbdmFsdWVdXG4gICAgICApO1xuICAgICAgdXNlRGVidWdWYWx1ZSh2YWx1ZSk7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICBcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fICYmXG4gICAgICBcImZ1bmN0aW9uXCIgPT09XG4gICAgICAgIHR5cGVvZiBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18ucmVnaXN0ZXJJbnRlcm5hbE1vZHVsZVN0b3AgJiZcbiAgICAgIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5yZWdpc3RlckludGVybmFsTW9kdWxlU3RvcChFcnJvcigpKTtcbiAgfSkoKTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/use-sync-external-store/cjs/use-sync-external-store-with-selector.development.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/use-sync-external-store/with-selector.js":
/*!***************************************************************!*\
  !*** ./node_modules/use-sync-external-store/with-selector.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nif (false) {} else {\n  module.exports = __webpack_require__(/*! ./cjs/use-sync-external-store-with-selector.development.js */ \"(ssr)/./node_modules/use-sync-external-store/cjs/use-sync-external-store-with-selector.development.js\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdXNlLXN5bmMtZXh0ZXJuYWwtc3RvcmUvd2l0aC1zZWxlY3Rvci5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixJQUFJLEtBQXFDLEVBQUUsRUFFMUMsQ0FBQztBQUNGLEVBQUUsK01BQXNGO0FBQ3hGIiwic291cmNlcyI6WyIvVXNlcnMvZWZlL0Rlc2t0b3AvQ29kZS9uZXh0X2Rhc2hib2FyZC9jbGllbnQvbm9kZV9tb2R1bGVzL3VzZS1zeW5jLWV4dGVybmFsLXN0b3JlL3dpdGgtc2VsZWN0b3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3VzZS1zeW5jLWV4dGVybmFsLXN0b3JlLXdpdGgtc2VsZWN0b3IucHJvZHVjdGlvbi5qcycpO1xufSBlbHNlIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy91c2Utc3luYy1leHRlcm5hbC1zdG9yZS13aXRoLXNlbGVjdG9yLmRldmVsb3BtZW50LmpzJyk7XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/use-sync-external-store/with-selector.js\n");

/***/ })

};
;