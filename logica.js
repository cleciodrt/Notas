const cores = ["darkred", "darkgreen", "dodgerblue", "darkgrey", "darkorange", "darksalmon", "darkcyan", "rosybrown", "#232428"];
const parenteNotas = document.querySelector("#principal"), principal = document.querySelector("main");
var blocoInteiro = moverEste = quantosBlocos = undefined;
var conteudoNotas = [], corDasNotas = [];
var coluna = linha = 0;
var conteudo = true;

window.onload = () => {

  // =Criar------------------------------------------------------------------------------------------------------------------->
  const mostrar = nova.onclick = (evento) => {

    if (conteudo || conteudoNotas[0] == notas.innerText) {
      
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
          <input type="text" placeholder="Titulo" class="titulo" name="titulo" />
          <textarea class="nota" placeholder="Nota" name="nota"></textarea>
        </hgroup>
      `;

      // =Quantidade---------------------------------------------------------------------------------------------------------->
      blocoInteiro = document.querySelectorAll(".bloco"); // Está sendo usado em Global
      quantosBlocos = blocoInteiro.length; // Diz quantos blocos existem
      notas.innerText = quantosBlocos;

      // =Funções------------------------------------------------------------------------------------------------------------->
      let rodada = indiceCor = 0;
      while (rodada < quantosBlocos) {

        const funcoes = blocoInteiro[rodada].onmousedown = (procurar) => {

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

              corDasNotas[numero] = {
                posicao: numero,
                cor: cores[indiceCor],
              };

              localStorage.setItem('corDasNotas', JSON.stringify(corDasNotas));
              
              if (cores[indiceCor] !== '#232428') {
                objeto.style.border = "1px solid transparent";
              } else {
                objeto.style.border = "1px solid white";
              }
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
                notas.innerText = blocoInteiro.length;
                quantosBlocos--;

                conteudoNotas.splice(numero + 1, 1);
                conteudoNotas[0] = blocoInteiro.length;
                localStorage.setItem('conteudoNotas', JSON.stringify(conteudoNotas));

                delete corDasNotas[numero];
                localStorage.setItem('corDasNotas', JSON.stringify(corDasNotas));
              }

              break;
            case 'titulo':

              objeto.onkeyup = (digitando) => {
                  
                if (digitando.key !== 'Tab') {
                  if (isNaN(conteudoNotas[0]) === false) {
                    conteudoNotas[0] = ids.length;
                  } else {
                    conteudoNotas.push(ids.length);
                  }

                  conteudoNotas[numero + 1] = {
                    titulo: digitando.target.value,
                    nota: digitando.view.blocoInteiro[numero].children[2].value,
                  };
                  localStorage.setItem('conteudoNotas', JSON.stringify(conteudoNotas));
                }

              };

              break;
            case 'nota':

              objeto.onkeyup = (digitando) => {
                
                if (digitando.key !== 'Tab') {
                  if (isNaN(conteudoNotas[0]) === false) {
                    conteudoNotas[0] = ids.length;
                  } else {
                    conteudoNotas.push(ids.length);
                  }

                  conteudoNotas[numero + 1] = {
                    titulo: digitando.view.blocoInteiro[numero].children[1].value,
                    nota: digitando.target.value,
                  };
                  localStorage.setItem('conteudoNotas', JSON.stringify(conteudoNotas));
                }

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
        
        if (outerWidth < 500) {
          blocoInteiro[rodada].onclick = () => funcoes;
        }
        
        rodada += 1;
      };
      
      // =Animação ao adicionar----------------------------------------------------------------------------------------------->
      if (evento.type === 'click') {
        const este = document.querySelector(`#e${ id }`);
        este.classList.add('aparecer');
        este.onanimationend = () => {
          este.classList.remove('aparecer');
        }
      }

      // =Sobrepõe / Reescrever----------------------------------------------------------------------------------------------->
      let i = 0;
      if (i == conteudoNotas[0] || conteudoNotas[0] === undefined) {
        conteudo = false;
      }
      
      for (const x of blocoInteiro) {
        x.style.zIndex = 1;

        i++
        x.children[1].value = conteudoNotas[i].titulo;
        x.children[2].value = conteudoNotas[i].nota;
      }
    };

  };
  
  // =Carregar---------------------------------------------------------------------------------------------------------------> 
  const carregar = (procurar) => {

    if (localStorage.getItem('corDasNotas') !== null) {
      corDasNotas = JSON.parse(localStorage.getItem('corDasNotas'));
    }

    if (localStorage.getItem('conteudoNotas') !== null) {

      const criarNota = Number(JSON.parse(localStorage.getItem('conteudoNotas'))[0]);
      if (isNaN(criarNota) !== true && criarNota > 0 && criarNota !== undefined) {
        let x = 0;
        const repeticao = setInterval(() => {
          
          conteudoNotas = JSON.parse(localStorage.getItem('conteudoNotas'));
          x++;
          mostrar(this);
          
          if (x === Number(criarNota)) {
            clearInterval(repeticao);
            conteudo = false;
  
            // =Cor----------------------------------------------------------------------------------------------------------->
            for (const x of corDasNotas) {
              if (x !== null) {
                if (x.cor !== '#232428') {
                  blocoInteiro[x.posicao].style.border = '1px solid transparent';
                }
                blocoInteiro[x.posicao].style.background = x.cor;
              }
            }
          };
  
        }, 5);
      };

    }

  };

  carregar(this);
  
  // =Desgrudar movimentação-------------------------------------------------------------------------------------------------> 
  document.body.onmouseup = () => {
    moverEste = undefined;
    document.body.classList.remove('movimentacao');
  };
  
  // =Troca de plataforma----------------------------------------------------------------------------------------------------> 
  if (outerWidth <= 500) {
    document.body.classList.add('celular');
  }

};

window.onkeyup = (evento) => {
  // if (evento.key === 'q') {
  //   mostrar();
  // }
}

// =Movimentação-------------------------------------------------------------------------------------------------------------> 
window.ontouchmove = window.onmousemove = (evento) => {

  const porcentagem = (innerWidth * 0.3) + 100;
  if (moverEste != undefined) {

    if (evento.y > 120 || evento.x > porcentagem) {
      moverEste.style.position = 'absolute';
      moverEste.style.top = `${ evento.y - 134 }px`;
      moverEste.style.left = `${ evento.x - 40 }px`;
    };

  };

};

// =Troca de plataforma----------------------------------------------------------------------------------------------------> 
window.onresize = () => {

  if (outerWidth <= 500) {
    document.body.classList.add('celular');
  } else {
    document.body.classList.remove('celular');
  };

};