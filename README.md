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