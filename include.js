/*
	include.js
	@authour: Dron Rathore
	@version: 1.1b
	@depends on: OmJs Ver. 1.1+
*/

/*
	@params:
	requestUrl: String
				Description:
				The relative path or a complete path i.e.
				include("../front-end/front.css"); OR include("http://www.example.com/fron-end/include.js");
				Now if you have set the include.CDN variable then requestUrl will be appended to it.
				Or by default it will append it to the current document directory(in case it is relative).
	throughAjax: Boolean
				 Description:
				 To Force injection of the resource by calling in async mode
				 +: Automatic Debugging Enabled in this mode.
	headers: Object [optional]
			 Description:
			 Only to be used when calling with Ajax i.e.
			 include("code.js",true,{header_1:"header Value",header_2:"header value"...});
*/
function include(requestUrl,throughAjax,headers){
	if(this==window)
		return new include(requestUrl,throughAjax,headers);
	else
		this.basePath=null;
		this.requestUrl=requestUrl;
		this.throughAjax=throughAjax;
		this.headers=headers;
		this.init();
}
/*
	Relative to absolute path mapping.
*/
include.prototype.buildPath=function(URL,resourceUrl){
								/*
									First get the current position
								*/
								var current_abs=URL.substr(0,URL.lastIndexOf("/")+1);
								var current_dir_path=URL.substr(URL.indexOf("//")+2+URL.substr(URL.indexOf("//")+2,URL.length).indexOf("/")+1,URL.length);
								if(resourceUrl.indexOf("../")!=-1){
									/*
										Find in the string "../" and map the relative to absolute one.
									*/
									while(resourceUrl.indexOf("../")){
										dirty=resourceUrl.indexOf("../");
										
									}
								}else{
									/*
										Remove Leading "./"
										i.e. "./front-end/front.css" => "front-end/front.css"
									*/
									if(resourceUrl.indexOf("./")!=-1){
										resourceUrl=resourceUrl.replace("./","");
									}
								}
								return current_abs+resourceUrl;
							}
include.prototype.init=function(){
	if(!this.throughAjax){
		var head=document.getElementsByTagName("head")[0];
		/*
			If we are on the right place of the DOM we will luckily find the head node
		*/
		if(head){
			if(include.CDN){
				this.basePath=include.CDN;
			}else{
				this.basePath=this.buildPath(document.URL,this.requestUrl);
				filetype=this.requestUrl.substr(this.requestUrl.lastIndexOf("."),this.requestUrl.length).toLowerCase();
				if(filetype=="js"){
					node=document.createElement("script");
					node.type="text/javascript";
					node.src=this.basePath;
					head.appendChild(node);
					delete this;
					return true;
				}
				if(filetype=="css"){
					node=document.createElement("link");
					node.media="all";
					node.type="text/css";
					node.href=this.basePath;
					head.appendChild(node);
					delete this;
					return true;
				}
			}
			
		}else{
		/*
			We are at wrong DOM Node, will try after the page load
			Variables need to be  transformed as we can't pass "this", could create clashes
			as the function is anonymous and will be called in the BootLoader's array object's context
		*/
			requestUrl=this.requestUrl;
			throughAjax=this.throughAjax;
			headers=this.headers;
			BootLoader.add(function(){
			window.console.log(this);
			include(requestUrl,throughAjax,headers);
			});
		}
	}else{
	
	}}
include.CDN=null;
