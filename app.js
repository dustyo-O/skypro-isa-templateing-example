const app = document.querySelector('.app');

function imageStringTemplate(imageData) {
  return `
  <article class="image">
    <div class="image__picture" style="background-image: url('${imageData.urls.thumb}');">

    </div>
    <footer class="image__footer">
      <div class="image__author">
        <img src="${imageData.user.profile_image.small}" class="image__author-avatar">
        <span class="image__author-name">${imageData.user.name}</span>
      </div>
      <p class="image__description">${imageData.description || imageData.alt_description || ''}</p>
      <span class="image__likes">${imageData.likes}<i class="fa fa-heart image__heart" aria-hidden="true"></i></span>
    </footer>
  </article>
  `;
}

function imageTemplate(imageData) {
  return {
    block: 'article',
    cls: 'image',
    content: [
      {
        block: 'div',
        cls: 'image__picture',
        attrs: { style: `background-image: url('${imageData.urls.thumb}');` }
      },
      {
        block: 'footer',
        cls: 'image__footer',
        content: [
          {
            block: 'div',
            cls: 'image__author',
            content: [
              {
                block: 'img',
                cls: 'image__author-avatar',
                attrs: { src: imageData.user.profile_image.small }
              },
              {
                block: 'span',
                cls: 'image__author-name',
                content: imageData.user.name,
              }
            ]
          },
          { block: 'p', cls: 'image__description', content: imageData.description || imageData.alt_description },
          {
            block: 'span',
            cls: 'image__likes',
            content: [
              imageData.likes,
              {
                block: 'i',
                cls: ['fa', 'fa-heart', 'image__heart'],
                attrs: {
                  'aria-hidden': true
                }
              }
            ]
          }
        ]
      }
    ]
  }
}

function templateEngine(block) {
  if ((block === undefined) || (block === null) || (block === false)) {
    return document.createTextNode('');
  }

  if ((typeof block === 'string') || (typeof block === 'number') || (block === true)) {
    return document.createTextNode(String(block));
  }

  if (Array.isArray(block)) {
    const fragment = document.createDocumentFragment();

    block.forEach(contentItem => {
      const el = templateEngine(contentItem);

      fragment.appendChild(el);
    });

    return fragment;
  }

  const element = document.createElement(block.block);

  [].concat(block.cls).filter(Boolean).forEach(
    className => element.classList.add(className)
  );

  if (block.attrs) {
    Object.keys(block.attrs).forEach(key => {
      element.setAttribute(key, block.attrs[key]);
    });
  }

  element.appendChild(templateEngine(block.content));

  return element;
}

function templateStringEngine(block) {
  const element = `<${block.block}>${templateStringEngine(block.content)}</${block.block}>`;

  return element;
}

(async() => {
  const response = await fetch('https://api.unsplash.com/photos/?client_id=OphEZ-1zQSA2REeTRj6diooRQ-loTuLqRQZC_yarL7I');

  const data = await response.json();

  console.log(data);

  data.forEach(imageData => {
    const html = imageStringTemplate(imageData);

    app.insertAdjacentHTML('beforeend', html);
  });

  data.forEach(imageData => {
    const snippet = imageTemplate(imageData);

    console.log(snippet);

    const node = templateEngine(snippet);
    app.appendChild(node);
  });
})();
