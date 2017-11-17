(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Docs = /** @class */ (function () {
        function Docs() {
            var self = this;
            this.$body = $('body');
            this.$nav = $('#navbar-top');
            this.$popovers = $('.bs-component [data-toggle="popover"]');
            this.$tooltips = $('.bs-component [data-toggle="tooltip"]');
            this.$bsComponent = $('.bs-component');
            this.$button = $('<div id=\'source-button\' class=\'btn btn-primary btn-xs\'>&lt; &gt;</div>').click(function () {
                var html = $(this).parent().html();
                html = self.cleanSource(html);
                $('#source-modal pre').text(html);
                $('#source-modal').modal();
            });
        }
        Docs.prototype.initWindowScroll = function () {
            $(window).scroll(function () {
                var top = $(document).scrollTop();
                $('.splash').css({
                    'background-position': '0px -' + (top / 3).toFixed(2) + 'px'
                });
                if (top > 50)
                    $('#home > .navbar').removeClass('navbar-transparent');
                else
                    $('#home > .navbar').addClass('navbar-transparent');
            });
        };
        Docs.prototype.initLinks = function () {
            $('a[href=\'#\']').click(function (e) {
                e.preventDefault();
            });
        };
        Docs.prototype.initPopovers = function () {
            this.$popovers.popover();
        };
        Docs.prototype.initTooltips = function () {
            this.$tooltips.tooltip();
        };
        Docs.prototype.initBsComponents = function () {
            var self = this;
            this.$bsComponent.hover(function () {
                $(this).append(self.$button);
                self.$button.show();
            }, function () {
                self.$button.hide();
            });
        };
        Docs.prototype.cleanSource = function (html) {
            html = html.replace(/×/g, '&times;')
                .replace(/«/g, '&laquo;')
                .replace(/»/g, '&raquo;')
                .replace(/←/g, '&larr;')
                .replace(/→/g, '&rarr;');
            var lines = html.split(/\n/);
            lines.shift();
            lines.splice(-1, 1);
            var indentSize = lines[0].length - lines[0].trim().length, re = new RegExp(' {' + indentSize + '}');
            lines = lines.map(function (line) {
                if (line.match(re)) {
                    line = line.substring(indentSize);
                }
                return line;
            });
            lines = lines.join('\n');
            return lines;
        };
        Docs.prototype.init = function () {
            this.initWindowScroll();
            this.initLinks();
            this.initPopovers();
            this.initTooltips();
            this.initBsComponents();
        };
        return Docs;
    }());
    exports.Docs = Docs;
    $(function () {
        // const docs = new Docs;
        // docs.init();
    });
    (function () {
        $(window).scroll(function () {
            var top = $(document).scrollTop();
            $('.splash').css({
                'background-position': '0px -' + (top / 3).toFixed(2) + 'px'
            });
            if (top > 50)
                $('#home > .navbar').removeClass('navbar-transparent');
            else
                $('#home > .navbar').addClass('navbar-transparent');
        });
        $("a[href='#']").click(function (e) {
            e.preventDefault();
        });
        var $button = $("<div id='source-button' class='btn btn-primary btn-xs'>&lt; &gt;</div>").click(function () {
            var html = $(this).parent().html();
            html = cleanSource(html);
            $("#source-modal pre").text(html);
            $("#source-modal").modal();
        });
        $('.bs-component [data-toggle="popover"]').popover();
        $('.bs-component [data-toggle="tooltip"]').tooltip();
        $(".bs-component").hover(function () {
            $(this).append($button);
            $button.show();
        }, function () {
            $button.hide();
        });
        function cleanSource(html) {
            html = html.replace(/×/g, "&times;")
                .replace(/«/g, "&laquo;")
                .replace(/»/g, "&raquo;")
                .replace(/←/g, "&larr;")
                .replace(/→/g, "&rarr;");
            var lines = html.split(/\n/);
            lines.shift();
            lines.splice(-1, 1);
            var indentSize = lines[0].length - lines[0].trim().length, re = new RegExp(" {" + indentSize + "}");
            lines = lines.map(function (line) {
                if (line.match(re)) {
                    line = line.substring(indentSize);
                }
                return line;
            });
            lines = lines.join("\n");
            return lines;
        }
    })();
});
//# sourceMappingURL=index.js.map