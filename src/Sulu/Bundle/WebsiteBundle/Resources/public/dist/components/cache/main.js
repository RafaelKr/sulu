define([],function(){"use strict";var a=['<div class="grid">','   <div class="grid-row">','       <div class="grid-col-5">','           <div class="btn large action">','               <span class="fa-trash-o"></span>','               <span class="text"><%=translate("sulu.website.cache.remove")%></span>',"           </div>","       </div>","   </div>","</div>"].join("");return{name:"Sulu Cache Settings",layout:{},initialize:function(){this.render(),this.bindDomEvents()},bindDomEvents:function(){this.sandbox.dom.on(this.sandbox.dom.find(".action",this.$el),"click",function(){this.clearCache()}.bind(this))},render:function(){var b={translate:this.sandbox.translate},c=this.sandbox.util.template(a,b);this.html(c)},clearCache:function(){this.sandbox.logger.log("CACHE CLEAR"),this.sandbox.util.load("/admin/website/cache/clear").then(function(){this.sandbox.emit("sulu.labels.success.show","sulu.website.cache.remove.success.description","sulu.website.cache.remove.success.title","cache-success")}.bind(this)).fail(function(){this.sandbox.emit("sulu.labels.error.show","sulu.website.cache.remove.error.description","sulu.website.cache.remove.error.title","cache-error")}.bind(this))}}});