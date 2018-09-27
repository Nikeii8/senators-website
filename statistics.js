$(function () {

    var data;
    var members;
    var url;



    if (window.location.pathname == "/Attendance-Senate.html" ||
        window.location.pathname == "/PartyLoyalty-senate.html") {
        url = "https://nytimes-ubiqum.herokuapp.com/congress/113/senate";

    }

    if (window.location.pathname == "/Attendance-House.html" ||
        window.location.pathname == "/PartyLoyalty-House.html") {
        url = "https://nytimes-ubiqum.herokuapp.com/congress/113/house";
    }

    $.getJSON(url, function (json) {

        data = json;
        members = data.results[0].members;

        console.log(data);
        memberParty();
        calculateStatistic()




    });




    var statistics = {
        "number_of_republicans": 0,
        "number_of_democrats": 0,
        "number_of_independents": 0,
        "total_representatives": 0,
        "votes_party_republicans": 0,
        "votes_party_democrats": 0,
        "votes_party_independets": 0,
        "total_votes_party": 0,

        "votes_party_prc_house": [
            {

                fullName: "",
                total_votes: 0,
                votes_with_party_pct: 0,
	}
	],

        "votes_party_prc_senate": [
            {
                fullName: "",
                total_votes: 0,
                votes_with_party_pct: 0,

		}
	],

        "least_engaged_names": [
            {
                fullName: "",
                missedVotes: 0,
                missedVotesPct: 0,
	}
		],
        "most_engaged_names": [

            {
                fullName: "",
                missedVotes: 0,
                missedVotesPct: 0,

	}
],
    }
    var dem = [];
    var ind = [];
    var rep = [];

    function memberParty() {


        for (var i = 0; i < members.length; i++) {

            var currentMember = members[i];

            if (currentMember.party == "R") {
                rep.push(currentMember);

            } else if (currentMember.party == "D") {
                dem.push(currentMember);
            } else {
                ind.push(currentMember);
            }
        }
    }
    /*
    FUNCTION TO HOLD THE STATISTIC PARAMETERS
    */



    function calculateStatistic() {

        statistics.number_of_republicans = rep.length;
        statistics.number_of_democrats = dem.length;
        statistics.number_of_independents = ind.length;
        statistics.total_representatives = statistics.number_of_democrats + statistics.number_of_independents + statistics.number_of_republicans;


        statistics.votes_party_republicans = totalAveragesVotes(rep);
        statistics.votes_party_democrats = totalAveragesVotes(dem);
        statistics.votes_party_independets = totalAveragesVotes(ind);
        statistics.total_votes_party = totalAveragesVotes(members);

        var lazyMembers = getLazy(members);
        statistics.least_engaged_names = getSmallAttendanceMember(lazyMembers);


        var activeMembers = getActive(members);
        statistics.most_engaged_names = getSmallAttendanceMember(activeMembers);

        var loyal = getLoyal(members);
        statistics.votes_party_prc_house = getSmallAttendanceMember2(loyal);

        var disloyal = getLessLoyal(members);
        statistics.votes_party_prc_senate =
            getSmallAttendanceMember2(disloyal);

        if ($("body").attr("data-page") == "attensenate") {
            createTable1();
            createTable2();
            createTable3();


        } else if ($("body").attr("data-page2") == "dis-loyal") {
            createTable4();
            createTable5();
            createTable6();
            createTable1();
        }


        getSmallAttendanceMember(dem);
    }




    function totalAveragesVotes(membersArray) {
        var total = 0;
        for (var i = 0; i < membersArray.length; i++) {

            var currentMember = membersArray[i];

            total = total + Number(currentMember.votes_with_party_pct);

        }

        var avg = total / membersArray.length;

        return (avg.toFixed(2));
    }


    /*
    ENGAGEMENT TABLE
    */


    function getSmallAttendanceMember(membersArray) {

        var smallMembers = [];

        for (var i = 0; i < membersArray.length; i++) {
            var neededData = {
                fullName: "",
                missedVotes: 0,
                missedVotesPct: 0
            };

            neededData.fullName =
                membersArray[i].first_name + " ";
            if (membersArray[i].middle_name != null) {
                neededData.fullName += membersArray[i].middle_name + " ";
            }
            neededData.fullName += membersArray[i].last_name;

            neededData.missedVotes = membersArray[i].missed_votes;

            neededData.missedVotesPct =
                membersArray[i].missed_votes_pct;

            smallMembers.push(neededData);

        }
        return (smallMembers);

    }


    /*
    LOYALTY TABLE
    */

    function getSmallAttendanceMember2(membersArray) {

        var smallMembers = [];

        for (var i = 0; i < membersArray.length; i++) {
            var neededData = {
                fullName: "",
                totalVotes: 0,
                votes_with_party_pct: 0
            };

            neededData.fullName =
                membersArray[i].first_name + " ";
            if (membersArray[i].middle_name != null) {
                neededData.fullName += membersArray[i].middle_name + " ";
            }
            neededData.fullName += membersArray[i].last_name;

            neededData.totalVotes = +membersArray[i].total_votes - +membersArray[i].missed_votes;

            neededData.votes_with_party_pct =
                membersArray[i].votes_with_party_pct;

            smallMembers.push(neededData);

        }
        return (smallMembers);

    }

    /*
    WORST VOTERS
    */

    function getLazy(membersArray) {

        membersArray.sort(function (a, b) {
            return b.missed_votes - a.missed_votes;
        });

        var lazy = [];

        for (var i = 0; i < membersArray.length; i++) {

            var unpro = membersArray[i];

            if (i < (membersArray.length * 0.10)) {
                lazy.push(unpro);
            }

        }

        return lazy;

    }

    /*
    BEST VOTERS
    */

    function getActive(membersArray) {

        membersArray.sort(function (a, b) {
            return a.missed_votes - b.missed_votes;
        });

        var active = [];

        for (var i = 0; i < membersArray.length; i++) {

            var pro = membersArray[i];

            if (i < (membersArray.length * 0.10)) {
                active.push(pro);
            }

        }


        return active;
    }

    /*
    MOST LOYAL
    */
    function getLoyal(membersArray) {

        membersArray.sort(function (a, b) {
            return a.votes_with_party_pct - b.votes_with_party_pct;
        });

        var loyal = [];

        for (var i = 0; i < membersArray.length; i++) {

            var pro = membersArray[i];

            if (i < (membersArray.length * 0.10)) {
                loyal.push(pro);
            }

        }


        return loyal;
    }

    /*
    LESS LOYAL
    */

    function getLessLoyal(membersArray) {

        membersArray.sort(function (a, b) {
            return b.votes_with_party_pct - a.votes_with_party_pct;
        });

        var lessLoyal = [];

        for (var i = 0; i < membersArray.length; i++) {

            var pro = membersArray[i];

            if (i < (membersArray.length * 0.10)) {
                lessLoyal.push(pro);
            }

        }

        console.log(lessLoyal);
        return lessLoyal;
    }

    /*
    TABLES AND GRAPHS
    */

    function createTable1() {
        var table = document.getElementById("info");
        var myInnerHtml = "";

        myInnerHtml += "<tr>";
        myInnerHtml += "<td>Democrats</td>";
        myInnerHtml += "<td>" + statistics.number_of_democrats + "</td>";
        myInnerHtml += "<td>" + statistics.votes_party_democrats + "</td>";
        myInnerHtml += "</tr>";

        myInnerHtml += "<tr>";
        myInnerHtml += "<td>Republicans</td>";
        myInnerHtml += "<td>" + statistics.number_of_republicans + "</td>";
        myInnerHtml += "<td>" + statistics.votes_party_republicans + "</td>";
        myInnerHtml += "</tr>";

        myInnerHtml += "<tr>";
        myInnerHtml += "<td>Independents</td>";
        myInnerHtml += "<td>" + statistics.number_of_independents + "</td>";
        myInnerHtml += "<td>" + statistics.votes_party_independets + "</td>";
        myInnerHtml += "</tr>";

        myInnerHtml += "<tr>";
        myInnerHtml += "<td>Total</td>";
        myInnerHtml += "<td>" + statistics.total_representatives + "</td>";
        myInnerHtml += "<td>" + statistics.total_votes_party + "</td>";
        myInnerHtml += "</tr>";






        table.innerHTML = myInnerHtml;

    }

    function createTable2() {
        var table = document.getElementById("info2");
        var myInnerHtml = "";

        for (var i = 0; i < statistics.least_engaged_names.length; i++) {

            myInnerHtml += "<tr>";
            myInnerHtml += "";

            myInnerHtml += "<td><a href = '  ' >" + statistics.least_engaged_names[i].fullName + "</a></td>";

            myInnerHtml += "<td>" + statistics.least_engaged_names[i].missedVotes + "</td>";

            myInnerHtml += "<td>" + statistics.least_engaged_names[i].missedVotesPct + "</td>";




            myInnerHtml += "</tr>";

        }
        table.innerHTML = myInnerHtml;

    }

    function createTable3() {
        var table = document.getElementById("info3");
        var myInnerHtml = "";

        for (var i = 0; i < statistics.most_engaged_names.length; i++) {

            myInnerHtml += "<tr>";
            myInnerHtml += "";

            myInnerHtml += "<td><a href = '  ' >" + statistics.most_engaged_names[i].fullName + "</a></td>";

            myInnerHtml += "<td>" + statistics.most_engaged_names[i].missedVotes + "</td>";

            myInnerHtml += "<td>" + statistics.most_engaged_names[i].missedVotesPct + "</td>";



            myInnerHtml += "</tr>";

        }
        table.innerHTML = myInnerHtml;

    }

    /*
    LOYALTY TABLES
    */

    /*
    MOST
    */

    function createTable4() {
        var table = document.getElementById("info4");
        var myInnerHtml = "";

        for (var i = 0; i < statistics.votes_party_prc_senate.length; i++) {

            myInnerHtml += "<tr>";
            myInnerHtml += "";

            myInnerHtml += "<td><a href = '  ' >" + statistics.votes_party_prc_senate[i].fullName + "</a></td>";

            myInnerHtml += "<td>" + statistics.votes_party_prc_senate[i].totalVotes + "</td>";

            myInnerHtml += "<td>" + statistics.votes_party_prc_senate[i].votes_with_party_pct + "</td>";



            myInnerHtml += "</tr>";

        }
        table.innerHTML = myInnerHtml;

    }



    function createTable5() {
        var table = document.getElementById("info4");
        var myInnerHtml = "";

        for (var i = 0; i < statistics.votes_party_prc_house.length; i++) {

            myInnerHtml += "<tr>";
            myInnerHtml += "";

            myInnerHtml += "<td><a href = '  ' >" + statistics.votes_party_prc_house[i].fullName + "</a></td>";

            /*
            USE (((totalVotes))) instead of total_votes.
            */

            myInnerHtml += "<td>" + statistics.votes_party_prc_house[i].totalVotes + "</td>";

            myInnerHtml += "<td>" + statistics.votes_party_prc_house[i].votes_with_party_pct + "</td>";



            myInnerHtml += "</tr>";

        }
        table.innerHTML = myInnerHtml;

    }

    /*
    LEAST
    */

    function createTable6() {
        var table = document.getElementById("info5");
        var myInnerHtml = "";

        for (var i = 0; i < statistics.votes_party_prc_senate.length; i++) {

            myInnerHtml += "<tr>";
            myInnerHtml += "";

            myInnerHtml += "<td><a href = '  ' >" + statistics.votes_party_prc_senate[i].fullName + "</a></td>";

            /*
            USE (((totalVotes))) instead of total_votes.
            */

            myInnerHtml += "<td>" + statistics.votes_party_prc_senate[i].totalVotes + "</td>";

            myInnerHtml += "<td>" + statistics.votes_party_prc_senate[i].votes_with_party_pct + "</td>";



            myInnerHtml += "</tr>";

        }
        table.innerHTML = myInnerHtml;

    }

});
