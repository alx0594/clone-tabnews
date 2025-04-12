# Dia 2

## O que é Git e GitHub.
* Podemos comparar Git e GitHub com o Youtube:
    O arquivo .mp4 (local) seria por exemplo o repositório .git (local)
    O Youtube Hospeda Vídeo e o GitHub hospeda repositório.

# Dia 3
## Instalar nvm no windows
1. Acessar: https://github.com/coreybutler/nvm-windows/releases/tag/1.2.2
2. Baixar e executar: nvm-setup.exe
3. Instalar versão do nodejs: nvm install 18.14.2
4. Verificar versões nvm ls
* curiosidade .npmrc, .nvmrc, .bashrc, .vimrc; onde rc significa Run Commands, convesão de arquivos de inicialização.

## Criar arquivo de manifesto e dependências.
1. `npm init`, preencher apeans a licença como MIT.
2. `npm install next@13.1.6`
3. `npm install react-dom@18.2.0`

`react`
    **Função Principal:** Biblioteca core do React. (cérebro)
    **O que faz:** Fornece as funcionalidades funcamentais para criar componentes, manipular estados (`useState, useEffect`, etc) e lidar com o sistema de reativdade do React. Ele só cuida da lógica, estrutura e reatividade.
    **Exemplo** `import React { useState } from 'react'`;

`react-dom`
    **Função Principal:** Integra o React com o DOM do navegador. (mão)
    **O que faz:** Permite renderizar os componentes React na página HTML. Ou seja, ele pega os componentes criados com react e insere no DOM real da aplicação
    **Exemplo** `const root = ReactDOM.createRoot(document.getElementById('root'))`;
    `root.render(<App />)`;

# Dia 4

## Protocolos
* Tipos de protocolos: HTTP, FTP, SMTP

## Executar aplição:
1. Criar script no package.json: "dev": "next dev"
2. `npm run dev`
* Next utiliza Roteamento Baseado em Arquivos

### Criando diretório de páginas
1. criar pasta **pages** Tudo que estiver dentro dela, o Next entederá como uma página, rota pública.
2. Criar um arquivo `index.js`, adicionando simplesmente um componente React: 
```
function Home() {
    return <h1> Teste </h1>
}
export default Home
```
### Disponibilizar serviço na internet usando VSCODE
1. No terminal, clicar na função PORTS >> Port forward
2. Alterando visibilidade de Private para Public. Clicar com botão direito em Visibility >> Port Visibility >> Public
3. A URL poderá ser acessada de qualquer dispositivo: https://qr7jcj61-3000.brs.devtunnels.ms/


# Dia 5

## Onde fica o Git?
Git é um Sitema de controle de versão distribuído.

## Git Log
* ` git log`
* `git long --oneline`

## Git commit
* 3 Estágios:
    0. Untracked (arquivos que ainda não estão sendo ratreados/gerenciados/desconhecido pelo git)
    1. Modificado (modified) 
    2. Staged (Alterações que serão confirmadas, após adicionadas (add))
    3. Commit (foto do estado atual, comprometimento, salvar alterações)

## Git Diff e Amend
* Emendar um commit amend...
* git diff 
* `git commit --amend`  (o git vai pegar o que está staged, ou seja, tudo que foi adicionado pelo comando add, e emendar em um commit anterior)
### Passos
1. `git log --oneline` (Pegar hash do commit): 4087ce5
2. Fazer alteração do arquivo desejado (modified)
3. Adicionar em staged (git add)
4. Emendar alteração com commit anterior: `git commit --amend`. (Pronto, alteração emendada com commit anterior)
5. git log --oneline (verificar hash do commit): b18996d -> O identificador do commit mudou! **Portanto, os commits são imultáveis.**


# Dia 6
## Git Push
* Olhando as alterações via `git status` o git enfatiza que a branch local está com um commit a frente da origin branch (branch remota):
> **On branch main** Your branch is **ahead** of 'origin/main' **by 1 commit**. (use "git push" to publish your local commits)
* Agora verificando o `git status`, a mensagem do git é que a branch local está atualizada com a branch remota (origin)
> Your branch **is up to date** with 'origin/main'.

## Commits mais rápidos

