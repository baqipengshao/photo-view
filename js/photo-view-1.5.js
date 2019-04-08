/**
 * 图片缩放工具类
 * @author      alice
 * @date        2019.03.25
 * @version     1.5
 * @require
 * jQuery1.6+ 
 */

(function($) {
    var thumbObj; //缩略图
    var photoViewModal;
    var photoViewBg;
    var photoViewToolbar;
    var photoViewNext;
    var photoViewPrev;
    var photoViewClose;
    var animateTime = 250; //动画时间
    var minScanle = 1; //适应容器大小时最小缩放倍数
    var pw = 2; //横向边距
    var ph = 44; //坚向边距
    var startObj; //创建容器开始位置,最后绝对定位时位置，转换成固定定位的位置
    var absoluteObj;
    var fixedBoj;
    var options = { "imgNaturalSize": null };
    var that;
    var outerBox = {};
    var mouse = {}; // 鼠标当前位置
    var scope = {}; //拖动范围
    var nowScanle; //当前缩放倍数
    var loadingGif = "data:image/gif;base64,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";
    var picsLength = 0; //图片数量
    var picsIndex = 0; //图片索引
    var timer;

    $.fn.extend({
        "photoView": function(_options) {

            var mousePosition = { isDrag: false, x: 0, y: 0 };
            var startMove = {};
            var startXY = [];
            var endXY = [];
            var startX;
            var varstartY;
            var endX;
            var endY;
            var moveStime = 0;
            var moveEtime;
            var isMove = false;
            var boxHtml = "<div id='photo-view-modal' class='photo-view' style='display:none;'>";
            boxHtml += "<div class='photo-view-bg'></div>";
            boxHtml += "<img src='" + loadingGif + "' id='photo-view-inner-img' style='position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;' ondragstart='return false;'/>";
            boxHtml += "<div class='photo-view-tip' style='display: none;'><span></span></div>";
            boxHtml += "<div class='photo-view-top-bar'>";
            boxHtml += "<div class='photo-view-counter'></div>";
            boxHtml += "<div class='msg' style='color:#fff;'></div>";
            boxHtml += "<div class='photo-view-enlarge enlarge' title='enlarge'><div class='enlarge-icon icon-photo-view'><i class='icon-photo-view icon'></i></div></div>";
            boxHtml += "<div class='photo-view-lessen lessen' title='lessen'><div class='lessen-icon icon-photo-view'><i class='icon-photo-view icon'></i></div></div>";
            boxHtml += "<div class='photo-view-download download' title='download'><img src='' width='20' height='20'><div class='download-icon icon-photo-view'><i class='icon-photo-view icon'></i></div></div>";
            boxHtml += "<i class='icon-photo-view icon-close photo-view-button photo-view-close' title='Close'></i>";
            boxHtml += "</div>";
            boxHtml += "<i class='icon-photo-view icon-prev photo-view-button photo-view-prev' title='prev'></i>";
            boxHtml += "<i class='icon-photo-view icon-next photo-view-button photo-view-next' title='next'></i>";
            boxHtml += "</div>";

            $("body").append(boxHtml);

            that = $("#photo-view-inner-img");
            photoViewModal = $("#photo-view-modal");
            photoViewBg = $(".photo-view-bg");
            photoViewToolbar = $(".photo-view-top-bar");
            photoViewNext = $(".photo-view-next");
            photoViewPrev = $(".photo-view-prev");
            photoViewEnlarge = $(".photo-view-enlarge");
            photoViewLessen = $(".photo-view-lessen");
            photoViewDownload = $(".photo-view-download img");
            photoViewClose = $(".photo-view-close");

            //图片绑定点击事件
            $(this).on("click", function() {
                thumbObj = $(this);

                pics = $(this).parent().children();
                picsLength = pics.length;

                var imgUrl = $(this).attr("img-url");

                picsIndex = $(pics).index($(this));

                // 初始化配置
                if (typeof(_options) === "undefined")
                    options = defaults;
                else
                    options = $.extend({}, defaults, _options);

                loadImage(imgUrl);


            })


            //上一张
            photoViewPrev.on("click", function() {

                if (picsIndex > 0) {
                    picsIndex--;
                    imgUrl = $(pics[picsIndex]).attr("img-url");
                    loadDefaultImg();
                    loadImage(imgUrl);

                } else {
                    showTip("no more pictures");
                }

            })

            //下一张
            photoViewNext.on("click", function() {

                if (picsIndex < picsLength - 1) {
                    picsIndex++;
                    imgUrl = $(pics[picsIndex]).attr("img-url");
                    loadDefaultImg();
                    loadImage(imgUrl);

                } else {
                    showTip("no more pictures");
                }

            })
            //放大
            photoViewEnlarge.on("click", function() {
                setMouseMiddel();
                $(this).photo_ZoomIn();
            })
            //缩小
            photoViewLessen.on("click", function() {
                setMouseMiddel();
                $(this).photo_ZoomOut();
            })

            //关闭
            photoViewClose.on("click", function() {
                photoViewToolbar.hide();
                photoViewNext.hide();
                photoViewPrev.hide();
                photoViewBg.animate({ "opacity": 0 }, animateTime);
                that.animate({ "width": startObj.width, "height": startObj.height, "top": 0, "left": 0 }, animateTime);
                photoViewModal.css(absoluteObj).animate(startObj, animateTime, function() {
                    photoViewModal.hide();
                    outerBox = {};
                    scope = {};
                });


            })


            // 初始化鼠标滚动监听器
            $(photoViewModal, that).on('mousewheel', function(event, delta) {
                event.preventDefault();
                if (delta > 0)
                    that.photo_ZoomIn();
                else
                    that.photo_ZoomOut();
                return false;
            });
            // 初始化拖动监听器
            that.on("mousedown", function(e) {
                e.preventDefault();
                window.clearInterval(timer);
                var offset = $(this).offset();

                mousePosition.x = -offset.left + e.pageX;
                mousePosition.y = -offset.top + e.pageY;
                mousePosition.isDrag = true;
                e.stopPropagation();


            });

            that.mouseup(function(e) {
                e.preventDefault();
                var offset = that.offset();
                moveEtime = new Date().getTime();
                if (moveEtime - moveStime < 200) {
                    cMove(offset, startMove, e, moveStime, moveEtime);
                } else {
                    fMove(offset);
                }
                moveStime = 0;
                isMove = false;
                mousePosition.isDrag = false;
            });
            that.mouseleave(function(e) {
                e.preventDefault();
                var offset = that.offset();
                moveEtime = new Date().getTime();
                if (moveEtime - moveStime < 200) {
                    cMove(offset, startMove, e, moveStime, moveEtime);
                } else {
                    fMove(offset);
                }
                moveStime = 0;
                isMove = false;
                mousePosition.isDrag = false;
            });
            that.mousemove(function(e) {
                e.preventDefault();
                var oft = getOffset(e.pageX - mousePosition.x, e.pageY - mousePosition.y, 0.3);
                if (mousePosition.isDrag) {
                    if (!moveStime) {
                        moveStime = new Date().getTime(); //开始移动的时间点
                        startMove.pageX = e.pageX;
                        startMove.pageY = e.pageY;
                    }
                    isMove = true;
                    $(this).photo_reOffset(oft.left, oft.top);
                }

                mouse.x = e.pageX;
                mouse.y = e.pageY;


            });

            //mobile
            that.on("touchstart", function(e) {
                e.preventDefault();
                window.clearInterval(timer);
                var offset = $(this).offset();

                //初始两点
                startXY = e.originalEvent.targetTouches;
                fingers = e.originalEvent.touches.length; // 屏幕上手指数量

                mousePosition.x = -offset.left + startXY[0].pageX;
                mousePosition.y = -offset.top + startXY[0].pageY;
                mousePosition.isDrag = true;

            });
            that.on("touchend", function(e) {
                e.preventDefault();
                var offset = that.offset();

                moveEtime = new Date().getTime();
                fingers = e.originalEvent.touches.length;
                if (endXY[0]) {
                    if (moveStime > 0) {
                        if (moveEtime - moveStime < 300) {
                            cMove(offset, startXY[0], endXY[0], moveStime, moveEtime);
                        } else {
                            fMove(offset);
                        }
                    }
                }

                moveStime = 0;
                mousePosition.isDrag = false;
                that.attr("dH", that.height());
                that.attr("dW", that.width());

                //更改头部菜单状态,手指都离开时再判断    
                if (fingers == 0) {
                    if (isMove == false) {
                        if (photoViewToolbar.is(":visible")) {
                            photoViewToolbar.fadeOut(200);
                        } else {
                            photoViewToolbar.fadeIn(200);
                        }
                    }

                    isMove = false;
                }


            });

            that.on("touchcancel", function(e) {
                e.preventDefault();

            });
            photoViewModal.on("touchmove", function(e) {
                e.preventDefault();
            })
            that.on("touchmove", function(e) {

                e.preventDefault();
                endXY = e.originalEvent.targetTouches;
                fingers = e.originalEvent.touches.length; // 屏幕上手指数量       

                if (fingers == 2) {

                    //缩放比例
                    var scanle = ($(this).photo_getDistance(endXY[0], endXY[1])) / ($(this).photo_getDistance(startXY[0], startXY[1]));
                    //设光标位置为两手指之间
                    mouse.x = (startXY[0].pageX + startXY[1].pageX) / 2;
                    mouse.y = (startXY[0].pageY + startXY[1].pageY) / 2;

                    if (scanle > 1) {
                        //放大
                        $(this).photo_ZoomInMobile(scanle);

                    } else if (scanle == 1) {
                        //不变

                    } else {
                        //缩小
                        $(this).photo_ZoomOutMobile(scanle);
                    }

                    moveStime = 0;
                    isMove = true;
                }

                if (fingers == 1 && mousePosition.isDrag) {

                    if (!moveStime) {
                        moveStime = new Date().getTime(); //开始移动的时间点

                    }

                    var oft = getOffset(endXY[0].pageX - mousePosition.x, endXY[0].pageY - mousePosition.y, 0.3);


                    $(this).photo_reOffset(oft.left, oft.top);
                    isMove = true;

                }


            });


        },


        // 显示图片索引与图片数
        "photo_showCounter": function(index, length) {
            $(".photo-view-counter").html((index + 1) + " / " + length);
        },

        //移动端放大
        "photo_ZoomInMobile": function(scanle) {
            var offset0 = that.offset();
            var h0 = that.height();
            var w0 = that.width();

            var dH = that.attr("dH");
            var dW = that.attr("dW");
            var h1 = dH * scanle;
            var w1 = dW * scanle;
            that.height(parseInt(h1));
            that.width(parseInt(w1));
            nowScanle = h1 / options.imgNaturalSize.height; //对原图放大的倍数
            nowScanle = nowScanle.toFixed(3);
            if (nowScanle > 10) {
                nowScanle = 10;
                that.height(options.imgNaturalSize.height * 10);
                that.width(options.imgNaturalSize.width * 10);
            }

            initScope();
            showTip((nowScanle * 100).toFixed(0) + "%");

            var newXY = getZoomOffset(offset0, h0, w0);
            $(this).photo_reOffset(parseInt(newXY.left), parseInt(newXY.top));


        },

        //移动端缩小
        "photo_ZoomOutMobile": function(scanle) {
            var offset0 = that.offset();
            var h0 = that.height();
            var w0 = that.width();

            var dH = that.attr("dH");
            var dW = that.attr("dW");
            var h1 = dH * scanle;
            var w1 = dW * scanle;
            that.height(parseInt(h1));
            that.width(parseInt(w1));

            nowScanle = h1 / options.imgNaturalSize.height; //对原图放大的倍数
            nowScanle = nowScanle.toFixed(3);

            if (minScanle >= 1) {
                if (nowScanle <= 1) {
                    nowScanle = 1;
                    that.height(options.imgNaturalSize.height * 1);
                    that.width(options.imgNaturalSize.width * 1);
                }

            } else {
                if (nowScanle <= minScanle) {
                    nowScanle = minScanle;
                    that.height(parseInt(options.imgNaturalSize.height * minScanle));
                    that.width(parseInt(options.imgNaturalSize.width * minScanle));
                }

            }
            initScope();

            showTip((nowScanle * 100).toFixed(0) + "%");

            var newXY = getZoomOffset(offset0, h0, w0);

            $(this).photo_reOffset(newXY.left, newXY.top);


        },


        //两点距离
        "photo_getDistance": function(p1, p2) {
            var x = p2.pageX - p1.pageX,
                y = p2.pageY - p1.pageY;
            return Math.sqrt((x * x) + (y * y));
        },

        // 图片放大,最大只能为原始图片的10倍
        "photo_ZoomIn": function() {

            var offset0 = that.offset();
            var h0 = that.height();
            var w0 = that.width();
            that.height(parseInt(h0 * (1 + options.rate)));
            that.width(parseInt(w0 * (1 + options.rate)));

            nowScanle = that.width() / options.imgNaturalSize.width;
            if (nowScanle > 10) {
                nowScanle = 10;
                that.height(options.imgNaturalSize.height * 10);
                that.width(options.imgNaturalSize.width * 10);
            }

            initScope();
            showTip((nowScanle * 100).toFixed(0) + "%");

            var newXY = getZoomOffset(offset0, h0, w0);
            $(this).photo_reOffset(newXY.left, newXY.top);

        },



        // 图片缩小
        "photo_ZoomOut": function() {

            var offset0 = that.offset();
            var h0 = that.height();
            var w0 = that.width();

            that.height(parseInt(h0 * (1 - options.rate)));
            that.width(parseInt(w0 * (1 - options.rate)));
            nowScanle = that.width() / options.imgNaturalSize.width;

            if (minScanle > 0.1) {
                if (nowScanle <= 0.1) {
                    that.height(options.imgNaturalSize.height * 0.1);
                    that.width(options.imgNaturalSize.width * 0.1);
                    nowScanle = 0.1;
                }

            } else {
                if (nowScanle <= minScanle) {
                    that.height(options.imgNaturalSize.height * minScanle);
                    that.width(options.imgNaturalSize.width * minScanle);
                    nowScanle = minScanle;
                }

            }

            initScope();

            showTip((nowScanle * 100).toFixed(0) + "%");
            var newXY = getZoomOffset(offset0, h0, w0);
            $(this).photo_reOffset(newXY.left, newXY.top);


        },
        // 图片拖动
        // x>0向右移动，y>0向下移动
        "photo_reOffset": function(x, y) {
            that.offset({ "left": x, "top": y });

        },



    });

    /**
     * 匀减速运动
     * @param offset 物体原来位置
     * @param xy1 开始移动时的座标
     * @param xy2 鼠标或手指离开时的座标
     * @param time1 开始移动的时间
     * @param time2 鼠标或手指离开时的时间
     */
    var cMove = function(offset, xy1, xy2, time1, time2) {
        var dx = xy2.pageX - xy1.pageX;
        var dy = xy2.pageY - xy1.pageY;
        //x轴和Y轴移动的距离,默认给一个小数,保证分母不为0
        dx = (dx != 0) ? dx : 0.1;
        dy = (dy != 0) ? dy : 0.1;
        var sbli = Math.abs(dx / dy).toFixed(2);

        //初始速度
        var v0 = $(this).photo_getDistance(xy1, xy2) / (time2 - time1);
        var a = 0.01; //加速度
        // S= v0*t-a*t*t/2;//位移公式
        var t = parseInt(v0 / a);
        var S = v0 * (v0 / a) - a * (v0 / a) * (v0 / a) / 2;

        var t1 = 5;
        var t2 = t1;
        var s1;

        var countTime = function() {


            if (t2 > t) {
                t2 = t;
                s1 = v0 * t2 - a * t2 * t2 / 2;
                window.clearInterval(timer);

            } else {
                s1 = (v0 * t2 - a * t2 * t2 / 2).toFixed(1);

                //s1*s1=(sbli*y1)*(sbli*y1)+y1*y1;
                //s1*s1 = (y1*y1)*((sbli*sbli)+1)
                var y1 = Math.sqrt((s1 * s1) / ((sbli * sbli) + 1)).toFixed(1);
                var x1 = (sbli * y1).toFixed(1);

                var newX, newY;
                newX = (dx < 0) ? -x1 : x1
                newY = (dy < 0) ? -y1 : y1

                var currentX = Number(offset.left) + Number(newX);
                var currentY = Number(offset.top) + Number(newY);

                var oft = getOffset(currentX, currentY);

                $(this).photo_reOffset(oft.left, oft.top);

                t2 = t2 + t1;
            }
        };
        timer = window.setInterval(countTime, t1);
    }

    /**
     * 弹性返回
     * @param offset 物体原来位置
     */
    var fMove = function(offset) {
        var bTop, bLeft;
        var sc = getWinSize();
        if (scope.min_X != scope.max_X) {
            if (offset.left < scope.min_X) {
                bLeft = -(that.width() - outerBox.width) - pw;

            } else if (offset.left > scope.max_X) {

                bLeft = pw;
            } else {
                bLeft = that.css("left");
            }
        }

        if (scope.min_Y != scope.max_Y) {
            if (offset.top < scope.min_Y) {

                bTop = -(that.height() - outerBox.height) - ph;
            } else if (offset.top > scope.max_Y) {

                bTop = ph;

            } else {
                bTop = that.css("top");
            }
        }

        that.animate({ "left": bLeft, "top": bTop }, 200);
    }


    var loadDefaultImg = function() {
        that.attr("src", "");
        that.removeAttr("style").css({ "position": "absolute", "top": "0", "left": "0", "right": "0", "bottom": "0", "margin": "auto" });
        that.attr("src", loadingGif);
    }

    //显示提示信息
    var showTip = function(con) {
        photoViewModal.find(".photo-view-tip").remove();
        $("<div class='photo-view-tip'><span>' + con + '</span></div>").appendTo(photoViewModal).fadeOut(1200);
    }
    //显示提示信息
    var showMsg = function(con) {
        $(".msg").find(".msg-tip").remove();
        $("<div class='msg-tip'><span>' + con + '</span></div>").appendTo($(".msg")).fadeOut(1000);
    }


    /**
     * 设置图片移动范围
     */
    var initScope = function() {

        var sc = getWinSize();
        if (typeof(outerBox.width) != "undefined") {
            var canmoveW = that.width() - outerBox.width,
                canmoveH = that.height() - (outerBox.height);

            if (canmoveW >= 0) {
                scope.min_X = -canmoveW - pw + outerBox.left + sc.scrollLeft;
                scope.max_X = outerBox.left + pw + sc.scrollLeft;
            } else if (canmoveW >= -pw * 2 && canmoveW < 0) {
                scope.min_X = -canmoveW - pw + outerBox.left + sc.scrollLeft;
                scope.max_X = pw + outerBox.left + sc.scrollLeft;
            } else {
                scope.min_X = -canmoveW / 2 + outerBox.left + sc.scrollLeft;
                scope.max_X = scope.min_X;
            }
            if (canmoveH >= 0) {
                scope.min_Y = -canmoveH - ph + outerBox.top + sc.scrollTop;
                scope.max_Y = outerBox.top + ph + sc.scrollTop;
            } else if (canmoveH >= -ph * 2 && canmoveH < 0) {
                scope.min_Y = -canmoveH - ph + outerBox.top + sc.scrollTop;
                scope.max_Y = ph + outerBox.top + sc.scrollTop;
            } else {
                scope.min_Y = -canmoveH / 2 + outerBox.top + sc.scrollTop;
                scope.max_Y = scope.min_Y;
            }

        }

    }

    /*
     * 缩小时设置图片的座标
     * @param offset 缩放前图片偏移量
     * @param h 缩放前图片高度
     * @param w 缩放前图片宽度
     */
    var getZoomOffset = function(offset, h, w) {
        var sc = getWinSize();
        var left, top;
        if (that.width() > outerBox.width - pw * 2) {
            left = parseInt((mouse.x - that.width() * (mouse.x - offset.left) / w));

            if (left < scope.min_X) {
                left = scope.min_X;
            }
            if (left > scope.max_X) {
                left = scope.max_X;
            }

        } else {
            left = -(that.width() - outerBox.width) / 2 + outerBox.left + sc.scrollLeft;
        }

        if (that.height() > outerBox.height - ph * 2) {
            top = (mouse.y - that.height() * (mouse.y - offset.top) / h);

            if (top < scope.min_Y) {
                top = scope.min_Y;
            }
            if (top > scope.max_Y) {
                top = scope.max_Y;
            }

        } else {
            top = -(that.height() - outerBox.height) / 2 + outerBox.top + sc.scrollTop;
        }

        return { "left": parseInt(left), "top": parseInt(top) };

    }

    /**
     * 拖动时设置图片的座标
     * @param currentX 当前图片X轴
     * @param currentY 当前图片Y轴
     * @param extMax 超出拖动范围的倍数
     */
    var getOffset = function(currentX, currentY, extMax) {
        var extMax = extMax || 0;
        var rx = currentX;
        var ry = currentY;
        var oftX, oftY;

        oftX = rx;
        if (scope.min_X < scope.max_X) {
            if (rx < scope.min_X) {
                oftX = scope.min_X - (scope.min_X - rx) * extMax;
            }
            if (rx > scope.max_X) {
                oftX = scope.max_X + (rx - scope.max_X) * extMax;
            }
        } else {

            oftX = that.offset().left;
        }

        oftY = ry;
        if (scope.min_Y < scope.max_Y) {
            if (ry < scope.min_Y) {
                oftY = scope.min_Y - (scope.min_Y - ry) * extMax;
            }
            if (ry > scope.max_Y) {
                oftY = scope.max_Y + (ry - scope.max_Y) * extMax;
            }
        } else {

            oftY = that.offset().top;
        }
        oftX = oftX.toFixed(1);
        oftY = oftY.toFixed(1);

        return ({ left: oftX, top: oftY });
    }

    /**
     * 异步获取图片大小，需要等待图片加载完后才能判断图片实际大小
     * @param img
     * @param fn        {width:rw, height:rh}
     */
    var getImageSize = function(url, fn) {
        var img = new Image();
        img.src = url;
        img.onload = function() {
            fn(_getImageSize(img));
        }

    };

    /**
     * 获取图片大小的子方法
     * @param img
     * @private
     */
    var _getImageSize = function(img) {
        if (typeof img.naturalWidth === "undefined") {
            var rw = img.width;
            var rh = img.height;
        } else {
            var rw = img.naturalWidth;
            var rh = img.naturalHeight;
        }

        return { width: rw, height: rh };
    }

    /**
     * 加载图片
     * @param src
     */
    var loadImage = function(src) {
        var winSize = getWinSize();
        photoViewDownload.attr("src", src);
        getImageSize(src, function(size) {
            options.imgNaturalSize = size;

            var visible = photoViewModal.is(":visible");

            if (visible == false) {

                that.removeAttr("style");
                var start = {
                    width: parseInt(thumbObj.attr("width")) || parseInt(thumbObj.css("width")),
                    height: parseInt(thumbObj.attr("height")) || parseInt(thumbObj.css("height")),
                    display: "block",
                    position: "absolute",
                    top: thumbObj.offset().top,
                    left: thumbObj.offset().left,
                }

                startObj = start;
                that.css({ "width": start.width, "height": start.height });
                that.attr("src", src);

                photoViewModal.css(start);

                var el = initBoxView(photoViewModal, options.imgNaturalSize, winSize);

                photoViewModal.animate(el.boxAbsolute, animateTime, function() {
                    photoViewModal.css(el.boxFixed);
                    photoViewToolbar.show();

                    $(this).photo_showCounter(picsIndex, picsLength);
                })

                $(".photo-view-bg").animate({ "opacity": 1 }, animateTime);

                that.animate(el.img, animateTime, function() {

                    that.attr({ "dH": el.img.height, "dW": el.img.width });
                    outerBox.width = el.box.width;
                    outerBox.height = el.box.height;
                    outerBox.top = el.boxFixed.top;
                    outerBox.left = el.boxFixed.left;
                    //初始光标为容器中间点
                    mouse.x = (el.box.width + el.boxFixed.left + el.boxFixed.left) / 2 + winSize.scrollLeft;
                    mouse.y = (el.box.height + el.boxFixed.top + el.boxFixed.top) / 2 + winSize.scrollTop;
                    initScope();

                });


            } else {


                that.removeAttr("style");
                var el = initBoxView(photoViewModal, options.imgNaturalSize, winSize);
                photoViewModal.css(el.boxFixed);
                that.css(el.img);
                that.attr({ "dH": el.img.height, "dW": el.img.width });
                that.attr("src", src);
                $(this).photo_showCounter(picsIndex, picsLength);
                outerBox.width = el.box.width;
                outerBox.height = el.box.height;
                outerBox.top = el.boxFixed.top;
                outerBox.left = el.boxFixed.left;
                //初始光标为容器中间点
                mouse.x = (el.box.width + el.boxFixed.left + el.boxFixed.left) / 2 + winSize.scrollLeft;
                mouse.y = (el.box.height + el.boxFixed.top + el.boxFixed.top) / 2 + winSize.scrollTop;
                initScope();


            }

            if (picsIndex < picsLength - 1) {
                photoViewNext.show();
            } else {
                photoViewNext.hide();
            }
            if (picsIndex > 0) {
                photoViewPrev.show();
            } else {
                photoViewPrev.hide();
            }



        });
    };

    /**
     * 获取最终图片和容器大小
     * @paran selector 容器
     * @paran imgSize 图片大小
     * @paran winSize 可视区域大小
     * @paran isResize 是否是窗口变化
     * @return obj
     */
    function initBoxView(selector, imgSize, winSize, isResize) {
        var isResize = isResize || 0;
        if (winSize.width > 720) {

            var bw = imgSize.width / (winSize.width - pw * 2),
                bh = imgSize.height / (winSize.height - ph * 2);

            if (bw > 1 || bh > 1) {
                minScanle = (bw >= bh) ? (1 / bw) : (1 / bh);
            } else {
                minScanle = 1;
            }

            var newImg = { "width": parseInt(imgSize.width * minScanle), "height": parseInt(imgSize.height * minScanle) };
            var newBox = { "width": newImg.width + pw * 2, "height": newImg.height + ph * 2 };
        } else {
            var bw = imgSize.width / (winSize.width),
                bh = imgSize.height / (winSize.height);

            if (bw > 1 || bh > 1) {
                minScanle = (bw >= bh) ? (1 / bw) : (1 / bh);
            } else {
                minScanle = 1;
            }

            var newImg = { "width": parseInt(imgSize.width * minScanle), "height": parseInt(imgSize.height * minScanle) };
            var newBox = { "width": winSize.width, "height": winSize.height };

        }

        if (!isResize) {
            //容器只能由小到大
            if (outerBox.width > newBox.width) {
                newBox.width = outerBox.width;
            }
            if (outerBox.height > newBox.height) {
                newBox.height = outerBox.height;
            }
        }

        newImg.top = (newBox.height - newImg.height) / 2;
        newImg.left = (newBox.width - newImg.width) / 2;


        var y = (winSize.height - newBox.height) / 2,
            x = (winSize.width - newBox.width) / 2;

        var nTop = y + parseInt(winSize.scrollTop),
            nLeft = x + winSize.scrollLeft;
        //box ->absolute
        var boxAbsolute = {
            "width": newBox.width,
            "height": newBox.height,
            "position": "absolute",
            "left": nLeft,
            "top": nTop < winSize.scrollTop ? winSize.scrollTop : nTop,
            "z-index": 10000,

        }
        //box ->fixed
        var boxFixed = {
            "width": newBox.width,
            "height": newBox.height,
            "position": "fixed",
            "left": x,
            "top": y,
            "z-index": 10000,

        }
        absoluteObj = boxAbsolute;
        fixedObj = boxFixed;

        return { "img": newImg, "box": newBox, "boxAbsolute": boxAbsolute, "boxFixed": boxFixed };

    }


    /**
     * 获取屏幕大小
     * @return obj
     */
    var getWinSize = function() {
        var w = document.documentElement.clientWidth || document.body.clientWidth,
            h = document.documentElement.clientHeight || document.body.clientHeight;
        var size = {
            width: w,
            height: h,
            scrollTop: $(window).scrollTop(),
            scrollLeft: $(window).scrollLeft()
        }
        return size;
    }

    var getElementSize = function(selector) {
        return {
            width: $(selector).width(),
            height: $(selector).height()
        }
    }
    /**
     * 设置光标为中间点
     */
    var setMouseMiddel = function() {
        var winSize = getWinSize();
        var el = initBoxView(photoViewModal, options.imgNaturalSize, winSize);
        //光标为容器中间点
        mouse.x = (el.box.width + el.boxFixed.left + el.boxFixed.left) / 2 + winSize.scrollLeft;
        mouse.y = (el.box.height + el.boxFixed.top + el.boxFixed.top) / 2 + winSize.scrollTop;
    }

    /**
     * 默认缩放倍数
     */
    var defaults = {
        rate: 0.2,
    }

    /**
     * 监听滚动条
     */
    window.onscroll = function() {
        //var st = document.documentElement.scrollTop||document.body.scrollTop;
        //showMsg(st);
        initScope();

    }

    /**
     * 监听窗口变化
     */
    $(window).resize(function() {
        var winSize = getWinSize();
        if (options.imgNaturalSize) {
            var el = initBoxView(photoViewModal, options.imgNaturalSize, winSize, 1);

            photoViewModal.css(el.boxFixed);
            that.css(el.img);
            outerBox.width = el.box.width;
            outerBox.height = el.box.height;
            outerBox.top = el.boxFixed.top;
            outerBox.left = el.boxFixed.left;
            //初始光标为容器中间点
            mouse.x = (el.box.width + el.boxFixed.left + el.boxFixed.left) / 2;
            mouse.y = (el.box.height + el.boxFixed.top + el.boxFixed.top) / 2;
            initScope();
        }

    })

})(window.jQuery);