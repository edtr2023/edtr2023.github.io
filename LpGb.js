const anchoLienzoInicial=1366;//1824;//1366//1824
const alturaLienzoInicial=691;//661//924
const ResolucionP=2.2;//anchoLienzoInicial/alturaLienzoInicial;

const NoObjetos=4;
const raj=-35;
const AceleracionAnimacion=4;
const extension=".png";
const Lienzo = document.getElementById("idLienzo");
const pincel = Lienzo.getContext("2d");
const Video = document.getElementById("idVideo");
const Div2 =document.getElementById("idDiv2")

const Encabezado = new Image();
        Encabezado.src = "15.png";
        Encabezado.onload = function(){
        }
const Decoracion = new Image();
        Decoracion.src="7.png"
        Decoracion.onload=function(){

        }

let factorX,factorY,pantalla=1;
const COLOR_ETIQUETAS="white"//"#bae1f7"// "#EAEDED"
const COLOR_RESALTADO="#d7dbdd"//"#bae1f7"// "#EAEDED"
const NoPreguntas=7
const NoOpciones=3

const TEXTO_ETIQUETA="Reproduce el vídeo y cuando estés preparado intenta responder correctamentea las preguntas. ¿Listo?"
const question=[]
for(let i=0;i<NoPreguntas;i++){
    question[i] = new Image();
    question[i].src="./Avin3/RAJ/"+(i+32)+".png"
    question[i].onload=function(){}

}

let index=0,repeticion=0,pos=-raj,posX=-raj,posY=raj,
    AnchoEncabezado,AltoEncabezado,EncabezadoX,EncabezadoY=0,
    AnchoDecoracion,AltoDecoracion,DecoracionX,DecoracionY

let p2x,p2ancho,p2a,p2b,p2Altura,p2alto,p2y;

const p2Ext=["./Avi7/oto/","./Avin3/RpJ","./mlt/s","./avi6/"]
const Noframes=[32,3,5,22],relacion=[0.7,1,1,0.5],p2NoRetardo=[3,7,7,3]
const p2color=["#f74395","#5b14b7","#30a5e8","#66a329"]
const p2texto=["Posición y desplazamiento","Posición vs tiempo","Movimiento uniforme","Velocidad variable"]
const p2Amplitud=[1.2,1,1,1.7]
const pantallaNext=[2,0,0,0]

class TEXTO{
    constructor(EstiloFuente="bold",colorfuente="white",fuente="arial",fSize=12,alineacionX="left",alineacionY="top",lineabase="top",alturaDeLinea=25){
        this.fuente=fuente,this.fSize=fSize,this.alturaDeLinea = alturaDeLinea,this.EstiloFuente=EstiloFuente
        this.colorfuente=colorfuente,this.alineacionX=alineacionX,this.alineacionY=alineacionY,this.lineabase=lineabase
    }
    setAlturaLinea(valor){
        this.alturaDeLinea=valor

    }
    setAtributosFuente(){
        pincel.textBaseline = this.lineabase;
        pincel.fillStyle = this.colorfuente;
        pincel.textAlign =this.alineacionX;
        pincel.font=this.EstiloFuente+" "+Math.floor(factorY*this.fSize)+"px"+" "+this.fuente
    }
    obtenerQ(alineacion,y,p){
        if(alineacion==="top"){
            return y
        }
        else{
            return y-p/2
        }
    }
    graficar(texto,x,y,Anchura,alturaDeLinea=25){
        let arrayTxt=[],j=0, p=0
        this.setAtributosFuente()
		let palabrasRy = texto.split(" ");
		let lineaDeTexto = "";
		for(let i = 0; i < palabrasRy.length; i++) {
			let testTexto = lineaDeTexto + palabrasRy[i] + " ";
			let textWidth = pincel.measureText(testTexto).width;
			if (textWidth > Anchura  && i > 0) {
				arrayTxt[j++]=lineaDeTexto
				lineaDeTexto = palabrasRy[i]+ " " ;
				p += alturaDeLinea*factorY;
			}
            else { 
				lineaDeTexto = testTexto;
			}
		}
        arrayTxt[j++]=lineaDeTexto
        let q=this.obtenerQ(this.alineacionY,y,p)
        for(let i=0;i<j;i++){
            pincel.fillText(arrayTxt[i], x, q);
            q+=alturaDeLinea*factorY;

        }
    }
}

class OBJETOGRAFICO{
    constructor(srcGrafica="",NoGraficas=0,rel=1,NoRetardo=0,Amplitud=1, pantallaNext=1){
        this.srcGrafica=srcGrafica,this.NoGraficas=NoGraficas,
        this.index=0,this.grafica=[],this.relacion=rel,
        this.NoRetardo=NoRetardo,this.Amplitud=Amplitud,
        this.p2a,this.p2b, this.pantallaNext=pantallaNext
        this.activo=true,this.seleccion=false
        
        this.Coeficiente=1,this.flag=false
        this.centerX,this.centerY,this.d,this.e,//this.estoyaqui=false,
        this.CoefAncho=this.Coeficiente*this.Amplitud,
        this.CoefAlto=this.Coeficiente*this.Amplitud*this.relacion
        
        if(NoGraficas>0){
            for(let i=0;i<this.NoGraficas;i++){
                this.grafica[i]= new Image()
                this.grafica[i].src=this.srcGrafica+i+extension//".png"
                this.grafica[i].onload=function(){}
            }
        }
        
    }
    
    inicializar(){
        Lienzo.style.cursor = "default"
        this.Coeficiente=1
        this.flag=false
        pantalla=this.pantallaNext
        onRedimensionar()
        pos=-raj,posX=-raj,posY=raj
        Div2.style.display= pantalla===2?"inline-block":"none"

    }
    pVal(valor){ return this.CoefAncho*valor }
    gVal(valor){ return this.CoefAlto*valor }
        
    set dimensiones(valores){ [ this.d,this.e,this.centerX,this.centerY,this.p2a,this.p2b ]=valores.flatMap( (valor,posicion)=>posicion===0?[this.pVal(valor),this.gVal(valor)]:valor ) }
    
    setActivo(valor){ this.activo=valor}
    setSeleccion(valor) { this.seleccion=valor }
    EstoyAqui(evt){
        if(onArea(Lienzo,evt,this.centerX,this.centerY,this.p2a/2,this.p2b/2)){
            //this.flag=true
            //this.Coeficiente=0.95
             Lienzo.style.cursor = this.activo? "pointer":"default"
            return (true)
        }
        else{
            //this.flag=false
            //this.Coeficiente=1
            Lienzo.style.cursor = "default"
            return (false)
        } 
    }
    getActivo(){ return this.activo } 
    getSeleccion() {return this.seleccion }
    get vGrafica(){
        if(this.retardo<this.NoRetardo){
            this.retardo++
            return this.grafica[this.index]
        }
        else{
            this.retardo=0
            return this.grafica[this.index=this.index<this.NoGraficas-1?++this.index:this.index=0]
        }
    } 
}
class BOTON extends OBJETOGRAFICO {
    constructor(colorBase="white",colorResaltado="black",texto="",pantallaNext=1){
        super("","","","","",pantallaNext)
        this.texto=texto
        this.color=this.colorBase=colorBase
        this.AniBoto=1
        this.colorResaltado=colorResaltado
        
    }
    EstoyAqui(evt){
        if(super.EstoyAqui(evt)){
            this.flag=true
            this.color=this.colorResaltado //"#dd3cbd"
            this.AniBoto=0.95
            return (true)
        }
        else{
            this.flag=false
            this.color=this.colorBase
            this.AniBoto=1
            return (false)
        }
    }
    graficar(){
        onRoundRect(pincel,
            Math.floor(this.centerX-this.Coeficiente*this.p2a/2),
                Math.floor(this.centerY-this.Coeficiente*this.p2b/2),
                    Math.floor(this.Coeficiente*this.p2a+pos),
                        Math.floor(this.Coeficiente*this.p2b+pos),
                            this.color,this.texto,0.5,15,12,12,"#333",12,this.AniBoto)
    }
    inicializar(){
        super.inicializar()
        this.color=this.colorBase
        this.AniBoto=1
        index=0
    }
}
class IMAGEN extends OBJETOGRAFICO{
    constructor(srcGrafica,pantallaNext=1, resaltado=false,SrcResaltado="",rel=1,NoRetardo=0, Amplitud=1){
        super(srcGrafica,1,rel,NoRetardo, Amplitud,pantallaNext)
        
        this.resaltado=resaltado
        if(resaltado){
            this.imgResaltado= new Image()
            this.imgResaltado.src= SrcResaltado+".png"
            this.imgResaltado.onload=function(){}
        }
    }
    graficar(){
        pincel.drawImage((this.resaltado && this.flag)?this.imgResaltado:this.vGrafica,
            Math.floor(this.centerX-this.Coeficiente*this.d/2),
                Math.floor(this.centerY-this.Coeficiente*this.e/2),
                    Math.floor(this.Coeficiente*this.d),
                        Math.floor(this.Coeficiente*this.e));
    }
    EstoyAqui(evt){
        if(super.EstoyAqui(evt)){
            this.flag=true
            this.Coeficiente=0.9
            return (true)
        }
        else{
            this.flag=false
            this.Coeficiente=1
            return (false)
        }
    }
    
}
class ETIQUETA extends OBJETOGRAFICO {
    constructor(color="white",EstiloFuente="bold",colorfuente="black",fuente="arial",fSize="16",alineacionX="left",alineacionY="top",lineabase="top",paddingX=20,paddingY=20){
        super()
        this.color=color
        this.colorfuente=colorfuente
        this.fuente= fuente
        //this.EstiloFuente=EstiloFuente
        this.fSize=fSize
        this.alineacionX=alineacionX
        this.alineacionY=alineacionY
        this.lineabase=lineabase
        this.paddingX=paddingX
        this.paddingY=paddingY

        this.Texto= new TEXTO(EstiloFuente,colorfuente,fuente,fSize,alineacionX,alineacionY,lineabase)
    }
    graficar(texto){
        let x= Math.floor(this.centerX-this.Coeficiente*this.p2a/2)
        let y= Math.floor(this.centerY-this.Coeficiente*this.p2b/2)
        let Anchura= Math.floor(this.Coeficiente*this.p2a)
        let Altura= Math.floor(this.Coeficiente*this.p2b)
                
        onRoundRect(pincel,x,y,Anchura,Altura,this.color,"","",7,25,0,"#333",0)
        
        switch(this.alineacionX){
            case "left":
                this.Texto.graficar( texto, x+this.paddingX, y+this.paddingY, 0.8*Anchura)
            break
            case "center":
                this.Texto.graficar( texto, this.centerX, this.centerY, 0.8*Anchura)
            break
            case "right":
                this.Texto.graficar( texto, x+this.paddingX, y+this.paddingY, 0.8*Anchura)
            break

        }
    }
    inicializar(){
        
    }
}
class ETIQUETA_CENTRAL extends ETIQUETA{
    constructor(srcImg="",color="white",colorfuente="black",fuente="arial",fSize="16", rect=true, EstiloFuente=""){
        super(color,EstiloFuente,colorfuente,fuente,fSize,"center","center","middle")
        this.colorBase=this.color=color
        this.rect=rect
        
        this.srcImg=srcImg
        if(srcImg!=""){
            this.imagen=new Image()
            this.imagen.src=srcImg
            this.imagen.onload=function(){}
        }
    }
    graficar(texto=""){
        let x= Math.floor(this.centerX-this.Coeficiente*this.p2a/2)
        let y= Math.floor(this.centerY-this.Coeficiente*this.p2b/2)
        let Anchura= Math.floor(this.Coeficiente*this.p2a)
        let Altura= Math.floor(this.Coeficiente*this.p2b)
        let d=0.8*Anchura,e=0.9*Altura 
                
        if(this.rect){
            onRoundRect(pincel,x,y,Anchura,Altura,this.color)//,"","",7,25,0,"#333",0)

        }
        
        if(texto!=""){
            if(this.srcImg!=""){
                this.Texto.graficar( texto, this.centerX, 0.8*Altura)//, 0.9*Anchura)
                d=0.3*Anchura
                e=d/2
            }
            else{
                this.Texto.graficar( texto, this.centerX, 0.5*Altura, 0.9*Anchura,40)
                d=this.d
                e=this.e
            }
        }
        
        if(this.imagen!=""){
            pincel.drawImage(this.imagen,
                Math.floor(this.centerX-this.Coeficiente*d/2),
                    Math.floor(this.centerY-this.Coeficiente*e/2),
                        Math.floor(this.Coeficiente*d+pos),
                            Math.floor(this.Coeficiente*e+pos));
                            
        }
        
        
    }
    EstoyAqui(evt){
        if(super.EstoyAqui(evt)){
            this.flag=true
            this.Coeficiente=1.05
            return (true)
        }
        else{
            this.flag=false
            this.Coeficiente=1
            return (false)
        }
    }
    setColor(valor){
        this.color=valor
    }
    inicializar(){
        this.color=this.colorBase //"#66a329"
    }
}
class MARCOGRAFICO extends OBJETOGRAFICO {
    constructor(srcGrafica="",NoGraficas=1,color="white",texto="",rel=1,NoRetardo=0,Amplitud=1, pantallaNext=1){
        super(srcGrafica,NoGraficas,rel,NoRetardo,Amplitud, pantallaNext)
        this.color=color
        this.texto=texto
    }

    graficarRoundRect(){
        onRoundRect(pincel,
            Math.floor(this.centerX-this.Coeficiente*this.p2a/2),
                Math.floor(this.centerY-this.Coeficiente*this.p2b/2),
                    Math.floor(this.Coeficiente*this.p2a+pos),
                        Math.floor(this.Coeficiente*this.p2b+pos),
                            this.color,this.texto,this.coef)

    }
    graficarImagen(){
        pincel.drawImage(this.vGrafica,
            Math.floor(this.centerX-this.Coeficiente*this.d/2),
                Math.floor(this.centerY-this.Coeficiente*this.e/2),
                    Math.floor(this.Coeficiente*this.d+pos),
                        Math.floor(this.Coeficiente*this.e+pos));
    }
    graficar(){
        this.graficarRoundRect()
        this.graficarImagen()
    }

    EstoyAqui(evt){
        if(super.EstoyAqui(evt)){
            this.flag=true
            this.Coeficiente=0.95
            return (true)
        }
        else{
            this.flag=false
            this.Coeficiente=1
            return (false)
        }
    }
}


let YrMm=[]
for(let i=0;i<NoObjetos;i++){
    YrMm[i]=new MARCOGRAFICO(p2Ext[i],Noframes[i],p2color[i],
                                                    p2texto[i],
                                                                relacion[i],p2NoRetardo[i],p2Amplitud[i], pantallaNext[i])
}

let Etiqueta = new ETIQUETA("#5b14b7","bold","white","serif",20)
let boton=new BOTON("#f74395","#66a329","Empezar",3)//#5b14b7//#f74395
let home = new IMAGEN("./home",1,true,"./home1")
let home2 = new IMAGEN("./home",2,true,"./home1")
let siguente= new IMAGEN("./siguiente-b",1,true,"./siguiente-r")
let anterior= new IMAGEN("./anterior-b",1,true,"./anterior-r")
let sDesactivado=new IMAGEN("./siguiente-d")//,1,true,"./siguiente-r")
let aDesactivado=new IMAGEN("./anterior-d")//,1,true,"./siguiente-r")
let Titulo= new TEXTO("bold","black","arial",24,"center","middle")
let subTitulo= new TEXTO("","#f74395","arial",20,"center","middle")


//let _Pregunta = new TEXTO("","black","arial",40,"center","center","middle",40)
//let _Pregunta = new ETIQUETA_CENTRAL("./Avin3/RAJ/8.png","","black","arial",22,false) //"","white","","black","arial",40,false)

let opcion=[]//"./Avin3/RAJ/"+i+".png"
for(let i=0;i<NoOpciones*NoPreguntas;i++){
    opcion[i]= new ETIQUETA_CENTRAL("./Avin3/RAJ/"+i+".png")
}

function onRedimensionar(){
    let Cx,Cy,p2a,p2b

    Lienzo.width=window.innerWidth;//Math.floor(window.innerWidth);
    Lienzo.height=window.innerHeight;//Lienzo.width/ResolucionP
    //console.log(Lienzo.width,Lienzo.height)   
    factorX=Lienzo.width/anchoLienzoInicial;
    factorY=Lienzo.height/alturaLienzoInicial;
   
    AnchoEncabezado=Math.floor( 0.90*factorX*Encabezado.width);//Math.floor(0.65*Lienzo.width);
    AltoEncabezado=Math.floor(0.80*factorY*Encabezado.height)//Math.floor(AnchoEncabezado/4);
    EncabezadoX=Math.floor(Lienzo.width/2-AnchoEncabezado/2);
    AnchoDecoracion=Math.floor(1.5*factorX*Decoracion.width)
    AltoDecoracion=Math.floor(Lienzo.height)
    DecoracionX=Math.floor(Lienzo.width-AnchoDecoracion)
    DecoracionY=0
    
    switch(pantalla){
        case 1:
            p2x=0.05*Lienzo.width;
            p2ancho=0.9*Lienzo.width//(Lienzo.width-2*p2x);
            p2b=p2a=p2ancho/(1.25*NoObjetos-0.25)
            p2Altura= Lienzo.height-EncabezadoY-AltoEncabezado;
            p2alto = 0.6*p2Altura;
            p2y=EncabezadoY+AltoEncabezado+0.07*p2Altura;
                                
            for(let i=0; i<NoObjetos;i++){
                YrMm[i].dimensiones=[0.6*p2a,p2x+p2a*(5*i+2)/4,p2y+0.5*p2alto,p2a,p2b] //[Math.floor(0.6*p2a),Math.floor(p2x+p2a*(5*i+2)/4),Math.floor(p2y+0.5*p2alto)] 
            }
        break

        case 2:
            p2a=0.16*Lienzo.width
            p2b=0.35*Lienzo.height
            Cx=0.65*Lienzo.width+p2a/2
            Cy=0.35*Lienzo.height+p2b/2
            Etiqueta.dimensiones=[0.85*p2a,Cx,Cy,p2a,p2b]
            
            Cy +=p2b/2
            p2a=0.23*Lienzo.width
            p2b=0.20*p2a
            Cy=Cy+20+p2b/2
            boton.dimensiones=[0,Cx,Cy,p2a,p2b]
            
            Cx=0.05*Lienzo.width
            Cy=0.92*Lienzo.height
            home.dimensiones=[48*factorY,Cx,Cy,48*factorY,48*factorY]
        break
        case 3:
            /*p2a=Lienzo.width
            p2b=0.6*Lienzo.height
            Cx=0.5*Lienzo.width
            Cy=0.3*Lienzo.height

            _Pregunta.dimensiones=[p2a,Cx,Cy,p2a,p2b]*/

            Cx=0.05*Lienzo.width
            Cy=0.05*Lienzo.height
            home2.dimensiones=[48*factorY,Cx,Cy,48*factorY,48*factorY]
                       
            p2a=0.25*Lienzo.width
            p2b=0.30*Lienzo.height
            Cy=0.5*Lienzo.height+p2b/2
            
            let CorX=[0.05*Lienzo.width+p2a/2,Lienzo.width/2,Lienzo.width-p2a/2-0.05*Lienzo.width]
            for(let i=0;i<NoOpciones*NoPreguntas;i+=NoOpciones){
                for(let j=0;j<NoOpciones;j++){
                    opcion[i+j].dimensiones=[0.7*p2a,CorX[j],Cy,p2a,p2b]

                }
                
            }
           
            Cx=Lienzo.width/2+0.05*Lienzo.width
            Cy=0.92*Lienzo.height
            siguente.dimensiones=[56*factorY,Cx,Cy,56*factorY,56*factorY]
            sDesactivado.dimensiones=[56*factorY,Cx,Cy,56*factorY,56*factorY]
            
            Cx=Lienzo.width/2-0.05*Lienzo.width
            Cy=0.92*Lienzo.height
            anterior.dimensiones=[56*factorY,Cx,Cy,56*factorY,56*factorY]
            aDesactivado.dimensiones=[56*factorY,Cx,Cy,56*factorY,56*factorY]
        break

    }
}

window.addEventListener("resize", onRedimensionar);

Lienzo.addEventListener("mousemove",function(evt){
    switch(pantalla){
        case 1:
            for(let i=0;i<NoObjetos;i++){
                if(YrMm[i].EstoyAqui(evt)){
                    break
                }
                else{
                    continue
                }
            }
        break

        case 2:
            if(!boton.EstoyAqui(evt)){
                home.EstoyAqui(evt)
            }
        break
        case 3:
            if(!home2.EstoyAqui(evt)){
                if(!siguente.EstoyAqui(evt) || !siguente.getActivo()){
                    //if(!sDesactivado.EstoyAqui(evt)){
                        if(!anterior.EstoyAqui(evt) || !anterior.getActivo()){
                            for(let i=0;i<NoOpciones;i++){
                                if(opcion[NoOpciones*index+i].EstoyAqui(evt)){
                                    break
                                }
                            }
                        }
                    //}
                }
            }
        break
    }
}, false);
Lienzo.addEventListener("click",function(){
    switch(pantalla){
        case 1:
            for(let i=0;i<NoObjetos;i++){
                if(YrMm[i].flag){
                    switch(i){
                        case 0:
                            YrMm[i].inicializar()
                        break
                        case 1:
                            
                        break

                        default:
                            pantalla=1
                    }
                break
                }
                else{
                    //pantalla=1
                }
            }
        break

        case 2:
            if(home.flag){
                home.inicializar()
            }
            else{
                if(boton.flag){
                    boton.inicializar()
                }
            }
        break
        case 3:
            if(home2.flag){home2.inicializar()}
            else{
                if(siguente.flag){
                    if( siguente.getActivo()){
                        if(opcion[NoOpciones*index].getSeleccion() || opcion[NoOpciones*index+1].getSeleccion() || opcion[NoOpciones*index+2].getSeleccion()){
                            if(index<NoPreguntas-1){
                                if(index==NoPreguntas-2){
                                    Lienzo.style.cursor="default"
                                }
                                index++
                            }
                        }
                        else{
                            alert("Debe seleccionar al menos una de las tres opciones posibles")
                        }                
                    }
                }
                else{
                    if(anterior.flag){
                        if(anterior.getActivo()){
                            if(opcion[NoOpciones*index].getSeleccion() || opcion[NoOpciones*index+1].getSeleccion() || opcion[NoOpciones*index+2].getSeleccion()){
                                if(index>0){
                                    if(index==1){
                                        Lienzo.style.cursor="default"
                                    }
                                    index--
                                }
                            }
                            else{
                                alert("Debe seleccionar al menos una de las tres opciones posibles")
                            }
                        }
                    }
                    else{
                        for(let i=0;i<NoOpciones;i++){
                            if(opcion[NoOpciones*index+i].flag){
                                opcion[NoOpciones*index+i].setColor(COLOR_RESALTADO)
                                opcion[NoOpciones*index+i].setSeleccion(true)
                            }
                            else{
                                opcion[NoOpciones*index+i].setColor(COLOR_ETIQUETAS)
                                opcion[NoOpciones*index+i].setSeleccion(false)
                            }
                        }
                    }
                }
                
            }
        break
    }
}, false);

function oMousePos(pLienzo,evt) {
    var rect = pLienzo.getBoundingClientRect();
    return { // devuelve un objeto
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    }
}
function onArea(Lienzo,evt,Cx,Cy,espacioX,espacioY){
    CxyRaton = oMousePos(Lienzo,evt);
    return( ( CxyRaton.x>(Cx-espacioX) && CxyRaton.x<(Cx+espacioX) )
        &&  ( CxyRaton.y>(Cy-espacioY) && CxyRaton.y<(Cy+espacioY) )
    ? true:false );
}
function onRoundRect(ctx,x,y,width,height,color,txt="",coef=0.9, radius=15, blur=12,OffsetX=12,shadowColor="#333",OffsetY=12,AniBoto=1){
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.save()
	ctx.shadowBlur=blur;
	ctx.shadowOffsetX=OffsetX;
	ctx.shadowOffsetY=OffsetY;
    ctx.shadowColor= shadowColor;
    ctx.beginPath();
    ctx.moveTo(x,y+radius);
    ctx.lineTo(x,y+height-radius);
    ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
    ctx.lineTo(x+width-radius,y+height);
    ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
    ctx.lineTo(x+width,y+radius);
    ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
    ctx.lineTo(x+radius,y);
    ctx.quadraticCurveTo(x,y,x,y+radius);
    ctx.fill();
    ctx.restore()  
    ctx.stroke();
    ctx.closePath();
    
    let fuente="bolder "+Math.floor(20*factorX*AniBoto)+"px serif";//"bolder 18px serif"
    if(txt!=""){
        ctx.fillStyle="white";
        ctx.font = fuente;
        ctx.textAlign ="center";
        ctx.textBaseline = "middle";
        ctx.fillText(txt, x+ width/2,y+coef*height);
    } 
}
function Pantallazo(){
    pincel.drawImage(Decoracion,DecoracionX,DecoracionY,AnchoDecoracion,AltoDecoracion);
    pincel.drawImage(Encabezado,EncabezadoX,EncabezadoY,AnchoEncabezado,AltoEncabezado);
}

function graficar(){
    switch(pantalla){
        case 1:
            Pantallazo()
            for(let i=0; i<NoObjetos;i++){
                YrMm[i].graficar();
            }
        break

        case 2:
            Pantallazo()
            Etiqueta.graficar(TEXTO_ETIQUETA)
            boton.graficar()
            home.graficar()
        break
        case 3:
            //pincel.drawImage(Decoracion,DecoracionX,DecoracionY,AnchoDecoracion,AltoDecoracion);
            onRoundRect(pincel,0,0.12*Lienzo.height,Lienzo.width,0.88*Lienzo.height,"#bae1f7","",1,5)//#F8F9F9//#F4F6F6//#FDFEFE 
            home2.graficar()
            Titulo.graficar("QUIZ",Lienzo.width/2,0.03*Lienzo.height)
            subTitulo.graficar("PREGUNTA "+(index+1)+"/"+NoPreguntas, Lienzo.width/2,0.08*Lienzo.height)
            pincel.drawImage(question[index],
                Math.floor(Lienzo.width/2-factorX*question[index].width/2),
                    Math.floor(0.14*Lienzo.height),
                        Math.floor(factorX*question[index].width),
                            Math.floor(factorY*question[index].height))
            
            for(let i=0;i<NoOpciones;i++){
                opcion[NoOpciones*index+i].graficar()
            }
            
            if(index<NoPreguntas-1){
                siguente.setActivo(true)
                siguente.graficar()
            }
            else{
                siguente.setActivo(false)
                sDesactivado.graficar()
            }
            if(index>0){
                anterior.setActivo(true)
                anterior.graficar()
            }
            else{
                anterior.setActivo(false)
                aDesactivado.graficar()
            }
                
        break

    }
    pos=posX>raj?posX-=AceleracionAnimacion:(posY<0?posY+=AceleracionAnimacion:0)
    
}    
    
function Dibujo(){
    pincel.clearRect(0,0,Lienzo.width,Lienzo.height);
    graficar();
    setTimeout(()=>window.requestAnimationFrame(Dibujo), 40);
}

function onInicio(){
    onRedimensionar();
    Dibujo();
}