if (document.querySelector('#vk__messages')) {
  try {
    VK.Widgets.CommunityMessages('vk__messages', 'ID', {
      disableButtonTooltip: '1',
      welcomeScreen: '0',
    });
  } catch (e) {
    /**/
  }
}

let chatCollection = {
  elChatCollection: document.querySelectorAll('.chat-collection'),

  showHide() {
    let _that = this;

    this.elChatCollection.forEach((index, i) => {
      let btnCollection = index.querySelector('.chat-collection__footer');
      let content = index.querySelector('.chat-collection__content');

      if (btnCollection) {
        btnCollection.querySelector('.open').onclick = () => {
          _that.deleteCallBack(i);

          index.classList.add('open');
          content.style.height = _that.getHeightContents(i) + 'px';
        };

        btnCollection.querySelector('.close').onclick = () => {
          index.classList.remove('open');
          content.style.height = '';
        };
      }
    });
  },

  addLinkToPage() {
    this.elChatCollection.forEach(index => {
      let url = index.querySelectorAll('.whatsapp a[href]');

      url.forEach((index) => {
        let urlValue = index.getAttribute('href');

        if (urlValue) {
          let textMessage = encodeURI('&text=Меня интересует: ' + window.location.origin + window.location.pathname + '\n\nВаше сообщение: ');

          urlValue = urlValue.replace(/&text=.*/i, textMessage);

          index.setAttribute('href', urlValue);
        }
      });
    });
  },

  replaceLink() {
    if (this.isMobile) {
      this.elChatCollection.forEach(index => {
        let el = index.querySelector('.viber a[href]');
        let getUrl = el.getAttribute('href');

        if (getUrl.search('search_value') !== -1) {
          el.setAttribute('href', 'viber://chat?number=phone');
        }
      });
    }
  },

  showHideVK() {
    let _that = this;

    this.elChatCollection.forEach((index, i) => {
      // [style*="background: none;"] - отсутствует, когда внутри фрейма ничего нет
      let vk = index.querySelector('#vk__messages[style*="background: none;"]');

      if (vk) {
        let isShow = +vk.querySelector('iframe').getAttribute('width').replace('px', '') > 320;

        if (isShow) {
          vk.classList.add('shown-0'); // .shown-0 – use vk
          index.classList.add('open');
          index.querySelector('.chat-collection__content').style.height = _that.getHeightContents(i) + 'px';
        } else {
          vk.classList.remove('shown-0');
        }
      }
    });
  },

  disabledChatVK() {
    let listDisallowBrowser = ['Safari', ' Opera'];
    let vk = this.elChatCollection[0];
    if (vk) vk = this.elChatCollection[0].querySelector('#vk__messages');

    if (vk && listDisallowBrowser.indexOf(this.getBrowser().browserName) !== -1) {
      // TODO: Почистить метод от этого
      vk.closest('.vk').querySelector('a[href]').style.display = '';
      vk.remove();

      return true;
    } else {
      return false;
    }
  },

  deleteCallBack(i) {
    if (!window.Calltouch) {
      let el = this.elChatCollection[i].querySelector('.phone');

      if (el) el.remove();
    }
  },

  getHeightContents(i) {
    let fullHeight = 0;

    this.elChatCollection[i].querySelectorAll('.chat-collection__link').forEach(index => {
      let fullHeightEl = index.offsetHeight + +getComputedStyle(index).marginTop.replace('px', '');

      if (fullHeight > 0) {
        fullHeight += fullHeightEl;
      } else {
        fullHeight = fullHeightEl;
      }
    });

    return fullHeight;
  },

  getBrowser() {
    let ua = navigator.userAgent;

    let browserName = function () {
      if (ua.search(/Edge/) > -1) return 'EDGE';
      if (ua.search(/Firefox/) > -1) return 'Firefox';
      if (ua.search(/Opera/) > -1) return 'Opera';
      if (ua.search(/OPR/) > -1) return 'OperaWebkit';
      if (ua.search(/YaBrowser/) > -1) return 'Ya.Browser';
      if (ua.search(/Chrome/) > -1) return 'Chrome';
      if (ua.search(/Safari/) > -1) return 'Safari';
    }();

    let version;

    switch (browserName) {
      case 'EDGE':
        version = (ua.split('Edge')[1]).split('/')[1];
        break;
      case 'Firefox':
        version = ua.split('Firefox/')[1];
        break;
      case 'Opera':
        version = ua.split('Version/')[1];
        break;
      case 'OperaWebkit':
        browserName = 'Opera';
        version = ua.split('OPR/')[1];
        break;
      case 'Ya.Browser':
        version = (ua.split('YaBrowser/')[1]).split(' ')[0];
        break;
      case 'Chrome':
        version = (ua.split('Chrome/')[1]).split(' ')[0];
        break;
      case 'Safari':
        version = (ua.split('Version/')[1]).split(' ')[0];
        break;
    }

    return {
      'browserName': browserName,
      'version': version,
    };
  },

  isMobile() {
    return (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
  },
};

chatCollection.showHide();
chatCollection.addLinkToPage();
chatCollection.replaceLink();

if (!chatCollection.disabledChatVK()) {
  setInterval(function () {
    chatCollection.showHideVK();
  }, 120);
}
