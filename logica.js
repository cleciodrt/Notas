const cores = ["darkred", "darkgreen", "dodgerblue", "darkgrey", "darkorange", "darksalmon", "darkcyan", "rosybrown"];
const parenteNotas = document.querySelector("#principal");
var blocoInteiro = moverEste = quantosBlocos = undefined;
var conteudoNotas = [];
var coluna = linha = 0;
var conteudo = true;

window.onload = () => {

  // =Criar------------------------------------------------------------------------------------------------------------------->
  const mostrar = criar.onclick = (evento) => {

    if (conteudo || conteudoNotas[0] == quantidade.innerText) {

      const id = new Date().getTime();
      parenteNotas.innerHTML += 
      `
        <hgroup id=e${ id } class="bloco">
          <hgroup id="acessorios">
            <div class="mover">
              <i class="fa-sharp fa-solid fa-arrows-up-down-left-right"></i>
            </div>
            <div class="colorir">
              <i class="fa-sharp fa-solid fa-brush"></i>
            </div>
            <div class="deletar">
              <i class="fa-sharp fa-solid fa-trash"></i>
            </div>
          </hgroup>
          <textarea class="nota" placeholder="Escreva aqui"></textarea>
        </hgroup>
      `;

      // =Quantidade---------------------------------------------------------------------------------------------------------->
      
      blocoInteiro = document.querySelectorAll(".bloco"); // Está sendo usado em Global
      quantosBlocos = blocoInteiro.length; // Diz quantos blocos existem
      quantidade.innerText = quantosBlocos; 
      
      // =Posicionamento------------------------------------------------------------------------------------------------------>
      
      if (coluna < (innerWidth - 400)) {
        coluna = quantosBlocos * 100;
        if (quantosBlocos > 10) {
          coluna = (quantosBlocos - 10) * 100;
        }
        if (quantosBlocos > 20) {
          coluna = (quantosBlocos - 20) * 100;
        }
      } else {
        coluna = 100;
        if (linha < 600) {
          linha += 300;
        }
      }
      
      document.querySelector(`#e${ id }`).style.top = `${ linha }px`;
      document.querySelector(`#e${ id }`).style.left = `${ coluna }px`;

      // =Cor----------------------------------------------------------------------------------------------------------------->
      
      blocoInteiro[blocoInteiro.length - 1].style.background = cores[Math.round(Math.random() * cores.length)];

      // =Funções------------------------------------------------------------------------------------------------------------->
      let rodada = indiceCor = 0;
      while (rodada < quantosBlocos) {

        blocoInteiro[rodada].ontouchmove = blocoInteiro[rodada].onmousedown = (procurar) => {

          const funcao = procurar.srcElement.className;
          const parente = procurar.srcElement.offsetParent.id;
          const objeto = document.querySelector(`#${ parente }`);
          
          let ids = [];
          for (const x of blocoInteiro) {
            ids.push(x.id);
          }
          let numero = ids.indexOf(objeto.id);

          switch (funcao) {
            case 'colorir':

              objeto.style.background = cores[indiceCor];
              indiceCor++;
              if (indiceCor === cores.length) indiceCor = 0;
              
              break;
            case 'mover':

              // =Deixar de Mover--------------------------------------------------------------------------------------------->
              moverEste = objeto;
              window.onmouseup = moverEste.onmouseup = () => {
                moverEste = undefined;
                document.body.classList.remove('movimentacao');
              }

              document.body.classList.add('movimentacao');

              break;
            case 'deletar':

              objeto.classList.add("desaparecer");
              objeto.onanimationend = () => {
                objeto.remove();
                blocoInteiro = document.querySelectorAll(".bloco");
                quantidade.innerText = blocoInteiro.length;
                quantosBlocos--;

                conteudoNotas.splice(numero + 1, 1);
                conteudoNotas[0] = blocoInteiro.length;
                localStorage.setItem('conteudoNotas', JSON.stringify(conteudoNotas));
              }

              break;
            case 'nota':

              objeto.onkeyup = (digitando) => {
                
                let ids = [];
                for (const x of blocoInteiro) {
                  ids.push(x.id);
                }
                numero = ids.indexOf(objeto.id);
              
                if (isNaN(conteudoNotas[0]) === false) {
                  conteudoNotas[0] = ids.length;
                } else {
                  conteudoNotas.push(ids.length);
                }
                conteudoNotas[numero + 1] = digitando.target.value;
                localStorage.setItem('conteudoNotas', JSON.stringify(conteudoNotas));

              };

              break;
            default:
          };
        
          // =Sobreposição---------------------------------------------------------------------------------------------------->
          for (const x of blocoInteiro) {
            x.style.zIndex = 1;
          }
          objeto.style.zIndex = Number(quantosBlocos) + 1;

        };

        rodada += 1;
      };

      // =Sobrepõe / Reescrever----------------------------------------------------------------------------------------------->
      let i = 0;
      for (const x of blocoInteiro) {
        x.style.zIndex = 1;

        x.children[1].value = conteudoNotas[i + 1];
        i++;
        if (x.children[1].value === 'undefined') {
          x.children[1].value = '';
        }
      }
      
      if (i == conteudoNotas[0] || conteudoNotas[0] === undefined) {
        conteudo = false;
      }
    };

  };
  
  // =Carregar---------------------------------------------------------------------------------------------------------------> 
  const carregar = (procurar) => {

    const criarNota = Number(JSON.parse(localStorage.getItem('conteudoNotas'))[0]);
    
    if (isNaN(criarNota) !== true && criarNota > 0) {
      let x = 0;
      const repeticao = setInterval(() => {
        
        conteudoNotas = JSON.parse(localStorage.getItem('conteudoNotas'));
        x++;
        mostrar(this);
        
        if (x === Number(criarNota)) {
          clearInterval(repeticao);
          conteudo = false;
        };

      }, 5);
    };

  };

  carregar(this);
  
  document.body.onmouseup = () => {
    moverEste = undefined;
    document.body.classList.remove('movimentacao');
  };
  
};

// =Movimentação-------------------------------------------------------------------------------------------------------------> 
window.ontouchmove = window.onmousemove = (evento) => {
  
  // =Começar a Mover------------------------------------------------------------------------------------------------------->
  const porcentagem = (innerWidth * 0.3) + 100;
  if (moverEste != undefined) {

    if (evento.y > 120 || evento.x > porcentagem) {
      moverEste.style.top = `${ evento.y - 134 }px`;
      moverEste.style.left = `${ evento.x - 40 }px`;
    };

  };

};