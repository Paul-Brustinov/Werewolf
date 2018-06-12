/*	ColorBox v1.3.6 - a full featured, light-weight, customizable lightbox based on jQuery 1.3 */
(function(c) {
    function r(b, d) {
        d = d === "x" ? m.width() : m.height();
        return typeof b === "string" ? Math.round(b.match(/%/) ? d / 100 * parseInt(b, 10) : parseInt(b, 10)) : b
    }

    function M(b) {
        b = c.isFunction(b) ? b.call(i) : b;
        return a.photo || b.match(/\.(gif|png|jpg|jpeg|bmp)(?:\?([^#]*))?(?:#(\.*))?$/i)
    }

    function Y() {
        for (var b in a) if (c.isFunction(a[b]) && b.substring(0, 2) !== "on") a[b] = a[b].call(i);
        a.rel = a.rel || i.rel;
        a.href = a.href || i.href;
        a.title = a.title || i.title
    }

    function Z(b) {
        i = b;
        a = c(i).data(q);
        Y();
        if (a.rel && a.rel !== "nofollow") {
            g = c(".cboxElement").filter(function() { return(c(this).data(q).rel || this.rel) === a.rel });
            j = g.index(i);
            if (j < 0) {
                g = g.add(i);
                j = g.length - 1
            }
        } else {
            g = c(i);
            j = 0
        }
        if (!B) {
            C = B = n;
            N = i;
            N.blur();
            c(document).bind("keydown.cbox_close",
                function(d) {
                    if (d.keyCode === 27) {
                        d.preventDefault();
                        e.close()
                    }
                }).bind("keydown.cbox_arrows",
                function(d) {
                    if (g.length > 1)
                        if (d.keyCode === 37) {
                            d.preventDefault();
                            D.click()
                        } else if (d.keyCode === 39) {
                            d.preventDefault();
                            E.click()
                        }
                });
            a.overlayClose && s.css({ cursor: "pointer" }).one("click", e.close);
            c.event.trigger(aa);
            a.onOpen && a.onOpen.call(i);
            s.css({ opacity: a.opacity }).show();
            a.w = r(a.initialWidth, "x");
            a.h = r(a.initialHeight, "y");
            e.position(0);
            O &&
                m.bind("resize.cboxie6 scroll.cboxie6",
                    function() {
                        s.css({ width: m.width(), height: m.height(), top: m.scrollTop(), left: m.scrollLeft() })
                    }).trigger("scroll.cboxie6")
        }
        P.add(D).add(E).add(t).add(Q).hide();
        R.html(a.close).show();
        e.slideshow();
        e.load()
    }

    var q = "colorbox",
        F = "hover",
        n = true,
        e,
        x = !c.support.opacity,
        O = x && !window.XMLHttpRequest,
        aa = "cbox_open",
        H = "cbox_load",
        S = "cbox_complete",
        T = "resize.cbox_resize",
        s,
        k,
        u,
        p,
        U,
        V,
        W,
        X,
        g,
        m,
        l,
        I,
        J,
        K,
        Q,
        P,
        t,
        E,
        D,
        R,
        y,
        z,
        v,
        w,
        i,
        N,
        j,
        a,
        B,
        C,
        $ = {
            transition: "elastic",
            speed: 350,
            width: false,
            height: false,
            innerWidth: false,
            innerHeight: false,
            initialWidth: "400",
            initialHeight: "400",
            maxWidth: false,
            maxHeight: false,
            scalePhotos: n,
            scrolling: n,
            inline: false,
            html: false,
            iframe: false,
            photo: false,
            href: false,
            title: false,
            rel: false,
            opacity: 0.9,
            preloading: n,
            current: "image {current} of {total}",
            previous: "previous",
            next: "next",
            close: "close",
            open: false,
            overlayClose: n,
            slideshow: false,
            slideshowAuto: n,
            slideshowSpeed: 2500,
            slideshowStart: "start slideshow",
            slideshowStop: "stop slideshow",
            onOpen: false,
            onLoad: false,
            onComplete: false,
            onCleanup: false,
            onClosed: false
        };
    e = c.fn.colorbox = function(b, d) {
        var h = this;
        if (!h.length)
            if (h.selector === "") {
                h = c("<a/>");
                b.open = n
            } else return this;
        h.each(function() {
            var f = c.extend({}, c(this).data(q) ? c(this).data(q) : $, b);
            c(this).data(q, f).addClass("cboxElement");
            if (d) c(this).data(q).onComplete = d
        });
        b && b.open && Z(h);
        return this
    };
    e.init = function() {
        function b(d) { return c('<div id="cbox' + d + '"/>') }

        m = c(window);
        k = c('<div id="colorbox"/>');
        s = b("Overlay").hide();
        u = b("Wrapper");
        p = b("Content").append(l = b("LoadedContent").css({ width: 0, height: 0 }),
            J = b("LoadingOverlay"),
            K = b("LoadingGraphic"),
            Q = b("Title"),
            P = b("Current"),
            t = b("Slideshow"),
            E = b("Next"),
            D = b("Previous"),
            R = b("Close"));
        u.append(c("<div/>").append(b("TopLeft"), U = b("TopCenter"), b("TopRight")),
                c("<div/>").append(V = b("MiddleLeft"), p, W = b("MiddleRight")),
                c("<div/>").append(b("BottomLeft"), X = b("BottomCenter"), b("BottomRight"))).children().children()
            .css({ "float": "left" });
        I = c("<div style='position:absolute; top:0; left:0; width:9999px; height:0;'/>");
        c("body").prepend(s, k.append(u, I));
        if (x) {
            k.addClass("cboxIE");
            O && s.css("position", "absolute")
        }
        p.children().bind("mouseover mouseout", function() { c(this).toggleClass(F) }).addClass(F);
        y = U.height() + X.height() + p.outerHeight(n) - p.height();
        z = V.width() + W.width() + p.outerWidth(n) - p.width();
        v = l.outerHeight(n);
        w = l.outerWidth(n);
        k.css({ "padding-bottom": y, "padding-right": z }).hide();
        E.click(e.next);
        D.click(e.prev);
        R.click(e.close);
        p.children().removeClass(F);
        c(".cboxElement").live("click",
            function(d) {
                if (d.button !== 0 && typeof d.button !== "undefined") return n;
                else {
                    Z(this);
                    return false
                }
            })
    };
    e.position = function(b, d) {
        function h(A) {
            U[0].style.width = X[0].style.width = p[0].style.width = A.style.width;
            K[0].style.height = J[0].style.height = p[0].style.height = V[0].style.height = W[0].style.height =
                A.style.height
        }

        var f = m.height();
        f = Math.max(f - a.h - v - y, 0) / 2 + m.scrollTop();
        var o = Math.max(document.documentElement.clientWidth - a.w - w - z, 0) / 2 + m.scrollLeft();
        b = k.width() === a.w + w && k.height() === a.h + v ? 0 : b;
        u[0].style.width = u[0].style.height = "9999px";
        k.dequeue().animate({ width: a.w + w, height: a.h + v, top: f, left: o },
            {
                duration: b,
                complete: function() {
                    h(this);
                    C = false;
                    u[0].style.width = a.w + w + z + "px";
                    u[0].style.height = a.h + v + y + "px";
                    d && d()
                },
                step: function() { h(this) }
            })
    };
    e.resize = function(b) {
        function d() {
            a.w = a.w || l.width();
            a.w = a.mw && a.mw < a.w ? a.mw : a.w;
            return a.w
        }

        function h() {
            a.h = a.h || l.height();
            a.h = a.mh && a.mh < a.h ? a.mh : a.h;
            return a.h
        }

        function f(G) {
            e.position(G,
                function() {
                    if (B) {
                        if (x) {
                            A && l.fadeIn(100);
                            k[0].style.removeAttribute("filter")
                        }
                        if (a.iframe)
                            l.append("<iframe id='cboxIframe'" +
                                (a.scrolling ? " " : "scrolling='no'") +
                                " name='iframe_" +
                                (new Date).getTime() +
                                "' frameborder=0 src='" +
                                a.href +
                                "' " +
                                (x ? "allowtransparency='true'" : "") +
                                " />");
                        l.show();
                        Q.show().html(a.title);
                        if (g.length > 1) {
                            P.html(a.current.replace(/\{current\}/, j + 1).replace(/\{total\}/, g.length)).show();
                            E.html(a.next).show();
                            D.html(a.previous).show();
                            a.slideshow && t.show()
                        }
                        J.hide();
                        K.hide();
                        c.event.trigger(S);
                        a.onComplete && a.onComplete.call(i);
                        a.transition === "fade" &&
                            k.fadeTo(L, 1, function() { x && k[0].style.removeAttribute("filter") });
                        m.bind(T, function() { e.position(0) })
                    }
                })
        }

        if (B) {
            var o, A, L = a.transition === "none" ? 0 : a.speed;
            m.unbind(T);
            if (b) {
                l.remove();
                l = c('<div id="cboxLoadedContent"/>').html(b);
                l.hide().appendTo(I).css({ width: d(), overflow: a.scrolling ? "auto" : "hidden" }).css({ height: h() })
                    .prependTo(p);
                c("#cboxPhoto").css({ cssFloat: "none" });
                O &&
                    c("select:not(#colorbox select)").filter(function() { return this.style.visibility !== "hidden" })
                    .css({ visibility: "hidden" })
                    .one("cbox_cleanup", function() { this.style.visibility = "inherit" });
                a.transition === "fade" && k.fadeTo(L, 0, function() { f(0) }) || f(L);
                if (a.preloading && g.length > 1) {
                    b = j > 0 ? g[j - 1] : g[g.length - 1];
                    o = j < g.length - 1 ? g[j + 1] : g[0];
                    o = c(o).data(q).href || o.href;
                    b = c(b).data(q).href || b.href;
                    M(o) && c("<img />").attr("src", o);
                    M(b) && c("<img />").attr("src", b)
                }
            } else
                setTimeout(function() {
                        var G = l.wrapInner("<div style='overflow:auto'></div>").children();
                        a.h = G.height();
                        l.css({ height: a.h });
                        G.replaceWith(G.children());
                        e.position(L)
                    },
                    1)
        }
    };
    e.load = function() {
        var b, d, h, f = e.resize;
        C = n;
        i = g[j];
        a = c(i).data(q);
        Y();
        c.event.trigger(H);
        a.onLoad && a.onLoad.call(i);
        a.h = a.height ? r(a.height, "y") - v - y : a.innerHeight ? r(a.innerHeight, "y") : false;
        a.w = a.width ? r(a.width, "x") - w - z : a.innerWidth ? r(a.innerWidth, "x") : false;
        a.mw = a.w;
        a.mh = a.h;
        if (a.maxWidth) {
            a.mw = r(a.maxWidth, "x") - w - z;
            a.mw = a.w && a.w < a.mw ? a.w : a.mw
        }
        if (a.maxHeight) {
            a.mh = r(a.maxHeight, "y") - v - y;
            a.mh = a.h && a.h < a.mh ? a.h : a.mh
        }
        b = a.href;
        J.show();
        K.show();
        if (a.inline) {
            c('<div id="cboxInlineTemp" />').hide().insertBefore(c(b)[0]).bind(H + " cbox_cleanup",
                function() { c(this).replaceWith(l.children()) });
            f(c(b))
        } else if (a.iframe) f(" ");
        else if (a.html) f(a.html);
        else if (M(b)) {
            d = new Image;
            d.onload = function() {
                var o;
                d.onload = null;
                d.id = "cboxPhoto";
                c(d).css({ margin: "auto", border: "none", display: "block", cssFloat: "left" });
                if (a.scalePhotos) {
                    h = function() {
                        d.height -= d.height * o;
                        d.width -= d.width * o
                    };
                    if (a.mw && d.width > a.mw) {
                        o = (d.width - a.mw) / d.width;
                        h()
                    }
                    if (a.mh && d.height > a.mh) {
                        o = (d.height - a.mh) / d.height;
                        h()
                    }
                }
                if (a.h) d.style.marginTop = Math.max(a.h - d.height, 0) / 2 + "px";
                f(d);
                g.length > 1 && c(d).css({ cursor: "pointer" }).click(e.next);
                if (x) d.style.msInterpolationMode = "bicubic"
            };
            d.src = b
        } else
            c("<div />").appendTo(I).load(b,
                function(o, A) { A === "success" ? f(this) : f(c("<p>Request unsuccessful.</p>")) })
    };
    e.next = function() {
        if (!C) {
            j = j < g.length - 1 ? j + 1 : 0;
            e.load()
        }
    };
    e.prev = function() {
        if (!C) {
            j = j > 0 ? j - 1 : g.length - 1;
            e.load()
        }
    };
    e.slideshow = function() {
        function b() {
            t.text(a.slideshowStop).bind(S, function() { h = setTimeout(e.next, a.slideshowSpeed) })
                .bind(H, function() { clearTimeout(h) }).one("click",
                    function() {
                        d();
                        c(this).removeClass(F)
                    });
            k.removeClass(f + "off").addClass(f + "on")
        }

        var d, h, f = "cboxSlideshow_";
        t.bind("cbox_closed",
            function() {
                t.unbind();
                clearTimeout(h);
                k.removeClass(f + "off " + f + "on")
            });
        d = function() {
            clearTimeout(h);
            t.text(a.slideshowStart).unbind(S + " " + H).one("click",
                function() {
                    b();
                    h = setTimeout(e.next, a.slideshowSpeed);
                    c(this).removeClass(F)
                });
            k.removeClass(f + "on").addClass(f + "off")
        };
        if (a.slideshow && g.length > 1) a.slideshowAuto ? b() : d()
    };
    e.close = function() {
        c.event.trigger("cbox_cleanup");
        a.onCleanup && a.onCleanup.call(i);
        B = false;
        c(document).unbind("keydown.cbox_close keydown.cbox_arrows");
        m.unbind(T + " resize.cboxie6 scroll.cboxie6");
        s.css({ cursor: "auto" }).fadeOut("fast");
        k.stop(n, false).fadeOut("fast",
            function() {
                c("#colorbox iframe").attr("src", "about:blank");
                l.remove();
                k.css({ opacity: 1 });
                try {
                    N.focus()
                } catch (b) {
                }
                c.event.trigger("cbox_closed");
                a.onClosed && a.onClosed.call(i)
            })
    };
    e.element = function() { return c(i) };
    e.settings = $;
    c(e.init)
})(jQuery);