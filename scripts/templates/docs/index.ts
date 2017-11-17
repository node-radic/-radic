import { LoDashStatic } from 'lodash';


export class Docs {

    $body: JQuery
    $nav: JQuery
    $popovers: JQuery
    $tooltips: JQuery
    $bsComponent: JQuery
    $button: JQuery

    constructor() {

        let self          = this;
        this.$body        = $('body');
        this.$nav         = $('#navbar-top');
        this.$popovers    = $('.bs-component [data-toggle="popover"]');
        this.$tooltips    = $('.bs-component [data-toggle="tooltip"]');
        this.$bsComponent = $('.bs-component');
        this.$button      = $('<div id=\'source-button\' class=\'btn btn-primary btn-xs\'>&lt; &gt;</div>').click(function () {
            let html = $(this).parent().html();
            html     = self.cleanSource(html);
            $('#source-modal pre').text(html);
            $('#source-modal').modal();
        });
    }

    initWindowScroll() {
        $(window).scroll(function () {
            const top = $(document).scrollTop();
            $('.splash').css({
                'background-position': '0px -' + (top / 3).toFixed(2) + 'px'
            });
            if ( top > 50 )
                $('#home > .navbar').removeClass('navbar-transparent');
            else
                $('#home > .navbar').addClass('navbar-transparent');
        });
    }

    initLinks() {
        $('a[href=\'#\']').click(function (e) {
            e.preventDefault();
        });
    }

    initPopovers() {
        this.$popovers.popover();
    }

    initTooltips() {
        this.$tooltips.tooltip();
    }

    initBsComponents() {
        let self = this
        this.$bsComponent.hover(function () {
            $(this).append(self.$button);
            self.$button.show();
        }, function () {
            self.$button.hide();
        });
    }


    cleanSource(html) {
        html = html.replace(/×/g, '&times;')
            .replace(/«/g, '&laquo;')
            .replace(/»/g, '&raquo;')
            .replace(/←/g, '&larr;')
            .replace(/→/g, '&rarr;');

        let lines = html.split(/\n/);

        lines.shift();
        lines.splice(- 1, 1);

        const indentSize = lines[ 0 ].length - lines[ 0 ].trim().length,
              re         = new RegExp(' {' + indentSize + '}');

        lines = lines.map(function (line) {
            if ( line.match(re) ) {
                line = line.substring(indentSize);
            }

            return line;
        });

        lines = lines.join('\n');

        return lines;
    }


    init() {
        this.initWindowScroll()
        this.initLinks()
        this.initPopovers()
        this.initTooltips()
        this.initBsComponents();
    }
}

$(() => {
    // const docs = new Docs;
    // docs.init();

});

(function(){
    $(window).scroll(function () {
        var top = $(document).scrollTop();
        $('.splash').css({
            'background-position': '0px -'+(top/3).toFixed(2)+'px'
        });
        if(top > 50)
            $('#home > .navbar').removeClass('navbar-transparent');
        else
            $('#home > .navbar').addClass('navbar-transparent');
    });

    $("a[href='#']").click(function(e) {
        e.preventDefault();
    });

    var $button = $("<div id='source-button' class='btn btn-primary btn-xs'>&lt; &gt;</div>").click(function(){
        var html = $(this).parent().html();
        html = cleanSource(html);
        $("#source-modal pre").text(html);
        $("#source-modal").modal();
    });

    $('.bs-component [data-toggle="popover"]').popover();
    $('.bs-component [data-toggle="tooltip"]').tooltip();

    $(".bs-component").hover(function(){
        $(this).append($button);
        $button.show();
    }, function(){
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

        var indentSize = lines[0].length - lines[0].trim().length,
            re = new RegExp(" {" + indentSize + "}");

        lines = lines.map(function(line){
            if (line.match(re)) {
                line = line.substring(indentSize);
            }

            return line;
        });

        lines = lines.join("\n");

        return lines;
    }

})();
