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
