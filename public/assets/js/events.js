//global varible
let evCout = true;
let seCout = true;
let textArray=[];
let typeArray=[];
let countArray=[];

//get parameter from URL
function getUrlParameterValue(url, parameter) {
    var questionSplit = url.split('?');
    questionSplit.shift();
    var onlyParameters = questionSplit.join('?');
    var splittedParameters = onlyParameters.split('&');
    var found = false;
    var value = null;
    for (var c = 0; c < splittedParameters.length; c++) {
        var parts = splittedParameters[c].split('=');
        if (parts[0] == parameter) {
            value = parts[1];
            if (value.trim()== '') {
                found = false;
            } else {
                found = true;
            }
        }
        if (found) {
            return value;
        }
    }
    if (!found) {
        return false;
    }
}

//change state from true to false
function changeState(val) {
	if(val){
		val=false;
	} else {
		val=true;
	}
	return val;
}

//function by changing state if the button
function eventBtn() {
	
	if(evCout){
		$('#eventBtn').removeClass('btn btn-primary').addClass('btn btn-primary disabled ');
		$('.events').hide();
	} else {
		$('#eventBtn').removeClass('btn btn-primary disabled').addClass('btn btn-primary');
		$('.events').show();
	}
	evCout= changeState(evCout);
}

function seminarBtn() {

	if(seCout){
		$('#seminarBtn').removeClass('btn btn-secondary').addClass('btn btn-secondary disabled ');
		$('.seminars').hide();
	} else {
		$('#seminarBtn').removeClass('btn btn-secondary disabled').addClass('btn btn-secondary');
		$('.seminars').show();
	}
	seCout = changeState(seCout);
}


//<a href="singleartist.html?id=${Artist.artist._id}">  

//ready get data from API adn populate DOM
$(document).ready(function(){

	var Artists;
	var Events;
	var Seminars;

	$.get("https://hypermedia19.herokuapp.com/event", function(data, status){

		Events=JSON.parse(data);

		$.get("https://hypermedia19.herokuapp.com/artist",function(data,status){

			Artists=JSON.parse(data);

			$.get("https://hypermedia19.herokuapp.com/seminar",function(data,status){

				Seminars=JSON.parse(data);

				//append event
				for(var i=0;i<Events.events.length;i++){
					var nameArtist;
					for(var j=0;j<Artists.artists.length;j++){
						if(Artists.artists[j]._id==Events.events[i].artistId){
							nameArtist=Artists.artists[j].name;
						}
					};

					$("#events").append(
						`
						<div class="col-sm-12 col-md-6 col-lg-4 events" id="${Events.events[i].type}">
							<a href="singleevent.html?id=${Events.events[i]._id}">  
								<img src="../images/${Events.events[i].photoGallery[0].filename}"class="imagesArtist">                   
							</a> 
							<div>
								<h5><b>${Events.events[i].name}</b></h5>
							</div>
							<div>
								<h7><i><b>${nameArtist}</b></i></h7>
							</div>
							<div>
								<h7><i><b>${Events.events[i].type}</b></i></h7>    
							</div>  
							<div>
								<h7><i><b>${Events.events[i].date}</b></i></h7>
							</div>
						</div>
						`
					);
					//add type in the array
					if (!typeArray.includes(Events.events[i].type)) {
						typeArray.push(Events.events[i].type);
						countArray.push(true);
						textArray.push(Events.events[i].type+"Btn");
					}
				}
				console.log(typeArray);
				console.log(countArray);
				console.log(textArray);
				
				//append seminar
				for(var k=0;k<Seminars.seminars.length;k++){
					var split= Seminars.seminars[k].photoGallery.split("\\");
					var url= split[2]+ "\\"+split[3];
					$("#events").append(
						`
						<div class="col-sm-12 col-md-6 col-lg-4 seminars">
							<a href="singleseminar.html?id=${Seminars.seminars[k]._id}">  
								<img src="../${url}"class="imagesArtist">                   
							</a> 
							<div>
								<h5><b>${Seminars.seminars[k].name}</b></h5>
							</div>
							<div>
								<h7><i><b>seminar</b></i></h7>
							</div>
							<div>
							<h7><i><b>${Seminars.seminars[k].date}</b></i></h7>
							</div>
						</div>
						`
					);
				}

				//check for initial filter
				var value=getUrlParameterValue(self.location.href,"value");
				
				if(value=="seminar"){
					eventBtn();
				} else if(value=="event"){
					seminarBtn();
				}

				//populte row button with type
				typeArray.forEach(element => {
					$("#buttonRow").append(
						`
						<button type="button" class="btn btn-danger" id="${element}Btn">${element}</button>
						`
				);
				});
			});
		});
	});
});

//observe for update the DOM
let cEvent = false;
let cSeminar = false;
var observer = new MutationObserver(function(mutations, observer) {
	var ev = document.getElementsByClassName("events");
	var sem = document.getElementsByClassName("seminars");
	//check empty event
	for (let i = 0; i < ev.length; i++) {
		const evEl = ev[i];
		if(evEl.style.display==="none"){
			cEvent=true;
		} else {
			cEvent = false;
			break;
		}
	}
	//check empty seminar
	for (let k = 0; k < sem.length; k++) {
		const semEl = sem[k];
		if(semEl.style.display==="none"){
			cSeminar=true;
		} else {
			cSeminar = false;
			break;
		}
	}
	//check for no data
	if(cEvent && cSeminar){
		$("#events").append(
			`
			<div class="col-12 mt-5 mb-5" id="noData" align="center">
				<h3><i>No data</i></h3>
			</div>
			`
		);
	} else {
		$("#noData").remove();
	}
});

//observe for update the DOM in all subTree
observer.observe(document, {
	subtree: true,
	attributes: true
  });

//filter button
//EVENT
$( "#eventBtn" ).click (function() {
	eventBtn();
});
//SEMINAR
$( "#seminarBtn" ).click(function() {
	seminarBtn();
});

/*
$( document ).on("click",text,function() {
	console.log("ciao");
});

*/



