var personas =1;
var slider = document.getElementById("rango");
var output = document.getElementById("valorRango");
output.innerHTML = slider.value;

slider.oninput = function (){
    output.innerHTML = this.value;
    personas = this.value;
}

var veces_regadera = 1;
var slider2 = document.getElementById("rango2");
var output2 = document.getElementById("valorRango2");
output2.innerHTML = slider.value;

slider2.oninput = function (){
    output2.innerHTML=this.value;
    veces_regadera = this.value;
}


var data;
var max=0;

var formpersonas = document.getElementById("personas_en_casa");
var formregadera = document.getElementById("tiempo_regadera");
var formVregadera = document.getElementById("veces_regadera");
var formtoilet = document.getElementById("toilet");
var formcarro = document.getElementById("carro");
var formplatos = document.getElementById("platos");
var formlavadora = document.getElementById("lavadora");
var formplantas = document.getElementById("plantas");
var formpool = document.getElementById("pool");
var resultado = document.getElementById("resultado");
var tiempo_regadera = 0;
var vecesR= 0;
var aguaRegadera =0;
var toilet = 0;
var aguaCarro =0;
var aguaLavadora =0;
var aguaPlantas =0;
var aguaPool= 0;

function siguiente(){
    formpersonas.style.display ="none";
    formregadera.style.display ="block";
}
function regadera(n){
    formregadera.style.display ="none";
    formVregadera.style.display ="block";
    tiempo_regadera = n;
}
function veces(n){
    formVregadera.style.display ="none";
    formtoilet.style.display = "block"
    vecesR= n;
    aguaRegadera= (veces_regadera*tiempo_regadera*personas*0.1)/7;
    if(aguaRegadera*30>max){
        max=aguaRegadera*30;
    }
}
function escusado(n){
    formtoilet.style.display ="none";
    formcarro.style.display ="block";
    if(n==0){ //low
        //personas*gasto*5 veces al día*30 días
        toilet = personas* 6*5;
    }else{ //alto
        toilet = personas*22*5;
    }
    if((toilet*30)/100>max){
        max=(toilet*30)/100;
    }
}
function carro(n){
    formcarro.style.display ="none";
    formplatos.style.display = "block";
    if(n==3){
        aguaCarro=0;
    }else if(n==1){
        aguaCarro= (5)/60; //manguera 500L
    }else{
        aguaCarro= (0.5)/60; //cubeta
    }
    if(aguaCarro*30>max){
        max=aguaCarro*30;
    }
}
function platos(n){
    formplatos.style.display ="none";
    formlavadora.style.display ="block";
    if(n==1){ //manos
        aguaplatos = 0.2322;
    }else{ //maquina
        aguaplatos= 2.664;
    }
    if(aguaplatos*30>max){
        max=aguaplatos*30;
    }
}
function lavadora(n){
    formlavadora.style.display = "none";
    formplantas.style.display ="block";
    if(n==1){ //hand
        aguaLavadora=0.54*personas;
    }else{
        aguaLavadora=0.1*personas;
    }
    if(aguaLavadora*30>max){
        max=aguaLavadora*30;
    }
}
function plant(n){
    formplantas.style.display = "none";
    formpool.style.display = "block";
    if(n==2){ //regadera
        aguaPlantas = 0.54/7;
    }else{ //no plantas
        aguaPlantas = 0;
    }
    if(aguaPlantas*30>max){
        max=aguaPlantas*30;
    }
}
function pool(n){
    console.log("entra");
    formpool.style.display = "none";
    if(n==1){ //si alberca
        aguaPool= 0.5;
    }else{ //no alberca
        aguaPool= 0;
    }
    if(aguaPool*30>max){
        max=aguaPool*30;
    }
    actualizaData();
}


function actualizaData(){
    resultado.style.display = "block";
    var total = document.getElementById("total");
    total.innerHTML = (((toilet)*30)/100) + ((aguaCarro + aguaLavadora + aguaPlantas + aguaPool+ aguaRegadera)*30);
    
    //GRAFICA SEMANA
    data =[
        { name: 'Toilet', score : (toilet*30)/100},
        { name: 'Shower', score: aguaRegadera*30 },
        { name: 'Car', score: aguaCarro*30 },
        { name: 'Dish washing', score: aguaplatos*30 },
        { name: 'Clothes', score: aguaLavadora*30 },
        { name: 'Plants', score: aguaPlantas*30 },
        { name: 'Pool', score: aguaPool*30 },
    ];

    var width = 900;
    var height = 450;
    var margin = { top: 50, bottom: 50, left: 50, right: 50 };

    const svg = d3.select('#d3-container')
    .append('svg')
    .attr('width', width - margin.left - margin.right)
    .attr('height', height - margin.top - margin.bottom)
    .attr("viewBox", [0, 0, width, height]);

    const x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.1)

    const y = d3.scaleLinear()
    .domain([0, max])
    .range([height - margin.bottom, margin.top])

    svg
    .append("g")
    .attr("fill", 'royalblue')
    .selectAll("rect")
    .data(data.sort((a, b) => d3.descending(a.score, b.score)))
    .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.score))
        .attr('title', (d) => d.score)
        .attr("class", "rect")
        .attr("height", d => y(0) - y(d.score))
        .attr("width", x.bandwidth());

    function yAxis(g) {
    g.attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(null, data.format))
        .attr("font-size", '20px')
    }

    function xAxis(g) {
    g.attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => data[i].name))
        .attr("font-size", '20px')
    }

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
    svg.node();
}
