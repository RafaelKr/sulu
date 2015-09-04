define(["sulucontent/components/open-ghost-overlay/main"],function(a){"use strict";var b="column-navigation-show-ghost-pages",c=3,d=4,e=1,f=5,g="fa-pencil",h="fa-eye",i=function(a){if(!a.hasOwnProperty("permissions"))return g;var b="";return $.each(a.permissions,function(a,c){return-1===$.inArray(a,this.sandbox.sulu.user.roles)?!0:-1!==$.inArray("edit",c)?(b=g,!1):-1!==$.inArray("view",c)?(b=h,!1):void 0}.bind(this)),b},j={columnNavigation:function(){return['<div id="child-column-navigation"/>','<div id="wait-container" style="margin-top: 50px; margin-bottom: 200px; display: none;"></div>'].join("")},table:function(){return['<div id="child-table"/>','<div id="wait-container" style="margin-top: 50px; margin-bottom: 200px; display: none;"></div>'].join("")}};return{initialize:function(){this.render(),this.sandbox.sulu.triggerDeleteSuccessLabel(),this.showGhostPages=!0,this.setShowGhostPages()},setShowGhostPages:function(){var a=this.sandbox.sulu.getUserSetting(b);null!==a&&(this.showGhostPages=JSON.parse(a))},bindCustomEvents:function(){this.sandbox.on("husky.column-navigation.node.add",function(a){this.sandbox.emit("sulu.content.contents.new",a)},this),this.sandbox.on("husky.column-navigation.node.action",function(b){""!==i.call(this,b)&&(this.setLastSelected(b.id),b.type&&"ghost"===b.type.name?a.openGhost.call(this,b).then(function(a,c){a?this.sandbox.emit("sulu.content.contents.copy-locale",b.id,c,[this.options.language],function(){this.sandbox.emit("sulu.content.contents.load",b)}.bind(this)):this.sandbox.emit("sulu.content.contents.load",b)}.bind(this)):this.sandbox.emit("sulu.content.contents.load",b))},this),this.sandbox.on("husky.column-navigation.node.selected",function(a){this.setLastSelected(a.id)},this),this.sandbox.on("sulu.content.localizations",function(a){this.localizations=a},this),this.sandbox.on("husky.toggler.sulu-toolbar.changed",function(a){this.showGhostPages=a,this.sandbox.sulu.saveUserSetting(b,this.showGhostPages),this.startColumnNavigation()},this),this.sandbox.on("husky.column-navigation.node.settings",function(a,b){a.id===c?this.moveSelected(b):a.id===d?this.copySelected(b):a.id===e&&this.deleteSelected(b)}.bind(this)),this.sandbox.on("husky.column-navigation.node.ordered",this.arrangeNode.bind(this))},arrangeNode:function(a,b){this.sandbox.emit("sulu.content.contents.order",a,b)},moveSelected:function(a){var b=function(b){this.showOverlayLoader(),this.sandbox.emit("sulu.content.contents.move",a.id,b.id,function(){this.restartColumnNavigation(),this.sandbox.emit("husky.overlay.node.close")}.bind(this),function(a){this.sandbox.logger.error(a),this.hideOverlayLoader()}.bind(this))}.bind(this);this.moveOrCopySelected(a,b,"move")},copySelected:function(a){var b=function(b){this.showOverlayLoader(),this.sandbox.emit("sulu.content.contents.copy",a.id,b.id,function(a){this.setLastSelected(a.id),this.restartColumnNavigation(),this.sandbox.emit("husky.overlay.node.close")}.bind(this),function(a){this.sandbox.logger.error(a),this.hideOverlayLoader()}.bind(this))}.bind(this);this.moveOrCopySelected(a,b,"copy")},moveOrCopySelected:function(a,b,c){this.sandbox.once("husky.overlay.node.initialized",function(){this.startOverlayColumnNavigation(a.id),this.startOverlayLoader()}.bind(this)),this.sandbox.once("husky.column-navigation.overlay.action",b),this.sandbox.once("husky.overlay.node.closed",function(){this.sandbox.off("husky.column-navigation.overlay.action",b)}.bind(this)),this.sandbox.once("husky.column-navigation.overlay.initialized",function(){this.sandbox.emit("husky.overlay.node.set-position")}.bind(this)),this.startOverlay("content.contents.settings."+c+".title",j.columnNavigation(),!1)},deleteSelected:function(a){this.sandbox.once("sulu.preview.deleted",function(){this.restartColumnNavigation()}.bind(this)),this.sandbox.emit("sulu.content.content.delete",a.id)},renderOverlayTable:function(a,b,c){var d,e,f,g=this.sandbox.dom.find(a),h=['<ul class="order-table">'];for(e in b)b.hasOwnProperty(e)&&e!==c&&(f=b[e],h.push('<li data-id="'+f.id+'" data-path="'+f.path+'">   <span class="node-name">'+this.sandbox.util.cropMiddle(f.title,35)+'</span>   <span class="options-select"><i class="fa fa-arrow-up pointer"></i></span></li>'));h.push("</ul>"),d=h.join(""),this.sandbox.dom.append(g,d)},startOverlay:function(a,b,c,d,e){d||(d="node");var f=this.sandbox.dom.createElement('<div class="overlay-container"/>'),g=[{type:"cancel",align:"right"}];this.sandbox.dom.append(this.$el,f),c&&g.push({type:"ok",align:"left",text:this.sandbox.translate("content.contents.settings."+d+".ok")}),this.sandbox.start([{name:"overlay@husky",options:{openOnStart:!0,removeOnClose:!0,cssClass:"node",el:f,container:this.$el,instanceName:d,skin:"wide",slides:[{title:this.sandbox.translate(a),data:b,buttons:g,okCallback:e}]}}])},startOverlayColumnNavigation:function(a){var b="/admin/api/nodes",c=["tree=true","webspace="+this.options.webspace,"language="+this.options.language,"webspace-node=true"];a&&c.push("id="+a),this.sandbox.start([{name:"column-navigation@husky",options:{el:"#child-column-navigation",selected:a,url:b+"?"+c.join("&"),instanceName:"overlay",actionIcon:"fa-check-circle",resultKey:this.options.resultKey,showOptions:!1,showStatus:!1,responsive:!1,sortable:!1,skin:"fixed-height-small",disableIds:[a],disabledChildren:!0}}])},startOverlayLoader:function(){this.sandbox.start([{name:"loader@husky",options:{el:"#wait-container",size:"100px",color:"#e4e4e4"}}])},showOverlayLoader:function(){this.sandbox.dom.css("#child-column-navigation","display","none"),this.sandbox.dom.css("#child-table","display","none"),this.sandbox.dom.css("#wait-container","display","block")},hideOverlayLoader:function(){this.sandbox.dom.css("#child-column-navigation","display","block"),this.sandbox.dom.css("#child-table","display","block"),this.sandbox.dom.css("#wait-container","display","none")},restartColumnNavigation:function(){this.sandbox.stop("#content-column"),this.startColumnNavigation()},startColumnNavigation:function(){this.sandbox.stop(this.$find("#content-column")),this.sandbox.dom.append(this.$el,'<div id="content-column"></div>'),this.sandbox.start([{name:"column-navigation@husky",options:{el:this.$find("#content-column"),instanceName:"node",selected:this.getLastSelected(),resultKey:"nodes",url:this.getUrl(),actionIcon:i.bind(this),data:[{id:e,name:this.sandbox.translate("content.contents.settings.delete"),enabler:this.hasSelectedEnabler},{id:2,divider:!0},{id:c,name:this.sandbox.translate("content.contents.settings.move"),enabler:this.hasSelectedEnabler},{id:d,name:this.sandbox.translate("content.contents.settings.copy"),enabler:this.hasSelectedEnabler},{id:f,name:this.sandbox.translate("content.contents.settings.order"),mode:"order",enabler:this.orderEnabler}]}}])},hasSelectedEnabler:function(a){return!!a.hasSelected},orderEnabler:function(a){return a.numberItems>1},getLocalizationForId:function(a){a=parseInt(a,10);for(var b=-1,c=this.localizations.length;++b<c;)if(this.localizations[b].id===a)return this.localizations[b].localization;return null},getLastSelected:function(){return this.sandbox.sulu.getUserSetting(this.options.webspace+"ColumnNavigationSelected")},setLastSelected:function(a){this.sandbox.sulu.saveUserSetting(this.options.webspace+"ColumnNavigationSelected",a)},getUrl:function(){return null!==this.getLastSelected()?"/admin/api/nodes?id="+this.getLastSelected()+"&tree=true&webspace="+this.options.webspace+"&language="+this.options.language+"&exclude-ghosts="+(this.showGhostPages?"false":"true"):"/admin/api/nodes?depth=1&webspace="+this.options.webspace+"&language="+this.options.language+"&exclude-ghosts="+(this.showGhostPages?"false":"true")},render:function(){this.bindCustomEvents();var a="text!/admin/content/template/content/column/"+this.options.webspace+"/"+this.options.language+".html";require([a],function(a){var b={translate:this.sandbox.translate},c=this.sandbox.util.extend({},b),d=this.sandbox.util.template(a,c);this.sandbox.dom.html(this.$el,d),this.startColumnNavigation()}.bind(this))},openGhost:function(a){this.startOverlay("content.contents.settings.copy-locale.title",j.openGhost.call(this),!0,"copy-locale-overlay",function(){var b=this.sandbox.dom.prop("#copy-locale-copy","checked"),c=this.sandbox.dom.data("#copy-locale-overlay-select","selectionValues"),d=this.options.language;if(b){if(!c||0===c.length)return!1;this.sandbox.emit("sulu.content.contents.copy-locale",a.id,c[0],[d],function(){this.sandbox.emit("sulu.content.contents.load",a)}.bind(this))}else this.sandbox.emit("sulu.content.contents.load",a)}.bind(this)),this.sandbox.once("husky.select.copy-locale-to.selected.item",function(){this.sandbox.dom.prop("#copy-locale-copy","checked",!0)}.bind(this))}}});