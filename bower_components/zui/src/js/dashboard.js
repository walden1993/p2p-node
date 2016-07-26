/* ========================================================================
 * ZUI: dashboard.js
 * http://zui.sexy
 * ========================================================================
 * Copyright (c) 2014 cnezsoft.com; Licensed MIT
 * ======================================================================== */


(function($, Math) {
    'use strict';

    var Dashboard = function(element, options) {
        this.$ = $(element);
        this.options = this.getOptions(options);
        this.draggable = this.$.hasClass('dashboard-draggable') || this.options.draggable;

        this.init();
    };

    Dashboard.DEFAULTS = {
        height: 360,
        shadowType: 'normal',
        sensitive: false,
        circleShadowSize: 100
    };

    Dashboard.prototype.getOptions = function(options) {
        options = $.extend({}, Dashboard.DEFAULTS, this.$.data(), options);
        return options;
    };

    Dashboard.prototype.handleRemoveEvent = function() {
        var afterPanelRemoved = this.options.afterPanelRemoved;
        var tip = this.options.panelRemovingTip;
        this.$.on('click', '.remove-panel', function() {
            var panel = $(this).closest('.panel');
            var name = panel.data('name') || panel.find('.panel-heading').text().replace('\n', '').replace(/(^\s*)|(\s*$)/g, '');
            var index = panel.attr('data-id');

            if(tip === undefined || confirm(tip.format(name))) {
                panel.parent().remove();
                if(afterPanelRemoved && $.isFunction(afterPanelRemoved)) {
                    afterPanelRemoved(index);
                }
            }
        });
    };

    Dashboard.prototype.handleRefreshEvent = function() {
        this.$.on('click', '.refresh-panel', function() {
            var panel = $(this).closest('.panel');
            refreshPanel(panel);
        });
    };

    Dashboard.prototype.handleDraggable = function() {
        var dashboard = this.$;
        var options = this.options;
        var circleShadow = options.shadowType === 'circle';
        var circleSize = options.circleShadowSize;
        var halfCircleSize = circleSize / 2;
        var afterOrdered = options.afterOrdered;

        this.$.addClass('dashboard-draggable');

        this.$.find('.panel-actions').mousedown(function(event) {
            event.preventDefault();
            event.stopPropagation();
        });

        var pColClass;
        this.$.find('.panel-heading').mousedown(function(event) {
            // console.log('--------------------------------');
            var panel = $(this).closest('.panel');
            var pCol = panel.parent();
            var row = panel.closest('.row');
            var dPanel = panel.clone().addClass('panel-dragging-shadow');
            var pos = panel.offset();
            var dPos = dashboard.offset();
            var dColShadow = row.find('.dragging-col-holder');
            var sWidth = panel.width(),
                sHeight = panel.height(),
                sX1, sY1, sX2, sY2, moveFn, dropCol, dropBefore, nextDropCol;
            if(!dColShadow.length) {
                dColShadow = $('<div class="dragging-col-holder"><div class="panel"></div></div>').removeClass('dragging-col').appendTo(row);
            }

            if(pColClass) dColShadow.removeClass(pColClass);
            dColShadow.addClass(pColClass = pCol.attr('class'));

            dColShadow.insertBefore(pCol).find('.panel').replaceWith(panel.clone().addClass('panel-dragging panel-dragging-holder'));

            dashboard.addClass('dashboard-dragging');
            panel.addClass('panel-dragging').parent().addClass('dragging-col');

            dPanel.css({
                left: pos.left - dPos.left,
                top: pos.top - dPos.top,
                width: sWidth,
                height: sHeight
            }).appendTo(dashboard).data('mouseOffset', {
                x: event.pageX - pos.left + dPos.left,
                y: event.pageY - pos.top + dPos.top
            });

            if(circleShadow) {
                dPanel.addClass('circle');
                setTimeout(function() {
                    dPanel.css({
                        left: event.pageX - dPos.left - halfCircleSize,
                        top: event.pageY - dPos.top - halfCircleSize,
                        width: circleSize,
                        height: circleSize
                    }).data('mouseOffset', {
                        x: dPos.left + halfCircleSize,
                        y: dPos.top + halfCircleSize
                    });
                }, 100);
            }

            $(document).bind('mousemove', mouseMove).bind('mouseup', mouseUp);
            event.preventDefault();

            function mouseMove(event) {
                // console.log('......................');
                var offset = dPanel.data('mouseOffset');
                sX1 = event.pageX - offset.x;
                sY1 = event.pageY - offset.y;
                sX2 = sX1 + sWidth;
                sY2 = sY1 + sHeight;
                dPanel.css({
                    left: sX1,
                    top: sY1
                });

                row.find('.dragging-in').removeClass('dragging-in');
                dropBefore = false;
                dropCol = null;
                var area = 0,
                    thisArea;
                row.children(':not(.dragging-col)').each(function() {
                    var col = $(this);
                    if(col.hasClass('dragging-col-holder')) {
                        dropBefore = (!options.sensitive) || (area < 100);
                        return true;
                    }
                    var p = col.children('.panel');
                    var pP = p.offset(),
                        pW = p.width(),
                        pH = p.height();
                    var pX = pP.left,
                        pY = pP.top;

                    if(options.sensitive) {
                        pX -= dPos.left;
                        pY -= dPos.top;
                        thisArea = getIntersectArea(sX1, sY1, sX2, sY2, pX, pY, pX + pW, pY + pH);
                        if(thisArea > 100 && thisArea > area && thisArea > Math.min(getRectArea(sX1, sY1, sX2, sY2), getRectArea(pX, pY, pX + pW, pY + pH)) / 3) {
                            area = thisArea;
                            dropCol = col;
                        }
                        // if(thisArea)
                        // {
                        //     console.log('panel ' + col.data('id'), '({0}, {1}, {2}, {3}), ({4}, {5}, {6}, {7})'.format(sX1, sY1, sX2, sY2, pX, pY, pX + pW, pY + pH));
                        // }
                    } else {
                        var mX = event.pageX,
                            mY = event.pageY;

                        if(mX > pX && mY > pY && mX < (pX + pW) && mY < (pY + pH)) {
                            // var dCol = row.find('.dragging-col');
                            dropCol = col;
                            return false;
                        }
                    }
                });

                if(dropCol) {
                    if(moveFn) clearTimeout(moveFn);
                    nextDropCol = dropCol;
                    moveFn = setTimeout(movePanel, 50);
                }
                event.preventDefault();
            }

            function movePanel() {
                if(nextDropCol) {
                    nextDropCol.addClass('dragging-in');
                    if(dropBefore) dColShadow.insertAfter(nextDropCol);
                    else dColShadow.insertBefore(nextDropCol);
                    dashboard.addClass('dashboard-holding');
                    moveFn = null;
                    nextDropCol = null;
                }
            }

            function mouseUp(event) {
                if(moveFn) clearTimeout(moveFn);

                var oldOrder = panel.data('order');
                panel.parent().insertAfter(dColShadow);
                var newOrder = 0;
                var newOrders = {};

                row.children(':not(.dragging-col-holder)').each(function() {
                    var p = $(this).children('.panel');
                    p.data('order', ++newOrder);
                    newOrders[p.attr('id')] = newOrder;
                    p.parent().attr('data-order', newOrder);
                });

                if(oldOrder != newOrders[panel.attr('id')]) {
                    row.data('orders', newOrders);

                    if(afterOrdered && $.isFunction(afterOrdered)) {
                        afterOrdered(newOrders);
                    }
                }

                dPanel.remove();

                dashboard.removeClass('dashboard-holding');
                dashboard.find('.dragging-col').removeClass('dragging-col');
                dashboard.find('.panel-dragging').removeClass('panel-dragging');
                row.find('.dragging-in').removeClass('dragging-in');
                dashboard.removeClass('dashboard-dragging');
                $(document).unbind('mousemove', mouseMove).unbind('mouseup', mouseUp);
                event.preventDefault();
            }
        });
    };

    Dashboard.prototype.handlePanelPadding = function() {
        this.$.find('.panel-body > table, .panel-body > .list-group').closest('.panel-body').addClass('no-padding');
    };

    Dashboard.prototype.handlePanelHeight = function() {
        var dHeight = this.options.height;

        this.$.find('.row').each(function() {
            var row = $(this);
            var panels = row.find('.panel');
            var height = row.data('height') || dHeight;

            if(typeof height != 'number') {
                height = 0;
                panels.each(function() {
                    height = Math.max(height, $(this).innerHeight());
                });
            }

            panels.each(function() {
                var $this = $(this);
                $this.find('.panel-body').css('height', height - $this.find('.panel-heading').outerHeight() - 2);
            });
        });
    };

    function refreshPanel(panel) {
        var url = panel.data('url');
        if(!url) return;
        panel.addClass('panel-loading').find('.panel-heading .icon-refresh,.panel-heading .icon-repeat').addClass('icon-spin');
        $.ajax({
            url: url,
            dataType: 'html'
        }).done(function(data) {
            panel.find('.panel-body').html(data);
        }).fail(function() {
            panel.addClass('panel-error');
        }).always(function() {
            panel.removeClass('panel-loading');
            panel.find('.panel-heading .icon-refresh,.panel-heading .icon-repeat').removeClass('icon-spin');
        });
    }

    function getRectArea(x1, y1, x2, y2) {
        return Math.abs((x2 - x1) * (y2 - y1));
    }

    function isPointInner(x, y, x1, y1, x2, y2) {
        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    }

    function getIntersectArea(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
        var x1 = Math.max(ax1, bx1),
            y1 = Math.max(ay1, by1),
            x2 = Math.min(ax2, bx2),
            y2 = Math.min(ay2, by2);
        if(isPointInner(x1, y1, ax1, ay1, ax2, ay2) && isPointInner(x2, y2, ax1, ay1, ax2, ay2) && isPointInner(x1, y1, bx1, by1, bx2, by2) && isPointInner(x2, y2, bx1, by1, bx2, by2)) {
            return getRectArea(x1, y1, x2, y2);
        }
        return 0;
    }

    Dashboard.prototype.init = function() {
        this.handlePanelHeight();
        this.handlePanelPadding();
        this.handleRemoveEvent();
        this.handleRefreshEvent();

        if(this.draggable) this.handleDraggable();

        var orderSeed = 0;
        this.$.find('.panel').each(function() {
            var $this = $(this);
            $this.data('order', ++orderSeed);
            if(!$this.attr('id')) {
                $this.attr('id', 'panel' + orderSeed);
            }
            if(!$this.attr('data-id')) {
                $this.attr('data-id', orderSeed);
            }

            refreshPanel($this);
        });
    };

    $.fn.dashboard = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('zui.dashboard');
            var options = typeof option == 'object' && option;

            if(!data) $this.data('zui.dashboard', (data = new Dashboard(this, options)));

            if(typeof option == 'string') data[option]();
        });
    };

    $.fn.dashboard.Constructor = Dashboard;
}(jQuery, Math));

