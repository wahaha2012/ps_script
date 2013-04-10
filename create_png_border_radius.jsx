//激活Photoshop，设置为活动窗口
app.bringToFront();

var PRESOLUTION=72; 
var startRulerUnits=app.preferences.rulerUnits;
var startTypeUnits=app.preferences.typeUnits;
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;

var fromFolder=Folder('C:/Users/wxw/Desktop/waha');
var files=fromFolder.getFiles(); //获取文件夹下所有文件

//所有打开的文件个数
// var len=app.documents.length;  //如果文件都已经打开
var len=files.length;
var doc=null;

//导出文件参数设置
var exportOptions=new ExportOptionsSaveForWeb();
exportOptions.format=SaveDocumentType.PNG;
exportOptions.colors=256;
exportOptions.transparency=true;
exportOptions.PNG8=true;

var savePath='C:/Users/wxw/Desktop/final';

for(var i=0;i<len;i++){
    if(files[i] instanceof File && files[i].hidden==false){ //不处理隐藏文件
		open(files[i]);
	}else{  //如果文件不符合，则跳过
	    continue;
	}

    //活动文档
    doc=app.activeDocument;

    //转变成RGB
    if(doc.mode!= "RGB"){
        doc.changeMode(ChangeMode.RGB);
    }

    //活动图层
    var layer=doc.activeLayer;

    //复制图层
   if(layer.isBackgroundLayer){
        layer.duplicate();
	    layer.remove();
    }

    //文档尺寸
    var w=doc.width;
    var h=doc.height;
	
	//生成图片文件
	createFile();
}

function createFile(){
    //选择选区
    doc.selection.select([[0,0],[1,0],[1,1],[0,1]]);
    doc.selection.clear();
    doc.selection.select([[w-1,0],[w,0],[w,1],[w-1,1]]);
    doc.selection.clear();
    doc.selection.select([[0,h-1],[1,h-1],[1,h],[0,h]]);
    doc.selection.clear();
    doc.selection.select([[w-1,h-1],[w,h-1],[w,h],[w-1,h]]);
    doc.selection.clear();

    //导出web所用格式
    doc.exportDocument(File(savePath+doc.name.replace('gif','png')),ExportType.SAVEFORWEB,exportOptions);
    //关闭文件，不保存
    doc.close(SaveOptions.DONOTSAVECHANGES);
}



// 合并所有图层
// app.activeDocument.flatten();

// 全选
// app.activeDocument.selection.selectAll();
// 复制
// app.activeDocument.selection.copy();
// 粘帖
// app.activeDocument.selection.paste();