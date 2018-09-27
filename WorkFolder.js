var data;

/* 
Creating global variable for URL
*/
var url;

/* 
Using the window.location to find the specific pathway to the files I need
*/
if (window.location.pathname == "/senate-data.html") {
	url = "pro-congress-113-senate.json";
}

if (window.location.pathname == "/house-data.html") {
	url = "pro-congress-113-house.json";
}


$.getJSON(url, function (json) {


	/*
	Sinaling that data equals to json from this point
	*/
	data = json;



	start();


});


function start() {
	$("#boxR").on("change", bothFilters);
	$("#boxD").on("change", bothFilters);
	$("#boxI").on("change", bothFilters);
	$("#stateBox").on("change", bothFilters);

	

	createTable();
}

function bothFilters() {
	var partyArray = [];
	$("#checkboxes input").each(function () {
		if ($(this).is(":checked")) {
			partyArray.push($(this).val());
		}
	});

	var stateArray = [];
	$("#stateBox option").each(function () {
		if ($(this).is(":checked")) {
			stateArray.push($(this).val());
		}
	});


	$("#info tr").each(function () {
		var party = $(this).find('.party').text();
		var state = $(this).find('.state').text();

		if (
			(partyArray.includes(party) == true || partyArray.length == 0) &&
			(stateArray.includes(state) == true || stateArray.includes("All") == true)
		) {
			$(this).show();
		} else {
			$(this).hide();
		}
	});
}









//$("input[name='filterStatus']").on("change", updateUI);

function createTable() {
	var table = document.getElementById("info");
	var myInnerHtml = "";

	for (var i = 0; i < data.results[0].members.length; i++) {
		myInnerHtml += dataRow(data.results[0].members[i]);
	}

	table.innerHTML = myInnerHtml;
}


function dataRow(member) {
	var organizer = "";


	organizer += "<tr>";

	organizer += "<td><a href = " + member.url + " >" + member.first_name + " ";

	if (member.middle_name != null) {
		organizer += member.middle_name + " ";
	}

	organizer += member.last_name + "</a></td>";
	//organizer += "<td class='party " + member.party + "'>" + member.party + "</td>";
	organizer += "<td class='party'>" + member.party + "</td>";
	organizer += "<td class='state'>" + member.state + "</td>";
	organizer += "<td>" + member.seniority + "</td>";
	organizer += "<td>" + member.votes_with_party_pct + "%" + "</td>";

	organizer += "</tr>";

	return organizer;
}
