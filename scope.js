/**
 * @file scope.js
 * @desc 轻量级代码组织框架
 * @dependency Zepto/jQuery/RUN
 * @author Phil Li <zixulee@163.com>
 */

(function (root, undefined) {

    var Scope = function (object) {

        var self = arguments.callee;
        var pt = self.prototype;
        
        self.events = {};
        
        if (!(this instanceof self)) return new self(object);
        
        !pt._init && (pt._init = function () {

            var that = this;
            var $doc = $(document);
            var el = this.el;
            if (!el) {
                el = this.el = this.tagName ? '<' + this.tagName.replace(/^\<|(\/)*\>&/g, '') + ' />' : 'body';
            }
            this.$el = $(el);
            var events = this.events;

            if (events) {
                for (var key in events) {
                    var handler = events[key];

                    (function (key, handler) {
                        setTimeout(function () {
                            if (!handler) return;
                            var evtArr = $.trim(key = key.replace(/\s+/g, ' ')).split(' ');
                            var evts = evtArr.shift();
                            if (!evts || !evtArr.length) return;

                            $.inArray('window', evtArr) < 0 && $.inArray('document', evtArr) < 0 && $.inArray('body', evtArr) < 0 && evtArr.unshift(el);
                            var selector = evtArr.join(' ');
                            var handlerName = '';
                            typeof handler === 'string' && (handlerName = handler);

                            $.each(evts.split(','), function (i, evt) {
                                if (handlerName) {
                                    var fullEventName = evt + '|' + selector.replace(/\s+/g, '~') + '|' + handlerName;

                                    if (!self.events[fullEventName]) {
                                        var isSameOne;

                                        for (var existOne in self.events) {
                                            var existArr = existOne.split('|');
                                            if (existArr.length < 3) continue;
                                            var existEvt = existArr[0];
                                            var existSelector = existArr[1].replace(/~/, ' ');
                                            var existHandlerName = existArr[2];
                                            if (evt === existEvt && selector === existSelector && handlerName === existHandlerName) {
                                                isSameOne = true;
                                                break;
                                            }
                                        }

                                        if (!isSameOne) {
                                            $.each(evt.split(','), function (i, e) {
                                                $doc.on(e, selector, function (event) {
                                                    handlerName ? ($.isFunction(that[handler]) && that[handler].apply(that, arguments)) : (handler && handler.apply(that, arguments));
                                                });
                                            });
                                            self.events[fullEventName] = true;
                                        }

                                    }
                                } else {
                                    $.each(evt.split(','), function (i, e) {
                                        $doc.on(e, selector, function (event) {
                                            handlerName ? ($.isFunction(that[handler]) && that[handler].apply(that, arguments)) : (handler && handler.apply(that, arguments));
                                        });
                                    });
                                }
                            });
                        });
                    })(key, handler);
                }
            }

            var init = this.init || this.initialize;
            init && init.apply(this, arguments);

        });

        var F = function () {
            var self = arguments.callee;
            if (!(this instanceof self)) return new self(arguments);
            this._init.apply(this, arguments);
        };
        $.extend(F.prototype, pt, object);
        return F;
    };

    'undefined' !== typeof module ? module.exports = scope: root.scope = scope;

})(this);
