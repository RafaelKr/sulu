define(["mvc/relationalmodel","mvc/hasone","sulucontact/model/phoneType"],function(a,b,c){return a({urlRoot:"",defaults:{id:null,phone:"",phoneType:null},relations:[{type:b,key:"phoneType",relatedModel:c}]})});