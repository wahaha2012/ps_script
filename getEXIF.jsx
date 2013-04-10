displayDialogs = DialogModes.NO;
var defaultRulerUnits = preferences.rulerUnits;
preferences.rulerUnits = Units.PIXELS;

//将一个长字串分解成单个字符串
function explodeArray(item) {
var i=0;
var Count=0;
var tempString=new String(item);
tempArray=new Array(1);

do{
i=tempString.indexOf(":");
if(i>0)
tempString=tempString.substr(i+1,tempString.length-i-1);
i=tempString.indexOf(">");
if(i>0) {
tempArray[Count]=tempString.substr(0,i);
tempString=tempString.substr(i+1,tempString.length-i-1);
Count ++;
}
i=tempString.indexOf("<");
if(i>0) {
tempArray[Count]=tempString.substr(0,i);
tempString=tempString.substr(i-1,tempString.length-i+1);
Count ++;
}
}while (tempString.indexOf("</x:xmpmeta>")>0);

tempArray[Count]=tempString;
return tempArray;
}

var i=0;
var j=0;
var k=0;
var pResulotion=72;
var AD="";
var resRatio="";
var imageRatio="";
var dateArray1="";
var dateArray2="";
var monthsArray="";
var exposureProgramArray="";
var phoDate="";
var phoTime="";
var photoWidth="";
var photoHight="";
var exifData="";
var black="";
var white="";
var grey="";
var fWidth="";
var fHight="";
var tSize="";
var tLeft="";
var tHight="";
var infoLayer="";
var TI="";
nameLayer="";
var TN="";
var stringTemp=""; //临时字串
var make=""; //相机公司
var model=""; //相机型号
var camera=""; //相机
var lens=""; //镜头类型
var lensUsed=""; //使用的镜头
var focalLength=""; //焦距
var exposureTime=""; //快门
var fNumber=""; //光圈
var ISOSpeedRatings=""; //ISO设置
var dateTimeOriginal=""; //拍摄时间
var exposureBiasValue=""; //曝光补偿
var exposureProgram=""; //曝光程序模式
var fired=""; //闪光模式
//改成你自己想写的，比如版权所有和你自己的网名等
//如果为空，将采用相机设置的名字

var creator="phtot by:xuan"; //拍摄者


AD = activeDocument;

//Aglin 编制了自动改变图象大小为网上交流大小的代码，
//稍加修改，如果宽窄任一边大于1000，就自动剪裁
//这里最长边为750，最短边为500
//请根据自己相机拍出来的图像比例设置长宽比
//如果不用可以去掉
//--------------------------------------------
var resizeMax=750;
var resizeMin=500;
if(AD.width.value > 1000 || AD.height.value > 1000) {
imageRatio = AD.width.value/AD.height.value;
if(imageRatio>1)
AD.resizeImage(resizeMax,resizeMin,pResulotion,ResampleMethod.BICUBICSHARPER);
if(imageRatio==1)
AD.resizeImage(resizeMax,resizeMax,pResulotion,ResampleMethod.BICUBICSHARPER);
if(imageRatio<1)
AD.resizeImage(resizeMin,resizeMax,pResulotion,ResampleMethod.BICUBICSHARPER);
}
//--------------------------------------------


resRatio = AD.resolution/pResulotion;
if(resRatio!=1){
AD.resizeImage(AD.width.value,AD.height.value,pResulotion);
}


photoWidth = AD.width.value;
photoHight = AD.height.value;

//获取RAW保存的信息
exifData = AD.xmpMetadata.rawData.toString();

//将EXIF信息分成单个的相关信息
explodeArray(exifData);

//Photoshop CS获取EXIF信息

//快门速度
for(n = 0; n < tempArray.length; n ++) {
stringTemp=tempArray[n];
if(stringTemp.indexOf("ExposureTime")!=-1){
exposureTime = tempArray[n+1];
break;
}
}

//光圈大小
for(n = 0; n < tempArray.length; n ++) {
stringTemp=tempArray[n];
if(stringTemp.indexOf("FNumber")!=-1){
fNumber = tempArray[n+1];
break;
}
}

//曝光程序模式
for(n = 0; n < tempArray.length; n ++) {
stringTemp=tempArray[n];
if(stringTemp.indexOf("ExposureProgram")!=-1){
exposureProgram = tempArray[n+1];
break;
}
}

//曝光补偿
for(n = 0; n < tempArray.length; n ++) {
stringTemp=tempArray[n];
if(stringTemp.indexOf("ExposureBiasValue")!=-1){
exposureBiasValue = tempArray[n+1];
break;
}
}

//闪光模式
for(n = 0; n < tempArray.length; n ++) {
stringTemp=tempArray[n];
if(stringTemp.indexOf("Fired")!=-1){
fired = tempArray[n+1];
break;
}
}

//拍摄日期、时间
for(n = 0; n < tempArray.length; n ++) {
stringTemp=tempArray[n];
if(stringTemp.indexOf("DateTimeOriginal")!=-1){
dateTimeOriginal = tempArray[n+1];
break;
}
}

//使用焦距
for(n = 0; n < tempArray.length; n ++) {
stringTemp=tempArray[n];
if(tempArray[n]=="FocalLength"){
focalLength = tempArray[n+1];
break;
}
}

//ISO设置
for(n = 0; n < tempArray.length; n ++) {
stringTemp=tempArray[n];
if(stringTemp.indexOf("ISOSpeedRatings")!=-1){
ISOSpeedRatings = ", ISO "+tempArray[n+5];
break;
}
}

//使用镜头类型
for(n = 0; n < tempArray.length; n ++) {
stringTemp=tempArray[n];
if(tempArray[n]=="Lens"){
lens=tempArray[n+1];
break;
}
}


//相机厂商
for(n = 0; n < tempArray.length; n ++) {
stringTemp=tempArray[n];
if(stringTemp.indexOf("Make")!=-1){
make = tempArray[n+1];
break;
}
}

//相机型号
for(n = 0; n < tempArray.length; n ++) {
stringTemp=tempArray[n];
if(stringTemp.indexOf("Model")!=-1){
var model = tempArray[n+1];
break;
}
}
//对于有的相机型号不包括制造商部分
//camera = make+model;
//对于有的相机型号包括制造商部分
camera = model;

//相机所有者
for(n = 0; n < tempArray.length; n ++) {
stringTemp=tempArray[n];
if(stringTemp.indexOf("creator")!=-1 && creator==""){
creator = tempArray[n+5];
break;
}
}

//检查快门速度
dateArray1 = exposureTime.split("/");
i = dateArray1[0];
j = dateArray1[1];
if(i>1)
exposureTime=parseInt(i/j)+"."+(i-parseInt(i/j)*j);
else {
j=parseInt(j/i);
i=1;
exposureTime=i+"/"+j;
}

//计算光圈大小
dateArray1 = fNumber.split("/");
i = dateArray1[0];
j = dateArray1[1];
if(j>1)
fNumber=i/j;
else
fNumber=i;

//曝光补偿换算成小数
dateArray1 = exposureBiasValue.split("/");
i = dateArray1[0];
j = dateArray1[1];
exposureBiasValue=i/j;

//小数点后面保留2位，就*100/100，保留一位，就*10/10
//这里保留了2位，20D可以不要这两行
if(exposureBiasValue!=0)
exposureBiasValue=parseInt(exposureBiasValue*100)/100;

if (exposureBiasValue > 0)
exposureBiasValue="+"+exposureBiasValue;

//确定曝光程序模式
exposureProgramArray = ["Not Defined",
"Manual",
"Normal Program",
"Aperture Priority",
"Shutter Priority",
"Creative Program",
"Action Program",
"Portrait Mode",
"Landscape Mode"];
exposureProgram = exposureProgramArray[exposureProgram];

//检查闪光模式
dateArray1 = fired;
if(dateArray1.indexOf("True")!=-1)
fired="FlashOn";
else
fired="FlashOff";


//检查焦距
dateArray1 = focalLength.split("/");
i = dateArray1[0];
j = dateArray1[1];
if(j>1)
focalLength=parseInt(i/j);
else
focalLength=i;

 

//改变日期格式
dateArray1 = dateTimeOriginal.split("T");
phoDate = dateArray1[0];
phoTime = dateArray1[1];

dateArray2 = phoTime.split("+");
phoTime = dateArray2[0];

//你有什么镜头，就根据镜头和最大焦距改吧

if(lens != "") {
if(lens.indexOf("17.0-40.0 mm")!=-1)
lensUsed = "Canon 17-40mm F4L USM";
if(lens.indexOf("70.0-200.0 mm")!=-1)
lensUsed = "Canon 70-200mm F4L USM";
if(lens.indexOf("85.0 mm")!=-1)
lensUsed = "Canon 85mm F1.8 USM";
if(lens.indexOf("100.0 mm")!=-1)
lensUsed = "Canon Macro 100mm F2.8 USM";
}
//如果没有镜头信息，就使用原来的办法比较
else {
var focLength=parseInt(focalLength);
if(focLength>=17 && focLength<=40)
lensUsed = "Canon 17-40mm F4L USM";
if(focLength>=70 && focLength<=200)
lensUsed = "Canon 70-200mm F4L USM";
if(focLength=="85")
lensUsed = "Canon 85mm F1.8 USM";
if(focLength=="100")
lensUsed = "Canon Macro 100mm F2.8 USM";
}

//画线和框
//定义黑色，你也可以定义其他颜色哟
black = new SolidColor();
black.rgb.red = black.rgb.green = black.rgb.blue = 0;

//定义白色，你也可以定义其他颜色哟
white = new SolidColor();
white.rgb.red = white.rgb.green = white.rgb.blue = 255;

//定义灰色，你也可以定义其他颜色哟
grey = new SolidColor();
grey.rgb.red = grey.rgb.green = grey.rgb.blue = 50;

//加入一条白线
backgroundColor = white;

//如果改为黑线
//backgroundColor = black;

//白线宽窄设为2或4，两边，实际宽度除以2
AD.resizeCanvas(AD.width.value+2,AD.height.value+2,AnchorPosition.MIDDLECENTER);

//加入灰框
backgroundColor = black;

//加入黑框
//backgroundColor = black;

//如果改为白框
//backgroundColor = white;

//边框宽度和高度,这里将黑框宽窄设为图片宽度的1/40，两边，实际宽度再除以2
fWidth = parseInt(photoWidth/40);
fHight = parseInt(photoWidth/40);

//加框
AD.resizeCanvas(AD.width.value+fWidth,AD.height.value+fHight, AnchorPosition.MIDDLECENTER);

//底部再加宽点，便于写字
AD.resizeCanvas(AD.width.value,AD.height.value+fHight,AnchorPosition.TOPCENTER);


//标字和参数
nameLayer = AD.artLayers.add();
nameLayer.kind = LayerKind.TEXT;
TN = nameLayer.textItem;

TN.contents = creator;

//字体、字号、颜色和加粗等
TN.font = "STXingkai";
//TN.font = "宋体";

//右对齐
TN.justification = Justification.RIGHT;

//字号
tSize = parseInt((fWidth+10)/2);

//字体左边距和下边距
tLeft = photoWidth;
tHight = photoHight-fHight+tSize;

//标字的位置
TN.position = [tLeft,tHight];

TN.size = tSize+2;
TN.color = white;

//如果为白框，字体为黑色
//TN.color = black;

TN.fauxBold = true;

infoLayer = AD.artLayers.add();
infoLayer.kind = LayerKind.TEXT;
TI = infoLayer.textItem;

//右对齐，如果左对齐可以省略下面这行
TI.justification = Justification.RIGHT;

tHight = photoHight+fHight+tSize;

//标字的位置
TI.position = [tLeft,tHight];

//显示：相机型号，镜头，焦距，曝光时间，光圈，ISO设置，拍摄日期等

TI.contents = camera+", "+lensUsed+" @"+focalLength+"mm,"+exposureTime+"Sec,F/";
TI.contents = TI.contents+fNumber+", EV"+exposureBiasValue+ISOSpeedRatings;
//如果对曝光程式不感兴趣，请去掉下面行
TI.contents = TI.contents+", "+exposureProgram+", "+fired;
TI.contents = TI.contents+"\u000D Date/Time: "+phoDate+" "+phoTime;

//字体、字号、颜色等
TI.font = "FrenchScriptMT";
//TI.font = "Arial";

TI.size = tSize;
TI.color = white;

//如果为白框，字体为黑色
//TI.color = black;

TI.fauxBold = true;

AD.flatten(); 