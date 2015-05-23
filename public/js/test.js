window.onload = function(){

	$("#btn").click(function(){
		$.ajax({
			type:'GET',
			url:'http://localhost:3030/punchcard',
			success: function(data){
				alert(data.length);
				console.log(data)
			}
		})
	})
}
