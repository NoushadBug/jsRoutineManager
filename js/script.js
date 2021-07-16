var adoptData = JSON.parse(localStorage.getItem("reminderList"));

let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
// initiate layout and plugins
let d = new Date();
let today = days[d.getDay()];
let currentMonth = ("0" + (d.getMonth() + 1)).slice(-2);
let currentDate = ("0" + d.getDate()).slice(-2);
let currentYear = d.getFullYear();
let tomorrow = days[d.getDay() + 1];
let timeNow = formatAMPM(d);
let upcomingClassTime;
let upcomingClass;
let counterText;
let blinker = ":";
let unclicked = true;
let danger = true;
let alarm = false;
let skipped = false;
let tomorrowClicked = false;
let viewClicked = false;
let filterClicked = false;
let todayDate;
diffArr = [], classesDoneArr = [], courseArr = [], idArr = [], classHrMinFrmt = [];

let textTitle = document.getElementById("page-title");
textTitle.innerHTML = "Today is " + today + ", Time is: " + timeNow;

if (localStorage.getItem("date") != d.toDateString()) {
    var reminderList = localStorage.getItem("reminderList");
    localStorage.clear();
    localStorage.setItem("reminderList", reminderList);
}

localStorage.setItem("date", d.toDateString());
var oldNoticeIds = [];
let tableData = document.querySelectorAll(".gradeX");
let tableHead = document.querySelectorAll("#sample_1")[0];
let upcomingContext = document.querySelector("#upcoming");
let counterContext = document.querySelector("#countdown");
let refreshButton = document.getElementById("creater");
// set reminder code
let remindTitle = document.getElementById("title");
let remindDate = document.getElementById("date");
let remindTime = document.getElementById("time");
let remindDesc = document.getElementById("description");
let remindNum = document.getElementById("number");
let submitBtn = document.getElementById("submitBtn");
let remind = document.getElementById("remind");
let modaldiv = document.querySelector(".modaldiv");
let overlay = document.querySelector(".overlay");
let closeBtn = document.querySelector(".close");
let closeConfirm = document.getElementById("closeConfirm");
let remindDiv = document.querySelector(".reminderNotice");
let yesBtn = document.getElementById("yesBtn");
let noBtn = document.getElementById("noBtn");
let upComing = document.getElementById("upcomingNotice");
let oldNoticeBtn = document.getElementById("toogleNotice");
let filterBtn = document.getElementById("filterBtn");
let RemindObj;

remind.addEventListener("click", function (e) {
    e.preventDefault();

    modaldiv.classList.remove("hideModal");
    overlay.classList.remove("hideModal");
});
closeBtn.addEventListener("click", function (e) {
    e.preventDefault();

    modaldiv.classList.add("hideModal");
    overlay.classList.add("hideModal");
});

// reset all
var resetAll = function () {
    localStorage.setItem("reminderList", "[]");
    $(".wrapperNotifi").empty();
    $(".wrapperExam").empty();
};

closeConfirm.addEventListener("click", function (e) {
    e.preventDefault();

    $(".confirmModal").addClass("hideModal");
    overlay.classList.add("hideModal");
});
noBtn.addEventListener("click", function (e) {
    e.preventDefault();

    $(".confirmModal").addClass("hideModal");
    overlay.classList.add("hideModal");
});

// colorize table while filtering
function colorizeTable() {
    tableData = document.querySelectorAll(".gradeX");
    var i = 0;
    tableData.forEach(function (item) {
        if (item.style.display != "none") {
            if (i % 2 == 0) { item.style.background = "#E6E6E6" }
            else {
                item.style.background = "transparent"
            }
            i++;
        }
    });
    console.log('test')
}

// delete Modal functionality
var deleteModal = function (deleteIndex) {
    // confirmation modal
    $(".confirmModal").removeClass("hideModal");
    overlay.classList.remove("hideModal");
    yesBtn.addEventListener("click", function () {
        $(".confirmModal").addClass("hideModal");
        overlay.classList.add("hideModal");
        adoptData = JSON.parse(localStorage.getItem("reminderList"));
        adoptData = adoptData.filter((item, i) => i !== deleteIndex);
        localStorage.setItem("reminderList", JSON.stringify(adoptData));
        createCards(false, false);
    });
};

// clear all old notifications
clearAll.addEventListener("click", function () {
    adoptData = JSON.parse(localStorage.getItem("reminderList"));

    adoptData = adoptData.filter((item, i) => !oldNoticeIds.includes(i));
    console.log(adoptData);

    localStorage.setItem("reminderList", JSON.stringify(adoptData));
    createCards(true, true);
});

// card create

var createCards = function (decision, decision2) {
    oldNoticeIds = [];

    $(".wrapperNotifi").empty();
    $(".wrapperExam").empty();
    if (decision2 == true) {
        $("#clearAll").removeClass("hideModal");

        upComing.textContent = "🔔 Old Notices 🔔";

        oldNoticeBtn.textContent = "Upcoming Notices";

        var funcDef = $("#oldNoticebtn").attr("onclick");

        var params = funcDef.split("createCards(")[1];

        params = params.replace(", true)", "");
        console.log(params);

        console.log(!params);
        $("#oldNoticebtn").attr(
            "onclick",
            `createCards(${params == "true" ? "false" : "true"}, true)`
        );
    }
    adoptData = JSON.parse(localStorage.getItem("reminderList"));

    adoptData.forEach(function (element, i) {
        console.log(i);
        // object array er examdate gula re date object e convert from string
        var examDate = new Date(element.date);
        // current date object subtract to notify date
        var notifDate = new Date(examDate.getTime());

        notifDate = notifDate.setDate(notifDate.getDate() - element.notify);

        // format the string time to 12 hour Am/pm time

        // current notice functionality
        if (
            todayDate.getTime() >= notifDate &&
            todayDate.getTime() < examDate.getTime()
        ) {
            if (decision == false) {
                $("#clearAll").addClass("hideModal");

                upComing.textContent = "🔔 Upcoming Notices 🔔";

                oldNoticeBtn.textContent = "Old Notices";

                var timeLeft = examDate.getTime() - todayDate.getTime();
                days = timeLeft / (60 * 60 * 24 * 1000);
                var notificationDiv = `<div class="row col-12 reminderNotice list container  ml-2 mt-2 "  id="${i}">

                <div class="col-6 m-auto p-0 wrapText">
                <span>📝 ${element.title}</span>
                </div>
                <div class="col-3 m-auto p-0 ">
                <span>🔔 ${days} day left </span>
                </div>
                <div class="col-3 m-auto">
                <i class="fa fa-trash-o mx-2" onclick = deleteModal(${i})></i>
                <i class="fa fa-pencil mx-2 " data-toggle="modal" data-target="#exampleModal${i}"  onclick= updateModal(${i})></i>
                </div>
                </div>`;
                $(notificationDiv).appendTo(".wrapperNotifi");

                console.log(days + " day(s) remaining");
            }
        }
        // current exam reminder functionality
        if (todayDate.getTime() == examDate.getTime()) {
            //  modal + div bar
            var examReminder = `<div class="container col-12 row list examRemind ml-2 mt-2 " >
            <div class="col-6 p-0 m-auto wrapText">
                <span>📝${element.title}</span>
                </div>
                <div class="col-3 p-0 m-auto ">
                <span>🕒 ${tConvert(element.time)}</span>
                </div>
                <div class="col-3 m-auto ">
                <i class="fa fa-trash-o mx-2" onclick = deleteModal(${i})></i>
                <i class="fa fa-pencil mx-2 " data-toggle="modal" data-target="#exampleModal${i}" onclick = updateModal(${i})></i>
                </div>
            </div>`;
            $(examReminder).appendTo(".wrapperExam");
        }

        if (
            todayDate.getTime() != examDate.getTime() &&
            !(
                todayDate.getTime() >= notifDate &&
                todayDate.getTime() < examDate.getTime()
            )
        ) {
            oldNoticeIds.push(i);

            if (decision == true) {
                // old notice functionality
                var oldNotices = `<div class="row col-12 reminderNotice text-left list container  ml-2 mt-2 "  id="${i}"><div class="col-5 m-auto p-0 wrapText">
        <span>📝 ${element.title}</span></div><div class="col-4 m-auto p-0">
        <span>📅 ${element.date}</span></div><div class="col-3 m-auto">
        <i class="fa fa-trash-o mx-2" onclick = deleteModal(${i})></i>
        <i class="fa fa-pencil mx-2 " data-toggle="modal" data-target="#exampleModal${i}"  onclick= updateModal(${i})></i>
        </div>
        </div>`;
                $(oldNotices).appendTo(".wrapperNotifi");
            }
        }

        // old notice delete functionality
    });
};

submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    // at first check if localstorage has any data or not
    adoptData = JSON.parse(localStorage.getItem("reminderList"));
    RemindObj = {
        title: remindTitle.value,
        date: remindDate.value,
        time: remindTime.value,
        desc: remindDesc.value,
        notify: remindNum.value,
    };

    // if data is available then we will create another object and oush it to array then set the whole array to localstorage
    if (adoptData) {
        console.log("first condition");
        // adopdata is a array of object here

        adoptData.push(RemindObj);
        localStorage.setItem("reminderList", JSON.stringify(adoptData));
    }
    // if not then also same functionality
    else {
        console.log("second condition");
        localStorage.setItem("reminderList", JSON.stringify([RemindObj]));
    }

    modaldiv.classList.add("hideModal");
    overlay.classList.add("hideModal");
    remindTitle.value = "";
    remindDate.value = "";
    remindTime.value = "";
    remindDesc.value = "";
    remindNum.value = "";
    createCards(false, false);
});

// test
function tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
        time,
    ];

    if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
}

// stylize Clicked Btn
$('.nav-link').click(
    function () {
        $('.nav-link').removeClass('clickedBtn');
        $(this).addClass('clickedBtn');
    })

var updateModal = function (clickIndex) {
    adoptData = JSON.parse(localStorage.getItem("reminderList"));

    console.log(clickIndex);
    $(`<!-- Modal -->
    <div class="modal fade" id="exampleModal${clickIndex}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header justify-content-center">
            <h5 class="modal-title" id="exampleModalLabel">✏️Edit Your Reminder✏️</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          <label>Title</label>
          <input id="title" class="form-control" type="text" value = "${adoptData[clickIndex].title}">
            <label for="password1">Select Date</label>
          <input id="date" class="form-control" type="date" value = "${adoptData[clickIndex].date}">
            <label for="password1">Select Time</label>
          <input id="time" class="form-control" type="time" value = "${adoptData[clickIndex].time}">
            <label for="password1">Description</label>
          <textarea class="form-control" id="description" rows="2" placeholder="write something...">${adoptData[clickIndex].desc}</textarea>
            <label for="password1">Set Notification</label>
          <input type="number" class="form-control" id="number" min="1" max="100" value = "${adoptData[clickIndex].notify}"
              placeholder="set remaining day number">
          </div>
          <div class="modal-footer justify-content-center">
          <button type="submit" class="btn btn-secondary rounded-pill col-md-12 shadow-lg " data-dismiss="modal" id="submitButton">Submit</button>
          </div>
        </div>
      </div>
    </div>`).appendTo("body");

    var Subbtn = document.querySelector(
        `#exampleModal${clickIndex} #submitButton`
    );
    Subbtn.addEventListener("click", function (e) {
        e.preventDefault();
        adoptData = JSON.parse(localStorage.getItem("reminderList"));

        RemindObj = {
            title: document.querySelector(`#exampleModal${clickIndex}  #title`).value,
            date: document.querySelector(`#exampleModal${clickIndex} #date`).value,
            time: document.querySelector(`#exampleModal${clickIndex} #time`).value,
            desc: document.querySelector(`#exampleModal${clickIndex} #description`)
                .value,
            notify: document.querySelector(`#exampleModal${clickIndex} #number`)
                .value,
        };
        adoptData[clickIndex] = RemindObj;
        console.log(RemindObj);
        localStorage.setItem("reminderList", JSON.stringify(adoptData));

        createCards(false, false);
    });
};

$(function () {
    filterBtn.click();
    var browserName = bowser.getParser(navigator.userAgent).getResult()
        .browser.name;
    if (browserName == "Microsoft Edge") {
        $("a").each(function () {
            var link = $(this).attr("href");
            var updatedLink = link.split("authuser=")[0] + "authuser=3";
            $(this).prop("href", updatedLink);
        });
    }

    if (/Mobi|Android/i.test(navigator.userAgent)) {
        // var link
        $("a").each(function () {
            if ($(this).attr("href").indexOf("meet.google.com") > -1) {
                $(this).prop("href", $(this).attr("href").split("?")[0]);
            }
        });

        $("a").on("click", function (event) {
            var result;
            var link = $(this).attr("href");
            //result = (link.split()
            if ($(this).attr("href").indexOf("meet.google.com") > -1) {
                var tempLink = link.split("?")[0];
                $(this).prop("href", tempLink);
                var myLink = $(this).attr("href").split("https://meet.google.com/")[1];
                result = copyToClipboard(myLink);
            } else {
                result = copyToClipboard($(this).attr("href"));
            }
        });
    }

    $("#myInput").on("keyup", function () {
        if (!$(".button").length) {
            var $clearButton = $(
                '<button id="clear" class="button"><i class="fa fa-times" aria-hidden="true"></i></button>'
            );
            $clearButton.insertAfter($("#myInput"));

            $(".button").click(function () {
                $("#myInput").val("");
                $("#tbody tr").filter(function () {
                    $(this).toggle();
                });
                $(".button").remove();
                $("#myInput").focus();
                tableData.forEach(function (item) {
                    $(item).css("display", "table-row");
                })
                colorizeTable()
            });
        }
        if ($(this).val().length == 0) {
            $(".button").remove();
        }
        var value = $(this).val().toLowerCase();
        $("#tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            colorizeTable()
        });
    });

    console.log("hi ready");
    todayDate = currentYear + "-" + currentMonth + "-" + currentDate;
    // string to date object
    todayDate = new Date(todayDate);

    // card made function

    createCards(false, false);
});

// filter search button function
$("#filterNotice").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $(".list").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});

function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);
    } else if (
        document.queryCommandSupported &&
        document.queryCommandSupported("copy")
    ) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy"); // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

filter(true);

window.setInterval(function () {
    let update = new Date();
    textTitle.innerHTML =
        "Today is " + today + ", Time is: " + formatAMPM(update);
    upcomingPainter();
    alarmer(alarm);
    if (tomorrowClicked) classTime(filter(false));
    if (viewClicked) viewAll(true);
}, 5000);

classTime(filter(true));

function filter(compDay) {
    $(".tableDiv h5").remove();
    document.querySelector('thead').classList.remove("hide");
    viewClicked = false;
    filterClicked = true;
    viewAll(false);
    let ids = [],
        comparedDay;
    compDay == true ? (comparedDay = today) : (comparedDay = tomorrow);
    compDay == true ? (unclicked = true) : (unclicked = false);
    compDay == false ? (tomorrowClicked = true) : (tomorrowClicked = false);

    if (comparedDay == "Friday") {
        tableHead.style.opacity = "0";
    } else {
        tableData = document.querySelectorAll(".gradeX");
        var hiddenDivCounter = 0;
        for (i = 0; i < tableData.length; i++) {
            if (tableData[i]["cells"][4].innerText == comparedDay) {
                tableHead.classList.add("show");
                tableData[i].classList.add("show");
                ids.push(parseInt(tableData[i]["cells"][0].innerText) - 1);
            } else {
                tableData[i].classList.add("hide");
                hiddenDivCounter++;
            }
        }
        if (hiddenDivCounter == tableData.length) {
            var infoText = `<h5 class="text-center">🎉 no class availabe 🎉</h5>`;
            $(infoText).prependTo(".tableDiv");
            document.querySelector('thead').classList.add("hide");
        }

    }
    return ids;
}

function viewAll(decision) {
    $(".tableDiv h5").remove();
    document.querySelector('thead').classList.remove("hide");
    tomorrowClicked = false;
    tableHead.style.opacity = "1";
    document.getElementById("input").style.display = "block";
    upcomingContext.style.display = "block";
    if (decision) {
        $("#myInput").focus();
        viewClicked = true;
        unclicked = false;
        filterClicked = false;
        upcomingContext.style.display = "none";
    } else {
        viewClicked = false;
        unclicked = true;
        filterClicked = true;
        document.getElementById("input").style.display = "none";
    }
    if (document.getElementById("input").innerHTML == "") {
        var x = document.createElement("INPUT");
        x.setAttribute("type", "text");
        x.classList.add("form-control");
        x.setAttribute("id", "myInput");
        x.setAttribute("placeholder", "Search..");
        document.getElementById("input").appendChild(x);
    }

    for (i = 0; i < tableData.length; i++) {
        tableData[i].classList.remove("hide");
    }
}

function upcomingPainter() {
    filterClicked = true;
    if (filterClicked && !tomorrowClicked && !viewClicked) {
        if (diffArr.length == 0 && index == -1) {
            upcomingContext.innerText = "😁 No more class remaining today 😁";
        } else {
            upcomingClass = courseArr[index];
            upcomingContext.innerText =
                "⏰ " + upcomingClass + ", at " + formatAMPM(upcomingClassTime) + " ⏰";
        }
        if (today == "Friday") {
            upcomingContext.innerText =
                "✨ Today is Jumma Mubarak. Recite Surah Kahf today ✨";
        }
    } else {
        if (tomorrow == "Friday") {
            upcomingContext.innerText = "✨ Tomorrow is Jumma Mubarak ✨";
        }
    }
    upcomingContext.classList.add("text-primary");
    counterText = countdownTimer(upcomingClassTime);
    if (counterText != undefined) {
        counterContext.style.border = "2px solid red";
        counterContext.style.borderRadius = "50px";
        counterContext.style.padding = "7px";
        counterContext.style.marginLeft = "32vw";
        counterContext.style.marginRight = "32vw";
    }
    counterContext.innerHTML =
        counterText.substring(0, 2) +
        "&nbsp;" +
        blinker +
        "&nbsp;" +
        counterText.substring(3, 7) +
        " hour(s) remaining";
    counterText == undefined
        ? (counterContext.style.opacity = "0")
        : (counterContext.style.opacity = "1");
    window.setInterval(function () {
        blinker = blinker == " " ? ":" : " ";
        counterContext.innerHTML =
            counterText.substring(0, 2) +
            "&nbsp;" +
            blinker +
            "&nbsp;" +
            counterText.substring(3, 7) +
            " hour(s) remaining";
        document.title =
            counterText.substring(0, 2) +
            " : " +
            counterText.substring(3, 7) +
            " hr(s) • " +
            "Routine";
    }, 1000);
}

function classTime(arr = []) {
    viewClicked = false;
    tableData = document.querySelectorAll(".gradeX");
    for (let j = 0; j < arr.length; j++) {
        let differ;
        classHrMinFrmt.push(
            formatTwentyFour(tableData[arr[j]]["cells"][5].innerText.substring(0, 7))
        );
        courseArr.push(tableData[arr[j]]["cells"][1].innerText);
        idArr.push(tableData[arr[j]]["cells"][0].innerText);

        if (
            parseInt(classHrMinFrmt[j].substring(0, 2)) -
            parseInt(formatTwentyFour(timeNow).substring(0, 2)) >
            0
        ) {
            differ =
                parseInt(classHrMinFrmt[j].substring(0, 2)) -
                parseInt(formatTwentyFour(timeNow).substring(0, 2));
        } else if (
            parseInt(classHrMinFrmt[j].substring(0, 2)) -
            parseInt(formatTwentyFour(timeNow).substring(0, 2)) <
            0
        ) {
            differ =
                parseInt(classHrMinFrmt[j].substring(0, 2)) -
                parseInt(formatTwentyFour(timeNow).substring(0, 2)) -
                12;
        } else {
            differ =
                parseInt(
                    classHrMinFrmt[j].substring(
                        classHrMinFrmt[j].length - 4,
                        classHrMinFrmt[j].length - 2
                    )
                ) -
                    parseInt(
                        formatTwentyFour(timeNow).substring(
                            timeNow.length - 4,
                            timeNow.length - 2
                        )
                    ) >
                    0
                    ? 0
                    : -22;
        }

        diffArr.push(differ);
    }

    diffArr.sort(function (a, b) {
        return b - a;
    });
    for (let i = 0; i < diffArr.length; i++) {
        if (diffArr[i] == 0) {
            classesDoneArr.push(diffArr[i]);
        }

        if (diffArr[i] < 0) {
            classesDoneArr.push(diffArr[i]);
            diffArr.splice(i, 1);
            i--;
        }
    }

    index = classHrMinFrmt.findIndex((v) => {
        return (
            v.substring(0, 2) ==
            parseInt(formatTwentyFour(timeNow)) + diffArr[diffArr.length - 1]
        );
    });

    //we got the index of the upcoming class's table row
    let counter = 0;
    for (let i = 0; i < idArr.length; i++) {
        let data = tableData[idArr[i] - 1]["cells"][0].innerHTML;
        let day = tableData[idArr[i] - 1]["cells"][4].innerHTML;
        if (
            !tomorrowClicked &&
            tableData[idArr[i] - 1]["cells"][4].innerHTML == today &&
            !viewClicked &&
            data.indexOf("✔️") == -1 &&
            data.indexOf("⌛") == -1 &&
            data.indexOf("🕐") == -1
        ) {
            let countedDiff = getDifference(
                classHrMinFrmt[i],
                formatTwentyFour(timeNow)
            );

            if (countedDiff < -15) {
                tableData[idArr[i] - 1]["cells"][0].innerHTML = "";
                tableData[idArr[i] - 1]["cells"][0].innerHTML = data + "  ✔️";
                if (countedDiff < -0) {
                    tableData[idArr[i] - 1].style.backgroundColor = "transparent";
                }
            }

            if (countedDiff <= 0 && countedDiff >= -15) {
                var selectedTable =
                    tableData[idArr[i] - 1]["cells"][0].querySelector("a");

                if (
                    localStorage.getItem("currentClass") !=
                    tableData[idArr[i] - 1]["cells"][1].innerText
                ) {
                    localStorage.setItem(
                        "currentClass",
                        tableData[idArr[i] - 1]["cells"][1].innerText
                    );
                    if (localStorage.getItem("redirected") != "ture") {
                        localStorage.setItem("redirected", "true");
                        setTimeout(function () {
                            var win = window.open(selectedTable.href, "mypopup");
                            win.focus();
                        }, 1000);
                    } else {
                        localStorage.setItem("redirected", "false");
                    }
                }

                tableData[idArr[i] - 1]["cells"][0].innerHTML = "";
                tableData[idArr[i] - 1]["cells"][0].innerHTML =
                    data +
                    "  🕐" +
                    '<button id="skipped" onclick="skipped = true;"class="btn"><i class="fa fa-bell-slash" id="bell" style="display: block;position: relative;top: -0.3vh;"></i></button>';
                tableData[idArr[i] - 1].style.backgroundColor = "transparent";
                tableData[idArr[i] - 1].style.backgroundColor = "coral";
                tableData[idArr[i] - 1].style.fontWeight = "bold";
            }

            if (countedDiff > 0 && counter == 0) {
                counter++;
                tableData[idArr[index] - 1]["cells"][0].innerHTML = "";
                tableData[idArr[index] - 1]["cells"][0].innerHTML = data + "  ⌛";
                tableData[idArr[index] - 1].style.backgroundColor = "transparent";
                tableData[idArr[index] - 1].style.backgroundColor = "gold";
                tableData[idArr[index] - 1].style.fontWeight = "bold";
            }
        }
    }

    upcomingClassTime = classHrMinFrmt[index];

    upcomingPainter();
}

function countdownTimer(upcomingClassTime) {
    let num = getDifference(
        upcomingClassTime,
        formatTwentyFour(formatAMPM(new Date()))
    );
    // console.log('\ngetDifference: ' + num);
    let hours = Math.floor(num / 60);
    // console.log('\nhrs: ' + hours);
    //			hours = hours/100;
    let minutes = num % 60;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes}`;
}

function formatAMPM(date) {
    let hours, minutes, ampm;

    if (typeof date == "string") {
        hours =
            date.length == 7
                ? parseInt(date.substring(0, 2))
                : parseInt(date.substring(0, 1));
        minutes =
            date.length == 7
                ? parseInt(date.substring(3, 5))
                : parseInt(date.substring(2, 4));
        ampm = date.length == 7 ? date.substring(5, 7) : date.substring(4, 6);
    } else if (typeof date == "object") {
        hours = date.getHours();
        minutes = date.getMinutes();
        ampm = hours >= 12 ? "pm" : "am";
    }

    hours = hours % 12;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + ampm;
    return strTime;
}

function formatTwentyFour(d) {
    let hours =
        d.length == 7 ? parseInt(d.substring(0, 2)) : parseInt(d.substring(0, 1));
    let minutes = d.length == 7 ? d.substring(3, 5) : d.substring(2, 4);
    let ampm = d.length == 7 ? d.substring(5, 7) : d.substring(4, 6);
    ampm == "pm" ? (hours += 12) : (hours += 0);
    hours == 24 ? (hours -= 12) : (hours += 0);
    if (hours < 10) {
        hours = hours.toString();
        hours = "0" + hours;
    }
    let strTime = hours + ":" + minutes + ampm;
    return strTime;
}

function getDifference(a, b) {
    let aHours =
        a.length == 7 ? parseInt(a.substring(0, 2)) : parseInt(a.substring(0, 1));
    let aMinutes =
        a.length == 7 ? parseInt(a.substring(3, 5)) : parseInt(a.substring(2, 4));
    let aAmpm = a.length == 7 ? a.substring(5, 7) : a.substring(4, 6);
    let aTime = aHours * 60 + aMinutes;

    let bHours =
        b.length == 7 ? parseInt(b.substring(0, 2)) : parseInt(b.substring(0, 1));
    let bMinutes =
        b.length == 7 ? parseInt(b.substring(3, 5)) : parseInt(b.substring(2, 4));
    let bAmpm = b.length == 7 ? b.substring(5, 7) : b.substring(4, 6);
    let bTime = bHours * 60 + bMinutes;

    let diff = aTime - bTime;

    // let strTime = hours + ':' + minutes + ampm;
    return diff;
}
