define(["services/sulupreview/preview","sulucontent/model/content","sulucontent/services/content-manager","sulucontent/components/copy-locale-overlay/main","sulucontent/components/open-ghost-overlay/main","sulusecurity/services/user-manager","sulusecurity/services/security-checker"],function(a,b,c,d,e,f,g){"use strict";var h="contentLanguage",i="column-navigation-show-ghost-pages",j={localizationUrl:"/admin/api/webspace/localizations",tabPrefix:"tab-",contentNodeType:1,internalLinkNodeType:2,externalLinkNodeType:4},k={contentChanged:1102,resourceLocatorAlreadyExists:1103},l={deleteReferencedByFollowing:"content.delete-referenced-by-following",deleteConfirmText:"content.delete-confirm-text",deleteConfirmTitle:"content.delete-confirm-title",deleteDoIt:"content.delete-do-it",draftLabel:"sulu-document-manager.draft-label",unpublishConfirmTextNoDraft:"sulu-content.unpublish-confirm-text-no-draft",unpublishConfirmTextWithDraft:"sulu-content.unpublish-confirm-text-with-draft",unpublishConfirmTitle:"sulu-content.unpublish-confirm-title",removeDraft:"sulu-content.delete-draft",deleteDraftConfirmTitle:"sulu-content.delete-draft-confirm-title",deleteDraftConfirmText:"sulu-content.delete-draft-confirm-text"},m={referentialIntegrityMessage:function(a){var b=[];return b.push("<p>",this.sandbox.translate(l.deleteReferencedByFollowing),"</p>"),b.push("<ul>"),this.sandbox.util.foreach(a,function(a){b.push("<li>",a,"</li>")}),b.push("</ul>"),b.push("<p>",this.sandbox.translate(l.deleteConfirmText),"</p>"),b.join("")}},n=function(a){return"/"===a.url},o=function(a){return!a.id||!!a.publishedState||!a.published},p=function(a,b){this.sandbox.emit("sulu.header.toolbar.item."+(b?"enable":"disable"),a,!1)},q=function(a){this.sandbox.sulu.saveUserSetting(this.options.webspace+"."+h,a),this.sandbox.sulu.saveUserSetting(h,a)};return{initialize:function(){this.saved=!0,"column"===this.options.display?this.renderColumn():this.render(),this.bindCustomEvents()},loadComponentData:function(){var b=$.Deferred(),c=$.Deferred();return this.loadLocalizations().then(function(){b.resolve()}.bind(this)),"column"!==this.options.display?this.loadData().then(function(){this.options.preview&&(this.preview=a.initialize(this.data._permissions,this.options.webspace)),c.resolve()}.bind(this)):c.resolve(),$.when(b,c)},renderColumn:function(){var a=this.sandbox.dom.createElement('<div id="content-column-container"/>');this.sandbox.dom.append(this.$el,a),this.sandbox.start([{name:"content/column@sulucontent",options:{el:a,webspace:this.options.webspace,language:this.options.language}}])},loadLocalizations:function(){return this.sandbox.util.load(j.localizationUrl+"?webspace="+this.options.webspace).then(function(a){this.localizations=a._embedded.localizations.map(function(a){return{id:a.localization,title:a.localization}})}.bind(this))},loadData:function(){var a=$.Deferred();return this.content||(this.content=new b({id:this.options.id})),void 0!==this.options.id?this.content.fullFetch(this.options.webspace,this.options.language,!0,{success:function(b){this.data=b.toJSON(),a.resolve()}.bind(this)}):(this.data=this.content.toJSON(),a.resolve()),a},bindCustomEvents:function(){this.sandbox.on("sulu.header.back",function(){this.sandbox.emit("sulu.content.contents.list")}.bind(this)),this.sandbox.on("sulu.content.contents.list",function(a,b){var c="content/contents/"+(a?a:this.options.webspace)+"/"+(b?b:this.options.language);this.sandbox.emit("sulu.app.ui.reset",{navigation:"auto",content:"auto"}),this.sandbox.emit("sulu.router.navigate",c)},this),this.sandbox.on("sulu.content.contents.get-data",function(a){a(this.sandbox.util.deepCopy(this.data),this.preview)}.bind(this)),this.sandbox.on("sulu.content.contents.set-header-bar",function(a){this.setHeaderBar(a)}.bind(this)),this.sandbox.on("sulu.toolbar.save",function(a){this.sandbox.emit("sulu.tab.save",a)},this),this.sandbox.on("sulu.header.language-changed",function(a){if(q.call(this,a.id),"column"!==this.options.display){var b=this.content.toJSON();b.id?-1===_(b.concreteLanguages).indexOf(a.id)&&-1===_(b.enabledShadowLanguages).values().indexOf(a.id)?e.openGhost.call(this,b).then(function(c,e){c?d.copyLocale.call(this,b.id,e,[a.id],function(){this.load(b,this.options.webspace,a.id,!0)}.bind(this)):this.load({id:b.id},this.options.webspace,a.id,!0)}.bind(this)).fail(function(){this.sandbox.emit("sulu.header.change-language",this.options.language)}.bind(this)):this.load(b,this.options.webspace,a.id,!0):this.add(this.options.parent?{id:this.options.parent}:null,this.options.webspace,a.id)}else this.sandbox.emit("sulu.content.contents.list",this.options.webspace,a.id)},this),this.sandbox.on("husky.tabs.header.item.select",function(a){"tab-excerpt"===a.id&&(this.template=this.data.originTemplate),"tab-permissions"===a.id?this.showSaveItems("permissions"):this.showSaveItems("content")}.bind(this)),this.sandbox.on("sulu.dropdown.template.item-clicked",function(){this.setHeaderBar(!1)}.bind(this)),this.sandbox.on("sulu.content.contents.saved",function(a,b,c){this.options.id?(this.data=b,this.content.set(b),this.setHeaderBar(!0),this.showDraftLabel(),this.sandbox.dom.html('li[data-id="'+this.options.language+'"] a',this.options.language),this.sandbox.emit("sulu.header.saved",b),this.sandbox.emit("sulu.labels.success.show","labels.success.content-save-desc","labels.success")):this.sandbox.sulu.viewStates.justSaved=!0,this.afterSaveAction(c,!this.options.id)},this),this.sandbox.on("sulu.content.contents.error",function(a,b,c){this.handleError(a,b,c)},this),this.sandbox.on("sulu.content.contents.default-template",function(a){this.template=a,this.data.nodeType!==j.contentNodeType&&(this.sandbox.emit("sulu.header.toolbar.item.change","template",a),this.hiddenTemplate&&(this.hiddenTemplate=!1,this.sandbox.emit("sulu.header.toolbar.item.show","template",a)))},this),this.sandbox.on("sulu.content.contents.show-save-items",function(a){this.showSaveItems(a)}.bind(this)),this.sandbox.on("husky.navigation.item.select",function(a){a.id!==this.options.id&&this.sandbox.emit("sulu.app.ui.reset",{navigation:"auto",content:"auto"})}.bind(this)),this.sandbox.on("sulu.permission-tab.saved",function(a,b){this.afterSaveAction(b,!1)}.bind(this)),this.bindModelEvents()},bindModelEvents:function(){this.sandbox.on("sulu.content.content.delete",function(a){this.del(a)},this),this.sandbox.on("sulu.content.contents.save",function(a,b){this.save(a,b).then(function(){this.loadData()}.bind(this))},this),this.sandbox.on("sulu.content.contents.load",function(a,b,c){this.load(a,b,c)},this),this.sandbox.on("sulu.content.contents.new",function(a){this.add(a)},this),this.sandbox.on("sulu.content.contents.delete",function(a){this.delContents(a)},this),this.sandbox.on("sulu.content.contents.move",this.move,this),this.sandbox.on("sulu.content.contents.copy",this.copy,this),this.sandbox.on("sulu.content.contents.copy-locale",d.copyLocale,this),this.sandbox.on("sulu.content.contents.order",this.order,this),this.sandbox.on("sulu.content.contents.get-rl",function(a,b){this.getResourceLocator(a,this.template,b)},this),this.sandbox.on("sulu.content.contents.list",function(a,b){var c="content/contents/"+(a?a:this.options.webspace)+"/"+(b?b:this.options.language);this.sandbox.emit("sulu.app.ui.reset",{navigation:"auto",content:"auto"}),this.sandbox.emit("sulu.router.navigate",c)},this)},getResourceLocator:function(a,b,c){var d=this.options.parent?this.options.parent:this.data.parentUuid,e="/admin/api/nodes/resourcelocators/generates?"+(d?"parent="+d+"&":"")+"&webspace="+this.options.webspace+"&language="+this.options.language+"&template="+b;this.sandbox.util.save(e,"POST",{parts:a}).then(function(a){c(a.resourceLocator)})},move:function(a,b,c,d){var e=["/admin/api/nodes/",a,"?webspace=",this.options.webspace,"&language=",this.options.language,"&action=move&destination=",b].join("");this.sandbox.util.save(e,"POST",{}).then(function(a){c&&"function"==typeof c&&c(a)}.bind(this)).fail(function(a,b,c){d&&"function"==typeof d&&d(c)}.bind(this))},copy:function(a,b,c,d){var e=["/admin/api/nodes/",a,"?webspace=",this.options.webspace,"&language=",this.options.language,"&action=copy&destination=",b].join("");this.sandbox.util.save(e,"POST",{}).then(function(a){c&&"function"==typeof c&&c(a)}.bind(this)).fail(function(a,b,c){d&&"function"==typeof d&&d(c)}.bind(this))},order:function(a,b,c,d){var e=["/admin/api/nodes/",a,"?webspace=",this.options.webspace,"&language=",this.options.language,"&action=order"].join("");this.sandbox.util.save(e,"POST",{position:b}).then(function(a){c&&"function"==typeof c&&c(a)}.bind(this)).fail(function(a,b,c){d&&"function"==typeof d&&d(c)}.bind(this))},del:function(a){this.sandbox.sulu.showDeleteDialog(function(c){if(c)if(this.sandbox.emit("sulu.header.toolbar.item.loading","edit"),this.content&&a===this.content.get("id"))this.content.fullDestroy(this.options.webspace,this.options.language,!1,{processData:!0,success:function(){this.sandbox.emit("sulu.app.ui.reset",{navigation:"auto",content:"auto"}),this.sandbox.sulu.unlockDeleteSuccessLabel(),this.deleteSuccessCallback()}.bind(this),error:function(a,b){this.displayReferentialIntegrityDialog(a,b.responseJSON)}.bind(this)});else{var d=new b({id:a});d.fullDestroy(this.options.webspace,this.options.language,!1,{processData:!0,success:this.deleteSuccessCallback.bind(this),error:function(a,b){this.displayReferentialIntegrityDialog(a,b.responseJSON)}.bind(this)})}}.bind(this))},delContents:function(a){this.confirmDeleteDialog(function(c){c&&a.forEach(function(a){var c=new b({id:a});c.fullDestroy(this.options.webspace,this.options.language,!1,{success:function(){this.sandbox.emit("husky.datagrid.record.remove",a)}.bind(this),error:function(){}})}.bind(this))}.bind(this))},displayReferentialIntegrityDialog:function(a,b){var c=[];this.sandbox.util.foreach(b.structures,function(a){c.push(a.title)});var d=$("<div/>");$("body").append(d),this.sandbox.start([{name:"overlay@husky",options:{el:d,openOnStart:!0,title:this.sandbox.translate(l.deleteConfirmTitle),message:m.referentialIntegrityMessage.call(this,c),okDefaultText:this.sandbox.translate(l.deleteDoIt),type:"alert",closeCallback:function(){},okCallback:function(){a.fullDestroy(this.options.webspace,this.options.language,!0,{processData:!0,success:this.deleteSuccessCallback.bind(this)})}.bind(this)}}])},deleteSuccessCallback:function(){var a="content/contents/"+this.options.webspace+"/"+this.options.language;this.sandbox.emit("sulu.router.navigate",a),this.sandbox.emit("sulu.content.content.deleted")},handleErrorContentChanged:function(a,b){this.sandbox.emit("sulu.overlay.show-warning","content.changed-warning.title","content.changed-warning.description",function(){this.sandbox.emit("sulu.header.toolbar.item.enable","save")}.bind(this),function(){this.saveContent(a,{success:function(a){var c=a.toJSON();this.sandbox.emit("sulu.content.contents.saved",c.id,c,b),this.sandbox.emit("sulu.header.toolbar.item.enable","save")}.bind(this),error:function(c,d){this.sandbox.emit("sulu.content.contents.error",d.responseJSON.code,a,b)}.bind(this)},!0,b)}.bind(this),{okDefaultText:"content.changed-warning.ok-button"})},handleError:function(a,b,c){switch(a){case k.contentChanged:this.handleErrorContentChanged(b,c);break;case k.resourceLocatorAlreadyExists:this.sandbox.emit("sulu.labels.error.show","labels.error.content-save-resource-locator","labels.error"),this.sandbox.emit("sulu.header.toolbar.item.enable","save");break;default:this.sandbox.emit("sulu.labels.error.show","labels.error.content-save-desc","labels.error"),this.sandbox.emit("sulu.header.toolbar.item.enable","save")}},save:function(a,c){this.sandbox.emit("sulu.header.toolbar.item.loading","save");var d=this.sandbox.data.deferred();return this.template&&(a.template=this.template),this.content?this.content.set(a):this.content=new b(a),this.options.id&&this.content.set({id:this.options.id}),this.saveContent(a,{success:function(a){var b=a.toJSON();this.sandbox.emit("sulu.content.contents.saved",b.id,b,c),d.resolve()}.bind(this),error:function(b,d){this.sandbox.emit("sulu.content.contents.error",d.responseJSON.code,a,c)}.bind(this)},!1,c),d},saveContent:function(a,b,c,d){"undefined"==typeof c&&(c=!1),this.content.fullSave(this.options.webspace,this.options.language,this.options.parent,n(a)?"home":null,null,b,c,d)},afterSaveAction:function(a,b){if("back"===a)this.sandbox.emit("sulu.content.contents.list");else if("new"===a){var c,d=this.content.get("breadcrumb");c=(this.options.id&&d.length>1?d[d.length-1].uuid:null)||this.options.parent,this.sandbox.emit("sulu.router.navigate","content/contents/"+this.options.webspace+"/"+this.options.language+"/add"+(c?":"+c:"")+"/content",!0,!0)}else b&&this.sandbox.emit("sulu.router.navigate","content/contents/"+this.options.webspace+"/"+this.options.language+"/edit:"+this.content.get("id")+"/content")},load:function(a,b,c,d){var e="content";(a.nodeType&&a.nodeType!==j.contentNodeType||a.type&&a.type.name&&"shadow"===a.type.name)&&(e="settings"),this.sandbox.emit("sulu.router.navigate","content/contents/"+(b?b:this.options.webspace)+"/"+(c?c:this.options.language)+"/edit:"+a.id+"/"+e,!0,d)},add:function(a,b,c){a?this.sandbox.emit("sulu.router.navigate","content/contents/"+(b?b:this.options.webspace)+"/"+(c?c:this.options.language)+"/add:"+a.id+"/content"):this.sandbox.emit("sulu.router.navigate","content/contents/"+(b?b:this.options.webspace)+"/"+(c?c:this.options.language)+"/add/content")},render:function(){if(this.setTemplate(this.data),this.showDraftLabel(),"permissions"===this.options.content&&this.showSaveItems("permissions"),this.options.preview&&this.data.nodeType===j.contentNodeType&&!this.data.shadowOn){var a="Sulu\\Bundle\\ContentBundle\\Document\\"+(n(this.data)?"Home":"Page")+"Document";this.preview.start(a,this.options.id,this.options.language,this.data)}else this.sandbox.emit("sulu.sidebar.hide");this.options.id&&("settings"!==this.options.content&&this.data.shadowOn===!0||"content"===this.options.content&&this.data.nodeType!==j.contentNodeType)&&this.sandbox.emit("sulu.router.navigate","content/contents/"+this.options.webspace+"/"+this.options.language+"/edit:"+this.data.id+"/settings"),this.setHeaderBar(!0)},cacheClear:function(){this.sandbox.website.cacheClear()},setTemplate:function(a){this.template=a.originTemplate,this.data.nodeType===j.contentNodeType&&""!==this.template&&void 0!==this.template&&null!==this.template&&(this.sandbox.emit("sulu.header.toolbar.item.change","template",this.template),this.sandbox.emit("sulu.header.toolbar.item.show","template"))},setHeaderBar:function(a){var b=!a,c=!a,d=!!a&&!this.data.publishedState;p.call(this,"saveDraft",b),p.call(this,"savePublish",c),p.call(this,"publish",d),p.call(this,"unpublish",!!this.data.published),p.call(this,""),b||c||d?this.sandbox.emit("sulu.header.toolbar.item.enable","save",!1):this.sandbox.emit("sulu.header.toolbar.item.disable","save",!1),this.saved=a},getCopyLocaleUrl:function(a,b,c){return["/admin/api/nodes/",a,"?webspace=",this.options.webspace,"&language=",b,"&dest=",c,"&action=copy-locale"].join("")},header:function(){var a,b,c,e=[],f=[],h=[];if("column"===this.options.display){var j=this.sandbox.sulu.getUserSetting(i),k="toggler-on",l={};null!==j&&(k=JSON.parse(j)?"toggler-on":"toggler"),l[k]={options:{title:"content.contents.show-ghost-pages"}},b={noBack:!0,toolbar:{buttons:l,languageChanger:{data:this.localizations,preSelected:this.options.language}}}}else{for(var m in this.data.concreteLanguages)this.data.concreteLanguages.hasOwnProperty(m)&&e.push(this.data.concreteLanguages[m]);for(m=0,a=this.localizations.length;a>m;m++)f[m]={id:this.localizations[m].id,title:this.localizations[m].title};c="/admin/content-navigations",h.push("alias=content"),this.data.id&&h.push("id="+this.data.id),this.options.webspace&&h.push("webspace="+this.options.webspace),h.length&&(c+="?"+h.join("&"));var o={},p={},q={};g.hasPermission(this.data,"edit")&&(q.saveDraft={},g.hasPermission(this.data,"live")&&(q.savePublish={},q.publish={}),o.save={options:{icon:"floppy-o",title:"public.save",disabled:!0,callback:function(){this.sandbox.emit("sulu.toolbar.save","publish")}.bind(this),dropdownItems:q}},o.template={options:{dropdownOptions:{url:"/admin/content/template?webspace="+this.options.webspace,callback:function(a){this.template=a.template,this.sandbox.emit("sulu.dropdown.template.item-clicked",a)}.bind(this)}}}),g.hasPermission(this.data,"live")&&!n(this.data)&&(p.unpublish={options:{title:this.sandbox.translate("sulu-document-manager.unpublish"),disabled:!this.data.published,callback:this.unpublish.bind(this)}},p.divider={options:{divider:!0}}),g.hasPermission(this.data,"delete")&&!n(this.data)&&(p["delete"]={options:{disabled:!this.data.id,callback:function(){this.sandbox.emit("sulu.content.content.delete",this.data.id)}.bind(this)}}),g.hasPermission(this.data,"edit")&&(p.copyLocale={options:{title:this.sandbox.translate("toolbar.copy-locale"),disabled:!this.data.id,callback:function(){d.startCopyLocalesOverlay.call(this).then(function(a){this.content.attributes.concreteLanguages=_.uniq(this.data.concreteLanguages.concat(a)),this.data=this.content.toJSON(),this.sandbox.emit("sulu.labels.success.show","labels.success.copy-locale-desc","labels.success")}.bind(this))}.bind(this)}}),this.sandbox.util.isEmpty(p)||(o.edit={options:{dropdownItems:p}}),o.statePublished={},o.stateTest={},b={noBack:n(this.data),tabs:{url:c,options:{data:function(){return this.sandbox.util.deepCopy(this.content.toJSON())}.bind(this)},componentOptions:{values:this.content.toJSON(),previewService:this.preview}},title:function(){return this.data.title}.bind(this),toolbar:{languageChanger:{data:f,preSelected:this.options.language},buttons:o}}}return b},unpublish:function(){this.sandbox.sulu.showDeleteDialog(function(a){a&&(this.sandbox.emit("sulu.header.toolbar.item.loading","edit"),c.unpublish(this.data.id,this.options.language).always(function(){this.sandbox.emit("sulu.header.toolbar.item.enable","edit")}.bind(this)).then(function(a){this.sandbox.emit("sulu.labels.success.show","labels.success.content-unpublish-desc","labels.success"),this.sandbox.emit("sulu.content.contents.saved",a.id,a)}.bind(this)).fail(function(){this.sandbox.emit("sulu.labels.error.show","labels.error.content-unpublish-desc","labels.error")}.bind(this)))}.bind(this),this.sandbox.translate(l.unpublishConfirmTitle),this.sandbox.translate(o(this.data)?l.unpublishConfirmTextNoDraft:l.unpublishConfirmTextWithDraft))},showSaveItems:function(a){var b,c,d=["saveDraft","savePublish","publish","saveOnly"];switch(a||(a="content"),a){case"content":b=[];break;case"shadow":case"permissions":b=["saveDraft","savePublish","publish"]}c=_.difference(d,b),this.sandbox.util.each(c,function(a,b){this.sandbox.emit("sulu.header.toolbar.item.show",b)}.bind(this)),this.sandbox.util.each(b,function(a,b){this.sandbox.emit("sulu.header.toolbar.item.hide",b)}.bind(this))},showDraftLabel:function(){this.sandbox.emit("sulu.header.tabs.label.hide"),o(this.data)||f.find(this.data.changer).then(function(a){this.sandbox.emit("sulu.header.tabs.label.show",this.sandbox.util.sprintf(this.sandbox.translate(l.draftLabel),{changed:this.sandbox.date.format(this.data.changed,!0),user:a.username}),[{id:"delete-draft",title:this.sandbox.translate(l.removeDraft),skin:"critical",onClick:this.deleteDraft.bind(this)}])}.bind(this))},deleteDraft:function(){this.sandbox.sulu.showDeleteDialog(function(a){a&&(this.sandbox.emit("husky.label.header.loading"),c.removeDraft(this.data.id,this.options.language).then(function(a){this.sandbox.emit("sulu.router.navigate",this.sandbox.mvc.history.fragment,!0,!0),this.sandbox.emit("sulu.content.contents.saved",a.id,a)}.bind(this)).fail(function(){this.sandbox.emit("husky.label.header.reset"),this.sandbox.emit("sulu.labels.error.show","labels.error.remove-draft-desc","labels.error")}.bind(this)))}.bind(this),this.sandbox.translate(l.deleteDraftConfirmTitle),this.sandbox.translate(l.deleteDraftConfirmText))},layout:function(){return"column"===this.options.display?{}:{navigation:{collapsed:!0},content:{shrinkable:!!this.options.preview},sidebar:this.options.preview?"max":!1}},destroy:function(){this.preview&&a.destroy(this.preview)}}});