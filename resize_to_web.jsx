/**激活Photoshop，设置为活动窗口*/
app.bringToFront();

/**定义文档分辨率*/
var PRESOLUTION=72;
var startRulerUnits=app.preferences.rulerUnits;
var startTypeUnits=app.preferences.typeUnits;
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;

/**系统默认设置*/
var saveFileType="JPEG";
var exportOptions=new ExportOptionsSaveForWeb();
exportOptions.format=SaveDocumentType.JPEG;
exportOptions.quality=60;
var saveFileSubFix='jpg';
var filePrefix="",
	fileSubfix="";
	
/**是否允许处理程序执行*/
var processAllow=false;

/**定义对话框*/
var dialogue="dialog{\
    text:'Photoshop批处理V0.1',\
	group:Group{\
		orientation:'column',\
		alignChildren:'left',\
	    process:StaticText{text:'处理进度：',bounds:[0,0,300,14]},\
		timeline:Progressbar{bounds:[0,0,300,10],minvalue:0,maxvalue:100}\
		corrdination:Panel{\
			orientation:'row',\
            text:'输出尺寸',\
            x:Group{\
				orientation: 'row', \
                s: StaticText { text:'宽:' }, \
                e: EditText { preferredSize: [50, 20], text:200} ,\
                p: StaticText { text:'px' }, \
            }, \
            y: Group {\
				orientation: 'row', \
                s: StaticText { text:'高:' }, \
                e: EditText { preferredSize: [50, 20]}, \
                p: StaticText { text:'px' }, \
            } ,\
        }, \
		outputSet:Group{\
			orientation: 'row', \
			fileFrom:Checkbox {text:'从目录读取',value:true,helpTip:'从目录读取文件，否则处理已经打开的文件'},\
			cut:Checkbox {text:'裁剪图片',value:false,helpTip:'从图片裁剪一部分作为新图片'},\
		},\
		cutPos:Panel{\
			orientation:'column',\
            text:'裁剪参数设置',\
			startPos:Group{\
				orientation: 'row', \
                s: StaticText { text:'起始位置:' }, \
                x: EditText { preferredSize: [60, 20], text:0} ,\
				p1: StaticText { text:'px' }, \
				y: EditText { preferredSize: [60, 20], text:0} ,\
                p2: StaticText { text:'px' }, \
            }, \
            endPos: Group {\
				orientation: 'row', \
                s: StaticText { text:'结束位置:' }, \
                x: EditText { preferredSize: [60, 20]}, \
				p1: StaticText { text:'px'}, \
				y: EditText { preferredSize: [60, 20]}, \
                p2: StaticText { text:'px '}, \
            } ,\
		},\
		fileResource:Group{\
			orientation: 'row', \
			buttonSelect: Button{text:'待处理文件', properties:{name:'open'} ,helpTip:'请选择待处理文件'},\
			inputText: EditText{ text:'F:/Dropbox/Photos/Sample Album/', preferredSize: [180, 20] },\
		},\
	},\
	saveFileType:Group{\
		orientation:'row', \
		s:StaticText{text:' 存储类型:'},\
		typeList:Group{\
			jpeg:RadioButton {text:'JPEG',value:true},\
			gif:RadioButton {text:'GIF'},\
			png8:RadioButton {text:'PNG-8'},\
			png24:RadioButton {text:'PNG-24'},\
		}\
	}, \
	saveAsOptions:Panel{\
		orientation: 'column',\
		alignChildren:'left',\
        text: '另存为设置', \
		Quality:Group{\
			orientation: 'row',  \
			q: StaticText { text:'压缩质量:' }, \
			e: EditText {text:'60',preferredSize: [50,20],helpTip:'范围0-100，值越大图像越好'} ,\
			color: StaticText { text:'颜色:' }, \
			select: DropDownList { alignment:'left', itemSize: [26,14] },\
			opacity:Checkbox {text:'透明',value:true,helpTip:'包含基于颜色不透明度的透明性'},\
		}, \
		filePrefix:Group{\
			orientation: 'row',  \
			s: StaticText { text:'在文件名前添加字符:' }, \
			e: EditText { preferredSize: [50,20]} ,\
			s2: StaticText { text:'勿含非法字符' , enabled:flase }, \
		}, \
		fileSubfix: Group {\
			orientation: 'row',  \
			s: StaticText { text:'在文件名后添加字符:' }, \
			e: EditText { preferredSize: [50, 20] }, \
			s2: StaticText { text:'勿含非法字符' , enabled:flase}, \
		} ,\
		finishProcess:Group{\
			orientation: 'row',  \
			q: StaticText { text:'处理完成后:' }, \
			c:Checkbox {text:'关闭文件',value:true},\
			c2:Checkbox {text:'显示处理时间',value:true},\
		}, \
		saveAsFolder:Group{\
			orientation: 'row', \
			buttonSelect: Button {text:'另存至', properties:{name:'save'} ,helpTip:'请选择文件要保持的目录'},\
			inputText: EditText  { text:'~/Desktop/resize/', preferredSize: [180, 20] },\
		},\
	},\
	tips:Panel{\
	    orientation:'row',\
		alignment:'left',\
        text: '提醒', \
	    s:StaticText{text:'默认保存方式为直接覆盖，请注意做好备份。'},\
	},\
	buttons:Group{\
		orientation:'row',\
		alignment:'right',\
        about:StaticText {text:'[关于程序]'},\
		Btnok: Button { text:'确定', properties:{name:'ok'} }, \
        Btncancel: Button { text:'取消', properties:{name:'cancel'} } \
    }, \
}";

/**初始化窗口对象*/
var win=new Window(dialogue);

/**目录选择框状态*/
win.group.fileResource.enabled=win.group.outputSet.fileFrom.value;
win.group.outputSet.fileFrom.onClick=function(){
	win.group.fileResource.enabled=win.group.outputSet.fileFrom.value;
};

/**待处理的文件目录选择*/
win.group.fileResource.buttonSelect.onClick= function(){
	var resourceFormInput=win.group.fileResource;
	var defaultFolder=resourceFormInput.inputText.text;
	var testFolder=new Folder(defaultFolder);
	if(!testFolder.exists){
		defaultFolder="~";
	}
	var selectFolder=Folder.selectDialog("选择待处理文件目录", defaultFolder);
	if(selectFolder!=null){
	    resourceFormInput.inputText.text=selectFolder.fsName;
		resourceFormInput.inputText.helpTip=selectFolder.fsName.toString();
	}
}

/**另存为目录选择*/
win.saveAsOptions.saveAsFolder.buttonSelect.onClick=function(){
    var saveFolder=win.saveAsOptions.saveAsFolder;
    var defaultFolder=saveFolder.inputText.text;
	var testFolder=new Folder(defaultFolder);
	if(!testFolder.exists){
		defaultFolder="~";
	}
	var selectFolder=Folder.selectDialog("选择存储文件夹",defaultFolder);
	if(selectFolder!= null ){
	    saveFolder.inputText.text=selectFolder.fsName;
		saveFolder.inputText.helpTip=selectFolder.fsName.toString();
	}
}

/**裁剪位置参数设置*/
win.group.cutPos.enabled=win.group.outputSet.cut.value;
win.group.outputSet.cut.onClick=function(){
	win.group.cutPos.enabled=win.group.outputSet.cut.value;
}


/**颜色下拉列表设置*/
var colorList=[256,128,64,32,16,8,4,2];
var colorRangeSelect=256;
for(var i=0,len=colorList.length;i<len;i++){
    win.saveAsOptions.Quality.select.add("item",colorList[i]);
}
win.saveAsOptions.Quality.select.items[0].selected=true;

win.saveAsOptions.Quality.select.onChange=function(){
	colorRangeSelect=win.saveAsOptions.Quality.select.items[win.saveAsOptions.Quality.select.selection.index].text;
	exportOptions.colors=parseInt(colorRangeSelect,10);
}

/**对象不可用*/
win.saveAsOptions.Quality.color.enabled=false;
win.saveAsOptions.Quality.select.enabled=false;
win.saveAsOptions.Quality.opacity.enabled=false;

/**选择存储格式*/
var saveFileTypeList=win.saveFileType.typeList;
/**绑定文件类型选择*/
saveFileTypeList["jpeg"].onClick=function(){selectFileType(this);}
saveFileTypeList["gif"].onClick=function(){selectFileType(this);}
saveFileTypeList["png8"].onClick=function(){selectFileType(this);}
saveFileTypeList["png24"].onClick=function(){selectFileType(this);}

/**调整颜色设置表单状态*/
function toggleQuality(Options){
    //开启颜色选项
	win.saveAsOptions.Quality.color.enabled=Options.enableColor;
    win.saveAsOptions.Quality.select.enabled=Options.enableColor;
    win.saveAsOptions.Quality.opacity.enabled=Options.enableOpacity;
	//关闭压缩质量
	win.saveAsOptions.Quality.q.enabled=Options.enablePack;
    win.saveAsOptions.Quality.e.enabled=Options.enablePack;
}

/**选择文件类型*/
function selectFileType(target){
    saveFileType=target.text;
	exportOptions=new ExportOptionsSaveForWeb();
    switch(saveFileType){
	    case 'JPEG':
		    toggleQuality({enableColor:false,enablePack:true,enableOpacity:false});
			exportOptions.format=SaveDocumentType.JPEG;
            exportOptions.quality=win.saveAsOptions.Quality.e.text;
			saveFileSubFix='jpg';
		break;
		case 'GIF':
		    toggleQuality({enableColor:true,enablePack:false,enableOpacity:true});
			exportOptions.format=SaveDocumentType.COMPUSERVEGIF;
            exportOptions.colors=colorRangeSelect;
            exportOptions.transparency=win.saveAsOptions.Quality.opacity.value;
			saveFileSubFix='gif';
		break;
		case 'PNG-8':
		    toggleQuality({enableColor:true,enablePack:false,enableOpacity:true});
			exportOptions.format=SaveDocumentType.PNG;
            exportOptions.colors=colorRangeSelect;
			exportOptions.transparency=win.saveAsOptions.Quality.opacity.value;
            exportOptions.PNG8=true;
			saveFileSubFix='png';
		break;
		case 'PNG-24':
		    toggleQuality({enableColor:false,enablePack:false,enableOpacity:true});
			exportOptions.format=SaveDocumentType.PNG;
			exportOptions.transparency=win.saveAsOptions.Quality.opacity.value;
            exportOptions.PNG8=false;
			saveFileSubFix='png';
		break;
	}
}

/**裁剪图片文件*/
function cutFile(startX,startY,endX,endY,fileName){
    //添加一个选区
    app.activeDocument.selection.select([[startX,startY],[endX,startY],[endX,endY],[startX,endY],[startX,startY]]);
	
	//剪切选区
    app.activeDocument.selection.cut();
	
	//创建一个新文档
    var newDoc=app.documents.add(endX-startX,endY-startY,72,fileName,NewDocumentMode.RGB,DocumentFill.TRANSPARENT);
	
	//粘帖当前粘帖板内容
    app.activeDocument.paste();
	
	//去除文件默认后缀名
	fileName=fileName.replace(/\.\w+/,'');
	
	//导出web所用格式
    newDoc.exportDocument(File(win.saveAsOptions.saveAsFolder.inputText.text+'/'+filePrefix+fileName+fileSubfix+'.'+saveFileSubFix),ExportType.SAVEFORWEB,exportOptions);
	
	//关闭文件，不保存
	newDoc.close(SaveOptions.DONOTSAVECHANGES);
	
	//关闭文件，不保存
	if(win.saveAsOptions.finishProcess.c.value){
		app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	}
}

/**缩放图片函数*/
function resizeFile(width,height,fileName){
	//重置文件尺寸
	app.activeDocument.resizeImage(width,height,PRESOLUTION,ResampleMethod.BICUBIC);
	
	//去除文件默认后缀名
	fileName=fileName.replace(/\.\w+/,'');
	
	//构造文件名(存储目录/前置字符+文件名+后置字符+'.'+后缀名)
	fileName=win.saveAsOptions.saveAsFolder.inputText.text+'/'+filePrefix+fileName+fileSubfix+'.'+saveFileSubFix;
	
	//导出web所用格式
    app.activeDocument.exportDocument(File(fileName), ExportType.SAVEFORWEB, exportOptions);
	
	//关闭文件，不保存
	if(win.saveAsOptions.finishProcess.c.value){
		app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
	}
}

/**文件处理函数*/
function fileProcessor(){
	var files=[];
	if(!win.group.outputSet.fileFrom.value){
		//判断当前是否有文件已经打开
		if(app.documents.length>1){
			var dynamicFiles=app.documents;
		}else{
			alert("请打开需要处理的文件！");
			return false;
		}
	}else{
		//判断当前是否有文件已经打开
		if(app.documents.length>1){
			alert("请先关闭不需要处理的其它文件！");
			return false;
		}
		
		//获取文件夹下所有文件
		files=new Folder(win.group.fileResource.inputText.text).getFiles();
	}    
	
	//获取文件数量
	var total=files.length;
	/**
	*files是指向app.documents的动态集合
	*files是动态变化的，为了能够正确取值，需要先把files缓存起来
	*/
	if(!win.group.outputSet.fileFrom.value){
		total=dynamicFiles.length;
		for(var k=0;k<total;k++){
			files[k]=dynamicFiles[k];
		}
	}
	
	//获得设置的尺寸值
    var resizeWidth=parseInt(win.group.corrdination.x.e.text,10),
		resizeHeight=parseInt(win.group.corrdination.y.e.text,10);		
	
	//文件处理起始时间
	var startTime=new Date().getTime(),
		processPercent=Math.round(1/total*100);
	
	win.group.timeline.value=processPercent;
	
	//队列处理文件
	(function run(fileIndex){
		if(win.group.outputSet.fileFrom.value){
			//获得当前文件
			var currentFile=files[fileIndex-1];
		
			//检查文件，并排除隐藏文件
			if(currentFile instanceof File && currentFile.hidden==false){
				app.open(currentFile);
			}else{
				//进入下一个队列
				if(fileIndex<total&&processAllow){
					run(fileIndex+1);
				}
				return false;
			}
		}else{
			//切换当前文件
			// alert(files.length+','+total);
			app.activeDocument=files[fileIndex-1];
			// alert(fileIndex+'/'+app.activeDocument.name);
		}
		
		//合并所有图层
		app.activeDocument.flatten();
		
		//获取文件本身尺寸
		var fileWidth=app.activeDocument.width,
			fileHeight=app.activeDocument.height;	
		
		//进度条，进度条更新会慢一步，所以值必须提前
		processPercent=Math.round((fileIndex+1)/total*100);
		win.group.timeline.value=processPercent<100?processPercent:100;	
		
		//进度条文字状态
	    win.group.process.text='处理进度'+Math.round(fileIndex/total*100)+'%，';
		win.group.process.text+='['+fileIndex+'/'+total+'] ';
		win.group.process.text+='文件：'+filePrefix+app.activeDocument.name.replace(/\.\w+/,'')+fileSubfix+'.'+saveFileSubFix;		
		
		//调整尺寸
		if(!resizeWidth||resizeWidth<1){
			resizeWidth=Math.round(fileWidth/fileHeight*resizeHeight);
		}
		if(!resizeHeight||resizeHeight<1){
			resizeHeight=Math.round(fileHeight/fileWidth*resizeWidth);
		}
		
		if(win.group.outputSet.cut.value){
			var startX=parseInt(win.group.cutPos.startPos.x.text,10)||0,
				startY=parseInt(win.group.cutPos.startPos.y.text,10)||0,
				endX=parseInt(win.group.cutPos.endPos.x.text,10)||0,
				endY=parseInt(win.group.cutPos.endPos.y.text,10)||0;
			if(!endX||endX<startX){
				endX=startX+resizeWidth;
			}
			if(!endY||endY<startY){
				endY=startY+resizeHeight;
			}			
			//处理裁剪
			cutFile(startX, startY, endX, endY, app.activeDocument.name);
		}else{
			//处理缩放
			resizeFile(resizeWidth, resizeHeight, app.activeDocument.name);
		}
		
		//处理结束条件
		if(fileIndex<total&&processAllow){	
			run(fileIndex+1);			
		}else{			
			//关闭文件
			if(win.saveAsOptions.finishProcess.c.value&&app.documents.length>1){
			    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
			}
			
			//显示处理时间
			if(win.saveAsOptions.finishProcess.c2.value){
				alert('文件处理完毕！用时：'+Math.round((new Date().getTime()-startTime)/1000)+'秒');
			}

			win.close();
		}
	})(1);
}

//判断设定
function checkSetting(){
	var w=parseInt(win.group.corrdination.x.e.text,10),
		h=parseInt(win.group.corrdination.y.e.text,10);
		
	if(!w&&!h){
		alert("请设置宽度或高度！");
		return false;
	}	
	if(!win.group.fileResource.inputText.text){
		alert("请选择待处理文件");
		return false;
	}
	if(!File(win.group.fileResource.inputText.text).exists){
		alert("文件不存在！");
		return false;
	}
	
	if(!win.saveAsOptions.saveAsFolder.inputText.text){
		alert("请选择存储目录");
		return false;
	}
	if(!Folder(win.saveAsOptions.saveAsFolder.inputText.text).exists){
		alert("目录不存在！");
		return false;
	}
	
	if(saveFileType=="JPEG"){
	    if(!win.saveAsOptions.Quality.e.text){
		    alert("请设置压缩质量");
			return false;
		}
		if(win.saveAsOptions.Quality.e.text<1||win.saveAsOptions.Quality.e.text>100){
		    alert("压缩质量参数错误！");
			return false;
		}
	}
	
	//文件名前后缀
	filePrefix=win.saveAsOptions.filePrefix.e.text;
    fileSubfix=win.saveAsOptions.fileSubfix.e.text;
	
	//允许程序执行
	processAllow=true;

	//启动文件处理函数
	fileProcessor();
}

/**确定按钮*/
win.buttons.Btnok.onClick=function(){
	checkSetting();
}

/**取消按钮*/
win.buttons.Btncancel.onClick=function(){
	//停止程序执行
	processAllow=false;
	
	app.preferences.rulerUnits=startRulerUnits;
	app.preferences.typeUnits=startTypeUnits;
	this.parent.parent.close();
}
//关于
win.buttons.about.onClick=function(){
    alert("Photoshop批处理专用工具V1.0\r\n Power By：www.wxwdesign.com \r\n 流水涵清","About");
}

//窗口居中
win.center();
//显示窗口
win.show();