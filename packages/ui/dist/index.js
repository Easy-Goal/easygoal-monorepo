'use strict';

var client = require('@easygoal/packages/auth/client');
var lucideReact = require('lucide-react');
var react = require('react');
var jsxRuntime = require('react/jsx-runtime');
var reactSlot = require('@radix-ui/react-slot');
var classVarianceAuthority = require('class-variance-authority');
var clsx = require('clsx');
var tailwindMerge = require('tailwind-merge');

// src/components/Header/Header.tsx
var TEXT_COLOR = {
  dark: "#FAFAFA",
  light: "#09090B"
};
var ACCENT = "#F97316";
function Logo({ variant = "dark", width = 133, className }) {
  const height = Math.round(width * 37 / 133);
  const textColor = TEXT_COLOR[variant];
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width,
      height,
      viewBox: "0 0 133 37",
      fill: "none",
      className,
      "aria-label": "Easy Goal",
      role: "img",
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            d: "M14.2363 1.38989V6.70458H5.67242V11.9898H13.8772V17.2947H5.67242V22.6388H14.2363V27.9535H0V1.38989H14.2363Z",
            fill: textColor
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            d: "M15.7135 25.9103C14.2632 24.228 13.5403 22.165 13.5403 19.7213C13.5403 17.2728 14.2632 15.1999 15.7135 13.5029C17.1616 11.8083 19.0033 10.9585 21.2386 10.9585C23.2875 10.9585 24.9796 11.6437 26.3125 13.0117V11.4399H31.6535V27.9537H26.3678V26.0872H26.3125C24.9796 27.6541 23.2875 28.4351 21.2386 28.4351C19.0033 28.4351 17.1616 27.5951 15.7135 25.9103ZM20.2533 16.9117C19.5581 17.6387 19.2128 18.572 19.2128 19.7115C19.2128 20.8511 19.5443 21.7819 20.2073 22.5015C20.8749 23.2162 21.7543 23.5723 22.8409 23.5723C23.8838 23.5723 24.7425 23.2088 25.4193 22.4818C26.0938 21.75 26.4322 20.8265 26.4322 19.7115C26.4322 18.572 26.0846 17.6387 25.3917 16.9117C24.6964 16.1848 23.847 15.8213 22.8409 15.8213C21.8142 15.8213 20.9532 16.1848 20.2533 16.9117Z",
            fill: textColor
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            d: "M39.1585 10.9585C40.0471 10.9585 40.9219 11.0666 41.7829 11.2827C42.6485 11.4939 43.2931 11.7051 43.7167 11.9212L44.3521 12.2454L42.6025 15.9785C41.3915 15.2908 40.2451 14.947 39.1585 14.947C38.5553 14.947 38.1294 15.0206 37.8785 15.1631C37.6253 15.3006 37.501 15.5634 37.501 15.949C37.501 16.035 37.5102 16.1209 37.5286 16.2044C37.5516 16.2904 37.593 16.3714 37.6483 16.45C37.7082 16.5237 37.7634 16.5851 37.8141 16.6367C37.8693 16.6907 37.9545 16.7496 38.0719 16.8135C38.1939 16.8798 38.2883 16.9289 38.3574 16.9608C38.431 16.9952 38.5461 17.0444 38.7073 17.1082C38.8661 17.1671 38.9858 17.2138 39.0664 17.2457C39.1516 17.2801 39.2897 17.3292 39.4808 17.3931C39.6696 17.4594 39.8146 17.5012 39.9136 17.5208C40.5398 17.7173 41.0831 17.9334 41.5435 18.1692C42.0085 18.405 42.4966 18.7267 43.0076 19.1319C43.5233 19.5396 43.9216 20.0529 44.2047 20.6743C44.4856 21.2981 44.6283 22.0078 44.6283 22.806C44.6283 26.5587 42.1812 28.4351 37.2892 28.4351C36.1842 28.4351 35.1344 28.2533 34.1399 27.8948C33.1454 27.5288 32.4225 27.1629 31.9759 26.7945L31.3129 26.2149L33.4861 22.3247C33.6518 22.4696 33.8636 22.6464 34.1215 22.8551C34.3839 23.059 34.8581 23.3365 35.5396 23.6902C36.2256 24.0438 36.8195 24.2207 37.3168 24.2207C38.4264 24.2207 38.9835 23.8252 38.9835 23.032C38.9835 22.666 38.8408 22.3811 38.5599 22.1773C38.2768 21.9759 37.7979 21.745 37.1234 21.4896C36.4466 21.2293 35.9194 20.9886 35.5396 20.7725C34.575 20.2371 33.8107 19.6305 33.2466 18.9551C32.6803 18.2822 32.3995 17.3833 32.3995 16.2634C32.3995 14.5933 33.0072 13.2941 34.2227 12.3633C35.4429 11.4276 37.0889 10.9585 39.1585 10.9585Z",
            fill: textColor
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            d: "M56.1746 11.4387H62.335L50.1706 36.3225H44.0194L49.3603 25.3787L42.0211 11.4387H48.1816L52.5004 19.9069L56.1746 11.4387Z",
            fill: textColor
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            d: "M88.6132 13.0794V18.846C87.9686 21.997 86.5597 24.3842 84.3865 26.0076C82.2179 27.6261 79.7961 28.4341 77.121 28.4341C73.7553 28.4341 70.8915 27.0956 68.5295 24.4161C66.1652 21.7318 64.9843 18.4899 64.9843 14.6905C64.9843 10.8273 66.1399 7.56581 68.4559 4.90601C70.7695 2.2413 73.6586 0.907715 77.121 0.907715C81.159 0.907715 84.3589 2.42058 86.7163 5.44632L83.0053 9.79828C81.6723 7.51915 79.8214 6.37959 77.4525 6.37959C75.7029 6.37959 74.2066 7.19251 72.968 8.81589C71.7341 10.4344 71.1171 12.3918 71.1171 14.6905C71.1171 16.9451 71.7341 18.8706 72.968 20.467C74.2066 22.0658 75.7029 22.864 77.4525 22.864C78.9006 22.864 80.1621 22.3998 81.2372 21.469C82.31 20.5333 82.8487 19.293 82.8487 17.7458H77.121V13.0794H88.6132Z",
            fill: textColor
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            d: "M110.938 25.9103C109.488 24.228 108.765 22.165 108.765 19.7213C108.765 17.2728 109.488 15.1999 110.938 13.5029C112.387 11.8083 114.228 10.9585 116.464 10.9585C118.512 10.9585 120.205 11.6437 121.537 13.0117V11.4399H126.878V27.9537H121.593V26.0872H121.537C120.205 27.6541 118.512 28.4351 116.464 28.4351C114.228 28.4351 112.387 27.5951 110.938 25.9103ZM115.478 16.9117C114.783 17.6387 114.438 18.572 114.438 19.7115C114.438 20.8511 114.769 21.7819 115.432 22.5015C116.1 23.2162 116.979 23.5723 118.066 23.5723C119.109 23.5723 119.967 23.2088 120.644 22.4818C121.319 21.75 121.657 20.8265 121.657 19.7115C121.657 18.572 121.31 17.6387 120.617 16.9117C119.921 16.1848 119.072 15.8213 118.066 15.8213C117.039 15.8213 116.178 16.1848 115.478 16.9117Z",
            fill: textColor
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            d: "M127.659 27.9528V0.269287H133V27.9528H127.659Z",
            fill: textColor
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            d: "M102.456 31.0726C109.003 29.1078 110.605 21.7301 108.929 15.3643C107.235 8.96896 102.272 3.60515 95.7243 5.56992C89.1863 7.53468 87.6024 14.8731 89.2968 21.2684C90.9727 27.6342 95.9177 33.0373 102.456 31.0726ZM103.109 10.0398C104.242 9.70574 105.421 9.88257 105.771 11.2284C106.922 15.5804 99.0854 25.414 95.0889 26.6125C93.9563 26.9564 92.796 26.7304 92.4369 25.3846C91.2858 21.0326 99.1222 11.2481 103.109 10.0398Z",
            fill: ACCENT
          }
        )
      ]
    }
  );
}
function formatTimeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 6e4);
  const hours = Math.floor(diff / 36e5);
  const days = Math.floor(diff / 864e5);
  if (mins < 1) return "Agora";
  if (mins < 60) return `${mins}min`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return new Date(dateString).toLocaleDateString("pt-BR");
}
var S = {
  wrap: {
    position: "relative"
  },
  btn: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "inherit",
    padding: 0
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ef4444",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
    lineHeight: 1
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "calc(100% + 8px)",
    width: 320,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "hsl(220 45% 17%)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    zIndex: 100,
    overflow: "hidden"
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: 600,
    margin: 0,
    color: "hsl(0 0% 100%)"
  },
  markAllBtn: {
    fontSize: 11,
    color: "hsl(18 100% 62%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0
  },
  list: {
    maxHeight: 360,
    overflowY: "auto"
  },
  empty: {
    padding: "24px 16px",
    textAlign: "center",
    fontSize: 13,
    color: "rgba(255,255,255,0.4)"
  },
  item: (isUnread) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "10px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    backgroundColor: isUnread ? "rgba(249,115,22,0.06)" : "transparent",
    cursor: "pointer",
    textDecoration: "none"
  }),
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    backgroundColor: "hsl(18 100% 62%)",
    flexShrink: 0,
    marginTop: 5
  },
  itemContent: {
    flex: 1,
    minWidth: 0
  },
  itemTitle: (isUnread) => ({
    fontSize: 13,
    fontWeight: isUnread ? 600 : 400,
    color: "hsl(0 0% 100%)",
    margin: 0,
    lineHeight: 1.4
  }),
  itemMsg: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    margin: "2px 0 0",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },
  itemTime: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
    margin: "3px 0 0"
  },
  actions: {
    display: "flex",
    gap: 2,
    flexShrink: 0,
    marginTop: 1
  },
  actionBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 3,
    borderRadius: 4,
    color: "rgba(255,255,255,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  footer: {
    padding: "8px 16px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    textAlign: "center"
  },
  footerLink: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    textDecoration: "none"
  }
};
var BellIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }),
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })
] });
var CheckIcon = () => /* @__PURE__ */ jsxRuntime.jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntime.jsx("polyline", { points: "20 6 9 17 4 12" }) });
var TrashIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntime.jsx("polyline", { points: "3 6 5 6 21 6" }),
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M19 6l-1 14H6L5 6" }),
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M10 11v6M14 11v6" }),
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M9 6V4h6v2" })
] });
function NotificationBell({
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onDelete,
  allNotificationsUrl
}) {
  const [isOpen, setIsOpen] = react.useState(false);
  const ref = react.useRef(null);
  const unread = notifications.filter((n) => !n.readAt);
  const unreadCount = unread.length;
  react.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: S.wrap, ref, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        style: S.btn,
        onClick: () => setIsOpen((o) => !o),
        "aria-label": `Notifica\xE7\xF5es${unreadCount > 0 ? ` (${unreadCount} n\xE3o lidas)` : ""}`,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(BellIcon, {}),
          unreadCount > 0 && /* @__PURE__ */ jsxRuntime.jsx("span", { style: S.badge, children: unreadCount > 9 ? "9+" : unreadCount })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxRuntime.jsxs("div", { style: S.dropdown, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: S.dropdownHeader, children: [
        /* @__PURE__ */ jsxRuntime.jsx("p", { style: S.dropdownTitle, children: "Notifica\xE7\xF5es" }),
        unreadCount > 0 && onMarkAllRead && /* @__PURE__ */ jsxRuntime.jsx("button", { style: S.markAllBtn, onClick: () => onMarkAllRead(), children: "Marcar todas como lidas" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: S.list, children: notifications.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx("p", { style: S.empty, children: "Nenhuma notifica\xE7\xE3o" }) : notifications.slice(0, 10).map((n) => {
        const isUnread = !n.readAt;
        const inner = /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          isUnread && /* @__PURE__ */ jsxRuntime.jsx("span", { style: S.dot }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { style: S.itemContent, children: [
            /* @__PURE__ */ jsxRuntime.jsx("p", { style: S.itemTitle(isUnread), children: n.title }),
            /* @__PURE__ */ jsxRuntime.jsx("p", { style: S.itemMsg, children: n.message }),
            /* @__PURE__ */ jsxRuntime.jsx("p", { style: S.itemTime, children: formatTimeAgo(n.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { style: S.actions, children: [
            isUnread && onMarkRead && /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                style: S.actionBtn,
                title: "Marcar como lida",
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMarkRead(n.id);
                },
                children: /* @__PURE__ */ jsxRuntime.jsx(CheckIcon, {})
              }
            ),
            onDelete && /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                style: S.actionBtn,
                title: "Remover",
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(n.id);
                },
                children: /* @__PURE__ */ jsxRuntime.jsx(TrashIcon, {})
              }
            )
          ] })
        ] });
        return n.actionUrl ? /* @__PURE__ */ jsxRuntime.jsx("a", { href: n.actionUrl, style: S.item(isUnread), onClick: () => setIsOpen(false), children: inner }, n.id) : /* @__PURE__ */ jsxRuntime.jsx("div", { style: S.item(isUnread), onClick: () => {
          if (isUnread && onMarkRead) onMarkRead(n.id);
        }, children: inner }, n.id);
      }) }),
      allNotificationsUrl && notifications.length > 10 && /* @__PURE__ */ jsxRuntime.jsx("div", { style: S.footer, children: /* @__PURE__ */ jsxRuntime.jsx("a", { href: allNotificationsUrl, style: S.footerLink, onClick: () => setIsOpen(false), children: "Ver todas as notifica\xE7\xF5es" }) })
    ] })
  ] });
}
function HeaderUserMenu({ config }) {
  const { user, isReady } = client.useEgSession();
  const { logout } = client.useSSOLogin({
    ssoUrl: config.ssoUrl,
    apiKey: config.apiKey
  });
  const { notifications, markAsRead, markAllAsRead, dismiss } = client.useNotifications({
    path: config.notificationsPath ?? "/api/notifications"
  });
  const [isOpen, setIsOpen] = react.useState(false);
  const containerRef = react.useRef(null);
  const getAppUrl = (path) => {
    const baseUrl = config.appUrl || "https://app.easygoal.com.br";
    return `${baseUrl}${path}`;
  };
  if (!isReady || !user) return null;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      NotificationBell,
      {
        notifications,
        onMarkRead: markAsRead,
        onMarkAllRead: markAllAsRead,
        onDelete: dismiss,
        allNotificationsUrl: getAppUrl("/notifications")
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: containerRef, className: "relative", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "flex items-center gap-2 px-2 py-1.5 transition-colors hover:bg-white/5 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-8 w-8 rounded-full border border-orange-500/20 bg-orange-500/10 overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntime.jsx("img", { src: user.avatarUrl ?? "", className: "h-full w-full object-cover", alt: "" }) }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "hidden sm:block text-white/90 text-sm font-medium", children: user.name?.split(" ")[0] }),
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { className: "h-4 w-4 text-white/30" })
      ] }),
      isOpen && /* CORREÇÃO DE TRANSPARÊNCIA: Adicionado bg sólido e shadow pesado */
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "absolute right-0 top-full z-[100] mt-2 w-64 rounded-xl border border-white/10 bg-[#1e2536] p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.7)]", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "px-3 py-3 border-b border-white/5", children: [
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "truncate text-sm font-semibold text-white", children: user.name }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "truncate text-[11px] text-white/40", children: user.email })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "py-1", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("a", { href: getAppUrl("/dashboard"), className: "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/5", children: [
            /* @__PURE__ */ jsxRuntime.jsx(lucideReact.LayoutDashboard, { className: "h-4 w-4 opacity-50" }),
            " Painel Principal"
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("a", { href: getAppUrl("/settings/profile"), className: "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/5", children: [
            /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Settings, { className: "h-4 w-4 opacity-50" }),
            " Editar Perfil"
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("a", { href: config.docsUrl || "https://docs.easygoal.com.br", target: "_blank", className: "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/5", children: [
            /* @__PURE__ */ jsxRuntime.jsx(lucideReact.BookOpen, { className: "h-4 w-4 opacity-50" }),
            " Documenta\xE7\xE3o"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "border-t border-white/5 pt-1", children: /* @__PURE__ */ jsxRuntime.jsxs("button", { onClick: logout, className: "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-400/10", children: [
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.LogOut, { className: "h-4 w-4" }),
          " Sair da conta"
        ] }) })
      ] })
    ] })
  ] });
}
function EasyHeader({
  logoSuffix,
  logoVariant = "dark",
  navLinks = [],
  ctaSlot,
  className,
  config
}) {
  const { user, isReady } = client.useEgSession();
  const [scrolled, setScrolled] = react.useState(false);
  react.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsx("header", { className: `fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled ? "bg-[#0d1117]/95 backdrop-blur-md border-b border-white/5" : "bg-transparent"} ${className}`, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("a", { href: "/", className: "flex items-center gap-3 no-underline shrink-0 mr-4", children: [
      /* @__PURE__ */ jsxRuntime.jsx(Logo, { variant: logoVariant, width: 108 }),
      logoSuffix && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center gap-2 font-mono text-sm border-l border-white/10 pl-3", children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: "opacity-40", children: logoSuffix }) })
    ] }),
    navLinks.length > 0 && /* @__PURE__ */ jsxRuntime.jsx("nav", { className: "hidden md:flex items-center justify-center gap-10 flex-1 px-4", children: navLinks.map(({ label, href }) => /* @__PURE__ */ jsxRuntime.jsx(
      "a",
      {
        href,
        className: "text-sm font-medium text-white/55 no-underline transition-all hover:text-white hover:scale-105",
        children: label
      },
      href
    )) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center gap-4 shrink-0 ml-4", children: user ? /* @__PURE__ */ jsxRuntime.jsx(HeaderUserMenu, { config }) : isReady && ctaSlot })
  ] }) });
}
var RANK_CONFIG = {
  bronze: { emoji: "\u{1F949}", color: "#CD7F32", label: "Bronze" },
  silver: { emoji: "\u{1F948}", color: "#C0C0C0", label: "Prata" },
  gold: { emoji: "\u{1F947}", color: "#FFD700", label: "Ouro" },
  platinum: { emoji: "\u2B50", color: "#E5E4E2", label: "Platina" },
  diamond: { emoji: "\u{1F48E}", color: "#B9F2FF", label: "Diamante" }
};
var SIZE_STYLES = {
  sm: { padding: "2px 6px", gap: 2, fontSize: 11 },
  md: { padding: "4px 8px", gap: 4, fontSize: 12 },
  lg: { padding: "6px 12px", gap: 6, fontSize: 14 }
};
function RankBadge({ rankName, size = "sm", showLabel = true, className }) {
  const config = RANK_CONFIG[rankName] ?? RANK_CONFIG.bronze;
  const s = SIZE_STYLES[size];
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "span",
    {
      className,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        borderRadius: 999,
        border: `1px solid ${config.color}55`,
        backgroundColor: `${config.color}22`,
        color: config.color,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 500,
        lineHeight: 1,
        whiteSpace: "nowrap"
      },
      title: config.label,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: config.emoji }),
        showLabel && /* @__PURE__ */ jsxRuntime.jsx("span", { children: config.label })
      ]
    }
  );
}
var S2 = {
  wrap: { position: "relative" },
  trigger: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "4px 8px",
    borderRadius: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "inherit",
    fontSize: 14,
    fontWeight: 500
  },
  avatar: (hasImage) => ({
    width: 30,
    height: 30,
    borderRadius: "50%",
    backgroundColor: "rgba(249,115,22,0.15)",
    border: "1.5px solid rgba(249,115,22,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    color: "hsl(18 100% 62%)",
    overflow: "hidden",
    flexShrink: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    ...hasImage ? {} : {}
  }),
  chevron: {
    opacity: 0.5,
    display: "flex",
    alignItems: "center"
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "calc(100% + 8px)",
    width: 224,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "hsl(220 45% 17%)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    zIndex: 100,
    overflow: "hidden",
    padding: "4px 0"
  },
  userInfo: {
    padding: "10px 14px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: "hsl(0 0% 100%)",
    margin: "0 0 2px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  userEmail: {
    fontSize: 11,
    color: "rgba(255,255,255,0.45)",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  section: {
    padding: "4px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)"
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "8px 14px",
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "left"
  },
  menuItemDanger: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "8px 14px",
    fontSize: 13,
    color: "#f87171",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "left"
  }
};
var ChevronDown2 = () => /* @__PURE__ */ jsxRuntime.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntime.jsx("polyline", { points: "6 9 12 15 18 9" }) });
var UserIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
  /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "12", cy: "7", r: "4" })
] });
var DashboardIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "3", y: "3", width: "7", height: "7" }),
  /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "14", y: "3", width: "7", height: "7" }),
  /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "14", y: "14", width: "7", height: "7" }),
  /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "3", y: "14", width: "7", height: "7" })
] });
var BookIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20" }),
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" })
] });
var LogOutIcon = () => /* @__PURE__ */ jsxRuntime.jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
  /* @__PURE__ */ jsxRuntime.jsx("polyline", { points: "16 17 21 12 16 7" }),
  /* @__PURE__ */ jsxRuntime.jsx("line", { x1: "21", y1: "12", x2: "9", y2: "12" })
] });
function UserMenu({ user, onSignOut, appUrl, settingsUrl, docsUrl }) {
  const [isOpen, setIsOpen] = react.useState(false);
  const ref = react.useRef(null);
  const initials = user.name ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : (user.email?.[0] ?? "?").toUpperCase();
  const firstName = user.name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "Usu\xE1rio";
  react.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: S2.wrap, ref, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("button", { style: S2.trigger, onClick: () => setIsOpen((o) => !o), children: [
      user.avatarUrl ? /* @__PURE__ */ jsxRuntime.jsx(
        "img",
        {
          src: user.avatarUrl,
          alt: user.name ?? "Avatar",
          style: { ...S2.avatar(true), objectFit: "cover" },
          width: 30,
          height: 30
        }
      ) : /* @__PURE__ */ jsxRuntime.jsx("span", { style: S2.avatar(false), children: initials }),
      user.rankName && /* @__PURE__ */ jsxRuntime.jsx(RankBadge, { rankName: user.rankName, size: "sm", showLabel: false }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { style: { maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }, children: firstName }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { style: S2.chevron, children: /* @__PURE__ */ jsxRuntime.jsx(ChevronDown2, {}) })
    ] }),
    isOpen && /* @__PURE__ */ jsxRuntime.jsxs("div", { style: S2.dropdown, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: S2.userInfo, children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }, children: user.rankName && /* @__PURE__ */ jsxRuntime.jsx(RankBadge, { rankName: user.rankName, size: "sm", showLabel: true }) }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { style: S2.userName, children: user.name ?? user.email }),
        user.email && /* @__PURE__ */ jsxRuntime.jsx("p", { style: S2.userEmail, children: user.email })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { style: S2.section, children: [
        appUrl && /* @__PURE__ */ jsxRuntime.jsxs("a", { href: `${appUrl}/dashboard`, style: S2.menuItem, onClick: () => setIsOpen(false), children: [
          /* @__PURE__ */ jsxRuntime.jsx(DashboardIcon, {}),
          " Painel Principal"
        ] }),
        settingsUrl && /* @__PURE__ */ jsxRuntime.jsxs("a", { href: settingsUrl, style: S2.menuItem, onClick: () => setIsOpen(false), children: [
          /* @__PURE__ */ jsxRuntime.jsx(UserIcon, {}),
          " Editar Perfil"
        ] }),
        docsUrl && /* @__PURE__ */ jsxRuntime.jsxs("a", { href: docsUrl, target: "_blank", rel: "noopener noreferrer", style: S2.menuItem, onClick: () => setIsOpen(false), children: [
          /* @__PURE__ */ jsxRuntime.jsx(BookIcon, {}),
          " Documenta\xE7\xE3o"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: "4px 0" }, children: onSignOut && /* @__PURE__ */ jsxRuntime.jsxs("button", { style: S2.menuItemDanger, onClick: () => {
        setIsOpen(false);
        onSignOut();
      }, children: [
        /* @__PURE__ */ jsxRuntime.jsx(LogOutIcon, {}),
        " Sair"
      ] }) })
    ] })
  ] });
}
function cn(...inputs) {
  return tailwindMerge.twMerge(clsx.clsx(inputs));
}
var buttonVariants = classVarianceAuthority.cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1729] disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default: "bg-[#182644] text-white hover:bg-[#1E3050] border border-[#1E3050]",
        outline: "border border-orange-500 text-orange-500 hover:bg-orange-500/10",
        ghost: "text-slate-300 hover:bg-[#182644] hover:text-white",
        gradient: "bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98]",
        business: "bg-[#28A745] text-white shadow-lg hover:bg-[#218838] hover:shadow-[#28A745]/30 hover:scale-[1.02] active:scale-[0.98]",
        glass: "bg-white/5 backdrop-blur border border-white/10 text-white hover:bg-white/10",
        destructive: "bg-red-600 text-white hover:bg-red-700"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: { variant: "default", size: "md" }
  }
);
var Button = react.forwardRef(
  ({ className, variant, size, loading, disabled, asChild = false, children, ...props }, ref) => {
    const buttonClass = cn(buttonVariants({ variant, size }), className);
    if (asChild) {
      return /* @__PURE__ */ jsxRuntime.jsx(reactSlot.Slot, { ref, className: buttonClass, ...props, children });
    }
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "button",
      {
        ref,
        className: buttonClass,
        disabled: disabled || loading,
        ...props,
        children: [
          loading && /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Loader2, { className: "h-4 w-4 animate-spin" }),
          children
        ]
      }
    );
  }
);
Button.displayName = "Button";
var Card = react.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref,
      className: cn(
        "rounded-xl bg-[#121E34] border border-[#1E3050] transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10",
        className
      ),
      ...props
    }
  )
);
Card.displayName = "Card";
var CardHeader = react.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
var CardTitle = react.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("h3", { ref, className: cn("text-lg font-semibold leading-none tracking-tight text-white", className), ...props })
);
CardTitle.displayName = "CardTitle";
var CardDescription = react.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("p", { ref, className: cn("text-sm text-slate-400", className), ...props })
);
CardDescription.displayName = "CardDescription";
var CardContent = react.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
var CardFooter = react.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
var badgeVariants = classVarianceAuthority.cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
        secondary: "bg-[#182644] text-slate-300 border border-[#1E3050]",
        destructive: "bg-red-500/20 text-red-400 border border-red-500/30",
        outline: "border border-slate-600 text-slate-300",
        success: "bg-green-500/20 text-green-400 border border-green-500/30",
        warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
      }
    },
    defaultVariants: { variant: "default" }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: cn(
        "relative overflow-hidden rounded-md bg-[#182644] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
        className
      ),
      ...props
    }
  );
}
var sizeMap = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base"
};
function Avatar({ src, alt, fallback, size = "md", className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-[#182644] border border-[#1E3050]",
        sizeMap[size],
        className
      ),
      ...props,
      children: src ? (
        // eslint-disable-next-line @next/next/no-img-element
        /* @__PURE__ */ jsxRuntime.jsx("img", { src, alt: alt ?? "", className: "h-full w-full object-cover" })
      ) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: "flex h-full w-full items-center justify-center font-medium text-orange-400", children: fallback ?? "?" })
    }
  );
}
var Input = react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "input",
  {
    ref,
    className: cn(
      "flex h-10 w-full rounded-xl border border-[#1E3050] bg-[#121E34] px-3 py-2 text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
      className
    ),
    ...props
  }
));
Input.displayName = "Input";
var Textarea = react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "textarea",
  {
    ref,
    className: cn(
      "flex min-h-[80px] w-full rounded-xl border border-[#1E3050] bg-[#121E34] px-3 py-2 text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none",
      className
    ),
    ...props
  }
));
Textarea.displayName = "Textarea";
var alertVariants = classVarianceAuthority.cva("flex gap-3 rounded-xl border p-4", {
  variants: {
    variant: {
      info: "border-blue-500/30 bg-blue-500/10 text-blue-300",
      warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
      error: "border-red-500/30 bg-red-500/10 text-red-300",
      success: "border-green-500/30 bg-green-500/10 text-green-300"
    }
  },
  defaultVariants: { variant: "info" }
});
var iconMap = {
  info: lucideReact.Info,
  warning: lucideReact.AlertTriangle,
  error: lucideReact.XCircle,
  success: lucideReact.CheckCircle
};
function AlertBox({ className, variant = "info", title, children, ...props }) {
  const Icon = iconMap[variant];
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn(alertVariants({ variant }), className), ...props, children: [
    /* @__PURE__ */ jsxRuntime.jsx(Icon, { className: "h-5 w-5 shrink-0 mt-0.5" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col gap-1", children: [
      title && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-medium text-sm", children: title }),
      children && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm opacity-80", children })
    ] })
  ] });
}
var emptyVariants = classVarianceAuthority.cva("flex flex-col items-center justify-center text-center", {
  variants: {
    variant: {
      inline: "py-8 gap-2",
      dashed: "rounded-xl border-2 border-dashed border-[#1E3050] py-12 gap-3 hover:border-orange-500/30 transition-colors",
      card: "rounded-xl bg-[#121E34] border border-[#1E3050] py-12 gap-3"
    }
  },
  defaultVariants: { variant: "inline" }
});
function EmptyState({
  className,
  variant,
  icon,
  title,
  description,
  action,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn(emptyVariants({ variant }), className), ...props, children: [
    icon && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-slate-500 mb-1", children: icon }),
    /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-medium text-white", children: title }),
    description && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-slate-400 max-w-xs", children: description }),
    action && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-2", children: action })
  ] });
}
function LoadingState({ variant = "inline", text, className, ...props }) {
  if (variant === "page") {
    return /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        className: cn("flex min-h-[400px] flex-col items-center justify-center gap-3", className),
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Loader2, { className: "h-8 w-8 animate-spin text-orange-500" }),
          text && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-slate-400", children: text })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex items-center gap-2 text-slate-400", className), ...props, children: [
    /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Loader2, { className: "h-4 w-4 animate-spin text-orange-500" }),
    text && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm", children: text })
  ] });
}
function StatCard({ title, value, trend, icon, action, className, ...props }) {
  const isPositive = trend !== void 0 && trend >= 0;
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: cn(
        "rounded-xl bg-[#121E34] border border-[#1E3050] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-slate-400", children: title }),
          icon && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-orange-400", children: icon })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-2xl font-bold text-white mb-2", children: value }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
          trend !== void 0 && /* @__PURE__ */ jsxRuntime.jsxs(
            "div",
            {
              className: cn(
                "flex items-center gap-1 text-xs font-medium",
                isPositive ? "text-green-400" : "text-red-400"
              ),
              children: [
                isPositive ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.TrendingDown, { className: "h-3 w-3" }),
                Math.abs(trend),
                "%"
              ]
            }
          ),
          action && /* @__PURE__ */ jsxRuntime.jsxs(
            "button",
            {
              onClick: action.onClick,
              className: "ml-auto flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors",
              children: [
                action.label,
                " ",
                /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ArrowRight, { className: "h-3 w-3" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function MetricCard({ title, value, icon, subtitle, className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: cn(
        "rounded-xl bg-[#121E34] border border-[#1E3050] p-4 transition-all duration-200 hover:border-orange-500/20",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center gap-3", children: [
        icon && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400", children: icon }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs text-slate-400", children: title }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xl font-bold text-white", children: value }),
          subtitle && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-xs text-slate-500", children: subtitle })
        ] })
      ] })
    }
  );
}
function QuickLinkCard({ title, description, icon, href, className, onClick, ...props }) {
  const inner = /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    icon && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400", children: icon }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-medium text-white", children: title }),
      description && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-slate-400 truncate", children: description })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ArrowRight, { className: "h-4 w-4 text-slate-500 group-hover:text-orange-400 transition-colors shrink-0" })
  ] });
  const baseClass = cn(
    "group flex items-center gap-4 rounded-xl bg-[#121E34] border border-[#1E3050] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer",
    className
  );
  if (href) {
    return /* @__PURE__ */ jsxRuntime.jsx("a", { href, className: baseClass, children: inner });
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: baseClass, onClick, ...props, children: inner });
}

// src/tokens/colors.ts
var colors = {
  /** Laranja — cor de destaque principal */
  primary: "#F97316",
  primaryLight: "#FB923C",
  primaryDark: "#EA580C",
  /** Azul escuro — fundo principal */
  background: "#0F1729",
  /** Cards e painéis */
  card: "#121E34",
  /** Elementos secundários */
  secondary: "#182644",
  /** Bordas e inputs */
  border: "#1E3050",
  /** Sidebar */
  sidebarBackground: "#0B1220",
  /** Texto primário (sobre fundo escuro) */
  foreground: "#F8FAFC",
  /** Texto secundário / muted */
  mutedForeground: "#798BAA"
};
var cssVars = {
  "--primary": "24 95% 53%",
  "--primary-foreground": "0 0% 100%",
  "--background": "222 47% 11%",
  "--foreground": "210 40% 98%",
  "--card": "222 47% 13%",
  "--card-foreground": "210 40% 98%",
  "--secondary": "222 47% 18%",
  "--secondary-foreground": "210 40% 98%",
  "--muted": "222 47% 20%",
  "--muted-foreground": "215 20% 55%",
  "--accent": "24 95% 53%",
  "--accent-foreground": "0 0% 100%",
  "--border": "222 47% 20%",
  "--input": "222 47% 20%",
  "--ring": "24 95% 53%",
  "--radius": "0.75rem",
  "--sidebar-background": "222 47% 9%",
  "--sidebar-foreground": "215 20% 65%",
  "--sidebar-primary": "24 95% 53%",
  "--sidebar-primary-foreground": "0 0% 100%",
  "--sidebar-accent": "222 47% 15%",
  "--sidebar-accent-foreground": "210 40% 98%",
  "--sidebar-border": "222 47% 18%"
};

// src/tokens/animations.ts
var animations = {
  shimmer: "shimmer 1.5s infinite",
  fadeUp: "fade-up 0.4s ease-out",
  slideUp: "slide-up 0.3s ease-out",
  float: "float 3s ease-in-out infinite",
  pulseRing: "pulse-ring 2s infinite"
};
var keyframes = {
  shimmer: {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" }
  },
  "fade-up": {
    from: { opacity: "0", transform: "translateY(16px)" },
    to: { opacity: "1", transform: "translateY(0)" }
  },
  "slide-up": {
    from: { opacity: "0", transform: "translateY(8px)" },
    to: { opacity: "1", transform: "translateY(0)" }
  },
  float: {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-8px)" }
  },
  "pulse-ring": {
    "0%": { boxShadow: "0 0 0 0 hsl(18 100% 62% / 0.4)" },
    "70%": { boxShadow: "0 0 0 10px hsl(18 100% 62% / 0)" },
    "100%": { boxShadow: "0 0 0 0 hsl(18 100% 62% / 0)" }
  }
};

exports.AlertBox = AlertBox;
exports.Avatar = Avatar;
exports.Badge = Badge;
exports.Button = Button;
exports.Card = Card;
exports.CardContent = CardContent;
exports.CardDescription = CardDescription;
exports.CardFooter = CardFooter;
exports.CardHeader = CardHeader;
exports.CardTitle = CardTitle;
exports.EasyHeader = EasyHeader;
exports.EmptyState = EmptyState;
exports.Input = Input;
exports.LoadingState = LoadingState;
exports.Logo = Logo;
exports.MetricCard = MetricCard;
exports.NotificationBell = NotificationBell;
exports.QuickLinkCard = QuickLinkCard;
exports.RANK_CONFIG = RANK_CONFIG;
exports.RankBadge = RankBadge;
exports.Skeleton = Skeleton;
exports.StatCard = StatCard;
exports.Textarea = Textarea;
exports.UserMenu = UserMenu;
exports.animations = animations;
exports.badgeVariants = badgeVariants;
exports.buttonVariants = buttonVariants;
exports.cn = cn;
exports.colors = colors;
exports.cssVars = cssVars;
exports.keyframes = keyframes;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map