/* Laboratório de Projeto II | Licenciatura Design Multimédia | 2021/2022
   Projeto Instalação Livre | Contra-Inércia
   Por Cláudia Alvés, Daniele Miranda e Gustavo Belo
*/ 



//variáveis globais
let serial;
let latestData = "waiting for data";
let video1, video2, videosW, videosH, imgMask;
let videoSizeAndMaskSet, setMask, larguraVideoDesejado;


function preload () //função para carregar os arquivos
{
  video1 = createVideo('https://contrainercia.github.io/video_3_ap.mp4', setVideoSizeAndMask); //carregar o vídeo e aplicar as configurações do vídeo
  video1.hide(); 
  video1.loop(); //reproduzir o video em looping
  
  video2 = createVideo('https://contrainercia.github.io/video_4_ap.mp4', setVideoSizeAndMask); //carregar o vídeo e aplicar as configurações do vídeo
  video2.hide(); 
  video2.loop(); //reproduzir o video em looping
}


function setup() 
{
  createCanvas(windowWidth, windowHeight); //criar canva 
  videoSizeAndMaskSet = false; //variáveis de controle de condição
  setMask = false; // variáveis de controle de condição
  larguraVideoDesejado = 500; //tamanho dos vídeos na canva
  
  // código do serial começa aqui
  serial = new p5.SerialPort(); // Abrir porta de comunicação com o arduíno
  serial.list();
  serial.open('COM5'); 
  serial.on('connected', serverConnected); // Função que mostra o status de conexão com o arduíno
  serial.on('list', gotList);  // Lista as portas seriais de comunicação abertas
  serial.on('data', gotData); // Função que obtem os dados do sensor
  serial.on('error', gotError); // Função que exibe qualquer erro que acontecer durante a comunicação
  serial.on('open', gotOpen); // Função que exibe o status de porta aberta
  serial.on('close', gotClose); // Função que exibe o status de porta feachada
}



function serverConnected() {
 print("Connected to Server");
}

function gotList(thelist) {
 print("List of Serial Ports:");

 for (let i = 0; i < thelist.length; i++) {
  print(i + " " + thelist[i]);
 }
}

function gotOpen() {
 print("Serial Port is Open");
}

function gotClose(){
 print("Serial Port is Closed");
 latestData = "Serial Port is Closed";
}

function gotError(theerror) {
 print(theerror);
}

function gotData() {
 let currentString = serial.readLine();
  trim(currentString);
 if (!currentString) return;
 console.log(currentString);
 latestData = currentString;
}
// código serial acaba aqui

function draw()
{
  latestData = mouseX; // simular com o rato o comportamento do sensor 
  
  
  background(0); //background preto
  imageMode (CENTER); //elementos ficarem no centro da canva
  
  if (latestData<20) //definar a distância onde o sensor mudará de vídeo
  {
    if (videoSizeAndMaskSet) // reproduzir o vídeo1 se a distância for menor que a indicada na função
    {
      if (setMask) video1.mask(imgMask);
      image (video1, width/2, height/2, videosW, videosH); // Se a tecla "m" já tiver sido pressionada, o vídeo passa a ser reproduzido com a máscara já aplicada
      if (!setMask) image(imgMask, width/2, height/2); // Vai cair nesta condição enquanto a tecla "m" não é pressionada. Ele assume uma posição inicial para a máscara
    }
  }
  
  else //se não for menor, reproduzir o vídeo2
  {
    if (videoSizeAndMaskSet) // Se o vídeo está com a máscara devidamente aplicada
    {
      if (setMask) video2.mask(imgMask);// Se a tecla "m" já tiver sido pressionada, o vídeo passa a ser reproduzido com a máscara já aplicada
      image (video2, width/2, height/2, videosW, videosH);
      if (!setMask) image(imgMask, width/2, height/2); // Vai cair nesta condição enquanto a tecla "m" não é pressionada. Ele assume uma posição inicial para a máscara
    }
  }
  
}


function videoMask() //criar as máscaras

{
  //váriaveis para definições das máscaras: posição do corner1, largura e altura
  let x1 = 0;
  let y1 = 100;
  let w1 = 100;
  let h1 = 300;
  
  let x2 = 150;
  let y2 = 100;
  let w2 = 300;
  let h2 = 300;
  
  let x3 = 500;
  let y3 = 100;
  let w3 = 100;
  let h3 = 300;
  
  
  
  let mask = createGraphics (width, height); //desenhar a máscara | Cria e retorna um novo objeto de renderização
  
  mask.noStroke(); //sem traço
  mask.fill (0, 255, 0); //preenchimento
  
  mask.rect (x1, y1, w1, h1); //posição do corner1, largura e altura consoante as definicas nas váriaveis das linhas 109 a 112
  mask.rect (x2, y2, w2, h2); //posição do corner1, largura e altura consoante as definicas nas váriaveis das linhas 114 a 117
  mask.rect (x3, y3, w3, h3); //posição do corner1, largura e altura consoante as definicas nas váriaveis das linhas 119 a 122
  
  
  return mask;
}


function videoResize (originalW, originalH, fixedW) //função para ajustar a proporção do vídeo em relação ao tamanho da canva
{
  let ratio = originalH/originalW;
  let newSize = {w:fixedW, h:fixedW*ratio};
  
  return newSize;
}


function setVideoSizeAndMask() // ajustar a mascára no vídeo
{
  videosW = videoResize(video1.width, video1.height, larguraVideoDesejado).w; //Criar proporção de largura do vídeo consoante o valor definido na variável larguraVideoDesejada 
  videosH = videoResize(video1.width, video1.height, larguraVideoDesejado).h; //Criar proporção de altura do vídeo consoante o valor definido na variável larguraVideoDesejada 

  imgMask = videoMask(); 
  videoSizeAndMaskSet = true; // Permite que o vídeo seja executado já com a máscara aplicada
}


function keyPressed() //função para "colocar" o vídeo dentro da mascara quando a tecla M por precionada
{
  if (key==='m') //se a tecla M for pressionada acontece todos os eventos dentro deste escopo
  {
    setMask = !setMask; // Para a máscara ser aplicada, ela inicialmente está com o valor false e passar a ser true
    removeElements(); // Remover todos os elementos da canvas
    preload(); // Inicia as configurações dos vídeos
    videoSizeAndMaskSet = false; // Não permite a execução do vídeo até que a máscara seja aplicada
    setVideoSizeAndMask(); // Cria a máscara e ajusta ao tamanho do vídeo
  }
}


function windowResized() // função para a canva ser responsiva
{
  resizeCanvas (windowWidth, windowHeight);
  
  videoSizeAndMaskSet = false;
  setVideoSizeAndMask();
}