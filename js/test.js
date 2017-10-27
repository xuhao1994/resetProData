/*
* @Author: ASUS
* @Date:   2017-10-26 13:25:19
* @Last Modified by:   xuhao1994
* @Last Modified time: 2017-10-27 12:09:06
*/
function initData(){
	var colAll = $("table").find("tr:first-child td").length; //列总数
	//判断当前行的第一个格子原本属于第几列
	var trBox = $("table").find("tr:gt(0)");//所有行的集合
	var data = {};
	for(var i=0;i<colAll;i++){
		data[i]=[]
	}
	data = checkTr(trBox,data);
	return data
}
function checkTr(trbox,data){
	trbox.each(function(index1,el1){
		//获取当前行前面的所有行并且计算前面行里合并过的单元格是否占了自己行的格子
		var curTrIndex = $(el1)[0].rowIndex;//当前行index
		var initTdIndex = 0;//默认td是属于第一列
		$(el1).prevAll("tr").each(function(index2,el2){
			var prevTrIndex = $(el2)[0].rowIndex;
			$(el2).find("td").each(function(index3,el3){
				var rowspanNum = Number($(el3).attr("rowspan"));
				if(!isNaN(rowspanNum)){
					if((rowspanNum+prevTrIndex)>curTrIndex){
						initTdIndex++
					}
				}
			})
		})
		$(el1).find("td").each(function(index,el){
			if((initTdIndex+index)==3 || (initTdIndex+index)==4){
				var num = $(el).attr("rowspan");
				num = num?num:1;
				$(el).text($(el).text()+"#"+num);
			}
			data[initTdIndex+index].push($(el).text().trim())
		})
	})

	for(var el in data){
		if(!data[el].length){
			delete data[el]
		}
	}
	return data
}

function reSetData(){
	var data = initData();
	var tcobj = new Object();
		tcobj.hid= null;
        tcobj.pid = null;
        tcobj.people = data[9][0];
        tcobj.tcpoint = [];
        tcobj.table = [];
    var tcpointarr = data[2][0].trim().split("、");
    for (var i = 0; i < tcpointarr.length; i++)
    {
        var tcpointobj = { img: "", title: tcpointarr[i], detailc: tcpointarr[i] };
        tcobj.tcpoint.push(tcpointobj);
    }
    for(var i = 0; i < data[3].length; i++){
    	var labelOfCount = 0;
    	var curChildCount = (resetStr(data[3][i])).num;
    	data[3][i] = (resetStr(data[3][i])).str;
    	var firsttitleobj = { firstTitle: data[3][i], content: [] };
		for (var j = 0; j < curChildCount; j++){
			var curChildCount2 = (resetStr(data[4][0])).num;
    		data[4][0] = (resetStr(data[4][0])).str;
    		var secoundtitleobj = { secondTitle: data[4].shift(), content: [] };
    		for(var k = 0;k< curChildCount2;k++){
				var threetitleobj = { thirdTitle:data[5].shift(), detail: data[7].shift() };
            	secoundtitleobj.content.push(threetitleobj);
    		}
            firsttitleobj.content.push(secoundtitleobj);
            labelOfCount+=curChildCount2
            if(labelOfCount>=(curChildCount)){
            	break;
            }
		}
    	tcobj.table.push(firsttitleobj);
    }
   	return JSON.stringify(tcobj);
}

function resetStr(str){
	var num = "";
	for(var i = str.length-1;i>=0;i--){
		var curStr = str[i];
		if(!isNaN(curStr)){
			num+=curStr
		}else{
			break;
		}
	}
	str = str.substring(0,str.length-num.length-1);
	num = Number(num.split("").reverse().join(""));
	return {"str":str,"num":num}
}