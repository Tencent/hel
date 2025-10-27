export default {
  setCookie(name, value, option) {
    const longTime = 10;
    // const path = '; path=/';
    const val = option && option.raw ? value : encodeURIComponent(value);
    let cookie = `${encodeURIComponent(name)}=${val}`;

    if (option) {
      const { days, hour, path, domain } = option;
      if (days) {
        const date = new Date();
        const ms = days * 24 * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        cookie += `; expires=${date.toGMTString()}`;
      } else if (hour) {
        const date = new Date();
        const ms = hour * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        cookie += `; expires=${date.toGMTString()}`;
      } else {
        const date = new Date();
        const ms = longTime * 365 * 24 * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        cookie += `; expires=${date.toGMTString()}`;
      }

      if (option.path) cookie += `; path=${path}`;
      if (option.domain) cookie += `; domain=${domain}`;
      if (option.secure) cookie += '; true';
    }

    document.cookie = cookie;
  },

  getCookie(name) {
    const nameEQ = `${encodeURIComponent(name)}=`;
    const ca = document.cookie.split(';');
    const caLen = ca.length;
    for (let i = 0; i < caLen; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }

    return null;
  },

  deleteCookie(name) {
    this.setCookie(name, '', { hour: -1 });
  },
};
