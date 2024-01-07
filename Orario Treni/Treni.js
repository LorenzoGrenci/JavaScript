const token = "cbed2bc9-ca66-4817-bde8-643147887463";
const username = document.getElementById("username"); 
const password = document.getElementById("password");
const div_login = document.getElementById("div_login");
const button_login = document.getElementById("b_login");
const text = document.getElementById("text"); 
const div_crea = document.getElementById("div_crea");
const button_change = document.getElementById("change");
const stazioneP = document.getElementById("StazioneP");
const stazioneA = document.getElementById("StazioneA");
const durata = document.getElementById("Durata");
const button_crea = document.getElementById("CreaT");
const div_cerca = document.getElementById("div_cerca");
const button_change2 = document.getElementById("change2");
const stazionePC = document.getElementById("StazionePC");
const stazioneAC = document.getElementById("StazioneAC");
const button_cerca = document.getElementById("CercaT");
let div_tab = document.getElementById("div_tab")
let lista_Tratte=[];

function login(callback, token, username, password) {
  fetch("https://ws.progettimolinari.it/credential/login",
    {
      method: "POST",
      headers:
      {
        "content-type": "application/json",
        key: token
      },
      body: JSON.stringify(
        {
          username: username,
          password: password
        })
    }).then((response) => {
      response.json().then(callback).catch(err => (console.log(err)))
    })
};

function get(token) {
  fetch("https://ws.progettimolinari.it/cache/get", {
    method: "POST",
    headers:
    {
      "content-type": "application/json",
      key: token
    },
    body: JSON.stringify({ key: "Tratta" })
  }).then((response) => {
    response.json().then(callback2).catch(err => (console.log(err)))
  })
}

function set(token, stazioneP, stazioneA, durata) {
  fetch("https://ws.progettimolinari.it/cache/set",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        key: token
      },
      body: JSON.stringify({
        key: "Tratta",
        value: {stazioneP, stazioneA, durata}
      })
    }).then((response) => {
      response.json().then(console.log("ok"));
    })
}

function callback2(content) {
  console.log(content);
  lista_Tratte = JSON.parse(content.result);
  render();
}

function callback(content) { 
  content = JSON.parse(content.result);
  if (content === true) {
    div_login.classList.remove("d-block"); 
    div_login.classList.add("d-none");     
    div_crea.classList.remove("d-none"); 
    div_crea.classList.add("d-block"); 
  }
  else {
    text.classList.remove("d-none"); 
    text.classList.add("border-danger");
    text.innerText = "Credenziali errate"; 
  }
}
  
div_login.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    login(callback, token, username.value, password.value);
  }
});
  
button_login.onclick = () => {
  login(callback, token, username.value, password.value); 
}

let template = `
<div class="row">
 <div class="col"></div>
 <div class="col-6 text-center centro">
<div class="card border-success mb-3" style="max-width: 540px;">
<div class="row g-0">
  <table>
    <tr><th>Stazione Partenza<th><th>Stazione Arrivo<th><th>Durata<th>
    <tr><td>%StazionePC</td><td>%StazioneAC</td><td>%Durata</td></tr>
  </table>
</div>
</div>
</div>
 <div class="col"></div>
 </div>`;
  
function render() {
  console.log(lista_Tratte)
  let html = ``;
  let found=false;
  lista_Tratte.forEach((element) => {
    if (element.stazioneP == stazionePC.value && element.stazioneA == stazioneAC.value){
      html += template.replace("%StazionePC", element.stazioneP).replace("%StazioneAC", element.stazioneA).replace("%Durata", element.durata)
      console.log("controllo ok")
      found=true;
    } 
  })
  div_tab.innerHTML = html;
  if (!found){
    div_tab.classList.remove("d-block"); 
    div_tab.classList.add("border-danger");
    div_tab.innerText = "Tratta inesistente";
  }
}

button_cerca.onclick=()=>{
  get(token);
}

button_crea.onclick=()=>{
  set(token, stazioneP.value, stazioneA.value, durata.value)
}

button_change.onclick=()=>{
  div_crea.classList.remove("d-block"); 
  div_crea.classList.add("d-none");     
  div_cerca.classList.remove("d-none"); 
  div_cerca.classList.add("d-block"); 
}

button_change2.onclick=()=>{
  div_cerca.classList.remove("d-block"); 
  div_cerca.classList.add("d-none");     
  div_crea.classList.remove("d-none"); 
  div_crea.classList.add("d-block"); 
}