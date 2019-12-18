$(document).ready(function(){

	$.get("http://localhost:3000/artist", function(data, status){

		const jsonDataArtists= JSON.parse(data);

		for (var i =0;i<jsonDataArtists.lenght;i++){

			$("#performer").append(
			`
			<div class="col-md-4 col-6 mb-4">   
				<a href="singleartist.html">  
					<img src="" class="imagesArtist">                   
				</a> 
				<div class="artista">
					<h5>
						<b>${jsonDataArtists[i].name}</b>
					</h5>
				</div>
				<h7 class="type"><i>
					<b>${jsonDataArtists[i].type}</b>
					</i>
				</h7>
			</div> 
			`
		);
		}
	});
});