define(["underscore","jquery","config","sulusecurity/components/users/models/user","sulucontact/models/contact","services/suluarticle/article-manager","services/suluarticle/article-router","text!/admin/articles/template/settings.html"],function(a,b,c,d,e,f,g,h){"use strict";var i={templates:{form:h},translations:{author:"sulu_article.author",authored:"sulu_article.form.settings.changelog.authored",authoredOnly:"sulu_article.form.settings.changelog.authored-only",changelog:"sulu_article.form.settings.changelog",changed:"sulu_article.form.settings.changelog.changed",changedOnly:"sulu_article.form.settings.changelog.changed-only",created:"sulu_article.form.settings.changelog.created",createdOnly:"sulu_article.form.settings.changelog.created-only"}};return{type:"form-tab",defaults:i,authorFullname:null,parseData:function(a){return{id:a.id,author:a.author,authored:a.authored,creator:a.creator,changer:a.changer,created:a.created,changed:a.changed}},render:function(a){this.data=a,this.$el.html(this.getTemplate()),this.createForm(a),c.get("sulu-content").versioning.enabled&&this.sandbox.start([{name:"datagrid@husky",options:{el:"#versions",instanceName:"versions",url:f.getVersionsUrl(a.id,this.options.locale),resultKey:"versions",actionCallback:this.restoreVersion.bind(this),viewOptions:{table:{actionIcon:"history",actionColumn:"authored",selectItem:!1}},matchings:[{name:"authored",attribute:"authored",content:this.sandbox.translate("sulu-document-manager.version.authored"),type:"datetime"},{name:"author",attribute:"author",content:this.sandbox.translate("sulu-document-manager.version.author")}]}}]),this.rendered()},rendered:function(){this.updateChangelog(this.data),this.bindDomEvents()},submit:function(b){if(this.sandbox.form.validate(this.formId)){var c=this.sandbox.form.getData(this.formId);a.each(c,function(a,b){this.data[b]=a}.bind(this)),this.save(this.data,b)}},save:function(a,b){f.save(a,a.id,this.options.locale,b).then(function(b){this.saved(a),this.sandbox.emit("sulu.tab.saved",b.id,b)}.bind(this)).fail(function(b){this.sandbox.emit("sulu.article.error",b.status,b.responseJSON.code||0,a)}.bind(this))},saved:function(a){this.data=this.parseData(a)},getTemplate:function(){return this.templates.form({translations:this.translations})},getFormId:function(){return"#settings-form"},listenForChange:function(){this.sandbox.dom.on(this.formId,"change keyup",this.setDirty.bind(this)),this.sandbox.on("sulu.content.changed",this.setDirty.bind(this)),this.sandbox.on("husky.ckeditor.changed",this.setDirty.bind(this))},setAuthorChangelog:function(a,b,c){var d,e=this.sandbox.date.format(b);a||c||(a=this.authorFullname),a?(this.authorFullname=a,d=this.sandbox.util.sprintf(this.translations.authored,{author:a,authored:e})):(this.authorFullname=null,d=this.sandbox.util.sprintf(this.translations.authoredOnly,{authored:e})),this.sandbox.dom.text("#author",d)},setCreationChangelog:function(a,b){var c,d=this.sandbox.date.format(b,!0);c=a?this.sandbox.util.sprintf(this.translations.created,{creator:a,created:d}):this.sandbox.util.sprintf(this.translations.createdOnly,{created:d}),this.sandbox.dom.text("#created",c)},setChangeChangelog:function(a,b){var c,d=this.sandbox.date.format(b,!0);c=a?this.sandbox.util.sprintf(this.translations.changed,{changer:a,changed:d}):this.sandbox.util.sprintf(this.translations.changedOnly,{changed:d}),this.sandbox.dom.text("#changed",c)},updateChangelog:function(a){var c=b.Deferred(),d=b.Deferred(),e=b.Deferred();a.creator&&a.changer&&a.creator===a.changer?this.loadUser(a.creator).done(function(b){c.resolve(b.get("fullName"),a.created),d.resolve(b.get("fullName"),a.changed)}.bind(this)).fail(function(){c.resolve(null,a.created),d.resolve(null,a.changed)}.bind(this)):(this.loadUser(a.creator).done(function(b){c.resolve(b.get("fullName"),a.created)}.bind(this)).fail(function(){c.resolve(null,a.created)}.bind(this)),this.loadUser(a.changer).done(function(b){d.resolve(b.get("fullName"),a.changed)}.bind(this)).fail(function(){d.resolve(null,a.changed)}.bind(this))),a.author?this.loadContact(a.author).done(function(b){e.resolve(b.get("fullName"),new Date(a.authored))}.bind(this)).fail(function(){e.resolve(null,new Date(a.authored))}.bind(this)):e.resolve(null,new Date(a.authored)),this.sandbox.data.when(c,d,e).then(function(a,b,c){this.setCreationChangelog(a[0],a[1]),this.setChangeChangelog(b[0],b[1]),this.setAuthorChangelog(c[0],c[1]),this.sandbox.dom.show("#changelog-container")}.bind(this))},loadUser:function(a){var c=b.Deferred();if(!a)return c.reject(),c;var e=new d({id:a});return e.fetch({global:!1,success:function(a){c.resolve(a)}.bind(this),error:function(){c.reject()}.bind(this)}),c},loadContact:function(a){var c=b.Deferred(),d=new e({id:a});return d.fetch({global:!1,success:function(a){c.resolve(a)}.bind(this),error:function(){c.reject()}.bind(this)}),c},bindDomEvents:function(){this.sandbox.dom.on("#change-author","click",function(){this.openAuthorSelection()}.bind(this))},openAuthorSelection:function(){var a=b("<div/>"),c=b("<div/>");this.$el.append(a),this.sandbox.start([{name:"overlay@husky",options:{el:a,instanceName:"author-selection",openOnStart:!0,removeOnClose:!0,skin:"medium",slides:[{title:this.translations.author,okCallback:function(){this.sandbox.emit("sulu.content.contents.get-author")}.bind(this),data:c}]}}]),this.sandbox.once("husky.overlay.author-selection.initialized",function(){this.sandbox.start([{name:"content/settings/author-selection@sulucontent",options:{el:c,locale:this.options.locale,data:{author:this.data.author,authored:this.data.authored},nullableAuthor:!this.options.config.defaultAuthor,selectCallback:function(a){this.setAuthor(a),this.sandbox.emit("husky.overlay.author-selection.close")}.bind(this)}}])}.bind(this))},setAuthor:function(a){return this.setDirty(),this.data.authored=a.authored,this.data.author=a.author,a.authorItem?void this.setAuthorChangelog(a.authorItem.firstName+" "+a.authorItem.lastName,new Date(a.authored)):void this.setAuthorChangelog(null,new Date(a.authored),!0)},restoreVersion:function(a,b){this.sandbox.sulu.showConfirmationDialog({callback:function(c){if(c)return this.sandbox.emit("husky.overlay.alert.show-loader"),f.restoreVersion(this.options.id,a,b.locale).always(function(){this.sandbox.emit("husky.overlay.alert.hide-loader")}.bind(this)).then(function(){this.sandbox.emit("husky.overlay.alert.close"),g.toEditForce(this.data.id,this.options.locale)}.bind(this)).fail(function(){this.sandbox.emit("sulu.labels.error.show","sulu.content.restore-error-description","sulu.content.restore-error-title")}.bind(this)),!1}.bind(this),title:this.sandbox.translate("sulu-document-manager.restore-confirmation-title"),description:this.sandbox.translate("sulu-document-manager.restore-confirmation-description")})}}});