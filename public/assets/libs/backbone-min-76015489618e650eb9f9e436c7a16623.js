(function(){var e,t=this,n=t.Backbone,i=[],a=i.push,r=i.slice,o=i.splice;e="undefined"!=typeof exports?exports:t.Backbone={},e.VERSION="1.0.0";var s=t._;s||"undefined"==typeof require||(s=require("underscore")),e.$=t.jQuery||t.Zepto||t.ender||t.$,e.noConflict=function(){return t.Backbone=n,this},e.emulateHTTP=!1,e.emulateJSON=!1;var l=e.Events={on:function(e,t,n){if(!u(this,"on",e,[t,n])||!t)return this;this._events||(this._events={});var i=this._events[e]||(this._events[e]=[]);return i.push({callback:t,context:n,ctx:n||this}),this},once:function(e,t,n){if(!u(this,"once",e,[t,n])||!t)return this;var i=this,a=s.once(function(){i.off(e,a),t.apply(this,arguments)});return a._callback=t,this.on(e,a,n)},off:function(e,t,n){var i,a,r,o,l,c,h,f;if(!this._events||!u(this,"off",e,[t,n]))return this;if(!e&&!t&&!n)return this._events={},this;for(o=e?[e]:s.keys(this._events),l=0,c=o.length;c>l;l++)if(e=o[l],r=this._events[e]){if(this._events[e]=i=[],t||n)for(h=0,f=r.length;f>h;h++)a=r[h],(t&&t!==a.callback&&t!==a.callback._callback||n&&n!==a.context)&&i.push(a);i.length||delete this._events[e]}return this},trigger:function(e){if(!this._events)return this;var t=r.call(arguments,1);if(!u(this,"trigger",e,t))return this;var n=this._events[e],i=this._events.all;return n&&h(n,t),i&&h(i,arguments),this},stopListening:function(e,t,n){var i=this._listeners;if(!i)return this;var a=!t&&!n;"object"==typeof t&&(n=this),e&&((i={})[e._listenerId]=e);for(var r in i)i[r].off(t,n,this),a&&delete this._listeners[r];return this}},c=/\s+/,u=function(e,t,n,i){if(!n)return!0;if("object"==typeof n){for(var a in n)e[t].apply(e,[a,n[a]].concat(i));return!1}if(c.test(n)){for(var r=n.split(c),o=0,s=r.length;s>o;o++)e[t].apply(e,[r[o]].concat(i));return!1}return!0},h=function(e,t){var n,i=-1,a=e.length,r=t[0],o=t[1],s=t[2];switch(t.length){case 0:for(;++i<a;)(n=e[i]).callback.call(n.ctx);return;case 1:for(;++i<a;)(n=e[i]).callback.call(n.ctx,r);return;case 2:for(;++i<a;)(n=e[i]).callback.call(n.ctx,r,o);return;case 3:for(;++i<a;)(n=e[i]).callback.call(n.ctx,r,o,s);return;default:for(;++i<a;)(n=e[i]).callback.apply(n.ctx,t)}},f={listenTo:"on",listenToOnce:"once"};s.each(f,function(e,t){l[t]=function(t,n,i){var a=this._listeners||(this._listeners={}),r=t._listenerId||(t._listenerId=s.uniqueId("l"));return a[r]=t,"object"==typeof n&&(i=this),t[e](n,i,this),this}}),l.bind=l.on,l.unbind=l.off,s.extend(e,l);var d=e.Model=function(e,t){var n,i=e||{};t||(t={}),this.cid=s.uniqueId("c"),this.attributes={},s.extend(this,s.pick(t,p)),t.parse&&(i=this.parse(i,t)||{}),(n=s.result(this,"defaults"))&&(i=s.defaults({},i,n)),this.set(i,t),this.changed={},this.initialize.apply(this,arguments)},p=["url","urlRoot","collection"];s.extend(d.prototype,l,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(){return s.clone(this.attributes)},sync:function(){return e.sync.apply(this,arguments)},get:function(e){return this.attributes[e]},escape:function(e){return s.escape(this.get(e))},has:function(e){return null!=this.get(e)},set:function(e,t,n){var i,a,r,o,l,c,u,h;if(null==e)return this;if("object"==typeof e?(a=e,n=t):(a={})[e]=t,n||(n={}),!this._validate(a,n))return!1;r=n.unset,l=n.silent,o=[],c=this._changing,this._changing=!0,c||(this._previousAttributes=s.clone(this.attributes),this.changed={}),h=this.attributes,u=this._previousAttributes,this.idAttribute in a&&(this.id=a[this.idAttribute]);for(i in a)t=a[i],s.isEqual(h[i],t)||o.push(i),s.isEqual(u[i],t)?delete this.changed[i]:this.changed[i]=t,r?delete h[i]:h[i]=t;if(!l){o.length&&(this._pending=!0);for(var f=0,d=o.length;d>f;f++)this.trigger("change:"+o[f],this,h[o[f]],n)}if(c)return this;if(!l)for(;this._pending;)this._pending=!1,this.trigger("change",this,n);return this._pending=!1,this._changing=!1,this},unset:function(e,t){return this.set(e,void 0,s.extend({},t,{unset:!0}))},clear:function(e){var t={};for(var n in this.attributes)t[n]=void 0;return this.set(t,s.extend({},e,{unset:!0}))},hasChanged:function(e){return null==e?!s.isEmpty(this.changed):s.has(this.changed,e)},changedAttributes:function(e){if(!e)return this.hasChanged()?s.clone(this.changed):!1;var t,n=!1,i=this._changing?this._previousAttributes:this.attributes;for(var a in e)s.isEqual(i[a],t=e[a])||((n||(n={}))[a]=t);return n},previous:function(e){return null!=e&&this._previousAttributes?this._previousAttributes[e]:null},previousAttributes:function(){return s.clone(this._previousAttributes)},fetch:function(e){e=e?s.clone(e):{},void 0===e.parse&&(e.parse=!0);var t=this,n=e.success;return e.success=function(i){return t.set(t.parse(i,e),e)?(n&&n(t,i,e),void t.trigger("sync",t,i,e)):!1},L(this,e),this.sync("read",this,e)},save:function(e,t,n){var i,a,r,o=this.attributes;if(null==e||"object"==typeof e?(i=e,n=t):(i={})[e]=t,!(!i||n&&n.wait||this.set(i,n)))return!1;if(n=s.extend({validate:!0},n),!this._validate(i,n))return!1;i&&n.wait&&(this.attributes=s.extend({},o,i)),void 0===n.parse&&(n.parse=!0);var l=this,c=n.success;return n.success=function(e){l.attributes=o;var t=l.parse(e,n);return n.wait&&(t=s.extend(i||{},t)),s.isObject(t)&&!l.set(t,n)?!1:(c&&c(l,e,n),void l.trigger("sync",l,e,n))},L(this,n),a=this.isNew()?"create":n.patch?"patch":"update","patch"===a&&(n.attrs=i),r=this.sync(a,this,n),i&&n.wait&&(this.attributes=o),r},destroy:function(e){e=e?s.clone(e):{};var t=this,n=e.success,i=function(){t.trigger("destroy",t,t.collection,e)};if(e.success=function(a){(e.wait||t.isNew())&&i(),n&&n(t,a,e),t.isNew()||t.trigger("sync",t,a,e)},this.isNew())return e.success(),!1;L(this,e);var a=this.sync("delete",this,e);return e.wait||i(),a},url:function(){var e=s.result(this,"urlRoot")||s.result(this.collection,"url")||N();return this.isNew()?e:e+("/"===e.charAt(e.length-1)?"":"/")+encodeURIComponent(this.id)},parse:function(e){return e},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return null==this.id},isValid:function(e){return this._validate({},s.extend(e||{},{validate:!0}))},_validate:function(e,t){if(!t.validate||!this.validate)return!0;e=s.extend({},this.attributes,e);var n=this.validationError=this.validate(e,t)||null;return n?(this.trigger("invalid",this,n,s.extend(t||{},{validationError:n})),!1):!0}});var m=["keys","values","pairs","invert","pick","omit"];s.each(m,function(e){d.prototype[e]=function(){var t=r.call(arguments);return t.unshift(this.attributes),s[e].apply(s,t)}});var g=e.Collection=function(e,t){t||(t={}),t.url&&(this.url=t.url),t.model&&(this.model=t.model),void 0!==t.comparator&&(this.comparator=t.comparator),this._reset(),this.initialize.apply(this,arguments),e&&this.reset(e,s.extend({silent:!0},t))},b={add:!0,remove:!0,merge:!0},v={add:!0,merge:!1,remove:!1};s.extend(g.prototype,l,{model:d,initialize:function(){},toJSON:function(e){return this.map(function(t){return t.toJSON(e)})},sync:function(){return e.sync.apply(this,arguments)},add:function(e,t){return this.set(e,s.defaults(t||{},v))},remove:function(e,t){e=s.isArray(e)?e.slice():[e],t||(t={});var n,i,a,r;for(n=0,i=e.length;i>n;n++)r=this.get(e[n]),r&&(delete this._byId[r.id],delete this._byId[r.cid],a=this.indexOf(r),this.models.splice(a,1),this.length--,t.silent||(t.index=a,r.trigger("remove",r,this,t)),this._removeReference(r));return this},set:function(e,t){t=s.defaults(t||{},b),t.parse&&(e=this.parse(e,t)),s.isArray(e)||(e=e?[e]:[]);var n,i,r,l,c,u=t.at,h=this.comparator&&null==u&&t.sort!==!1,f=s.isString(this.comparator)?this.comparator:null,d=[],p=[],m={};for(n=0,i=e.length;i>n;n++)(r=this._prepareModel(e[n],t))&&((l=this.get(r))?(t.remove&&(m[l.cid]=!0),t.merge&&(l.set(r.attributes,t),h&&!c&&l.hasChanged(f)&&(c=!0))):t.add&&(d.push(r),r.on("all",this._onModelEvent,this),this._byId[r.cid]=r,null!=r.id&&(this._byId[r.id]=r)));if(t.remove){for(n=0,i=this.length;i>n;++n)m[(r=this.models[n]).cid]||p.push(r);p.length&&this.remove(p,t)}if(d.length&&(h&&(c=!0),this.length+=d.length,null!=u?o.apply(this.models,[u,0].concat(d)):a.apply(this.models,d)),c&&this.sort({silent:!0}),t.silent)return this;for(n=0,i=d.length;i>n;n++)(r=d[n]).trigger("add",r,this,t);return c&&this.trigger("sort",this,t),this},reset:function(e,t){t||(t={});for(var n=0,i=this.models.length;i>n;n++)this._removeReference(this.models[n]);return t.previousModels=this.models,this._reset(),this.add(e,s.extend({silent:!0},t)),t.silent||this.trigger("reset",this,t),this},push:function(e,t){return e=this._prepareModel(e,t),this.add(e,s.extend({at:this.length},t)),e},pop:function(e){var t=this.at(this.length-1);return this.remove(t,e),t},unshift:function(e,t){return e=this._prepareModel(e,t),this.add(e,s.extend({at:0},t)),e},shift:function(e){var t=this.at(0);return this.remove(t,e),t},slice:function(e,t){return this.models.slice(e,t)},get:function(e){return null==e?void 0:this._byId[null!=e.id?e.id:e.cid||e]},at:function(e){return this.models[e]},where:function(e,t){return s.isEmpty(e)?t?void 0:[]:this[t?"find":"filter"](function(t){for(var n in e)if(e[n]!==t.get(n))return!1;return!0})},findWhere:function(e){return this.where(e,!0)},sort:function(e){if(!this.comparator)throw new Error("Cannot sort a set without a comparator");return e||(e={}),s.isString(this.comparator)||1===this.comparator.length?this.models=this.sortBy(this.comparator,this):this.models.sort(s.bind(this.comparator,this)),e.silent||this.trigger("sort",this,e),this},sortedIndex:function(e,t,n){t||(t=this.comparator);var i=s.isFunction(t)?t:function(e){return e.get(t)};return s.sortedIndex(this.models,e,i,n)},pluck:function(e){return s.invoke(this.models,"get",e)},fetch:function(e){e=e?s.clone(e):{},void 0===e.parse&&(e.parse=!0);var t=e.success,n=this;return e.success=function(i){var a=e.reset?"reset":"set";n[a](i,e),t&&t(n,i,e),n.trigger("sync",n,i,e)},L(this,e),this.sync("read",this,e)},create:function(e,t){if(t=t?s.clone(t):{},!(e=this._prepareModel(e,t)))return!1;t.wait||this.add(e,t);var n=this,i=t.success;return t.success=function(a){t.wait&&n.add(e,t),i&&i(e,a,t)},e.save(null,t),e},parse:function(e){return e},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0,this.models=[],this._byId={}},_prepareModel:function(e,t){if(e instanceof d)return e.collection||(e.collection=this),e;t||(t={}),t.collection=this;var n=new this.model(e,t);return n._validate(e,t)?n:(this.trigger("invalid",this,e,t),!1)},_removeReference:function(e){this===e.collection&&delete e.collection,e.off("all",this._onModelEvent,this)},_onModelEvent:function(e,t,n,i){("add"!==e&&"remove"!==e||n===this)&&("destroy"===e&&this.remove(t,i),t&&e==="change:"+t.idAttribute&&(delete this._byId[t.previous(t.idAttribute)],null!=t.id&&(this._byId[t.id]=t)),this.trigger.apply(this,arguments))}});var y=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","indexOf","shuffle","lastIndexOf","isEmpty","chain"];s.each(y,function(e){g.prototype[e]=function(){var t=r.call(arguments);return t.unshift(this.models),s[e].apply(s,t)}});var w=["groupBy","countBy","sortBy"];s.each(w,function(e){g.prototype[e]=function(t,n){var i=s.isFunction(t)?t:function(e){return e.get(t)};return s[e](this.models,i,n)}});var _=e.View=function(e){this.cid=s.uniqueId("view"),this._configure(e||{}),this._ensureElement(),this.initialize.apply(this,arguments),this.delegateEvents()},k=/^(\S+)\s*(.*)$/,x=["model","collection","el","id","attributes","className","tagName","events"];s.extend(_.prototype,l,{tagName:"div",$:function(e){return this.$el.find(e)},initialize:function(){},render:function(){return this},remove:function(){return this.$el.remove(),this.stopListening(),this},setElement:function(t,n){return this.$el&&this.undelegateEvents(),this.$el=t instanceof e.$?t:e.$(t),this.el=this.$el[0],n!==!1&&this.delegateEvents(),this},delegateEvents:function(e){if(!e&&!(e=s.result(this,"events")))return this;this.undelegateEvents();for(var t in e){var n=e[t];if(s.isFunction(n)||(n=this[e[t]]),n){var i=t.match(k),a=i[1],r=i[2];n=s.bind(n,this),a+=".delegateEvents"+this.cid,""===r?this.$el.on(a,n):this.$el.on(a,r,n)}}return this},undelegateEvents:function(){return this.$el.off(".delegateEvents"+this.cid),this},_configure:function(e){this.options&&(e=s.extend({},s.result(this,"options"),e)),s.extend(this,s.pick(e,x)),this.options=e},_ensureElement:function(){if(this.el)this.setElement(s.result(this,"el"),!1);else{var t=s.extend({},s.result(this,"attributes"));this.id&&(t.id=s.result(this,"id")),this.className&&(t["class"]=s.result(this,"className"));var n=e.$("<"+s.result(this,"tagName")+">").attr(t);this.setElement(n,!1)}}}),e.sync=function(t,n,i){var a=C[t];s.defaults(i||(i={}),{emulateHTTP:e.emulateHTTP,emulateJSON:e.emulateJSON});var r={type:a,dataType:"json"};if(i.url||(r.url=s.result(n,"url")||N()),null!=i.data||!n||"create"!==t&&"update"!==t&&"patch"!==t||(r.contentType="application/json",r.data=JSON.stringify(i.attrs||n.toJSON(i))),i.emulateJSON&&(r.contentType="application/x-www-form-urlencoded",r.data=r.data?{model:r.data}:{}),i.emulateHTTP&&("PUT"===a||"DELETE"===a||"PATCH"===a)){r.type="POST",i.emulateJSON&&(r.data._method=a);var o=i.beforeSend;i.beforeSend=function(e){return e.setRequestHeader("X-HTTP-Method-Override",a),o?o.apply(this,arguments):void 0}}"GET"===r.type||i.emulateJSON||(r.processData=!1),"PATCH"!==r.type||!window.ActiveXObject||window.external&&window.external.msActiveXFilteringEnabled||(r.xhr=function(){return new ActiveXObject("Microsoft.XMLHTTP")});var l=i.xhr=e.ajax(s.extend(r,i));return n.trigger("request",n,l,i),l};var C={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};e.ajax=function(){return e.$.ajax.apply(e.$,arguments)};var S=e.Router=function(e){e||(e={}),e.routes&&(this.routes=e.routes),this._bindRoutes(),this.initialize.apply(this,arguments)},E=/\((.*?)\)/g,F=/(\(\?)?:\w+/g,j=/\*\w+/g,T=/[\-{}\[\]+?.,\\\^$|#\s]/g;s.extend(S.prototype,l,{initialize:function(){},route:function(t,n,i){s.isRegExp(t)||(t=this._routeToRegExp(t)),s.isFunction(n)&&(i=n,n=""),i||(i=this[n]);var a=this;return e.history.route(t,function(r){var o=a._extractParameters(t,r);i&&i.apply(a,o),a.trigger.apply(a,["route:"+n].concat(o)),a.trigger("route",n,o),e.history.trigger("route",a,n,o)}),this},navigate:function(t,n){return e.history.navigate(t,n),this},_bindRoutes:function(){if(this.routes){this.routes=s.result(this,"routes");for(var e,t=s.keys(this.routes);null!=(e=t.pop());)this.route(e,this.routes[e])}},_routeToRegExp:function(e){return e=e.replace(T,"\\$&").replace(E,"(?:$1)?").replace(F,function(e,t){return t?e:"([^/]+)"}).replace(j,"(.*?)"),new RegExp("^"+e+"$")},_extractParameters:function(e,t){var n=e.exec(t).slice(1);return s.map(n,function(e){return e?decodeURIComponent(e):null})}});var A=e.History=function(){this.handlers=[],s.bindAll(this,"checkUrl"),"undefined"!=typeof window&&(this.location=window.location,this.history=window.history)},B=/^[#\/]|\s+$/g,M=/^\/+|\/+$/g,P=/msie [\w.]+/,D=/\/$/;A.started=!1,s.extend(A.prototype,l,{interval:50,getHash:function(e){var t=(e||this).location.href.match(/#(.*)$/);return t?t[1]:""},getFragment:function(e,t){if(null==e)if(this._hasPushState||!this._wantsHashChange||t){e=this.location.pathname;var n=this.root.replace(D,"");e.indexOf(n)||(e=e.substr(n.length))}else e=this.getHash();return e.replace(B,"")},start:function(t){if(A.started)throw new Error("Backbone.history has already been started");A.started=!0,this.options=s.extend({},{root:"/"},this.options,t),this.root=this.options.root,this._wantsHashChange=this.options.hashChange!==!1,this._wantsPushState=!!this.options.pushState,this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);var n=this.getFragment(),i=document.documentMode,a=P.exec(navigator.userAgent.toLowerCase())&&(!i||7>=i);this.root=("/"+this.root+"/").replace(M,"/"),a&&this._wantsHashChange&&(this.iframe=e.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(n)),this._hasPushState?e.$(window).on("popstate",this.checkUrl):this._wantsHashChange&&"onhashchange"in window&&!a?e.$(window).on("hashchange",this.checkUrl):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval)),this.fragment=n;var r=this.location,o=r.pathname.replace(/[^\/]$/,"$&/")===this.root;return this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!o?(this.fragment=this.getFragment(null,!0),this.location.replace(this.root+this.location.search+"#"+this.fragment),!0):(this._wantsPushState&&this._hasPushState&&o&&r.hash&&(this.fragment=this.getHash().replace(B,""),this.history.replaceState({},document.title,this.root+this.fragment+r.search)),this.options.silent?void 0:this.loadUrl())},stop:function(){e.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl),clearInterval(this._checkUrlInterval),A.started=!1},route:function(e,t){this.handlers.unshift({route:e,callback:t})},checkUrl:function(){var e=this.getFragment();return e===this.fragment&&this.iframe&&(e=this.getFragment(this.getHash(this.iframe))),e===this.fragment?!1:(this.iframe&&this.navigate(e),void(this.loadUrl()||this.loadUrl(this.getHash())))},loadUrl:function(e){var t=this.fragment=this.getFragment(e),n=s.any(this.handlers,function(e){return e.route.test(t)?(e.callback(t),!0):void 0});return n},navigate:function(e,t){if(!A.started)return!1;if(t&&t!==!0||(t={trigger:t}),e=this.getFragment(e||""),this.fragment!==e){this.fragment=e;var n=this.root+e;if(this._hasPushState)this.history[t.replace?"replaceState":"pushState"]({},document.title,n);else{if(!this._wantsHashChange)return this.location.assign(n);this._updateHash(this.location,e,t.replace),this.iframe&&e!==this.getFragment(this.getHash(this.iframe))&&(t.replace||this.iframe.document.open().close(),this._updateHash(this.iframe.location,e,t.replace))}t.trigger&&this.loadUrl(e)}},_updateHash:function(e,t,n){if(n){var i=e.href.replace(/(javascript:|#).*$/,"");e.replace(i+"#"+t)}else e.hash="#"+t}}),e.history=new A;var I=function(e,t){var n,i=this;n=e&&s.has(e,"constructor")?e.constructor:function(){return i.apply(this,arguments)},s.extend(n,i,t);var a=function(){this.constructor=n};return a.prototype=i.prototype,n.prototype=new a,e&&s.extend(n.prototype,e),n.__super__=i.prototype,n};d.extend=g.extend=S.extend=_.extend=A.extend=I;var N=function(){throw new Error('A "url" property or function must be specified')},L=function(e,t){var n=t.error;t.error=function(i){n&&n(e,i,t),e.trigger("error",e,i,t)}}}).call(this);