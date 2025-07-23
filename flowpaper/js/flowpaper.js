/**
 █▒▓▒░ The FlowPaper Project

 This file is part of FlowPaper.

 For more information on FlowPaper please see the FlowPaper project
 home page: https://flowpaper.com
 */

/**
 *
 * FlowPaper helper function for retrieving a active FlowPaper instance
 *
 */
window.$FlowPaper = window.getDocViewer = window["$FlowPaper"] = function(id){
    var instance = (id==="undefined")?"":id;

    return window["FlowPaperViewer_Instance"+instance];
};

/**
 *
 * FlowPaper embedding (name of placeholder, config)
 *
 */
window.FlowPaperViewerEmbedding = window.$f = function(id, args) {
    this.id = id;

    var userAgent = navigator.userAgent.toLowerCase();
    var browser = window["eb.browser"] = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: (/webkit/.test(userAgent) || /applewebkit/.test(userAgent)) && !(/chrome/.test(userAgent)),
        opera: /opera/.test(userAgent),
        msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
        mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
        seamonkey: /seamonkey/.test(userAgent),
        chrome: /chrome/.test(userAgent)
    };

    browser.detected = browser.safari || browser.opera || browser.msie || browser.mozilla || browser.seamonkey || browser.chrome;

    // assume Chrome version 500 if we couldnt detect it
    if(!browser.detected || !browser.version){
        browser.chrome = true; browser.version = "500.00";
    }

    var platform = window["eb.platform"] = {
        win:/win/.test(userAgent),
        mac:/mac/.test(userAgent),
        touchdevice : (function(){try {return 'ontouchstart' in document.documentElement;} catch (e) {return false;} })(),
        android : (userAgent.indexOf("android") > -1),
        ios : ((userAgent.match(/iphone/i)) || (userAgent.match(/ipod/i)) || (userAgent.match(/ipad/i))),
        iphone : (userAgent.match(/iphone/i)) || (userAgent.match(/ipod/i)),
        ipad : (userAgent.match(/ipad/i)),
        winphone : userAgent.match(/Windows Phone/i),
        blackberry : userAgent.match(/BlackBerry/i) || userAgent.match(/BB10/i),
        webos : userAgent.match(/webOS/i)
    };

    platform.touchonlydevice = platform.touchdevice && (platform.android || platform.ios || platform.winphone || platform.blackberry || platform.webos);
    platform.supportsWebP = (function(){var elem = document.createElement('canvas'); if (!!(elem.getContext && elem.getContext('2d'))) { return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0; } return false;})();

    var config = args.config;
    var _SWFFile,_PDFFile,_IMGFiles,_SVGFiles,_IMGFiles_thumbs="",_IMGFiles_highres="",_JSONFile  = "",_jsDirectory="",_cssDirectory="",_localeDirectory="";_WMode = (config.WMode!=null||config.wmode!=null?config.wmode||config.WMode:"direct");
    var _uDoc = ((config.DOC !=null)?unescape(config.DOC):null);
    var instance = "FlowPaperViewer_Instance"+((id==="undefined")?"":id);
    var _JSONDataType = (config.JSONDataType!=null)?config.JSONDataType:"json";

    if (_uDoc != null) {
        _SWFFile 	        = FLOWPAPER.translateUrlByFormat(_uDoc,"swf");
        _PDFFile 	        = FLOWPAPER.translateUrlByFormat(_uDoc,"pdf");
        _JSONFile 	        = FLOWPAPER.translateUrlByFormat(_uDoc,_JSONDataType);
        _IMGFiles 	        = FLOWPAPER.translateUrlByFormat(_uDoc,"jpg");
        _SVGFiles           = FLOWPAPER.translateUrlByFormat(_uDoc,"svg");
        _IMGFiles_thumbs    = FLOWPAPER.translateUrlByFormat(_uDoc,"jpg");
        _IMGFiles_highres   = FLOWPAPER.translateUrlByFormat(_uDoc,"jpgpageslice");
    }

    _SWFFile  			= (config.SwfFile!=null?config.SwfFile:_SWFFile);
    _SWFFile  			= (config.SWFFile!=null?config.SWFFile:_SWFFile);
    _PDFFile 			= (config.PDFFile!=null?config.PDFFile:_PDFFile);
    _IMGFiles 			= (config.IMGFiles!=null?config.IMGFiles:_IMGFiles);
    _IMGFiles 			= (config.PageImagePattern!=null?config.PageImagePattern:_IMGFiles);
    _SVGFiles 			= (config.SVGFiles!=null?config.SVGFiles:_SVGFiles);
    _IMGFiles_thumbs    = (config.ThumbIMGFiles!=null?config.ThumbIMGFiles:_IMGFiles_thumbs);
    _IMGFiles_highres   = (config.HighResIMGFiles!=null?config.HighResIMGFiles:_IMGFiles_highres);
    _JSONFile 			= (config.JSONFile!=null?config.JSONFile:_JSONFile);
    _jsDirectory 		= (config.jsDirectory!=null?config.jsDirectory:FLOWPAPER.detectjsdir());
    _cssDirectory 		= (config.cssDirectory!=null?config.cssDirectory:FLOWPAPER.detectcssdir());
    _localeDirectory 	= (config.localeDirectory!=null?config.localeDirectory:"locale/");
    if(_SWFFile!=null && _SWFFile.indexOf("{" )==0 && _SWFFile.indexOf("[*," ) > 0 && _SWFFile.indexOf("]" ) > 0){_SWFFile = escape(_SWFFile);} // split file fix

    // routine for *.flowpaper.com hosted domains
    var hostname = FLOWPAPER.getHostName();

    if(hostname.indexOf(".flowpaper.")>-1 && hostname.length > 16){
        var subDomain   = hostname.substr(0,hostname.indexOf("flowpaper.")-1);
        var folderName  = window.location.pathname.split('/')[1];

        // support for trackable links
        if(hostname == 'link.flowpaper.com' && config.URLAlias){
            folderName = config.URLAlias.split('/')[3];
        }

        if(config.URLAlias){
            subDomain = config.URLAlias.substr(8,config.URLAlias.indexOf("flowpaper.")-9);
        }

        if(subDomain != "test-online" && subDomain != "online"){
            var trialHosted = subDomain.indexOf('-trial')>-1;
            var cloudUrl    = trialHosted?"https://test-cdn-online.flowpaper.com/":"https://cdn-online.flowpaper.com/";

            _IMGFiles           = _IMGFiles && _IMGFiles.indexOf('docs') == 0?cloudUrl + subDomain + '/' + folderName + '/' + _IMGFiles:_IMGFiles;
            // _PDFFile            = _PDFFile && _PDFFile.indexOf('docs') == 0 && _PDFFile.indexOf('[')>-1?cloudUrl + subDomain + '/' + folderName + '/' + _PDFFile:_PDFFile;
            _IMGFiles_thumbs    = _IMGFiles_thumbs && _IMGFiles_thumbs.indexOf('docs') == 0?cloudUrl + subDomain + '/' + folderName + '/' + _IMGFiles_thumbs:_IMGFiles_thumbs;
            _IMGFiles_highres   = _IMGFiles_highres && _IMGFiles_highres.indexOf('docs') == 0?cloudUrl + subDomain + '/' + folderName + '/' + _IMGFiles_highres:_IMGFiles_highres;

            if(config.URLAlias){
                _JSONFile       = _JSONFile && _JSONFile.indexOf('docs') == 0?config.URLAlias + _JSONFile:_JSONFile;
                _PDFFile        = _PDFFile && _PDFFile.indexOf('docs') == 0?config.URLAlias + _PDFFile:_PDFFile;

                if(config.BrandingLogo){
                    config.BrandingLogo = cloudUrl + subDomain + '/' + folderName + '/' + config.BrandingLogo;
                }
            }
        }
    }

    // overwrite StartAtPage with anything off the hash
    if(FLOWPAPER.getLocationHashParameter){
        var pageFromHash = FLOWPAPER.getLocationHashParameter('page');
        if(pageFromHash!=null){
            config.DefaultStartAtPage = config.StartAtPage;
            config.StartAtPage = pageFromHash;
        }else{
            config.DefaultStartAtPage = config.StartAtPage;
        }
    }

    if(FLOWPAPER.getLocationHashParameter){
        var previewModeFromHash = FLOWPAPER.getLocationHashParameter('PreviewMode');
        if(previewModeFromHash!=null){
            config.PreviewMode = previewModeFromHash;
        }
    }

    // remove the ?reload parameter from being shown if any
    if(FLOWPAPER.getParameterByName && FLOWPAPER.getParameterByName('reload') && window.location.href && window.location.href.indexOf('.flowpaper.com')>-1){
        var currURL             = window.location.href;
        window.history.pushState({}, document.title, currURL.replace('?reload='+FLOWPAPER.getParameterByName('reload'),''));
    }

    if(config.PreviewMode == "FrontPage" && ((_IMGFiles!=null && _IMGFiles.length>0) || (_IMGFiles_thumbs!=null && _IMGFiles_thumbs.length>0))){
        FLOWPAPER.initFrontPagePreview(id,args,(_IMGFiles_thumbs!=null && _IMGFiles_thumbs.length>0)?_IMGFiles_thumbs:_IMGFiles);
        return;
    }

    // fall back to .jpg for IMGFiles if the browser doesn't support WebP
    if(_IMGFiles && _IMGFiles.indexOf('.webp')>-1 && !platform.supportsWebP){
        _IMGFiles = _IMGFiles.replace('.webp','.jpg');
    }

    // fall back to .jpg for IMGFiles_thumbs if the browser doesn't support WebP
    if(_IMGFiles_thumbs && _IMGFiles_thumbs.indexOf('.webp')>-1 && !platform.supportsWebP){
        _IMGFiles_thumbs = _IMGFiles_thumbs.replace('.webp','.jpg');
    }

    // fall back to .jpg for IMGFiles_highres if the browser doesn't support WebP
    if(_IMGFiles_highres && _IMGFiles_highres.indexOf('.webp')>-1 && !platform.supportsWebP){
        _IMGFiles_highres = _IMGFiles_highres.replace('.webp','.jpg');
    }

    // append signature & policy to the urls if we're authenticated
    if(FLOWPAPER.authenticated){
        _SWFFile                = FLOWPAPER.appendUrlParameter(_SWFFile,FLOWPAPER.authenticated.getParams());
        _PDFFile                = FLOWPAPER.appendUrlParameter(_PDFFile,FLOWPAPER.authenticated.getParams());
        _IMGFiles               = FLOWPAPER.appendUrlParameter(_IMGFiles,FLOWPAPER.authenticated.getParams());
        _SVGFiles               = FLOWPAPER.appendUrlParameter(_SVGFiles,FLOWPAPER.authenticated.getParams());
        _JSONFile               = FLOWPAPER.appendUrlParameter(_JSONFile,FLOWPAPER.authenticated.getParams());
        _IMGFiles_thumbs        = FLOWPAPER.appendUrlParameter(_IMGFiles_thumbs,FLOWPAPER.authenticated.getParams());
        _IMGFiles_highres       = FLOWPAPER.appendUrlParameter(_IMGFiles_highres,FLOWPAPER.authenticated.getParams());
        config.BrandingLogo     = FLOWPAPER.appendUrlParameter(config.BrandingLogo,FLOWPAPER.authenticated.getParams());
    }

    // default to Zine for animated loader
    if(config.AnimatedLoader){
        config.InitViewMode = 'Zine';
    }

    window[instance] = fpembed(id, {
        src						    : _jsDirectory+"../FlowPaperViewer.swf",
        version					    : [11, 0],
        expressInstall			    : "js/expressinstall.swf",
        wmode					    : _WMode
    },{
        ElementId               : id,
        SwfFile  				: _SWFFile,
        PdfFile  				: _PDFFile,
        IMGFiles  				: _IMGFiles,
        SVGFiles  				: _SVGFiles,
        JSONFile 				: _JSONFile,
        ThumbIMGFiles           : _IMGFiles_thumbs,
        HighResIMGFiles         : _IMGFiles_highres,
        useCustomJSONFormat 	: config.useCustomJSONFormat,
        JSONPageDataFormat 		: config.JSONPageDataFormat,
        JSONDataType 			: _JSONDataType,
        FilesBlobURI            : config.FilesBlobURI,
        Scale 					: (config.Scale!=null)?config.Scale:0.8,
        ZoomTransition 			: (config.ZoomTransition!=null)?config.ZoomTransition:'easeOut',
        ZoomTime 				: (config.ZoomTime!=null)?config.ZoomTime:0.5,
        ZoomInterval 			: (config.ZoomInterval)?config.ZoomInterval:0.001,
        TouchZoomInterval       : (config.TouchZoomInterval)?config.TouchZoomInterval:1.5,
        FitPageOnLoad 			: (config.FitPageOnLoad!=null)?config.FitPageOnLoad:false,
        FitWidthOnLoad 			: (config.FitWidthOnLoad!=null)?config.FitWidthOnLoad:false,
        FullScreenAsMaxWindow 	: (config.FullScreenAsMaxWindow!=null)?config.FullScreenAsMaxWindow:false,
        ProgressiveLoading 		: (config.ProgressiveLoading!=null)?config.ProgressiveLoading:false,
        MinZoomSize 			: (config.MinZoomSize!=null)?config.MinZoomSize:0.2,
        MaxZoomSize 			: (config.MaxZoomSize!=null)?config.MaxZoomSize:5,
        SearchMatchAll 			: (config.SearchMatchAll!=null)?config.SearchMatchAll:false,
        SearchServiceUrl 		: config.SearchServiceUrl,
        InitViewMode 			: config.InitViewMode,
        DisableOverflow         : config.DisableOverflow,
        RTLMode                 : config.RTLMode,
        AnimatedLoader          : config.AnimatedLoader,
        DisplayRange            : config.DisplayRange,
        TouchInitViewMode       : config.TouchInitViewMode,
        PreviewMode             : config.PreviewMode,
        PublicationTitle        : config.PublicationTitle,
        LinkTarget              : config.LinkTarget,
        LoaderImage             : config.LoaderImage,
        MixedMode               : config.MixedMode,
        URLAlias                : config.URLAlias,
        EnableWebGL             : config.EnableWebGL,
        AutoDetectLinks         : config.AutoDetectLinks,
        ImprovedAccessibility   : config.ImprovedAccessibility,
        BitmapBasedRendering 	: (config.BitmapBasedRendering!=null)?config.BitmapBasedRendering:false,
        StartAtPage 			: (config.StartAtPage!=null&&config.StartAtPage.toString().length>0&&!isNaN(config.StartAtPage))?config.StartAtPage:1,
        DefaultStartAtPage      : config.DefaultStartAtPage,
        FontsToLoad             : config.FontsToLoad,
        PrintPaperAsBitmap		: (config.PrintPaperAsBitmap!=null)?config.PrintPaperAsBitmap:((browser.safari||browser.mozilla)?true:false),
        PrintFn                 : config.PrintFn,
        AutoAdjustPrintSize		: (config.AutoAdjustPrintSize!=null)?config.AutoAdjustPrintSize:true,
        EnableSearchAbstracts   : ((config.EnableSearchAbstracts!=null)?config.EnableSearchAbstracts:true),
        EnableCornerDragging 	: ((config.EnableCornerDragging!=null)?config.EnableCornerDragging:true), // FlowPaper Zine parameter
        BackgroundColor 		: config.BackgroundColor, // FlowPaper Zine parameter
        PanelColor 				: config.PanelColor, // FlowPaper Zine parameter
        BackgroundAlpha         : config.BackgroundAlpha, // FlowPaper Zine parameter
        UIConfig                : config.UIConfig,  // FlowPaper Zine parameter
        PageIndexAdjustment     : config.PageIndexAdjustment,
        SharingUrl              : config.SharingUrl,
        BrandingLogo            : config.BrandingLogo,
        BrandingUrl             : config.BrandingUrl,
        RestrictToDomains       : config.RestrictToDomains,

        ViewModeToolsVisible 	: ((config.ViewModeToolsVisible!=null)?config.ViewModeToolsVisible:true),
        ZoomToolsVisible 		: ((config.ZoomToolsVisible!=null)?config.ZoomToolsVisible:true),
        NavToolsVisible 		: ((config.NavToolsVisible!=null)?config.NavToolsVisible:true),
        CursorToolsVisible 		: ((config.CursorToolsVisible!=null)?config.CursorToolsVisible:true),
        SearchToolsVisible 		: ((config.SearchToolsVisible!=null)?config.SearchToolsVisible:true),
        AnnotationToolsVisible  : ((config.AnnotationToolsVisible!=null)?config.AnnotationToolsVisible:true), // Annotations viewer parameter

        StickyTools				: config.StickyTools,
        UserCollaboration       : config.UserCollaboration,
        CurrentUser             : config.CurrentUser,
        Toolbar                 : config.Toolbar,
        BottomToolbar           : config.BottomToolbar,
        DocSizeQueryService 	: config.DocSizeQueryService,

        RenderingOrder 			: config.RenderingOrder,

        TrackingNumber          : config.TrackingNumber,
        localeChain 			: (config.localeChain!=null)?config.localeChain:"en_US",
        jsDirectory 			: _jsDirectory,
        cssDirectory 			: _cssDirectory,
        localeDirectory			: _localeDirectory,
        signature               : config.signature,
        key 					: config.key
    });

    if(config.LinkTarget){
        FLOWPAPER.LinkTarget = config.LinkTarget;
    }

    // add TrackingNumber to the data collection for easier use in events later
    if(config.TrackingNumber && config.TrackingNumber.length>0){

        var _trackSWFFile = _SWFFile; if(_trackSWFFile){_trackSWFFile = (_trackSWFFile.indexOf("/")>0?_trackSWFFile.substr(_trackSWFFile.lastIndexOf("/")+1):_trackSWFFile); _trackSWFFile = _trackSWFFile.replace("_[*,0]",""); _trackSWFFile = _trackSWFFile.replace(".swf",".pdf"); _trackSWFFile = (_trackSWFFile.indexOf("}")>0?_trackSWFFile.substr(0,_trackSWFFile.lastIndexOf(",")):_trackSWFFile);}
        var _trackPDFFile = _PDFFile; if(_trackPDFFile){_trackPDFFile = (_trackPDFFile.indexOf("/")>0?_trackPDFFile.substr(_trackPDFFile.lastIndexOf("/")+1):_trackPDFFile); _trackPDFFile = _trackPDFFile.replace("_[*,0]","").replace("_[*,2]","");}
        var _trackJSONFile = _JSONFile; if(_JSONFile){_trackJSONFile = (_trackJSONFile.indexOf("/")>0?_trackJSONFile.substr(_trackJSONFile.lastIndexOf("/")+1):_trackJSONFile); _trackJSONFile = _trackJSONFile.replace("{page}",""); _trackJSONFile = _trackJSONFile.replace(".js",".pdf");}

        jQuery('#'+id).data('TrackingDocument',(_trackPDFFile || _trackSWFFile || _trackJSONFile));
        jQuery('#'+id).data('TrackingNumber',config.TrackingNumber);
    }
};

window.TrackFlowPaperEvent = function(trackingNumber,trackingDocument,eventType,eventLabel,pagenum){
    if(trackingNumber && document.location.href.indexOf('http://localhost') == -1 && document.location.href.indexOf('http://127.0.0.1') == -1){

        if(trackingNumber.indexOf('G-')==0){
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtag/js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer',jQuery(this).data('TrackingNumber'));

            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('event', eventType, { 'send_to': jQuery(this).data('TrackingNumber'), 'event_category' : eventType, 'event_label' : eventLabel });
        }
    }
};

(function() {
    if(!window.FLOWPAPER){window.FLOWPAPER = {};}

    FLOWPAPER.detectjsdir = function(){
        if(jQuery('script[src$="flowpaper.js"]').length>0){
            return jQuery('script[src$="flowpaper.js"]').attr('src').replace('flowpaper.js','');
        }else{
            return "js/"
        }
    };

    FLOWPAPER.detectcssdir= function(){
        if(jQuery('link[href$="flowpaper.css"]').length>0){
            return jQuery('link[href$="flowpaper.css"]').attr('href').replace('flowpaper.css','');
        }else{
            return "css/"
        }
    };

    // placeholder for signature/policies when using signed urls
    FLOWPAPER.authenticated=null;

    FLOWPAPER.getLocationHashParameter = function(param){
        var hash = location.hash.substr(1);

        if(hash.indexOf(param+'=')>=0){
            var value = hash.substr(hash.indexOf(param+'='))
                .split('&')[0]
                .split('=')[1];

            return value;
        }

        return null;
    };

    FLOWPAPER.translateUrlByFormat = function(url,format){
        if(url.indexOf("{") == 0 && format != "swf"){ // loading in split file mode
            url = url.substring(1,url.lastIndexOf(","));

            if(format!="pdf"){
                url = url.replace("[*,0]","{page}")
                url = url.replace("[*,2]","{page}")
            }
        }else if(format == "swf" && url.indexOf("{") != 0){
            url = url.replace("{page}", "");
            url = url.replace(/&/g, '%26');
            url = url.replace(/ /g, '%20');
        }

        if(format =="jpgpageslice"){
            url = url + "&sector={sector}";
        }

        url = (url!=null && url.indexOf('{format}') > 0 ? url.replace("{format}", format):null);
        return url;
    };

    FLOWPAPER.translateUrlByDocument = function(url,document){
        return (url!=null && url.indexOf('{doc}') > 0 ? url.replace("{doc}", document):null);
    };

    FLOWPAPER.animateDenyEffect = function(obj,margin,time,cycles,dir) {
        window.setTimeout(function(){
            var speed = time / ((2*cycles)+1);
            var margRat = 1 + (60/(cycles*cycles)); jQuery(obj).stop(true,true);
            for (var i=0; i<=cycles; i++) {
                for (var j=-1; j<=1; j+=2)
                    jQuery(obj).animate({marginLeft: (i!=cycles)*j*margin},{duration:speed, queue:true});

                margin/=margRat;
            }
        },500);
    };

    FLOWPAPER.initFrontPagePreview = function initFrontPagePreview(viewerid,args,IMGFiles){
        var animate = true;
        jQuery(document.body).css('background-color',jQuery('#'+viewerid).css('background-color'));

        var img = new Image();
        jQuery(img).bind('load',function(){
            jQuery(document.body).append(
                "<div id='flowpaper_frontpagePreview_"+viewerid+"'>"+
                "<form class='flowpaper_htmldialog' method='POST' style='display:none;top:100px;margin:"+((jQuery(window).height()>350)?"50px auto":"0px auto")+";padding-bottom:0px;'>"+
                "<div class='flowpaper_preview_container flowpaper_publications flowpaper_publication_csstransforms3d' style='overflow-y:hidden;overflow-x:hidden;text-align:center;margin: -25px -25px 0px;padding: 15px 25px 20px 25px;'>"+
                "<div class='flowpaper_publication flowpaper_publication_csstransforms3d' style='cursor:pointer;margin-bottom:20px;'>"+
                "<img src='"+(IMGFiles.replace("{page}",1))+"' />"+
                "</div>"+
                ((args.config.PublicationTitle!=null && args.config.PublicationTitle.length>0)?"<h1 class='flowpaper_htmldialog-title' style='margin-bottom:0px;'>"+unescape(args.config.PublicationTitle)+"</h1>":"")+
                "</div>"+
                "</form>"+
                "</div>"
            );

            var anim_duration = animate?1000:0;
            var anim_height_dur = animate?anim_duration/3:0;
            var theight = 260;

            jQuery('.flowpaper_htmldialog').css({height : '0px', display : 'block'});
            jQuery('.flowpaper_htmldialog').animate({'height': theight+'px','top':'0px'},{duration: anim_height_dur, complete: function(){
                    var preview_container = jQuery('#flowpaper_frontpagePreview_'+viewerid);
                    var container_width = preview_container.find('.flowpaper_preview_container').width();
                    var container_height = preview_container.find('.flowpaper_preview_container').height();

                    preview_container.find('.flowpaper_htmldialog').css({'height' : ''}); // remove height attribute to fit publication
                    preview_container.find('.flowpaper_preview_container').append("<div class='flowpaper_frontpagePreview_play' style='position:absolute;left:"+(container_width/2)+"px;top:"+(container_height/2-((args.config.PublicationTitle!=null)?50:25))+"px;width:0px;height:0px;border-bottom:50px solid transparent;border-top:50px solid transparent;border-left:50px solid #AAAAAA;'></div>");

                    var playbutton = preview_container.find('.flowpaper_frontpagePreview_play');

                    playbutton.css({opacity : 0.85, 'cursor' : 'pointer'});
                    preview_container.find('.flowpaper_publication, .flowpaper_frontpagePreview_play').on("mouseover",function(e){
                        jQuery(playbutton).css({
                            'border-left'	: '50px solid #FFFFFF',
                            opacity : 0.85
                        });
                    });

                    preview_container.find('.flowpaper_publication, .flowpaper_frontpagePreview_play').on("mouseout",function(e){
                        jQuery(playbutton).css({
                            'border-left'	: '50px solid #AAAAAA'
                        });
                    });

                    preview_container.find('.flowpaper_publication, .flowpaper_frontpagePreview_play').on("mousedown",function(e){
                        jQuery('#flowpaper_frontpagePreview_'+viewerid).remove();
                        args.config.PreviewMode=null;
                        jQuery('#'+viewerid).FlowPaperViewer(args);
                    });

                    jQuery('.flowpaper_publication').animate({opacity:1},{
                        step : function(now,fx){
                            var target = -7;var opacityfrom = -40;var diff = opacityfrom - target;var rotate = (diff * now);

                            jQuery('.flowpaper_publication').css({
                                '-webkit-transform' : 'perspective(300) rotateY('+(opacityfrom - rotate)+'deg)',
                                '-moz-transform' : 'rotateY('+(opacityfrom - rotate)+'deg)',
                                'box-shadow' : '5px 5px 20px rgba(51, 51, 51, '+now+')'
                            });
                        },
                        duration:anim_duration
                    });

                }});

        });
        img.src = (IMGFiles.replace("{page}",1));
    };

    FLOWPAPER.requireSignature = function(signService,loginFormImage,sharingPath,user){
        if($.cookie("FLOWPAPER_AUTH")){
            var cookieObj = JSON.parse($.cookie("FLOWPAPER_AUTH"));

            FLOWPAPER.authenticated = {
                Policy : cookieObj.Policy,
                Signature : cookieObj.Signature,
                KeyPairId : cookieObj.Keypairid,

                getParams : function(){
                    return 'Policy='+cookieObj.Policy+'&Signature='+cookieObj.Signature+'&Key-Pair-Id='+cookieObj.KeyPairId;
                }
            }

            $('#loginForm').remove();
            $('#documentViewer').show();
            initViewer();
        }else{
            $('#documentViewer').hide();

            FLOWPAPER.initLoginForm(loginFormImage,true,function(){
                $('#loginForm').find('form').submit(function( event ) {
                    event.preventDefault();

                    $.post(signService,
                        {
                            publicationId : sharingPath+user, // added up upload service last part being the user
                            password : $('#loginForm').find('#txt_flowpaper_password').val(),
                        }, function(data){
                            if(data && data.result == 'ACCEPT'){
                                var policy      = FLOWPAPER.getParameterByName('Policy',data.url);
                                var signature   = FLOWPAPER.getParameterByName('Signature',data.url);
                                var keypairid   = FLOWPAPER.getParameterByName('Key-Pair-Id',data.url);

                                $.cookie("FLOWPAPER_AUTH", JSON.stringify({
                                    Policy : policy,
                                    Signature : signature,
                                    KeyPairId : keypairid
                                }), { expires: 1 });

                                FLOWPAPER.authenticated = {
                                    Policy : policy,
                                    Signature : signature,
                                    KeyPairId : keypairid,

                                    getParams : function(){
                                        return 'Policy='+this.Policy+'&Signature='+this.Signature+'&Key-Pair-Id='+keypairid;
                                    }
                                }

                                $('#loginForm').remove();
                                $('#documentViewer').show();
                                initViewer();
                            }else{
                                FLOWPAPER.animateDenyEffect ('#loginForm',25,500,7,'hor');
                            }
                        });

                    return false;
                });
            });
        }
    };

    FLOWPAPER.initLoginForm = function initLoginForm(IMGFiles,animate,callback){
        jQuery(document.body).css('background-color','#dedede');

        var img = new Image();
        jQuery(img).bind('load',function(){
            jQuery(document.body).append(
                "<div id='loginForm'>"+
                "<form class='flowpaper_htmldialog' method='POST' style='display:none;top:100px;margin:"+((jQuery(window).height()>500)?"50px auto":"0px auto")+"'>"+
                "<div class='flowpaper_publications flowpaper_publication_csstransforms3d' style='overflow-y:hidden;overflow-x:hidden;text-align:center;background: #f7f7f7;margin: -25px -25px 0px;padding: 15px 25px 0px 25px;'>"+
                "<div class='flowpaper_publication flowpaper_publication_csstransforms3d' id='flowpaper_publication1'>"+
                "<img src='"+(IMGFiles.replace("{page}",1))+"' />"+
                "</div>"+

                "<h1 class='flowpaper_htmldialog-title'>password protected publication</h1>"+
                "<input type='password' id='txt_flowpaper_password' name='txt_flowpaper_password' class='flowpaper_htmldialog-input' placeholder='Enter password'>"+
                "<input type='submit' value='Submit' class='flowpaper_htmldialog-button'>"+
                "</div>"+
                "</form>"+
                "</div>"
            );

            var anim_duration = animate?1000:0;
            var anim_height_dur = animate?anim_duration/3:0;
            var theight = 400;

            jQuery('.flowpaper_htmldialog').css({height : '0px', display : 'block'});
            jQuery('.flowpaper_htmldialog').animate({'height': theight+'px','top':'0px'},{duration: anim_height_dur, complete: function(){
                    jQuery('.flowpaper_htmldialog').css({'height' : ''}); // remove height attribute to fit publication

                    jQuery('.flowpaper_publication').animate({opacity:1},{
                        step : function(now,fx){
                            var target = -7;var opacityfrom = -40;var diff = opacityfrom - target;var rotate = (diff * now);

                            jQuery('.flowpaper_publication').css({
                                '-webkit-transform' : 'perspective(300) rotateY('+(opacityfrom - rotate)+'deg)',
                                '-moz-transform' : 'rotateY('+(opacityfrom - rotate)+'deg)',
                                'box-shadow' : '5px 5px 20px rgba(51, 51, 51, '+now+')'
                            });
                        },
                        duration:anim_duration
                    });

                }});

            if(callback){callback();}

        });
        img.src = (IMGFiles.replace("{page}",1));
    };

    FLOWPAPER.getParameterByName = function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    FLOWPAPER.appendUrlParameter = function(url,param){
        if(url && url.indexOf('blob:')==-1){
            if(url.indexOf('?')>-1){
                url = url + '&' + param;
            }else{
                url = url + '?' + param;
            }
        }

        return url;
    };

    FLOWPAPER.blockedNewWindow = function(poppedWindow){
        var result = false;

        try {
            if (typeof poppedWindow == 'undefined') {
                // Safari with popup blocker... leaves the popup window handle undefined
                result = true;
            }
            else if (poppedWindow && poppedWindow.closed) {
                // This happens if the user opens and closes the client window...
                // Confusing because the handle is still available, but it's in a "closed" state.
                // We're not saying that the window is not being blocked, we're just saying
                // that the window has been closed before the test could be run.
                result = false;
            }
            else if (poppedWindow && poppedWindow.document) {
                // This is the actual test. The client window should be fine.
                result = false;
            }
            else {
                // Else we'll assume the window is not OK
                result = true;
            }

        } catch (err) {
            //if (console) {
            //    console.warn("Could not access popup window", err);
            //}
        }

        return result;
    };

    FLOWPAPER.getHostName = function(){
        try{
            var url = window.location.href;
            if(!url){return '';}

            var    a      = document.createElement('a');
            if(url.indexOf('http')==-1){url='http://'+url;}
            a.href = url;
            return a.hostname;
        }catch(e){
            return '';
        }
    };
})();

/**
 *
 * FlowPaper embedding functionality.
 *
 */

(function() {
    var  ua = navigator.userAgent.toLowerCase();
    var  IE = document.all,
        JQUERY = typeof jQuery == 'function',
        RE = /(\d+)[^\d]+(\d+)[^\d]*(\d*)/,
        INMETRO = /msie/.test(ua) && (function(){try {return !!new ActiveXObject("htmlfile");} catch (e) {return false;} })() && navigator.platform == "Win64" && (document.documentElement.clientWidth == screen.width),
        MOBILE = (function(){try {return 'ontouchstart' in document.documentElement;} catch (e) {return false;} })() || ua.match(/touch/i),
        MOBILEOS = ((ua.indexOf("android") > -1) || ((ua.match(/iphone/i)) || (ua.match(/ipod/i)) || (ua.match(/ipad/i))) || ua.match(/Windows Phone/i) || ua.match(/BlackBerry/i) || ua.match(/webOS/i)),
        GLOBAL_OPTS = {
            // very common opts
            width: '100%',
            height: '100%',
            id: "_" + ("" + Math.random()).slice(9),

            // fpembed defaults
            allowfullscreen: true,
            allowscriptaccess: 'always',
            quality: 'high',
            allowFullScreenInteractive : true,

            // fpembed specific options
            version: [10, 0],
            onFail: null,
            expressInstall: null,
            w3c: false,
            cachebusting: false
        };

    window.isTouchScreen = MOBILE && (MOBILEOS || INMETRO);
    
    // simple extend
    function extend(to, from) {
        if (from) {
            for (var key in from) {
                if (from.hasOwnProperty(key)) {
                    to[key] = from[key];
                }
            }
        }
        return to;
    }

    // used by asString method
    function map(arr, func) {
        var newArr = [];
        for (var i in arr) {
            if (arr.hasOwnProperty(i)) {
                newArr[i] = func(arr[i]);
            }
        }
        return newArr;
    }

    window.fpembed = function(root, opts, conf) {
        // root must be found / loaded
        if (typeof root == 'string') {
            root = document.getElementById(root.replace("#", ""));
        }

        // not found
        if (!root) { return; }

        root.onclick = function(){return false;}

        if (typeof opts == 'string') {
            opts = {src: opts};
        }

        return new viewerEmbed(root, extend(extend({}, GLOBAL_OPTS), opts), conf);
    };

    // fpembed "static" API
    var f = extend(window.fpembed, {

        conf: GLOBAL_OPTS

    });

    function viewerEmbed(root, opts, conf) {
        var browser = window["eb.browser"];
        browser.version = browser.version?browser.version:"";

        var platform = window["eb.platform"];

        var supportsHTML4   = (browser.mozilla && browser.version.split(".")[0] >= 3) ||
            (browser.chrome) ||
            (browser.msie && browser.version.split(".")[0] >= 8) ||
            (browser.safari) ||
            (browser.opera);

        var supportsCanvasDrawing 	= 	(browser.mozilla && browser.version.split(".")[0] >= 4 && !browser.seamonkey) ||
            (browser.chrome) ||
            (browser.msie && browser.version.split(".")[0] >= 9) ||
            (browser.safari && browser.version.split(".")[0] >= 535 /*&& !platform.ios*/);

        // Default to a rendering mode if its not set
        if(!conf.RenderingOrder && conf.JSONFile !=  null && conf.JSONFile){conf.RenderingOrder = "html";}
        if(!conf.RenderingOrder && conf.PdfFile !=  null){conf.RenderingOrder = "html5";}

        if(platform.ios){
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            if(v!=null && v.length>1){
                platform.iosversion = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)][0];
            }
        }

        var viewerId = jQuery(root).attr('id');
        var instance = "FlowPaperViewer_Instance"+((viewerId==="undefined")?"":viewerId);


        window['ViewerMode'] = 'html';
        //jQuery.noConflict();

        jQuery(document).ready(function() {
            if(conf.Toolbar){jQuery.fn.showFullScreen = function(){$FlowPaper(jQuery(this).attr('id')).openFullScreen();}}

            // Enable cache of scripts. You can disable this if you want to force FlowPaper to use a non-cached version every time.
            jQuery.ajaxSetup({
                cache: true
            });
            
            var scriptPromise = new jQuery.Deferred();

            if(!window["FlowPaperViewer_HTML"]){
                jQuery.getScript(conf.jsDirectory+'FlowPaperViewer.js').then(function(){scriptPromise.resolve();}).fail(function(){
                    if(arguments[0].readyState==0){
                        console.log("failed to load FlowPaperViewer.js. Check your resources");
                    }else{
                        //script loaded but failed to parse
                        console.log(arguments[2].toString());
                    }
                });
            }else{
                scriptPromise.resolve();
            }

            if(scriptPromise.then(function(){
                    // If rendering order isnt set but the formats are supplied then assume the rendering order.
                    if(!conf.RenderingOrder){
                        conf.RenderingOrder = "";
                        if(conf.PdfFile!=null){conf.RenderingOrder = "html5";}
                    }

                    // add fallback for html if not specified
                    if(conf.JSONFile!=null && conf.JSONFile.length>0 && conf.IMGFiles!=null && conf.IMGFiles.length>0){
                        if((browser.safari /*&& (platform.iosversion<8 && platform.ipad)*/) || platform.android || (browser.msie && browser.version <=9) || platform.mobilepreview){ // ios should use html as preferred rendering mode if available.
                            conf.RenderingOrder = "html" + (conf.RenderingOrder.length>0?",":"") + conf.RenderingOrder;
                        }else{
                            conf.RenderingOrder += (conf.RenderingOrder.length>0?",":"")+"html";
                        }
                    }

                    var oRenderingList 	        = conf.RenderingOrder.split(",");
                    var pageRenderer 	        = null;
                    var usingFlattenedPDF       = conf.FontsToLoad && conf.FontsToLoad.length>0;

                    // if PDFJS isn't supported and the html formats are supplied, then use these as primary format
                    if(oRenderingList && oRenderingList.length==1 && conf.JSONFile!=null && conf.JSONFile.length>0 && conf.IMGFiles!=null && conf.IMGFiles.length>0 && !supportsCanvasDrawing){
                        oRenderingList[1] = conf.RenderingOrder[0];
                        oRenderingList[0] = 'html';
                    }

                    var autoNavigatePages = FLOWPAPER.getLocationHashParameter('AutoNavigatePages');

                    if(autoNavigatePages){
                        conf.InitViewMode = 'FlipView';

                        var simulateMobile = FLOWPAPER.getLocationHashParameter('SimulateMobile');
                        if(simulateMobile){ // #AutoNavigatePages=3&SimulateMobile=true
                            conf.InitViewMode = 'Flip-SinglePage';
                            conf.SimulateMobile = true;
                        }
                    }

                    if(!usingFlattenedPDF && conf.PdfFile!=null && conf.PdfFile.length>0 && conf.RenderingOrder.split(",").length>=1 && supportsCanvasDrawing && (oRenderingList[0] == 'html5') && !autoNavigatePages){
                        pageRenderer = new CanvasPageRenderer(viewerId,conf.PdfFile,conf.jsDirectory,
                            {
                                jsonfile                : conf.JSONFile,
                                pageImagePattern        : conf.IMGFiles,
                                pageThumbImagePattern   : conf.ThumbIMGFiles,
                                compressedJSONFormat    : !conf.useCustomJSONFormat,
                                JSONPageDataFormat      : conf.JSONPageDataFormat,
                                JSONDataType            : conf.JSONDataType,
                                FilesBlobURI            : conf.FilesBlobURI,
                                MixedMode               : conf.MixedMode,
                                URLAlias                : conf.URLAlias,
                                signature               : conf.signature,
                                PageIndexAdjustment     : conf.PageIndexAdjustment,
                                DisableShadows          : conf.DisableOverflow,
                                DisplayRange            : conf.DisplayRange,
                                RTLMode                 : conf.RTLMode
                            });
                    }else{
                        pageRenderer = new ImagePageRenderer(
                            viewerId,
                            {
                                jsonfile                : conf.JSONFile,
                                pageImagePattern        : conf.IMGFiles,
                                pageThumbImagePattern   : conf.ThumbIMGFiles,
                                pageHighResImagePattern : conf.HighResIMGFiles,
                                pageSVGImagePattern     : conf.SVGFiles,
                                compressedJSONFormat    : !conf.useCustomJSONFormat,
                                JSONPageDataFormat      : conf.JSONPageDataFormat,
                                JSONDataType            : conf.JSONDataType,
                                FilesBlobURI            : conf.FilesBlobURI,
                                SVGMode                 : conf.RenderingOrder.toLowerCase().indexOf('svg')>=0,
                                MixedMode               : conf.MixedMode,
                                URLAlias                : conf.URLAlias,
                                signature               : conf.signature,
                                PageIndexAdjustment     : conf.PageIndexAdjustment,
                                DisableShadows          : conf.DisableOverflow,
                                DisableOverflow         : conf.DisableOverflow,
                                DisplayRange            : conf.DisplayRange,
                                RTLMode                 : conf.RTLMode,
                                FontsToLoad             : conf.FontsToLoad
                            },
                            conf.jsDirectory);
                    }

                    var flowpaper_html = window[instance] = new FlowPaperViewer_HTML({
                        rootid 		    : viewerId,
                        Toolbar 	    : ((conf.Toolbar!=null)?conf.Toolbar:null),
                        BottomToolbar   : ((conf.BottomToolbar!=null)?conf.BottomToolbar:null),
                        instanceid 	: instance,
                        document: {
                            SWFFile 				: conf.SwfFile,
                            IMGFiles 				: conf.IMGFiles,
                            ThumbIMGFiles           : conf.ThumbIMGFiles,
                            JSONFile 				: conf.JSONFile,
                            PDFFile 				: conf.PdfFile,
                            Scale 					: conf.Scale,
                            FitPageOnLoad 			: conf.FitPageOnLoad,
                            FitWidthOnLoad 			: conf.FitWidthOnLoad,
                            FullScreenAsMaxWindow   : conf.FullScreenAsMaxWindow,
                            MinZoomSize 			: conf.MinZoomSize,
                            MaxZoomSize 			: conf.MaxZoomSize,
                            SearchMatchAll 			: conf.SearchMatchAll,
                            InitViewMode 			: conf.InitViewMode,
                            SimulateMobile          : conf.SimulateMobile,
                            DisableOverflow         : conf.DisableOverflow,
                            DisplayRange            : conf.DisplayRange,
                            RTLMode                 : conf.RTLMode,
                            AnimatedLoader          : conf.AnimatedLoader,
                            TouchInitViewMode       : conf.TouchInitViewMode,
                            PreviewMode             : conf.PreviewMode,
                            PublicationTitle        : conf.PublicationTitle,
                            MixedMode               : conf.MixedMode,
                            URLAlias                : conf.URLAlias,
                            LoaderImage             : conf.LoaderImage,
                            SharingUrl              : conf.SharingUrl,
                            BrandingLogo            : conf.BrandingLogo,
                            BrandingUrl             : conf.BrandingUrl,
                            RestrictToDomains       : conf.RestrictToDomains,
                            EnableWebGL             : conf.EnableWebGL,
                            StartAtPage 			: conf.StartAtPage,
                            DefaultStartAtPage      : conf.DefaultStartAtPage,
                            RenderingOrder 			: conf.RenderingOrder,
                            useCustomJSONFormat 	: conf.useCustomJSONFormat,
                            JSONPageDataFormat 		: conf.JSONPageDataFormat,
                            JSONDataType 			: conf.JSONDataType,
                            FilesBlobURI            : conf.FilesBlobURI,
                            ZoomTime     			: conf.ZoomTime,
                            ZoomTransition          : conf.ZoomTransition,
                            ZoomInterval 			: conf.ZoomInterval,
                            TouchZoomInterval       : conf.TouchZoomInterval,
                            ViewModeToolsVisible 	: conf.ViewModeToolsVisible,
                            ZoomToolsVisible 		: conf.ZoomToolsVisible,
                            NavToolsVisible 		: conf.NavToolsVisible,
                            CursorToolsVisible 		: conf.CursorToolsVisible,
                            SearchToolsVisible 		: conf.SearchToolsVisible,
                            AnnotationToolsVisible  : conf.AnnotationToolsVisible,
                            StickyTools 			: conf.StickyTools,
                            AutoDetectLinks         : conf.AutoDetectLinks,
                            ImprovedAccessibility   : conf.ImprovedAccessibility,
                            PrintPaperAsBitmap 		: conf.PrintPaperAsBitmap,
                            PrintFn                 : conf.PrintFn,
                            AutoAdjustPrintSize 	: conf.AutoAdjustPrintSize,
                            EnableSearchAbstracts   : conf.EnableSearchAbstracts,
                            EnableCornerDragging	: conf.EnableCornerDragging,
                            UIConfig                : conf.UIConfig,
                            BackgroundColor			: conf.BackgroundColor, // FlowPaper Zine parameter
                            PanelColor				: conf.PanelColor, // FlowPaper Zine parameter

                            localeChain 			: conf.localeChain
                        },
                        renderer 			: pageRenderer,
                        key 				: conf.key,
                        jsDirectory 		: conf.jsDirectory,
                        localeDirectory 	: conf.localeDirectory,
                        cssDirectory 		: conf.cssDirectory,
                        docSizeQueryService : conf.DocSizeQueryService,
                        UserCollaboration   : conf.UserCollaboration,
                        CurrentUser         : conf.CurrentUser
                    });

                    flowpaper_html.initialize();
                    flowpaper_html.bindEvents();

                    flowpaper_html['load'] = flowpaper_html.loadFromUrl;
                    flowpaper_html['loadDoc'] = flowpaper_html.loadDoc;
                    flowpaper_html['fitWidth'] = flowpaper_html.fitwidth;
                    flowpaper_html['fitHeight'] = flowpaper_html.fitheight;
                    flowpaper_html['gotoPage'] = flowpaper_html.gotoPage;
                    flowpaper_html['getSessionId'] = flowpaper_html.getSessionId;
                    flowpaper_html['getCurrPage'] = flowpaper_html.getCurrPage;
                    flowpaper_html['getTotalPages'] = flowpaper_html.getTotalPages;
                    flowpaper_html['nextPage'] = flowpaper_html.next;
                    flowpaper_html['prevPage'] = flowpaper_html.previous;
                    flowpaper_html['setZoom'] = flowpaper_html.Zoom;
                    flowpaper_html['Zoom'] = flowpaper_html.Zoom;
                    flowpaper_html['ZoomIn'] = flowpaper_html.ZoomIn;
                    flowpaper_html['ZoomOut'] = flowpaper_html.ZoomOut;
                    flowpaper_html['openFullScreen'] = flowpaper_html.openFullScreen;
                    flowpaper_html['sliderChange'] = flowpaper_html.sliderChange;
                    flowpaper_html['searchText'] = flowpaper_html.searchText;
                    flowpaper_html['expandOutline'] = flowpaper_html.expandOutline;
                    flowpaper_html['resize'] = flowpaper_html.resize;
                    flowpaper_html['rotate'] = flowpaper_html.rotate;
                    flowpaper_html['addLink'] = flowpaper_html.addLink;
                    flowpaper_html['addImage'] = flowpaper_html.addImage;
                    flowpaper_html['addVideo'] = flowpaper_html.addVideo;

                    //flowpaper_html['nextSearchMatch'] = flowpaper_html.nextSearchMatch; //TBD
                    //flowpaper_html['prevSearchMatch'] = flowpaper_html.nextSearchMatch; //TBD
                    flowpaper_html['switchMode'] = flowpaper_html.switchMode;
                    flowpaper_html['printPaper'] = flowpaper_html.printPaper;
                    flowpaper_html['highlight'] = flowpaper_html.highlight;
                    flowpaper_html['getCurrentRenderingMode'] = flowpaper_html.getCurrentRenderingMode;
                    //flowpaper_html['postSnapshot'] = flowpaper_html.postSnapshot; //TBD
                    flowpaper_html['setCurrentCursor'] = flowpaper_html.setCurrentCursor;
                    flowpaper_html['showFullScreen'] = flowpaper_html.openFullScreen;

                    pageRenderer.initialize(function(){
                        flowpaper_html.document.numPages = pageRenderer.getNumPages();
                        flowpaper_html.document.dimensions = pageRenderer.getDimensions();
                        flowpaper_html.show();
                        window[instance] = flowpaper_html;
                    },{
                        StartAtPage : conf.StartAtPage,
                        MixedMode : conf.MixedMode
                    });
                }));
            });


        // bind a listener to the hash change event and change page if the user changes the page hash parameter
        jQuery(window).bind('hashchange',(function() {
            var page = FLOWPAPER.getLocationHashParameter('page');
            if(page){
                if(isNaN(page)){ // look it up through
                    var label = $FlowPaper(viewerId).getLabel(page);
                    if(label){
                        $FlowPaper(viewerId).gotoPage(label.pageNumber);
                    }
                }else{
                    $FlowPaper(viewerId).gotoPage(page);
                }
            }
        }));

        // http://flowplayer.org/forum/8/18186#post-18593
        if (IE) {
            window[opts.id] = document.getElementById(opts.id);
        }

        // API methods for callback
        extend(this, {

            getRoot: function() {
                return root;
            },

            getOptions: function() {
                return opts;
            },


            getConf: function() {
                return conf;
            },

            getApi: function() {
                return root.firstChild;
            }

        });
    }

    // setup jquery support
    if (JQUERY) {
        jQuery.fn.fpembed = function(opts, conf) {
            return this.each(function() {
                jQuery(this).data("fpembed", fpembed(this, opts, conf));
            });
        };

        jQuery.fn.FlowPaperViewer = function(args){
            jQuery('#'+this.attr('id')).empty();

            var embed = new FlowPaperViewerEmbedding(this.attr('id'),args);
            this.element = jQuery('#'+embed.id);
            return this.element;
        };
    }else{
        throw new Error("jQuery missing!");
    }
})();

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (suffix) {
        return (this.substr(this.length - suffix.length) === suffix);
    }
}

var BinaryFileUtils = {};
BinaryFileUtils._getBinaryFromXHR = function (xhr) {
    // for xhr.responseText, the 0xFF mask is applied by JSZip
    return xhr.response || xhr.responseText;
};

// taken from jQuery
function createStandardXHR() {
    try {
        return new window.XMLHttpRequest();
    } catch( e ) {}
}

function createActiveXHR() {
    try {
        return new window.ActiveXObject("Microsoft.XMLHTTP");
    } catch( e ) {}
}

// Create the request object
var createXHR = (typeof window !== "undefined" && window.ActiveXObject) ?
    /* Microsoft failed to properly
     * implement the XMLHttpRequest in IE7 (can't request local files),
     * so we use the ActiveXObject when it is available
     * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
     * we need a fallback.
     */
    function() {
        return createStandardXHR() || createActiveXHR();
    } :
    // For all other browsers, use the standard XMLHttpRequest object
    createStandardXHR;



BinaryFileUtils.getBinaryContent = function(path, callback) {
    try {

        var xhr = createXHR();

        xhr.open('GET', path, true);

        // recent browsers
        if ("responseType" in xhr) {
            xhr.responseType = "arraybuffer";
        }

        // older browser
        if(xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }

        xhr.onreadystatechange = function(evt) {
            var file, err;
            // use `xhr` and not `this`... thanks IE
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    file = null;
                    err = null;
                    try {
                        file = BinaryFileUtils._getBinaryFromXHR(xhr);
                    } catch(e) {
                        err = new Error(e);
                    }
                    callback(err, file);
                } else {
                    callback(new Error("Ajax error for " + path + " : " + this.status + " " + this.statusText), null);
                }
            }
        };

        xhr.send();

    } catch (e) {
        callback(new Error(e), null);
    }
};
function getIEversion()
// Returns the version of Internet Explorer or a -1. 
// (indicating the use of another browser).
{
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat( RegExp.$1 );
    }
    return rv;
}


// Initializing PDFJS global object here, it case if we need to change/disable
// some PDF.js features, e.g. range requests
if (typeof PDFJS === 'undefined') {
  (typeof window !== 'undefined' ? window : this).PDFJS = {};
}

window.unsupportedPDFJSieversion = getIEversion()>0 && getIEversion()<9;

// Checking if the typed arrays are supported
// Support: iOS<6.0 (subarray), IE<10, Android<4.0
(function checkTypedArrayCompatibility() {
  if (typeof Uint8Array !== 'undefined') {
    // Support: iOS<6.0
    if (typeof Uint8Array.prototype.subarray === 'undefined') {
        Uint8Array.prototype.subarray = function subarray(start, end) {
          return new Uint8Array(this.slice(start, end));
        };
        Float32Array.prototype.subarray = function subarray(start, end) {
          return new Float32Array(this.slice(start, end));
        };
    }

    // Support: Android<4.1
    if (typeof Float64Array === 'undefined') {
      window.Float64Array = Float32Array;
    }
    return;
  }

  function subarray(start, end) {
    return new TypedArray(this.slice(start, end));
  }

  function setArrayOffset(array, offset) {
    if (arguments.length < 2) {
      offset = 0;
    }
    for (var i = 0, n = array.length; i < n; ++i, ++offset) {
      this[offset] = array[i] & 0xFF;
    }
  }

  function TypedArray(arg1) {
    var result, i, n;
    if (typeof arg1 === 'number') {
      result = [];
      for (i = 0; i < arg1; ++i) {
        result[i] = 0;
      }
    } else if ('slice' in arg1) {
      result = arg1.slice(0);
    } else {
      result = [];
      for (i = 0, n = arg1.length; i < n; ++i) {
        result[i] = arg1[i];
      }
    }

    result.subarray = subarray;
    result.buffer = result;
    result.byteLength = result.length;
    result.set = setArrayOffset;

    if (typeof arg1 === 'object' && arg1.buffer) {
      result.buffer = arg1.buffer;
    }
    return result;
  }

  window.Uint8Array = TypedArray;
  window.Int8Array = TypedArray;

  // we don't need support for set, byteLength for 32-bit array
  // so we can use the TypedArray as well
  window.Uint32Array = TypedArray;
  window.Int32Array = TypedArray;
  window.Uint16Array = TypedArray;
  window.Float32Array = TypedArray;
  window.Float64Array = TypedArray;
})();

// URL = URL || webkitURL
// Support: Safari<7, Android 4.2+
(function normalizeURLObject() {
  if (!window.URL) {
    window.URL = window.webkitURL;
  }
})();

// Object.defineProperty()?
// Support: Android<4.0, Safari<5.1
(function checkObjectDefinePropertyCompatibility() {
  if(window.unsupportedPDFJSieversion){return;}

  if (typeof Object.defineProperty !== 'undefined') {
    var definePropertyPossible = true;
    try {
      // some browsers (e.g. safari) cannot use defineProperty() on DOM objects
      // and thus the native version is not sufficient
      Object.defineProperty(new Image(), 'id', { value: 'test' });
      // ... another test for android gb browser for non-DOM objects
//      var Test = function Test() {};
//      Test.prototype = { get id() { } };
//      Object.defineProperty(new Test(), 'id',
//        { value: '', configurable: true, enumerable: true, writable: false });
        eval("var Test = function Test() {};Test.prototype = { get id() { } };Object.defineProperty(new Test(), 'id',{ value: '', configurable: true, enumerable: true, writable: false });");
    } catch (e) {
      definePropertyPossible = false;
    }
    if (definePropertyPossible) {
      return;
    }
  }

  Object.defineProperty = function objectDefineProperty(obj, name, def) {
    delete obj[name];
    if ('get' in def) {
      obj.__defineGetter__(name, def['get']);
    }
    if ('set' in def) {
      obj.__defineSetter__(name, def['set']);
    }
    if ('value' in def) {
      obj.__defineSetter__(name, function objectDefinePropertySetter(value) {
        this.__defineGetter__(name, function objectDefinePropertyGetter() {
          return value;
        });
        return value;
      });
      obj[name] = def.value;
    }
  };
})();


// No XMLHttpRequest#response?
// Support: IE<11, Android <4.0
(function checkXMLHttpRequestResponseCompatibility() {
  if(window.unsupportedPDFJSieversion){return;}
  var xhrPrototype = XMLHttpRequest.prototype;
  var xhr = new XMLHttpRequest();
  if (!('overrideMimeType' in xhr)) {
    // IE10 might have response, but not overrideMimeType
    // Support: IE10
    Object.defineProperty(xhrPrototype, 'overrideMimeType', {
      value: function xmlHttpRequestOverrideMimeType(mimeType) {}
    });
  }
  if ('responseType' in xhr) {
    return;
  }

  // The worker will be using XHR, so we can save time and disable worker.
  PDFJS.disableWorker = true;

  Object.defineProperty(xhrPrototype, 'responseType', {
    get: function xmlHttpRequestGetResponseType() {
      return this._responseType || 'text';
    },
    set: function xmlHttpRequestSetResponseType(value) {
      if (value === 'text' || value === 'arraybuffer') {
        this._responseType = value;
        if (value === 'arraybuffer' &&
            typeof this.overrideMimeType === 'function') {
          this.overrideMimeType('text/plain; charset=x-user-defined');
        }
      }
    }
  });

  // Support: IE9
  if (typeof VBArray !== 'undefined') {
    Object.defineProperty(xhrPrototype, 'response', {
      get: function xmlHttpRequestResponseGet() {
        if (this.responseType === 'arraybuffer') {
          return new Uint8Array(new VBArray(this.responseBody).toArray());
        } else {
          return this.responseText;
        }
      }
    });
    return;
  }

  Object.defineProperty(xhrPrototype, 'response', {
    get: function xmlHttpRequestResponseGet() {
      if (this.responseType !== 'arraybuffer') {
        return this.responseText;
      }
      var text = this.responseText;
      var i, n = text.length;
      var result = new Uint8Array(n);
      for (i = 0; i < n; ++i) {
        result[i] = text.charCodeAt(i) & 0xFF;
      }
      return result.buffer;
    }
  });
})();

// window.btoa (base64 encode function) ?
// Support: IE<10
(function checkWindowBtoaCompatibility() {
  if ('btoa' in window) {
    return;
  }

  var digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  window.btoa = function windowBtoa(chars) {
    var buffer = '';
    var i, n;
    for (i = 0, n = chars.length; i < n; i += 3) {
      var b1 = chars.charCodeAt(i) & 0xFF;
      var b2 = chars.charCodeAt(i + 1) & 0xFF;
      var b3 = chars.charCodeAt(i + 2) & 0xFF;
      var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
      var d3 = i + 1 < n ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
      var d4 = i + 2 < n ? (b3 & 0x3F) : 64;
      buffer += (digits.charAt(d1) + digits.charAt(d2) +
                 digits.charAt(d3) + digits.charAt(d4));
    }
    return buffer;
  };
})();

// window.atob (base64 encode function)?
// Support: IE<10
(function checkWindowAtobCompatibility() {
  if ('atob' in window) {
    return;
  }

  // https://github.com/davidchambers/Base64.js
  var digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  window.atob = function (input) {
    input = input.replace(/=+$/, '');
    if (input.length % 4 === 1) {
      throw new Error('bad atob input');
    }
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = input.charAt(idx++);
      // character found in table?
      // initialize bit storage and add its ascii value
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = digits.indexOf(buffer);
    }
    return output;
  };
})();

// Function.prototype.bind?
// Support: Android<4.0, iOS<6.0
(function checkFunctionPrototypeBindCompatibility() {
  if (typeof Function.prototype.bind !== 'undefined') {
    return;
  }

  Function.prototype.bind = function functionPrototypeBind(obj) {
    var fn = this, headArgs = Array.prototype.slice.call(arguments, 1);
    var bound = function functionPrototypeBindBound() {
      var args = headArgs.concat(Array.prototype.slice.call(arguments));
      return fn.apply(obj, args);
    };
    return bound;
  };
})();

// HTMLElement dataset property
// Support: IE<11, Safari<5.1, Android<4.0
(function checkDatasetProperty() {
  if(window.unsupportedPDFJSieversion){return;}

  var div = document.createElement('div');
  if ('dataset' in div) {
    return; // dataset property exists
  }

  Object.defineProperty(HTMLElement.prototype, 'dataset', {
    get: function() {
      if (this._dataset) {
        return this._dataset;
      }

      var dataset = {};
      for (var j = 0, jj = this.attributes.length; j < jj; j++) {
        var attribute = this.attributes[j];
        if (attribute.name.substring(0, 5) !== 'data-') {
          continue;
        }
        var key = attribute.name.substring(5).replace(/\-([a-z])/g,
          function(all, ch) {
            return ch.toUpperCase();
          });
        dataset[key] = attribute.value;
      }

      Object.defineProperty(this, '_dataset', {
        value: dataset,
        writable: false,
        enumerable: false
      });
      return dataset;
    },
    enumerable: true
  });
})();

// HTMLElement classList property
// Support: IE<10, Android<4.0, iOS<5.0
(function checkClassListProperty() {
  if(window.unsupportedPDFJSieversion){return;}

  var div = document.createElement('div');
  if ('classList' in div) {
    return; // classList property exists
  }

  function changeList(element, itemName, add, remove) {
    var s = element.className || '';
    var list = s.split(/\s+/g);
    if (list[0] === '') {
      list.shift();
    }
    var index = list.indexOf(itemName);
    if (index < 0 && add) {
      list.push(itemName);
    }
    if (index >= 0 && remove) {
      list.splice(index, 1);
    }
    element.className = list.join(' ');
    return (index >= 0);
  }

  var classListPrototype = {
    add: function(name) {
      changeList(this.element, name, true, false);
    },
    contains: function(name) {
      return changeList(this.element, name, false, false);
    },
    remove: function(name) {
      changeList(this.element, name, false, true);
    },
    toggle: function(name) {
      changeList(this.element, name, true, true);
    }
  };

  Object.defineProperty(HTMLElement.prototype, 'classList', {
    get: function() {
      if (this._classList) {
        return this._classList;
      }

      var classList = Object.create(classListPrototype, {
        element: {
          value: this,
          writable: false,
          enumerable: true
        }
      });
      Object.defineProperty(this, '_classList', {
        value: classList,
        writable: false,
        enumerable: false
      });
      return classList;
    },
    enumerable: true
  });
})();

// Check console compatibility
// In older IE versions the console object is not available
// unless console is open.
// Support: IE<10
(function checkConsoleCompatibility() {
  if(window.unsupportedPDFJSieversion){return;}

  if (!('console' in window)) {
    window.console = {
      log: function() {},
      error: function() {},
      warn: function() {}
    };
  } else if (!('bind' in console.log)) {
    // native functions in IE9 might not have bind
    console.log = (function(fn) {
      return function(msg) { return fn(msg); };
    })(console.log);
    console.error = (function(fn) {
      return function(msg) { return fn(msg); };
    })(console.error);
    console.warn = (function(fn) {
      return function(msg) { return fn(msg); };
    })(console.warn);
  }
})();

// Check onclick compatibility in Opera
// Support: Opera<15
(function checkOnClickCompatibility() {
  // workaround for reported Opera bug DSK-354448:
  // onclick fires on disabled buttons with opaque content
  function ignoreIfTargetDisabled(event) {
    if (isDisabled(event.target)) {
      event.stopPropagation();
    }
  }
  function isDisabled(node) {
    return node.disabled || (node.parentNode && isDisabled(node.parentNode));
  }
  if (navigator.userAgent.indexOf('Opera') !== -1) {
    // use browser detection since we cannot feature-check this bug
    document.addEventListener('click', ignoreIfTargetDisabled, true);
  }
})();

// Checks if possible to use URL.createObjectURL()
// Support: IE
(function checkOnBlobSupport() {
  // sometimes IE loosing the data created with createObjectURL(), see #3977
  if (navigator.userAgent.indexOf('Trident') >= 0) {
    PDFJS.disableCreateObjectURL = true;
  }
})();

// Checks if navigator.language is supported
(function checkNavigatorLanguage() {
  if ('language' in navigator &&
      /^[a-z]+(-[A-Z]+)?$/.test(navigator.language)) {
    return;
  }
  function formatLocale(locale) {
    var split = locale.split(/[-_]/);
    split[0] = split[0].toLowerCase();
    if (split.length > 1) {
      split[1] = split[1].toUpperCase();
    }
    return split.join('-');
  }
  var language = navigator.language || navigator.userLanguage || 'en-US';
  PDFJS.locale = formatLocale(language);
})();

(function checkRangeRequests() {
  // Safari has issues with cached range requests see:
  // https://github.com/mozilla/pdf.js/issues/3260
  // Last tested with version 6.0.4.
  // Support: Safari 6.0+
  var isSafari = Object.prototype.toString.call(
                  window.HTMLElement).indexOf('Constructor') > 0;

  // Older versions of Android (pre 3.0) has issues with range requests, see:
  // https://github.com/mozilla/pdf.js/issues/3381.
  // Make sure that we only match webkit-based Android browsers,
  // since Firefox/Fennec works as expected.
  // Support: Android<3.0
  var regex = /Android\s[0-2][^\d]/;
  var isOldAndroid = regex.test(navigator.userAgent);

  if (isSafari || isOldAndroid) {
    PDFJS.disableRange = true;
    PDFJS.disableStream = true;
  }
})();

// Check if the browser supports manipulation of the history.
// Support: IE<10, Android<4.2
(function checkHistoryManipulation() {
  // Android 2.x has so buggy pushState support that it was removed in
  // Android 3.0 and restored as late as in Android 4.2.
  // Support: Android 2.x
  if (!history.pushState || navigator.userAgent.indexOf('Android 2.') >= 0) {
    PDFJS.disableHistory = true;
  }
})();

// Support: IE<11, Chrome<21, Android<4.4, Safari<6
(function checkSetPresenceInImageData() {
  // IE < 11 will use window.CanvasPixelArray which lacks set function.
  if (window.CanvasPixelArray) {
    if (typeof window.CanvasPixelArray.prototype.set !== 'function') {
      window.CanvasPixelArray.prototype.set = function(arr) {
        for (var i = 0, ii = this.length; i < ii; i++) {
          this[i] = arr[i];
        }
      };
    }
  } else {
    // Old Chrome and Android use an inaccessible CanvasPixelArray prototype.
    // Because we cannot feature detect it, we rely on user agent parsing.
    var polyfill = false, versionMatch;
    if (navigator.userAgent.indexOf('Chrom') >= 0) {
      versionMatch = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
      // Chrome < 21 lacks the set function.
      polyfill = versionMatch && parseInt(versionMatch[2]) < 21;
    } else if (navigator.userAgent.indexOf('Android') >= 0) {
      // Android < 4.4 lacks the set function.
      // Android >= 4.4 will contain Chrome in the user agent,
      // thus pass the Chrome check above and not reach this block.
      polyfill = /Android\s[0-4][^\d]/g.test(navigator.userAgent);
    } else if (navigator.userAgent.indexOf('Safari') >= 0) {
      versionMatch = navigator.userAgent.
        match(/Version\/([0-9]+)\.([0-9]+)\.([0-9]+) Safari\//);
      // Safari < 6 lacks the set function.
      polyfill = versionMatch && parseInt(versionMatch[1]) < 6;
    }

    if (polyfill) {
      var contextPrototype = window.CanvasRenderingContext2D.prototype;
      contextPrototype._createImageData = contextPrototype.createImageData;
      contextPrototype.createImageData = function(w, h) {
        var imageData = this._createImageData(w, h);
        imageData.data.set = function(arr) {
          for (var i = 0, ii = this.length; i < ii; i++) {
            this[i] = arr[i];
          }
        };
        return imageData;
      };
    }
  }
})();

// Support: IE<10, Android<4.0, iOS
(function checkRequestAnimationFrame() {
  function fakeRequestAnimationFrame(callback) {
    window.setTimeout(callback, 20);
  }

  var isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

  if ('requestAnimationFrame' in window) {
    return;
  }
  window.requestAnimationFrame =
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    fakeRequestAnimationFrame;
})();

(function checkCanvasSizeLimitation() {
  var isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  var isAndroid = /Android/g.test(navigator.userAgent);
  if (isIOS || isAndroid) {
    // 5MP
    PDFJS.maxCanvasPixels = 5242880;
  }
})();

// Disable fullscreen support for certain problematic configurations.
// Support: IE11+ (when embedded).
(function checkFullscreenSupport() {
  var isEmbeddedIE = (navigator.userAgent.indexOf('Trident') >= 0 &&
                      window.parent !== window);
  if (isEmbeddedIE) {
    PDFJS.disableFullscreen = true;
  }
})();
!function(n,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define("underscore",r):(n="undefined"!=typeof globalThis?globalThis:n||self,function(){var t=n._,e=n._=r();e.noConflict=function(){return n._=t,e}}())}(this,(function(){
//     Underscore.js 1.13.2
//     https://underscorejs.org
//     (c) 2009-2021 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
var n="1.13.2",r="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global||Function("return this")()||{},t=Array.prototype,e=Object.prototype,u="undefined"!=typeof Symbol?Symbol.prototype:null,o=t.push,i=t.slice,a=e.toString,f=e.hasOwnProperty,c="undefined"!=typeof ArrayBuffer,l="undefined"!=typeof DataView,s=Array.isArray,p=Object.keys,v=Object.create,h=c&&ArrayBuffer.isView,y=isNaN,d=isFinite,g=!{toString:null}.propertyIsEnumerable("toString"),b=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"],m=Math.pow(2,53)-1;function j(n,r){return r=null==r?n.length-1:+r,function(){for(var t=Math.max(arguments.length-r,0),e=Array(t),u=0;u<t;u++)e[u]=arguments[u+r];switch(r){case 0:return n.call(this,e);case 1:return n.call(this,arguments[0],e);case 2:return n.call(this,arguments[0],arguments[1],e)}var o=Array(r+1);for(u=0;u<r;u++)o[u]=arguments[u];return o[r]=e,n.apply(this,o)}}function _(n){var r=typeof n;return"function"===r||"object"===r&&!!n}function w(n){return void 0===n}function A(n){return!0===n||!1===n||"[object Boolean]"===a.call(n)}function x(n){var r="[object "+n+"]";return function(n){return a.call(n)===r}}var S=x("String"),O=x("Number"),M=x("Date"),E=x("RegExp"),B=x("Error"),N=x("Symbol"),I=x("ArrayBuffer"),T=x("Function"),k=r.document&&r.document.childNodes;"function"!=typeof/./&&"object"!=typeof Int8Array&&"function"!=typeof k&&(T=function(n){return"function"==typeof n||!1});var D=T,R=x("Object"),F=l&&R(new DataView(new ArrayBuffer(8))),V="undefined"!=typeof Map&&R(new Map),P=x("DataView");var q=F?function(n){return null!=n&&D(n.getInt8)&&I(n.buffer)}:P,U=s||x("Array");function W(n,r){return null!=n&&f.call(n,r)}var z=x("Arguments");!function(){z(arguments)||(z=function(n){return W(n,"callee")})}();var L=z;function $(n){return O(n)&&y(n)}function C(n){return function(){return n}}function K(n){return function(r){var t=n(r);return"number"==typeof t&&t>=0&&t<=m}}function J(n){return function(r){return null==r?void 0:r[n]}}var G=J("byteLength"),H=K(G),Q=/\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;var X=c?function(n){return h?h(n)&&!q(n):H(n)&&Q.test(a.call(n))}:C(!1),Y=J("length");function Z(n,r){r=function(n){for(var r={},t=n.length,e=0;e<t;++e)r[n[e]]=!0;return{contains:function(n){return!0===r[n]},push:function(t){return r[t]=!0,n.push(t)}}}(r);var t=b.length,u=n.constructor,o=D(u)&&u.prototype||e,i="constructor";for(W(n,i)&&!r.contains(i)&&r.push(i);t--;)(i=b[t])in n&&n[i]!==o[i]&&!r.contains(i)&&r.push(i)}function nn(n){if(!_(n))return[];if(p)return p(n);var r=[];for(var t in n)W(n,t)&&r.push(t);return g&&Z(n,r),r}function rn(n,r){var t=nn(r),e=t.length;if(null==n)return!e;for(var u=Object(n),o=0;o<e;o++){var i=t[o];if(r[i]!==u[i]||!(i in u))return!1}return!0}function tn(n){return n instanceof tn?n:this instanceof tn?void(this._wrapped=n):new tn(n)}function en(n){return new Uint8Array(n.buffer||n,n.byteOffset||0,G(n))}tn.VERSION=n,tn.prototype.value=function(){return this._wrapped},tn.prototype.valueOf=tn.prototype.toJSON=tn.prototype.value,tn.prototype.toString=function(){return String(this._wrapped)};var un="[object DataView]";function on(n,r,t,e){if(n===r)return 0!==n||1/n==1/r;if(null==n||null==r)return!1;if(n!=n)return r!=r;var o=typeof n;return("function"===o||"object"===o||"object"==typeof r)&&function n(r,t,e,o){r instanceof tn&&(r=r._wrapped);t instanceof tn&&(t=t._wrapped);var i=a.call(r);if(i!==a.call(t))return!1;if(F&&"[object Object]"==i&&q(r)){if(!q(t))return!1;i=un}switch(i){case"[object RegExp]":case"[object String]":return""+r==""+t;case"[object Number]":return+r!=+r?+t!=+t:0==+r?1/+r==1/t:+r==+t;case"[object Date]":case"[object Boolean]":return+r==+t;case"[object Symbol]":return u.valueOf.call(r)===u.valueOf.call(t);case"[object ArrayBuffer]":case un:return n(en(r),en(t),e,o)}var f="[object Array]"===i;if(!f&&X(r)){if(G(r)!==G(t))return!1;if(r.buffer===t.buffer&&r.byteOffset===t.byteOffset)return!0;f=!0}if(!f){if("object"!=typeof r||"object"!=typeof t)return!1;var c=r.constructor,l=t.constructor;if(c!==l&&!(D(c)&&c instanceof c&&D(l)&&l instanceof l)&&"constructor"in r&&"constructor"in t)return!1}o=o||[];var s=(e=e||[]).length;for(;s--;)if(e[s]===r)return o[s]===t;if(e.push(r),o.push(t),f){if((s=r.length)!==t.length)return!1;for(;s--;)if(!on(r[s],t[s],e,o))return!1}else{var p,v=nn(r);if(s=v.length,nn(t).length!==s)return!1;for(;s--;)if(p=v[s],!W(t,p)||!on(r[p],t[p],e,o))return!1}return e.pop(),o.pop(),!0}(n,r,t,e)}function an(n){if(!_(n))return[];var r=[];for(var t in n)r.push(t);return g&&Z(n,r),r}function fn(n){var r=Y(n);return function(t){if(null==t)return!1;var e=an(t);if(Y(e))return!1;for(var u=0;u<r;u++)if(!D(t[n[u]]))return!1;return n!==hn||!D(t[cn])}}var cn="forEach",ln="has",sn=["clear","delete"],pn=["get",ln,"set"],vn=sn.concat(cn,pn),hn=sn.concat(pn),yn=["add"].concat(sn,cn,ln),dn=V?fn(vn):x("Map"),gn=V?fn(hn):x("WeakMap"),bn=V?fn(yn):x("Set"),mn=x("WeakSet");function jn(n){for(var r=nn(n),t=r.length,e=Array(t),u=0;u<t;u++)e[u]=n[r[u]];return e}function _n(n){for(var r={},t=nn(n),e=0,u=t.length;e<u;e++)r[n[t[e]]]=t[e];return r}function wn(n){var r=[];for(var t in n)D(n[t])&&r.push(t);return r.sort()}function An(n,r){return function(t){var e=arguments.length;if(r&&(t=Object(t)),e<2||null==t)return t;for(var u=1;u<e;u++)for(var o=arguments[u],i=n(o),a=i.length,f=0;f<a;f++){var c=i[f];r&&void 0!==t[c]||(t[c]=o[c])}return t}}var xn=An(an),Sn=An(nn),On=An(an,!0);function Mn(n){if(!_(n))return{};if(v)return v(n);var r=function(){};r.prototype=n;var t=new r;return r.prototype=null,t}function En(n){return U(n)?n:[n]}function Bn(n){return tn.toPath(n)}function Nn(n,r){for(var t=r.length,e=0;e<t;e++){if(null==n)return;n=n[r[e]]}return t?n:void 0}function In(n,r,t){var e=Nn(n,Bn(r));return w(e)?t:e}function Tn(n){return n}function kn(n){return n=Sn({},n),function(r){return rn(r,n)}}function Dn(n){return n=Bn(n),function(r){return Nn(r,n)}}function Rn(n,r,t){if(void 0===r)return n;switch(null==t?3:t){case 1:return function(t){return n.call(r,t)};case 3:return function(t,e,u){return n.call(r,t,e,u)};case 4:return function(t,e,u,o){return n.call(r,t,e,u,o)}}return function(){return n.apply(r,arguments)}}function Fn(n,r,t){return null==n?Tn:D(n)?Rn(n,r,t):_(n)&&!U(n)?kn(n):Dn(n)}function Vn(n,r){return Fn(n,r,1/0)}function Pn(n,r,t){return tn.iteratee!==Vn?tn.iteratee(n,r):Fn(n,r,t)}function qn(){}function Un(n,r){return null==r&&(r=n,n=0),n+Math.floor(Math.random()*(r-n+1))}tn.toPath=En,tn.iteratee=Vn;var Wn=Date.now||function(){return(new Date).getTime()};function zn(n){var r=function(r){return n[r]},t="(?:"+nn(n).join("|")+")",e=RegExp(t),u=RegExp(t,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,r):n}}var Ln={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},$n=zn(Ln),Cn=zn(_n(Ln)),Kn=tn.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g},Jn=/(.)^/,Gn={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},Hn=/\\|'|\r|\n|\u2028|\u2029/g;function Qn(n){return"\\"+Gn[n]}var Xn=/^\s*(\w|\$)+\s*$/;var Yn=0;function Zn(n,r,t,e,u){if(!(e instanceof r))return n.apply(t,u);var o=Mn(n.prototype),i=n.apply(o,u);return _(i)?i:o}var nr=j((function(n,r){var t=nr.placeholder,e=function(){for(var u=0,o=r.length,i=Array(o),a=0;a<o;a++)i[a]=r[a]===t?arguments[u++]:r[a];for(;u<arguments.length;)i.push(arguments[u++]);return Zn(n,e,this,this,i)};return e}));nr.placeholder=tn;var rr=j((function(n,r,t){if(!D(n))throw new TypeError("Bind must be called on a function");var e=j((function(u){return Zn(n,e,r,this,t.concat(u))}));return e})),tr=K(Y);function er(n,r,t,e){if(e=e||[],r||0===r){if(r<=0)return e.concat(n)}else r=1/0;for(var u=e.length,o=0,i=Y(n);o<i;o++){var a=n[o];if(tr(a)&&(U(a)||L(a)))if(r>1)er(a,r-1,t,e),u=e.length;else for(var f=0,c=a.length;f<c;)e[u++]=a[f++];else t||(e[u++]=a)}return e}var ur=j((function(n,r){var t=(r=er(r,!1,!1)).length;if(t<1)throw new Error("bindAll must be passed function names");for(;t--;){var e=r[t];n[e]=rr(n[e],n)}return n}));var or=j((function(n,r,t){return setTimeout((function(){return n.apply(null,t)}),r)})),ir=nr(or,tn,1);function ar(n){return function(){return!n.apply(this,arguments)}}function fr(n,r){var t;return function(){return--n>0&&(t=r.apply(this,arguments)),n<=1&&(r=null),t}}var cr=nr(fr,2);function lr(n,r,t){r=Pn(r,t);for(var e,u=nn(n),o=0,i=u.length;o<i;o++)if(r(n[e=u[o]],e,n))return e}function sr(n){return function(r,t,e){t=Pn(t,e);for(var u=Y(r),o=n>0?0:u-1;o>=0&&o<u;o+=n)if(t(r[o],o,r))return o;return-1}}var pr=sr(1),vr=sr(-1);function hr(n,r,t,e){for(var u=(t=Pn(t,e,1))(r),o=0,i=Y(n);o<i;){var a=Math.floor((o+i)/2);t(n[a])<u?o=a+1:i=a}return o}function yr(n,r,t){return function(e,u,o){var a=0,f=Y(e);if("number"==typeof o)n>0?a=o>=0?o:Math.max(o+f,a):f=o>=0?Math.min(o+1,f):o+f+1;else if(t&&o&&f)return e[o=t(e,u)]===u?o:-1;if(u!=u)return(o=r(i.call(e,a,f),$))>=0?o+a:-1;for(o=n>0?a:f-1;o>=0&&o<f;o+=n)if(e[o]===u)return o;return-1}}var dr=yr(1,pr,hr),gr=yr(-1,vr);function br(n,r,t){var e=(tr(n)?pr:lr)(n,r,t);if(void 0!==e&&-1!==e)return n[e]}function mr(n,r,t){var e,u;if(r=Rn(r,t),tr(n))for(e=0,u=n.length;e<u;e++)r(n[e],e,n);else{var o=nn(n);for(e=0,u=o.length;e<u;e++)r(n[o[e]],o[e],n)}return n}function jr(n,r,t){r=Pn(r,t);for(var e=!tr(n)&&nn(n),u=(e||n).length,o=Array(u),i=0;i<u;i++){var a=e?e[i]:i;o[i]=r(n[a],a,n)}return o}function _r(n){var r=function(r,t,e,u){var o=!tr(r)&&nn(r),i=(o||r).length,a=n>0?0:i-1;for(u||(e=r[o?o[a]:a],a+=n);a>=0&&a<i;a+=n){var f=o?o[a]:a;e=t(e,r[f],f,r)}return e};return function(n,t,e,u){var o=arguments.length>=3;return r(n,Rn(t,u,4),e,o)}}var wr=_r(1),Ar=_r(-1);function xr(n,r,t){var e=[];return r=Pn(r,t),mr(n,(function(n,t,u){r(n,t,u)&&e.push(n)})),e}function Sr(n,r,t){r=Pn(r,t);for(var e=!tr(n)&&nn(n),u=(e||n).length,o=0;o<u;o++){var i=e?e[o]:o;if(!r(n[i],i,n))return!1}return!0}function Or(n,r,t){r=Pn(r,t);for(var e=!tr(n)&&nn(n),u=(e||n).length,o=0;o<u;o++){var i=e?e[o]:o;if(r(n[i],i,n))return!0}return!1}function Mr(n,r,t,e){return tr(n)||(n=jn(n)),("number"!=typeof t||e)&&(t=0),dr(n,r,t)>=0}var Er=j((function(n,r,t){var e,u;return D(r)?u=r:(r=Bn(r),e=r.slice(0,-1),r=r[r.length-1]),jr(n,(function(n){var o=u;if(!o){if(e&&e.length&&(n=Nn(n,e)),null==n)return;o=n[r]}return null==o?o:o.apply(n,t)}))}));function Br(n,r){return jr(n,Dn(r))}function Nr(n,r,t){var e,u,o=-1/0,i=-1/0;if(null==r||"number"==typeof r&&"object"!=typeof n[0]&&null!=n)for(var a=0,f=(n=tr(n)?n:jn(n)).length;a<f;a++)null!=(e=n[a])&&e>o&&(o=e);else r=Pn(r,t),mr(n,(function(n,t,e){((u=r(n,t,e))>i||u===-1/0&&o===-1/0)&&(o=n,i=u)}));return o}var Ir=/[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;function Tr(n){return n?U(n)?i.call(n):S(n)?n.match(Ir):tr(n)?jr(n,Tn):jn(n):[]}function kr(n,r,t){if(null==r||t)return tr(n)||(n=jn(n)),n[Un(n.length-1)];var e=Tr(n),u=Y(e);r=Math.max(Math.min(r,u),0);for(var o=u-1,i=0;i<r;i++){var a=Un(i,o),f=e[i];e[i]=e[a],e[a]=f}return e.slice(0,r)}function Dr(n,r){return function(t,e,u){var o=r?[[],[]]:{};return e=Pn(e,u),mr(t,(function(r,u){var i=e(r,u,t);n(o,r,i)})),o}}var Rr=Dr((function(n,r,t){W(n,t)?n[t].push(r):n[t]=[r]})),Fr=Dr((function(n,r,t){n[t]=r})),Vr=Dr((function(n,r,t){W(n,t)?n[t]++:n[t]=1})),Pr=Dr((function(n,r,t){n[t?0:1].push(r)}),!0);function qr(n,r,t){return r in t}var Ur=j((function(n,r){var t={},e=r[0];if(null==n)return t;D(e)?(r.length>1&&(e=Rn(e,r[1])),r=an(n)):(e=qr,r=er(r,!1,!1),n=Object(n));for(var u=0,o=r.length;u<o;u++){var i=r[u],a=n[i];e(a,i,n)&&(t[i]=a)}return t})),Wr=j((function(n,r){var t,e=r[0];return D(e)?(e=ar(e),r.length>1&&(t=r[1])):(r=jr(er(r,!1,!1),String),e=function(n,t){return!Mr(r,t)}),Ur(n,e,t)}));function zr(n,r,t){return i.call(n,0,Math.max(0,n.length-(null==r||t?1:r)))}function Lr(n,r,t){return null==n||n.length<1?null==r||t?void 0:[]:null==r||t?n[0]:zr(n,n.length-r)}function $r(n,r,t){return i.call(n,null==r||t?1:r)}var Cr=j((function(n,r){return r=er(r,!0,!0),xr(n,(function(n){return!Mr(r,n)}))})),Kr=j((function(n,r){return Cr(n,r)}));function Jr(n,r,t,e){A(r)||(e=t,t=r,r=!1),null!=t&&(t=Pn(t,e));for(var u=[],o=[],i=0,a=Y(n);i<a;i++){var f=n[i],c=t?t(f,i,n):f;r&&!t?(i&&o===c||u.push(f),o=c):t?Mr(o,c)||(o.push(c),u.push(f)):Mr(u,f)||u.push(f)}return u}var Gr=j((function(n){return Jr(er(n,!0,!0))}));function Hr(n){for(var r=n&&Nr(n,Y).length||0,t=Array(r),e=0;e<r;e++)t[e]=Br(n,e);return t}var Qr=j(Hr);function Xr(n,r){return n._chain?tn(r).chain():r}function Yr(n){return mr(wn(n),(function(r){var t=tn[r]=n[r];tn.prototype[r]=function(){var n=[this._wrapped];return o.apply(n,arguments),Xr(this,t.apply(tn,n))}})),tn}mr(["pop","push","reverse","shift","sort","splice","unshift"],(function(n){var r=t[n];tn.prototype[n]=function(){var t=this._wrapped;return null!=t&&(r.apply(t,arguments),"shift"!==n&&"splice"!==n||0!==t.length||delete t[0]),Xr(this,t)}})),mr(["concat","join","slice"],(function(n){var r=t[n];tn.prototype[n]=function(){var n=this._wrapped;return null!=n&&(n=r.apply(n,arguments)),Xr(this,n)}}));var Zr=Yr({__proto__:null,VERSION:n,restArguments:j,isObject:_,isNull:function(n){return null===n},isUndefined:w,isBoolean:A,isElement:function(n){return!(!n||1!==n.nodeType)},isString:S,isNumber:O,isDate:M,isRegExp:E,isError:B,isSymbol:N,isArrayBuffer:I,isDataView:q,isArray:U,isFunction:D,isArguments:L,isFinite:function(n){return!N(n)&&d(n)&&!isNaN(parseFloat(n))},isNaN:$,isTypedArray:X,isEmpty:function(n){if(null==n)return!0;var r=Y(n);return"number"==typeof r&&(U(n)||S(n)||L(n))?0===r:0===Y(nn(n))},isMatch:rn,isEqual:function(n,r){return on(n,r)},isMap:dn,isWeakMap:gn,isSet:bn,isWeakSet:mn,keys:nn,allKeys:an,values:jn,pairs:function(n){for(var r=nn(n),t=r.length,e=Array(t),u=0;u<t;u++)e[u]=[r[u],n[r[u]]];return e},invert:_n,functions:wn,methods:wn,extend:xn,extendOwn:Sn,assign:Sn,defaults:On,create:function(n,r){var t=Mn(n);return r&&Sn(t,r),t},clone:function(n){return _(n)?U(n)?n.slice():xn({},n):n},tap:function(n,r){return r(n),n},get:In,has:function(n,r){for(var t=(r=Bn(r)).length,e=0;e<t;e++){var u=r[e];if(!W(n,u))return!1;n=n[u]}return!!t},mapObject:function(n,r,t){r=Pn(r,t);for(var e=nn(n),u=e.length,o={},i=0;i<u;i++){var a=e[i];o[a]=r(n[a],a,n)}return o},identity:Tn,constant:C,noop:qn,toPath:En,property:Dn,propertyOf:function(n){return null==n?qn:function(r){return In(n,r)}},matcher:kn,matches:kn,times:function(n,r,t){var e=Array(Math.max(0,n));r=Rn(r,t,1);for(var u=0;u<n;u++)e[u]=r(u);return e},random:Un,now:Wn,escape:$n,unescape:Cn,templateSettings:Kn,template:function(n,r,t){!r&&t&&(r=t),r=On({},r,tn.templateSettings);var e=RegExp([(r.escape||Jn).source,(r.interpolate||Jn).source,(r.evaluate||Jn).source].join("|")+"|$","g"),u=0,o="__p+='";n.replace(e,(function(r,t,e,i,a){return o+=n.slice(u,a).replace(Hn,Qn),u=a+r.length,t?o+="'+\n((__t=("+t+"))==null?'':_.escape(__t))+\n'":e?o+="'+\n((__t=("+e+"))==null?'':__t)+\n'":i&&(o+="';\n"+i+"\n__p+='"),r})),o+="';\n";var i,a=r.variable;if(a){if(!Xn.test(a))throw new Error("variable is not a bare identifier: "+a)}else o="with(obj||{}){\n"+o+"}\n",a="obj";o="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+o+"return __p;\n";try{i=new Function(a,"_",o)}catch(n){throw n.source=o,n}var f=function(n){return i.call(this,n,tn)};return f.source="function("+a+"){\n"+o+"}",f},result:function(n,r,t){var e=(r=Bn(r)).length;if(!e)return D(t)?t.call(n):t;for(var u=0;u<e;u++){var o=null==n?void 0:n[r[u]];void 0===o&&(o=t,u=e),n=D(o)?o.call(n):o}return n},uniqueId:function(n){var r=++Yn+"";return n?n+r:r},chain:function(n){var r=tn(n);return r._chain=!0,r},iteratee:Vn,partial:nr,bind:rr,bindAll:ur,memoize:function(n,r){var t=function(e){var u=t.cache,o=""+(r?r.apply(this,arguments):e);return W(u,o)||(u[o]=n.apply(this,arguments)),u[o]};return t.cache={},t},delay:or,defer:ir,throttle:function(n,r,t){var e,u,o,i,a=0;t||(t={});var f=function(){a=!1===t.leading?0:Wn(),e=null,i=n.apply(u,o),e||(u=o=null)},c=function(){var c=Wn();a||!1!==t.leading||(a=c);var l=r-(c-a);return u=this,o=arguments,l<=0||l>r?(e&&(clearTimeout(e),e=null),a=c,i=n.apply(u,o),e||(u=o=null)):e||!1===t.trailing||(e=setTimeout(f,l)),i};return c.cancel=function(){clearTimeout(e),a=0,e=u=o=null},c},debounce:function(n,r,t){var e,u,o,i,a,f=function(){var c=Wn()-u;r>c?e=setTimeout(f,r-c):(e=null,t||(i=n.apply(a,o)),e||(o=a=null))},c=j((function(c){return a=this,o=c,u=Wn(),e||(e=setTimeout(f,r),t&&(i=n.apply(a,o))),i}));return c.cancel=function(){clearTimeout(e),e=o=a=null},c},wrap:function(n,r){return nr(r,n)},negate:ar,compose:function(){var n=arguments,r=n.length-1;return function(){for(var t=r,e=n[r].apply(this,arguments);t--;)e=n[t].call(this,e);return e}},after:function(n,r){return function(){if(--n<1)return r.apply(this,arguments)}},before:fr,once:cr,findKey:lr,findIndex:pr,findLastIndex:vr,sortedIndex:hr,indexOf:dr,lastIndexOf:gr,find:br,detect:br,findWhere:function(n,r){return br(n,kn(r))},each:mr,forEach:mr,map:jr,collect:jr,reduce:wr,foldl:wr,inject:wr,reduceRight:Ar,foldr:Ar,filter:xr,select:xr,reject:function(n,r,t){return xr(n,ar(Pn(r)),t)},every:Sr,all:Sr,some:Or,any:Or,contains:Mr,includes:Mr,include:Mr,invoke:Er,pluck:Br,where:function(n,r){return xr(n,kn(r))},max:Nr,min:function(n,r,t){var e,u,o=1/0,i=1/0;if(null==r||"number"==typeof r&&"object"!=typeof n[0]&&null!=n)for(var a=0,f=(n=tr(n)?n:jn(n)).length;a<f;a++)null!=(e=n[a])&&e<o&&(o=e);else r=Pn(r,t),mr(n,(function(n,t,e){((u=r(n,t,e))<i||u===1/0&&o===1/0)&&(o=n,i=u)}));return o},shuffle:function(n){return kr(n,1/0)},sample:kr,sortBy:function(n,r,t){var e=0;return r=Pn(r,t),Br(jr(n,(function(n,t,u){return{value:n,index:e++,criteria:r(n,t,u)}})).sort((function(n,r){var t=n.criteria,e=r.criteria;if(t!==e){if(t>e||void 0===t)return 1;if(t<e||void 0===e)return-1}return n.index-r.index})),"value")},groupBy:Rr,indexBy:Fr,countBy:Vr,partition:Pr,toArray:Tr,size:function(n){return null==n?0:tr(n)?n.length:nn(n).length},pick:Ur,omit:Wr,first:Lr,head:Lr,take:Lr,initial:zr,last:function(n,r,t){return null==n||n.length<1?null==r||t?void 0:[]:null==r||t?n[n.length-1]:$r(n,Math.max(0,n.length-r))},rest:$r,tail:$r,drop:$r,compact:function(n){return xr(n,Boolean)},flatten:function(n,r){return er(n,r,!1)},without:Kr,uniq:Jr,unique:Jr,union:Gr,intersection:function(n){for(var r=[],t=arguments.length,e=0,u=Y(n);e<u;e++){var o=n[e];if(!Mr(r,o)){var i;for(i=1;i<t&&Mr(arguments[i],o);i++);i===t&&r.push(o)}}return r},difference:Cr,unzip:Hr,transpose:Hr,zip:Qr,object:function(n,r){for(var t={},e=0,u=Y(n);e<u;e++)r?t[n[e]]=r[e]:t[n[e][0]]=n[e][1];return t},range:function(n,r,t){null==r&&(r=n||0,n=0),t||(t=r<n?-1:1);for(var e=Math.max(Math.ceil((r-n)/t),0),u=Array(e),o=0;o<e;o++,n+=t)u[o]=n;return u},chunk:function(n,r){if(null==r||r<1)return[];for(var t=[],e=0,u=n.length;e<u;)t.push(i.call(n,e,e+=r));return t},mixin:Yr,default:tn});return Zr._=Zr,Zr}));
(function(){if(typeof exports!=="undefined"){var underscore=require("underscore");underscore.extend(exports,declare(underscore))}else if(typeof define!=="undefined")define(["underscore"],declare);else window.ring=declare(_);function declare(_){var ring={};function RingObject(){}ring.Object=RingObject;_.extend(ring.Object,{__mro__:[ring.Object],__properties__:{__ringConstructor__:function(){}},__classId__:1,__parents__:[],__classIndex__:{1:ring.Object}});_.extend(ring.Object.prototype,{__ringConstructor__:ring.Object.__properties__.__ringConstructor__});
var objectCreate=function(o){function CreatedObject(){}CreatedObject.prototype=o;var tmp=new CreatedObject;tmp.__proto__=o;return tmp};ring.__objectCreate=objectCreate;var classCounter=3;var fnTest=/xyz/.test(function(){xyz()})?/\$super\b/:/.*/;ring.create=function(){var args=_.toArray(arguments);args.reverse();var props=args[0];var parents=args.length>=2?args[1]:[];if(!(parents instanceof Array))parents=[parents];_.each(parents,function(el){toRingClass(el)});if(parents.length===0)parents=[ring.Object];
var cons=props.constructor!==Object?props.constructor:undefined;props=_.clone(props);delete props.constructor;if(cons)props.__ringConstructor__=cons;else{cons=props.init;delete props.init;if(cons)props.__ringConstructor__=cons}var claz=function Instance(){this.$super=null;this.__ringConstructor__.apply(this,arguments)};claz.__properties__=props;var toMerge=_.pluck(parents,"__mro__");toMerge=toMerge.concat([parents]);var __mro__=[claz].concat(mergeMro(toMerge));var prototype=Object.prototype;_.each(_.clone(__mro__).reverse(),
function(claz){var current=objectCreate(prototype);_.extend(current,claz.__properties__);_.each(_.keys(current),function(key){var p=current[key];if(typeof p!=="function"||!fnTest.test(p)||key!=="__ringConstructor__"&&claz.__ringConvertedObject__)return;current[key]=function(name,fct,supProto){return function(){var tmp=this.$super;this.$super=supProto[name];try{return fct.apply(this,arguments)}finally{this.$super=tmp}}}(key,p,prototype)});current.constructor=claz;prototype=current});var id=classCounter++;
claz.__mro__=__mro__;claz.__parents__=parents;claz.prototype=prototype;claz.__classId__=id;claz.__classIndex__={};_.each(claz.__mro__,function(c){claz.__classIndex__[c.__classId__]=c});if(claz.prototype.classInit){claz.__classInit__=claz.prototype.classInit;delete claz.prototype.classInit}_.each(_.chain(claz.__mro__).clone().reverse().value(),function(c){if(c.__classInit__){var ret=c.__classInit__(claz.prototype);if(ret!==undefined)claz.prototype=ret}});return claz};var mergeMro=function(toMerge){var __mro__=
[];var current=_.clone(toMerge);while(true){var found=false;for(var i=0;i<current.length;i++){if(current[i].length===0)continue;var currentClass=current[i][0];var isInTail=_.find(current,function(lst){return _.contains(_.rest(lst),currentClass)});if(!isInTail){found=true;__mro__.push(currentClass);current=_.map(current,function(lst){if(_.head(lst)===currentClass)return _.rest(lst);else return lst});break}}if(found)continue;if(_.all(current,function(i){return i.length===0}))return __mro__;throw new ring.ValueError("Cannot create a consistent method resolution order (MRO)");
}};var toRingClass=function(claz){if(claz.__classId__)return;var proto=!Object.getOwnPropertyNames?claz.prototype:function(){var keys={};(function crawl(p){if(p===Object.prototype)return;_.extend(keys,_.chain(Object.getOwnPropertyNames(p)).map(function(el){return[el,true]}).object().value());crawl(Object.getPrototypeOf(p))})(claz.prototype);return _.object(_.map(_.keys(keys),function(k){return[k,claz.prototype[k]]}))}();proto=_.chain(proto).map(function(v,k){return[k,v]}).filter(function(el){return el[0]!==
"constructor"&&el[0]!=="__proto__"}).object().value();var id=classCounter++;_.extend(claz,{__mro__:[claz,ring.Object],__properties__:_.extend({},proto,{__ringConstructor__:function(){this.$super.apply(this,arguments);var tmp=this.$super;this.$super=null;try{claz.apply(this,arguments)}finally{this.$super=tmp}}}),__classId__:id,__parents__:[ring.Object],__classIndex__:{1:ring.Object},__ringConvertedObject__:true});claz.__classIndex__[id]=claz};ring.instance=function(obj,type){if(typeof obj==="object"&&
obj.constructor&&obj.constructor.__classIndex__&&typeof type==="function"&&typeof type.__classId__==="number")return obj.constructor.__classIndex__[type.__classId__]!==undefined;if(typeof type==="string")return typeof obj===type;return obj instanceof type};ring.Error=ring.create({name:"ring.Error",defaultMessage:"",constructor:function(message){this.message=message||this.defaultMessage},classInit:function(prototype){var protos=[];var gather=function(proto){if(!proto)return;protos.push(proto);gather(proto.__proto__)};
gather(prototype);var current=new Error;_.each(_.clone(protos).reverse(),function(proto){var tmp=objectCreate(current);_.each(proto,function(v,k){if(k!=="__proto__")tmp[k]=v});current=tmp});return current}});ring.ValueError=ring.create([ring.Error],{name:"ring.ValueError"});ring.getSuper=function(currentClass,obj,attributeName){var pos;var __mro__=obj.constructor.__mro__;for(var i=0;i<__mro__.length;i++)if(__mro__[i]===currentClass){pos=i;break}if(pos===undefined)throw new ring.ValueError("Class not found in instance's method resolution order.");
var find=function(proto,counter){if(counter===0)return proto;return find(proto.__proto__,counter-1)};var proto=find(obj.constructor.prototype,pos+1);var att;if(attributeName!=="constructor"&&attributeName!=="init")att=proto[attributeName];else att=proto.__ringConstructor__;if(ring.instance(att,"function"))return _.bind(att,obj);else return att};return ring}})();
