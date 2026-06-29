'use strict';

// src/theme/script.ts
var themeScript = `(function(){try{var t=localStorage.getItem("eg-theme");var preferred=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var theme=t||preferred||"dark";document.documentElement.classList.toggle("dark",theme==="dark");document.documentElement.setAttribute("data-theme",theme);}catch(e){}})();`;

exports.themeScript = themeScript;
//# sourceMappingURL=script.js.map
//# sourceMappingURL=script.js.map