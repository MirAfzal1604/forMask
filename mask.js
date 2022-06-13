! function(u, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : u.IMask = t()
}(this, function() {
    "use strict";

    function u(u) {
        return "string" == typeof u || u instanceof String
    }

    function t(t, e) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "";
        return u(t) ? t : t ? e : n
    }

    function e(u, t) {
        var e = t.cursorPos,
            n = t.oldSelection,
            i = t.oldValue,
            s = Math.min(e, n.start),
            o = e - s,
            a = Math.max(n.end - s || i.length - u.length, 0);
        return r({}, t, {
            startChangePos: s,
            head: u.substring(0, s),
            tail: u.substring(s + o),
            inserted: u.substr(s, o),
            removed: i.substr(s, a),
            removeDirection: a && (n.end === e || o ? h.RIGHT : h.LEFT)
        })
    }

    function n(u, t) {
        return t === h.LEFT && --u, u
    }

    function i(u) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            e = i.MaskFactory(u, t);
        return e.bindEvents(), e.rawValue = u.value, e
    }
    var s = function(u, t) {
            if (!(u instanceof t)) throw new TypeError("Cannot call a class as a function")
        },
        o = function() {
            function u(u, t) {
                for (var e = 0; e < t.length; e++) {
                    var n = t[e];
                    n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(u, n.key, n)
                }
            }
            return function(t, e, n) {
                return e && u(t.prototype, e), n && u(t, n), t
            }
        }(),
        r = Object.assign || function(u) {
            for (var t = 1; t < arguments.length; t++) {
                var e = arguments[t];
                for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (u[n] = e[n])
            }
            return u
        },
        a = function(u, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            u.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: u,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(u, t) : u.__proto__ = t)
        },
        l = function(u, t) {
            if (!u) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? u : t
        },
        h = {
            NONE: 0,
            LEFT: -1,
            RIGHT: 1
        },
        p = function() {
            function u(t, e) {
                s(this, u), this.el = t, this.mask = e.mask, this._listeners = {}, this._refreshingCount = 0, this._rawValue = "", this._unmaskedValue = "", this.saveSelection = this.saveSelection.bind(this), this._onInput = this._onInput.bind(this), this._onDrop = this._onDrop.bind(this)
            }
            return u.prototype.on = function(u, t) {
                return this._listeners[u] || (this._listeners[u] = []), this._listeners[u].push(t), this
            }, u.prototype.off = function(u, t) {
                if (this._listeners[u]) {
                    if (t) {
                        var e = this._listeners[u].indexOf(t);
                        return e >= 0 && this._listeners.splice(e, 1), this
                    }
                    delete this._listeners[u]
                }
            }, u.prototype.bindEvents = function() {
                this.el.addEventListener("keydown", this.saveSelection), this.el.addEventListener("input", this._onInput), this.el.addEventListener("drop", this._onDrop)
            }, u.prototype.unbindEvents = function() {
                this.el.removeEventListener("keydown", this.saveSelection), this.el.removeEventListener("input", this._onInput), this.el.removeEventListener("drop", this._onDrop)
            }, u.prototype.fireEvent = function(u) {
                (this._listeners[u] || []).forEach(function(u) {
                    return u()
                })
            }, u.prototype.processInput = function(u, n) {
                n = e(u, n = r({
                    cursorPos: this.cursorPos,
                    oldSelection: this._selection,
                    oldValue: this.rawValue,
                    oldUnmaskedValue: this.unmaskedValue
                }, n));
                var i = t(this.resolve(u, n), u, this.rawValue);
                return this.updateElement(i, n.cursorPos), i
            }, u.prototype.saveSelection = function(u) {
                this.rawValue !== this.el.value && console.warn("Uncontrolled input change, refresh mask manually!"), this._selection = {
                    start: this.selectionStart,
                    end: this.cursorPos
                }
            }, u.prototype.destroy = function() {
                this.unbindEvents(), this._listeners.length = 0
            }, u.prototype.updateElement = function(u, t) {
                var e = this._calcUnmasked(u),
                    n = this.unmaskedValue !== e || this.rawValue !== u;
                this._unmaskedValue = e, this._rawValue = u, this.el.value !== u && (this.el.value = u), this.updateCursor(t), n && this._fireChangeEvents()
            }, u.prototype._fireChangeEvents = function() {
                this.fireEvent("accept")
            }, u.prototype.updateCursor = function(u) {
                null != u && (this.cursorPos = u, this._delayUpdateCursor(u))
            }, u.prototype._delayUpdateCursor = function(u) {
                var t = this;
                this._abortUpdateCursor(), this._changingCursorPos = u, this._cursorChanging = setTimeout(function() {
                    t._abortUpdateCursor(), t.cursorPos = t._changingCursorPos
                }, 10)
            }, u.prototype._abortUpdateCursor = function() {
                this._cursorChanging && (clearTimeout(this._cursorChanging), delete this._cursorChanging)
            }, u.prototype._onInput = function(u) {
                this._abortUpdateCursor(), this.processInput(this.el.value)
            }, u.prototype._onDrop = function(u) {
                u.preventDefault(), u.stopPropagation()
            }, u.prototype.resolve = function(u, t) {
                return u
            }, u.prototype._calcUnmasked = function(u) {
                return u
            }, o(u, [{
                key: "rawValue",
                get: function() {
                    return this._rawValue
                },
                set: function(u) {
                    this.processInput(u, {
                        cursorPos: u.length,
                        oldValue: this.rawValue,
                        oldSelection: {
                            start: 0,
                            end: this.rawValue.length
                        }
                    })
                }
            }, {
                key: "unmaskedValue",
                get: function() {
                    return this._unmaskedValue
                },
                set: function(u) {
                    this.rawValue = u
                }
            }, {
                key: "selectionStart",
                get: function() {
                    return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart
                }
            }, {
                key: "cursorPos",
                get: function() {
                    return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd
                },
                set: function(u) {
                    this.el === document.activeElement && (this.el.setSelectionRange(u, u), this.saveSelection())
                }
            }]), u
        }(),
        c = function(u) {
            function t() {
                return s(this, t), l(this, u.apply(this, arguments))
            }
            return a(t, u), t.prototype.resolve = function(u) {
                return this.mask.test(u)
            }, t
        }(p),
        A = function(u) {
            function t() {
                return s(this, t), l(this, u.apply(this, arguments))
            }
            return a(t, u), t.prototype.resolve = function() {
                return this.mask.apply(this, arguments)
            }, t
        }(p),
        f = function(u) {
            function e(t, n) {
                s(this, e);
                var i = l(this, u.call(this, t, n));
                return i._hollows = [], i.placeholder = n.placeholder, i.definitions = r({}, e.DEFINITIONS, n.definitions), i._alignCursor = i._alignCursor.bind(i), i._alignCursorFriendly = i._alignCursorFriendly.bind(i), i._initialized = !0, i
            }
            return a(e, u), e.prototype._alignCursorFriendly = function() {
                this.selectionStart === this.cursorPos && this._alignCursor()
            }, e.prototype.bindEvents = function() {
                u.prototype.bindEvents.call(this), this.el.addEventListener("click", this._alignCursorFriendly)
            }, e.prototype.unbindEvents = function() {
                u.prototype.unbindEvents.call(this), this.el.removeEventListener("click", this._alignCursorFriendly)
            }, e.prototype._installDefinitions = function(u) {
                this._definitions = u, this._charDefs = [], this._alignStops = [];
                var t = this.mask;
                if (t && u) {
                    for (var n = !1, i = !1, s = 0; s < t.length; ++s) {
                        var o = t[s],
                            r = !n && o in u ? e.DEF_TYPES.INPUT : e.DEF_TYPES.FIXED,
                            a = r === e.DEF_TYPES.INPUT || n,
                            l = r === e.DEF_TYPES.INPUT && i;
                        if (o !== e.STOP_CHAR)
                            if ("{" !== o && "}" !== o)
                                if ("[" !== o && "]" !== o) {
                                    if (o === e.ESCAPE_CHAR) {
                                        if (++s, !(o = t[s])) break;
                                        r = e.DEF_TYPES.FIXED
                                    }
                                    this._charDefs.push({
                                        char: o,
                                        type: r,
                                        optional: l,
                                        unmasking: a
                                    })
                                } else i = !i;
                        else n = !n;
                        else this._alignStops.push(this._charDefs.length)
                    }
                    this._buildResolvers()
                }
            }, e.prototype._buildResolvers = function() {
                this._resolvers = {};
                for (var u in this.definitions) this._resolvers[u] = IMask.MaskFactory(this.el, {
                    mask: this.definitions[u]
                })
            }, e.prototype._appendTail = function(u, n) {
                for (var i = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2], s = "", o = this._hollows.slice(), r = !1, a = 0, l = this._mapPosToDefIndex(u.length); a < n.length;)
                    if (this._isHollow(l)) ++l;
                    else {
                        var h = n[a],
                            p = this.def(l, u + s);
                        if (!p) {
                            r = !0;
                            break
                        }
                        var c, A;
                        if (p.type === e.DEF_TYPES.INPUT) {
                            var f = this._resolvers[p.char].resolve(h, l, u + s) || "";
                            c = !!f, A = !f && !p.optional, f ? f = t(f, h) : (!p.optional && i && (f = this._placeholder.char, A = !1), A || o.push(l)), f && (u += s + t(f, h), s = "")
                        } else s += p.char, c = h === p.char && (p.unmasking || !i);
                        A || ++l, (c || A) && ++a
                    }
                return [u, o, r]
            }, e.prototype._appendTailChunks = function(u, t, e) {
                for (var n = !1, i = 0; i < t.length; ++i) {
                    var s = t[i][1],
                        o = this._appendTail(u, s, e);
                    if (u = o[0], this._hollows = o[1], n = o[2]) break;
                    var r = t[i + 1],
                        a = r && r[0];
                    a && (u = this._appendPlaceholderEnd(u, a))
                }
                return [u, this._hollows, n]
            }, e.prototype._extractInput = function(u) {
                for (var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, e = arguments[2], n = "", i = e && this._mapPosToDefIndex(e), s = 0, o = this._mapPosToDefIndex(t); s < u.length && (!i || o < i); ++o) {
                    var r = u[s];
                    if (!this.def(o, u)) break;
                    this._isHiddenHollow(o) || (this._isInput(o) && !this._isHollow(o) && (n += r), ++s)
                }
                return n
            }, e.prototype._extractInputChunks = function(u, t) {
                for (var e = [], n = 0; n < t.length && u; ++n) {
                    var i = t[n],
                        s = t[n + 1];
                    e.push([i, this._extractInput(u, i, s)]), s && (u = u.slice(s - i))
                }
                return e
            }, e.prototype._isHollow = function(u) {
                return this._hollows.indexOf(u) >= 0
            }, e.prototype._isHiddenHollow = function(u) {
                return this._isHollow(u) && this.def(u) && this.def(u).optional
            }, e.prototype._isInput = function(u) {
                return this.def(u) && this.def(u).type === e.DEF_TYPES.INPUT
            }, e.prototype._hiddenHollowsBefore = function(u) {
                var t = this;
                return this._hollows.filter(function(e) {
                    return e < u && t._isHiddenHollow(e)
                })
            }, e.prototype._mapDefIndexToPos = function(u) {
                return u - this._hiddenHollowsBefore(u).length
            }, e.prototype._mapPosToDefIndex = function(u) {
                for (var t = u, e = 0; e < this._hollows.length; ++e) {
                    var n = this._hollows[e];
                    if (n >= t) break;
                    this._isHiddenHollow(n) && ++t
                }
                return t
            }, e.prototype._generateInsertSteps = function(u, t) {
                for (var e = !1, n = [
                        [u, (a = this._hollows).slice()]
                    ], i = 0; i < t.length && !e; ++i) {
                    var s = t[i],
                        o = this._appendTail(u, s, !1),
                        r = o[0],
                        a = o[1],
                        e = o[2];
                    this._hollows = a, e || r === u || (n.push([r, a]), u = r)
                }
                return this._hollows = a, n
            }, e.prototype.resolve = function(u, t) {
                var e = this,
                    n = t.cursorPos,
                    i = t.startChangePos,
                    s = t.inserted,
                    o = i + t.removed.length,
                    r = this._mapPosToDefIndex(o),
                    a = [o].concat(this._alignStops.filter(function(u) {
                        return u >= r
                    }).map(function(u) {
                        return e._mapDefIndexToPos(u)
                    })),
                    l = this._extractInputChunks(t.tail, a),
                    p = this._mapPosToDefIndex(i);
                this._hollows = this._hollows.filter(function(u) {
                    return u < p
                });
                var c = t.head;
                t.removeDirection === h.LEFT && (c = c.slice(0, this._nearestInputPos(i)));
                for (var A = this._generateInsertSteps(c, s), f = A.length - 1; f >= 0; --f) {
                    var F, d, _ = A[f];
                    F = _[0], this._hollows = _[1];
                    var E = this._appendTailChunks(F, l);
                    if (d = E[0], this._hollows = E[1], !E[2]) {
                        c = d, n = F.length;
                        break
                    }
                }
                return c = this._appendPlaceholderEnd(c), t.cursorPos = this._nearestInputPos(n, t.removeDirection), c
            }, e.prototype._fireChangeEvents = function() {
                u.prototype._fireChangeEvents.call(this), this.isComplete && this.fireEvent("complete")
            }, e.prototype._appendFixedEnd = function(u) {
                for (var t = this._mapPosToDefIndex(u.length);; ++t) {
                    var e = this.def(t, u);
                    if (!e) break;
                    if (!this._isHiddenHollow(t)) {
                        if (this._isInput(t)) break;
                        t >= u.length && (u += e.char)
                    }
                }
                return u
            }, e.prototype._appendPlaceholderEnd = function(u, t) {
                for (var n = t && this._mapPosToDefIndex(t), i = this._mapPosToDefIndex(u.length); !n || i < n; ++i) {
                    var s = this.def(i, u);
                    if (!s) break;
                    this._isInput(i) && !this._isHollow(i) && this._hollows.push(i), ("always" === this._placeholder.show || t) && (u += s.type === e.DEF_TYPES.FIXED ? s.char : s.optional ? "" : this._placeholder.char)
                }
                return u
            }, e.prototype._calcUnmasked = function(u) {
                for (var t = "", e = 0, n = 0; e < u.length; ++n) {
                    var i = u[e],
                        s = this.def(n, u);
                    if (!s) break;
                    this._isHiddenHollow(n) || (s.unmasking && !this._isHollow(n) && (this._isInput(n) && this._resolvers[s.char].resolve(i, e, u) || s.char === i) && (t += i), ++e)
                }
                return t
            }, e.prototype.defs = function(u) {
                for (var t = [], e = 0;; ++e) {
                    var n = this.def(e, u);
                    if (!n) break;
                    t.push(n)
                }
                return t
            }, e.prototype.def = function(u, t) {
                return this._charDefs[u]
            }, e.prototype._refreshValue = function() {
                this._initialized && (this.unmaskedValue = this.unmaskedValue)
            }, e.prototype._nearestInputPos = function(u) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : h.LEFT;
                if (!t) return u;
                var e, i, s, o, r = this._mapPosToDefIndex(u),
                    a = r;
                for (o = n(a, t); this.def(o); a += t, o += t)
                    if (null == e && this._isInput(o) && (e = a), null == s && this._isHollow(o) && !this._isHiddenHollow(o) && (s = a), this._isInput(o) && !this._isHollow(o)) {
                        i = a;
                        break
                    }
                if (t === h.LEFT || null == e) {
                    var l = !1;
                    for (o = n(a, t = -t); this.def(o) && (!this._isInput(o) || (e = a, !this._isHollow(o) || this._isHiddenHollow(o))) && (a === r && (l = !0), !l || null == e); a += t, o += t);
                    (l = l || !this.def(o)) && null != e && (a = e)
                } else null == i && (a = null != s ? s : e);
                return this._mapDefIndexToPos(a)
            }, e.prototype._alignCursor = function() {
                this.cursorPos = this._nearestInputPos(this.cursorPos)
            }, o(e, [{
                key: "isComplete",
                get: function() {
                    for (var u = 0;; ++u) {
                        var t = this.def(u);
                        if (!t) break;
                        if (this._isInput(u) && !t.optional && this._isHollow(u)) return !1
                    }
                    return !0
                }
            }, {
                key: "unmaskedValue",
                get: function() {
                    return this._unmaskedValue
                },
                set: function(u) {
                    this._hollows.length = 0;
                    var t, e = this._appendTail("", u);
                    t = e[0], this._hollows = e[1], this.updateElement(this._appendPlaceholderEnd(t)), this._alignCursor()
                }
            }, {
                key: "placeholder",
                get: function() {
                    return this._placeholder
                },
                set: function(u) {
                    this._placeholder = r({}, e.DEFAULT_PLACEHOLDER, u), this._refreshValue()
                }
            }, {
                key: "placeholderLabel",
                get: function() {
                    var u = this;
                    return this.defs().map(function(t) {
                        return t.type === e.DEF_TYPES.FIXED ? t.char : t.optional ? "" : u._placeholder.char
                    }).join("")
                }
            }, {
                key: "definitions",
                get: function() {
                    return this._definitions
                },
                set: function(u) {
                    this._installDefinitions(u), this._refreshValue()
                }
            }, {
                key: "mask",
                get: function() {
                    return this._mask
                },
                set: function(u) {
                    this._mask = u, this._initialized && (this.definitions = this.definitions)
                }
            }]), e
        }(p);
    f.DEFINITIONS = {
        0: /\d/,
        a: /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
        "*": /./
    }, f.DEF_TYPES = {
        INPUT: "input",
        FIXED: "fixed"
    }, f.DEFAULT_PLACEHOLDER = {
        show: "lazy",
        char: "_"
    }, f.STOP_CHAR = "'", f.ESCAPE_CHAR = "\\";
    var F = function(u) {
        function t(e, n) {
            s(this, t);
            var i = l(this, u.call(this, e, n));
            return i.multipass = n.multipass, i._compiledMasks = i.mask.map(function(u) {
                return IMask.MaskFactory(e, u)
            }), i
        }
        return a(t, u), t.prototype.resolve = function(u, t) {
            var e = this._pipe(u, t);
            if (!this.multipass) return e;
            for (var n, i = t.cursorPos, s = e; n !== s;) n = s, s = this._pipe(n, {
                cursorPos: n.length,
                oldValue: n,
                oldSelection: {
                    start: 0,
                    end: n.length
                }
            });
            return t.cursorPos = i - (e.length - n.length), n
        }, t.prototype._pipe = function(u, t) {
            return this._compiledMasks.reduce(function(u, n) {
                var i = e(u, t),
                    s = n.resolve(u, i);
                return t.cursorPos = i.cursorPos, s
            }, u)
        }, t.prototype.bindEvents = function() {
            u.prototype.bindEvents.call(this), this._compiledMasks.forEach(function(u) {
                u.bindEvents(), p.prototype.unbindEvents.apply(u)
            })
        }, t.prototype.unbindEvents = function() {
            u.prototype.unbindEvents.call(this), this._compiledMasks.forEach(function(u) {
                return u.unbindEvents()
            })
        }, t
    }(p);
    return i.MaskFactory = function(t, e) {
        var n = e.mask;
        return n instanceof p ? n : n instanceof RegExp ? new c(t, e) : n instanceof Array ? new F(t, e) : u(n) ? new f(t, e) : n.prototype instanceof p ? new n(t, e) : n instanceof Function ? new A(t, e) : new p(t, e)
    }, i.BaseMask = p, i.FuncMask = A, i.RegExpMask = c, i.PatternMask = f, window.IMask = i, i
});