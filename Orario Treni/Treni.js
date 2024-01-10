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
const prima_par = document.getElementById("Prima_partenza");
const ripetizione = document.getElementById("Ripetizione");
const n_rip = document.getElementById("Numero_ripetizioni");
const button_crea = document.getElementById("CreaT");
const div_cerca = document.getElementById("div_cerca");
const button_change2 = document.getElementById("change2");
const stazionePC = document.getElementById("StazionePC");
const stazioneAC = document.getElementById("StazioneAC");
const button_cerca = document.getElementById("CercaT");
const div_tab = document.getElementById("div_tab")
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

function set(token, content) {
  fetch("https://ws.progettimolinari.it/cache/set",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        key: token
      },
      body: JSON.stringify({
        key: "Tratta",
        value: JSON.stringify(content)
      })
    }).then((response) => {
      response.json().then(console.log("ok"));
    })
}

function callback2(content) {
  console.log(content);
  lista_Tratte = JSON.parse(content.result);
}

function callback(content) { 
  content = JSON.parse(content.result);
  if (content === true) {
    div_login.classList.remove("d-block"); 
    div_login.classList.add("d-none");     
    div_crea.classList.remove("d-none"); 
    div_crea.classList.add("d-block"); 
    get(token)
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
  <table class="table">
    <tr><th>Stazione Partenza</th><th>Stazione Arrivo</th><th>Durata</th><th>Prima Partenza</th><th>Ogni quanto</th><th>Numero ripetizioni</th>
    <tr><td>%StazionePC</td><td>%StazioneAC</td><td>%Durata</td><td>%Primapartenza</td><td>%Ripetizione</td><td>%N_rip</td></tr>
  </table>`;
  
function render() {
  console.log(lista_Tratte)
  let html = ``;
  let found=false;
  lista_Tratte.forEach((element) => {
    console.log(element)
    if (element["partenza"] == stazionePC.value && element["arrivo"] == stazioneAC.value){
      html += template.replace("%StazionePC", element["partenza"]).replace("%StazioneAC", element["arrivo"]).replace("%Durata", element["durata"])
      .replace("%Primapartenza", element["primapartenza"]).replace("%Ripetizione", element["ripetizione"]).replace("%N_rip", element["n_rip"])
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
  get(token)
  render();
}

button_crea.onclick=()=>{
  let tratta={"partenza": stazioneP.value, "arrivo": stazioneA.value, "durata": durata.value,
              "primapartenza": prima_par.value, "ripetizione": ripetizione.value, "n_rip": n_rip.value }
  lista_Tratte.push(tratta)
  set(token, lista_Tratte)
}

button_change.onclick=()=>{
  div_crea.classList.remove("d-block"); 
  div_crea.classList.add("d-none");     
  div_cerca.classList.remove("d-none"); 
  div_cerca.classList.add("d-block");
  div_tab.classList.remove("d-none"); 
  div_tab.classList.add("d-block");
}

button_change2.onclick=()=>{
  div_cerca.classList.remove("d-block"); 
  div_cerca.classList.add("d-none");     
  div_crea.classList.remove("d-none"); 
  div_crea.classList.add("d-block"); 
  div_tab.classList.remove("d-block"); 
  div_tab.classList.add("d-none");
}