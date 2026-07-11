const SHOW_PG_2026 = true;
const SHOW_PROFESSIONAL_2026 = true

const API_URL =
"https://script.google.com/macros/s/AKfycbxE2TMnA4lpP_WgPa3_uf7wMXKIxFEkJof0tLUVUuIGUI7oVA6bn6QxQ1mZg3Ys2Oqu/exec";

let resultLink = "";
const YEAR_WISE_SEMESTERS = {

  "2024":{
    BSC:[1,2],
    BA:[1,2],
    BCOM:[1,2],
    MA:[1,2],
    BED:[1,2]
  },

  "2025":{
    BSC:[1,2,3,4],
    BA:[1,2,3,4],
    BCOM:[1,2,3,4],
    MA:[1,2,3,4],
    BED:[1,2,3,4]
  },

  "2026":{
    BSC:[3,,4,5,6],
    BA:[3,5,6],
    BCOM:[3,5,6],
    MA:[3,4],
    BED:[3,4]
  }

};
const BACK_YEAR_WISE_SEMESTERS = {
  "2025":[1,2],
  "2026":[1,3]
};
/* CLOSE POPUP */

function closePopup(){
history.replaceState(null, "", location.href);
document.getElementById("resultPopup").style.display = "none";

document.getElementById("resultFrame").src = "";

document.getElementById("pdfLoader").style.display = "none";
resultLink = "";

let btn = document.getElementById("actionBtn");

btn.innerHTML = "";
btn.style.display = "none";


btn.style.background = "";

btn.onclick = openFullResult;

}
/* OPEN FULL RESULT */

async function openFullResult(){

if(!resultLink) return;

document.getElementById("downloadLoader").style.display="flex";

let percent = 0;

let timer = setInterval(function(){

if(percent < 95){

percent += 5;

document.getElementById("downloadPercent").innerText =
percent + "%";

document.getElementById("progressFill").style.width =
percent + "%";

if(percent > 80){

document.getElementById("downloadText").innerText =
"Processing PDF...";

}

}

},150);

try{

const response = await fetch(
API_URL + "?download=" + encodeURIComponent(resultLink)
);

const base64 = await response.text();

clearInterval(timer);

document.getElementById("downloadPercent").innerText =
"100%";
document.getElementById("progressFill").style.width = "100%";

document.getElementById("downloadText").innerText =
"Download Completed ✓";

let btn = document.getElementById("actionBtn");

btn.innerHTML = "✅ Open PDF";
btn.style.background = "#22c55e";

btn.onclick = function(){
window.open(resultLink, "_blank");
};

const byteCharacters = atob(base64);

const byteNumbers = new Array(byteCharacters.length);

for(let i=0;i<byteCharacters.length;i++){

byteNumbers[i] =
byteCharacters.charCodeAt(i);

}

const blob = new Blob(
[new Uint8Array(byteNumbers)],
{type:"application/pdf"}
);

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;
let rollNo =
document.getElementById("roll").value.trim();

let semester =
document.getElementById("sem").value;

let examType =
document.getElementById("examType").value;

if(examType === "BACKPAPER"){

a.download =
rollNo + "_BackPaper_Sem_" +
semester +
".pdf";

}else{

a.download =
rollNo + "_Sem_" +
semester +
".pdf";

}

document.body.appendChild(a);

a.click();

a.remove();

URL.revokeObjectURL(url);

setTimeout(function(){

document.getElementById("downloadLoader").style.display="none";

document.getElementById("downloadPercent").innerText="0%";

document.getElementById("progressFill").style.width="0%";

document.getElementById("downloadText").innerText =
"Preparing file...";

},500);
}catch(e){

clearInterval(timer);

document.getElementById("downloadLoader").style.display="none";

alert("Download Failed");

}

}
/* SEARCH RESULT */

function searchResult(){

let roll =
document.getElementById("roll").value.trim();

let examType =
document.getElementById("examType").value;

let course =
document.getElementById("course").value;

let sem =
document.getElementById("sem").value;

let father =
document.getElementById("father").value.trim();

let year =
document.getElementById("year").value;

let error =
document.getElementById("error");

error.innerHTML = "";
let isTimedOut = false;

/* VALIDATION */

if(roll === ""){

error.innerHTML =
"⚠ Please enter Roll Number";

return;

}
if(year === ""){

error.innerHTML =
"⚠ Please select Result Year";

return;

}
if(examType === ""){

error.innerHTML =
"⚠ Please select Exam Type";

return;

}

if(course === ""){

error.innerHTML =
"⚠ Please select Course";

return;

}

if(sem === ""){

error.innerHTML =
"⚠ Please select Semester";

return;

}

if(father === ""){

error.innerHTML =
"⚠ Please enter Father Name";

return;

}

/* SHOW LOADING */

document.getElementById("loading")
.style.display = "flex";

/* API URL */

let url =
API_URL +
"?year=" + encodeURIComponent(year) +
"&roll=" + encodeURIComponent(roll) +
"&examType=" + encodeURIComponent(examType) +
"&course=" + encodeURIComponent(course) +
"&sem=" + encodeURIComponent(sem) +
"&father=" + encodeURIComponent(father);
/* FETCH */


const timeout = setTimeout(() => {

isTimedOut = true;

document.getElementById("loading").style.display = "none";

error.innerHTML =
"⛔ Internet Slow. Please try again.";

},12000);

fetch(url)

.then(response => response.json())

.then(data => {

if(isTimedOut) return;

clearTimeout(timeout);
document.getElementById("loading")
.style.display = "none";

if(data.status === "notuploaded"){

error.innerHTML =
"<div style='text-align:center;'><span style='display:inline-block;background:#fee2e2;padding:8px 14px;border-radius:8px;border:2px solid #dc2626;color:#b91c1c;font-size:13px;font-weight:500;'>❌ RECORD NOT FOUND</span></div>";

return;

}

if(data.status === "found"){
let btn = document.getElementById("actionBtn");

btn.innerHTML = "📄 Download Result";
btn.style.display = "block";
btn.style.background = "";

btn.onclick = openFullResult;

document.getElementById("studentName")
.innerHTML =
"👨‍🎓 " + (data.student || "Student");

if(examType === "BACK PAPER" || examType === "BACKPAPER"){

document.getElementById("studentSemester").innerHTML =
"Semester : " + sem + " (BACK PAPER) " + year;

}else{

document.getElementById("studentSemester").innerHTML =
"Semester : " + sem + " (" + year + ")";

}
resultLink =
data.link || "";
resultLink = data.link || "";

window.location.href =
"result.html?" +
new URLSearchParams({
    roll,
    year,
    examType,
    course,
    sem,
    father
}).toString();

setTimeout(function () {

    try {

        if (
            !document.getElementById("resultFrame").contentDocument ||
            document.getElementById("resultFrame").contentDocument.body.innerHTML.trim() === ""
        ) {

            document.querySelector(".popup-title").innerHTML =
            "⚠ Result Not Uploaded by University";

            document.querySelector(".popup-title").style.color = "#dc2626";
        }

    } catch (e) {
        // Cross-origin PDF hone par browser yahan aa jayega.
        // Is case me kuch mat karo, kyunki valid PDF bhi cross-origin hota hai.
    }

}, 2000);

}else{

error.innerHTML =
"<span style='font-size:18px;font-weight:700;'>🚫 RESULT NOT FOUND</span><br><small style='font-size:12px;font-weight:300;'>Record not available. Please enter correct details.</small>";
}

})

.catch(err => {

clearTimeout(timeout);
document.getElementById("loading")
.style.display =
"none";

error.innerHTML =
"⚠  No Internet. Please connect Internet.";

console.log(err);

});

}

/* ESC CLOSE */

document.addEventListener(
"keydown",
function(e){

if(e.key === "Escape"){

closePopup();

}

}
);

/* OUTSIDE CLICK CLOSE */

window.onclick = function(event){

let popup =
document.getElementById("resultPopup");

if(event.target === popup){

closePopup();

}

};

/* EXAM TYPE CHANGE */

document.getElementById("examType")
.addEventListener("change", function(){

let course =
document.getElementById("course");

let sem =
document.getElementById("sem");

course.innerHTML =
'<option value="">Choose Course</option>';

sem.innerHTML =
'<option value="">Choose Semester</option>';

if(this.value === "UG"){

course.innerHTML += `
<option value="BSC">B.Sc</option>
<option value="BCOM">B.Com</option>
<option value="BA">B.A</option>
`;

}

if(this.value === "PG"){

course.innerHTML += `
<option value="MA">M.A</option>
`;

}
if(this.value === "PROFESSIONAL"){

course.innerHTML += `
<option value="BED">B.Ed</option>
`;

}
if(this.value === "BACKPAPER"){

course.innerHTML += `
<option value="BSC">B.Sc</option>
<option value="BCOM">B.Com</option>
<option value="BA">B.A</option>
<option value="MA">M.A</option>
<option value="BED">B.Ed</option>
`;

}
});

/* COURSE CHANGE */

document.getElementById("course")
.addEventListener("change", function(){

let sem =
document.getElementById("sem");

sem.innerHTML =
'<option value="">Choose Semester</option>';

let examType =
document.getElementById("examType").value;

/* BACK PAPER = PURANA SYSTEM */

if(examType === "BACKPAPER"){

let year =
document.getElementById("year").value;

let semesters =
BACK_YEAR_WISE_SEMESTERS[year] || [];

semesters.forEach(function(s){

let suffix =
s==1 ? "st" :
s==2 ? "nd" :
s==3 ? "rd" : "th";

sem.innerHTML +=
`<option value="${s}">${s}${suffix} Semester</option>`;

});

return;
}

/* NORMAL RESULT = RELEASED SEM ONLY */

let year =
document.getElementById("year").value;

let course =
this.value;

let semesters =
(YEAR_WISE_SEMESTERS[year] &&
 YEAR_WISE_SEMESTERS[year][course])
|| [];
semesters.forEach(function(s){

let suffix =
s==1 ? "st" :
s==2 ? "nd" :
s==3 ? "rd" : "th";

sem.innerHTML +=
`<option value="${s}">${s}${suffix} Semester</option>`;

});

});

let btn = document.getElementById("actionBtn");

btn.innerHTML = "📄 Download Result";
btn.style.background = "";

btn.onclick = openFullResult;

window.addEventListener("popstate", function(){

let popup = document.getElementById("resultPopup");

if(popup.style.display === "flex"){

closePopup();

}

});
document.getElementById("year")
.addEventListener("change", function(){
let year = this.value;
let examType = document.getElementById("examType");
if(year === ""){

    examType.innerHTML =
    '<option value="">Choose Exam Type</option>';

    document.getElementById("course").innerHTML =
    '<option value="">Choose Course</option>';

    document.getElementById("sem").innerHTML =
    '<option value="">Choose Semester</option>';

    return;
}

if(year === "2024"){

  examType.innerHTML = `
  <option value="">Choose Exam Type</option>
  <option value="UG">UnderGraduate (UG)</option>
  <option value="PG">PostGraduate (PG)</option>
  <option value="PROFESSIONAL">PROFESSIONAL</option>
  `;

}
else if(year === "2025"){

  examType.innerHTML = `
  <option value="">Choose Exam Type</option>
  <option value="BACKPAPER">BACK_PAPER</option>
  <option value="UG">UnderGraduate (UG)</option>
  <option value="PG">PostGraduate (PG)</option>
  <option value="PROFESSIONAL">PROFESSIONAL</option>
  `;

}
else if(year === "2026"){

let options = `
<option value="">Choose Exam Type</option>
<option value="BACKPAPER">BACK_PAPER</option>
<option value="UG">UnderGraduate (UG)</option>
`;

if(SHOW_PG_2026){
options += `<option value="PG">PostGraduate (PG)</option>`;
}

if(SHOW_PROFESSIONAL_2026){
options += `<option value="PROFESSIONAL">PROFESSIONAL</option>`;
}

examType.innerHTML = options;

}

// Exam Type Reset
document.getElementById("examType").value = "";


// Semester Reset
document.getElementById("sem").innerHTML =
'<option value="">Choose Semester</option>';

// Error Clear
document.getElementById("error").innerHTML = "";

// Result Popup Close
closePopup();

});
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
});
document.addEventListener("keydown", function(e){

    if (e.keyCode == 123) { // F12
        e.preventDefault();
    }

});
