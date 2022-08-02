# SOLID com typescript

O princípio do projeto é para criação de botões de compartilhamento para Twitter, Facebook e LinkeIn.

O HTML inicial já tem os três botões e uma classe associado a eles.

O próximo passo é criar uma classe `ShareButton` e utilizá-lo para adicionar o evento de clique no botão para compartilhar uma URL.

`index.html`
```html
  <body>
    <button class="btn-twitter">Twitter</button>
    <button class="btn-facebook">Facebook</button>
    <button class="btn-linkedin">LinkedIn</button>
    <script type="module" src="/src/index.ts"></script>
  </body>
```

## Criação da class ShareButton

`ShareButton.ts`
```ts
export default class ShareButton {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  bind(clazz: string, socialNetwork: string) {
    let link: string;
    if (socialNetwork === "twitter") {
      link = `https://twitter.com/share?url=${this.url}`;
    }
    if (socialNetwork === "facebook") {
      link = `http://www.facebook.com/sharer.php?u=${this.url}`;
    }
    if (socialNetwork === "linkedin") {
      link = `http://www.linkedin.com/shareArticle?url=${this.url}`;
    }
    const elements: any = document.querySelectorAll(clazz);
    for (const element of elements) {
      element.addEventListener("click", () => window.open(link))
    }
  }
}
```

`ìndex.ts`
```ts
import ShareButton from './ShareButton';

const shareButton = new ShareButton("https://www.youtube.com/rodrigobranas");
shareButton.bind('.btn-twitter', 'twitter');
shareButton.bind('.btn-facebook', 'facebook');
shareButton.bind('.btn-linkedin', 'linkedin');

```

Neste ponto o projeto já está funcionando e clicando nos botões é aberto o link de compartilhamento.

Vamos refletir e enumerar alguns problemas:
- A classe pode ser alterada? Sim, posso incluir novas redes sociais
- A classe também faz alterações no DOM além de associar a URL
- A classe depende de um objeto concreto (DOM) e não de uma abstração

Então temos motivos para fazer alterações. E isso nos leva a refatorações.

## S - Single Responsability Principle

Para aplicar parte do conceito `S` do `SOLID`, vamos refatorar o desenvolvimento, criando uma nova classe `EventHandler` que será responsável por associar o evento de `click` a um botão.

`EventHandler.ts`
```ts
export default class EventHandler {
  addEventListenerToClass(clazz: string, event: string, fn: any) {
    const elements: any = document.querySelectorAll(clazz);
    for (const element of elements) {
      element.addEventListener(event, fn);
    }
  }
}
```

`ShareButton.ts`
```ts
import EventHandler from "./EventHandler";

export default class ShareButton {
  url: string;
  eventHandler: EventHandler;

  constructor(url: string) {
    this.url = url;
    this.eventHandler = new EventHandler();
  }

  bind(clazz: string, socialNetwork: string) {
    let link: string;
    if (socialNetwork === "twitter") {
      link = `https://twitter.com/share?url=${this.url}`;
    }
    if (socialNetwork === "facebook") {
      link = `http://www.facebook.com/sharer.php?u=${this.url}`;
    }
    if (socialNetwork === "linkedin") {
      link = `http://www.linkedin.com/shareArticle?url=${this.url}`;
    }
    this.eventHandler.addEventListenerToClass(clazz, "click", () => window.open(link));
  }
}
```

Dessa forma reduzimos aprimoramos a ideia de responsabilidade única, embora não seja completa e a refatoração ainda fira outros princípios. Mas agora temos um classe com uma única responsabilidade de adicionar um `listener` de evento por classe.

Vamos continuar o estudo agora pensando no segundo princípio.

## O - Open-Closed Principle

Este princípio diz que uma classe deve estar aberto para extensão mas fechado para modificações. Um indício que uma classe está aberta para modificações é quando temos muitos `ifs` com diferentes estados no código. Isso gera um código com grau de manutenção maior, pois o que funciona não gerará problemas novos.

Neste projeto, vamos criar uma classe abstrata de `ShareButton` que terá um método para criar link que deve ser implementado por qualquer classe que a estenda, isso deixará a classe fechada para modificações por conta de novas redes sociais.

Além disso criaremos 3 classes que extenderão a class `AbstractShareButton`, uma para cada rede social. Cada classe deverá implementar o método `createLink`.

Claro que isso impactará no nosso arquivo `index.ts`, vamos criar uma instância de cada uma das classes novas.

`AbstractShareButton.ts`
```ts
import EventHandler from "./EventHandler";

export default abstract class AbstractShareButton {
  url: string;
  clazz: string;
  eventHandler: EventHandler;

  constructor(clazz: string, url: string) {
    this.url = url;
    this.clazz = clazz;
    this.eventHandler = new EventHandler();
  }

  abstract createLink(): string;

  bind() {
    let link: string = this.createLink();
    this.eventHandler.addEventListenerToClass(this.clazz, "click", () => window.open(link));
  }
}
```

`ShareButtonTwitter.ts`
```ts
import AbstractShareButton from "./AbstractShareButton";

export default class ShareButtonTwitter extends AbstractShareButton {
  constructor(clazz: string, url: string) {
    super(clazz, url);
  }

  createLink(): string {
    return `https://twitter.com/share?url=${this.url}`;
  }
}
```

`ShareButtonFacebook.ts`
```ts
import AbstractShareButton from "./AbstractShareButton";

export default class ShareButtonFacebook extends AbstractShareButton {
  constructor(clazz: string, url: string) {
    super(clazz, url);
  }

  createLink(): string {
    return `http://www.facebook.com/sharer.php?u=${this.url}`;
  }
}
```

`ShareButtonLinkedIn.ts`
```ts
import AbstractShareButton from "./AbstractShareButton";

export default class ShareButtonLinkedIn extends AbstractShareButton {
  constructor(clazz: string, url: string) {
    super(clazz, url);
  }

  createLink(): string {
    return `http://www.linkedin.com/shareArticle?url=${this.url}`;
  }
}
```

`index.ts`
```ts
import ShareButtonTwitter from './ShareButtonTwitter';
import ShareButtonFacebook from './ShareButtonFacebook';
import ShareButtonLinkedIn from './ShareButtonLinkedIn';

const twitter = new ShareButtonTwitter('.btn-twitter', "https://www.youtube.com/rodrigobranas");
twitter.bind();
const facebook = new ShareButtonFacebook('.btn-facebook', "https://www.youtube.com/rodrigobranas");
facebook.bind();
const linkedIn = new ShareButtonLinkedIn('.btn-linkedin', "https://www.youtube.com/rodrigobranas");
linkedIn.bind();
```

Após essas modificações, caso precisemos adicionar novas redes sociais, pasta criar uma nova classe para ela, sem precisar alterar alguma existente com `ifs` a mais.

Um paralelo para esse princípio são os plugins no VSCode, a gente não altera o código do editor mas podemos extendê-los instalando os plugins.

## L - Liskov Substitution Principle

Uma classe derivada deve ser substituível por sua classe base. Pensando no nosso projeto, caso criemos um botão `Print` e extender `AbstractShareButton`, a implementação do método `createLink` não fará muito sentido pois impressão não é compartilhável via link e isso quebra esse princípio. Pois uma subclasse quebra o comportamento esperado segundo o princípio de substituição de Liskov.
Para este princípio, não vamos mostrar uma solução mas o problema.

`index.html`
```html
  <body>
    <button class="btn-twitter">Twitter</button>
    <button class="btn-facebook">Facebook</button>
    <button class="btn-linkedin">LinkedIn</button>
    <button class="btn-print">Print</button>
    <script type="module" src="/src/index.ts"></script>
  </body>
```
`ShareButtonPrint.ts`
```ts
import AbstractShareButton from "./AbstractShareButton";

export default class ShareButtonPrint extends AbstractShareButton {
  constructor(clazz: string, url: string) {
    super(clazz, url);
  }

  createLink(): string {
    throw new Error('Unsupported Method Exception');
  }
}
```

`index.ts`
```ts
import ShareButtonTwitter from './ShareButtonTwitter';
import ShareButtonFacebook from './ShareButtonFacebook';
import ShareButtonLinkedIn from './ShareButtonLinkedIn';
import ShareButtonPrint from './ShareButtonPrint';

const twitter = new ShareButtonTwitter('.btn-twitter', "https://www.youtube.com/rodrigobranas");
twitter.bind();
const facebook = new ShareButtonFacebook('.btn-facebook', "https://www.youtube.com/rodrigobranas");
facebook.bind();
const linkedIn = new ShareButtonLinkedIn('.btn-linkedin', "https://www.youtube.com/rodrigobranas");
linkedIn.bind();
const print = new ShareButtonPrint('.btn-print', "https://www.youtube.com/rodrigobranas");
print.bind();
```

Uma subclasse não pode quebrar as expectativas definidas no contrato da superclasse. E claramente no projeto este principio está sendo quebrado.

## I - Interface Segregation Principle

Este princípio é bem importante para poder satisfazer os outros principios pois reforça a ideia de programar orientado a contratos. Para o `SRP` ele induz a decomposição de classe. Para o `OCP`, induz a derivação de interfaces. Para o `LSP`força repensar a hierarquia de classes/interfaces.

Para aplicar esse princípio nesse projeto, vamos criar uma nova classe abstrata chamada `AbstractLinkShareButton` que terá o atual método `createLink`. E remodelaremos a classe abstrata `AbstractShareButton` removendo o método `createLink` e criando o novo método abstrato `createAction`. Uma ação será uma função que pode ser tanto abrir um link como imprimir a página. Também removemos a propriedade `url` da classe `AbstractShareButton`.

A partir disso podemos refatorar as classes do Twitter, Facebook e LinkedIn para extender essa nova classe abstrata.

E a classe Print, podemos implementar o método `createAction` e remover a `url` do constructor, já que não é mais necessário.

No `index.ts`, apenas não informamos mais a url para o botão `print`.

`AbstractShareButton.ts`
```ts
import EventHandler from "./EventHandler";

export default abstract class AbstractShareButton {
  clazz: string;
  eventHandler: EventHandler;

  constructor(clazz: string) {
    this.clazz = clazz;
    this.eventHandler = new EventHandler();
  }

  abstract createAction(): string;

  bind() {
    let action: any = this.createAction();
    this.eventHandler.addEventListenerToClass(this.clazz, "click", action);
  }
}
```

`AbstractLinkShareButton.ts`
```ts
import AbstractShareButton from "./AbstractShareButton";

export default abstract class AbstractLinkShareButton extends AbstractShareButton {
  url: string;

  constructor(clazz: string, url: string) {
    super(clazz);
    this.url = url;
  }

  abstract createLink(): string;

  createAction(): any {
    const link = this.createLink();
    return () => window.open(link);
  }

}
```

`ShareButtonPrint.ts`
```ts
import AbstractShareButton from "./AbstractShareButton";

export default class ShareButtonPrint extends AbstractShareButton {
  constructor(clazz: string) {
    super(clazz);
  }

  createAction(): any {
    return () => window.print();
  }
}
```

`ShareButton[Twitter, Facebook, LinkedIn].ts`
```ts
import AbstractLinkShareButton from "./AbstractLinkShareButton";

export default class ShareButton* extends AbstractLinkShareButton {
```

`index.ts`
```ts
import AbstractShareButton from './AbstractShareButton';
import ShareButtonTwitter from './ShareButtonTwitter';
import ShareButtonFacebook from './ShareButtonFacebook';
import ShareButtonLinkedIn from './ShareButtonLinkedIn';
import ShareButtonPrint from './ShareButtonPrint';

const twitter: AbstractShareButton = new ShareButtonTwitter('.btn-twitter', "https://www.youtube.com/rodrigobranas");
twitter.bind();
const facebook: AbstractShareButton = new ShareButtonFacebook('.btn-facebook', "https://www.youtube.com/rodrigobranas");
facebook.bind();
const linkedIn: AbstractShareButton = new ShareButtonLinkedIn('.btn-linkedin', "https://www.youtube.com/rodrigobranas");
linkedIn.bind();
const print: AbstractShareButton = new ShareButtonPrint('.btn-print');
print.bind();
```

Com isso também resolvemos o problema inserido para demonstrar o problema do `LSP`.