#target photoshop
app.bringToFront();

// 带自动判断横竖的统一长宽操作。默认是直接保存关闭，原文件要注意备份！ v1.11 - 2008.2.23

var PRESOLUTION = 72;
app.preferences.rulerUnits = Units.PIXELS;
		
res ="dialog { \
text:'批量尺寸调整 ',\
        group: Group{orientation: 'column',alignChildren:'left',\
				top:StaticText{text:'默认为直接覆盖保存 - 请注意选择或做好备份',align:'left'},\
				corrdination: Panel { orientation: 'row', \
                        text: '需要尺寸', \
                                x: Group { orientation: 'row', \
                                        s: StaticText { text:'宽:' }, \
                                        e: EditText { preferredSize: [50, 20] } ,\
                                        p: StaticText { text:'px' }, \
                                        }, \
                                y: Group { orientation: 'row', \
                                        s: StaticText { text:'高:' }, \
                                        e: EditText { preferredSize: [50, 20] }, \
                                        p: StaticText { text:'px' }, \
                                        } ,\
                                }, \
				a:Group{ orientation: 'row', \
								c: Checkbox { preferredSize: [16, 16]} ,\
								s: StaticText {text:'保持原图长宽比，新尺寸仅作外框限定'},\
								}, \
				b:Group{ orientation: 'row', \
								c: Checkbox { preferredSize: [16, 16]} ,\
								s: StaticText {text:'不判断原图横竖'},\
								}, \
				now:Group{ orientation: 'row', \
								c: Checkbox { preferredSize: [16, 16]} ,\
								s: StaticText {text:'对文件夹进行操作（否则处理所有目前打开的文档）'},\
								}, \
				folderO:Group{ orientation: 'row', \
								b: Button {text:'待处理文件夹', properties:{name:'open'} ,helpTip:'选择您需要处理的文件所在的文件夹'},\
								s: EditText  { text:'', preferredSize: [180, 20] },\
								},\
				other:Group{ orientation: 'row', \
								c: Checkbox { preferredSize: [16, 16]} ,\
								s: StaticText {text:'启用另存 (jpg格式)'},\
								}, \
				otherSet: Panel {orientation: 'column',alignChildren:'left',\
                        text: '另存设置', \
						Quality: Group { orientation: 'row',  \
									s: StaticText { text:'Jpeg压缩质量:' }, \
									e: EditText { preferredSize: [30, 20] ,text:'7'} ,\
									s: StaticText { text:'(0-12,数值越大质量越高)' }, \
									}, \
						head: Group { orientation: 'row',  \
									s: StaticText { text:'在文件名前添加字符:' }, \
									e: EditText { preferredSize: [50, 20] } ,\
									}, \
						foot: Group { orientation: 'row',  \
									s: StaticText { text:'在文件名后添加字符:' }, \
									e: EditText { preferredSize: [50, 20] }, \
									} ,\
						otherF:Group{ orientation: 'row', \
									c: Checkbox { preferredSize: [16, 16]} ,\
									s: StaticText {text:'另存至其他文件夹'},\
									}, \
						folderS:Group{ orientation: 'row', \
									b: Button {text:'另存至', properties:{name:'save'} ,helpTip:'选择您处理好的文件要保存至的文件夹'},\
									s: EditText  { text:'', preferredSize: [180, 20] },\
									},\
						},\
				},\
        buttons: Group { orientation: 'row', alignment: 'right',\
                Btnok: Button { text:'确定', properties:{name:'ok'} }, \
                Btncancel: Button { text:'取消', properties:{name:'cancel'} } \
                }, \
}";

win = new Window (res);

win.buttons.Btncancel.onClick = function () {
this.parent.parent.close();
}

function lock_b(){  //如果勾选了a,则b被锁定
		if(win.group.a.c.value){
				win.group.b.c.value=true;
		}
	}
win.group.a.c.onClick =function() { lock_b()}; 
win.group.b.c.onClick =function() { lock_b()};

// 打开文件夹的操作
var folderOpen=win.group.folderO
var folderSave=win.group.otherSet.folderS

folderOpen.b.onClick = function() { 
		var defaultFolder = folderOpen.s.text;
		var testFolder = new Folder(defaultFolder);
		if (!testFolder.exists) {
			defaultFolder = "~";
		}
		var selFolder = Folder.selectDialog("选择待处理文件夹", defaultFolder);
		if ( selFolder != null ) {
	        folderOpen.s.text = selFolder.fsName;
			folderOpen.s.helpTip = selFolder.fsName.toString();
	    }
}
folderSave.b.onClick = function() { 
		var defaultFolder = folderSave.s.text;
		var testFolder = new Folder(defaultFolder);
		if (!testFolder.exists) {
			defaultFolder = "~";
		}
		var selFolder = Folder.selectDialog("选择要储存至的文件夹", defaultFolder);
		if ( selFolder != null ) {
	        folderSave.s.text = selFolder.fsName;
			folderSave.s.helpTip = selFolder.fsName.toString();
	    }
}
// 初始化选项
win.group.folderO.enabled =false;
win.group.otherSet.enabled =false;

//操作文件夹开关
win.group.now.c.onClick =function(){
	if (win.group.folderO.enabled) {
		win.group.folderO.enabled =false;
		}else{
		win.group.folderO.enabled =true;
		}
}
//另存开关
win.group.other.c.onClick =function(){
	if (win.group.otherSet.enabled) {
		win.group.otherSet.enabled =false;
		}else{
		win.group.otherSet.enabled =true;
		if (!win.group.otherSet.otherF.c.value) {win.group.otherSet.folderS.enabled =false}
		}
}
//另存至文件夹开关
win.group.otherSet.otherF.c.onClick =function(){
	if (win.group.otherSet.folderS.enabled) {
		win.group.otherSet.folderS.enabled =false;
		}else{
		win.group.otherSet.folderS.enabled =true;
		}
}


// 实际处理开始
function newsize(docRef,a,b,PW,PH){ //改变图象尺寸函数
			var dw = docRef.width;
			var dh = docRef.height;

			var fw = PW;
			var fh = PH;

			if(!b && dh>dw){
				fw = PH;
				fh = PW;
			}
			if(a){
				w1 =dw/fw;
				h1 =dh/fh;
				if(w1>h1){
					fh =dh/w1;	
				}else{
					fw =dw/h1;
				}
			}
	docRef.resizeImage(fw, fh, PRESOLUTION, ResampleMethod.BICUBIC);
}

function save(docRef) {	//储存函数
		if (win.group.other.c.value){ //判断是否另存
			
				docRef.flatten() ;//合并图层，以储存jpg
				docRef.changeMode(ChangeMode.RGB); // 更改为rgb模式，避免其它模式无法储存				
				var jpegOptions = new JPEGSaveOptions();
				var setquality = Number(win.group.otherSet.Quality.e.text);
				if (setquality>12) {
					setquality=12;
				}else if (setquality<0) {
					setquality=0;
				}
				jpegOptions.quality = setquality;
				
				// 获取另存文件夹及前后追加字段
				var headWord = win.group.otherSet.head.e.text;
				var footWord = win.group.otherSet.foot.e.text;	
				
				if (win.group.otherSet.otherF.c.value){ //如果选中另存至文件夹
							if (win.group.otherSet.folderS.s.text){ 
								var saveFolder = win.group.otherSet.folderS.s.text+"/";	
							}else{	
								var saveFolder = docRef.path+"/newsize_";  //容错，避免没有具体选择另存到那个文件夹
							}
				}else{
							if (headWord || footWord){
								var saveFolder = docRef.path+"/";
							}else{
								var saveFolder = docRef.path+"/newsize_"; //容错，避免没有添加前后缀而保存在本文件夹
							}
				}
								
			docRef.saveAs(new File(saveFolder + headWord +docRef.name.substring(0,docRef.name.lastIndexOf('.'))  + footWord + ".jpg"),jpegOptions);	//设定输出文件名称			
		}else{
			docRef.save();
		}
		docRef.close(SaveOptions.DONOTSAVECHANGES); //关闭当前文档	
}

win.buttons.Btnok.onClick = function () {	
		var x=Number(win.group.corrdination.x.e.text);
		var y=Number(win.group.corrdination.y.e.text);
		var a=win.group.a.c.value;
		var b=win.group.b.c.value; //选中则不颠倒横竖，以输入值为准
		
		if (!b && x<y){  //确保PW>=PH
				var PW=y
				var PH=x
				}else{
				var PW=x
				var PH=y
				}	
			
		if (!win.group.now.c.value) {  // 当前活动文档为操作对象	
				while (app.documents.length){ 
						var docRef = app.activeDocument; 
						newsize(docRef,a,b,PW,PH);
						save(docRef);
				}
		}else{ // 文件夹为操作对象			
				var openFolder = Folder(win.group.folderO.s.text);				
				var fileList = openFolder.getFiles() //获取open文件夹下所有文件
				for (i=0;i<fileList.length;i++){
					if (fileList[i] instanceof File && fileList[i].hidden == false){ //不处理隐藏文件
						open(fileList[i]); 
						var docRef = app.activeDocument; 
						newsize(docRef,a,b,PW,PH);
						save(docRef);
					}
				}
		}
this.parent.parent.close();
}

win.center();
win.show();
