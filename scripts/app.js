$(function () {
    $("#maincontent > div:gt(0)").hide();
    $(".menu-item a").on("click", function (e) {
        var href = $(this).attr("href");
        $("#maincontent > " + href).show();
        $("#maincontent > :not(" + href + ")").hide();
        $(this).addClass('menu-item-act').siblings().removeClass('menu-item-act');
    });
});