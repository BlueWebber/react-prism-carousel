import e from "react";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
var r = {
	carouselContainer: "_carouselContainer_1ax8l_4",
	carousel: "_carousel_1ax8l_4",
	centerpiece: "_centerpiece_1ax8l_36"
};
// src/Carousel.tsx
function i() {
	try {
		return process.env.NODE_ENV !== "production";
	} catch {
		return !1;
	}
}
function a({ children: a, orientation: o, noChildrenElem: s, centerpieceElem: c, faceProps: l, prismProps: u, currentFace: d = 0, numEmptyFaces: f = 0, faceSize: p, concave: m = !1, cameraOffset: h, transition: g, ..._ }) {
	e.useEffect(() => {
		i() && p?.trim().endsWith("%") && console.warn(`Carousel: faceSize "${p}" uses %, which the 3D depth (transform-origin Z) doesn't accept. Use cqw (horizontal) or cqh (vertical) for sizes relative to the carousel.`);
	}, [p]);
	let v = e.Children.toArray(a), y = v.length, b = Number.isFinite(f) ? Math.max(0, Math.floor(f)) : 0, x = y === 0 || y + b === 1, S = d;
	b && y > 0 && (S = Math.min(Math.max(d, 0), y - 1));
	let C = y + b, w = -1;
	if (y > 0 && Number.isFinite(S)) {
		let e = (Math.round(S) % C + C) % C;
		w = e < y ? e : -1;
	}
	return /* @__PURE__ */ t("div", {
		role: "region",
		"aria-roledescription": "carousel",
		..._,
		className: [r.carouselContainer, _.className].filter(Boolean).join(" "),
		children: /* @__PURE__ */ n("div", {
			...u,
			"data-orientation": o,
			"data-flat": x || void 0,
			"data-facesize": p ? "manual" : void 0,
			"data-concave": m || void 0,
			style: {
				...u?.style,
				"--prism-current-face": S,
				"--prism-face-count": y,
				"--prism-num-empty-faces": b,
				"--prism-face-size": p,
				"--prism-camera-offset": h,
				"--prism-transition": g
			},
			className: [r.carousel, u?.className].filter(Boolean).join(" "),
			children: [y === 0 ? s : v.map((n, r) => /* @__PURE__ */ t("span", {
				role: "group",
				"aria-roledescription": "slide",
				"aria-label": `${r + 1} of ${y}`,
				...typeof l == "function" ? l(r, r === w) : l,
				children: n
			}, e.isValidElement(n) && n.key != null ? n.key : r)), /* @__PURE__ */ t("div", {
				className: r.centerpiece,
				children: c
			})]
		})
	});
}
export { a as Carousel, a as default };
