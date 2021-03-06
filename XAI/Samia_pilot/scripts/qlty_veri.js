highlight_data = []
var inkColor = "red" // "#1f77b4"
var imgIndex = '';
var fill_checkbox = 1

  fill_area = d3.selectAll("input[name=fillarea]")          // Check box for cutting the tails
      .style("margin", "0px 10px 0px 10px")
      .style("padding", "0px 0px")
      .attr("position", "relative")
      .attr("checked", true)
      .on("change", function() {
                        if (this.checked) {
                          fill_checkbox = 1;
                        }else{
                          fill_checkbox = 0;
                        }
                    }
                       );


var path;
var color = "lightblue"
x_old = 0
y_old = 0

var div1 = d3.select("body").append("talkbubble")   // Tooltip
		.attr("class", "tooltip")
		.style("opacity", 1)
		.style("position", "absolute")
		.style("text-align", "center")
		.style("width", 100)
		.style("height", 48)
		.style("border-radius", "8px")   // "10% / 10%")
		.style("padding", 2)
		.style("font-size", 12)
		.style("background", "lightblue") // "#1e90ff")
		.style("border", 3)
		.style("pointer-events", "none");

   var output;
    d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };
  
  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };

var txtfiles = []
var readfiles = []
var imageName;
var folder_name = "ImageNet"
var call_once = 0;
var total_doc
var doc_num

function txtfilename(){
	
	folder_name = getCookie("user_selection")
	var folder = "data/"+ folder_name +"_exp/";
	var txtdoc = []
	
	$.ajax({
	    url : folder,
	    success: function (data) {
	        $(data).find("a").attr("href", function (i, val) {
	            	this_file = val.split("");
	            	if ( (this_file.pop() == "g") | (this_file.pop() == "m") ){  //if (( !isNaN(parseInt(this_file.pop(), 10)) )){
	            	// this_file.pop()
	            	// if ( (this_file.pop() != "i") & (this_file.pop() !== ".") ){
	            		txtfiles.push(val) // txtfiles.push(folder+val)
	            	}
	        });
	        console.log(txtfiles)
	        total_doc = txtfiles.length;
			nextImage();
	    }
	});

}


function start_over(){

    if (confirm("Are you sure you want to start over?") == true) {
           
            WriteFile();
            
	    results_json  = []
		highlight_data = []
		txtfiles = []
		ct = 0;
		saved = 1;
		readfiles = []
		txtfilename();
		location.href="../expevl.html"
	}
}

function nextImage() {

	save_json();     // if ((ct > 0) & (saved == 0)) save_json();
       
     var rad1= document.getElementById("star-1");
     var rad2= document.getElementById("star-2");
     var rad3= document.getElementById("star-3");
     var rad4= document.getElementById("star-4");
     var rad5= document.getElementById("star-5");
     rad1.checked=false;
     rad2.checked=false;
     rad3.checked=false;
     rad4.checked=false;
     rad5.checked=false;

     var lab1 = document.getElementById("s1");
     var lab2 = document.getElementById("s2");
     var lab3 = document.getElementById("s3");
     var lab4 = document.getElementById("s4");
     var lab5 = document.getElementById("s5");

     lab1.className = "btn btn-primary";
     lab2.className = "btn btn-primary";
     lab3.className = "btn btn-primary";
     lab4.className = "btn btn-primary";
     lab5.className = "btn btn-primary";


        if(doc_num==94){
           //if (confirm("Are you sure you want to start over?") == true) {
           
            WriteFile();
    
            
	         results_json  = []
		highlight_data = []
		txtfiles = []
		ct = 0;
		saved = 1;
		readfiles = []
		txtfilename();
              //  alert("Thank you for taking part in the study!");
		location.href="../expevl.html"
	//}
}

        
     document.getElementById("next2").disabled= true;
     setInterval(delay,900);
    

     
     function delay(){ 


     if(((rad1.checked)||(rad2.checked)||(rad3.checked))||((rad4.checked)||(rad5.checked)))
     {
        document.getElementById("next2").disabled= false;
        console.log("jmhg");
     }
    }
 
      

    $('input[name=star]').prop('checked', false);

	for (var i = 0; i < txtfiles.length ; i ++){
	  	if ( $.inArray(txtfiles[i], readfiles) == -1 ){
			readfiles.push(txtfiles[i])
			
			showImage(txtfiles[i], 0);
            rating = 0; 
            
			imageName = txtfiles[i].split("/").pop();
			doc_num =i + 1;
			image_title();
			
			d3.selectAll('path.line').remove();
			highlight_data = []
  			ct =0;

			break;
		}
	}

	

}

function lastImage() {
			
			save_json();       // if ((ct > 0) & (saved == 0)) save_json();

            $('input[name=star]').prop('checked', false);
            rating = 0;

	  		readfiles.pop()
	  		this_article = readfiles.pop()
	  		readfiles.push(this_article)
	  		// console.log(this_article)

	  		showImage(this_article, 0);
	  		imageName = this_article.split("/").pop();

	  		d3.selectAll('path.line').remove();
	  		highlight_data = []
  			ct =0;

	 		doc_num -= 1;
			image_title();



}

var words_hash = []; 
var words_array = [];
var results_json = [];

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";

}


function image_title(){
    obj = imageName.toString().split(".")[0].slice(0,-1)
    //explanation_title.text("How good do you think the highlighted area is to explain the object in this image?");
}

function showImage(image_name, update_txt) {

  // var this_img = new Image();  

  // this_img.src = image_name;
  // $(".img_exp").attr("xlink:href",image_name);

  // this_img.onload = function(){

		// 	  	var img_width = this_img.height;
		// 		var img_height = this_img.width;
  //           // console.log("image size ",img_width, img_height);
  //           $(".img_box").attr("height",this_img.height);
  //           $(".img_box").attr("width",this_img.width);
  //           $(".img_box").attr("margin","0 auto");
  //           }
        var folder = "data/"+ folder_name +"_exp/";
        document.getElementById("test_img").src=  folder+image_name;
        // document.getElementById("test_img").src= ".."+image_name;

        var folder_raw = "data/"+ "noall" +"_exp/";
        document.getElementById("raw_img").src=  folder_raw+image_name;
}


var ct = 0;
var str = "line"
var first_point;
var saved = 1;

var line = d3.line()
    .curve(d3.curveBasis);

var svg = d3.select("#img_box")
    .call(d3.drag()
        .container(function() { return this; })
        .subject(function() { var p = [d3.event.x, d3.event.y]; return [p, p]; })
        .on("start", dragstarted));

function dragstarted() {

	saved = 0;
	ct++;
	highlight_data.push([])

	xy0 = d3.mouse(this);                     
    first_point = xy0;

  var d = d3.event.subject,
      active = svg.append("path").datum(d)
      .attr("id", str.concat(ct) )
	  .attr("class","line")
      .style("stroke", inkColor)
      .style("opacity", 1)
      .style("stroke-width", 2 + "px")
      .style("stroke-linejoin", "round")
      .style("fill", function(){if (fill_checkbox == 1) return inkColor; else return "none"; })
      .style("fill-opacity",0.3),
      x0 = d3.event.x,
      y0 = d3.event.y;

  d3.event.on("drag", function() {
    var x1 = d3.event.x,
        y1 = d3.event.y,
        dx = x1 - x0,
        dy = y1 - y0;

    if (dx * dx + dy * dy > 20){
		d.push([x0 = x1, y0 = y1]);
        highlight_data[ct-1].push([x1,y1]);
    } 
    else d[d.length - 1] = [x1, y1];
    active.attr("d", line);
  });

	d3.event.on("end", function(){
		d.push(first_point);
        highlight_data[ct-1].push([first_point[0],first_point[1]]);
        // console.log(highlight_data)
        active.attr("d", line);
	});

}


    
// d3.select('#undo').on('click', function(){
//   ct--;
//   d3.select('path#'+str.concat(ct)).remove();
// });

d3.select('#clear').on('click', function(){
  d3.selectAll('path.line').remove();
  highlight_data = []
  ct =0;
});
    
var colorScale = d3.schemeCategory10; 
    colorAr = [0,1];

d3.select('#palette')
    .select('g')
  .selectAll('rect')
    .data(colorAr)
  .enter().append('rect')
    .attr('width', 10)
    .attr('height',10)
    .attr('x', function(d,i){
      return 22 * i;
    })
    .attr('fill', function(d){
      return colorScale(d);
    })
    .style('cursor','pointer')
    .on('click',function(d){
      changeColor(colorScale(d));
    });

  function changeColor(c){
    color = c.value;
    inkColor = color
  }

var rating = 0;

var r1;
var r2;
var r3;
var r4;
var r5;
var Value_radio;

function save_json(){  

          r1= document.getElementById("star-1");
          r2= document.getElementById("star-2");
          r3= document.getElementById("star-3");
          r4= document.getElementById("star-4");
          r5= document.getElementById("star-5");
          if(r1.checked) Value_radio=5;
          if(r2.checked) Value_radio=4;
          if(r3.checked) Value_radio=3;
          if(r4.checked) Value_radio=2;
          if(r5.checked) Value_radio=1;
   
         // Value_radio=  document.getElementById("star-1").value; 

	
	// for (var i=0;i<highlight_data.length;i++){
	results_json.push({image: imageName, value: Value_radio})// contour: i+1, points: highlight_data[i]})
	//console.log("Value",Value_radio);
	// }
	saved = 1;
}

function WriteFile(){
    
	save_json();

	var jsonContent = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results_json));
	var a = document.createElement('a');
	a.href = 'data:' + jsonContent;
	a.download = 'results_veri.json';
	a.innerHTML = 'End Study';
	a.click();
}

// function saveIt(){  
    
//     var csvContent = "data:text/csv;charset=utf-8,";
//     highlight_data.forEach(function(infoArray, index){   
//          dataString = infoArray.join(",");
//          csvContent += index < highlight_data.length ? dataString+ "\n" : dataString;
//     });
//     console.log(csvContent)
//     var encodedUri = encodeURI(csvContent);
//     var link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "Retraining_data.csv");
//     document.body.appendChild(link);  

//     link.click(); 
//     saved = 1;
// }

function getWidthOfText(txt, fontname, fontsize){
    if(getWidthOfText.c === undefined){
        getWidthOfText.c=document.createElement('canvas');
        getWidthOfText.ctx=getWidthOfText.c.getContext('2d');
    }
    getWidthOfText.ctx.font = fontsize + ' ' + fontname;
    return getWidthOfText.ctx.measureText(txt).width;
}

function tooltip(d){
	
	div1.style("background", function(){
			if (d.class == "med"){
				return "#1FC3B7"  // 00b390
			}else{
				return "#cff1c9"
			}
		})
		.transition()
		.duration(200)
		.style("opacity", 0.9)

		
	
	// if (d.class == "symp"){
	// 	classType = "Symptom feature"  
	// }else{
	// 	classType = "Medication feature"
	// }

	// featureType = d.type.toUpperCase().toString() + " type: ''" +  feature_table[d.feature] + "''" // "Feature type: " + d.type.toUpperCase();
	
	arr =  ["a" , "b ", "c"]  //[classType,featureType , "Contribution: "+ d.weight];  // feature_table[d.feature]
	 
	str = "          " +"&nbsp" + "<br/>" // + "Rules: " +  "          " +"&nbsp" + "<br/>""
	for (var j = 0 ; j < arr.length ; j++ ){
		
		str = str + "          " +"&nbsp" + arr[j] + "          " +"&nbsp" + "<br/>" + "          " +"&nbsp" 

	}

	div1.html(str)	
	
	if (d3.event.pageY < 200){
	div1.style("left", (d3.event.pageX - 120) + "px")
		.style("top", ((d3.event.pageY + 128 + (arr.length*20)) + "px"));
	}else{
	div1.style("left", (d3.event.pageX - 120) + "px")
		.style("top", ( d3.event.pageY - 128 - (arr.length*20) ) + "px");
	}

}

var colors = d3.scaleOrdinal(d3.schemeCategory10); 

var w_size = window,
    d_size = document,
    e_size = d_size.documentElement,
    g_size = d_size.getElementsByTagName('body')[0];
	
	d3.select(window).on('resize.updatesvg', updateWindow);
		var width = w_size.innerWidth || e_size.clientWidth || g_size.clientWidth;  
		var height = w_size.innerHeight || e_size.clientHeight || g_size.clientHeight; //

    margin = {top: 20, right: 50, bottom: 20, left: 50};

	var list_x = 50
	var list_y = 100
	var	list_width = 230
	var	list_height = 600
	var clearance = 50
	var explanation_x = 100
	var explanation_y = 60
	var explanation_height = 300
	var explanation_width = 580
	var frame_height = height - 100
	var result_height = 100


	// var highlighter = d3.select("#img_box")
	// 						.append('rect')
	// 					    .attr('x', 0)
	// 					    .attr('y', 0)
	// 					    .attr('width', 224)
	// 					    .attr('height', 224)
	// 					    .style('fill', 'white')
	// 					    .call(draw)   // Line highlighter


	//var explanation_title = d3.select("#panel").append("g").append("text").attr("class","explanation_title")
	//		  .style("font-weight", "bold")
	//		  .style("font-size", "15px")
	//		  .style("font-family","Viga")
	//		  .text("Please rate how fine is the highlighted area of this image to explain the object in this image.")
	//		  .attr('dy','0.35em')
	//		  .attr("x", explanation_x)
	//		  .attr("y", explanation_y);

	// var explanation_frame = svg.append("g").append("rect").attr("class","explanation_frame")
	// 				.attr("x", explanation_x)
	// 				.attr("y", explanation_y)
	// 				.attr("rx", 5)
	// 				.attr("ry", 5)
	// 				.attr("width", explanation_width)
	// 				.attr("height", explanation_height)
	// 				.attr("fill", "white")
	// 				.style("fill-opacity",0.8)
	// 				.style("stroke","gray")
	// 				.style("stroke-opacity",0.5);

// start_over();
txtfilename();
// updateWindow();

function updateWindow(){
							 
		chart_x = w_size.innerWidth || e_size.clientWidth || g_size.clientWidth; 
		chart_y = w_size.innerHeight || e_size.clientHeight || g_size.clientHeight; 
		
		
		width = chart_x * 0.8;

		explanation_width = width * 0.8;
		explanation_x = width * 0.09;
	
		// svg.attr("width", width);
		// svg.attr("height", height).attr("x", explanation_x);

		// explanation_frame.attr("width", explanation_width)
		// 				.attr("x", explanation_x)
		// 				.attr("y", explanation_y);

		// explanation_title.attr("x", explanation_x)
		// 				.attr("y", explanation_y - 20);
		
		// svg.selectAll(".explanation_frame").attr("height", height); //(3*next_line + line_counter * next_line));
		// svg.attr("height", height + 100); //y_pos
		// showText(1);
	}
	