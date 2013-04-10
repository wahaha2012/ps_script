//激活Photoshop，设置为活动窗口
app.bringToFront();

var PRESOLUTION=72;
var startRulerUnits=app.preferences.rulerUnits;
var startTypeUnits=app.preferences.typeUnits;
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;

var dialogue="dialog{\
    text:'自动切图V0.1',\
	group:Group{\
		orientation:'column',\
		alignChildren:'left',\
	    process:StaticText{text:'处理进度：',bounds:[0,0,300,14]},\
		timeline:Progressbar{bounds:[0,0,300,10],minvalue:0,maxvalue:100}\
		corrdination:Panel{\
			orientation:'row',\
            text:'裁剪尺寸',\
            x:Group{\
				orientation: 'row', \
                s: StaticText { text:'宽:' }, \
                e: EditText { preferredSize: [50, 20],text:128} ,\
                p: StaticText { text:'px' }, \
            }, \
            y: Group {\
				orientation: 'row', \
                s: StaticText { text:'高:' }, \
                e: EditText { preferredSize: [50, 20],text:64}, \
                p: StaticText { text:'px' }, \
            } ,\
        }, \
		fileResource:Group{\
			orientation: 'row', \
			buttonSelect: Button{text:'待裁剪文件', properties:{name:'open'} ,helpTip:'请选择待裁剪的文件'},\
			inputText: EditText{ text:'C:/Users/wxw/Desktop/map5_5.jpg', preferredSize: [180, 20] },\
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
			e: EditText { preferredSize: [50,20],text:'cutCopy'} ,\
			s2: StaticText { text:'勿含非法字符' , enabled:flase }, \
		}, \
		fileSubfix: Group {\
			orientation: 'row',  \
			s: StaticText { text:'在文件名后添加字符:' }, \
			e: EditText { preferredSize: [50, 20] }, \
			s2: StaticText { text:'勿含非法字符' , enabled:flase}, \
		} ,\
		fileNameType:Group{\
			orientation: 'row',  \
			q: StaticText { text:'输出文件命名方式:' }, \
			typeList:Group{\
			    single:RadioButton {text:'序列化'},\
			    double:RadioButton {text:'双循环',value:true},\
		    }\
		}, \
		finishProcess:Group{\
			orientation: 'row',  \
			q: StaticText { text:'处理完成后:' }, \
			c:Checkbox {text:'关闭文件',value:true},\
			c2:Checkbox {text:'显示处理时间',value:true},\
		}, \
		saveAsFolder:Group{\
			orientation: 'row', \
			buttonSelect: Button {text:'另存至', properties:{name:'save'} ,helpTip:'请选择文件要保持的目录'},\
			inputText: EditText  { text:'C:/Users/wxw/Desktop/cutCopys', preferredSize: [180, 20] },\
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

//初始窗口对象	
var win=new Window(dialogue);
//初始保存设置
var saveFileType="JPEG";
var exportOptions=new ExportOptionsSaveForWeb();
exportOptions.format=SaveDocumentType.JPEG;
exportOptions.quality=60;
var saveFileSubFix='jpg';
var filePrefix="",fileSubfix="";

//选择要裁剪的文件
win.group.fileResource.buttonSelect.onClick= function(){
    var selectedFile=File.openDialog('选择待裁剪文件');
    if(selectedFile!=null){
       win.group.fileResource.inputText.text=selectedFile.fsName;
	   win.group.fileResource.inputText.helpTip=selectedFile.fsName.toString();
    }
}

//另存为目录选择
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

//颜色下拉选择
var colorList=[256,128,64,32,16,8,4,2];
for(var i=0,len=colorList.length;i<len;i++){
    win.saveAsOptions.Quality.select.add("item",colorList[i]);
}
win.saveAsOptions.Quality.select.items[0].selected=true;
//对象不可用
win.saveAsOptions.Quality.color.enabled=false;
win.saveAsOptions.Quality.select.enabled=false;
win.saveAsOptions.Quality.opacity.enabled=false;

//选择存储格式
var saveFileTypeList=win.saveFileType.typeList;

function toggleQuality(Options){
    //开启颜色选项
	win.saveAsOptions.Quality.color.enabled=Options.enableColor;
    win.saveAsOptions.Quality.select.enabled=Options.enableColor;
    win.saveAsOptions.Quality.opacity.enabled=Options.enableColor;
	//关闭压缩质量
	win.saveAsOptions.Quality.q.enabled=Options.enablePack;
    win.saveAsOptions.Quality.e.enabled=Options.enablePack;
}

function selectFileType(target){
    saveFileType=target.text;
	exportOptions=new ExportOptionsSaveForWeb();
    switch(saveFileType){
	    case 'JPEG':
		    toggleQuality({enableColor:false,enablePack:true});
			exportOptions.format=SaveDocumentType.JPEG;
            exportOptions.quality=win.saveAsOptions.Quality.e.text;
			saveFileSubFix='jpg';
		break;
		case 'GIF':
		    toggleQuality({enableColor:true,enablePack:false});
			exportOptions.format=SaveDocumentType.COMPUSERVEGIF;
            exportOptions.colors=256;
            exportOptions.transparency=win.saveAsOptions.Quality.opacity.value;
			saveFileSubFix='gif';
		break;
		case 'PNG-8':
		    toggleQuality({enableColor:true,enablePack:false});
			exportOptions.format=SaveDocumentType.PNG;
            exportOptions.colors=256;
			exportOptions.transparency=win.saveAsOptions.Quality.opacity.value;
            exportOptions.PNG8=true;
			saveFileSubFix='png';
		break;
		case 'PNG-24':
		    toggleQuality({enableColor:false,enablePack:false});
			exportOptions.format=SaveDocumentType.PNG;
			exportOptions.transparency=win.saveAsOptions.Quality.opacity.value;
            exportOptions.PNG8=false;
			saveFileSubFix='png';
		break;
	}
}
//绑定文件类型选择
saveFileTypeList["jpeg"].onClick=function(){selectFileType(this);}
saveFileTypeList["gif"].onClick=function(){selectFileType(this);}
saveFileTypeList["png8"].onClick=function(){selectFileType(this);}
saveFileTypeList["png24"].onClick=function(){selectFileType(this);}

//生成裁剪的文件
function createCutCopy(h,w,width,height,fileName){
    //添加一个选区
    app.activeDocument.selection.select([[w*width,h*height],[(w+1)*width,h*height],[(w+1)*width,(h+1)*height],[w*width,(h+1)*height],[w*width,h*height]]);
	//剪切选区
    app.activeDocument.selection.cut();
	//创建一个新文档
    var newDoc=app.documents.add(width,height,72,fileName,NewDocumentMode.RGB,DocumentFill.TRANSPARENT);
	//粘帖当前粘帖板内容
    app.activeDocument.paste();
	//导出web所用格式
    newDoc.exportDocument(File(win.saveAsOptions.saveAsFolder.inputText.text+'/'+filePrefix+fileName+fileSubfix+'.'+saveFileSubFix),ExportType.SAVEFORWEB,exportOptions);
	//关闭文件，不保存
	newDoc.close(SaveOptions.DONOTSAVECHANGES);
}

//处理裁剪
function cutProcess(){
    //判断当前是否有文件已经打开
    if(app.documents.length>1){
	    alert("请先关闭不需要裁剪的文件！");
		return false;
	}
    //打开要裁剪的文件
    var fileResource=File(win.group.fileResource.inputText.text);
	app.open(fileResource);
	//合并所有图层
	app.activeDocument.flatten();
	//获得文档的宽和高
	var resourceWidth=app.activeDocument.width;
	var resourceHeight=app.activeDocument.height;
	//获得裁剪的尺寸
    var cutWidth=parseInt(win.group.corrdination.x.e.text,10);
    var cutHeight=parseInt(win.group.corrdination.y.e.text,10);
	//获得可裁剪成的文件数
	var cutXNumber=Math.ceil(resourceWidth/cutWidth);
	var cutYNumber=Math.ceil(resourceHeight/cutHeight);
	var cutNumber=cutXNumber*cutYNumber;
	if(cutNumber>10){
	    var confirmCutNumber=confirm("要终止程序执行吗？\r\n生成文件比较多，\r\n可能需要很长时间处理。",undefined,"停止程序执行？");
	}
	if(confirmCutNumber){return false;}
	//循环处理裁剪
	var sum=0;
	var isSingle=win.saveAsOptions.fileNameType.typeList.single.value;
	var startTime=new Date().getTime(),totalTime='';
	for(var y=0;y<cutYNumber;y++){
	    for(var x=0;x<cutXNumber;x++){
		    //显示处理进度
			sum=y*cutXNumber+x+1;
			//进度条
			win.group.timeline.value=Math.round(sum/cutNumber*100);
			//进度文字状态
	        win.group.process.text='处理进度'+Math.round(sum/cutNumber*100)+'%，';
			win.group.process.text+='['+sum+'/'+cutNumber+'] ';
			if(isSingle){
			    win.group.process.text+='文件：'+filePrefix+sum+fileSubfix+'.'+saveFileSubFix;
			    createCutCopy(y,x,cutWidth,cutHeight,sum);
			}else{
			    win.group.process.text+='文件：'+filePrefix+'x'+(x+1)+'y'+(y+1)+fileSubfix+'.'+saveFileSubFix;
			    createCutCopy(y,x,cutWidth,cutHeight,'x'+(x+1)+'y'+(y+1));
			}
			if(sum>=cutNumber){
			    //关闭文件
				if(win.saveAsOptions.finishProcess.c.value){
				    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
				}
				//显示处理时间
				if(win.saveAsOptions.finishProcess.c2.value){
				    totalTime='用时：'+Math.round((new Date().getTime()-startTime)/1000)+'秒';
				}
			    alert("裁剪完毕！"+totalTime);
				//关闭对话框
				win.close();
			}
		}
	}
}

//判断设定
function checkSetting(){
    if(!win.group.corrdination.x.e.text||win.group.corrdination.x.e.text<1){alert("请设置宽度");return false;}
	if(!win.group.corrdination.y.e.text||win.group.corrdination.y.e.text<1){alert("请设置高度");return false;}
	
	if(!win.group.fileResource.inputText.text){alert("请选择待裁剪文件");return false;}
	if(!File(win.group.fileResource.inputText.text).exists){alert("文件不存在！");return false;}
	
	if(!win.saveAsOptions.saveAsFolder.inputText.text){alert("请选择存储目录");return false;}
	if(!Folder(win.saveAsOptions.saveAsFolder.inputText.text).exists){alert("目录不存在！");return false;}
	
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
	//alert(win.group.corrdination.x.e.text);	
	//alert("checkOk");
	cutProcess();
}

//确定按钮
win.buttons.Btnok.onClick=function(){
	checkSetting();
}
//取消按钮
win.buttons.Btncancel.onClick=function(){
	app.preferences.rulerUnits=startRulerUnits;
	app.preferences.typeUnits=startTypeUnits;
	this.parent.parent.close();
}
//关于
win.buttons.about.onClick=function(){
    alert("自动切图专用工具V1.0\r\n Power By：www.wxwdesign.com \r\n 流水涵清","About");
}

//窗口居中
win.center();
//显示窗口
win.show();