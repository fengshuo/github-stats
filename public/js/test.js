window.onload = function(){
	
	$("#btn").click(function(){
		$.ajax({
			type:'GET',
			url:'http://localhost:3030/repos',
			success: function(data){
				alert(data.length);
				console.log(data)
			}
		})
	})
}
