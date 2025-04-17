# Dia 2

## O que é Git e GitHub.

- Podemos comparar Git e GitHub com o Youtube:
  O arquivo .mp4 (local) seria por exemplo o repositório .git (local)
  O Youtube Hospeda Vídeo e o GitHub hospeda repositório.

# Dia 3

## Instalar nvm no windows

1. Acessar: https://github.com/coreybutler/nvm-windows/releases/tag/1.2.2
2. Baixar e executar: nvm-setup.exe
3. Instalar versão do nodejs: nvm install 18.14.2
4. Verificar versões nvm ls

- curiosidade .npmrc, .nvmrc, .bashrc, .vimrc; onde rc significa Run Commands, convesão de arquivos de inicialização.

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

- Tipos de protocolos: HTTP, FTP, SMTP

## Executar aplição:

1. Criar script no package.json: "dev": "next dev"
2. `npm run dev`

- Next utiliza Roteamento Baseado em Arquivos

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

- ` git log`
- `git long --oneline`

## Git commit

### 3 Estágios:

0. Untracked (arquivos que ainda não estão sendo ratreados/gerenciados/desconhecido pelo git)
1. Modificado (modified)
2. Staged (Alterações que serão confirmadas, após adicionadas (add))
3. Commit (foto do estado atual, comprometimento, salvar alterações)

## Git Diff e Amend

- Emendar um commit amend...
- git diff
- `git commit --amend` (o git vai pegar o que está staged, ou seja, tudo que foi adicionado pelo comando add, e emendar em um commit anterior)

### Passos

1. `git log --oneline` (Pegar hash do commit): 4087ce5
2. Fazer alteração do arquivo desejado (modified)
3. Adicionar em staged (git add)
4. Emendar alteração com commit anterior: `git commit --amend`. (Pronto, alteração emendada com commit anterior)
5. git log --oneline (verificar hash do commit): b18996d -> O identificador do commit mudou! **Portanto, os commits são imultáveis.**

# Dia 6

## Git Push

- Olhando as alterações via `git status` o git enfatiza que a branch local está com um commit a frente da origin branch (branch remota):
  > **On branch main** Your branch is **ahead** of 'origin/main' **by 1 commit**. (use "git push" to publish your local commits)
- Agora verificando o `git status`, a mensagem do git é que a branch local está atualizada com a branch remota (origin)
  > Your branch **is up to date** with 'origin/main'.

# Dia 7

### Client x Server (Cliente x Servidor)

> Fazendo uma analogia a um restaurante, o cliente faz um pedido ao garçon (servidor) que retorna com o prato de comida solicitado pelo cliente.
> O grançon também faz o papel de cliente quando repassa o pedio para cozinheiro. Cliente -> Garnçon -> Cozinheiro.
> Cliente (Navegador) -> Server (Vercel, onde o site está hospedado) -> Server (Banco de dados)

### Deploy e hospedagem do site

1. Vercel: vercel.com
2. Para autenticação, usar GitHub. Lay Number
3. Importar repositório do GitHub (Import Git Repository) >> Import >> Deploy

# Dia 8

> Não desistir no meio do caminho. Ir até o final.
> Modelo Orgânico vs Modelo 3D. O modelo orgânico é uma boa opção!

# Dia 9

## Criando Milestones e Issues do Projeto

> O objetivo das Milestones e Iussues e conseguir quebrar grandes tarefas em tarefas menores e viáveis, de forma a engajar o cérebro no sentido de que está havendo progresso.

> Milestone e Issue possibilita ver o progresso da construção de uma aplicação de forma organizada. Entender o que foi feito e o que ainda precisa ser realizado.

1. No repositório, clicar em Issues, em seguida clicar em Milestone. Nome: Milestone 0: "Em Construção"
2. Clicar em Issues novamente, criar nova issues. Nome: "Configurar domínio .com.br", vincular a Issue a Milestone 0: "Em Construção"

# Dia 10

### Ligar sincronização do editor (codespaces):

1. No ínone de conta do VSCode, selecionar opção Settings Sync, em seguida logar em uma conta na nuvem, no caso no GitHub. Com isso, as configurações do ambiente/IDE ficarão salvas.

### Configurar EditorConfig

> Para configurar o código no formato certo, respeitando mesmos espaçamentos, distância entre linhas, etc.

1. Documentação: https://editorconfig.org/
2. Instalar o plug-in do editorconfig
3. Criar arquivo na raiz do projeto: `.editorconfig`.
4. No `.editorconfig` conseguimos especificar em quais pastas/diretórios do projeto as regras deverão ser aplicadas, no caso `root = true` para ser aplicado em todo o projeto.
5. No `.editorconfig` definir que as regrades deverá ser aplicadas em todos arquivos [*]
6. No `.editorconfig` padronizar identação: `indent_style = space` e `indent_size = 2`

### Configurar Pettier no package.json

1. Instalar Prettier: `npm install prettier -D` (-D para instalr como dependência de desenvolvimento)

2. Adicionar comando de checagem do prettier dentro do script do package.json:
   `"lint:check": "prettier --check ."` O ponto (.) faz com que seja verificado o diretório corrente como um todo.

3. Executando o comando: `npm run lint:check` (Irá conferir a formatação do código)

4. Adicionar comando dentro de scripts package.json que ajustará os arquivos:
   `"lint:fix": "prettier --write ."` (Escreverá nos arquivos para que fiquem devidamente estilizados)

5. Executar comando para ajustar os arquivos: `npm run lint:fix`

### Configurar Pettier na IDE VSCode

1. Instalar extensão Prettier
2. Configurar estilização do prettier com padrão da IDE:
   > Settings >> Settings >> Buscar por formatter
   > Em Default Formatter, selecionar Prettier

### Configurar Formatar ao Salvar (On Save) na IDE VSCode

1. Em Settings >> Settings, buscar por: format on save >> Selecionar checkbox.
   > Isso sempre formatará os arquivos assim que salvos.

### Adicionar arquivo .prettierignore

> Em casos de arquivos que não queremos interação do prettier, podemos adicionar o arquivo .prettierignore e adicionar arquivos ou pastas que devem ser ignorados (Ex.: .next)

# Dia 11

### DNS

> Domínios não passam de apelidos para os IP's.

> DNS - Domain Name System (Sistema de Nomes de Domínios)

> DNS aplido para traduzir para o IP final.

> Um exemplo seria os contatos telefônicos que temos, fica mais fácil vincular o nome do contato ao número de telefone, imagina se houvesse apenas o número, como saberiamos de quem ele é?

> Como funciona: Nosso dispositivo acesso o servidor de DNS, que por sua vez resolve o IP do DNS, retornando para o computador de volta, que ai sim, chama o site em questão:

![alt text](images/dns-resolve.png)

- Desafio, descobrir o IP do domínio: curso.dev

  ping curso.dev -> 104.26.13.195

# Dia 12

## DNS Parte II

> Banco de dados TLD?

> Registro de um domínio pode ser realizado em: registro.br

> NIC.br: Registry (Responsável por armazenar todos os domínios .br e os respectivos IP's no Brasil)

> NIC - Núcleo de Informação e Coordenação do Ponto BR (nic.br)

> Verificar registro do DNS: whatsmydns.net

### Passos para registrar um DSN:

1. Entrar no site: registro.br
2. Realizar autenticação
3. Pesquisar por DNS ainda não cadastrado.
4. Solicitar cadastro do DNS.
5. Após confirmação, chegará e-mail para efetura pagamento do DNS.
6. Pronto DNS registrado. O domínio poderá ser consultado no site: whatsmydns.net (Pode levar algum tempo)

### Configurar o servidor de DNS:

- Com base na imagem, o fluxo completo para registrar um domínio e configurar um servidor de DNS segue os seguintes passos:
  ![alt text](images/fluxo-registro-dns.png)
  1. Eu como registrante, registro um domínio em registro.br
  2. Registro.br disponibilizará o domínio no Registry NIC.br, onde tem todos os domínios .br
  3. O TLD, após configurado o DNS em registro.br, aponstará para os servidores da Vercel, que por sua vez será o servidor autoritativo.

### Passos para configurar o Servidor DNS

1. Acessar a Vercel, onde o site está hospedado, clicar em Domains.
2. Em Seguida, clicar em Add Existing Domain, selecionar aplicação, continue.
3. Digitar o domínio cadastrado em registro.br (alxtab.com.br)
4. Em Nameserver, copiar os nameservers
5. Acessar registro.br,acessar o domínio alxtab.com.br, em seguida clicar em alterar DNS Server
6. Adicionar os nameservers copiados da Vercel nos campos Servidor 1 e Servidor 2.
7. No site whatsmydns.net, verificar se os serversname foram atualizados (leva em torno de 2h).

### Servidor Autoritativo

> O Servidor Autoritativo, no nosso caso é o da Vercel, é quem sabe que com base no domínio, qual é o IP do servidor onde o site está hospedado.

- **dig:** ferramenta especializada em fazer request contra servidores de DNS
- Usando WSL, instalar o **dig** `sudo apt-get update` e `sudo apt-get install dnsutils`
- Executar o comando para verificar o DNS: `dig alxtab.com.br A`
- Executar o comando para verificar o DNS com a mensagem adicionada no servidor da Vercel: `dig alxtab.com.br TXT` (Tipo de Registro TXT)

# Dia 13

### Status dos serviços

- Vercel Status: https://www.vercel-status.com/
- GitHub Status: https://www.githubstatus.com/

# Dia 14

## Estrutura das pastas

### Sites para desenhar

- https://tree.nathanfriend.com/
- https://ascii-tree-generator.com/

### Desenho

```
📦 root
┣ 📂 pages
┃ ┗ 📜 index.js
┣ 📂 models
┃ ┣ 📜 user.js
┃ ┣ 📜 content.js
┃ ┗ 📜 password.js
┣ 📂 infra
┃ ┗ 📜 database.js
┃ ┣ 📂 migrations
┃ ┣ 📂 provisioning
┃ ┃ ┣ 📂 staging
┃ ┃ ┣ 📂 production
┣ 📂 tests
```

### Dicas de atalhos para desenhar estrutura das pastas

```
Raiz: :package: → 📦
Diretório fechado: :file_folder: → 📁
Diretório aberto: :open_file_folder: → 📂
Arquivo: :scroll: → 📜

Use o padrão :nome_do_emoji: nas Issues do GitHub que ele converte automaticamente.

Caracteres para desenhar a estrutura (usando Alt Codes):
Linha vertical: Alt + 179 → │
Ramificação: Alt + 195 → ├
Canto final: Alt + 192 → └
Estender linhas: Alt 196 → ─
```

# Dia 15
